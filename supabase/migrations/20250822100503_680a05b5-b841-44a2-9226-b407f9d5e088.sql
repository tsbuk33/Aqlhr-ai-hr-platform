-- OSI v1: Complete Organization Structure Intelligence Implementation
-- This migration creates/updates all OSI components to match specifications

-- Create/update osi_snapshots table
CREATE TABLE IF NOT EXISTS public.osi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  case_id UUID NOT NULL REFERENCES public.dx_cases(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('overall', 'dept', 'grade', 'manager')),
  scope_id UUID,
  headcount INT,
  managers INT,
  span_avg NUMERIC,
  span_p90 NUMERIC,
  layers_depth INT,
  saudization NUMERIC,
  female_pct NUMERIC,
  cost_total NUMERIC,
  cost_to_manage NUMERIC,
  manager_overload_n INT,
  duplicate_titles_n INT,
  vacant_positions_n INT,
  flags TEXT[],
  n INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create/update osi_benchmarks table
CREATE TABLE IF NOT EXISTS public.osi_benchmarks (
  function TEXT NOT NULL,
  grade TEXT NOT NULL,
  target_span NUMERIC,
  max_layers INT,
  target_cost_to_manage NUMERIC,
  PRIMARY KEY (function, grade)
);

-- Create comp_grade_midpoints table
CREATE TABLE IF NOT EXISTS public.comp_grade_midpoints (
  grade_id UUID PRIMARY KEY,
  grade_code TEXT,
  midpoint_monthly NUMERIC
);

-- Enable RLS
ALTER TABLE public.osi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osi_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comp_grade_midpoints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for osi_snapshots
DROP POLICY IF EXISTS "Users can manage OSI snapshots from their cases" ON public.osi_snapshots;
CREATE POLICY "Users can manage OSI snapshots from their cases"
ON public.osi_snapshots FOR ALL
USING (tenant_id = get_user_company_id());

-- RLS Policies for osi_benchmarks
DROP POLICY IF EXISTS "Users can view OSI benchmarks" ON public.osi_benchmarks;
CREATE POLICY "Users can view OSI benchmarks"
ON public.osi_benchmarks FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage OSI benchmarks" ON public.osi_benchmarks;
CREATE POLICY "Admins can manage OSI benchmarks"
ON public.osi_benchmarks FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role IN ('admin', 'hr_manager', 'super_admin')
));

-- RLS Policies for comp_grade_midpoints
DROP POLICY IF EXISTS "Users can view grade midpoints" ON public.comp_grade_midpoints;
CREATE POLICY "Users can view grade midpoints"
ON public.comp_grade_midpoints FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage grade midpoints" ON public.comp_grade_midpoints;
CREATE POLICY "Admins can manage grade midpoints"
ON public.comp_grade_midpoints FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role IN ('admin', 'hr_manager', 'super_admin')
));

-- Seed OSI benchmarks for KSA/Contracting
INSERT INTO public.osi_benchmarks (function, grade, target_span, max_layers, target_cost_to_manage) VALUES
-- Project/Operations benchmarks
('Project/Operations', 'L2', 8, 6, 0.15),
('Project/Operations', 'L3', 10, 6, 0.15),
('Project/Operations', 'L4', 12, 6, 0.15),
('Project/Operations', 'L5', 12, 6, 0.15),
-- Support/Shared Services benchmarks
('Support/Shared Services', 'L2', 6, 5, 0.13),
('Support/Shared Services', 'L3', 8, 5, 0.13),
('Support/Shared Services', 'L4', 10, 5, 0.13),
('Support/Shared Services', 'L5', 10, 5, 0.13),
-- Additional benchmarks
('Management', 'L1', 5, 4, 0.12),
('Management', 'L2', 7, 5, 0.14),
('Technical', 'L3', 9, 6, 0.16),
('Technical', 'L4', 11, 6, 0.16)
ON CONFLICT (function, grade) DO UPDATE SET
  target_span = EXCLUDED.target_span,
  max_layers = EXCLUDED.max_layers,
  target_cost_to_manage = EXCLUDED.target_cost_to_manage;

