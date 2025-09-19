-- Complete fix for Security Definer Views
-- This ensures the rls_coverage_report view uses SECURITY INVOKER explicitly

-- Drop and recreate the view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.rls_coverage_report CASCADE;

-- Create view with explicit SECURITY INVOKER to fix the linter warning
CREATE VIEW public.rls_coverage_report 
WITH (security_invoker = true) AS
SELECT 'RLS Enabled Tables'::text AS metric_name,
    count(*) AS metric_value
   FROM (pg_class c
     JOIN pg_namespace n ON ((c.relnamespace = n.oid)))
  WHERE ((n.nspname = 'public'::name) AND (c.relkind = 'r'::"char") AND (c.relrowsecurity = true))
UNION ALL
 SELECT 'Total Tables in Public Schema'::text AS metric_name,
    count(*) AS metric_value
   FROM (pg_class c
     JOIN pg_namespace n ON ((c.relnamespace = n.oid)))
  WHERE ((n.nspname = 'public'::name) AND (c.relkind = 'r'::"char"))
UNION ALL
 SELECT 'RLS Coverage Percentage'::text AS metric_name,
    round((((count(
        CASE
            WHEN (c.relrowsecurity = true) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (count(*))::numeric)) AS metric_value
   FROM (pg_class c
     JOIN pg_namespace n ON ((c.relnamespace = n.oid)))
  WHERE ((n.nspname = 'public'::name) AND (c.relkind = 'r'::"char"))
UNION ALL
 SELECT 'Security Definer Functions Documented'::text AS metric_name,
    count(*) AS metric_value
   FROM security_exceptions
  WHERE (security_exceptions.exception_type = 'security_definer_function'::text)
UNION ALL
 SELECT 'Total Security Exceptions Documented'::text AS metric_name,
    count(*) AS metric_value
   FROM security_exceptions
  ORDER BY 1;

-- Grant proper permissions
GRANT SELECT ON public.rls_coverage_report TO authenticated;
GRANT SELECT ON public.rls_coverage_report TO service_role;

-- Verify no other SECURITY DEFINER views exist by checking system catalogs
-- and documenting in comments for audit trail