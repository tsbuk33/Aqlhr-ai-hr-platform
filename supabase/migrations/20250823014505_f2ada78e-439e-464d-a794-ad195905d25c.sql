-- Fix security warnings for OSI functions by adding search_path

-- Drop and recreate functions with proper security settings
DROP FUNCTION IF EXISTS public.osi_get_overview_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_get_layers_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_get_span_outliers_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_get_settings_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_refresh_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_seed_demo_data_v1(uuid);

-- Overview RPC function with security fixes
CREATE FUNCTION public.osi_get_overview_v1(p_tenant uuid)
RETURNS TABLE(
  total_layers int,
  highest_saudi_layer int,
  critical_layers int,
  layers_meeting_target int,
  span_outliers_low int,
  span_outliers_high int,
  management_cost numeric
) LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH s AS (
    SELECT COALESCE((SELECT saudi_target FROM public.osi_settings WHERE tenant_id=p_tenant), 40) AS target,
           COALESCE((SELECT span_min FROM public.osi_settings WHERE tenant_id=p_tenant), 5) AS smin,
           COALESCE((SELECT span_max FROM public.osi_settings WHERE tenant_id=p_tenant), 8) AS smax
  ),
  L AS (
    SELECT * FROM public.osi_layers_mv_v1 WHERE tenant_id = p_tenant
  ),
  SP AS (
    SELECT * FROM public.osi_span_v1 WHERE tenant_id = p_tenant
  )
  SELECT
    (SELECT COALESCE(MAX(layer),0) FROM L)::int AS total_layers,
    (SELECT COALESCE(MIN(layer),0) FROM L WHERE saudi_headcount > 0)::int AS highest_saudi_layer,
    (SELECT COUNT(*)::int FROM L, s WHERE saudization_rate < s.target) AS critical_layers,
    (SELECT COUNT(*)::int FROM L, s WHERE saudization_rate >= s.target) AS layers_meeting_target,
    (SELECT COUNT(*)::int FROM SP, s WHERE direct_reports > 0 AND direct_reports < s.smin) AS span_outliers_low,
    (SELECT COUNT(*)::int FROM SP, s WHERE direct_reports > s.smax) AS span_outliers_high,
    (SELECT COALESCE(SUM(total_salary),0) FROM L) AS management_cost;
$$;

-- Layers data RPC with security fixes
CREATE FUNCTION public.osi_get_layers_v1(p_tenant uuid)
RETURNS TABLE(layer int, headcount int, saudi_headcount int, saudization_rate numeric, avg_salary numeric, total_salary numeric)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT layer, headcount, saudi_headcount, saudization_rate, avg_salary, total_salary
  FROM public.osi_layers_mv_v1 WHERE tenant_id = p_tenant ORDER BY layer;
$$;

