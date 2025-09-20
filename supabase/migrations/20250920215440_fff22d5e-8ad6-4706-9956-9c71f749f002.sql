-- Advanced Payroll Engine Database Schema (Additional Tables)

-- Payroll configurations table
CREATE TABLE IF NOT EXISTS public.payroll_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  config_name TEXT NOT NULL,
  config_type TEXT NOT NULL CHECK (config_type IN ('overtime_rules', 'allowance_structure', 'leave_policy', 'end_of_service', 'ramadan_adjustments')),
  rules JSONB NOT NULL DEFAULT '{}',
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employee leave balances (if not exists)
CREATE TABLE IF NOT EXISTS public.employee_leave_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  leave_type_id UUID NOT NULL,
  year INTEGER NOT NULL,
  total_entitlement NUMERIC(5,2) NOT NULL DEFAULT 0,
  used_days NUMERIC(5,2) NOT NULL DEFAULT 0,
  remaining_days NUMERIC(5,2) NOT NULL DEFAULT 0,
  carried_forward NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, leave_type_id, year)
);

-- Allowance definitions
CREATE TABLE IF NOT EXISTS public.allowance_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  allowance_code TEXT NOT NULL,
  allowance_name_en TEXT NOT NULL,
  allowance_name_ar TEXT NOT NULL,
  calculation_type TEXT NOT NULL CHECK (calculation_type IN ('fixed', 'percentage', 'formula', 'conditional')),
  calculation_formula JSONB NOT NULL DEFAULT '{}',
  is_taxable BOOLEAN NOT NULL DEFAULT true,
  affects_eos BOOLEAN NOT NULL DEFAULT true,
  affects_gosi BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employee allowances
CREATE TABLE IF NOT EXISTS public.employee_allowances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  allowance_id UUID NOT NULL REFERENCES public.allowance_definitions(id),
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- End of service calculations
CREATE TABLE IF NOT EXISTS public.end_of_service_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  calculation_date DATE NOT NULL,
  service_years NUMERIC(5,2) NOT NULL,
  service_months NUMERIC(5,2) NOT NULL,
  total_service_days INTEGER NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL,
  allowances_included NUMERIC(12,2) NOT NULL DEFAULT 0,
  calculation_base NUMERIC(12,2) NOT NULL,
  eos_amount NUMERIC(12,2) NOT NULL,
  calculation_details JSONB NOT NULL DEFAULT '{}',
  reason TEXT NOT NULL CHECK (reason IN ('resignation', 'termination', 'retirement', 'death')),
  status TEXT NOT NULL DEFAULT 'calculated' CHECK (status IN ('calculated', 'approved', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Loans and advances
CREATE TABLE IF NOT EXISTS public.employee_loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('salary_advance', 'personal_loan', 'emergency_loan')),
  loan_amount NUMERIC(12,2) NOT NULL,
  remaining_amount NUMERIC(12,2) NOT NULL,
  monthly_deduction NUMERIC(12,2) NOT NULL,
  installments_total INTEGER NOT NULL,
  installments_paid INTEGER NOT NULL DEFAULT 0,
  interest_rate NUMERIC(5,4) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  approval_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Advanced payroll runs table
CREATE TABLE IF NOT EXISTS public.advanced_payroll_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  run_name TEXT NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  pay_date DATE NOT NULL,
  is_ramadan_period BOOLEAN NOT NULL DEFAULT false,
  total_employees INTEGER NOT NULL DEFAULT 0,
  total_gross_pay NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_net_pay NUMERIC(15,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'calculated', 'approved', 'paid', 'submitted_to_wps')),
  calculation_logs JSONB DEFAULT '{}',
  created_by UUID,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Individual payroll items for advanced runs
