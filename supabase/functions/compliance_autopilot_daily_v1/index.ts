import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  tenantId?: string;
  runDate?: string;
  dryRun?: boolean;
}

interface ComplianceSettings {
  tenant_id: string;
  iqama_reminder_days: number[];
  saudization_green_threshold: number;
  saudization_yellow_threshold: number;
  letter_footer_en?: string;
  letter_footer_ar?: string;
}

interface Employee {
  id: string;
  employee_no: string;
  full_name_en: string;
  full_name_ar: string;
  iqama_expiry: string;
  is_saudi: boolean;
  employment_status: string;
  company_id: string;
}

interface ComplianceRun {
  tenant_id: string;
  run_date: string;
  iqama_tasks: number;
  saudization_tasks: number;
  total_employees_checked: number;
  status: string;
  metadata: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    console.log('=== Compliance Autopilot Daily v1 Starting ===');
    
    const { tenantId, runDate, dryRun = false }: RequestBody = await req.json().catch(() => ({}));
    
    // Resolve tenant ID
    let resolvedTenantId = tenantId;
    if (!resolvedTenantId) {
      console.log('No tenantId provided, attempting to resolve via get_demo_tenant_id()');
      const { data: demoTenant } = await supabase.rpc('get_demo_tenant_id').single();
      if (demoTenant) {
        resolvedTenantId = demoTenant;
        console.log('Resolved demo tenant:', resolvedTenantId);
      } else {
        throw new Error('No tenantId provided and could not resolve demo tenant');
      }
    }

    const processDate = runDate ? new Date(runDate) : new Date();
    const processDateStr = processDate.toISOString().split('T')[0];
    
    console.log('Processing for tenant:', resolvedTenantId, 'on date:', processDateStr, 'dryRun:', dryRun);

    // Load or create compliance settings
    let settings = await loadComplianceSettings(supabase, resolvedTenantId);
    if (!settings) {
      console.log('No settings found, creating defaults');
      settings = await createDefaultSettings(supabase, resolvedTenantId);
    }

    let iqamaTasks = 0;
    let saudizationTasks = 0;
    let totalEmployeesChecked = 0;
    const runMetadata: Record<string, any> = {
      reminders_generated: [],
      letters_created: [],
      saudization_analysis: null
    };

    // Process Iqama reminders
    console.log('Processing Iqama reminders for windows:', settings.iqama_reminder_days);
    
    for (const reminderDays of settings.iqama_reminder_days) {
      const expiryThreshold = new Date(processDate);
      expiryThreshold.setDate(expiryThreshold.getDate() + reminderDays);
      
      console.log(`Checking for expiries within ${reminderDays} days (by ${expiryThreshold.toISOString().split('T')[0]})`);
      
      // Get employees with expiring Iqamas
      const { data: employees, error: employeeError } = await supabase
        .from('hr_employees')
        .select('id, employee_no, full_name_en, full_name_ar, iqama_expiry, is_saudi, employment_status, company_id')
        .eq('company_id', resolvedTenantId)
        .eq('is_saudi', false)
        .eq('employment_status', 'active')
        .not('iqama_expiry', 'is', null)
        .gte('iqama_expiry', processDateStr)
        .lte('iqama_expiry', expiryThreshold.toISOString().split('T')[0]);

      if (employeeError) {
        console.error('Error fetching employees:', employeeError);
        continue;
      }

      console.log(`Found ${employees?.length || 0} employees with Iqama expiring in ${reminderDays} days`);
      totalEmployeesChecked += employees?.length || 0;

      if (employees && employees.length > 0) {
        for (const employee of employees) {
          if (dryRun) {
            console.log(`[DRY RUN] Would process employee: ${employee.employee_no} - ${employee.full_name_en}`);
            continue;
          }

          console.log(`Processing employee: ${employee.employee_no} - ${employee.full_name_en}`);
          
          // Generate letters and create task
          const letterPaths = await generateComplianceLetters(supabase, resolvedTenantId, employee, settings);
          const taskId = await createComplianceTask(supabase, resolvedTenantId, employee, reminderDays, letterPaths);
          
          iqamaTasks++;
          runMetadata.reminders_generated.push({
            employee_id: employee.id,
            employee_no: employee.employee_no,
            reminder_days: reminderDays,
            expiry_date: employee.iqama_expiry,
            task_id: taskId,
            letters_count: letterPaths.length
          });
          runMetadata.letters_created.push(...letterPaths);
        }
      }
    }

    // Process Saudization risk analysis
    console.log('Processing Saudization risk analysis');
    const saudizationRisk = await analyzeSaudizationRisk(supabase, resolvedTenantId, processDate, settings);
    
    if (saudizationRisk.needsTask) {
      if (!dryRun) {
        await createSaudizationTask(supabase, resolvedTenantId, saudizationRisk);
        saudizationTasks++;
      } else {
        console.log('[DRY RUN] Would create Saudization risk task:', saudizationRisk.title);
      }
    }
    
