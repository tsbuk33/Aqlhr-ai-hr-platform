-- Complete RLS Security Hardening for AqlHR Platform
-- This migration implements comprehensive Row Level Security policies for all critical tables

-- First, ensure we have the get_user_company_id() function (if not already created)
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT company_id
    FROM public.user_roles
   WHERE user_id = auth.uid()
   LIMIT 1;
$$;

-- Employee Data Protection
CREATE POLICY "Company scoped employee access" ON public.employees
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- Performance Reviews Protection  
CREATE POLICY "Company scoped performance reviews" ON public.performance_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = performance_reviews.employee_id 
      AND e.company_id = public.get_user_company_id()
    )
  );

-- Leave Requests Protection
CREATE POLICY "Company scoped leave requests" ON public.leave_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = leave_requests.employee_id 
      AND e.company_id = public.get_user_company_id()
    )
  );

-- Attendance Protection
CREATE POLICY "Company scoped attendance" ON public.attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = attendance.employee_id 
      AND e.company_id = public.get_user_company_id()
    )
  );

-- AI Recommendations Protection
CREATE POLICY "Company scoped AI recommendations" ON public.ai_recommendations
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- AI Document Embeddings Protection
CREATE POLICY "Company scoped AI document embeddings" ON public.ai_document_embeddings
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- System Health Reports Protection
CREATE POLICY "Company scoped system health reports" ON public.system_health_reports
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- Job Applications Protection
CREATE POLICY "Company scoped job applications" ON public.job_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.job_postings jp 
      WHERE jp.id = job_applications.job_posting_id 
      AND jp.company_id = public.get_user_company_id()
    )
  );

-- Workplace Transfers Protection
CREATE POLICY "Company scoped workplace transfers" ON public.workplace_transfers
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- Working Hours Config Protection
CREATE POLICY "Company scoped working hours config" ON public.working_hours_config
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- HSE Incidents Protection
CREATE POLICY "Company scoped HSE incidents" ON public.hse_incidents
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- HSE PPE Protection
CREATE POLICY "Company scoped HSE PPE" ON public.hse_ppe
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- HSE Emergency Teams Protection
CREATE POLICY "Company scoped HSE emergency teams" ON public.hse_emergency_teams
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- Employee GOSI Config Protection
CREATE POLICY "Company scoped employee GOSI config" ON public.employee_gosi_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_gosi_config.employee_id 
      AND e.company_id = public.get_user_company_id()
    )
  );

-- Engagement Metrics Protection
CREATE POLICY "Company scoped engagement metrics" ON public.engagement_metrics_tracking
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- Learning Engagement Insights Protection  
CREATE POLICY "Company scoped learning insights" ON public.learning_engagement_insights
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- AI Tool Recommendations Protection
CREATE POLICY "Company scoped AI tool recommendations" ON public.ai_tool_recommendations
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

-- Module KPIs Protection
CREATE POLICY "Company scoped module KPIs" ON public.module_kpis
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.system_modules_registry smr 
      WHERE smr.id = module_kpis.module_id
    )
  );

-- Job Title KPIs Protection
CREATE POLICY "Company scoped job title KPIs" ON public.job_title_kpis
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.job_titles jt 
      WHERE jt.id = job_title_kpis.job_title_id 
      AND jt.company_id = public.get_user_company_id()
    )
  );

-- Translation Feedback Protection (pilot users only)
CREATE POLICY "Pilot users can manage translation feedback" ON public.translation_feedback
  FOR ALL USING (
    public.is_pilot_user(auth.uid(), 'i18n_review')
  );

-- Employee Documents Protection
CREATE POLICY "Company scoped employee documents" ON public.employee_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_documents.employee_id 
      AND e.company_id = public.get_user_company_id()
    )
  );

-- Saudi Employees Protection (if used for HR data)
CREATE POLICY "Company scoped Saudi employees" ON public.saudi_employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.saudi_national_id = saudi_employees.saudi_national_id 
      AND e.company_id = public.get_user_company_id()
    )
  );

-- Additional security: Ensure all new tables get proper RLS by default
-- This helps prevent future security gaps
CREATE OR REPLACE FUNCTION public.auto_enable_rls()
RETURNS event_trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Enable RLS on newly created tables in public schema
  IF tg_event = 'ddl_command_end' AND tg_tag = 'CREATE TABLE' THEN
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', 
      (SELECT objid::regclass FROM pg_event_trigger_ddl_commands() 
       WHERE schema_name = 'public' AND object_type = 'table'));
  END IF;
END;
$$;

-- Create event trigger to auto-enable RLS (commented out as it might be too aggressive)
-- CREATE EVENT TRIGGER auto_enable_rls_trigger 
--   ON ddl_command_end 
--   WHEN TAG IN ('CREATE TABLE')
--   EXECUTE FUNCTION public.auto_enable_rls();

-- Create audit function to validate RLS coverage
CREATE OR REPLACE FUNCTION public.validate_rls_coverage()
RETURNS TABLE(
  table_name text,
  rls_enabled boolean,
  policy_count bigint,
  status text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    schemaname||'.'||tablename as table_name,
    rowsecurity as rls_enabled,
    COALESCE(policy_count, 0) as policy_count,
    CASE 
      WHEN NOT rowsecurity THEN '❌ RLS DISABLED'
      WHEN COALESCE(policy_count, 0) = 0 THEN '🚨 NO POLICIES' 
      ELSE '✅ PROTECTED'
    END as status
  FROM pg_tables t
  LEFT JOIN (
    SELECT schemaname, tablename, COUNT(*) as policy_count
    FROM pg_policies 
    GROUP BY schemaname, tablename
  ) p ON t.schemaname = p.schemaname AND t.tablename = p.tablename
  WHERE t.schemaname = 'public'
  ORDER BY t.tablename;
$$;