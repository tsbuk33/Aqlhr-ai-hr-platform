-- Replace hr_employees_count_v1 to return real counts per tenant
CREATE OR REPLACE FUNCTION public.hr_employees_count_v1(p_tenant uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT count(*)::int
  FROM public.hr_employees e
  WHERE e.company_id = p_tenant
    AND (e.employment_status IS NULL OR e.employment_status <> 'terminated');
$$;

-- Replace hr_employees_list_v1 to return paginated list with basic fields used by UI
CREATE OR REPLACE FUNCTION public.hr_employees_list_v1(
  p_tenant uuid,
  p_page integer DEFAULT 1,
  p_limit integer DEFAULT 50,
  p_search text DEFAULT NULL,
  p_department text DEFAULT NULL,
  p_status text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  employee_number text,
  full_name text,
  email text,
  phone text,
  iqama_number text,
  "position" text,
  department text,
  status text,
  hire_date date,
  salary numeric,
  is_saudi boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH base AS (
    SELECT 
      e.id,
      e.employee_no AS employee_number,
      COALESCE(e.full_name_ar, e.full_name_en) AS full_name,
      NULL::text AS email,
      NULL::text AS phone,
      NULL::text AS iqama_number,
      NULL::text AS "position",
      COALESCE(d.name_ar, d.name_en, '—') AS department,
      COALESCE(e.employment_status, 'active') AS status,
      e.hire_date,
      COALESCE(e.monthly_salary, e.base_salary) AS salary,
      e.is_saudi
    FROM public.hr_employees e
    LEFT JOIN public.hr_departments d ON d.id = e.dept_id
    WHERE e.company_id = p_tenant
      AND (p_status IS NULL OR e.employment_status = p_status)
      AND (p_department IS NULL OR d.name_en = p_department OR d.name_ar = p_department)
      AND (
        p_search IS NULL OR p_search = '' OR 
        e.employee_no ILIKE '%' || p_search || '%' OR 
        e.full_name_en ILIKE '%' || p_search || '%' OR 
        e.full_name_ar ILIKE '%' || p_search || '%'
      )
  )
  SELECT *
  FROM base
  ORDER BY hire_date DESC NULLS LAST, full_name ASC
  LIMIT GREATEST(1, p_limit)
  OFFSET GREATEST(0, (p_page - 1)) * GREATEST(1, p_limit);
$$;

-- Seed 1000 employees for a tenant (idempotent by employee_no)
CREATE OR REPLACE FUNCTION public.dev_seed_employees_v1(p_tenant uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_inserted int := 0;
  v_existing int := 0;
BEGIN
  -- Count existing
  SELECT count(*) INTO v_existing FROM public.hr_employees WHERE company_id = p_tenant;

  -- Insert up to 1000 demo employees if not already present
  WITH params AS (
    SELECT p_tenant AS tenant
  ), seq AS (
    SELECT generate_series(1, 1000) AS n
  ), dept AS (
    SELECT id FROM public.hr_departments WHERE company_id = p_tenant ORDER BY name_en LIMIT 1
  ), ins AS (
    INSERT INTO public.hr_employees (
      id, company_id, employee_no, full_name_en, full_name_ar,
      gender, nationality_code, is_saudi, hire_date, dept_id,
      employment_status, monthly_salary, iqama_expiry
    )
    SELECT 
      gen_random_uuid(),
      p_tenant,
      'EMP' || lpad(n::text, 4, '0') as employee_no,
      'Employee ' || n::text as full_name_en,
      'موظف ' || n::text as full_name_ar,
      (CASE WHEN (random() < 0.5) THEN 'male' ELSE 'female' END) as gender,
      (CASE WHEN (random() < 0.7) THEN 'SAU' ELSE 'EGY' END) as nationality_code,
      (CASE WHEN (random() < 0.7) THEN true ELSE false END) as is_saudi,
      (current_date - (trunc(random()*1095))::int) as hire_date, -- up to 3 years ago
      (SELECT id FROM dept LIMIT 1),
      'active' as employment_status,
      round(5000 + random()*15000,2) as monthly_salary,
      (CASE WHEN (random() < 0.3) THEN (current_date + (30 + trunc(random()*365))::int) ELSE NULL END) as iqama_expiry
    FROM seq
    WHERE NOT EXISTS (
      SELECT 1 FROM public.hr_employees e WHERE e.company_id = p_tenant AND e.employee_no = 'EMP' || lpad(n::text, 4, '0')
    )
    RETURNING 1
  )
  SELECT count(*) INTO v_inserted FROM ins;

  RETURN jsonb_build_object(
    'seeded', true,
    'inserted', v_inserted,
    'existing_before', v_existing,
    'tenant_id', p_tenant
  );
END;
$$;