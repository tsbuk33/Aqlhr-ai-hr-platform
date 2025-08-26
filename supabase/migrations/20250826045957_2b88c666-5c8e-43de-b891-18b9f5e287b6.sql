-- Targeted security fixes for existing functions only

-- Convert functions that don't need elevated privileges to SECURITY INVOKER
ALTER FUNCTION public.apply_translation_patch(p_key text, p_language text, p_text text, p_confidence numeric) SECURITY INVOKER;
ALTER FUNCTION public.auto_classify_employee_gosi(p_employee_id uuid) SECURITY INVOKER;
ALTER FUNCTION public.calculate_gosi_rates(p_employee_id uuid, p_as_of_date date) SECURITY INVOKER;

-- Add proper search_path to existing SECURITY DEFINER functions that need it
-- Only modify functions that exist in the database

-- Core functions (check existence first)
DO $$
BEGIN
    -- Add search_path to functions that exist and need SECURITY DEFINER
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'ask_headcount_v1') THEN
        EXECUTE 'ALTER FUNCTION public.ask_headcount_v1(p_tenant uuid) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'ask_saudization_status_v1') THEN
        EXECUTE 'ALTER FUNCTION public.ask_saudization_status_v1(p_tenant uuid) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'ask_iqama_expiring_summary_v1') THEN
        EXECUTE 'ALTER FUNCTION public.ask_iqama_expiring_summary_v1(p_tenant uuid, p_days integer) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'ask_iqama_expiring_list_admin_v1') THEN
        EXECUTE 'ALTER FUNCTION public.ask_iqama_expiring_list_admin_v1(p_tenant uuid, p_days integer) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'roi_emit_event') THEN
        EXECUTE 'ALTER FUNCTION public.roi_emit_event(p_tenant uuid, p_event text, p_qty numeric, p_module text, p_ref uuid, p_meta jsonb) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'roi_snapshot_upsert_v1') THEN
        EXECUTE 'ALTER FUNCTION public.roi_snapshot_upsert_v1(p_tenant uuid, p_date date) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'roi_get_last30_v1') THEN
        EXECUTE 'ALTER FUNCTION public.roi_get_last30_v1(p_tenant uuid) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'has_role') THEN
        EXECUTE 'ALTER FUNCTION public.has_role(_user_id uuid, _role app_role) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'handle_new_user') THEN
        EXECUTE 'ALTER FUNCTION public.handle_new_user() SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'audit_rls_policies') THEN
        EXECUTE 'ALTER FUNCTION public.audit_rls_policies() SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'get_cities_by_region') THEN
        EXECUTE 'ALTER FUNCTION public.get_cities_by_region(region_code text) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'get_activities_by_sector') THEN
        EXECUTE 'ALTER FUNCTION public.get_activities_by_sector(sector_code text) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'cleanup_old_compliance_logs') THEN
        EXECUTE 'ALTER FUNCTION public.cleanup_old_compliance_logs() SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'generate_comprehensive_employee_report') THEN
        EXECUTE 'ALTER FUNCTION public.generate_comprehensive_employee_report(_company_id uuid, _filters jsonb, _report_name text) SET search_path TO ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'register_translation_key') THEN
        EXECUTE 'ALTER FUNCTION public.register_translation_key(p_key text, p_source_file text, p_source_line integer, p_context text, p_english_text text, p_arabic_text text) SET search_path TO ''public''';
    END IF;
    
    RAISE NOTICE 'Applied security fixes to existing functions only';
END $$;