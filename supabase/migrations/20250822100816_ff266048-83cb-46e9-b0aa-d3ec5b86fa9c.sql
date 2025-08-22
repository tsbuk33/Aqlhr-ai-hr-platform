-- OSI v1: Simple schema updates and component creation

-- Add missing columns to osi_snapshots if they don't exist
DO $$ 
BEGIN
  -- Add tenant_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='osi_snapshots' AND column_name='tenant_id') THEN
    ALTER TABLE public.osi_snapshots ADD COLUMN tenant_id UUID;
  END IF;
  
  -- Add scope column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='osi_snapshots' AND column_name='scope') THEN
    ALTER TABLE public.osi_snapshots ADD COLUMN scope TEXT DEFAULT 'overall';
  END IF;
  
  -- Add scope_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='osi_snapshots' AND column_name='scope_id') THEN
    ALTER TABLE public.osi_snapshots ADD COLUMN scope_id UUID;
  END IF;
  
  -- Add managers column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='osi_snapshots' AND column_name='managers') THEN
    ALTER TABLE public.osi_snapshots ADD COLUMN managers INT DEFAULT 0;
  END IF;
  
  -- Add vacant_positions_n column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='osi_snapshots' AND column_name='vacant_positions_n') THEN
    ALTER TABLE public.osi_snapshots ADD COLUMN vacant_positions_n INT DEFAULT 0;
  END IF;
END $$;

-- Create comp_grade_midpoints table
CREATE TABLE IF NOT EXISTS public.comp_grade_midpoints (
  grade_id UUID PRIMARY KEY,
  grade_code TEXT,
  midpoint_monthly NUMERIC
);

-- Enable RLS on new table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comp_grade_midpoints' AND schemaname = 'public'
  ) THEN
    ALTER TABLE public.comp_grade_midpoints ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Update existing osi_snapshots records with tenant_id if missing
UPDATE public.osi_snapshots 
SET tenant_id = (
  SELECT tenant_id FROM public.dx_cases 
  WHERE dx_cases.id = osi_snapshots.case_id
  LIMIT 1
)
WHERE tenant_id IS NULL;

-- Update scope for existing records
UPDATE public.osi_snapshots 
SET scope = 'overall' 
WHERE scope IS NULL;

-- Add scope constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'osi_snapshots_scope_check'
  ) THEN
    ALTER TABLE public.osi_snapshots 
    ADD CONSTRAINT osi_snapshots_scope_check 
    CHECK (scope IN ('overall', 'dept', 'grade', 'manager'));
  END IF;
END $$;

-- RLS Policies for comp_grade_midpoints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comp_grade_midpoints' 
    AND policyname = 'Users can view grade midpoints'
  ) THEN
    CREATE POLICY "Users can view grade midpoints"
    ON public.comp_grade_midpoints FOR SELECT
    USING (true);
  END IF;
END $$;

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

-- Create SKU_OSI entitlement if it doesn't exist
INSERT INTO public.sku_catalog (sku_code, module_group, name_en, name_ar, monthly_sar, yearly_sar, seats_included, is_active) VALUES
('SKU_OSI', 'Diagnostics', 'Organization Structure Intelligence', 'ذكاء الهيكل التنظيمي', 500, 5000, 1, true)
ON CONFLICT (sku_code) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  monthly_sar = EXCLUDED.monthly_sar,
  yearly_sar = EXCLUDED.yearly_sar;