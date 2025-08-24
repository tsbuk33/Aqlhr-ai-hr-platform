-- Create helper that returns a valid employment status
CREATE OR REPLACE FUNCTION public.hr_valid_employment_status_v1()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_default text;
  v_any     text;
BEGIN
  -- 1) try the column default (e.g., 'active')
  SELECT regexp_replace(column_default::text, '^''(.*)''::.*$', '\1')
  INTO v_default
  FROM information_schema.columns
  WHERE table_schema='public'
    AND table_name='hr_employees'
    AND column_name='employment_status';
  IF v_default IS NOT NULL AND v_default <> '' THEN
    RETURN v_default;
  END IF;

  -- 2) else parse the CHECK constraint and pick the first allowed value
  SELECT trim(BOTH '''' FROM regexp_replace(x, '::text', ''))
  INTO v_any
  FROM (
    SELECT (regexp_matches(pg_get_constraintdef(oid), 'ARRAY\\[(.*?)\\]'))[1] AS raw
    FROM pg_constraint
    WHERE conname = 'hr_employees_employment_status_check'
    LIMIT 1
  ) s,
  LATERAL regexp_split_to_table(s.raw, '\\s*,\\s*') AS x
  LIMIT 1;

  RETURN COALESCE(v_any, 'active');  -- final fallback
END $$;

-- Update the seeding RPC to use the valid employment status
CREATE OR REPLACE FUNCTION public.dev_seed_employees_v1()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant_id UUID;
  v_status text := public.hr_valid_employment_status_v1();
BEGIN
  -- Get demo tenant ID
  SELECT id INTO v_tenant_id 
  FROM public.companies 
  WHERE name ILIKE '%demo%' 
  LIMIT 1;
  
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No demo tenant found');
  END IF;

  -- Check if employees already exist for this tenant (idempotent)
  IF EXISTS (SELECT 1 FROM public.hr_employees WHERE company_id = v_tenant_id LIMIT 1) THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Demo employees already exist for this tenant',
      'tenant_id', v_tenant_id,
      'existing_count', (SELECT COUNT(*) FROM public.hr_employees WHERE company_id = v_tenant_id)
    );
  END IF;

  -- Insert demo departments
  INSERT INTO public.hr_departments (id, company_id, name_en, name_ar, code, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'Engineering', 'الهندسة', 'ENG', true),
    (gen_random_uuid(), v_tenant_id, 'Sales', 'المبيعات', 'SAL', true),
    (gen_random_uuid(), v_tenant_id, 'Marketing', 'التسويق', 'MKT', true),
    (gen_random_uuid(), v_tenant_id, 'HR', 'الموارد البشرية', 'HR', true),
    (gen_random_uuid(), v_tenant_id, 'Finance', 'المالية', 'FIN', true),
    (gen_random_uuid(), v_tenant_id, 'Operations', 'العمليات', 'OPS', true)
  ON CONFLICT (company_id, code) DO NOTHING;

  -- Insert demo jobs
  INSERT INTO public.hr_jobs (id, company_id, title_en, title_ar, code, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'Software Engineer', 'مهندس برمجيات', 'SE', true),
    (gen_random_uuid(), v_tenant_id, 'Sales Manager', 'مدير مبيعات', 'SM', true),
    (gen_random_uuid(), v_tenant_id, 'Marketing Specialist', 'أخصائي تسويق', 'MS', true),
    (gen_random_uuid(), v_tenant_id, 'HR Coordinator', 'منسق موارد بشرية', 'HC', true),
    (gen_random_uuid(), v_tenant_id, 'Financial Analyst', 'محلل مالي', 'FA', true),
    (gen_random_uuid(), v_tenant_id, 'Operations Manager', 'مدير عمليات', 'OM', true),
    (gen_random_uuid(), v_tenant_id, 'Senior Engineer', 'مهندس أول', 'SEN', true),
    (gen_random_uuid(), v_tenant_id, 'Project Manager', 'مدير مشروع', 'PM', true),
    (gen_random_uuid(), v_tenant_id, 'Data Analyst', 'محلل بيانات', 'DA', true),
    (gen_random_uuid(), v_tenant_id, 'Quality Assurance', 'ضمان الجودة', 'QA', true)
  ON CONFLICT (company_id, code) DO NOTHING;

  -- Insert demo grades
  INSERT INTO public.hr_grades (id, company_id, name_en, name_ar, level_no, min_salary, max_salary, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'Junior', 'مبتدئ', 1, 3000, 5000, true),
    (gen_random_uuid(), v_tenant_id, 'Mid-level', 'متوسط', 2, 5000, 8000, true),
    (gen_random_uuid(), v_tenant_id, 'Senior', 'متقدم', 3, 8000, 12000, true),
    (gen_random_uuid(), v_tenant_id, 'Lead', 'قائد', 4, 12000, 18000, true),
    (gen_random_uuid(), v_tenant_id, 'Manager', 'مدير', 5, 15000, 25000, true)
  ON CONFLICT (company_id, level_no) DO NOTHING;

  -- Generate 1000 demo employees with proper employment_status
  INSERT INTO public.hr_employees (
    id, company_id, employee_no, full_name_en, full_name_ar, 
    gender, is_saudi, nationality, hire_date, basic_salary, 
    employment_status, dept_id, job_id, grade_id
  )
  SELECT 
    gen_random_uuid(),
    v_tenant_id,
    'EMP' || LPAD(generate_series::text, 4, '0'),
    CASE 
      WHEN random() < 0.5 THEN 'Ahmed Mohammed Al-Rashid'
      WHEN random() < 0.5 THEN 'Sara Abdullah Al-Fahad'
      WHEN random() < 0.5 THEN 'Omar Hassan Al-Mutairi'
      WHEN random() < 0.5 THEN 'Fatima Ali Al-Zahra'
      ELSE 'Khalid Ibrahim Al-Mansouri'
    END,
    CASE 
      WHEN random() < 0.5 THEN 'أحمد محمد الراشد'
      WHEN random() < 0.5 THEN 'سارة عبدالله الفهد'
      WHEN random() < 0.5 THEN 'عمر حسن المطيري'
      WHEN random() < 0.5 THEN 'فاطمة علي الزهراء'
      ELSE 'خالد إبراهيم المنصوري'
    END,
    CASE WHEN random() < 0.6 THEN 'M' ELSE 'F' END,
    random() < 0.67,  -- 67% Saudi
    CASE WHEN random() < 0.67 THEN 'Saudi' ELSE 'Egyptian' END,
    CURRENT_DATE - (random() * 3650)::int,  -- Random hire date within last 10 years
    3000 + (random() * 15000)::int,  -- Salary between 3000-18000
    v_status,  -- Use the valid employment status
    (SELECT id FROM public.hr_departments WHERE company_id = v_tenant_id ORDER BY random() LIMIT 1),
    (SELECT id FROM public.hr_jobs WHERE company_id = v_tenant_id ORDER BY random() LIMIT 1),
    (SELECT id FROM public.hr_grades WHERE company_id = v_tenant_id ORDER BY random() LIMIT 1)
  FROM generate_series(1, 1000);

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Successfully seeded 1000 demo employees',
    'tenant_id', v_tenant_id,
    'employees_created', 1000,
    'employment_status_used', v_status
  );
END $$;