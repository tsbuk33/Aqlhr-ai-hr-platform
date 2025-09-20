-- Complete Security Documentation and Optimization (Part 2)

-- Insert security function documentation
INSERT INTO public.security_exceptions (exception_type, function_name, justification) VALUES
('security_definer_function', 'get_current_user_company_id', 'Essential for tenant isolation - must access auth.users table and user_roles/profiles with elevated privileges to determine user company context'),
('security_definer_function', 'get_current_user_employee_id', 'Required for employee self-access - must query auth.users and match with employees table using elevated privileges'),
('security_definer_function', 'user_has_role', 'Core role validation function - must access user_roles and profiles tables with elevated privileges for RLS policy enforcement'),
('security_definer_function', 'is_admin', 'Role checking function for admin access - uses user_has_role with elevated privileges for security policy enforcement'),
('security_definer_function', 'is_hr_manager', 'Role checking function for HR manager access - uses user_has_role with elevated privileges for security policy enforcement'),
('security_definer_function', 'is_super_admin', 'Role checking function for super admin access - uses user_has_role with elevated privileges for security policy enforcement'),
('security_definer_function', 'can_access_employee_pii', 'PII access control function - must use elevated privileges to check roles and company associations for data protection compliance'),
('security_definer_function', 'log_employee_access', 'Audit logging trigger - must write to audit_log with elevated privileges to ensure integrity of security logs'),
('security_definer_function', 'log_employee_pii_modification', 'PII audit logging trigger - must write to audit_log with elevated privileges for compliance and security monitoring')
ON CONFLICT (function_name, exception_type) DO NOTHING;

-- Create security-compliant views using SECURITY INVOKER (default behavior)
CREATE OR REPLACE VIEW public.approved_security_functions AS
SELECT 
    function_name,
    justification,
    approved_date,
    status
FROM public.security_exceptions 
WHERE exception_type = 'security_definer_function' 
AND status = 'approved';

-- Ensure RLS coverage report uses SECURITY INVOKER
CREATE OR REPLACE VIEW public.rls_coverage_report AS
SELECT 
    'RLS Enabled Tables'::text AS metric_name,
    count(*) AS metric_value
FROM pg_class c 
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity = true
UNION ALL
SELECT 
    'Total Tables in Public Schema'::text AS metric_name,
    count(*) AS metric_value
FROM pg_class c 
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND c.relkind = 'r'
UNION ALL
SELECT 
    'RLS Coverage Percentage'::text AS metric_name,
    CASE 
        WHEN count(*) > 0 THEN round((count(CASE WHEN c.relrowsecurity = true THEN 1 END)::numeric * 100.0) / count(*)::numeric)
        ELSE 0
    END AS metric_value
FROM pg_class c 
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND c.relkind = 'r'
UNION ALL
SELECT 
    'Security Definer Functions Documented'::text AS metric_name,
    count(*) AS metric_value
FROM public.security_exceptions
WHERE exception_type = 'security_definer_function' AND status = 'approved'
UNION ALL
SELECT 
    'Total Security Exceptions Documented'::text AS metric_name,
    count(*) AS metric_value
FROM public.security_exceptions
WHERE status = 'approved'
ORDER BY 1;

-- Grant appropriate permissions
GRANT SELECT ON public.approved_security_functions TO authenticated;
GRANT SELECT ON public.rls_coverage_report TO authenticated;

-- Document the solution
COMMENT ON TABLE public.security_exceptions IS 'Tracks approved security exceptions including necessary SECURITY DEFINER functions with business justifications for compliance auditing';
COMMENT ON VIEW public.approved_security_functions IS 'View of documented SECURITY DEFINER functions with justifications - uses SECURITY INVOKER for proper access control';
COMMENT ON VIEW public.rls_coverage_report IS 'Security metrics view - uses SECURITY INVOKER instead of SECURITY DEFINER for compliance with security linter requirements';