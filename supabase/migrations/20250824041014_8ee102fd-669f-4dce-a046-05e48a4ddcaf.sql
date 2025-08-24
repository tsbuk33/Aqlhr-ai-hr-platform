-- Drop existing retention function first
DROP FUNCTION IF EXISTS public.dev_seed_retention_v1(uuid);

-- Create helper functions to read employment status values from check constraints

-- Returns the list of allowed employment_status values from the CHECK constraint
CREATE OR REPLACE FUNCTION public.hr_employment_status_values()
RETURNS TABLE (status text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH def AS (
    SELECT pg_get_constraintdef(c.oid) AS txt
    FROM pg_constraint c
    WHERE c.conrelid = 'public.hr_employees'::regclass
      AND c.conname = 'hr_employees_employment_status_check'
    LIMIT 1
  ),
  inner_txt AS (
    -- pull the (...) part and remove spaces
    SELECT replace(regexp_replace(txt, '.*\((.*)\).*', '\1'), ' ', '') AS lst
    FROM def
  )
  SELECT trim(both '''' FROM x) AS status
  FROM inner_txt, LATERAL regexp_split_to_table(lst, ',') AS x;
$$;

-- Prefer common "active" synonyms, else fall back to the first value
CREATE OR REPLACE FUNCTION public.hr_pick_active_status()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT status FROM public.hr_employment_status_values()
     WHERE lower(status) IN ('active','onboarded','hired') LIMIT 1),
    (SELECT status FROM public.hr_employment_status_values() LIMIT 1)
  );
$$;

-- Prefer common exit synonyms; else pick any value different from active
CREATE OR REPLACE FUNCTION public.hr_pick_exit_status()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT status FROM public.hr_employment_status_values()
     WHERE lower(status) IN ('terminated','inactive','left','exited','resigned') LIMIT 1),
    (SELECT status FROM public.hr_employment_status_values()
     WHERE status <> public.hr_pick_active_status() LIMIT 1),
    (SELECT status FROM public.hr_employment_status_values() LIMIT 1)
  );
$$;

-- Create hr_employee_exits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.hr_employee_exits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid NOT NULL,
  company_id uuid NOT NULL,
  exit_date date NOT NULL,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(employee_id, exit_date)
);

-- Enable RLS on hr_employee_exits
ALTER TABLE public.hr_employee_exits ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for hr_employee_exits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hr_employee_exits' 
    AND policyname = 'Users can manage employee exits from their company'
  ) THEN
    CREATE POLICY "Users can manage employee exits from their company"
    ON public.hr_employee_exits
    FOR ALL
    USING (company_id = get_user_company_id())
    WITH CHECK (company_id = get_user_company_id());
  END IF;
END $$;

-- Update retention seeding function
CREATE OR REPLACE FUNCTION public.dev_seed_retention_v1(p_tenant uuid DEFAULT public.get_demo_tenant_id())
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exit_status text := public.hr_pick_exit_status();
  v_active_status text := public.hr_pick_active_status();
BEGIN
  -- Skip if retention data already exists
  IF EXISTS (SELECT 1 FROM public.hr_employee_exits WHERE company_id = p_tenant LIMIT 1) THEN
    RETURN;
  END IF;

  -- Pick ~120 random active employees for demo exits
  WITH picked AS (
    SELECT e.id,
           e.company_id,
           (current_date - ((random()*360)::int))::date AS exit_date
    FROM public.hr_employees e
    WHERE e.company_id = p_tenant
      AND e.employment_status = v_active_status
    ORDER BY random() LIMIT 120
  ),
  marked AS (
    UPDATE public.hr_employees e
    SET employment_status = v_exit_status
    FROM picked p
    WHERE e.id = p.id
    RETURNING e.id
  )
  INSERT INTO public.hr_employee_exits (employee_id, company_id, exit_date, reason)
  SELECT p.id, p.company_id, p.exit_date, 'demo'
  FROM picked p
  ON CONFLICT (employee_id, exit_date) DO NOTHING;
END;
$$;