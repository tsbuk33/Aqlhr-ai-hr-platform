-- Fix function search path security warnings
-- Update all functions to have secure search_path settings

-- Update trigger functions
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

-- Update utility functions
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