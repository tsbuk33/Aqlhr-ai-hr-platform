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
  iqama_expiry: string;
  employee_no: string;
  employment_status: string;
}

interface Company {
  id: string;
  name: string;
  company_name_arabic: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting daily compliance autopilot v1...');

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
      companies_processed: 0,
      errors: []
    };

    for (const company of companies as Company[]) {
      console.log(`Processing company: ${company.name}`);
      
      try {
        // Log start of processing
        await supabase.from('compliance_runs').insert({
          tenant_id: company.id,
          status: 'ok',
          stats: { processing: true }
        });

        // 1. Check Saudization Risk
        await checkSaudizationRisk(supabase, company, results);
        
        // 2. Check Iqama Expiries
        await checkIqamaExpiries(supabase, company, results);
        
        results.companies_processed++;

        // Log completion
        await supabase.from('compliance_runs').insert({
          tenant_id: company.id,
          status: 'ok',
          stats: {
            saudization_alerts: results.saudization_alerts,
            iqama_reminders: results.iqama_reminders,
            tasks_created: results.tasks_created
          }
        });

      } catch (error) {
        console.error(`Error processing company ${company.id}:`, error);
        results.errors.push({ company_id: company.id, error: error.message });

        // Log error
        await supabase.from('compliance_runs').insert({
          tenant_id: company.id,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log('Daily compliance autopilot v1 completed:', results);

    return new Response(JSON.stringify({
      success: true,
      results,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in compliance autopilot v1:', error);
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
  try {
    // Get saudization color using new function
    const { data: saudizationData } = await supabase.rpc('saudization_color_v1', {
      p_tenant: company.id
    });

    if (!saudizationData || saudizationData.length === 0) return;

    const { color, rate } = saudizationData[0];
    
    // Get compliance settings
    const { data: settings } = await supabase
      .from('compliance_settings')
      .select('*')
      .eq('tenant_id', company.id)
      .maybeSingle();

    const greenThreshold = settings?.saudization_green_threshold || 60;
    const yellowThreshold = settings?.saudization_yellow_threshold || 40;

    // Create alert if in yellow or red zone
    if (color === 'yellow' || color === 'red') {
      const urgency = color === 'red' ? 'urgent' : 'high';
      const requiredRate = color === 'red' ? yellowThreshold : greenThreshold;
      
      // Get current employee counts for calculations
      const { data: employeeCounts } = await supabase
        .from('hr_employees')
        .select('is_saudi, employment_status')
        .eq('company_id', company.id)
        .eq('employment_status', 'active');

      let saudisNeeded = 0;
      if (employeeCounts && employeeCounts.length > 0) {
        const totalEmployees = employeeCounts.length;
        const currentSaudis = employeeCounts.filter((emp: any) => emp.is_saudi).length;
        const requiredSaudis = Math.ceil((requiredRate * totalEmployees) / 100);
        saudisNeeded = Math.max(0, requiredSaudis - currentSaudis);
      }

      // Create task
      const { data: taskId } = await supabase.rpc('task_create_v1', {
        p_tenant_id: company.id,
        p_module: 'compliance',
        p_title: `${color.toUpperCase()} Alert: Saudization Risk - Action Required`,
        p_description: `Current Saudization: ${rate.toFixed(1)}%. Status: ${color.toUpperCase()}. ${saudisNeeded > 0 ? `Hire ${saudisNeeded} Saudi nationals to improve status.` : 'Review workforce composition.'}`,
        p_priority: urgency,
        p_owner_role: 'hr_manager',
        p_metadata: {
          source: 'compliance_autopilot',
          saudization_color: color,
          current_rate: rate,
          threshold: requiredRate,
          saudis_needed: saudisNeeded,
          alert_type: 'saudization_risk'
        }
      });

      results.saudization_alerts++;
      results.tasks_created++;

      console.log(`Saudization ${color} alert created for company ${company.id}`);
    }
  } catch (error) {
    console.error(`Error checking saudization risk for company ${company.id}:`, error);
  }
}

async function checkIqamaExpiries(supabase: any, company: Company, results: any) {
  try {
    // Get compliance settings for reminder days
    const { data: settings } = await supabase
      .from('compliance_settings')
      .select('*')
      .eq('tenant_id', company.id)
      .maybeSingle();

    const reminderDays = settings?.iqama_reminders || [60, 30, 7];
    const now = new Date();

    for (const days of reminderDays) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() + days);
      
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
        // Check if we already created a task for this employee and reminder period
        const { data: existingTasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('tenant_id', company.id)
          .eq('module', 'compliance')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .like('metadata->employee_id', `%${employee.id}%`);

        if (existingTasks && existingTasks.length > 0) continue;

        const expiryDate = new Date(employee.iqama_expiry);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let priority = 'medium';
        if (daysUntilExpiry <= 7) priority = 'urgent';
        else if (daysUntilExpiry <= 30) priority = 'high';

        // Create task
        const { data: taskId } = await supabase.rpc('task_create_v1', {
          p_tenant_id: company.id,
          p_module: 'compliance',
          p_title: `Iqama Renewal: ${employee.full_name_en} (${daysUntilExpiry} days)`,
          p_description: `Employee ${employee.full_name_en} (ID: ${employee.employee_no}) Iqama expires on ${employee.iqama_expiry}. ${daysUntilExpiry <= 30 ? 'URGENT: ' : ''}Renewal process must ${daysUntilExpiry <= 7 ? 'be completed immediately' : 'begin now'}.`,
          p_priority: priority,
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
            reminder_days: days,
            alert_type: 'iqama_expiry'
          }
        });

        // Generate and store renewal letter
        await generateAndStoreRenewalLetter(supabase, company, employee, taskId, days, results);

        results.iqama_reminders++;
        results.tasks_created++;

        console.log(`Iqama renewal task created for employee ${employee.employee_no}, expires in ${daysUntilExpiry} days`);
        // PDPL Compliance: Never log national IDs or sensitive data, only employee numbers
      }
    }
  } catch (error) {
    console.error(`Error checking iqama expiries for company ${company.id}:`, error);
  }
}

async function generateAndStoreRenewalLetter(
  supabase: any, 
  company: Company, 
  employee: Employee, 
  taskId: string, 
  reminderDays: number,
  results: any
) {
  try {
    // Generate letter data (basic text format for now, PDF generation happens in UI)
    const letterFooter = await getLetterFooter(supabase, company.id);
    
    const letterData = {
      company_name_en: company.name,
      company_name_ar: company.company_name_arabic || company.name,
      employee_name_en: employee.full_name_en,
      employee_name_ar: employee.full_name_ar || employee.full_name_en,
      employee_id: employee.employee_no,
      iqama_expiry: employee.iqama_expiry,
      generated_date: new Date().toISOString().split('T')[0],
      task_id: taskId,
      reminder_days: reminderDays,
      footer_en: letterFooter.en,
      footer_ar: letterFooter.ar
    };

    // Store letter metadata in compliance_letters table
    const storagePath = `${company.id}/${employee.id}/${taskId}_iqama_renewal_${reminderDays}d.json`;
    
    await supabase.from('compliance_letters').insert({
      tenant_id: company.id,
      employee_id: employee.id,
      type: 'iqama_renewal',
      lang: 'en', // Default language, can be changed in UI
      expiry_date: employee.iqama_expiry,
      reminder_day: reminderDays,
      storage_path: storagePath,
      created_by: null // System generated
    });

    results.letters_generated++;

    console.log(`Renewal letter metadata stored for employee ${employee.employee_no}`);
    // PDPL Compliance: Never log IDs or personal data, only employee numbers and task references
  } catch (error) {
    console.error(`Error generating renewal letter for employee ${employee.id}:`, error);
  }
}

async function getLetterFooter(supabase: any, companyId: string) {
  try {
    const { data: settings } = await supabase
      .from('compliance_settings')
      .select('letter_footer_en, letter_footer_ar')
      .eq('tenant_id', companyId)
      .maybeSingle();

    return {
      en: settings?.letter_footer_en || 'Generated by AqlHR – PDPL compliant. No national IDs stored in logs.',
      ar: settings?.letter_footer_ar || 'تم إنشاء الخطاب بواسطة عقل للموارد البشرية – متوافق مع نظام حماية البيانات الشخصية.'
    };
  } catch (error) {
    return {
      en: 'Generated by AqlHR – PDPL compliant. No national IDs stored in logs.',
      ar: 'تم إنشاء الخطاب بواسطة عقل للموارد البشرية – متوافق مع نظام حماية البيانات الشخصية.'
    };
  }
}