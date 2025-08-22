-- OSI v1: Org Structure Intelligence (Fixed)
-- Tables for OSI-specific computations (RLS enabled)

CREATE TABLE IF NOT EXISTS public.osi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.dx_cases(id) ON DELETE CASCADE,
  scope TEXT NOT NULL, -- 'company' | 'department' | 'division'
  scope_id UUID, -- department_id or NULL for company-wide
  headcount INT NOT NULL DEFAULT 0,
  managers INT NOT NULL DEFAULT 0,
  span_avg NUMERIC(5,2) DEFAULT 0,
  span_p90 NUMERIC(5,2) DEFAULT 0,
  layers_depth INT DEFAULT 0,
  saudization NUMERIC(5,2) DEFAULT 0,
  female_pct NUMERIC(5,2) DEFAULT 0,
  cost_total NUMERIC(15,2) DEFAULT 0,
  cost_to_manage NUMERIC(5,2) DEFAULT 0, -- percentage
  manager_overload_n INT DEFAULT 0,
  duplicate_titles_n INT DEFAULT 0,
  vacant_positions_n INT DEFAULT 0,
  flags TEXT[] DEFAULT '{}',
  n INT DEFAULT 0, -- sample size for statistical significance
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.osi_benchmarks (
  function TEXT NOT NULL,
  grade TEXT NOT NULL,
  target_span NUMERIC(5,2) NOT NULL,
  max_layers INT NOT NULL,
  target_cost_to_manage NUMERIC(5,2) NOT NULL,
  PRIMARY KEY (function, grade)
);

-- Enable RLS
ALTER TABLE public.osi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osi_benchmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage OSI snapshots from their cases"
ON public.osi_snapshots FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.dx_cases c 
    WHERE c.id = osi_snapshots.case_id 
    AND c.tenant_id = get_user_company_id()
  )
);

CREATE POLICY "Users can view OSI benchmarks"
ON public.osi_benchmarks FOR SELECT
USING (true);

-- Views for org structure analysis (simplified for current schema)
CREATE OR REPLACE VIEW public.v_org_current AS
SELECT 
  e.id,
  e.company_id as tenant_id,
  e.employee_no,
  e.full_name_en,
  e.full_name_ar,
  e.gender,
  e.is_saudi,
  e.nationality_code,
  e.employment_status,
  e.hire_date,
  e.base_salary,
  e.allowances,
  e.dept_id as department_id,
  'Unknown' as department_name_en,
  'غير معروف' as department_name_ar,
  e.job_id,
  'Unknown' as job_title_en,
  'غير معروف' as job_title_ar,
  e.grade_id,
  'Unknown' as grade_name_en,
  'غير معروف' as grade_name_ar,
  e.manager_id,
  COALESCE(e.base_salary + e.allowances, 0) as total_compensation
FROM public.hr_employees e
WHERE e.employment_status = 'active';

CREATE OR REPLACE VIEW public.v_manager_spans AS
WITH manager_counts AS (
  SELECT 
    manager_id,
    COUNT(*) as direct_reports,
    AVG(COALESCE(base_salary + allowances, 0)) as avg_team_cost
  FROM public.hr_employees 
  WHERE manager_id IS NOT NULL 
    AND employment_status = 'active'
  GROUP BY manager_id
),
manager_info AS (
  SELECT 
    e.id as manager_id,
    e.full_name_en,
    e.full_name_ar,
    'Manager' as grade_name,
    mc.direct_reports as span,
    mc.avg_team_cost,
    7 as target_span -- default benchmark
  FROM public.hr_employees e
  LEFT JOIN manager_counts mc ON e.id = mc.manager_id
  WHERE mc.direct_reports > 0
)
SELECT *,
  CASE WHEN span > target_span THEN true ELSE false END as overload
FROM manager_info;

