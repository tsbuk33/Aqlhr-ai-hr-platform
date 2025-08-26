-- Fix security issues: Convert unnecessary SECURITY DEFINER functions and add proper search_path

-- Convert calculation functions that don't need elevated privileges to SECURITY INVOKER
ALTER FUNCTION public.calculate_annual_leave_entitlement(p_hire_date date, p_current_date date) SECURITY INVOKER;
ALTER FUNCTION public.calculate_overtime_amount(p_basic_salary numeric, p_overtime_hours numeric, p_standard_hours integer) SECURITY INVOKER;  
ALTER FUNCTION public.calculate_working_hours(p_check_in timestamp without time zone, p_check_out timestamp without time zone, p_break_duration numeric) SECURITY INVOKER;

-- Convert utility functions that work with user's own data to SECURITY INVOKER
ALTER FUNCTION public.auto_classify_employee_gosi(p_employee_id uuid) SECURITY INVOKER;
ALTER FUNCTION public.calculate_gosi_rates(p_employee_id uuid, p_as_of_date date) SECURITY INVOKER;

-- Convert API functions to use proper RLS instead of bypassing it
ALTER FUNCTION public.api_create_key_v1(p_tenant_id uuid, p_key_name text, p_scopes text[], p_expires_at timestamp with time zone) SECURITY INVOKER;
ALTER FUNCTION public.api_revoke_key_v1(p_tenant_id uuid, p_key_id uuid) SECURITY INVOKER;

-- Convert translation functions to SECURITY INVOKER (they should respect user permissions)
ALTER FUNCTION public.apply_translation_patch(p_key text, p_language text, p_text text, p_confidence numeric) SECURITY INVOKER;

-- Add proper search_path to remaining SECURITY DEFINER functions
-- Core tenant/dashboard functions that need elevated privileges
ALTER FUNCTION public.ask_headcount_v1(p_tenant uuid) SET search_path TO 'public';
ALTER FUNCTION public.ask_saudization_status_v1(p_tenant uuid) SET search_path TO 'public';
ALTER FUNCTION public.ask_iqama_expiring_summary_v1(p_tenant uuid, p_days integer) SET search_path TO 'public';
ALTER FUNCTION public.ask_iqama_expiring_list_admin_v1(p_tenant uuid, p_days integer) SET search_path TO 'public';
ALTER FUNCTION public.ask_search_evidence_v1(p_tenant uuid, p_query text, p_limit integer) SET search_path TO 'public';

-- Dashboard functions
ALTER FUNCTION public.dashboard_get_v1(p_tenant uuid) SET search_path TO 'public';
ALTER FUNCTION public.dashboard_compute_kpis_v1(p_tenant uuid) SET search_path TO 'public';
ALTER FUNCTION public.dashboard_backfill_v1(p_tenant uuid, p_days integer) SET search_path TO 'public';
ALTER FUNCTION public.dashboard_alerts_v1(p_tenant uuid) SET search_path TO 'public';
ALTER FUNCTION public.dashboard_rules_v1(p_tenant uuid) SET search_path TO 'public';
ALTER FUNCTION public.dashboard_get_series_v1(p_tenant uuid, p_days integer) SET search_path TO 'public';
ALTER FUNCTION public.dashboard_compute_kpis_asof_v1(p_tenant uuid, p_as_of date) SET search_path TO 'public';

-- ROI functions 
ALTER FUNCTION public.roi_emit_event(p_tenant uuid, p_event text, p_qty numeric, p_module text, p_ref uuid, p_meta jsonb) SET search_path TO 'public';
ALTER FUNCTION public.roi_snapshot_upsert_v1(p_tenant uuid, p_date date) SET search_path TO 'public';
ALTER FUNCTION public.roi_backfill_snapshots_v1(p_tenant uuid, p_days integer) SET search_path TO 'public';
ALTER FUNCTION public.roi_get_last30_v1(p_tenant uuid) SET search_path TO 'public';
ALTER FUNCTION public.roi_get_trend_v1(p_tenant uuid, p_days integer) SET search_path TO 'public';

-- Government integration functions
ALTER FUNCTION public.gov_get_changes_v1(p_tenant uuid, p_limit integer) SET search_path TO 'public';
ALTER FUNCTION public.gov_mark_change_processed_v1(p_tenant uuid, p_change_id uuid) SET search_path TO 'public';

