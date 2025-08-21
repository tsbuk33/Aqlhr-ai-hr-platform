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

    console.log(`Starting GOSI sync for tenant: ${company_id}, testMode: ${testMode}`);
    
    const startedAt = new Date().toISOString();
    
    // Upsert adapter record
    const { error: adapterError } = await supabase
      .from('gov_adapters')
      .upsert({
        tenant_id: company_id,
        system: 'GOSI',
        mode: testMode ? 'test' : 'live',
        status: 'pending',
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id,system' });

    if (adapterError) throw adapterError;

    // Get some payroll data for realistic simulation
    const { data: payrollData } = await supabase
      .from('payroll')
      .select('employee_id, basic_salary, gosi_employee, gosi_employer')
      .eq('company_id', company_id)
      .limit(10);

    const { data: employees } = await supabase
      .from('hr_employees')
      .select('employee_no, full_name_en, is_saudi')
      .eq('company_id', company_id)
      .eq('employment_status', 'active')
      .limit(10);

    // Generate deterministic changes
    const changes = [];
    const sampleEmployees = employees || [];
    
    if (sampleEmployees.length > 0) {
      // New hire GOSI registration
      changes.push({
        tenant_id: company_id,
        system: 'GOSI',
        change_type: 'new_hire',
        reference: `GOSI-${Date.now().toString().slice(-6)}`,
        effective_date: new Date().toISOString().split('T')[0],
        payload: {
          employee_name: 'محمد عبدالله القحطاني',
          gosi_number: `${Math.floor(Math.random() * 10000000000)}`,
          basic_salary: 8500,
          employee_contribution: 850,
          employer_contribution: 850,
          coverage_type: 'full'
        }
      });

      // Wage update for existing employee
      if (payrollData && payrollData.length > 0) {
        const payroll = payrollData[0];
        changes.push({
          tenant_id: company_id,
          system: 'GOSI',
          change_type: 'contract_update',
          reference: sampleEmployees[0]?.employee_no || 'EMP-001',
          effective_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          payload: {
            previous_salary: payroll.basic_salary,
            new_salary: Number(payroll.basic_salary) + 1000,
            previous_gosi_employee: payroll.gosi_employee,
            new_gosi_employee: (Number(payroll.basic_salary) + 1000) * 0.1,
            previous_gosi_employer: payroll.gosi_employer,
            new_gosi_employer: (Number(payroll.basic_salary) + 1000) * 0.1
          }
        });
      }

      // Termination processing
      if (sampleEmployees.length > 2) {
        const emp = sampleEmployees[2];
        changes.push({
          tenant_id: company_id,
          system: 'GOSI',
          change_type: 'termination',
          reference: emp.employee_no,
          effective_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          payload: {
            employee_name: emp.full_name_en,
            final_settlement_amount: 15000,
            gosi_final_contribution: 1500,
            end_of_service_benefits: 25000,
            termination_type: 'resignation'
          }
        });
      }
    }

    // Insert changes
    for (const change of changes) {
      const { error: changeError } = await supabase
        .from('gov_changes')
        .insert(change);
      
      if (changeError) {
        console.error('Error inserting change:', changeError);
      }

      // Update payroll records for wage changes
      if (change.change_type === 'contract_update' && change.payload.new_salary) {
        const { data: existingPayroll } = await supabase
          .from('payroll')
          .select('id')
          .eq('company_id', company_id)
          .limit(1);

        if (existingPayroll && existingPayroll.length > 0) {
          await supabase
            .from('payroll')
            .update({
              basic_salary: change.payload.new_salary,
              gosi_employee: change.payload.new_gosi_employee,
              gosi_employer: change.payload.new_gosi_employer
            })
            .eq('id', existingPayroll[0].id);
        }
      }

      // Create tasks for complex changes
      if (change.change_type === 'termination') {
        await supabase
          .from('tasks')
          .insert({
            tenant_id: company_id,
            module: 'payroll_gosi',
            title: `تسوية التأمينات الاجتماعية - ${change.reference}`,
            description: `مطلوب إكمال إجراءات التسوية النهائية للتأمينات الاجتماعية للموظف ${change.reference}.`,
            priority: 'high',
            owner_role: 'payroll_manager',
            due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: {
              source: 'GOSI',
              change_id: change.reference,
              settlement_data: change.payload
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
        system: 'GOSI',
        started_at: startedAt,
        finished_at: finishedAt,
        status: 'ok',
        request: { tenantId: company_id, testMode },
        result: {
          changes_count: changes.length,
          systems_updated: ['payroll', 'gosi_contributions', 'tasks'],
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
      .eq('system', 'GOSI');

    console.log(`GOSI sync completed successfully. Changes: ${changes.length}`);

    return new Response(JSON.stringify({
      success: true,
      system: 'GOSI',
      changes: changes.length,
      message: 'GOSI sync completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('GOSI sync error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});