-- Create v_org_current view (no PII columns)
CREATE OR REPLACE VIEW public.v_org_current AS
SELECT 
  e.id as employee_id,
  e.manager_id,
  e.dept_id,
  e.job_id,
  e.grade_id,
  e.nationality_code,
  e.gender,
  COALESCE(e.base_salary, cgm.midpoint_monthly, 8000) as monthly_salary,
  CASE WHEN e.employment_status = 'active' THEN true ELSE false END as active,
  e.company_id as tenant_id
FROM public.hr_employees e
LEFT JOIN public.comp_grade_midpoints cgm ON e.grade_id = cgm.grade_id
WHERE e.employment_status = 'active';

-- Create v_manager_spans view
CREATE OR REPLACE VIEW public.v_manager_spans AS
SELECT 
  e.manager_id,
  COUNT(*) as span,
  e.grade_id,
  COALESCE(ob.target_span, 8) as target_span,
  COUNT(*) > COALESCE(ob.target_span, 8) as overload,
  e.company_id as tenant_id
FROM public.hr_employees e
LEFT JOIN public.hr_grades g ON e.grade_id = g.id
LEFT JOIN public.osi_benchmarks ob ON (
  CASE 
    WHEN g.name_en ILIKE '%project%' OR g.name_en ILIKE '%operations%' THEN 'Project/Operations'
    WHEN g.name_en ILIKE '%support%' OR g.name_en ILIKE '%shared%' THEN 'Support/Shared Services'
    ELSE 'Management'
  END = ob.function AND
  COALESCE(g.grade_level, 'L3') = ob.grade
)
WHERE e.manager_id IS NOT NULL 
  AND e.employment_status = 'active'
GROUP BY e.manager_id, e.grade_id, ob.target_span, e.company_id;

-- Create v_org_layers view
CREATE OR REPLACE VIEW public.v_org_layers WITH (SECURITY_DEFINER=true) AS
WITH RECURSIVE layer_calc AS (
  -- Base case: Top executives (no manager)
  SELECT 
    id as employee_id,
    manager_id,
    1 as layer_depth,
    company_id as tenant_id
  FROM public.hr_employees 
  WHERE manager_id IS NULL 
    AND employment_status = 'active'
  
  UNION ALL
  
  -- Recursive case: Employees with managers
  SELECT 
    e.id as employee_id,
    e.manager_id,
    lc.layer_depth + 1,
    e.company_id as tenant_id
  FROM public.hr_employees e
  INNER JOIN layer_calc lc ON e.manager_id = lc.employee_id
  WHERE e.employment_status = 'active'
)
SELECT 
  employee_id,
  manager_id,
  layer_depth,
  tenant_id
FROM layer_calc;

-- Create v_costs view
CREATE OR REPLACE VIEW public.v_costs AS
SELECT 
  e.id as employee_id,
  e.company_id as tenant_id,
  COALESCE(e.base_salary, cgm.midpoint_monthly, 8000) as monthly_cost
FROM public.hr_employees e
LEFT JOIN public.comp_grade_midpoints cgm ON e.grade_id = cgm.grade_id
WHERE e.employment_status = 'active';

