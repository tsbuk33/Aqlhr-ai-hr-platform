import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GOSICalculationRequest {
  employee_id: string;
  salary: number;
  as_of_date?: string;
}

interface GOSIRateUpdateRequest {
  effective_date: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (path) {
      case 'calculate':
        return await calculateGOSIContribution(req, supabase);
      case 'preview':
        return await previewGOSICalculation(req, supabase);
      case 'update-rates':
        return await updateProgressiveRates(req, supabase);
      case 'employee-classification':
        return await getEmployeeClassification(req, supabase);
      case 'rate-progression-job':
        return await runRateProgressionJob(req, supabase);
      default:
        throw new Error('Invalid endpoint');
    }
  } catch (error) {
    console.error('Error in gosi-engine function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function calculateGOSIContribution(req: Request, supabase: any) {
  const { employee_id, salary, as_of_date = new Date().toISOString().split('T')[0] }: GOSICalculationRequest = await req.json();

  // Call database function to get rates
  const { data: rates, error: ratesError } = await supabase
    .rpc('calculate_gosi_rates', {
      p_employee_id: employee_id,
      p_as_of_date: as_of_date
    });

  if (ratesError) throw ratesError;

  const rate = rates[0];
  const employeeContribution = (salary * rate.employee_rate) / 100;
  const employerContribution = (salary * rate.employer_rate) / 100;
  const totalContribution = employeeContribution + employerContribution;

  // Log calculation for audit trail
  await supabase.from('audit_logs').insert({
    action: 'gosi_calculation',
    table_name: 'employee_gosi_config',
    record_id: employee_id,
    new_values: {
      salary,
      as_of_date,
      employee_rate: rate.employee_rate,
      employer_rate: rate.employer_rate,
      employee_contribution: employeeContribution,
      employer_contribution: employerContribution,
      system_type: rate.system_type
    }
  });

  console.log(`GOSI calculated for employee ${employee_id}: Employee: ${employeeContribution} SAR, Employer: ${employerContribution} SAR`);

  return new Response(
    JSON.stringify({
      success: true,
      employee_id,
      salary,
      as_of_date,
      system_type: rate.system_type,
      rates: {
        employee_rate: rate.employee_rate,
        employer_rate: rate.employer_rate
      },
      contributions: {
        employee: employeeContribution,
        employer: employerContribution,
        total: totalContribution
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function previewGOSICalculation(req: Request, supabase: any) {
  const requestBody = await req.json();
  const company_id = requestBody.company_id;
  
  // Validate company_id is a valid UUID
  if (!company_id || typeof company_id !== 'string') {
    throw new Error('Valid company_id is required');
  }
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(company_id)) {
    throw new Error('company_id must be a valid UUID format');
  }

  // Get all employees with their GOSI configurations
  const { data: employees, error: empError } = await supabase
    .from('employees')
    .select(`
      id,
      employee_number,
      first_name,
      last_name,
      salary,
      is_saudi,
      hire_date,
      employee_gosi_config (
        gosi_system_type,
        nationality,
        current_employee_rate,
        current_employer_rate
      )
    `)
    .eq('company_id', company_id)
    .eq('status', 'active');

  if (empError) throw empError;

  const gosiSummary = employees.map(emp => {
    const config = emp.employee_gosi_config?.[0];
    const salary = emp.salary || 0;
    const employeeContribution = config ? (salary * config.current_employee_rate) / 100 : 0;
    const employerContribution = config ? (salary * config.current_employer_rate) / 100 : 0;

    return {
      employee_id: emp.id,
      employee_number: emp.employee_number,
      name: `${emp.first_name} ${emp.last_name}`,
      salary,
      is_saudi: emp.is_saudi,
      hire_date: emp.hire_date,
      system_type: config?.gosi_system_type || 'OLD',
      nationality: config?.nationality || (emp.is_saudi ? 'SAUDI' : 'NON_SAUDI'),
      rates: {
        employee: config?.current_employee_rate || 0,
        employer: config?.current_employer_rate || 0
      },
      contributions: {
        employee: employeeContribution,
        employer: employerContribution,
        total: employeeContribution + employerContribution
      }
    };
  });

  const totals = gosiSummary.reduce((acc, emp) => ({
    total_employees: acc.total_employees + 1,
    old_system_count: acc.old_system_count + (emp.system_type === 'OLD' ? 1 : 0),
    new_system_count: acc.new_system_count + (emp.system_type === 'NEW' ? 1 : 0),
    saudi_count: acc.saudi_count + (emp.is_saudi ? 1 : 0),
    expat_count: acc.expat_count + (!emp.is_saudi ? 1 : 0),
    total_employee_contributions: acc.total_employee_contributions + emp.contributions.employee,
    total_employer_contributions: acc.total_employer_contributions + emp.contributions.employer,
    total_contributions: acc.total_contributions + emp.contributions.total
  }), {
    total_employees: 0,
    old_system_count: 0,
    new_system_count: 0,
    saudi_count: 0,
    expat_count: 0,
    total_employee_contributions: 0,
    total_employer_contributions: 0,
    total_contributions: 0
  });

  return new Response(
    JSON.stringify({
      success: true,
      company_id,
      calculation_date: new Date().toISOString(),
      summary: totals,
      employees: gosiSummary
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateProgressiveRates(req: Request, supabase: any) {
  const { effective_date }: GOSIRateUpdateRequest = await req.json();

  // Get all NEW system employees who need rate updates
  const { data: employees, error: empError } = await supabase
    .from('employee_gosi_config')
    .select('*')
    .eq('gosi_system_type', 'NEW')
    .eq('nationality', 'SAUDI');

  if (empError) throw empError;

  const updatedEmployees = [];

  for (const emp of employees) {
    // Get the new rate for this effective date
    const { data: newRate, error: rateError } = await supabase
      .from('gosi_rate_history')
      .select('employee_rate, employer_rate')
      .eq('system_type', 'NEW')
      .eq('nationality', 'SAUDI')
      .eq('effective_from', effective_date)
      .single();

    if (rateError || !newRate) continue;

    // Update employee configuration
    const { error: updateError } = await supabase
      .from('employee_gosi_config')
      .update({
        current_employee_rate: newRate.employee_rate,
        current_employer_rate: newRate.employer_rate,
        effective_from: effective_date
      })
      .eq('id', emp.id);

    if (!updateError) {
      updatedEmployees.push({
        employee_id: emp.employee_id,
        old_rates: {
          employee: emp.current_employee_rate,
          employer: emp.current_employer_rate
        },
        new_rates: {
          employee: newRate.employee_rate,
          employer: newRate.employer_rate
        }
      });

      // Publish AI sync event
      await supabase.from('ai_sync_events').insert({
        event_type: 'gosi_rate_change',
        source_table: 'employee_gosi_config',
        source_record_id: emp.employee_id,
        affected_modules: ['payroll', 'compliance', 'reporting'],
        payload: {
          employee_id: emp.employee_id,
          old_employee_rate: emp.current_employee_rate,
          old_employer_rate: emp.current_employer_rate,
          new_employee_rate: newRate.employee_rate,
          new_employer_rate: newRate.employer_rate,
          effective_from: effective_date,
          reason: 'annual_rate_progression'
        }
      });
    }
  }

  console.log(`Updated GOSI rates for ${updatedEmployees.length} employees effective ${effective_date}`);

  return new Response(
    JSON.stringify({
      success: true,
      effective_date,
      updated_count: updatedEmployees.length,
      updated_employees: updatedEmployees
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getEmployeeClassification(req: Request, supabase: any) {
  const url = new URL(req.url);
  const employeeId = url.searchParams.get('employee_id');

  if (!employeeId) {
    throw new Error('Employee ID required');
  }

  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select(`
      id,
      employee_number,
      first_name,
      last_name,
      hire_date,
      is_saudi,
      employee_gosi_config (
        gosi_system_type,
        nationality,
        current_employee_rate,
        current_employer_rate,
        effective_from
      )
    `)
    .eq('id', employeeId)
    .single();

  if (empError) throw empError;

  const config = employee.employee_gosi_config?.[0];

  return new Response(
    JSON.stringify({
      success: true,
      employee: {
        id: employee.id,
        employee_number: employee.employee_number,
        name: `${employee.first_name} ${employee.last_name}`,
        hire_date: employee.hire_date,
        is_saudi: employee.is_saudi,
        gosi_system: config?.gosi_system_type || 'OLD',
        nationality: config?.nationality || (employee.is_saudi ? 'SAUDI' : 'NON_SAUDI'),
        current_rates: {
          employee: config?.current_employee_rate || 0,
          employer: config?.current_employer_rate || 0
        },
        effective_from: config?.effective_from
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function runRateProgressionJob(req: Request, supabase: any) {
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];
  
  // Check if today is July 1st (rate progression date)
  if (today.getMonth() !== 6 || today.getDate() !== 1) {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Not a rate progression date (July 1st)',
        current_date: currentDate
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Run the rate update for the current date
  const updateRequest = new Request('https://dummy.url/update-rates', {
    method: 'POST',
    body: JSON.stringify({ effective_date: currentDate })
  });

  return await updateProgressiveRates(updateRequest, supabase);
}