-- Development/seeding functions
ALTER FUNCTION public.dev_seed_employees_v1(p_tenant uuid, p_count integer) SET search_path TO 'public';
ALTER FUNCTION public.dev_backfill_kpis_v1(p_tenant uuid, p_days integer) SET search_path TO 'public';
ALTER FUNCTION public.dev_seed_retention_v1(p_tenant uuid, p_months integer) SET search_path TO 'public';
ALTER FUNCTION public.dev_seed_osi_v1(p_tenant uuid) SET search_path TO 'public';
ALTER FUNCTION public.dev_ping_v1() SET search_path TO 'public';

-- Authentication and security functions
ALTER FUNCTION public.has_role(_user_id uuid, _role app_role) SET search_path TO 'public';
ALTER FUNCTION public.handle_new_user() SET search_path TO 'public';
ALTER FUNCTION public.bootstrap_owner(p_user_id uuid, p_company_name text) SET search_path TO 'public';
ALTER FUNCTION public.bootstrap_current_user_as_owner(p_company_name text) SET search_path TO 'public';

-- Audit functions
ALTER FUNCTION public.audit_rls_policies() SET search_path TO 'public';
ALTER FUNCTION public.audit_security_definer_functions() SET search_path TO 'public';

-- Task management functions
ALTER FUNCTION public.task_create_v1(p_tenant_id uuid, p_module text, p_title text, p_description text, p_due_at timestamp with time zone, p_priority text, p_owner_user_id uuid, p_owner_role text, p_metadata jsonb) SET search_path TO 'public';
ALTER FUNCTION public.task_assign_v1(p_task_id uuid, p_owner_user_id uuid, p_owner_role text) SET search_path TO 'public';
ALTER FUNCTION public.task_complete_v1(p_task_id uuid, p_completion_notes text) SET search_path TO 'public';
ALTER FUNCTION public.task_list_v1(p_tenant_id uuid, p_status text, p_module text, p_owner_user_id uuid, p_limit integer, p_offset integer) SET search_path TO 'public';
ALTER FUNCTION public.task_notify_v1(p_task_id uuid, p_channel text, p_to_user_id uuid, p_to_email text, p_message text) SET search_path TO 'public';

-- Tenant and feature functions  
ALTER FUNCTION public.has_feature(p_tenant_id uuid, p_feature_code text) SET search_path TO 'public';
ALTER FUNCTION public.get_tenant_plan(p_tenant_id uuid) SET search_path TO 'public';
ALTER FUNCTION public.get_tenant_localization_prefs(p_tenant_id uuid) SET search_path TO 'public';
ALTER FUNCTION public.update_localization_prefs(p_tenant_id uuid, p_preferences jsonb) SET search_path TO 'public';

-- Utility functions that should remain SECURITY DEFINER but need search_path
ALTER FUNCTION public.get_cities_by_region(region_code text) SET search_path TO 'public';
ALTER FUNCTION public.get_activities_by_sector(sector_code text) SET search_path TO 'public';
ALTER FUNCTION public.cleanup_old_compliance_logs() SET search_path TO 'public';
ALTER FUNCTION public.update_auth_security_compliance() SET search_path TO 'public';
ALTER FUNCTION public.purge_old_auth_email_events() SET search_path TO 'public';

-- Reporting functions
ALTER FUNCTION public.generate_comprehensive_employee_report(_company_id uuid, _filters jsonb, _report_name text) SET search_path TO 'public';

-- Translation and registry functions  
ALTER FUNCTION public.register_translation_key(p_key text, p_source_file text, p_source_line integer, p_context text, p_english_text text, p_arabic_text text) SET search_path TO 'public';
ALTER FUNCTION public.register_discovered_module(p_module_name text, p_module_path text, p_module_category text, p_metadata jsonb) SET search_path TO 'public';
ALTER FUNCTION public.is_pilot_user(user_uuid uuid, feature_name text) SET search_path TO 'public';

-- Log the completion
DO $$
BEGIN
    RAISE NOTICE 'Security fixes applied:';
    RAISE NOTICE '- Converted calculation and utility functions to SECURITY INVOKER';
    RAISE NOTICE '- Added SET search_path TO public to all remaining SECURITY DEFINER functions';
    RAISE NOTICE '- Maintained SECURITY DEFINER only for functions requiring elevated privileges';
END $$;