-- Enhanced OSI computation function
CREATE OR REPLACE FUNCTION public.osi_compute_case_v1(p_case_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
  v_baseline_date DATE;
  v_total_headcount INT;
  v_total_managers INT;
  v_span_avg NUMERIC;
  v_span_p90 NUMERIC;
  v_layers_depth INT;
  v_saudization NUMERIC;
  v_female_pct NUMERIC;
  v_cost_total NUMERIC;
  v_cost_to_manage NUMERIC;
  v_manager_overload_n INT;
  v_duplicate_titles_n INT;
  v_vacant_positions_n INT;
  v_flags TEXT[] := '{}';
  v_result JSONB;
BEGIN
  -- Get case details
  SELECT tenant_id, baseline_date INTO v_tenant_id, v_baseline_date
  FROM public.dx_cases 
  WHERE id = p_case_id;
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied: %', p_case_id;
  END IF;
  
  -- Compute overall metrics
  SELECT 
    COUNT(*),
    COUNT(DISTINCT manager_id) FILTER (WHERE manager_id IS NOT NULL),
    ROUND(AVG(span), 2),
    ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY span), 2),
    MAX(layer_depth),
    ROUND(AVG(CASE WHEN nationality_code = 'SA' THEN 100.0 ELSE 0.0 END), 1),
    ROUND(AVG(CASE WHEN gender = 'female' THEN 100.0 ELSE 0.0 END), 1),
    SUM(monthly_salary),
    ROUND((SUM(CASE WHEN manager_id IS NOT NULL THEN monthly_salary ELSE 0 END) / NULLIF(SUM(monthly_salary), 0)) * 100, 2),
    COUNT(*) FILTER (WHERE overload = true),
    0, -- Will calculate duplicate titles separately
    0  -- Will calculate vacant positions separately
  INTO 
    v_total_headcount, v_total_managers, v_span_avg, v_span_p90, v_layers_depth,
    v_saudization, v_female_pct, v_cost_total, v_cost_to_manage,
    v_manager_overload_n, v_duplicate_titles_n, v_vacant_positions_n
  FROM (
    SELECT 
      oc.*,
      COALESCE(ms.span, 0) as span,
      COALESCE(ol.layer_depth, 1) as layer_depth,
      COALESCE(ms.overload, false) as overload
    FROM public.v_org_current oc
    LEFT JOIN public.v_manager_spans ms ON oc.employee_id = ms.manager_id
    LEFT JOIN public.v_org_layers ol ON oc.employee_id = ol.employee_id
    WHERE oc.tenant_id = v_tenant_id
  ) combined;
  
  -- Calculate duplicate titles
  SELECT COUNT(*)
  INTO v_duplicate_titles_n
  FROM (
    SELECT j.title_en, COUNT(*) as title_count
    FROM public.hr_employees e
    JOIN public.hr_jobs j ON e.job_id = j.id
    WHERE e.company_id = v_tenant_id 
      AND e.employment_status = 'active'
      AND j.title_en IS NOT NULL
    GROUP BY j.title_en
    HAVING COUNT(*) > 1
  ) dups;
  
  -- Generate flags based on thresholds
  IF v_manager_overload_n > 0 THEN
    v_flags := v_flags || 'OVER_SPAN';
  END IF;
  
  IF v_layers_depth > 6 THEN
    v_flags := v_flags || 'DEEP_LAYERS';
  END IF;
  
  IF v_saudization < 40 THEN
    v_flags := v_flags || 'LOW_SAUDI_LAYER';
  END IF;
  
  IF v_cost_to_manage > 17 THEN
    v_flags := v_flags || 'HIGH_COST_TO_MANAGE';
  END IF;
  
  IF v_duplicate_titles_n > 3 THEN
    v_flags := v_flags || 'DUP_ROLE_TITLES';
  END IF;
  
  -- Insert overall snapshot
  INSERT INTO public.osi_snapshots (
    tenant_id, case_id, scope, scope_id, headcount, managers, span_avg, span_p90,
    layers_depth, saudization, female_pct, cost_total, cost_to_manage,
    manager_overload_n, duplicate_titles_n, vacant_positions_n, flags, n
  ) VALUES (
    v_tenant_id, p_case_id, 'overall', NULL, v_total_headcount, v_total_managers,
    v_span_avg, v_span_p90, v_layers_depth, v_saudization, v_female_pct,
    v_cost_total, v_cost_to_manage, v_manager_overload_n, v_duplicate_titles_n,
    v_vacant_positions_n, v_flags, v_total_headcount
  );
  
  -- Update dx_scores
  INSERT INTO public.dx_scores (case_id, module, metric, value, benchmark, variance)
  VALUES 
    (p_case_id, 'OSI', 'org_health_score', 100 - (array_length(v_flags, 1) * 10), 90, 0),
    (p_case_id, 'OSI', 'span_avg', v_span_avg, 8, v_span_avg - 8),
    (p_case_id, 'OSI', 'layers_depth', v_layers_depth, 6, v_layers_depth - 6),
    (p_case_id, 'OSI', 'cost_to_manage', v_cost_to_manage, 15, v_cost_to_manage - 15),
    (p_case_id, 'OSI', 'saudization', v_saudization, 50, v_saudization - 50)
  ON CONFLICT (case_id, module, metric) 
  DO UPDATE SET value = EXCLUDED.value, variance = EXCLUDED.variance;
  
  -- Insert flags
  DELETE FROM public.dx_flags WHERE case_id = p_case_id AND module = 'OSI';
  INSERT INTO public.dx_flags (case_id, module, flag_code, severity, description)
  SELECT p_case_id, 'OSI', unnest(v_flags), 'medium', 
    CASE unnest(v_flags)
      WHEN 'OVER_SPAN' THEN 'Management spans exceed best practice'
      WHEN 'DEEP_LAYERS' THEN 'Organization has too many layers'
      WHEN 'LOW_SAUDI_LAYER' THEN 'Low Saudization in key positions'
      WHEN 'HIGH_COST_TO_MANAGE' THEN 'High cost-to-manage ratio'
      WHEN 'DUP_ROLE_TITLES' THEN 'Duplicate role titles detected'
    END;
  
  -- Build result JSON
  v_result := jsonb_build_object(
    'tenant_id', v_tenant_id,
    'headcount', v_total_headcount,
    'managers', v_total_managers,
    'span_avg', v_span_avg,
    'span_p90', v_span_p90,
    'layers_depth', v_layers_depth,
    'saudization', v_saudization,
    'female_pct', v_female_pct,
    'cost_total', v_cost_total,
    'cost_to_manage', v_cost_to_manage,
    'manager_overload_n', v_manager_overload_n,
    'duplicate_titles_n', v_duplicate_titles_n,
    'vacant_positions_n', v_vacant_positions_n,
    'flags', v_flags,
    'org_health_score', 100 - (array_length(v_flags, 1) * 10),
    'computed_at', now()
  );
  
  RETURN v_result;
