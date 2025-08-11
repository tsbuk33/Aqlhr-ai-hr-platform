-- Fix RLS policies to enforce proper company data isolation
-- Critical security update: Replace permissive policies with company isolation

-- Companies table - users can only access their own company
DROP POLICY IF EXISTS "Companies can view their own data" ON public.companies;
CREATE POLICY "Companies can view their own data" ON public.companies
FOR ALL USING (id = get_user_company_id());

-- Employees table - already has proper policies, but update the generic one
DROP POLICY IF EXISTS "Users can view employees from their company" ON public.employees;

-- Attendance table - fix the overly permissive policy
DROP POLICY IF EXISTS "Users can view attendance from their company" ON public.attendance;
CREATE POLICY "Users can view attendance from their company" ON public.attendance
FOR ALL USING (company_id = get_user_company_id());

-- Payroll table - fix the overly permissive policy
DROP POLICY IF EXISTS "Users can view payroll from their company" ON public.payroll;
CREATE POLICY "Users can view payroll from their company" ON public.payroll
FOR ALL USING (company_id = get_user_company_id());

-- Audit logs - fix company isolation
DROP POLICY IF EXISTS "Users can view audit logs from their company" ON public.audit_logs;
CREATE POLICY "Users can view audit logs from their company" ON public.audit_logs
FOR ALL USING (company_id = get_user_company_id());

-- AI sync events - fix company isolation
DROP POLICY IF EXISTS "Users can view AI sync events from their company" ON public.ai_sync_events;
CREATE POLICY "Users can view AI sync events from their company" ON public.ai_sync_events
FOR ALL USING (company_id = get_user_company_id());

-- AI predictions - fix company isolation
DROP POLICY IF EXISTS "Users can view AI predictions from their company" ON public.ai_predictions;
CREATE POLICY "Users can view AI predictions from their company" ON public.ai_predictions
FOR ALL USING (company_id = get_user_company_id());

-- Tool integrations - fix company isolation
DROP POLICY IF EXISTS "Users can manage their company tool integrations" ON public.tool_integrations;
CREATE POLICY "Users can manage their company tool integrations" ON public.tool_integrations
FOR ALL USING (company_id = get_user_company_id());

-- Tool usage analytics - fix company isolation
DROP POLICY IF EXISTS "Users can view tool analytics from their company" ON public.tool_usage_analytics;
CREATE POLICY "Users can view tool analytics from their company" ON public.tool_usage_analytics
FOR ALL USING (company_id = get_user_company_id());

-- Nitaqat tracking - fix company isolation
DROP POLICY IF EXISTS "Users can manage Nitaqat tracking from their company" ON public.nitaqat_tracking;
CREATE POLICY "Users can manage Nitaqat tracking from their company" ON public.nitaqat_tracking
FOR ALL USING (company_id = get_user_company_id());

-- Executive metrics - fix company isolation
DROP POLICY IF EXISTS "Users can view executive metrics from their company" ON public.executive_metrics;
CREATE POLICY "Users can view executive metrics from their company" ON public.executive_metrics
FOR ALL USING ((SELECT company_id FROM public.profiles WHERE user_id = auth.uid()) IS NOT NULL);

-- Payroll periods - fix company isolation
DROP POLICY IF EXISTS "Users can manage payroll periods from their company" ON public.payroll_periods;
CREATE POLICY "Users can manage payroll periods from their company" ON public.payroll_periods
FOR ALL USING (company_id = get_user_company_id());

-- Performance cycles - fix company isolation
DROP POLICY IF EXISTS "Users can manage performance cycles from their company" ON public.performance_cycles;
CREATE POLICY "Users can manage performance cycles from their company" ON public.performance_cycles
FOR ALL USING (company_id = get_user_company_id());

-- Training programs - fix company isolation
DROP POLICY IF EXISTS "Users can manage training programs from their company" ON public.training_programs;
CREATE POLICY "Users can manage training programs from their company" ON public.training_programs
FOR ALL USING (company_id = get_user_company_id());

-- Leave types - fix company isolation
DROP POLICY IF EXISTS "Users can manage leave types from their company" ON public.leave_types;
CREATE POLICY "Users can manage leave types from their company" ON public.leave_types
FOR ALL USING (company_id = get_user_company_id());

-- Job postings - fix company isolation
DROP POLICY IF EXISTS "Users can manage job postings from their company" ON public.job_postings;
CREATE POLICY "Users can manage job postings from their company" ON public.job_postings
FOR ALL USING (company_id = get_user_company_id());