CREATE TABLE IF NOT EXISTS public.advanced_payroll_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payroll_run_id UUID NOT NULL REFERENCES public.advanced_payroll_runs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_allowances NUMERIC(12,2) NOT NULL DEFAULT 0,
  overtime_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  overtime_hours NUMERIC(6,2) NOT NULL DEFAULT 0,
  gross_pay NUMERIC(12,2) NOT NULL DEFAULT 0,
  gosi_employee NUMERIC(12,2) NOT NULL DEFAULT 0,
  gosi_employer NUMERIC(12,2) NOT NULL DEFAULT 0,
  loan_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  other_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_pay NUMERIC(12,2) NOT NULL DEFAULT 0,
  working_days INTEGER NOT NULL DEFAULT 0,
  working_hours NUMERIC(6,2) NOT NULL DEFAULT 0,
  ramadan_adjustment NUMERIC(12,2) NOT NULL DEFAULT 0,
  calculation_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- WPS submission logs
CREATE TABLE IF NOT EXISTS public.wps_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  payroll_run_id UUID NOT NULL,
  wps_file_name TEXT NOT NULL,
  wps_file_path TEXT,
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  molhri_response JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'accepted', 'rejected', 'processed')),
  error_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- GOSI synchronization logs
CREATE TABLE IF NOT EXISTS public.gosi_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('employee_data', 'salary_data', 'contribution_data')),
  sync_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  records_processed INTEGER NOT NULL DEFAULT 0,
  records_success INTEGER NOT NULL DEFAULT 0,
  records_failed INTEGER NOT NULL DEFAULT 0,
  sync_details JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default allowance definitions (only if table is empty)
INSERT INTO public.allowance_definitions (company_id, allowance_code, allowance_name_en, allowance_name_ar, calculation_type, calculation_formula, is_taxable, affects_eos, affects_gosi)
SELECT '00000000-0000-0000-0000-000000000000', 'HOUSING', 'Housing Allowance', 'بدل سكن', 'percentage', '{"percentage": 25, "base": "basic_salary", "max_amount": 5000}', true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.allowance_definitions WHERE allowance_code = 'HOUSING');

INSERT INTO public.allowance_definitions (company_id, allowance_code, allowance_name_en, allowance_name_ar, calculation_type, calculation_formula, is_taxable, affects_eos, affects_gosi)
SELECT '00000000-0000-0000-0000-000000000000', 'TRANSPORT', 'Transportation Allowance', 'بدل نقل', 'fixed', '{"amount": 500}', true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.allowance_definitions WHERE allowance_code = 'TRANSPORT');

INSERT INTO public.allowance_definitions (company_id, allowance_code, allowance_name_en, allowance_name_ar, calculation_type, calculation_formula, is_taxable, affects_eos, affects_gosi)
SELECT '00000000-0000-0000-0000-000000000000', 'PHONE', 'Phone Allowance', 'بدل هاتف', 'fixed', '{"amount": 200}', true, false, false
WHERE NOT EXISTS (SELECT 1 FROM public.allowance_definitions WHERE allowance_code = 'PHONE');

