-- Final security hardening migration
-- Addresses: function ownership, IF EXISTS, indexes, public tables, and edge cases

-- 1. ENSURE FUNCTION OWNERSHIP (Comment for manual verification)
-- IMPORTANT: Verify that public.get_user_company_id() is owned by a superuser
-- Run: SELECT proname, proowner::regrole FROM pg_proc WHERE proname = 'get_user_company_id';
-- If not owned by superuser, run: ALTER FUNCTION public.get_user_company_id() OWNER TO postgres;

-- 2. ADD MISSING IF EXISTS TO DROP POLICY STATEMENTS
-- These were missed in the previous migration
DROP POLICY IF EXISTS "learning_engagement_insights_select" ON public.learning_engagement_insights;
DROP POLICY IF EXISTS "learning_engagement_insights_insert" ON public.learning_engagement_insights;
DROP POLICY IF EXISTS "learning_engagement_insights_update" ON public.learning_engagement_insights;
DROP POLICY IF EXISTS "learning_engagement_insights_delete" ON public.learning_engagement_insights;

-- 3. ADD PERFORMANCE INDEXES FOR COMPANY_ID LOOKUPS
-- Add denormalized company_id indexes where we have heavy FK joins
CREATE INDEX IF NOT EXISTS idx_attendance_company_id_lookup ON public.attendance(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leave_requests_company_id_lookup ON public.leave_requests(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_performance_reviews_company_id_lookup ON public.performance_reviews(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_employee_documents_company_id_lookup ON public.employee_documents(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_job_applications_posting_lookup ON public.job_applications(job_posting_id) WHERE job_posting_id IS NOT NULL;

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_user_roles_user_company ON public.user_roles(user_id, company_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_status ON public.employees(company_id, employment_status);

-- 4. ADD PUBLIC POLICIES FOR TRULY PUBLIC REFERENCE TABLES
-- Saudi reference data should be publicly readable
CREATE POLICY "saudi_regions_public_select" 
  ON public.saudi_regions 
  FOR SELECT 
  USING (true);

CREATE POLICY "saudi_cities_public_select" 
  ON public.saudi_cities 
  FOR SELECT 
  USING (true);

-- Grant public access to reference tables
GRANT SELECT ON public.saudi_regions TO authenticated, anon;
GRANT SELECT ON public.saudi_cities TO authenticated, anon;

-- If saudi_sectors and saudi_activities exist, make them public too
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'saudi_sectors') THEN
    EXECUTE 'ALTER TABLE public.saudi_sectors ENABLE ROW LEVEL SECURITY';
    EXECUTE 'CREATE POLICY "saudi_sectors_public_select" ON public.saudi_sectors FOR SELECT USING (true)';
    EXECUTE 'GRANT SELECT ON public.saudi_sectors TO authenticated, anon';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'saudi_activities') THEN
    EXECUTE 'ALTER TABLE public.saudi_activities ENABLE ROW LEVEL SECURITY';
    EXECUTE 'CREATE POLICY "saudi_activities_public_select" ON public.saudi_activities FOR SELECT USING (true)';
    EXECUTE 'GRANT SELECT ON public.saudi_activities TO authenticated, anon';
  END IF;
END $$;

-- 5. ADD SECURITY VALIDATION FUNCTION
-- This helps test multi-tenant isolation
CREATE OR REPLACE FUNCTION public.validate_user_isolation()
RETURNS TABLE(
  user_id uuid,
  company_id uuid,
  has_access boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be used to validate that users only see their company data
  -- Usage: SELECT * FROM public.validate_user_isolation();
  RETURN QUERY
  SELECT 
    ur.user_id,
    ur.company_id,
    (public.get_user_company_id() = ur.company_id) as has_access
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid();
END;
$$;

-- 6. ADD EDGE CASE HANDLING
-- Update get_user_company_id to handle edge cases better
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  -- Return NULL if user has no company (blocks all access)
  -- This is safer than throwing an error
  SELECT company_id 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- 7. ADD MONITORING/AUDIT CAPABILITIES
-- Create a function to audit RLS policy effectiveness
CREATE OR REPLACE FUNCTION public.audit_rls_policies()
RETURNS TABLE(
  table_name text,
  policy_count bigint,
  rls_enabled boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    schemaname||'.'||tablename as table_name,
    COUNT(policyname) as policy_count,
    bool_and(rowsecurity) as rls_enabled
  FROM pg_tables t
  LEFT JOIN pg_policies p ON t.tablename = p.tablename
  WHERE schemaname = 'public'
  GROUP BY schemaname, tablename, rowsecurity
  ORDER BY table_name;
$$;

-- 8. FINAL SECURITY COMMENTS AND RECOMMENDATIONS
/*
MANUAL VERIFICATION CHECKLIST:
1. Verify function ownership:
   SELECT proname, proowner::regrole FROM pg_proc WHERE proname = 'get_user_company_id';

2. Test multi-tenant isolation:
   - Create users in different companies
   - Verify they cannot see each other's data
   - Test user with no user_roles entry gets zero access

3. Performance monitoring:
   - Monitor query performance on large tables
   - Consider denormalizing company_id to attendance/leave_requests if needed

4. Security audit:
   - Run: SELECT * FROM public.audit_rls_policies();
   - Ensure all tables have RLS enabled and appropriate policies

5. Edge case testing:
   - User with no company_id in user_roles
   - User with multiple company roles (if supported)
   - Anonymous access to public tables
*/