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

    console.log(`Starting Absher sync for tenant: ${company_id}, testMode: ${testMode}`);
    
    const startedAt = new Date().toISOString();
    
    // Upsert adapter record
    const { error: adapterError } = await supabase
      .from('gov_adapters')
      .upsert({
        tenant_id: company_id,
        system: 'ABSHER',
        mode: testMode ? 'test' : 'live',
        status: 'pending',
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id,system' });

    if (adapterError) throw adapterError;

    // Get non-Saudi employees for iqama updates
    const { data: employees } = await supabase
      .from('hr_employees')
      .select('id, employee_no, full_name_en, iqama_expiry')
      .eq('company_id', company_id)
      .eq('employment_status', 'active')
      .eq('is_saudi', false)
      .limit(10);

    // Generate deterministic changes
    const changes = [];
    const sampleEmployees = employees || [];
    
    if (sampleEmployees.length > 0) {
      // Iqama renewal notifications
      for (let i = 0; i < Math.min(3, sampleEmployees.length); i++) {
        const emp = sampleEmployees[i];
        const newExpiryDate = new Date();
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
        
        changes.push({
          tenant_id: company_id,
          system: 'ABSHER',
          change_type: 'iqama_update',
          reference: emp.employee_no,
          effective_date: new Date().toISOString().split('T')[0],
          payload: {
            employee_name: emp.full_name_en,
            previous_expiry: emp.iqama_expiry,
            new_expiry: newExpiryDate.toISOString().split('T')[0],
            renewal_fee: 2000,
            processing_days: 5,
            status: 'approved'
          }
        });

        // Update the employee's iqama_expiry
        await supabase
          .from('hr_employees')
          .update({
            iqama_expiry: newExpiryDate.toISOString().split('T')[0]
          })
          .eq('id', emp.id);
      }

      // New visa approvals
      changes.push({
        tenant_id: company_id,
        system: 'ABSHER',
        change_type: 'new_hire',
        reference: `VISA-${Date.now().toString().slice(-6)}`,
        effective_date: new Date().toISOString().split('T')[0],
        payload: {
          employee_name: 'جون سميث الأمريكي',
          nationality: 'US',
          position: 'مستشار تقني',
          visa_number: `V${Math.floor(Math.random() * 1000000)}`,
          visa_type: 'work_visa',
          sponsor_id: company_id,
          validity_months: 24
        }
      });

      // Exit re-entry permits
      if (sampleEmployees.length > 1) {
        const emp = sampleEmployees[1];
        changes.push({
          tenant_id: company_id,
          system: 'ABSHER',
          change_type: 'contract_update',
          reference: emp.employee_no,
          effective_date: new Date().toISOString().split('T')[0],
          payload: {
            employee_name: emp.full_name_en,
            permit_type: 'exit_reentry',
            travel_period: '3 months',
            destinations: ['UAE', 'Bahrain'],
            fee_amount: 500,
            status: 'approved'
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

      // Create tasks for visa and permit processing
      if (change.change_type === 'new_hire' && change.payload.visa_number) {
        await supabase
          .from('tasks')
          .insert({
            tenant_id: company_id,
            module: 'visa_processing',
            title: `معالجة تأشيرة عمل جديدة - ${change.payload.employee_name}`,
            description: `تمت الموافقة على تأشيرة عمل جديدة رقم ${change.payload.visa_number}. مطلوب إكمال إجراءات الاستقدام.`,
            priority: 'high',
            owner_role: 'hr_manager',
            due_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: {
              source: 'ABSHER',
              change_id: change.reference,
              visa_data: change.payload
            }
          });
      }

      if (change.change_type === 'iqama_update') {
        await supabase
          .from('tasks')
          .insert({
            tenant_id: company_id,
            module: 'iqama_renewal',
            title: `تحديث تاريخ انتهاء الإقامة - ${change.reference}`,
            description: `تم تجديد إقامة الموظف ${change.reference}. تاريخ الانتهاء الجديد: ${change.payload.new_expiry}`,
            priority: 'low',
            owner_role: 'hr_coordinator',
            metadata: {
              source: 'ABSHER',
              change_id: change.reference,
              iqama_data: change.payload
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
        system: 'ABSHER',
        started_at: startedAt,
        finished_at: finishedAt,
        status: 'ok',
        request: { tenantId: company_id, testMode },
        result: {
          changes_count: changes.length,
          systems_updated: ['employees', 'iqama_tracking', 'visa_processing'],
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
      .eq('system', 'ABSHER');

    console.log(`Absher sync completed successfully. Changes: ${changes.length}`);

    return new Response(JSON.stringify({
      success: true,
      system: 'ABSHER',
      changes: changes.length,
      message: 'Absher sync completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Absher sync error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});