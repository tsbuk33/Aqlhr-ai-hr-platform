-- Fix security definer view issue by updating problematic views
-- Remove SECURITY DEFINER from any views that have it

-- First, let's check what views exist and fix any security definer issues
DO $$
DECLARE
    view_record RECORD;
    view_definition TEXT;
BEGIN
    -- Loop through all views in public schema
    FOR view_record IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        -- Get the view definition
        SELECT definition INTO view_definition
        FROM pg_views 
        WHERE schemaname = view_record.schemaname 
        AND viewname = view_record.viewname;
        
        -- Check if it contains SECURITY DEFINER and recreate without it
        IF view_definition IS NOT NULL THEN
            -- Drop and recreate the view without SECURITY DEFINER
            EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', view_record.schemaname, view_record.viewname);
            EXECUTE format('CREATE VIEW %I.%I AS %s', view_record.schemaname, view_record.viewname, view_definition);
        END IF;
    END LOOP;
END $$;

-- Also ensure all functions have proper search_path set
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT n.nspname as schema_name, p.proname as function_name, p.oid as function_oid
        FROM pg_proc p
        LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prokind = 'f'
    LOOP
        -- Set search_path for each function
        EXECUTE format('ALTER FUNCTION %I.%I SET search_path = public', func_record.schema_name, func_record.function_name);
    END LOOP;
END $$;