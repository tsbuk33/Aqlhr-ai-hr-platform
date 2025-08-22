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
      .eq('system', 'gosi')
      .single();

    if (adapterError) {
      console.error('Adapter config error:', adapterError);
      throw new Error('GOSI adapter not configured');
    }

    const isDemoMode = testMode || adapter.status === 'demo';
    let result;

    if (isDemoMode) {
      // DEMO mode: return last 3 months contributions with totals
      const currentMonth = new Date();
      const contributions = [];
      let totalEmployer = 0;
      let totalEmployee = 0;

      for (let i = 0; i < 3; i++) {
        const month = new Date(currentMonth);
        month.setMonth(month.getMonth() - i);
        
        const employerAmount = Math.floor(Math.random() * 50000) + 20000;
        const employeeAmount = Math.floor(Math.random() * 25000) + 10000;
        
        totalEmployer += employerAmount;
        totalEmployee += employeeAmount;
        
        contributions.push({
          month: month.toISOString().substring(0, 7), // YYYY-MM format
          employer_contribution: employerAmount,
          employee_contribution: employeeAmount,
          total_wages: employerAmount + employeeAmount + Math.floor(Math.random() * 100000),
          employees_count: Math.floor(Math.random() * 50) + 20,
          status: 'submitted'
        });
      }

      result = {
        contributions: contributions.reverse(),
        summary: {
          total_employer_contributions: totalEmployer,
          total_employee_contributions: totalEmployee,
          total_contributions: totalEmployer + totalEmployee,
          months_covered: 3
        }
      };

      // Create placeholder PDF documents for demo
      for (const contrib of contributions) {
        await supabase
          .from('gov_documents')
          .insert({
            tenant_id: tenantId,
            system: 'gosi',
            title: `GOSI Contribution Statement - ${contrib.month}`,
            storage_path: `/gosi/contributions/${tenantId}/${contrib.month}-statement.pdf`,
            meta: {
              month: contrib.month,
              total_amount: contrib.employer_contribution + contrib.employee_contribution,
              employees_count: contrib.employees_count,
              document_type: 'contribution_statement',
              demo_generated: true
            }
          });
      }

      console.log('Demo mode: returning simulated GOSI contributions', result);
    } else {
      // LIVE mode: outline HTTPS call structure (stub)
      console.log('Live mode: would make HTTPS call to GOSI API');
      
      // This would be the actual API call structure:
      /*
      const gosiResponse = await fetch('https://gosi-api-endpoint', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adapter.config?.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          establishment_number: adapter.config?.establishment_number,
          request_type: 'contribution_history',
          months: 3
        })
      });
      
      const gosiData = await gosiResponse.json();
      result = {
        contributions: gosiData.contributions,
        summary: gosiData.summary
      };
      */
      
      // For now, return demo data with live flag
      result = {
        contributions: [
          {
            month: '2024-06',
            employer_contribution: 45000,
            employee_contribution: 22500,
            total_wages: 180000,
            employees_count: 35,
            status: 'submitted'
          }
        ],
        summary: {
          total_employer_contributions: 45000,
          total_employee_contributions: 22500,
          total_contributions: 67500,
          months_covered: 1
        },
        mode: 'live_stub'
      };
    }

    // Write government event
    await supabase
      .from('gov_events')
      .insert({
        tenant_id: tenantId,
        system: 'gosi',
        kind: 'gosi_contrib',
        severity: 'info',
        message: `GOSI contributions sync completed. ${result.contributions.length} months retrieved. Total: ${result.summary.total_contributions} SAR`,
        data: {
          months_count: result.contributions.length,
          total_contributions: result.summary.total_contributions,
          latest_month: result.contributions[result.contributions.length - 1]?.month,
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
      .eq('system', 'gosi');

    console.log(`GOSI sync completed for tenant ${tenantId}:`, result.summary);

    return new Response(
      JSON.stringify({
        success: true,
        system: 'gosi',
        result: result,
        demo_mode: isDemoMode,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('GOSI sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});