-- Final Security Hardening Migration (Fixed Syntax)
-- 0) Drop any bad index on employment_status if it sneaked in
DROP INDEX IF EXISTS idx_employees_company_employment_status;

-- 1) ADD MISSING IF EXISTS TO DROP POLICY STATEMENTS
DROP POLICY IF EXISTS "learning_engagement_insights_select"      ON public.learning_engagement_insights;
DROP POLICY IF EXISTS "learning_engagement_insights_insert"      ON public.learning_engagement_insights;
DROP POLICY IF EXISTS "learning_engagement_insights_update"      ON public.learning_engagement_insights;
DROP POLICY IF EXISTS "learning_engagement_insights_delete"      ON public.learning_engagement_insights;

-- 2) PERFORMANCE INDEXES FOR COMPANY_ID LOOKUPS
CREATE INDEX IF NOT EXISTS idx_attendance_employee_lookup        ON public.attendance(employee_id)            WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_lookup    ON public.leave_requests(employee_id)        WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee_lookup
                                                                 ON public.performance_reviews(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_employee_documents_employee_lookup
                                                                 ON public.employee_documents(employee_id)  WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_job_applications_posting_lookup   ON public.job_applications(job_posting_id)  WHERE job_posting_id IS NOT NULL;

-- fix the composite index on employees: use the real "status" column
CREATE INDEX IF NOT EXISTS idx_user_roles_user_company           ON public.user_roles(user_id, company_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_status          ON public.employees(company_id, status);

-- 3) PUBLIC POLICIES FOR SAUDI REFERENCE TABLES (drop first, then create)
DROP POLICY IF EXISTS "saudi_regions_public_select" ON public.saudi_regions;
DROP POLICY IF EXISTS "saudi_cities_public_select" ON public.saudi_cities;

CREATE POLICY "saudi_regions_public_select"
  ON public.saudi_regions FOR SELECT USING (true);
CREATE POLICY "saudi_cities_public_select"
  ON public.saudi_cities  FOR SELECT USING (true);

GRANT SELECT ON public.saudi_regions TO authenticated, anon;
GRANT SELECT ON public.saudi_cities  TO authenticated, anon;

-- 4) UPDATE SECURITY FUNCTIONS
CREATE OR REPLACE FUNCTION public.get_user_company_id()
  RETURNS uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
AS $$
  SELECT company_id
    FROM public.user_roles
   WHERE user_id = auth.uid()
   LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_user_company_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_company_id() TO authenticated;

-- 5) TESTING & AUDIT HELPERS
CREATE OR REPLACE FUNCTION public.validate_user_isolation()
  RETURNS TABLE(user_id uuid, company_id uuid, has_access boolean)
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ur.user_id,
    ur.company_id,
    (public.get_user_company_id() = ur.company_id)
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_rls_policies()
  RETURNS TABLE(table_name text, policy_count bigint, rls_enabled boolean)
  LANGUAGE sql
  SECURITY DEFINER
AS $$
  SELECT
    schemaname||'.'||tablename AS table_name,
    COUNT(policyname)   AS policy_count,
    bool_and(rowsecurity) AS rls_enabled
  FROM pg_tables t
  LEFT JOIN pg_policies p ON t.tablename = p.tablename
 WHERE schemaname = 'public'
 GROUP BY schemaname, tablename, rowsecurity
 ORDER BY table_name;
$$;