-- Security hardening: Fix insecure search_path in functions
-- This addresses the security warnings found in the linter

-- Update functions with insecure search_path to use secure settings
CREATE OR REPLACE FUNCTION public.trigger_ai_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert sync event for employee changes
  INSERT INTO public.ai_sync_events (
    company_id,
    event_type,
    source_table,
    source_record_id,
    affected_modules,
    payload
  ) VALUES (
    NEW.company_id,
    TG_OP || '_employee',
    TG_TABLE_NAME,
    NEW.id,
    ARRAY['payroll', 'performance', 'org_chart', 'qiwa', 'gosi', 'succession_planning'],
    to_jsonb(NEW)
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enhanced_employee_ai_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_affected_modules text[];
  v_comprehensive_payload jsonb;
BEGIN
  -- Determine affected modules based on changed fields
  v_affected_modules := ARRAY['core_hr', 'payroll', 'performance', 'compliance'];
  
  -- Add specific modules based on data changes
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.salary IS DISTINCT FROM NEW.salary) THEN
      v_affected_modules := v_affected_modules || ARRAY['payroll', 'gosi', 'benefits'];
    END IF;
    
    IF (OLD.department IS DISTINCT FROM NEW.department OR OLD.position IS DISTINCT FROM NEW.position) THEN
      v_affected_modules := v_affected_modules || ARRAY['org_chart', 'succession_planning'];
    END IF;
    
    IF (OLD.is_saudi IS DISTINCT FROM NEW.is_saudi OR OLD.nationality IS DISTINCT FROM NEW.nationality) THEN
      v_affected_modules := v_affected_modules || ARRAY['qiwa', 'nitaqat', 'government_compliance'];
    END IF;
    
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
      v_affected_modules := v_affected_modules || ARRAY['attendance', 'leave_management', 'performance'];
    END IF;
  END IF;
  
  -- Create comprehensive payload with all employee data
  v_comprehensive_payload := jsonb_build_object(
    'employee_data', to_jsonb(COALESCE(NEW, OLD)),
    'change_metadata', jsonb_build_object(
      'operation', TG_OP,
      'timestamp', now(),
      'table_name', TG_TABLE_NAME
    ),
    'data_categories', ARRAY[
      'personal_info',
      'employment_details', 
      'compensation',
      'benefits',
      'compliance',
      'performance',
      'documents'
    ]
  );
  
  -- Insert comprehensive sync event
  INSERT INTO public.ai_sync_events (
    company_id,
    event_type,
    source_table,
    source_record_id,
    affected_modules,
    payload,
    sync_status
  ) VALUES (
    COALESCE(NEW.company_id, OLD.company_id),
    TG_OP || '_employee_comprehensive',
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_affected_modules,
    v_comprehensive_payload,
    'pending'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT company_id
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.update_transportation_allowance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.company_provides_transportation = true THEN
    NEW.transportation_allowance_percentage = 0;
  ELSIF NEW.company_provides_transportation = false AND NEW.transportation_allowance_percentage = 0 THEN
    NEW.transportation_allowance_percentage = 10;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_housing_transportation_allowance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- If company provides housing, set housing allowance to 0
  IF NEW.company_housing = true THEN
    NEW.housing_allowance_percentage = 0;
  ELSIF NEW.company_housing = false AND NEW.housing_allowance_percentage = 0 THEN
    NEW.housing_allowance_percentage = 25; -- Default 25%
  END IF;
  
  -- If company provides transportation, set transportation allowance to 0
  IF NEW.company_provides_transportation = true THEN
    NEW.transportation_allowance_percentage = 0;
  ELSIF NEW.company_provides_transportation = false AND NEW.transportation_allowance_percentage = 0 THEN
    NEW.transportation_allowance_percentage = 10; -- Default 10%
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_annual_leave_entitlement(p_hire_date date, p_current_date date DEFAULT CURRENT_DATE)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_service_years INTEGER;
BEGIN
  v_service_years := EXTRACT(YEAR FROM AGE(p_current_date, p_hire_date));
  
  -- Saudi labor law: 21 days for 1-5 years, 30 days for 5+ years
  IF v_service_years >= 5 THEN
    RETURN 30;
  ELSE
    RETURN 21;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_compliance_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Keep compliance logs for 7 years as per Saudi regulations
  DELETE FROM public.saudi_compliance_logs 
  WHERE created_at < (now() - INTERVAL '7 years');
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_overtime_amount(p_basic_salary numeric, p_overtime_hours numeric, p_standard_hours integer DEFAULT 40)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_hourly_rate DECIMAL;
  v_overtime_rate DECIMAL;
BEGIN
  v_hourly_rate := p_basic_salary / p_standard_hours;
  v_overtime_rate := v_hourly_rate * 1.5; -- 150% as per Saudi law
  
  RETURN v_overtime_rate * p_overtime_hours;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_working_hours(p_check_in timestamp without time zone, p_check_out timestamp without time zone, p_break_duration numeric DEFAULT 1.0)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_total_hours DECIMAL;
BEGIN
  IF p_check_in IS NULL OR p_check_out IS NULL THEN
    RETURN 0;
  END IF;
  
  v_total_hours := EXTRACT(EPOCH FROM (p_check_out - p_check_in)) / 3600.0;
  v_total_hours := v_total_hours - p_break_duration;
  
  RETURN GREATEST(0, v_total_hours);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_translation_feedback_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.prompt_logs_set_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  IF NEW.company_id IS NULL THEN
    NEW.company_id := public.get_user_company_id();
  END IF;
  IF NEW.summary IS NULL OR NEW.summary = '' THEN
    NEW.summary := LEFT(NEW.user_prompt, 100) 
      || CASE WHEN LENGTH(NEW.user_prompt) > 100 THEN '…' ELSE '' END;
  END IF;
  RETURN NEW;
END;
$function$;