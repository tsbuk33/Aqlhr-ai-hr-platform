import { serve, createClient, corsHeaders } from "../_shared/deps.ts";

const corsResponse = () => new Response('ok', { headers: corsHeaders });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tenantId, testMode = false, jobId } = await req.json();

    // Get adapter configuration
    const { data: adapter, error: adapterError } = await supabase
      .from('gov_adapters')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('system', 'qiwa')
      .single();

    if (adapterError) {
      console.error('Adapter config error:', adapterError);
      throw new Error('Qiwa adapter not configured');
    }

    const isDemoMode = testMode || adapter.status === 'demo';
    let result;

    if (isDemoMode) {
      // DEMO mode: return realistic static data
      const demoResults = [
        { band: 'Green', saudization: 67.2, warnings: [], compliance_score: 95 },
        { band: 'Yellow', saudization: 45.8, warnings: ['Low saudization ratio'], compliance_score: 78 },
        { band: 'Red', saudization: 23.1, warnings: ['Critical saudization level', 'Missing documentation'], compliance_score: 45 }
      ];
      
      result = demoResults[Math.floor(Math.random() * demoResults.length)];
      
      console.log('Demo mode: returning simulated Qiwa status', result);
    } else {
      // LIVE mode: outline HTTPS call structure (stub)
      console.log('Live mode: would make HTTPS call to Qiwa API');
      
      // This would be the actual API call structure:
      /*
      const qiwaResponse = await fetch('https://qiwa-api-endpoint', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adapter.config?.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          establishment_id: adapter.config?.establishment_id,
          request_type: 'nitaqat_status'
        })
      });
      
      const qiwaData = await qiwaResponse.json();
      result = {
        band: qiwaData.nitaqat_color,
        saudization: qiwaData.saudization_percentage,
        warnings: qiwaData.warnings || [],
        compliance_score: qiwaData.compliance_score
      };
      */
      
      // For now, return demo data with live flag
      result = { 
        band: 'Green', 
        saudization: 67.2, 
        warnings: [], 
        compliance_score: 95,
        mode: 'live_stub'
      };
    }

    // Write government event
    await supabase
      .from('gov_events')
      .insert({
        tenant_id: tenantId,
        system: 'qiwa',
        kind: 'nitaqat_status',
        severity: result.band === 'Red' ? 'error' : (result.band === 'Yellow' ? 'warn' : 'info'),
        message: `Nitaqat status check: ${result.band} band (${result.saudization}% saudization)`,
        data: {
          band: result.band,
          saudization_percentage: result.saudization,
          warnings: result.warnings,
          compliance_score: result.compliance_score,
          job_id: jobId,
          demo_mode: isDemoMode
        }
      });

    // Update adapter last sync time
    await supabase
      .from('gov_adapters')
      .update({
        last_sync: new Date().toISOString(),
        last_error: null
      })
      .eq('tenant_id', tenantId)
      .eq('system', 'qiwa');

    // Create tasks for critical issues
    if (result.band === 'Red' || result.warnings.length > 0) {
      await supabase.rpc('task_create_v1', {
        p_tenant_id: tenantId,
        p_module: 'government',
        p_title: `Qiwa Compliance Issue - ${result.band} Band`,
        p_description: `Nitaqat status requires attention. Current saudization: ${result.saudization}%. Warnings: ${result.warnings.join(', ')}`,
        p_priority: result.band === 'Red' ? 'urgent' : 'high',
        p_metadata: {
          system: 'qiwa',
          band: result.band,
          saudization: result.saudization,
          warnings: result.warnings
        }
      });
    }

    console.log(`Qiwa sync completed for tenant ${tenantId}:`, result);

    return new Response(
      JSON.stringify({
        success: true,
        system: 'qiwa',
        result: result,
        demo_mode: isDemoMode,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Qiwa sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});