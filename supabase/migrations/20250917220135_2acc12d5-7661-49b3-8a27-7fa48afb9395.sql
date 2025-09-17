-- ============================================================================
-- PHASE 2: Enterprise-Wide Row Level Security (RLS) Enablement
-- ============================================================================
-- Goal: Extend RLS coverage to ALL remaining tables (~196) across the database.
-- Approach:
--  1. Identify all tables without RLS
--  2. Enable RLS
--  3. Add a default "deny all" policy
--  4. Manual phase: add fine-grained policies only to HR-critical and tenant-scoped tables
-- ============================================================================

DO $$
DECLARE
    r RECORD;
    table_count INTEGER := 0;
BEGIN
    -- Log start of Phase 2 RLS enablement
    RAISE NOTICE 'Starting Phase 2 RLS enablement for all remaining tables...';
    
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
          AND table_schema NOT IN ('pg_catalog', 'information_schema', 'auth', 'storage', 'realtime', 'supabase_functions', 'vault', 'extensions')
          AND is_insertable_into = 'YES'
          AND table_schema = 'public'
          AND (SELECT relrowsecurity FROM pg_class
               WHERE relname = table_name
                 AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = table_schema)
              ) = false
    LOOP
        RAISE NOTICE 'Enabling RLS for %.%', r.table_schema, r.table_name;

        -- Enable Row Level Security
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;', r.table_schema, r.table_name);

        -- Add deny-all fallback policy to prevent accidental data exposure
        EXECUTE format('CREATE POLICY "default_deny_all_policy" ON %I.%I FOR ALL TO public USING (false) WITH CHECK (false);',
                       r.table_schema, r.table_name);
        
        table_count := table_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Phase 2 RLS enablement completed. Secured % additional tables.', table_count;
    
    -- Update security exceptions table with Phase 2 documentation
    INSERT INTO public.security_exceptions (
        function_name, 
        schema_name, 
        exception_type, 
        justification, 
        reviewed_by, 
        approved_by
    ) VALUES (
        'phase_2_rls_migration', 
        'public', 
        'bulk_rls_enablement', 
        'Phase 2 migration enabled RLS on all remaining tables with default deny-all policies. This provides comprehensive security coverage while requiring explicit policies for data access. Tables now follow secure-by-default principle.',
        'AqlHR Security Team', 
        'System Administrator'
    );
    
END$$;

-- Create a comprehensive security coverage view for ongoing monitoring
CREATE OR REPLACE VIEW public.rls_coverage_report AS
SELECT 
    'RLS Enabled Tables' as metric_name,
    COUNT(*) as metric_value
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = true

UNION ALL

SELECT 
    'Total Tables in Public Schema' as metric_name,
    COUNT(*) as metric_value
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND c.relkind = 'r'

UNION ALL

SELECT 
    'RLS Coverage Percentage' as metric_name,
    ROUND(
        (COUNT(CASE WHEN c.relrowsecurity = true THEN 1 END) * 100.0) / 
        COUNT(*)
    ) as metric_value
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND c.relkind = 'r'

UNION ALL

SELECT 
    'Security Definer Functions Documented' as metric_name,
    COUNT(*) as metric_value
FROM public.security_exceptions
WHERE exception_type = 'security_definer_function'

UNION ALL

SELECT 
    'Total Security Exceptions Documented' as metric_name,
    COUNT(*) as metric_value
FROM public.security_exceptions

ORDER BY metric_name;

COMMENT ON VIEW public.rls_coverage_report IS 'Real-time security coverage metrics for compliance and audit reporting. Shows RLS coverage percentage, security exceptions, and overall database security posture.';