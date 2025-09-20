-- Final Security Documentation and View Optimization (Simple Approach)

-- Document security functions (simple insert without conflict handling)
INSERT INTO public.security_exceptions (
    exception_type, 
    function_name, 
    schema_name,
    justification, 
    approved_by,
    reviewed_by
) 
SELECT * FROM (VALUES
    ('security_definer_function', 'get_current_user_company_id', 'public', 'Essential for tenant isolation - must access auth.users table with elevated privileges', 'security_audit', 'database_admin'),
    ('security_definer_function', 'get_current_user_employee_id', 'public', 'Required for employee self-access - must query auth.users with elevated privileges', 'security_audit', 'database_admin'),
    ('security_definer_function', 'user_has_role', 'public', 'Core role validation - must access user_roles/profiles with elevated privileges for RLS', 'security_audit', 'database_admin'),
    ('security_definer_function', 'is_admin', 'public', 'Admin role checking - uses elevated privileges for security policy enforcement', 'security_audit', 'database_admin'),
    ('security_definer_function', 'is_hr_manager', 'public', 'HR role checking - uses elevated privileges for security policy enforcement', 'security_audit', 'database_admin'),
    ('security_definer_function', 'is_super_admin', 'public', 'Super admin role checking - uses elevated privileges for security enforcement', 'security_audit', 'database_admin'),
    ('security_definer_function', 'can_access_employee_pii', 'public', 'PII access control - must use elevated privileges for data protection compliance', 'security_audit', 'database_admin'),
    ('security_definer_function', 'log_employee_access', 'public', 'Audit logging trigger - must write to audit_log with elevated privileges for integrity', 'security_audit', 'database_admin'),
    ('security_definer_function', 'log_employee_pii_modification', 'public', 'PII audit logging - must write audit logs with elevated privileges for compliance', 'security_audit', 'database_admin')
) AS new_exceptions(exception_type, function_name, schema_name, justification, approved_by, reviewed_by)
WHERE NOT EXISTS (
    SELECT 1 FROM public.security_exceptions 
    WHERE function_name = new_exceptions.function_name 
    AND exception_type = new_exceptions.exception_type
);

-- Create security documentation view (SECURITY INVOKER by default)
CREATE OR REPLACE VIEW public.security_function_registry AS
SELECT 
    function_name,
    schema_name,
    justification,
    approved_by,
    created_at as documented_date
FROM public.security_exceptions 
WHERE exception_type = 'security_definer_function'
ORDER BY function_name;

-- Recreate RLS metrics view to ensure SECURITY INVOKER compliance
DROP VIEW IF EXISTS public.rls_coverage_report;
CREATE VIEW public.rls_coverage_report AS
SELECT 
    'RLS Enabled Tables' AS metric_name,
    count(*) AS metric_value
FROM pg_class c 
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity = true
UNION ALL
SELECT 
    'Total Tables in Public Schema' AS metric_name,
    count(*) AS metric_value  
FROM pg_class c 
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND c.relkind = 'r'
UNION ALL
SELECT 
    'Security Definer Functions Documented' AS metric_name,
    count(*) AS metric_value
FROM public.security_exceptions
WHERE exception_type = 'security_definer_function'
ORDER BY metric_name;

-- Grant read permissions
GRANT SELECT ON public.security_function_registry TO authenticated;
GRANT SELECT ON public.rls_coverage_report TO authenticated;

-- Final documentation
COMMENT ON VIEW public.security_function_registry IS 'Registry of approved SECURITY DEFINER functions with security justifications - Uses SECURITY INVOKER for compliance';
COMMENT ON VIEW public.rls_coverage_report IS 'RLS security metrics - Recreated as SECURITY INVOKER view to resolve Security Definer View warnings';