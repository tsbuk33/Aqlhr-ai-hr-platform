-- Fix remaining functions with search_path issues

CREATE OR REPLACE FUNCTION public.sync_tool_integration(p_company_id uuid, p_tool_name text, p_action text DEFAULT 'enable'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.is_pilot_user(user_uuid uuid, feature_name text DEFAULT 'i18n_review'::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.pilot_group_users 
    WHERE user_id = user_uuid 
    AND is_active = true 
    AND feature_name = ANY(pilot_features)
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_classify_employee_gosi(p_employee_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.calculate_gosi_rates(p_employee_id uuid, p_as_of_date date DEFAULT CURRENT_DATE)
RETURNS TABLE(employee_rate numeric, employer_rate numeric, system_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.validate_user_isolation()
RETURNS TABLE(user_id uuid, company_id uuid, has_access boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ur.user_id,
    ur.company_id,
    (public.get_user_company_id() = ur.company_id)
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid();
END;
$$;