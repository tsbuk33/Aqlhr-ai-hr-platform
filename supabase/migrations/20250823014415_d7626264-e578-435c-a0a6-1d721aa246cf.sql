-- Organization Structure Intelligence (OSI) v1 Database Schema
-- Drop existing functions first to avoid conflicts

DROP FUNCTION IF EXISTS public.osi_get_overview_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_get_layers_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_get_span_outliers_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_get_settings_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_refresh_v1(uuid);
DROP FUNCTION IF EXISTS public.osi_seed_demo_data_v1(uuid);

-- Settings table for OSI configuration per tenant
CREATE TABLE IF NOT EXISTS public.osi_settings (
  tenant_id uuid PRIMARY KEY,
  saudi_target numeric DEFAULT 40,          -- target Saudization % per layer
  span_min int DEFAULT 5,
  span_max int DEFAULT 8,
  created_at timestamptz DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.osi_settings ENABLE ROW LEVEL SECURITY;

-- RLS policy for osi_settings
DROP POLICY IF EXISTS "osi_settings_tenant" ON public.osi_settings;
CREATE POLICY "osi_settings_tenant" ON public.osi_settings
  FOR ALL USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

-- Add monthly_salary column to hr_employees if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'hr_employees' AND column_name = 'monthly_salary') THEN
    ALTER TABLE public.hr_employees ADD COLUMN monthly_salary numeric DEFAULT 0;
  END IF;
END $$;

-- Organizational hierarchy view with recursive CTE
CREATE OR REPLACE VIEW public.org_hierarchy_v1 AS
WITH RECURSIVE t AS (
  -- Base case: employees with no manager (top level)
  SELECT e.id, e.company_id AS tenant_id, e.manager_id, e.nationality,
         (COALESCE(e.is_saudi, (e.nationality = 'SA'))) AS is_saudi,
         COALESCE(e.monthly_salary, e.base_salary, 0)::numeric AS monthly_salary,
         1::int AS layer,
         e.full_name_en,
         e.full_name_ar
  FROM public.hr_employees e
  WHERE e.manager_id IS NULL AND e.employment_status = 'active'
  
  UNION ALL
  
  -- Recursive case: employees with managers
  SELECT c.id, c.company_id, c.manager_id, c.nationality,
         (COALESCE(c.is_saudi, (c.nationality = 'SA'))) AS is_saudi,
         COALESCE(c.monthly_salary, c.base_salary, 0)::numeric,
         p.layer + 1,
         c.full_name_en,
         c.full_name_ar
  FROM public.hr_employees c
  JOIN t p ON c.manager_id = p.id AND c.company_id = p.tenant_id
  WHERE c.employment_status = 'active'
)
SELECT * FROM t;

-- Materialized view for layer aggregations (performance optimization)
DROP MATERIALIZED VIEW IF EXISTS public.osi_layers_mv_v1;
CREATE MATERIALIZED VIEW public.osi_layers_mv_v1 AS
SELECT
  tenant_id,
  layer,
  COUNT(*)::int AS headcount,
  COUNT(*) FILTER (WHERE is_saudi)::int AS saudi_headcount,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_saudi)::numeric / NULLIF(COUNT(*),0), 2) AS saudization_rate,
  AVG(monthly_salary) AS avg_salary,
  SUM(monthly_salary) AS total_salary
FROM public.org_hierarchy_v1
GROUP BY tenant_id, layer
ORDER BY tenant_id, layer;

-- Index for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_osi_layers_tenant_layer ON public.osi_layers_mv_v1(tenant_id, layer);

-- Span of control view
CREATE OR REPLACE VIEW public.osi_span_v1 AS
SELECT
  e.company_id AS tenant_id,
  e.id AS manager_id,
  e.full_name_en,
  e.full_name_ar,
  COALESCE(dr.cnt,0)::int AS direct_reports,
  h.layer
FROM public.hr_employees e
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS cnt 
  FROM public.hr_employees r 
  WHERE r.manager_id = e.id AND r.employment_status = 'active'
) dr ON TRUE
LEFT JOIN public.org_hierarchy_v1 h ON h.id = e.id
WHERE e.employment_status = 'active';

-- Overview RPC function
CREATE FUNCTION public.osi_get_overview_v1(p_tenant uuid)
RETURNS TABLE(
  total_layers int,
  highest_saudi_layer int,
  critical_layers int,
  layers_meeting_target int,
  span_outliers_low int,
  span_outliers_high int,
  management_cost numeric
) LANGUAGE sql STABLE SECURITY DEFINER AS $$
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

-- Layers data RPC
CREATE FUNCTION public.osi_get_layers_v1(p_tenant uuid)
RETURNS TABLE(layer int, headcount int, saudi_headcount int, saudization_rate numeric, avg_salary numeric, total_salary numeric)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT layer, headcount, saudi_headcount, saudization_rate, avg_salary, total_salary
  FROM public.osi_layers_mv_v1 WHERE tenant_id = p_tenant ORDER BY layer;
$$;

-- Span outliers RPC
CREATE FUNCTION public.osi_get_span_outliers_v1(p_tenant uuid)
RETURNS TABLE(manager_id uuid, layer int, direct_reports int, severity text, full_name_en text, full_name_ar text)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
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

-- Get OSI settings RPC
CREATE FUNCTION public.osi_get_settings_v1(p_tenant uuid)
RETURNS TABLE(saudi_target numeric, span_min int, span_max int)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
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

-- Refresh helper function
CREATE FUNCTION public.osi_refresh_v1(p_tenant uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.osi_layers_mv_v1;
END $$;

-- Demo data seeding function for development
CREATE FUNCTION public.osi_seed_demo_data_v1(p_tenant uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
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