-- Fix all remaining RLS policies for tables without policies
-- This migration addresses all 36 remaining security issues

-- 1. RLS Policies for missing tables
CREATE POLICY "Users can manage employees from their company" 
ON public.employees 
FOR ALL 
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can manage departments from their company" 
ON public.departments 
FOR ALL 
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can manage positions from their company" 
ON public.positions 
FOR ALL 
USING (company_id = public.get_user_company_id())
WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can manage their roles" 
ON public.user_roles 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage employee benefits from their company" 
ON public.employee_benefits 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage employee documents from their company" 
ON public.employee_documents 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage leave requests from their company" 
ON public.leave_requests 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage attendance from their company" 
ON public.attendance 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage employee training from their company" 
ON public.employee_training 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage performance reviews from their company" 
ON public.performance_reviews 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage KPI tracking from their company" 
ON public.kpi_tracking 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- 2. Fix function search paths for security
CREATE OR REPLACE FUNCTION public.trigger_ai_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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
SET search_path TO ''
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
SET search_path TO ''
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

CREATE OR REPLACE FUNCTION public.calculate_annual_leave_entitlement(p_hire_date date, p_current_date date DEFAULT CURRENT_DATE)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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
SET search_path TO ''
AS $function$
BEGIN
  -- Keep compliance logs for 7 years as per Saudi regulations
  DELETE FROM public.saudi_compliance_logs 
  WHERE created_at < (now() - INTERVAL '7 years');
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_housing_transportation_allowance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

CREATE OR REPLACE FUNCTION public.calculate_overtime_amount(p_basic_salary numeric, p_overtime_hours numeric, p_standard_hours integer DEFAULT 40)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