CREATE OR REPLACE VIEW public.v_org_layers AS
WITH RECURSIVE org_hierarchy AS (
  -- Base case: top-level employees (no manager or manager not in company)
  SELECT 
    id,
    company_id,
    full_name_en,
    manager_id,
    1 as layer,
    ARRAY[id] as path
  FROM public.hr_employees 
  WHERE employment_status = 'active'
    AND (manager_id IS NULL OR manager_id NOT IN (
      SELECT id FROM public.hr_employees WHERE employment_status = 'active'
    ))
  
  UNION ALL
  
  -- Recursive case: employees with managers
  SELECT 
    e.id,
    e.company_id,
    e.full_name_en,
    e.manager_id,
    oh.layer + 1,
    oh.path || e.id
  FROM public.hr_employees e
  JOIN org_hierarchy oh ON e.manager_id = oh.id
  WHERE e.employment_status = 'active'
    AND NOT (e.id = ANY(oh.path)) -- prevent cycles
    AND oh.layer < 10 -- safety limit
)
SELECT * FROM org_hierarchy;

CREATE OR REPLACE VIEW public.v_costs AS
SELECT 
  e.id as employee_id,
  e.company_id as tenant_id,
  COALESCE(e.base_salary + e.allowances, 
    CASE 
      WHEN e.manager_id IS NULL THEN 20000 -- assume senior roles
      ELSE 8000 -- regular employees
    END
  ) as monthly_cost
FROM public.hr_employees e
WHERE e.employment_status = 'active';