INSERT INTO public.allowance_definitions (company_id, allowance_code, allowance_name_en, allowance_name_ar, calculation_type, calculation_formula, is_taxable, affects_eos, affects_gosi)
SELECT '00000000-0000-0000-0000-000000000000', 'OVERTIME', 'Overtime Pay', 'بدل إضافي', 'formula', '{"rate": 1.5, "base": "hourly_rate"}', true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.allowance_definitions WHERE allowance_code = 'OVERTIME');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payroll_configurations_company ON public.payroll_configurations(company_id);
CREATE INDEX IF NOT EXISTS idx_employee_leave_balances_employee ON public.employee_leave_balances(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_allowances_employee ON public.employee_allowances(employee_id);
CREATE INDEX IF NOT EXISTS idx_advanced_payroll_runs_company ON public.advanced_payroll_runs(company_id);
CREATE INDEX IF NOT EXISTS idx_advanced_payroll_items_run ON public.advanced_payroll_items(payroll_run_id);
CREATE INDEX IF NOT EXISTS idx_advanced_payroll_items_employee ON public.advanced_payroll_items(employee_id);
CREATE INDEX IF NOT EXISTS idx_wps_submissions_company ON public.wps_submissions(company_id);

-- Enable RLS on all new tables
ALTER TABLE public.payroll_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowance_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.end_of_service_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wps_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gosi_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (with DROP IF EXISTS to avoid conflicts)
DROP POLICY IF EXISTS "payroll_configurations_company_access" ON public.payroll_configurations;
CREATE POLICY "payroll_configurations_company_access" ON public.payroll_configurations
  FOR ALL USING (company_id = get_current_user_company_id() AND (is_admin() OR is_hr_manager()));

DROP POLICY IF EXISTS "employee_leave_balances_access" ON public.employee_leave_balances;
CREATE POLICY "employee_leave_balances_access" ON public.employee_leave_balances
  FOR ALL USING (
    EXISTS(SELECT 1 FROM employees WHERE id = employee_id AND company_id = get_current_user_company_id()) 
    AND (is_admin() OR is_hr_manager() OR employee_id = get_current_user_employee_id())
  );

DROP POLICY IF EXISTS "allowance_definitions_company_access" ON public.allowance_definitions;
CREATE POLICY "allowance_definitions_company_access" ON public.allowance_definitions
  FOR ALL USING (company_id = get_current_user_company_id() AND (is_admin() OR is_hr_manager()));

DROP POLICY IF EXISTS "employee_allowances_access" ON public.employee_allowances;
CREATE POLICY "employee_allowances_access" ON public.employee_allowances
  FOR ALL USING (
    EXISTS(SELECT 1 FROM employees WHERE id = employee_id AND company_id = get_current_user_company_id()) 
    AND (is_admin() OR is_hr_manager())
  );

DROP POLICY IF EXISTS "end_of_service_calculations_access" ON public.end_of_service_calculations;
CREATE POLICY "end_of_service_calculations_access" ON public.end_of_service_calculations
  FOR ALL USING (
    EXISTS(SELECT 1 FROM employees WHERE id = employee_id AND company_id = get_current_user_company_id()) 
    AND (is_admin() OR is_hr_manager())
  );

DROP POLICY IF EXISTS "employee_loans_access" ON public.employee_loans;
CREATE POLICY "employee_loans_access" ON public.employee_loans
  FOR ALL USING (
    EXISTS(SELECT 1 FROM employees WHERE id = employee_id AND company_id = get_current_user_company_id()) 
    AND (is_admin() OR is_hr_manager() OR employee_id = get_current_user_employee_id())
  );

DROP POLICY IF EXISTS "advanced_payroll_runs_company_access" ON public.advanced_payroll_runs;
CREATE POLICY "advanced_payroll_runs_company_access" ON public.advanced_payroll_runs
  FOR ALL USING (company_id = get_current_user_company_id() AND (is_admin() OR is_hr_manager()));

DROP POLICY IF EXISTS "advanced_payroll_items_access" ON public.advanced_payroll_items;
CREATE POLICY "advanced_payroll_items_access" ON public.advanced_payroll_items
  FOR ALL USING (
    EXISTS(SELECT 1 FROM advanced_payroll_runs WHERE id = payroll_run_id AND company_id = get_current_user_company_id()) 
    AND (is_admin() OR is_hr_manager() OR employee_id = get_current_user_employee_id())
  );

DROP POLICY IF EXISTS "wps_submissions_company_access" ON public.wps_submissions;
CREATE POLICY "wps_submissions_company_access" ON public.wps_submissions
  FOR ALL USING (company_id = get_current_user_company_id() AND (is_admin() OR is_hr_manager()));

DROP POLICY IF EXISTS "gosi_sync_logs_company_access" ON public.gosi_sync_logs;
CREATE POLICY "gosi_sync_logs_company_access" ON public.gosi_sync_logs
  FOR ALL USING (company_id = get_current_user_company_id() AND (is_admin() OR is_hr_manager()));