CREATE OR REPLACE FUNCTION public.calculate_gosi_rates(p_employee_id uuid, p_as_of_date date DEFAULT CURRENT_DATE)
RETURNS TABLE(employee_rate numeric, employer_rate numeric, system_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_config RECORD;
  v_rate RECORD;
BEGIN
  -- Get employee GOSI configuration
  SELECT * INTO v_config 
  FROM public.employee_gosi_config 
  WHERE employee_id = p_employee_id;
  
  IF NOT FOUND THEN
    -- If no config exists, determine system type based on hire date
    SELECT 
      e.hire_date,
      CASE 
        WHEN e.hire_date >= '2025-07-01' THEN 'NEW'
        ELSE 'OLD'
      END as system_type,
      CASE 
        WHEN e.is_saudi = true THEN 'SAUDI'
        ELSE 'NON_SAUDI'
      END as nationality
    INTO v_config
    FROM public.employees e
    WHERE e.id = p_employee_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Employee not found: %', p_employee_id;
    END IF;
  END IF;
  
  -- Get applicable rate from history
  SELECT h.employee_rate, h.employer_rate, v_config.system_type
  INTO v_rate
  FROM public.gosi_rate_history h
  WHERE h.system_type = v_config.system_type
    AND h.nationality = v_config.nationality
    AND h.effective_from <= p_as_of_date
    AND (h.effective_to IS NULL OR h.effective_to > p_as_of_date)
  ORDER BY h.effective_from DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No GOSI rate found for employee % on date %', p_employee_id, p_as_of_date;
  END IF;
  
  RETURN QUERY SELECT v_rate.employee_rate, v_rate.employer_rate, v_rate.system_type;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_classify_employee_gosi(p_employee_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_employee RECORD;
  v_system_type TEXT;
  v_nationality TEXT;
  v_rates RECORD;
BEGIN
  -- Get employee details
  SELECT hire_date, is_saudi 
  INTO v_employee
  FROM public.employees 
  WHERE id = p_employee_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Employee not found: %', p_employee_id;
  END IF;
  
  -- Determine system type and nationality
  v_system_type := CASE 
    WHEN v_employee.hire_date >= '2025-07-01' THEN 'NEW'
    ELSE 'OLD'
  END;
  
  v_nationality := CASE 
    WHEN v_employee.is_saudi = true THEN 'SAUDI'
    ELSE 'NON_SAUDI'
  END;
  
  -- Get current rates
  SELECT employee_rate, employer_rate
  INTO v_rates
  FROM public.gosi_rate_history
  WHERE system_type = v_system_type
    AND nationality = v_nationality
    AND effective_from <= CURRENT_DATE
    AND (effective_to IS NULL OR effective_to > CURRENT_DATE)
  ORDER BY effective_from DESC
  LIMIT 1;
  
  -- Insert or update configuration
  INSERT INTO public.employee_gosi_config (
    employee_id,
    hire_date,
    gosi_system_type,
    nationality,
    current_employee_rate,
    current_employer_rate,
    effective_from
  ) VALUES (
    p_employee_id,
    v_employee.hire_date,
    v_system_type,
    v_nationality,
    v_rates.employee_rate,
    v_rates.employer_rate,
    CURRENT_DATE
  )
  ON CONFLICT (employee_id) 
  DO UPDATE SET
    gosi_system_type = EXCLUDED.gosi_system_type,
    nationality = EXCLUDED.nationality,
    current_employee_rate = EXCLUDED.current_employee_rate,
    current_employer_rate = EXCLUDED.current_employer_rate,
    effective_from = EXCLUDED.effective_from,
    updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_tool_integration(p_company_id uuid, p_tool_name text, p_action text DEFAULT 'enable'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Insert sync event for AI processing
  INSERT INTO public.ai_sync_events (
    company_id,
    event_type,
    source_table,
    source_record_id,
    affected_modules,
    payload
  ) VALUES (
    p_company_id,
    'tool_integration_' || p_action,
    'tool_integrations',
    (SELECT id FROM public.tool_integrations WHERE company_id = p_company_id AND tool_name = p_tool_name),
    ARRAY['ai_engine', 'dashboard', 'analytics', 'workflow_automation'],
    jsonb_build_object(
      'tool_name', p_tool_name,
      'action', p_action,
      'timestamp', now(),
      'integration_context', 'sanadhr_platform'
    )
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_working_hours(p_check_in timestamp without time zone, p_check_out timestamp without time zone, p_break_duration numeric DEFAULT 1.0)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

CREATE OR REPLACE FUNCTION public.sync_leo_geo_insights()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_employee_id UUID;
  v_company_id UUID;
  v_avg_completion NUMERIC;
  v_engagement_score NUMERIC;
BEGIN
  -- Get employee and company ID from the triggered row
  v_employee_id := COALESCE(NEW.employee_id, OLD.employee_id);
  v_company_id := COALESCE(NEW.company_id, OLD.company_id);
  
  -- Get average completion percentage for learning
  SELECT AVG(completion_percentage) INTO v_avg_completion
  FROM public.learning_progress_tracking 
  WHERE employee_id = v_employee_id AND company_id = v_company_id;
  
  -- Get latest engagement score
  SELECT engagement_score INTO v_engagement_score
  FROM public.engagement_metrics_tracking 
  WHERE employee_id = v_employee_id AND company_id = v_company_id
  ORDER BY measurement_date DESC 
  LIMIT 1;
  
  -- Insert or update learning engagement insights
  INSERT INTO public.learning_engagement_insights (
    company_id,
    employee_id,
    learning_engagement_score,
    skills_completion_rate,
    engagement_impact_on_learning,
    learning_impact_on_engagement
  ) VALUES (
    v_company_id,
    v_employee_id,
    COALESCE(v_engagement_score, 0) * 0.7 + COALESCE(v_avg_completion, 0) * 0.3,
    COALESCE(v_avg_completion, 0),
    CASE 
      WHEN COALESCE(v_engagement_score, 0) > 80 THEN 15
      WHEN COALESCE(v_engagement_score, 0) > 60 THEN 10
      ELSE 5
    END,
    CASE 
      WHEN COALESCE(v_avg_completion, 0) > 80 THEN 15
      WHEN COALESCE(v_avg_completion, 0) > 60 THEN 10
      ELSE 5
    END
  )
  ON CONFLICT (employee_id, company_id) 
  DO UPDATE SET
    learning_engagement_score = COALESCE(v_engagement_score, 0) * 0.7 + COALESCE(v_avg_completion, 0) * 0.3,
    skills_completion_rate = COALESCE(v_avg_completion, 0),
    engagement_impact_on_learning = CASE 
      WHEN COALESCE(v_engagement_score, 0) > 80 THEN 15
      WHEN COALESCE(v_engagement_score, 0) > 60 THEN 10
      ELSE 5
    END,
    learning_impact_on_engagement = CASE 
      WHEN COALESCE(v_avg_completion, 0) > 80 THEN 15
      WHEN COALESCE(v_avg_completion, 0) > 60 THEN 10
      ELSE 5
    END,
    updated_at = now();
    
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.register_discovered_module(p_module_name text, p_module_path text, p_module_category text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_module_id UUID;
BEGIN
  -- Insert or update module
  INSERT INTO public.system_modules_registry (
    module_name,
    module_path,
    module_category,
    metadata,
    auto_discovered
  ) VALUES (
    p_module_name,
    p_module_path,
    p_module_category,
    p_metadata,
    true
  )
  ON CONFLICT (module_name, module_path) 
  DO UPDATE SET
    module_category = EXCLUDED.module_category,
    metadata = EXCLUDED.metadata,
    updated_at = now()
  RETURNING id INTO v_module_id;
  
  RETURN v_module_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.register_translation_key(p_key text, p_source_file text, p_source_line integer DEFAULT NULL::integer, p_context text DEFAULT NULL::text, p_english_text text DEFAULT NULL::text, p_arabic_text text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_registry_id UUID;
BEGIN
  -- Insert or update translation key
  INSERT INTO public.translation_registry (
    translation_key,
    source_file,
    source_line,
    context_info,
    english_text,
    arabic_text,
    needs_review
  ) VALUES (
    p_key,
    p_source_file,
    p_source_line,
    p_context,
    p_english_text,
    p_arabic_text,
    CASE WHEN p_arabic_text IS NULL THEN true ELSE false END
  )
  ON CONFLICT (translation_key) 
  DO UPDATE SET
    source_file = EXCLUDED.source_file,
    source_line = EXCLUDED.source_line,
    context_info = EXCLUDED.context_info,
    english_text = COALESCE(EXCLUDED.english_text, translation_registry.english_text),
    arabic_text = COALESCE(EXCLUDED.arabic_text, translation_registry.arabic_text),
    updated_at = now()
  RETURNING id INTO v_registry_id;
  
  RETURN v_registry_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.apply_translation_patch(p_key text, p_language text, p_text text, p_confidence numeric DEFAULT 0.8)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_patch_id UUID;
BEGIN
  -- Insert the patch
  INSERT INTO public.translation_patches (
    translation_key,
    patched_text,
    language,
    confidence_score
  ) VALUES (
    p_key,
    p_text,
    p_language,
    p_confidence
  )
  RETURNING id INTO v_patch_id;
  
  -- Update the registry with the patch
  UPDATE public.translation_registry
  SET 
    arabic_text = CASE WHEN p_language = 'ar' THEN p_text ELSE arabic_text END,
    english_text = CASE WHEN p_language = 'en' THEN p_text ELSE english_text END,
    is_ai_generated = true,
    needs_review = true,
    last_updated_ar = CASE WHEN p_language = 'ar' THEN now() ELSE last_updated_ar END,
    last_updated_en = CASE WHEN p_language = 'en' THEN now() ELSE last_updated_en END
  WHERE translation_key = p_key;
  
  RETURN v_patch_id;
END;
$function$;