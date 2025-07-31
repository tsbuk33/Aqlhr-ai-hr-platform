-- Fix ambiguous column reference in audit function
CREATE OR REPLACE FUNCTION public.audit_rls_policies()
  RETURNS TABLE(table_name text, policy_count bigint, rls_enabled boolean)
  LANGUAGE sql
  SECURITY DEFINER
AS $$
  SELECT
    t.schemaname || '.' || t.tablename           AS table_name,
    COUNT(p.policyname)                          AS policy_count,
    bool_and(t.rowsecurity)                      AS rls_enabled
  FROM pg_tables AS t
  LEFT JOIN pg_policies AS p
    ON p.schemaname = t.schemaname
   AND p.tablename  = t.tablename
  WHERE t.schemaname = 'public'
  GROUP BY t.schemaname, t.tablename, t.rowsecurity
  ORDER BY table_name;
$$;