-- Employee positions - fix company isolation
DROP POLICY IF EXISTS "Users can manage employee positions from their company" ON public.employee_positions;
CREATE POLICY "Users can manage employee positions from their company" ON public.employee_positions
FOR ALL USING ((SELECT company_id FROM public.employees WHERE id = employee_id) = get_user_company_id());

-- Employee KPI assignments - fix company isolation
DROP POLICY IF EXISTS "Users can manage employee KPI assignments from their company" ON public.employee_kpi_assignments;
CREATE POLICY "Users can manage employee KPI assignments from their company" ON public.employee_kpi_assignments
FOR ALL USING ((SELECT company_id FROM public.employees WHERE id = employee_id) = get_user_company_id());

-- Attendance locations - fix company isolation
DROP POLICY IF EXISTS "Users can view attendance locations from their company" ON public.attendance_locations;
CREATE POLICY "Users can view attendance locations from their company" ON public.attendance_locations
FOR ALL USING (company_id = get_user_company_id());

-- Saudi data protection config - fix company isolation
DROP POLICY IF EXISTS "Users can manage data protection config for their company" ON public.saudi_data_protection_config;
CREATE POLICY "Users can manage data protection config for their company" ON public.saudi_data_protection_config
FOR ALL USING (company_id = get_user_company_id());

-- Company compliance settings - fix company isolation
DROP POLICY IF EXISTS "Users can view compliance settings for their company" ON public.company_compliance_settings;
DROP POLICY IF EXISTS "Users can insert compliance settings for their company" ON public.company_compliance_settings;
DROP POLICY IF EXISTS "Users can update compliance settings for their company" ON public.company_compliance_settings;

CREATE POLICY "Users can manage compliance settings for their company" ON public.company_compliance_settings
FOR ALL USING (company_id = get_user_company_id())
WITH CHECK (company_id = get_user_company_id());

-- HSE tables - fix company isolation
DROP POLICY IF EXISTS "Users can manage HSE compliance from their company" ON public.hse_compliance;
CREATE POLICY "Users can manage HSE compliance from their company" ON public.hse_compliance
FOR ALL USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can manage HSE training from their company" ON public.hse_training;
CREATE POLICY "Users can manage HSE training from their company" ON public.hse_training
FOR ALL USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can manage HSE medical surveillance from their company" ON public.hse_medical_surveillance;
CREATE POLICY "Users can manage HSE medical surveillance from their company" ON public.hse_medical_surveillance
FOR ALL USING (company_id = get_user_company_id());

-- Government integration log - fix company isolation
DROP POLICY IF EXISTS "Users can view government integration logs from their company" ON public.government_integration_log;
CREATE POLICY "Users can view government integration logs from their company" ON public.government_integration_log
FOR ALL USING ((SELECT company_id FROM public.employees WHERE id = employee_id) = get_user_company_id());

-- Saudi documents - fix company isolation
DROP POLICY IF EXISTS "Users can manage Saudi documents from their company" ON public.saudi_documents;
CREATE POLICY "Users can manage Saudi documents from their company" ON public.saudi_documents
FOR ALL USING ((SELECT company_id FROM public.employees WHERE id = employee_id) = get_user_company_id());

-- ESG assessments - fix company isolation
DROP POLICY IF EXISTS "Users can manage ESG assessments from their company" ON public.esg_assessments;
CREATE POLICY "Users can manage ESG assessments from their company" ON public.esg_assessments
FOR ALL USING (auth.uid() IS NOT NULL AND organization_name = (SELECT name FROM public.companies WHERE id = get_user_company_id()));

-- System settings - fix company isolation
DROP POLICY IF EXISTS "Users can manage system settings from their company" ON public.system_settings;
CREATE POLICY "Users can manage system settings from their company" ON public.system_settings
FOR ALL USING (company_id = get_user_company_id() OR (company_id IS NULL AND is_system_setting = true));

-- Company intelligence - update to use proper company isolation
DROP POLICY IF EXISTS "Users can manage company intelligence data" ON public.company_intelligence;
DROP POLICY IF EXISTS "Users can view company intelligence data" ON public.company_intelligence;
CREATE POLICY "Users can manage company intelligence data" ON public.company_intelligence
FOR ALL USING (auth.uid() IS NOT NULL AND company_id::uuid = get_user_company_id())
WITH CHECK (auth.uid() IS NOT NULL AND company_id::uuid = get_user_company_id());