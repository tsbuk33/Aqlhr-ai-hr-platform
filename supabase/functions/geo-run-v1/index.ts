import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1?dts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get auth header
    const authorization = req.headers.get('Authorization');
    if (authorization) {
      supabaseClient.auth.getUser(authorization.replace('Bearer ', ''));
    }

    const { case_id, action } = await req.json();

    if (!case_id) {
      throw new Error('case_id is required');
    }

    console.log('Running GEO compute for case:', case_id, 'action:', action);

    // Call the GEO compute function
    const { error: computeError } = await supabaseClient.rpc('geo_compute_case_v1', {
      p_case_id: case_id
    });

    if (computeError) {
      console.error('GEO compute error:', computeError);
      throw computeError;
    }

    // Get the results
    const { data: scores, error: scoresError } = await supabaseClient
      .from('dx_scores')
      .select('*')
      .eq('case_id', case_id)
      .eq('module', 'GEO_ENGAGEMENT')
      .single();

    if (scoresError) {
      console.error('Error fetching GEO scores:', scoresError);
      throw scoresError;
    }

    // Get active pulses
    const { data: pulses, error: pulsesError } = await supabaseClient
      .from('geo_pulses')
      .select(`
        *,
        geo_reactions(*)
      `)
      .eq('status', 'ready')
      .order('created_at', { ascending: false })
      .limit(10);

    if (pulsesError) {
      console.error('Error fetching pulses:', pulsesError);
    }

    // If action is to send pulses, update their status
    if (action === 'send_pulses' && pulses && pulses.length > 0) {
      const pulseIds = pulses.map(p => p.id);
      
      const { error: updateError } = await supabaseClient
        .from('geo_pulses')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString() 
        })
        .in('id', pulseIds);

      if (updateError) {
        console.error('Error updating pulse status:', updateError);
      } else {
        console.log('Sent', pulseIds.length, 'pulses');
      }
    }

    console.log('GEO compute completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        score: scores?.score || 0,
        details: scores?.details || {},
        pulses: pulses || [],
        computed_at: scores?.computed_at,
        action_result: action === 'send_pulses' ? `Sent ${pulses?.length || 0} pulses` : null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in geo-run-v1:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});