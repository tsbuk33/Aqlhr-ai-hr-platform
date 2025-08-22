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

    const { case_id } = await req.json();

    if (!case_id) {
      throw new Error('case_id is required');
    }

    console.log('Running LEO compute for case:', case_id);

    // Call the LEO compute function
    const { error: computeError } = await supabaseClient.rpc('leo_compute_case_v1', {
      p_case_id: case_id
    });

    if (computeError) {
      console.error('LEO compute error:', computeError);
      throw computeError;
    }

    // Get the results
    const { data: scores, error: scoresError } = await supabaseClient
      .from('dx_scores')
      .select('*')
      .eq('case_id', case_id)
      .eq('module', 'LEO_SKILLS')
      .single();

    if (scoresError) {
      console.error('Error fetching LEO scores:', scoresError);
      throw scoresError;
    }

    // Get learning paths
    const { data: paths, error: pathsError } = await supabaseClient
      .from('leo_paths')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (pathsError) {
      console.error('Error fetching learning paths:', pathsError);
    }

    console.log('LEO compute completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        score: scores?.score || 0,
        details: scores?.details || {},
        paths: paths || [],
        computed_at: scores?.computed_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in leo-run-v1:', error);
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