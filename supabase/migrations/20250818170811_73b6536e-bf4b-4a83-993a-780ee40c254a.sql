-- CRITICAL SECURITY FIX: Update RLS policies for proper company isolation
-- This migration fixes cross-company data exposure vulnerabilities

-- 1. Fix employees table RLS policies
DROP POLICY IF EXISTS "Users can manage employees from their company" ON public.employees;
CREATE POLICY "Users can manage employees from their company" 
ON public.employees 
FOR ALL 
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 2. Fix saudi_employees table RLS policies (check if exists first)
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

-- 4. Fix hse_medical_surveillance table RLS policies
DROP POLICY IF EXISTS "Users can manage HSE medical surveillance from their company" ON public.hse_medical_surveillance;
CREATE POLICY "Users can manage HSE medical surveillance from their company"
ON public.hse_medical_surveillance
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 5. Fix profiles table RLS policies to be more secure
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

-- 6. Fix training_programs table RLS policies
DROP POLICY IF EXISTS "Users can manage training programs from their company" ON public.training_programs;
CREATE POLICY "Users can manage training programs from their company"
ON public.training_programs
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 7. Fix leave_types table RLS policies
DROP POLICY IF EXISTS "Users can manage leave types from their company" ON public.leave_types;
CREATE POLICY "Users can manage leave types from their company"
ON public.leave_types
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 8. Fix system_settings table RLS policies
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

-- 9. Fix payroll_periods table RLS policies
DROP POLICY IF EXISTS "Users can manage payroll periods from their company" ON public.payroll_periods;
CREATE POLICY "Users can manage payroll periods from their company"
ON public.payroll_periods
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 10. Fix performance_cycles table RLS policies
DROP POLICY IF EXISTS "Users can manage performance cycles from their company" ON public.performance_cycles;
CREATE POLICY "Users can manage performance cycles from their company"
ON public.performance_cycles
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 11. Fix job_postings table RLS policies
DROP POLICY IF EXISTS "Users can manage job postings from their company" ON public.job_postings;
CREATE POLICY "Users can manage job postings from their company"
ON public.job_postings
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 12. Fix subscriptions table RLS policies for better security
DROP POLICY IF EXISTS "Users can manage their company subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their company subscriptions" ON public.subscriptions;

CREATE POLICY "Users can manage their own subscriptions"
ON public.subscriptions
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 13. Fix tool_integrations table RLS policies
DROP POLICY IF EXISTS "Users can manage their company tool integrations" ON public.tool_integrations;
CREATE POLICY "Users can manage their company tool integrations"
ON public.tool_integrations
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 14. Fix nitaqat_tracking table RLS policies
DROP POLICY IF EXISTS "Users can manage Nitaqat tracking from their company" ON public.nitaqat_tracking;
CREATE POLICY "Users can manage Nitaqat tracking from their company"
ON public.nitaqat_tracking
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 15. Fix ai_predictions table RLS policies
DROP POLICY IF EXISTS "Users can view AI predictions from their company" ON public.ai_predictions;
CREATE POLICY "Users can manage AI predictions from their company"
ON public.ai_predictions
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 16. Fix ai_sync_events table RLS policies
DROP POLICY IF EXISTS "Users can view AI sync events from their company" ON public.ai_sync_events;
CREATE POLICY "Users can manage AI sync events from their company"
ON public.ai_sync_events
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 17. Fix audit_logs table RLS policies
DROP POLICY IF EXISTS "Users can view audit logs from their company" ON public.audit_logs;
CREATE POLICY "Users can view audit logs from their company"
ON public.audit_logs
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 18. Fix attendance_locations table RLS policies
DROP POLICY IF EXISTS "Users can view attendance locations from their company" ON public.attendance_locations;
CREATE POLICY "Users can manage attendance locations from their company"
ON public.attendance_locations
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 19. Fix hse_training table RLS policies
DROP POLICY IF EXISTS "Users can manage HSE training from their company" ON public.hse_training;
CREATE POLICY "Users can manage HSE training from their company"
ON public.hse_training
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

-- 20. Fix hse_compliance table RLS policies
DROP POLICY IF EXISTS "Users can manage HSE compliance from their company" ON public.hse_compliance;
CREATE POLICY "Users can manage HSE compliance from their company"
ON public.hse_compliance
FOR ALL
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());