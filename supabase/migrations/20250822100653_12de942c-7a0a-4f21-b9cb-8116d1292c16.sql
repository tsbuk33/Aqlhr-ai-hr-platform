-- OSI v1: Fix existing table schemas and add missing components

-- Add missing columns to osi_snapshots if they don't exist
ALTER TABLE public.osi_snapshots 
ADD COLUMN IF NOT EXISTS tenant_id UUID;

ALTER TABLE public.osi_snapshots 
ADD COLUMN IF NOT EXISTS scope TEXT;

ALTER TABLE public.osi_snapshots 
ADD COLUMN IF NOT EXISTS scope_id UUID;

ALTER TABLE public.osi_snapshots 
ADD COLUMN IF NOT EXISTS managers INT;

ALTER TABLE public.osi_snapshots 
ADD COLUMN IF NOT EXISTS vacant_positions_n INT;

-- Update scope constraint
ALTER TABLE public.osi_snapshots 
DROP CONSTRAINT IF EXISTS osi_snapshots_scope_check;

ALTER TABLE public.osi_snapshots 
ADD CONSTRAINT osi_snapshots_scope_check 
CHECK (scope IN ('overall', 'dept', 'grade', 'manager'));

-- Create comp_grade_midpoints table
CREATE TABLE IF NOT EXISTS public.comp_grade_midpoints (
  grade_id UUID PRIMARY KEY,
  grade_code TEXT,
  midpoint_monthly NUMERIC
);

-- Enable RLS on new table
ALTER TABLE public.comp_grade_midpoints ENABLE ROW LEVEL SECURITY;

-- Add tenant_id constraint and update existing rows
UPDATE public.osi_snapshots 
SET tenant_id = (
  SELECT tenant_id FROM public.dx_cases 
  WHERE dx_cases.id = osi_snapshots.case_id
)
WHERE tenant_id IS NULL;

-- Make tenant_id NOT NULL after updating
ALTER TABLE public.osi_snapshots 
ALTER COLUMN tenant_id SET NOT NULL;

-- Update scope for existing records
UPDATE public.osi_snapshots 
SET scope = 'overall' 
WHERE scope IS NULL;

-- Make scope NOT NULL after updating
ALTER TABLE public.osi_snapshots 
ALTER COLUMN scope SET NOT NULL;

-- Update RLS policies for osi_snapshots
DROP POLICY IF EXISTS "Users can manage OSI snapshots from their cases" ON public.osi_snapshots;
CREATE POLICY "Users can manage OSI snapshots from their cases"
ON public.osi_snapshots FOR ALL
USING (tenant_id = get_user_company_id());

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

-- Seed some sample grade midpoints
INSERT INTO public.comp_grade_midpoints (grade_id, grade_code, midpoint_monthly) VALUES
(gen_random_uuid(), 'L1', 25000),
(gen_random_uuid(), 'L2', 20000),
(gen_random_uuid(), 'L3', 15000),
(gen_random_uuid(), 'L4', 12000),
(gen_random_uuid(), 'L5', 10000),
(gen_random_uuid(), 'M1', 18000),
(gen_random_uuid(), 'M2', 14000),
(gen_random_uuid(), 'S1', 8000),
(gen_random_uuid(), 'S2', 6000)
ON CONFLICT (grade_id) DO NOTHING;

-- Create/update OSI views with proper structure
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

-- Enhanced v_manager_spans view
CREATE OR REPLACE VIEW public.v_manager_spans AS
SELECT 
  e.manager_id,
  COUNT(*) as span,
  e.grade_id,
  COALESCE(ob.target_span, 8) as target_span,
  COUNT(*) > COALESCE(ob.target_span, 8) as overload,
  e.company_id as tenant_id,
  COALESCE(e.full_name_en, 'Unknown Manager') as full_name_en,
  COALESCE(g.name_en, 'Unknown Grade') as grade_name
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
GROUP BY e.manager_id, e.grade_id, ob.target_span, e.company_id, e.full_name_en, g.name_en;

-- Create SKU_OSI entitlement if it doesn't exist
INSERT INTO public.sku_catalog (sku_code, module_group, name_en, name_ar, monthly_sar, yearly_sar, seats_included, is_active) VALUES
('SKU_OSI', 'Diagnostics', 'Organization Structure Intelligence', 'ذكاء الهيكل التنظيمي', 500, 5000, 1, true)
ON CONFLICT (sku_code) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  monthly_sar = EXCLUDED.monthly_sar,
  yearly_sar = EXCLUDED.yearly_sar;

-- Add OSI entitlement for demo tenant (14-day trial)
INSERT INTO public.tenant_entitlements (tenant_id, sku_code, active, seats, started_at, ends_at) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'SKU_OSI',
  true,
  1,
  now(),
  now() + interval '14 days'
WHERE NOT EXISTS (
  SELECT 1 FROM public.tenant_entitlements 
  WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000'::uuid 
  AND sku_code = 'SKU_OSI'
);