-- CRITICAL SECURITY FIX: Update RLS policies for proper company isolation
-- This migration fixes cross-company data exposure vulnerabilities

-- 1. Fix employees table RLS policies
DROP POLICY IF EXISTS "Users can manage employees from their company" ON public.employees;
CREATE POLICY "Users can manage employees from their company" 
ON public.employees 
FOR ALL 
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 2. Fix saudi_employees table RLS policies  
DROP POLICY IF EXISTS "Users can manage Saudi employees from their company" ON public.saudi_employees;
CREATE POLICY "Users can manage Saudi employees from their company"
ON public.saudi_employees
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 3. Fix payroll table RLS policies
DROP POLICY IF EXISTS "Users can view payroll from their company" ON public.payroll;
CREATE POLICY "Users can manage payroll from their company"
ON public.payroll
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 4. Fix saudi_payroll table RLS policies
DROP POLICY IF EXISTS "Users can manage Saudi payroll from their company" ON public.saudi_payroll;
CREATE POLICY "Users can manage Saudi payroll from their company"
ON public.saudi_payroll
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 5. Fix attendance table RLS policies
DROP POLICY IF EXISTS "Users can manage attendance from their company" ON public.attendance;
CREATE POLICY "Users can manage attendance from their company"
ON public.attendance
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 6. Fix saudi_documents table RLS policies
DROP POLICY IF EXISTS "Users can manage Saudi documents from their company" ON public.saudi_documents;
CREATE POLICY "Users can manage Saudi documents from their company"
ON public.saudi_documents
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = saudi_documents.employee_id 
    AND e.company_id = public.get_user_company_id()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = saudi_documents.employee_id 
    AND e.company_id = public.get_user_company_id()
  )
);

-- 7. Fix hse_medical_surveillance table RLS policies
DROP POLICY IF EXISTS "Users can manage HSE medical surveillance from their company" ON public.hse_medical_surveillance;
CREATE POLICY "Users can manage HSE medical surveillance from their company"
ON public.hse_medical_surveillance
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 8. Fix profiles table RLS policies to be more secure
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 9. Fix additional tables with weak RLS policies
DROP POLICY IF EXISTS "Users can manage training programs from their company" ON public.training_programs;
CREATE POLICY "Users can manage training programs from their company"
ON public.training_programs
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

DROP POLICY IF EXISTS "Users can manage leave types from their company" ON public.leave_types;
CREATE POLICY "Users can manage leave types from their company"
ON public.leave_types
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

DROP POLICY IF EXISTS "Users can manage system settings from their company" ON public.system_settings;
CREATE POLICY "Users can manage system settings from their company"
ON public.system_settings
FOR ALL
USING (
  company_id = public.get_user_company_id() OR 
  (is_system_setting = true AND company_id IS NULL)
)
WITH CHECK (
  company_id = public.get_user_company_id() OR 
  (is_system_setting = true AND company_id IS NULL)
);

-- 10. Fix payroll_periods table RLS policies
DROP POLICY IF EXISTS "Users can manage payroll periods from their company" ON public.payroll_periods;
CREATE POLICY "Users can manage payroll periods from their company"
ON public.payroll_periods
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 11. Fix performance_cycles table RLS policies
DROP POLICY IF EXISTS "Users can manage performance cycles from their company" ON public.performance_cycles;
CREATE POLICY "Users can manage performance cycles from their company"
ON public.performance_cycles
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 12. Fix job_postings table RLS policies
DROP POLICY IF EXISTS "Users can manage job postings from their company" ON public.job_postings;
CREATE POLICY "Users can manage job postings from their company"
ON public.job_postings
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 13. Fix employee_positions table RLS policies
DROP POLICY IF EXISTS "Users can manage employee positions from their company" ON public.employee_positions;
CREATE POLICY "Users can manage employee positions from their company"
ON public.employee_positions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = employee_positions.employee_id 
    AND e.company_id = public.get_user_company_id()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = employee_positions.employee_id 
    AND e.company_id = public.get_user_company_id()
  )
);

-- 14. Fix employee_kpi_assignments table RLS policies
DROP POLICY IF EXISTS "Users can manage employee KPI assignments from their company" ON public.employee_kpi_assignments;
CREATE POLICY "Users can manage employee KPI assignments from their company"
ON public.employee_kpi_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = employee_kpi_assignments.employee_id 
    AND e.company_id = public.get_user_company_id()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = employee_kpi_assignments.employee_id 
    AND e.company_id = public.get_user_company_id()
  )
);

-- 15. Fix subscriptions table RLS policies for better security
DROP POLICY IF EXISTS "Users can manage their company subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their company subscriptions" ON public.subscriptions;

CREATE POLICY "Users can manage their own subscriptions"
ON public.subscriptions
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 16. Add security audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    company_id,
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    COALESCE(NEW.company_id, OLD.company_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    inet_client_addr()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_employees_trigger ON public.employees;
CREATE TRIGGER audit_employees_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();

DROP TRIGGER IF EXISTS audit_payroll_trigger ON public.payroll;
CREATE TRIGGER audit_payroll_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.payroll
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();

DROP TRIGGER IF EXISTS audit_saudi_documents_trigger ON public.saudi_documents;
CREATE TRIGGER audit_saudi_documents_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.saudi_documents
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();