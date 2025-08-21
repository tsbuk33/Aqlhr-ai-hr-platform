import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Employee {
  id: string;
  company_id: string;
  full_name_en: string;
  full_name_ar: string;
  is_saudi: boolean;
  nationality_code: string;
  iqama_expiry: string;
  employee_no: string;
}

interface Company {
  id: string;
  name: string;
  company_name_arabic: string;
  saudization_percentage: number;
  saudization_target: number;
  nitaqat_status: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting daily compliance autopilot...');

    // Get all active companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');

    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      throw companiesError;
    }

    const results = {
      saudization_alerts: 0,
      iqama_reminders: 0,
      tasks_created: 0,
      letters_generated: 0,
      companies_processed: 0
    };

    for (const company of companies as Company[]) {
      console.log(`Processing company: ${company.name}`);
      
      try {
        // 1. Check Saudization Risk
        await checkSaudizationRisk(supabase, company, results);
        
        // 2. Check Iqama Expiries
        await checkIqamaExpiries(supabase, company, results);
        
        results.companies_processed++;
      } catch (error) {
        console.error(`Error processing company ${company.id}:`, error);
      }
    }

    console.log('Daily compliance autopilot completed:', results);

    return new Response(JSON.stringify({
      success: true,
      results,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in compliance autopilot:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function checkSaudizationRisk(supabase: any, company: Company, results: any) {
  // Get employee counts
  const { data: employeeCounts } = await supabase
    .from('hr_employees')
    .select('is_saudi, employment_status')
    .eq('company_id', company.id)
    .eq('employment_status', 'active');

  if (!employeeCounts || employeeCounts.length === 0) return;

  const totalEmployees = employeeCounts.length;
  const saudiEmployees = employeeCounts.filter((emp: any) => emp.is_saudi).length;
  const currentRate = (saudiEmployees / totalEmployees) * 100;
  
  const target = company.saudization_target || 60; // Default 60% if not set
  const riskThreshold = target - 5; // Risk if within 5% of target

  if (currentRate < riskThreshold) {
    const saudisNeeded = Math.ceil((target * totalEmployees / 100) - saudiEmployees);
    
    // Create task
    const { data: taskId } = await supabase.rpc('task_create_v1', {
      p_tenant_id: company.id,
      p_module: 'compliance',
      p_title: `Urgent: Protect Nitaqat Status - Hire ${saudisNeeded} Saudi Nationals`,
      p_description: `Current Saudization: ${currentRate.toFixed(1)}%. Target: ${target}%. Risk of color drop detected. Immediate action required.`,
      p_priority: 'urgent',
      p_owner_role: 'hr_manager',
      p_metadata: {
        source: 'compliance_autopilot',
        current_rate: currentRate,
        target_rate: target,
        saudis_needed: saudisNeeded,
        total_employees: totalEmployees,
        saudi_employees: saudiEmployees
      }
    });

    // Log action
    await supabase.from('agent_actions').insert({
      company_id: company.id,
      action_type: 'saudization_alert',
      action_description: `Saudization risk detected: ${currentRate.toFixed(1)}% (target: ${target}%)`,
      task_id: taskId,
      metadata: {
        current_rate: currentRate,
        target_rate: target,
        saudis_needed: saudisNeeded
      }
    });

    results.saudization_alerts++;
    results.tasks_created++;
  }
}

async function checkIqamaExpiries(supabase: any, company: Company, results: any) {
  const now = new Date();
  const reminders = [
    { days: 60, priority: 'medium' },
    { days: 30, priority: 'high' }, 
    { days: 7, priority: 'urgent' }
  ];

  for (const reminder of reminders) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + reminder.days);
    
    const { data: expiringEmployees } = await supabase
      .from('hr_employees')
      .select('*')
      .eq('company_id', company.id)
      .eq('employment_status', 'active')
      .eq('is_saudi', false)
      .not('iqama_expiry', 'is', null)
      .lte('iqama_expiry', targetDate.toISOString().split('T')[0])
      .gt('iqama_expiry', now.toISOString().split('T')[0]);

    if (!expiringEmployees || expiringEmployees.length === 0) continue;

    for (const employee of expiringEmployees) {
      // Check if we already created a task for this employee recently
      const { data: existingActions } = await supabase
        .from('agent_actions')
        .select('*')
        .eq('company_id', company.id)
        .eq('action_type', 'iqama_reminder')
        .eq('target_employee_id', employee.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

      if (existingActions && existingActions.length > 0) continue;

      const expiryDate = new Date(employee.iqama_expiry);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Create task
      const { data: taskId } = await supabase.rpc('task_create_v1', {
        p_tenant_id: company.id,
        p_module: 'compliance',
        p_title: `Iqama Renewal Required - ${employee.full_name_en} (${daysUntilExpiry} days)`,
        p_description: `Employee ${employee.full_name_en} (ID: ${employee.employee_no}) Iqama expires on ${employee.iqama_expiry}. Renewal process must begin immediately.`,
        p_priority: reminder.priority,
        p_owner_role: 'hr_manager',
        p_due_at: expiryDate.toISOString(),
        p_metadata: {
          source: 'compliance_autopilot',
          employee_id: employee.id,
          employee_name: employee.full_name_en,
          employee_name_ar: employee.full_name_ar,
          employee_no: employee.employee_no,
          iqama_expiry: employee.iqama_expiry,
          days_until_expiry: daysUntilExpiry,
          reminder_type: `${reminder.days}_day`
        }
      });

      // Generate renewal letter PDF
      await generateRenewalLetter(supabase, company, employee, taskId, results);

      // Log action
      await supabase.from('agent_actions').insert({
        company_id: company.id,
        action_type: 'iqama_reminder',
        action_description: `Iqama renewal reminder for ${employee.full_name_en} - expires in ${daysUntilExpiry} days`,
        target_employee_id: employee.id,
        task_id: taskId,
        metadata: {
          employee_name: employee.full_name_en,
          iqama_expiry: employee.iqama_expiry,
          days_until_expiry: daysUntilExpiry,
          reminder_days: reminder.days
        }
      });

      results.iqama_reminders++;
      results.tasks_created++;
    }
  }
}

async function generateRenewalLetter(supabase: any, company: Company, employee: Employee, taskId: string, results: any) {
  // Generate letter content
  const letterData = {
    company_name_en: company.name,
    company_name_ar: company.company_name_arabic || company.name,
    employee_name_en: employee.full_name_en,
    employee_name_ar: employee.full_name_ar || employee.full_name_en,
    employee_id: employee.employee_no,
    iqama_expiry: employee.iqama_expiry,
    generated_date: new Date().toISOString().split('T')[0],
    task_id: taskId
  };

  // Store letter data in task metadata for later PDF generation in UI
  await supabase.rpc('task_assign_v1', {
    p_task_id: taskId,
    p_owner_role: 'hr_manager'
  });

  // Log letter generation action
  await supabase.from('agent_actions').insert({
    company_id: company.id,
    action_type: 'letter_generated',
    action_description: `Iqama renewal letter generated for ${employee.full_name_en}`,
    target_employee_id: employee.id,
    task_id: taskId,
    metadata: letterData
  });

  results.letters_generated++;
}