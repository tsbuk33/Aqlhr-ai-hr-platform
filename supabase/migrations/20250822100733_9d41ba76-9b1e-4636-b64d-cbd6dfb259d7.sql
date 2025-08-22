-- OSI v1: Complete Organization Structure Intelligence Implementation (Fixed)
-- This migration creates/updates all OSI components to match existing schema structure

-- Check and update osi_snapshots table structure
DO $$
BEGIN
  -- Add tenant_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'osi_snapshots' AND column_name = 'tenant_id') THEN
    -- If tenant_id doesn't exist, check for case_id reference to get tenant_id
    ALTER TABLE public.osi_snapshots ADD COLUMN tenant_id UUID;
    
    -- Update existing records to set tenant_id from dx_cases
    UPDATE public.osi_snapshots SET tenant_id = (
      SELECT dx_cases.tenant_id FROM public.dx_cases 
      WHERE dx_cases.id = osi_snapshots.case_id
    );
    
    -- Make tenant_id NOT NULL after populating
    ALTER TABLE public.osi_snapshots ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
  
  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'osi_snapshots' AND column_name = 'vacant_positions_n') THEN
    ALTER TABLE public.osi_snapshots ADD COLUMN vacant_positions_n INT;
  END IF;
END $$;

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

-- Drop and recreate RLS policies with proper column references
DROP POLICY IF EXISTS "Users can manage OSI snapshots from their cases" ON public.osi_snapshots;
CREATE POLICY "Users can manage OSI snapshots from their cases"
ON public.osi_snapshots FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.dx_cases c 
    WHERE c.id = osi_snapshots.case_id 
    AND c.tenant_id = get_user_company_id()
  )
);

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

-- Update OSI heatmap function
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