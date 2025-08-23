import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { system, endpoint, tenantId, payload = {} } = await req.json();
    
    console.log(`Government API Simulator called: ${system}/${endpoint} for tenant ${tenantId}`);

    // Validate required parameters
    if (!system || !endpoint || !tenantId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: system, endpoint, tenantId' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call the simulation function
    const { data, error } = await supabase.rpc('simulate_gov_api_call', {
      p_tenant_id: tenantId,
      p_system: system,
      p_endpoint: endpoint,
      p_payload: payload
    });

    if (error) {
      console.error('Simulation error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Add simulated delay based on config
    const { data: config } = await supabase
      .from('gov_simulator_configs')
      .select('response_delay_ms')
      .eq('tenant_id', tenantId)
      .eq('system', system)
      .single();

    const delay = config?.response_delay_ms || 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    console.log('Simulation response generated:', { 
      system, 
      endpoint, 
      success: data?.status === 'success' 
    });

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Government Simulator Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});