-- OSI Computation Function
CREATE OR REPLACE FUNCTION public.osi_compute_case_v1(p_case_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
  v_baseline_date DATE;
  v_total_headcount INT;
  v_total_managers INT;
  v_avg_span NUMERIC;
  v_p90_span NUMERIC;
  v_max_layers INT;
  v_saudization NUMERIC;
  v_female_pct NUMERIC;
  v_total_cost NUMERIC;
  v_cost_to_manage NUMERIC;
  v_overloaded_managers INT;
  v_duplicate_titles INT;
  v_flags TEXT[] := '{}';
BEGIN
  -- Get case details
  SELECT tenant_id, baseline_date INTO v_tenant_id, v_baseline_date
  FROM public.dx_cases
  WHERE id = p_case_id;
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found: %', p_case_id;
  END IF;
  
  -- Calculate basic metrics
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE EXISTS (
      SELECT 1 FROM public.hr_employees e2 
      WHERE e2.manager_id = oc.id AND e2.employment_status = 'active'
    )),
    ROUND(AVG(COALESCE(ms.span, 0)), 2),
    ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY COALESCE(ms.span, 0)), 2),
    COALESCE(MAX(ol.layer), 1),
    ROUND(AVG(CASE WHEN oc.is_saudi THEN 100.0 ELSE 0.0 END), 1),
    ROUND(AVG(CASE WHEN oc.gender = 'female' THEN 100.0 ELSE 0.0 END), 1),
    SUM(c.monthly_cost),
    COUNT(DISTINCT oc.department_id)
  INTO v_total_headcount, v_total_managers, v_avg_span, v_p90_span, 
       v_max_layers, v_saudization, v_female_pct, v_total_cost, v_duplicate_titles
  FROM public.v_org_current oc
  LEFT JOIN public.v_manager_spans ms ON oc.id = ms.manager_id
  LEFT JOIN public.v_org_layers ol ON oc.id = ol.id
  LEFT JOIN public.v_costs c ON oc.id = c.employee_id
  WHERE oc.tenant_id = v_tenant_id;
  
  -- Calculate cost to manage (managers cost / total cost)
  SELECT COALESCE(ROUND(
    (SUM(c.monthly_cost) FILTER (WHERE EXISTS (
      SELECT 1 FROM public.hr_employees e2 
      WHERE e2.manager_id = oc.id AND e2.employment_status = 'active'
    )) / NULLIF(SUM(c.monthly_cost), 0)) * 100, 2
  ), 0) INTO v_cost_to_manage
  FROM public.v_org_current oc
  JOIN public.v_costs c ON oc.id = c.employee_id
  WHERE oc.tenant_id = v_tenant_id;
  
  -- Count overloaded managers
  SELECT COUNT(*) INTO v_overloaded_managers
  FROM public.v_manager_spans
  WHERE overload = true;
  
  -- Generate flags
  IF v_avg_span > 8 THEN
    v_flags := v_flags || 'OVER_SPAN';
  END IF;
  
  IF v_max_layers > 6 THEN
    v_flags := v_flags || 'DEEP_LAYERS';
  END IF;
  
  IF v_saudization < 50 THEN
    v_flags := v_flags || 'LOW_SAUDI_LAYER';
  END IF;
  
  IF v_cost_to_manage > 18 THEN
    v_flags := v_flags || 'HIGH_COST_TO_MANAGE';
  END IF;
  
  IF v_duplicate_titles > 5 THEN
    v_flags := v_flags || 'DUP_ROLE_TITLES';
  END IF;
  
  -- Insert snapshot
  INSERT INTO public.osi_snapshots (
    case_id, scope, scope_id, headcount, managers, span_avg, span_p90,
    layers_depth, saudization, female_pct, cost_total, cost_to_manage,
    manager_overload_n, duplicate_titles_n, flags, n
  ) VALUES (
    p_case_id, 'company', NULL, v_total_headcount, v_total_managers,
    v_avg_span, v_p90_span, v_max_layers, v_saudization, v_female_pct,
    v_total_cost, v_cost_to_manage, v_overloaded_managers, v_duplicate_titles,
    v_flags, v_total_headcount
  );
  
  -- Write dx_scores
  INSERT INTO public.dx_scores (case_id, scope, scope_id, metric, n, last_computed_at)
  VALUES 
    (p_case_id, 'company', NULL, 
     jsonb_build_object(
       'org_health_score', CASE 
         WHEN array_length(v_flags, 1) IS NULL THEN 95
         WHEN array_length(v_flags, 1) <= 1 THEN 85
         WHEN array_length(v_flags, 1) <= 3 THEN 70
         ELSE 50
       END,
       'span_efficiency', LEAST(100, (7.0/GREATEST(v_avg_span, 1)) * 100),
       'layer_efficiency', LEAST(100, (5.0/GREATEST(v_max_layers, 1)) * 100),
       'cost_efficiency', LEAST(100, (15.0/GREATEST(v_cost_to_manage, 1)) * 100)
     ), 
     v_total_headcount, now());
  
  -- Write dx_flags
  IF array_length(v_flags, 1) > 0 THEN
    INSERT INTO public.dx_flags (case_id, severity, code, scope, scope_id, details)
    SELECT 
      p_case_id,
      CASE 
        WHEN unnest = 'DEEP_LAYERS' THEN 'high'
        WHEN unnest = 'HIGH_COST_TO_MANAGE' THEN 'high'
        ELSE 'medium'
      END,
      unnest,
      'company',
      NULL,
      jsonb_build_object(
        'description', CASE unnest
          WHEN 'OVER_SPAN' THEN 'Average span of control exceeds best practice'
          WHEN 'DEEP_LAYERS' THEN 'Organization has too many management layers'
          WHEN 'LOW_SAUDI_LAYER' THEN 'Saudization below target in management layers'
          WHEN 'HIGH_COST_TO_MANAGE' THEN 'Cost to manage exceeds industry benchmark'
          WHEN 'DUP_ROLE_TITLES' THEN 'Multiple employees with identical job titles'
        END,
        'current_value', CASE unnest
          WHEN 'OVER_SPAN' THEN v_avg_span
          WHEN 'DEEP_LAYERS' THEN v_max_layers
          WHEN 'LOW_SAUDI_LAYER' THEN v_saudization
          WHEN 'HIGH_COST_TO_MANAGE' THEN v_cost_to_manage
          WHEN 'DUP_ROLE_TITLES' THEN v_duplicate_titles
        END
      )
    FROM unnest(v_flags);
  END IF;
END;
$$;

