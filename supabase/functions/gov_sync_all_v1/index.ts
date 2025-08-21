import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { tenantId, testMode = true } = await req.json();
    
    // Get authenticated user's company_id if no tenantId provided
    const authHeader = req.headers.get('Authorization');
    let company_id = tenantId;
    
    if (!company_id && authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('company_id')
          .eq('user_id', user.id)
          .single();
        company_id = userRole?.company_id;
      }
    }

    if (!company_id) {
      throw new Error('No tenant ID available');
    }

    console.log(`Starting comprehensive sync for tenant: ${company_id}, testMode: ${testMode}`);
    
    const systems = ['MOL', 'QIWA', 'GOSI', 'ABSHER'];
    const results = {};
    const errors = [];
    
    // Sequential sync to avoid overwhelming the system
    for (const system of systems) {
      try {
        console.log(`Syncing ${system}...`);
        
        const functionName = `gov_sync_${system.toLowerCase()}_v1`;
        const { data: syncResult, error: syncError } = await supabase.functions.invoke(functionName, {
          body: { tenantId: company_id, testMode }
        });

        if (syncError) {
          console.error(`Error syncing ${system}:`, syncError);
          errors.push({ system, error: syncError.message });
          results[system] = { success: false, error: syncError.message };
        } else {
          console.log(`${system} sync completed:`, syncResult);
          results[system] = syncResult;
        }
        
        // Small delay between systems
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Exception syncing ${system}:`, error);
        errors.push({ system, error: error.message });
        results[system] = { success: false, error: error.message };
      }
    }

    // Get overall status
    const { data: adapterStatus } = await supabase
      .from('gov_adapters')
      .select('system, status, last_sync')
      .eq('tenant_id', company_id);

    const { data: recentChanges } = await supabase
      .from('gov_changes')
      .select('system, change_type, created_at')
      .eq('tenant_id', company_id)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: false });

    // Aggregate statistics
    const summary = {
      total_systems: systems.length,
      successful_syncs: Object.values(results).filter(r => r.success).length,
      failed_syncs: errors.length,
      total_changes: recentChanges?.length || 0,
      changes_by_system: {},
      sync_timestamp: new Date().toISOString(),
      adapter_status: adapterStatus || []
    };

    // Group changes by system
    if (recentChanges) {
      for (const change of recentChanges) {
        if (!summary.changes_by_system[change.system]) {
          summary.changes_by_system[change.system] = 0;
        }
        summary.changes_by_system[change.system]++;
      }
    }

    // Create summary task if there were significant changes
    if (summary.total_changes > 0) {
      await supabase
        .from('tasks')
        .insert({
          tenant_id: company_id,
          module: 'government_sync',
          title: `تحديث شامل من الأنظمة الحكومية`,
          description: `تم استلام ${summary.total_changes} تحديث من الأنظمة الحكومية (${Object.keys(summary.changes_by_system).join(', ')}). يرجى مراجعة التغييرات المطلوبة.`,
          priority: 'medium',
          owner_role: 'admin',
          metadata: {
            source: 'GOV_SYNC_ALL',
            sync_summary: summary,
            systems_synced: systems,
            errors: errors
          }
        });
    }

    console.log(`Comprehensive sync completed. Summary:`, summary);

    return new Response(JSON.stringify({
      success: errors.length === 0,
      summary,
      results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Synced ${summary.successful_syncs}/${summary.total_systems} systems successfully`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Comprehensive sync error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});