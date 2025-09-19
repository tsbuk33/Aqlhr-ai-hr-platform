-- Fix Security Definer View Issue (Lint Error 0010)
-- This migration removes the SECURITY DEFINER property from the rls_coverage_report view
-- to fix the security vulnerability where the view uses creator's privileges instead of querying user's privileges

-- Drop the existing view with SECURITY DEFINER
DROP VIEW IF EXISTS public.rls_coverage_report;

-- Recreate the view as SECURITY INVOKER (default behavior)
-- This ensures the view uses the querying user's privileges, not the creator's
CREATE VIEW public.rls_coverage_report AS
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

-- Add RLS policy for the view to ensure proper access control
-- Only authenticated users should access this security reporting view
ALTER VIEW public.rls_coverage_report SET (security_invoker = true);

-- Grant appropriate permissions
GRANT SELECT ON public.rls_coverage_report TO authenticated;
GRANT SELECT ON public.rls_coverage_report TO service_role;