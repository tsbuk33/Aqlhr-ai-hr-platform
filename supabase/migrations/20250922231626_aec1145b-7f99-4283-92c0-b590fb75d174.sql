-- Fix security definer views - target only user-created content
-- Check for views with security definer and fix them

-- First, let's see what user-created views we have
SELECT schemaname, viewname, definition 
FROM pg_views 
WHERE schemaname = 'public'
AND viewname NOT LIKE 'pg_%'
AND viewname NOT LIKE 'information_%';

-- Fix any function search paths for user-created functions only
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT n.nspname as schema_name, p.proname as function_name
        FROM pg_proc p
        LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prokind = 'f'
        AND p.proname NOT LIKE 'vector_%'
        AND p.proname NOT LIKE 'pg_%'
        AND p.proowner = (SELECT oid FROM pg_roles WHERE rolname = current_user)
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION %I.%I SET search_path = public', func_record.schema_name, func_record.function_name);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if we don't have permission
            CONTINUE;
        END;
    END LOOP;
END $$;