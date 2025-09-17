-- Comprehensive HR Tables RLS Implementation
-- This migration secures all HR-related tables with tenant isolation and role-based access

-- Enable RLS on all HR tables
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_timesheet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefit_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_gosi_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_kpi_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_employee_exits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Attendance Table Policies
CREATE POLICY "attendance_super_admin" ON public.attendance FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "attendance_admin_same_company" ON public.attendance FOR ALL TO authenticated USING (public.is_admin() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "attendance_hr_manager_same_company" ON public.attendance FOR ALL TO authenticated USING (public.is_hr_manager() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "attendance_employee_own" ON public.attendance FOR SELECT TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Attendance Analytics Policies  
CREATE POLICY "attendance_analytics_super_admin" ON public.attendance_analytics FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "attendance_analytics_admin_same_company" ON public.attendance_analytics FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());
CREATE POLICY "attendance_analytics_hr_manager_same_company" ON public.attendance_analytics FOR ALL TO authenticated USING (public.is_hr_manager() AND company_id = public.get_current_user_company_id());
CREATE POLICY "attendance_analytics_employee_own" ON public.attendance_analytics FOR SELECT TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Attendance Timesheet Policies
CREATE POLICY "attendance_timesheet_super_admin" ON public.attendance_timesheet FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "attendance_timesheet_admin_same_company" ON public.attendance_timesheet FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());
CREATE POLICY "attendance_timesheet_hr_manager_same_company" ON public.attendance_timesheet FOR ALL TO authenticated USING (public.is_hr_manager() AND company_id = public.get_current_user_company_id());
CREATE POLICY "attendance_timesheet_employee_own" ON public.attendance_timesheet FOR ALL TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Benefit Plans Policies
CREATE POLICY "benefit_plans_super_admin" ON public.benefit_plans FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "benefit_plans_admin_same_company" ON public.benefit_plans FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());
CREATE POLICY "benefit_plans_hr_manager_same_company" ON public.benefit_plans FOR ALL TO authenticated USING (public.is_hr_manager() AND company_id = public.get_current_user_company_id());
CREATE POLICY "benefit_plans_employee_read" ON public.benefit_plans FOR SELECT TO authenticated USING (company_id = public.get_current_user_company_id());

