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

    console.log(`Starting QIWA sync for tenant: ${company_id}, testMode: ${testMode}`);
    
    const startedAt = new Date().toISOString();
    
    // Upsert adapter record
    const { error: adapterError } = await supabase
      .from('gov_adapters')
      .upsert({
        tenant_id: company_id,
        system: 'QIWA',
        mode: testMode ? 'test' : 'live',
        status: 'pending',
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id,system' });

    if (adapterError) throw adapterError;

    // Get some employee data for realistic simulation
    const { data: employees } = await supabase
      .from('hr_employees')
      .select('employee_no, full_name_en, is_saudi, nationality_code')
      .eq('company_id', company_id)
      .eq('employment_status', 'active')
      .limit(10);

    // Generate deterministic changes
    const changes = [];
    const sampleEmployees = employees || [];
    
    if (sampleEmployees.length > 0) {
      // New hire simulation
      changes.push({
        tenant_id: company_id,
        system: 'QIWA',
        change_type: 'new_hire',
        reference: `QW-${Date.now().toString().slice(-6)}`,
        effective_date: new Date().toISOString().split('T')[0],
        payload: {
          employee_name: 'فاطمة أحمد الزهراني',
          position: 'مطورة برمجيات',
          department: 'التطوير',
          nationality: 'SA',
          visa_type: 'citizen',
          qiwa_id: `QW${Math.floor(Math.random() * 1000000)}`
        }
      });

      // Contract update simulation
      if (sampleEmployees.length > 1) {
        const emp = sampleEmployees[0];
        changes.push({
          tenant_id: company_id,
          system: 'QIWA',
          change_type: 'contract_update',
          reference: emp.employee_no,
          effective_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          payload: {
            employee_name: emp.full_name_en,
            contract_changes: {
              salary_increase: 500,
              new_position: 'Senior Analyst',
              effective_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            approval_required: true
          }
        });
      }

      // Saudization compliance update
      const saudiCount = sampleEmployees.filter(e => e.is_saudi).length;
      const nonSaudiCount = sampleEmployees.filter(e => !e.is_saudi).length;
      changes.push({
        tenant_id: company_id,
        system: 'QIWA',
        change_type: 'saudization_rate',
        reference: 'QIWA-COMPLIANCE',
        effective_date: new Date().toISOString().split('T')[0],
        payload: {
          current_status: 'green',
          saudi_employees: saudiCount,
          non_saudi_employees: nonSaudiCount,
          compliance_score: 85 + Math.floor(Math.random() * 10),
          next_review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      });
    }

    // Insert changes
    for (const change of changes) {
      const { error: changeError } = await supabase
        .from('gov_changes')
        .insert(change);
      
      if (changeError) {
        console.error('Error inserting change:', changeError);
      }

      // Create tasks for actionable changes
      if (change.change_type === 'contract_update') {
        await supabase
          .from('tasks')
          .insert({
            tenant_id: company_id,
            module: 'hr_contracts',
            title: `مراجعة تحديث العقد - ${change.reference}`,
            description: `مطلوب مراجعة واعتماد تحديث العقد للموظف ${change.reference} حسب منصة قوى.`,
            priority: 'medium',
            owner_role: 'hr_manager',
            due_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: {
              source: 'QIWA',
              change_id: change.reference,
              contract_data: change.payload
            }
          });
      }
    }

    // Log the sync
    const finishedAt = new Date().toISOString();
    const { error: logError } = await supabase
      .from('gov_sync_logs')
      .insert({
        tenant_id: company_id,
        system: 'QIWA',
        started_at: startedAt,
        finished_at: finishedAt,
        status: 'ok',
        request: { tenantId: company_id, testMode },
        result: {
          changes_count: changes.length,
          systems_updated: ['employees', 'contracts', 'compliance'],
          processing_time_ms: new Date(finishedAt).getTime() - new Date(startedAt).getTime()
        }
      });

    if (logError) {
      console.error('Error logging sync:', logError);
    }

    // Update adapter status
    await supabase
      .from('gov_adapters')
      .update({
        status: 'connected',
        last_sync: finishedAt,
        updated_at: finishedAt
      })
      .eq('tenant_id', company_id)
      .eq('system', 'QIWA');

    console.log(`QIWA sync completed successfully. Changes: ${changes.length}`);

    return new Response(JSON.stringify({
      success: true,
      system: 'QIWA',
      changes: changes.length,
      message: 'QIWA sync completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('QIWA sync error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});