-- Span outliers RPC with security fixes
CREATE FUNCTION public.osi_get_span_outliers_v1(p_tenant uuid)
RETURNS TABLE(manager_id uuid, layer int, direct_reports int, severity text, full_name_en text, full_name_ar text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH s AS (
    SELECT COALESCE((SELECT span_min FROM public.osi_settings WHERE tenant_id=p_tenant), 5) AS smin,
           COALESCE((SELECT span_max FROM public.osi_settings WHERE tenant_id=p_tenant), 8) AS smax
  )
  SELECT 
    sp.manager_id, 
    sp.layer, 
    sp.direct_reports,
    CASE 
      WHEN sp.direct_reports < s.smin THEN 'low'
      WHEN sp.direct_reports > s.smax THEN 'high'
      ELSE 'ok' 
    END AS severity,
    sp.full_name_en,
    sp.full_name_ar
  FROM public.osi_span_v1 sp, s
  WHERE sp.tenant_id = p_tenant 
    AND sp.direct_reports > 0
    AND (sp.direct_reports < s.smin OR sp.direct_reports > s.smax)
  ORDER BY sp.direct_reports DESC;
$$;

-- Get OSI settings RPC with security fixes
CREATE FUNCTION public.osi_get_settings_v1(p_tenant uuid)
RETURNS TABLE(saudi_target numeric, span_min int, span_max int)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    COALESCE(saudi_target, 40) as saudi_target,
    COALESCE(span_min, 5) as span_min, 
    COALESCE(span_max, 8) as span_max
  FROM public.osi_settings 
  WHERE tenant_id = p_tenant
  UNION ALL
  SELECT 40, 5, 8  -- defaults if no settings exist
  LIMIT 1;
$$;

-- Refresh helper function with security fixes
CREATE FUNCTION public.osi_refresh_v1(p_tenant uuid)
RETURNS void 
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.osi_layers_mv_v1;
END $$;

-- Demo data seeding function with security fixes
CREATE FUNCTION public.osi_seed_demo_data_v1(p_tenant uuid)
RETURNS void 
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  ceo_id uuid;
  vp1_id uuid;
  vp2_id uuid;
  mgr_id uuid;
  i int;
BEGIN
  -- Only seed if no hierarchy exists
  IF EXISTS (SELECT 1 FROM public.hr_employees WHERE company_id = p_tenant LIMIT 1) THEN
    RETURN;
  END IF;
  
  -- CEO (Layer 1)
  INSERT INTO public.hr_employees (
    id, company_id, employee_no, full_name_en, full_name_ar, gender, 
    nationality_code, is_saudi, monthly_salary, manager_id, employment_status
  ) VALUES (
    gen_random_uuid(), p_tenant, 'CEO001', 'Ahmed Al-Saudi', 'أحمد السعودي', 'male',
    'SA', true, 50000, NULL, 'active'
  ) RETURNING id INTO ceo_id;
  
  -- VPs (Layer 2)
  INSERT INTO public.hr_employees (
    id, company_id, employee_no, full_name_en, full_name_ar, gender,
    nationality_code, is_saudi, monthly_salary, manager_id, employment_status
  ) VALUES 
  (gen_random_uuid(), p_tenant, 'VP001', 'Sarah Al-Rashid', 'سارة الراشد', 'female',
   'SA', true, 35000, ceo_id, 'active'),
  (gen_random_uuid(), p_tenant, 'VP002', 'Mohammed Khan', 'محمد خان', 'male',
   'PK', false, 32000, ceo_id, 'active')
  RETURNING id INTO vp1_id;
  
  -- Get VP IDs
  SELECT id INTO vp1_id FROM public.hr_employees WHERE employee_no = 'VP001' AND company_id = p_tenant;
  SELECT id INTO vp2_id FROM public.hr_employees WHERE employee_no = 'VP002' AND company_id = p_tenant;
  
  -- Managers (Layer 3)
  FOR i IN 1..4 LOOP
    INSERT INTO public.hr_employees (
      id, company_id, employee_no, full_name_en, full_name_ar, gender,
      nationality_code, is_saudi, monthly_salary, manager_id, employment_status
    ) VALUES (
      gen_random_uuid(), p_tenant, 'MGR00' || i, 
      'Manager ' || i, 'مدير ' || i, 
      CASE WHEN i % 2 = 0 THEN 'female' ELSE 'male' END,
      CASE WHEN i <= 2 THEN 'SA' ELSE 'IN' END,
      i <= 2, 
      25000 + (i * 1000),
      CASE WHEN i <= 2 THEN vp1_id ELSE vp2_id END,
      'active'
    );
  END LOOP;
  
  -- Staff (Layers 4-5)
  FOR i IN 1..20 LOOP
    SELECT id INTO mgr_id FROM public.hr_employees 
    WHERE employee_no = 'MGR00' || ((i % 4) + 1) AND company_id = p_tenant;
    
    INSERT INTO public.hr_employees (
      id, company_id, employee_no, full_name_en, full_name_ar, gender,
      nationality_code, is_saudi, monthly_salary, manager_id, employment_status
    ) VALUES (
      gen_random_uuid(), p_tenant, 'EMP' || LPAD(i::text, 3, '0'),
      'Employee ' || i, 'موظف ' || i,
      CASE WHEN i % 3 = 0 THEN 'female' ELSE 'male' END,
      CASE WHEN i % 3 = 0 THEN 'SA' WHEN i % 3 = 1 THEN 'IN' ELSE 'PH' END,
      i % 3 = 0,
      15000 + (i * 500),
      mgr_id,
      'active'
    );
  END LOOP;
  
  -- Refresh the materialized view
  REFRESH MATERIALIZED VIEW public.osi_layers_mv_v1;
END $$;