    runMetadata.saudization_analysis = saudizationRisk;

    // Record compliance run
    const runData: ComplianceRun = {
      tenant_id: resolvedTenantId,
      run_date: processDateStr,
      iqama_tasks: iqamaTasks,
      saudization_tasks: saudizationTasks,
      total_employees_checked: totalEmployeesChecked,
      status: dryRun ? 'dry_run' : 'completed',
      metadata: runMetadata
    };

    if (!dryRun) {
      const { error: runError } = await supabase
        .from('compliance_runs')
        .insert(runData);
      
      if (runError) {
        console.error('Error recording compliance run:', runError);
      } else {
        console.log('Compliance run recorded successfully');
      }
    }

    console.log('=== Compliance Autopilot Daily v1 Complete ===');
    
    return new Response(
      JSON.stringify({
        success: true,
        tenant_id: resolvedTenantId,
        run_date: processDateStr,
        dry_run: dryRun,
        results: {
          iqama_tasks: iqamaTasks,
          saudization_tasks: saudizationTasks,
          total_employees_checked: totalEmployeesChecked,
          letters_generated: runMetadata.letters_created.length
        },
        metadata: runMetadata
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in compliance autopilot:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      }
    );
  }
});

async function loadComplianceSettings(supabase: any, tenantId: string): Promise<ComplianceSettings | null> {
  const { data, error } = await supabase
    .from('compliance_settings')
    .select('*')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  if (error) {
    console.error('Error loading compliance settings:', error);
    return null;
  }

  return data;
}

async function createDefaultSettings(supabase: any, tenantId: string): Promise<ComplianceSettings> {
  const defaultSettings = {
    tenant_id: tenantId,
    iqama_reminder_days: [60, 30, 7],
    saudization_green_threshold: 60,
    saudization_yellow_threshold: 40,
    letter_footer_en: 'This is an automated reminder from AqlHR system. Please ensure timely renewal of your Iqama.',
    letter_footer_ar: 'هذا تنبيه آلي من نظام AqlHR. يرجى التأكد من تجديد الإقامة في الوقت المناسب.'
  };

  const { data, error } = await supabase
    .from('compliance_settings')
    .insert(defaultSettings)
    .select()
    .single();

  if (error) {
    console.error('Error creating default settings:', error);
    throw new Error('Failed to create default compliance settings');
  }

  return data;
}

async function generateComplianceLetters(
  supabase: any, 
  tenantId: string, 
  employee: Employee, 
  settings: ComplianceSettings
): Promise<string[]> {
  const letterPaths: string[] = [];

  // Get company data
  const { data: company } = await supabase
    .from('companies')
    .select('name, company_name_arabic')
    .eq('id', tenantId)
    .single();

  if (!company) {
    console.error('Company not found for tenant:', tenantId);
    return letterPaths;
  }

  // Generate both Arabic and English letters
  for (const language of ['ar', 'en'] as const) {
    try {
      const { data, error } = await supabase.functions.invoke('compliance-letter-generator', {
        body: {
          tenant_id: tenantId,
          employee: {
            id: employee.id,
            full_name_en: employee.full_name_en,
            full_name_ar: employee.full_name_ar || employee.full_name_en,
            employee_no: employee.employee_no,
            iqama_expiry: employee.iqama_expiry
          },
          company: {
            name: company.name,
            name_ar: company.company_name_arabic
          },
          language,
          letter_type: 'iqama_renewal',
          footer: language === 'ar' ? settings.letter_footer_ar : settings.letter_footer_en
        }
      });

      if (error) {
        console.error(`Error generating ${language} letter:`, error);
        continue;
      }

      if (data?.success && data?.storage_path) {
        letterPaths.push(data.storage_path);
        
        // Record letter in database
        await supabase
          .from('compliance_letters')
          .insert({
            tenant_id: tenantId,
            employee_id: employee.id,
            type: 'iqama_renewal',
            lang: language,
            expiry_date: employee.iqama_expiry,
            reminder_day: calculateReminderDays(employee.iqama_expiry),
            storage_path: data.storage_path
          });
      }
    } catch (letterError) {
      console.error(`Failed to generate ${language} letter for employee ${employee.employee_no}:`, letterError);
    }
  }

  return letterPaths;
}

