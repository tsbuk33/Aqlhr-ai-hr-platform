import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

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
    console.log('Starting daily dashboard snapshot cron job...');

    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get all company/tenant IDs that need daily snapshots
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id')
      .limit(1000); // Safety limit to prevent runaway queries

    if (companiesError) {
      throw new Error(`Failed to fetch companies: ${companiesError.message}`);
    }

    console.log(`Processing daily snapshots for ${companies?.length || 0} companies...`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process each company/tenant
    for (const company of companies || []) {
      try {
        console.log(`Computing KPIs for tenant: ${company.id}`);
        
        // Call the dashboard KPI computation function for today
        const { error: kpiError } = await supabase.rpc('dashboard_compute_kpis_asof_v1', {
          p_tenant: company.id,
          p_asof: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
        });

        if (kpiError) {
          throw new Error(`KPI computation failed for ${company.id}: ${kpiError.message}`);
        }

        successCount++;
        console.log(`✅ Successfully computed KPIs for tenant: ${company.id}`);

      } catch (error: any) {
        errorCount++;
        const errorMessage = `❌ Failed to compute KPIs for tenant ${company.id}: ${error.message}`;
        console.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    // Log final results
    console.log(`
    📊 Daily Dashboard Snapshot Cron Job Completed
    ✅ Successful: ${successCount}
    ❌ Failed: ${errorCount}
    📅 Date: ${new Date().toISOString()}
    `);

    if (errors.length > 0) {
      console.error('Errors encountered:', errors);
    }

    // Return comprehensive status
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      processed: {
        total: companies?.length || 0,
        successful: successCount,
        failed: errorCount
      },
      errors: errors.length > 0 ? errors : undefined
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('❌ Cron job failed:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString(),
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});