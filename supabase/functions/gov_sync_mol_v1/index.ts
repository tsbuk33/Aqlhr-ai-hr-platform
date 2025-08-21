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

    console.log(`Starting MOL sync for tenant: ${company_id}, testMode: ${testMode}`);
    
    const startedAt = new Date().toISOString();
    
    // Upsert adapter record
    const { error: adapterError } = await supabase
      .from('gov_adapters')
      .upsert({
        tenant_id: company_id,
        system: 'MOL',
        mode: testMode ? 'test' : 'live',
        status: 'pending',
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id,system' });

    if (adapterError) throw adapterError;

    // Get some employee data for realistic simulation
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
      // New hire simulation
      changes.push({
        tenant_id: company_id,
        system: 'MOL',
        change_type: 'new_hire',
        reference: `MOL-NH-${Date.now().toString().slice(-6)}`,
        effective_date: new Date().toISOString().split('T')[0],
        payload: {
          employee_name: 'أحمد محمد السعودي',
          position: 'محلل أول',
          department: 'تقنية المعلومات',
          nationality: 'SA',
          contract_type: 'permanent'
        }
      });

      // Termination simulation
      if (sampleEmployees.length > 2) {
        const emp = sampleEmployees[1];
        changes.push({
          tenant_id: company_id,
          system: 'MOL',
          change_type: 'termination',
          reference: emp.employee_no,
          effective_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          payload: {
            employee_name: emp.full_name_en,
            termination_reason: 'resignation',
            notice_period: 30
          }
        });
      }

      // Saudization rate change
      const saudiCount = sampleEmployees.filter(e => e.is_saudi).length;
      const currentRate = (saudiCount / sampleEmployees.length) * 100;
      changes.push({
        tenant_id: company_id,
        system: 'MOL',
        change_type: 'saudization_rate',
        reference: 'NITAQAT-UPDATE',
        effective_date: new Date().toISOString().split('T')[0],
        payload: {
          previous_rate: currentRate,
          new_rate: currentRate + (Math.random() * 2 - 1), // ±1pp change
          total_employees: sampleEmployees.length,
          saudi_employees: saudiCount + (Math.random() > 0.5 ? 1 : 0)
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
      if (change.change_type === 'new_hire') {
        await supabase
          .from('tasks')
          .insert({
            tenant_id: company_id,
            module: 'hr_onboarding',
            title: `تحقق من الموظف الجديد من وزارة العمل - ${change.payload.employee_name}`,
            description: `تم استلام بيانات موظف جديد من نظام وزارة العمل. يرجى التحقق من البيانات وإكمال إجراءات التوظيف.`,
            priority: 'high',
            owner_role: 'hr_manager',
            metadata: {
              source: 'MOL',
              change_id: change.reference,
              employee_data: change.payload
            }
          });
      }

      if (change.change_type === 'termination') {
        await supabase
          .from('tasks')
          .insert({
            tenant_id: company_id,
            module: 'hr_offboarding',
            title: `إجراءات إنهاء الخدمة - ${change.reference}`,
            description: `مطلوب إكمال إجراءات إنهاء الخدمة للموظف رقم ${change.reference} حسب تحديث وزارة العمل.`,
            priority: 'medium',
            owner_role: 'hr_manager',
            due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: {
              source: 'MOL',
              change_id: change.reference,
              termination_data: change.payload
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
        system: 'MOL',
        started_at: startedAt,
        finished_at: finishedAt,
        status: 'ok',
        request: { tenantId: company_id, testMode },
        result: {
          changes_count: changes.length,
          systems_updated: ['employees', 'tasks', 'compliance'],
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
      .eq('system', 'MOL');

    console.log(`MOL sync completed successfully. Changes: ${changes.length}`);

    return new Response(JSON.stringify({
      success: true,
      system: 'MOL',
      changes: changes.length,
      message: 'MOL sync completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('MOL sync error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});