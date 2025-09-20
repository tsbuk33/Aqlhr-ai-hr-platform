import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayrollCalculationRequest {
  company_id: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  is_ramadan_period?: boolean;
  employee_ids?: string[];
}

interface EmployeeData {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  basic_salary: number;
  hire_date: string;
  is_saudi: boolean;
  working_hours_per_day: number;
  working_days_per_week: number;
}

interface OvertimeCalculation {
  regular_hours: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_amount: number;
}

interface LeaveCalculation {
  annual_entitlement: number;
  used_days: number;
  remaining_days: number;
  leave_salary_deduction: number;
}

interface AllowanceCalculation {
  allowance_code: string;
  allowance_name: string;
  amount: number;
  is_taxable: boolean;
  affects_eos: boolean;
  affects_gosi: boolean;
}

interface LoanDeduction {
  loan_id: string;
  loan_type: string;
  monthly_deduction: number;
  remaining_amount: number;
}

interface GOSICalculation {
  employee_rate: number;
  employer_rate: number;
  employee_contribution: number;
  employer_contribution: number;
  calculation_base: number;
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
      case 'calculate-payroll':
        return await calculatePayroll(req, supabase);
      case 'calculate-overtime':
        return await calculateOvertime(req, supabase);
      case 'calculate-leaves':
        return await calculateLeaves(req, supabase);
      case 'calculate-eos':
        return await calculateEndOfService(req, supabase);
      case 'sync-gosi':
        return await syncWithGOSI(req, supabase);
      case 'generate-wps-file':
        return await generateWPSFile(req, supabase);
      case 'ramadan-adjustments':
        return await calculateRamadanAdjustments(req, supabase);
      default:
        throw new Error('Invalid endpoint');
    }
  } catch (error) {
    console.error('Error in advanced-payroll-engine:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function calculatePayroll(req: Request, supabase: any) {
  const body: PayrollCalculationRequest = await req.json();
  
  console.log('Starting payroll calculation for company:', body.company_id);
  
  // Create new payroll run
  const { data: payrollRun, error: runError } = await supabase
    .from('advanced_payroll_runs')
    .insert({
      company_id: body.company_id,
      run_name: `Payroll ${body.pay_period_start} - ${body.pay_period_end}`,
      pay_period_start: body.pay_period_start,
      pay_period_end: body.pay_period_end,
      pay_date: body.pay_date,
      is_ramadan_period: body.is_ramadan_period || false,
      status: 'draft'
    })
    .select()
    .single();
    
  if (runError) throw runError;
  
  // Get employees for calculation
  let employeeQuery = supabase
    .from('employees')
    .select('id, employee_number, first_name, last_name, basic_salary, hire_date, is_saudi, working_hours_per_day, working_days_per_week')
    .eq('company_id', body.company_id)
    .eq('employment_status', 'active');
    
  if (body.employee_ids && body.employee_ids.length > 0) {
    employeeQuery = employeeQuery.in('id', body.employee_ids);
  }
  
  const { data: employees, error: empError } = await employeeQuery;
  if (empError) throw empError;
  
  const payrollItems = [];
  let totalGrossPay = 0;
  let totalDeductions = 0;
  let totalNetPay = 0;
  
  for (const employee of employees) {
    console.log(`Calculating payroll for employee: ${employee.employee_number}`);
    
    // Calculate basic components
    const basicSalary = employee.basic_salary || 0;
    const workingDays = calculateWorkingDays(body.pay_period_start, body.pay_period_end, employee.working_days_per_week);
    const workingHours = workingDays * (employee.working_hours_per_day || 8);
    
    // Calculate allowances
    const allowances = await calculateAllowances(supabase, employee.id, basicSalary);
    const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
    
    // Calculate overtime
    const overtime = await calculateEmployeeOvertime(supabase, employee.id, body.pay_period_start, body.pay_period_end);
    
    // Calculate Ramadan adjustments if applicable
    const ramadanAdjustment = body.is_ramadan_period ? calculateRamadanHours(workingHours, employee.working_hours_per_day) : 0;
    
    // Calculate gross pay
    const grossPay = basicSalary + totalAllowances + overtime.overtime_amount + ramadanAdjustment;
    
    // Calculate GOSI
    const gosi = await calculateGOSI(supabase, employee.id, grossPay);
    
    // Calculate loan deductions
    const loanDeductions = await calculateLoanDeductions(supabase, employee.id);
    
    // Calculate leave deductions
    const leaveDeductions = await calculateLeaveDeductions(supabase, employee.id, body.pay_period_start, body.pay_period_end);
    
    const totalEmployeeDeductions = gosi.employee_contribution + loanDeductions + leaveDeductions;
    const netPay = grossPay - totalEmployeeDeductions;
    
    // Create payroll item
    const payrollItem = {
      payroll_run_id: payrollRun.id,
      employee_id: employee.id,
      basic_salary: basicSalary,
      total_allowances: totalAllowances,
      overtime_amount: overtime.overtime_amount,
      overtime_hours: overtime.overtime_hours,
      gross_pay: grossPay,
      gosi_employee: gosi.employee_contribution,
      gosi_employer: gosi.employer_contribution,
      loan_deductions: loanDeductions,
      other_deductions: leaveDeductions,
      total_deductions: totalEmployeeDeductions,
      net_pay: netPay,
      working_days: workingDays,
      working_hours: workingHours,
      ramadan_adjustment: ramadanAdjustment,
      calculation_details: {
        allowances,
        overtime,
        gosi,
        employee_data: employee,
        calculation_date: new Date().toISOString()
      }
    };
    
    payrollItems.push(payrollItem);
    totalGrossPay += grossPay;
    totalDeductions += totalEmployeeDeductions;
    totalNetPay += netPay;
  }
  
  // Insert all payroll items
  const { error: itemsError } = await supabase
    .from('advanced_payroll_items')
    .insert(payrollItems);
    
  if (itemsError) throw itemsError;
  
  // Update payroll run totals
  const { error: updateError } = await supabase
    .from('advanced_payroll_runs')
    .update({
      total_employees: employees.length,
      total_gross_pay: totalGrossPay,
      total_deductions: totalDeductions,
      total_net_pay: totalNetPay,
      status: 'calculated',
      calculation_logs: {
        calculated_at: new Date().toISOString(),
        employee_count: employees.length,
        calculation_summary: {
          total_gross_pay: totalGrossPay,
          total_deductions: totalDeductions,
          total_net_pay: totalNetPay
        }
      }
    })
    .eq('id', payrollRun.id);
    
  if (updateError) throw updateError;
  
  console.log('Payroll calculation completed successfully');
  
  return new Response(
    JSON.stringify({
      success: true,
      payroll_run_id: payrollRun.id,
      summary: {
        total_employees: employees.length,
        total_gross_pay: totalGrossPay,
        total_deductions: totalDeductions,
        total_net_pay: totalNetPay
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function calculateAllowances(supabase: any, employeeId: string, basicSalary: number): Promise<AllowanceCalculation[]> {
  const { data: employeeAllowances } = await supabase
    .from('employee_allowances')
    .select(`
      amount,
      allowance_definitions (
        allowance_code,
        allowance_name_en,
        calculation_type,
        calculation_formula,
        is_taxable,
        affects_eos,
        affects_gosi
      )
    `)
    .eq('employee_id', employeeId)
    .eq('is_active', true)
    .lte('effective_from', new Date().toISOString().split('T')[0])
    .or('effective_to.is.null,effective_to.gte.' + new Date().toISOString().split('T')[0]);
    
  const allowances: AllowanceCalculation[] = [];
  
  for (const empAllowance of employeeAllowances || []) {
    const def = empAllowance.allowance_definitions;
    let calculatedAmount = 0;
    
    switch (def.calculation_type) {
      case 'fixed':
        calculatedAmount = empAllowance.amount || def.calculation_formula.amount || 0;
        break;
      case 'percentage':
        const percentage = def.calculation_formula.percentage || 0;
        const maxAmount = def.calculation_formula.max_amount || Number.MAX_SAFE_INTEGER;
        calculatedAmount = Math.min((basicSalary * percentage / 100), maxAmount);
        break;
      case 'formula':
        if (def.allowance_code === 'OVERTIME') {
          // Overtime is calculated separately
          calculatedAmount = 0;
        } else {
          calculatedAmount = empAllowance.amount || 0;
        }
        break;
      default:
        calculatedAmount = empAllowance.amount || 0;
    }
    
    allowances.push({
      allowance_code: def.allowance_code,
      allowance_name: def.allowance_name_en,
      amount: calculatedAmount,
      is_taxable: def.is_taxable,
      affects_eos: def.affects_eos,
      affects_gosi: def.affects_gosi
    });
  }
  
  return allowances;
}

async function calculateEmployeeOvertime(supabase: any, employeeId: string, startDate: string, endDate: string): Promise<OvertimeCalculation> {
  // Get attendance records for the period
  const { data: attendance } = await supabase
    .from('attendance_timesheet')
    .select('*')
    .eq('employee_id', employeeId)
    .gte('date', startDate)
    .lte('date', endDate);
    
  let totalRegularHours = 0;
  let totalOvertimeHours = 0;
  
  for (const record of attendance || []) {
    const actualHours = record.actual_hours || 0;
    const plannedHours = record.planned_hours || 8;
    
    if (actualHours > plannedHours) {
      totalOvertimeHours += (actualHours - plannedHours);
      totalRegularHours += plannedHours;
    } else {
      totalRegularHours += actualHours;
    }
  }
  
  // Get employee basic salary to calculate hourly rate
  const { data: employee } = await supabase
    .from('employees')
    .select('basic_salary, working_hours_per_day, working_days_per_week')
    .eq('id', employeeId)
    .single();
    
  const monthlyHours = (employee?.working_hours_per_day || 8) * (employee?.working_days_per_week || 5) * 4.33; // Average weeks per month
  const hourlyRate = (employee?.basic_salary || 0) / monthlyHours;
  const overtimeRate = hourlyRate * 1.5; // Saudi law: 150% for overtime
  const overtimeAmount = totalOvertimeHours * overtimeRate;
  
  return {
    regular_hours: totalRegularHours,
    overtime_hours: totalOvertimeHours,
    overtime_rate: overtimeRate,
    overtime_amount: overtimeAmount
  };
}

async function calculateGOSI(supabase: any, employeeId: string, calculationBase: number): Promise<GOSICalculation> {
  // Get GOSI rates for the employee
  const { data: gosiRates } = await supabase
    .rpc('calculate_gosi_rates', { 
      p_employee_id: employeeId,
      p_as_of_date: new Date().toISOString().split('T')[0]
    });
    
  if (!gosiRates || gosiRates.length === 0) {
    // Default rates if not found
    return {
      employee_rate: 0.10, // 10%
      employer_rate: 0.12, // 12%
      employee_contribution: calculationBase * 0.10,
      employer_contribution: calculationBase * 0.12,
      calculation_base: calculationBase
    };
  }
  
  const rates = gosiRates[0];
  return {
    employee_rate: rates.employee_rate,
    employer_rate: rates.employer_rate,
    employee_contribution: calculationBase * rates.employee_rate,
    employer_contribution: calculationBase * rates.employer_rate,
    calculation_base: calculationBase
  };
}

async function calculateLoanDeductions(supabase: any, employeeId: string): Promise<number> {
  const { data: loans } = await supabase
    .from('employee_loans')
    .select('monthly_deduction')
    .eq('employee_id', employeeId)
    .eq('status', 'active');
    
  return (loans || []).reduce((sum, loan) => sum + (loan.monthly_deduction || 0), 0);
}

async function calculateLeaveDeductions(supabase: any, employeeId: string, startDate: string, endDate: string): Promise<number> {
  // Get unpaid leave taken during the period
  const { data: leaves } = await supabase
    .from('leave_requests')
    .select(`
      days_requested,
      leave_types (is_paid, calculation_rules)
    `)
    .eq('employee_id', employeeId)
    .eq('status', 'approved')
    .gte('start_date', startDate)
    .lte('end_date', endDate);
    
  let unpaidDays = 0;
  
  for (const leave of leaves || []) {
    if (!leave.leave_types?.is_paid) {
      unpaidDays += leave.days_requested || 0;
    }
  }
  
  // Calculate daily salary and deduct for unpaid days
  const { data: employee } = await supabase
    .from('employees')
    .select('basic_salary')
    .eq('id', employeeId)
    .single();
    
  const dailySalary = (employee?.basic_salary || 0) / 30; // Assuming 30 days per month
  return unpaidDays * dailySalary;
}

function calculateWorkingDays(startDate: string, endDate: string, workingDaysPerWeek: number): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = totalDays / 7;
  return Math.round(totalWeeks * (workingDaysPerWeek || 5));
}

function calculateRamadanHours(regularHours: number, dailyHours: number): number {
  // Saudi law: Reduce working hours by 2 hours during Ramadan
  const ramadanDailyHours = Math.max(dailyHours - 2, 6); // Minimum 6 hours
  const reductionPercentage = ramadanDailyHours / dailyHours;
  return regularHours * (1 - reductionPercentage);
}

async function calculateOvertime(req: Request, supabase: any) {
  const { employee_id, start_date, end_date } = await req.json();
  
  const overtime = await calculateEmployeeOvertime(supabase, employee_id, start_date, end_date);
  
  return new Response(
    JSON.stringify({ success: true, overtime }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function calculateLeaves(req: Request, supabase: any) {
  const { employee_id, year } = await req.json();
  
  // Get employee data
  const { data: employee } = await supabase
    .from('employees')
    .select('hire_date, is_saudi')
    .eq('id', employee_id)
    .single();
    
  if (!employee) {
    throw new Error('Employee not found');
  }
  
  // Calculate annual leave entitlement based on service years
  const serviceYears = Math.floor((new Date().getTime() - new Date(employee.hire_date).getTime()) / (1000 * 60 * 60 * 24 * 365));
  const annualEntitlement = serviceYears >= 5 ? 30 : 21; // Saudi law
  
  // Get current balances
  const { data: balances } = await supabase
    .from('employee_leave_balances')
    .select('*')
    .eq('employee_id', employee_id)
    .eq('year', year || new Date().getFullYear());
    
  const leaveCalculation: LeaveCalculation = {
    annual_entitlement: annualEntitlement,
    used_days: balances?.reduce((sum, balance) => sum + (balance.used_days || 0), 0) || 0,
    remaining_days: annualEntitlement - (balances?.reduce((sum, balance) => sum + (balance.used_days || 0), 0) || 0),
    leave_salary_deduction: 0 // Calculate based on unpaid leaves
  };
  
  return new Response(
    JSON.stringify({ success: true, leave_calculation: leaveCalculation }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function calculateEndOfService(req: Request, supabase: any) {
  const { employee_id, calculation_date, reason } = await req.json();
  
  // Get employee data
  const { data: employee } = await supabase
    .from('employees')
    .select('hire_date, basic_salary, is_saudi')
    .eq('id', employee_id)
    .single();
    
  if (!employee) {
    throw new Error('Employee not found');
  }
  
  const hireDate = new Date(employee.hire_date);
  const calcDate = new Date(calculation_date);
  const totalServiceDays = Math.floor((calcDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24));
  const serviceYears = totalServiceDays / 365.25;
  const serviceMonths = (totalServiceDays % 365.25) / 30.44;
  
  const basicSalary = employee.basic_salary || 0;
  
  // Get allowances that affect EOS
  const allowances = await calculateAllowances(supabase, employee_id, basicSalary);
  const eosAllowances = allowances
    .filter(allowance => allowance.affects_eos)
    .reduce((sum, allowance) => sum + allowance.amount, 0);
    
  const calculationBase = basicSalary + eosAllowances;
  
  // Saudi EOS calculation
  let eosAmount = 0;
  
  if (reason === 'resignation') {
    // Resignation: Half pay for first 5 years, full pay for remaining
    if (serviceYears <= 5) {
      eosAmount = (calculationBase * serviceYears * 0.5) / 12; // Half month per year
    } else {
      const firstFiveYears = (calculationBase * 5 * 0.5) / 12;
      const remainingYears = (calculationBase * (serviceYears - 5)) / 12;
      eosAmount = firstFiveYears + remainingYears;
    }
  } else {
    // Termination, retirement, death: Full pay
    eosAmount = (calculationBase * serviceYears) / 12; // One month per year
  }
  
  // Insert calculation record
  const { data: calculation, error } = await supabase
    .from('end_of_service_calculations')
    .insert({
      employee_id,
      calculation_date,
      service_years: serviceYears,
      service_months: serviceMonths,
      total_service_days: totalServiceDays,
      basic_salary: basicSalary,
      allowances_included: eosAllowances,
      calculation_base: calculationBase,
      eos_amount: eosAmount,
      reason,
      calculation_details: {
        hire_date: employee.hire_date,
        calculation_method: reason,
        allowances_breakdown: allowances.filter(a => a.affects_eos)
      }
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      eos_calculation: calculation 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncWithGOSI(req: Request, supabase: any) {
  const { company_id, sync_type } = await req.json();
  
  // Create sync log
  const { data: syncLog, error: logError } = await supabase
    .from('gosi_sync_logs')
    .insert({
      company_id,
      sync_type,
      status: 'in_progress'
    })
    .select()
    .single();
    
  if (logError) throw logError;
  
  try {
    // Mock GOSI sync implementation
    // In real implementation, this would connect to GOSI APIs
    
    let recordsProcessed = 0;
    let recordsSuccess = 0;
    
    if (sync_type === 'employee_data') {
      // Sync employee data with GOSI
      const { data: employees } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', company_id)
        .eq('employment_status', 'active');
        
      recordsProcessed = employees?.length || 0;
      recordsSuccess = recordsProcessed; // Mock success
    }
    
    // Update sync log
    await supabase
      .from('gosi_sync_logs')
      .update({
        records_processed: recordsProcessed,
        records_success: recordsSuccess,
        records_failed: recordsProcessed - recordsSuccess,
        status: 'completed',
        sync_details: {
          completed_at: new Date().toISOString(),
          sync_summary: `Successfully synced ${recordsSuccess} records`
        }
      })
      .eq('id', syncLog.id);
      
    return new Response(
      JSON.stringify({ 
        success: true,
        sync_log_id: syncLog.id,
        records_processed: recordsProcessed,
        records_success: recordsSuccess
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    // Update sync log with error
    await supabase
      .from('gosi_sync_logs')
      .update({
        status: 'failed',
        sync_details: {
          error: error.message,
          failed_at: new Date().toISOString()
        }
      })
      .eq('id', syncLog.id);
      
    throw error;
  }
}

async function generateWPSFile(req: Request, supabase: any) {
  const { payroll_run_id } = await req.json();
  
  // Get payroll run and items
  const { data: payrollRun } = await supabase
    .from('advanced_payroll_runs')
    .select('*')
    .eq('id', payroll_run_id)
    .single();
    
  const { data: payrollItems } = await supabase
    .from('advanced_payroll_items')
    .select(`
      *,
      employees (employee_number, first_name, last_name, national_id, iban)
    `)
    .eq('payroll_run_id', payroll_run_id);
    
  if (!payrollRun || !payrollItems) {
    throw new Error('Payroll run or items not found');
  }
  
  // Generate WPS file content (simplified format)
  const wpsData = payrollItems.map(item => ({
    employee_number: item.employees.employee_number,
    employee_name: `${item.employees.first_name} ${item.employees.last_name}`,
    national_id: item.employees.national_id,
    iban: item.employees.iban,
    net_salary: item.net_pay,
    payment_date: payrollRun.pay_date
  }));
  
  const fileName = `WPS_${payrollRun.company_id}_${payrollRun.pay_period_start}_${payrollRun.pay_period_end}.json`;
  
  // In real implementation, this would generate actual WPS format file
  // and upload to storage bucket
  
  // Create WPS submission log
  const { data: submission, error } = await supabase
    .from('wps_submissions')
    .insert({
      company_id: payrollRun.company_id,
      payroll_run_id: payroll_run_id,
      wps_file_name: fileName,
      status: 'pending'
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ 
      success: true,
      wps_submission_id: submission.id,
      file_name: fileName,
      records_count: payrollItems.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function calculateRamadanAdjustments(req: Request, supabase: any) {
  const { company_id, ramadan_start_date, ramadan_end_date } = await req.json();
  
  // Get company working hour configuration
  const { data: config } = await supabase
    .from('payroll_configurations')
    .select('*')
    .eq('company_id', company_id)
    .eq('config_type', 'ramadan_adjustments')
    .eq('is_active', true)
    .single();
    
  const ramadanConfig = config?.rules || {
    hours_reduction: 2,
    minimum_hours: 6,
    applies_to_all: true
  };
  
  // Get all active employees
  const { data: employees } = await supabase
    .from('employees')
    .select('id, working_hours_per_day, basic_salary')
    .eq('company_id', company_id)
    .eq('employment_status', 'active');
    
  const adjustments = employees?.map(employee => {
    const regularHours = employee.working_hours_per_day || 8;
    const ramadanHours = Math.max(regularHours - ramadanConfig.hours_reduction, ramadanConfig.minimum_hours);
    const hourlyRate = (employee.basic_salary || 0) / (regularHours * 30); // Monthly to hourly
    const adjustmentAmount = (regularHours - ramadanHours) * hourlyRate * 30; // Monthly adjustment
    
    return {
      employee_id: employee.id,
      regular_hours: regularHours,
      ramadan_hours: ramadanHours,
      adjustment_amount: adjustmentAmount,
      effective_from: ramadan_start_date,
      effective_to: ramadan_end_date
    };
  }) || [];
  
  return new Response(
    JSON.stringify({ 
      success: true,
      ramadan_adjustments: adjustments,
      total_employees: adjustments.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}