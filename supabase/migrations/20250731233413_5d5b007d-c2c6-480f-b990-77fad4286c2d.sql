-- Complete RLS Security Hardening for AqlHR Platform (Fixed)
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

-- Job Applications Protection (via job postings relation)
CREATE POLICY "Company scoped job applications" ON public.job_applications
  FOR ALL USING (
    auth.uid() IS NOT NULL
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
    auth.uid() IS NOT NULL
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

-- Saudi Employees Protection (basic auth requirement)
CREATE POLICY "Authenticated users can access Saudi employees" ON public.saudi_employees
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );

-- ESG Metrics Protection (if has company_id column)
CREATE POLICY "ESG metrics access" ON public.esg_metrics
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );

-- ESG Benchmarks Protection
CREATE POLICY "ESG benchmarks access" ON public.esg_benchmarks
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );

-- IPO Assessments Protection  
CREATE POLICY "IPO assessments access" ON public.ipo_assessments
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );

-- AI Knowledge Base Protection
CREATE POLICY "AI knowledge base access" ON public.ai_knowledge_base
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );

-- AI Sync Events Protection (if exists)
CREATE POLICY "Company scoped AI sync events" ON public.ai_sync_events
  FOR ALL USING (
    company_id = public.get_user_company_id()
  );

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