END;
$$;

-- Enhanced OSI overview function
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
  -- Verify access
  SELECT tenant_id INTO v_tenant_id
  FROM public.dx_cases 
  WHERE id = p_case_id AND tenant_id = get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied: %', p_case_id;
  END IF;
  
  -- Get latest snapshot
  SELECT jsonb_build_object(
    'tenant_id', tenant_id,
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
    'vacant_positions_n', vacant_positions_n,
    'flags', flags,
    'org_health_score', 100 - (array_length(flags, 1) * 10),
    'created_at', created_at
  ) INTO v_result
  FROM public.osi_snapshots
  WHERE case_id = p_case_id AND scope = 'overall'
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

-- OSI heatmap function
CREATE OR REPLACE FUNCTION public.osi_get_heatmap_v1(p_case_id UUID, p_dim TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result JSONB;
  v_tenant_id UUID;
BEGIN
  -- Verify access
  SELECT tenant_id INTO v_tenant_id
  FROM public.dx_cases 
  WHERE id = p_case_id AND tenant_id = get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied: %', p_case_id;
  END IF;
  
  -- Generate heatmap based on dimension
  IF p_dim = 'dept' THEN
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', scope_id,
        'name', d.name_en,
        'headcount', headcount,
        'manager_overload_n', manager_overload_n,
        'layers_depth', layers_depth,
        'cost_to_manage', cost_to_manage,
        'risk_score', COALESCE(manager_overload_n, 0) * 2 + COALESCE(layers_depth - 6, 0)
      )
    ) INTO v_result
    FROM public.osi_snapshots os
    LEFT JOIN public.hr_departments d ON os.scope_id = d.id
    WHERE os.case_id = p_case_id AND os.scope = 'dept';
  ELSE
    -- Default to manager heatmap
    SELECT jsonb_agg(
      jsonb_build_object(
        'manager_id', scope_id,
        'span', headcount,
        'overload', manager_overload_n > 0,
        'risk_score', COALESCE(manager_overload_n, 0) * 3
      )
    ) INTO v_result
    FROM public.osi_snapshots
    WHERE case_id = p_case_id AND scope = 'manager';
  END IF;
  
  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;