async function createComplianceTask(
  supabase: any,
  tenantId: string,
  employee: Employee,
  reminderDays: number,
  letterPaths: string[]
): Promise<string> {
  const expiryDate = new Date(employee.iqama_expiry);
  const dueDate = new Date(expiryDate);
  dueDate.setDate(dueDate.getDate() - 3); // Due 3 days before expiry

  let priority = 'low';
  if (reminderDays <= 7) priority = 'urgent';
  else if (reminderDays <= 30) priority = 'high';
  else if (reminderDays <= 60) priority = 'medium';

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      tenant_id: tenantId,
      module: 'compliance',
      title: `Iqama renewal – ${employee.full_name_en}`,
      description: `Employee ${employee.employee_no} (${employee.full_name_en}) has an Iqama expiring on ${employee.iqama_expiry}. Please ensure timely renewal.`,
      due_at: dueDate.toISOString(),
      priority,
      owner_role: 'hr_manager',
      metadata: {
        source: 'compliance_autopilot',
        employee_id: employee.id,
        employee_no: employee.employee_no,
        expiry_date: employee.iqama_expiry,
        reminder_days: reminderDays,
        letters: letterPaths,
        letter_count: letterPaths.length
      }
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating compliance task:', error);
    throw new Error('Failed to create compliance task');
  }

  return data.id;
}

async function analyzeSaudizationRisk(
  supabase: any,
  tenantId: string,
  processDate: Date,
  settings: ComplianceSettings
): Promise<any> {
  // Get current Saudization status
  const { data: currentStatus } = await supabase.rpc('saudization_color_v1', {
    p_tenant: tenantId
  });

  if (!currentStatus || currentStatus.length === 0) {
    return { needsTask: false, reason: 'No current status available' };
  }

  const current = currentStatus[0];
  console.log('Current Saudization status:', current);

  // Get historical data for trend analysis (last 30 days)
  const thirtyDaysAgo = new Date(processDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: historicalData } = await supabase
    .from('kpi_snapshots')
    .select('snap_date, saudization_rate')
    .eq('company_id', tenantId)
    .gte('snap_date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('snap_date', { ascending: true });

  if (!historicalData || historicalData.length < 7) {
    console.log('Insufficient historical data for trend analysis');
    return { 
      needsTask: false, 
      reason: 'Insufficient historical data',
      current_rate: current.rate,
      current_color: current.color
    };
  }

  // Calculate trend
  const rates = historicalData.map(d => d.saudization_rate);
  const trend = calculateTrend(rates);
  const projectedRate = current.rate + (trend * 30); // Project 30 days ahead

  console.log(`Current rate: ${current.rate}%, Trend: ${trend}/day, Projected: ${projectedRate}%`);

  // Determine projected color
  let projectedColor = 'green';
  if (projectedRate < settings.saudization_yellow_threshold) {
    projectedColor = 'red';
  } else if (projectedRate < settings.saudization_green_threshold) {
    projectedColor = 'yellow';
  }

  const needsTask = current.color !== projectedColor && 
                   (projectedColor === 'yellow' || projectedColor === 'red');

  let title = '';
  let description = '';
  let priority = 'medium';

  if (needsTask) {
    title = `Protect Nitaqat: projected drop to ${projectedColor} in 30 days`;
    priority = projectedColor === 'red' ? 'urgent' : 'high';
    
    if (projectedColor === 'red') {
      description = 'Critical: Saudization rate trending toward red status. Recommend: 1) Immediate hiring freeze for non-Saudi positions, 2) Expedite Saudi candidate interviews, 3) Review internal transfer opportunities, 4) Consider upgrading Saudi employees to management roles.';
    } else {
      description = 'Warning: Saudization rate trending toward yellow status. Recommend: 1) Prioritize Saudi candidates in recruitment, 2) Review current hiring pipeline, 3) Plan for potential adjustments in workforce composition.';
    }
  }

  return {
    needsTask,
    title,
    description,
    priority,
    current_rate: current.rate,
    current_color: current.color,
    projected_rate: projectedRate,
    projected_color: projectedColor,
    trend_per_day: trend,
    historical_points: historicalData.length
  };
}

async function createSaudizationTask(supabase: any, tenantId: string, riskData: any): Promise<string> {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      tenant_id: tenantId,
      module: 'compliance',
      title: riskData.title,
      description: riskData.description,
      due_at: dueDate.toISOString(),
      priority: riskData.priority,
      owner_role: 'hr_manager',
      metadata: {
        source: 'compliance_autopilot',
        task_type: 'saudization_risk',
        current_rate: riskData.current_rate,
        current_color: riskData.current_color,
        projected_rate: riskData.projected_rate,
        projected_color: riskData.projected_color,
        trend_analysis: {
          trend_per_day: riskData.trend_per_day,
          historical_points: riskData.historical_points
        }
      }
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating Saudization task:', error);
    throw new Error('Failed to create Saudization task');
  }

  return data.id;
}

function calculateTrend(rates: number[]): number {
  if (rates.length < 2) return 0;
  
  // Simple linear regression to calculate trend
  const n = rates.length;
  const xSum = (n * (n - 1)) / 2; // Sum of indices 0 to n-1
  const ySum = rates.reduce((sum, rate) => sum + rate, 0);
  const xySum = rates.reduce((sum, rate, index) => sum + (rate * index), 0);
  const xxSum = rates.reduce((sum, _, index) => sum + (index * index), 0);
  
  const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
  return isNaN(slope) ? 0 : slope;
}

function calculateReminderDays(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}