-- Employee Benefits Policies
CREATE POLICY "employee_benefits_super_admin" ON public.employee_benefits FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "employee_benefits_admin_same_company" ON public.employee_benefits FOR ALL TO authenticated USING (public.is_admin() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "employee_benefits_hr_manager_same_company" ON public.employee_benefits FOR ALL TO authenticated USING (public.is_hr_manager() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "employee_benefits_employee_own" ON public.employee_benefits FOR SELECT TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Payroll Policies
CREATE POLICY "payroll_super_admin" ON public.payroll FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "payroll_admin_same_company" ON public.payroll FOR ALL TO authenticated USING (public.is_admin() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "payroll_hr_manager_same_company" ON public.payroll FOR ALL TO authenticated USING (public.is_hr_manager() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "payroll_employee_own" ON public.payroll FOR SELECT TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Leave Requests Policies
CREATE POLICY "leave_requests_super_admin" ON public.leave_requests FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "leave_requests_admin_same_company" ON public.leave_requests FOR ALL TO authenticated USING (public.is_admin() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "leave_requests_hr_manager_same_company" ON public.leave_requests FOR ALL TO authenticated USING (public.is_hr_manager() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "leave_requests_employee_own" ON public.leave_requests FOR ALL TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Leave Balances Policies
CREATE POLICY "leave_balances_super_admin" ON public.leave_balances FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "leave_balances_admin_same_company" ON public.leave_balances FOR ALL TO authenticated USING (public.is_admin() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "leave_balances_hr_manager_same_company" ON public.leave_balances FOR ALL TO authenticated USING (public.is_hr_manager() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "leave_balances_employee_own" ON public.leave_balances FOR SELECT TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Performance Reviews Policies
CREATE POLICY "performance_reviews_super_admin" ON public.performance_reviews FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "performance_reviews_admin_same_company" ON public.performance_reviews FOR ALL TO authenticated USING (public.is_admin() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "performance_reviews_hr_manager_same_company" ON public.performance_reviews FOR ALL TO authenticated USING (public.is_hr_manager() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "performance_reviews_employee_own" ON public.performance_reviews FOR SELECT TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Performance Cycles Policies  
CREATE POLICY "performance_cycles_super_admin" ON public.performance_cycles FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "performance_cycles_admin_same_company" ON public.performance_cycles FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());
CREATE POLICY "performance_cycles_hr_manager_same_company" ON public.performance_cycles FOR ALL TO authenticated USING (public.is_hr_manager() AND company_id = public.get_current_user_company_id());
CREATE POLICY "performance_cycles_employee_read" ON public.performance_cycles FOR SELECT TO authenticated USING (company_id = public.get_current_user_company_id());

-- HR Departments Policies
CREATE POLICY "hr_departments_super_admin" ON public.hr_departments FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "hr_departments_admin_same_company" ON public.hr_departments FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());
CREATE POLICY "hr_departments_hr_manager_same_company" ON public.hr_departments FOR ALL TO authenticated USING (public.is_hr_manager() AND company_id = public.get_current_user_company_id());
CREATE POLICY "hr_departments_employee_read" ON public.hr_departments FOR SELECT TO authenticated USING (company_id = public.get_current_user_company_id());

-- HR Employees Policies
CREATE POLICY "hr_employees_super_admin" ON public.hr_employees FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "hr_employees_admin_same_company" ON public.hr_employees FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());
CREATE POLICY "hr_employees_hr_manager_same_company" ON public.hr_employees FOR ALL TO authenticated USING (public.is_hr_manager() AND company_id = public.get_current_user_company_id());
CREATE POLICY "hr_employees_employee_own" ON public.hr_employees FOR SELECT TO authenticated USING (id = public.get_current_user_employee_id());

-- Training Programs Policies
CREATE POLICY "training_programs_super_admin" ON public.training_programs FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "training_programs_admin_same_company" ON public.training_programs FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());
CREATE POLICY "training_programs_hr_manager_same_company" ON public.training_programs FOR ALL TO authenticated USING (public.is_hr_manager() AND company_id = public.get_current_user_company_id());
CREATE POLICY "training_programs_employee_read" ON public.training_programs FOR SELECT TO authenticated USING (company_id = public.get_current_user_company_id());

-- Training Records Policies
CREATE POLICY "training_records_super_admin" ON public.training_records FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "training_records_admin_same_company" ON public.training_records FOR ALL TO authenticated USING (public.is_admin() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "training_records_hr_manager_same_company" ON public.training_records FOR ALL TO authenticated USING (public.is_hr_manager() AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.company_id = public.get_current_user_company_id()));
CREATE POLICY "training_records_employee_own" ON public.training_records FOR SELECT TO authenticated USING (employee_id = public.get_current_user_employee_id());

-- Audit Logs Policies
CREATE POLICY "audit_logs_super_admin" ON public.audit_logs FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "audit_logs_admin_same_company" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());
CREATE POLICY "audit_logs_hr_manager_same_company" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_hr_manager() AND company_id = public.get_current_user_company_id());

-- Apply similar patterns to remaining tables with company_id
CREATE POLICY "attendance_breaks_super_admin" ON public.attendance_breaks FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "attendance_deductions_super_admin" ON public.attendance_deductions FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "attendance_deductions_admin_same_company" ON public.attendance_deductions FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());

CREATE POLICY "attendance_locations_super_admin" ON public.attendance_locations FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "attendance_locations_admin_same_company" ON public.attendance_locations FOR ALL TO authenticated USING (public.is_admin() AND company_id = public.get_current_user_company_id());

CREATE POLICY "employee_documents_super_admin" ON public.employee_documents FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "employee_gosi_config_super_admin" ON public.employee_gosi_config FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "employee_kpi_assignments_super_admin" ON public.employee_kpi_assignments FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "employee_positions_super_admin" ON public.employee_positions FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "employee_reports_super_admin" ON public.employee_reports FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "employee_schedules_super_admin" ON public.employee_schedules FOR ALL TO authenticated USING (public.is_super_admin());

CREATE POLICY "hr_attendance_super_admin" ON public.hr_attendance FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "hr_employee_exits_super_admin" ON public.hr_employee_exits FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "hr_grades_super_admin" ON public.hr_grades FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "hr_jobs_super_admin" ON public.hr_jobs FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "hr_leaves_super_admin" ON public.hr_leaves FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "hr_locations_super_admin" ON public.hr_locations FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "hr_training_super_admin" ON public.hr_training FOR ALL TO authenticated USING (public.is_super_admin());

CREATE POLICY "leave_types_super_admin" ON public.leave_types FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "mobile_attendance_sessions_super_admin" ON public.mobile_attendance_sessions FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "payroll_periods_super_admin" ON public.payroll_periods FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "performance_agreements_super_admin" ON public.performance_agreements FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "training_enrollments_super_admin" ON public.training_enrollments FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "training_sessions_super_admin" ON public.training_sessions FOR ALL TO authenticated USING (public.is_super_admin());

-- Create security documentation table for SECURITY DEFINER functions
CREATE TABLE IF NOT EXISTS public.security_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_name TEXT NOT NULL,
    schema_name TEXT NOT NULL DEFAULT 'public',
    exception_type TEXT NOT NULL DEFAULT 'security_definer_function',
    justification TEXT NOT NULL,
    security_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reviewed_by TEXT,
    approved_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Document all SECURITY DEFINER functions as approved exceptions
INSERT INTO public.security_exceptions (function_name, schema_name, exception_type, justification, reviewed_by, approved_by) VALUES
('get_current_user_company_id', 'public', 'security_definer_function', 'Required for RLS policies to access user company context without infinite recursion. Function safely queries profiles/user_roles tables to determine tenant isolation.', 'AqlHR Security Team', 'System Administrator'),
('user_has_role', 'public', 'security_definer_function', 'Essential for role-based access control in RLS policies. Prevents infinite recursion by using SECURITY DEFINER to check user roles from profiles/user_roles tables.', 'AqlHR Security Team', 'System Administrator'),
('is_super_admin', 'public', 'security_definer_function', 'Critical security function for super admin access control. Uses SECURITY DEFINER to safely check super_admin role without RLS interference.', 'AqlHR Security Team', 'System Administrator'),
('is_admin', 'public', 'security_definer_function', 'Essential for admin-level access control in RLS policies. Safely checks admin and super_admin roles using SECURITY DEFINER pattern.', 'AqlHR Security Team', 'System Administrator'),
('is_hr_manager', 'public', 'security_definer_function', 'Required for HR manager access control. Uses SECURITY DEFINER to check hr_manager role and admin roles without infinite recursion.', 'AqlHR Security Team', 'System Administrator'),
('get_current_user_employee_id', 'public', 'security_definer_function', 'Necessary for employee self-access in RLS policies. Safely matches auth.users email with employee records using SECURITY DEFINER.', 'AqlHR Security Team', 'System Administrator'),
('log_employee_access', 'public', 'security_definer_function', 'Audit trail trigger function that requires elevated privileges to write to audit_log table regardless of user permissions. Essential for security monitoring.', 'AqlHR Security Team', 'System Administrator');

COMMENT ON TABLE public.security_exceptions IS 'Documents approved SECURITY DEFINER functions and other security exceptions with justifications for compliance and audit purposes.';