-- OSI Data Retrieval Functions
CREATE OR REPLACE FUNCTION public.osi_get_overview_v1(p_case_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result JSONB;
  v_tenant_id UUID;
BEGIN
  -- Validate access
  SELECT tenant_id INTO v_tenant_id
  FROM public.dx_cases
  WHERE id = p_case_id AND tenant_id = get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied: %', p_case_id;
  END IF;
  
  SELECT jsonb_build_object(
    'headcount', headcount,
    'managers', managers,
    'span_avg', span_avg,
    'span_p90', span_p90,
    'layers_depth', layers_depth,
    'saudization', saudization,
    'female_pct', female_pct,
    'cost_total', cost_total,
    'cost_to_manage', cost_to_manage,
    'manager_overload_n', manager_overload_n,
    'duplicate_titles_n', duplicate_titles_n,
    'flags', flags,
    'created_at', created_at
  ) INTO v_result
  FROM public.osi_snapshots
  WHERE case_id = p_case_id AND scope = 'company'
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.osi_get_heatmap_v1(p_case_id UUID, p_dim TEXT DEFAULT 'department')
RETURNS TABLE(
  label_en TEXT,
  label_ar TEXT,
  headcount INT,
  span_avg NUMERIC,
  layers INT,
  saudization NUMERIC,
  cost_total NUMERIC,
  flags TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Validate access
  SELECT tenant_id INTO v_tenant_id
  FROM public.dx_cases
  WHERE id = p_case_id AND tenant_id = get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied: %', p_case_id;
  END IF;
  
  -- Return heatmap data by dimension
  IF p_dim = 'department' THEN
    RETURN QUERY
    SELECT 
      COALESCE(e.department_name_en, 'Unknown') as label_en,
      COALESCE(e.department_name_ar, 'غير معروف') as label_ar,
      COUNT(e.id)::INT as headcount,
      ROUND(AVG(COALESCE(ms.span, 0)), 2) as span_avg,
      COALESCE(MAX(ol.layer), 1) as layers,
      ROUND(AVG(CASE WHEN e.is_saudi THEN 100.0 ELSE 0.0 END), 1) as saudization,
      SUM(c.monthly_cost) as cost_total,
      ARRAY_AGG(DISTINCT 
        CASE 
          WHEN ms.overload THEN 'OVER_SPAN'
          WHEN ol.layer > 5 THEN 'DEEP_LAYERS'
        END
      ) FILTER (WHERE ms.overload OR ol.layer > 5) as flags
    FROM public.v_org_current e
    LEFT JOIN public.v_manager_spans ms ON e.id = ms.manager_id
    LEFT JOIN public.v_org_layers ol ON e.id = ol.id
    LEFT JOIN public.v_costs c ON e.id = c.employee_id
    WHERE e.tenant_id = v_tenant_id
    GROUP BY e.department_id, e.department_name_en, e.department_name_ar
    HAVING COUNT(e.id) > 0;
  END IF;
END;
$$;

-- Seed KSA contracting benchmarks
INSERT INTO public.osi_benchmarks (function, grade, target_span, max_layers, target_cost_to_manage) VALUES
  ('Engineering', 'Senior Manager', 6, 5, 15.0),
  ('Engineering', 'Manager', 8, 4, 12.0),
  ('Engineering', 'Team Lead', 5, 3, 8.0),
  ('Operations', 'Senior Manager', 8, 5, 16.0),
  ('Operations', 'Manager', 10, 4, 14.0),
  ('Operations', 'Supervisor', 12, 3, 10.0),
  ('Finance', 'Senior Manager', 5, 5, 18.0),
  ('Finance', 'Manager', 7, 4, 15.0),
  ('HR', 'Senior Manager', 6, 5, 16.0),
  ('HR', 'Manager', 8, 4, 14.0),
  ('Sales', 'Senior Manager', 7, 5, 14.0),
  ('Sales', 'Manager', 10, 4, 12.0)
ON CONFLICT (function, grade) DO NOTHING;