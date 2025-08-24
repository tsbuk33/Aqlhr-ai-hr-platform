-- Create RPC functions for demo data seeding with DB fallback

CREATE OR REPLACE FUNCTION public.dev_seed_employees_v1(p_tenant uuid, p_n int DEFAULT 1000)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_existing_count int;
  v_inserted_count int := 0;
  v_saudi_target int;
  v_non_saudi_target int;
  v_employee_record record;
  v_dept_id uuid;
  v_random_seed numeric;
BEGIN
  -- Check if employees already exist for this tenant
  SELECT COUNT(*) INTO v_existing_count 
  FROM public.hr_employees 
  WHERE company_id = p_tenant;
  
  -- If data exists, return early (idempotent)
  IF v_existing_count > 0 THEN
    RETURN json_build_object(
      'inserted_count', 0,
      'existing_count', v_existing_count,
      'message', 'Employees already exist for this tenant'
    );
  END IF;
  
  -- Calculate Saudization mix (target ~60% Saudi, 40% non-Saudi)
  v_saudi_target := FLOOR(p_n * 0.6);
  v_non_saudi_target := p_n - v_saudi_target;
  
  -- Set deterministic seed based on tenant ID for consistent results
  v_random_seed := ('x' || substr(p_tenant::text, 1, 8))::bit(32)::bigint / 4294967295.0;
  PERFORM setseed(v_random_seed);
  
  -- Get or create a default department
  SELECT id INTO v_dept_id 
  FROM public.hr_departments 
  WHERE company_id = p_tenant 
  LIMIT 1;
  
  IF v_dept_id IS NULL THEN
    INSERT INTO public.hr_departments (company_id, name_en, name_ar)
    VALUES (p_tenant, 'General Department', 'الإدارة العامة')
    RETURNING id INTO v_dept_id;
  END IF;
  
  -- Insert Saudi employees
  FOR i IN 1..v_saudi_target LOOP
    INSERT INTO public.hr_employees (
      company_id,
      dept_id,
      employee_no,
      full_name_en,
      full_name_ar,
      is_saudi,
      saudi_id,
      gender,
      nationality,
      basic_salary,
      employment_status,
      hire_date,
      job_title_en,
      job_title_ar
    ) VALUES (
      p_tenant,
      v_dept_id,
      'EMP' || LPAD(i::text, 4, '0'),
      'Employee ' || i,
      'موظف ' || i,
      true,
      '1' || LPAD((1000000000 + floor(random() * 999999999))::text, 9, '0'),
      CASE WHEN random() > 0.5 THEN 'male' ELSE 'female' END,
      'Saudi',
      3000 + floor(random() * 12000), -- Salary 3K-15K SAR
      'active',
      CURRENT_DATE - (floor(random() * 1460) || ' days')::interval, -- Random hire date within 4 years
      'Staff Member',
      'موظف'
    );
    
    v_inserted_count := v_inserted_count + 1;
  END LOOP;
  
  -- Insert non-Saudi employees with iqama expiries
  FOR i IN (v_saudi_target + 1)..p_n LOOP
    INSERT INTO public.hr_employees (
      company_id,
      dept_id,
      employee_no,
      full_name_en,
      full_name_ar,
      is_saudi,
      iqama_no,
      iqama_expiry,
      gender,
      nationality,
      basic_salary,
      employment_status,
      hire_date,
      job_title_en,
      job_title_ar
    ) VALUES (
      p_tenant,
      v_dept_id,
      'EMP' || LPAD(i::text, 4, '0'),
      'Employee ' || i,
      'موظف ' || i,
      false,
      '2' || LPAD((1000000000 + floor(random() * 999999999))::text, 9, '0'),
      CURRENT_DATE + (15 + floor(random() * 255))::int, -- Expiry 15-270 days ahead
      CASE WHEN random() > 0.5 THEN 'male' ELSE 'female' END,
      CASE 
        WHEN random() < 0.3 THEN 'Pakistani'
        WHEN random() < 0.5 THEN 'Indian'
        WHEN random() < 0.7 THEN 'Bangladeshi'
        WHEN random() < 0.85 THEN 'Filipino'
        ELSE 'Egyptian'
      END,
      3000 + floor(random() * 12000), -- Salary 3K-15K SAR
      'active',
      CURRENT_DATE - (floor(random() * 1460) || ' days')::interval, -- Random hire date within 4 years
      'Staff Member',
      'موظف'
    );
    
    v_inserted_count := v_inserted_count + 1;
  END LOOP;
  
  RETURN json_build_object(
    'inserted_count', v_inserted_count,
    'saudi_count', v_saudi_target,
    'non_saudi_count', v_non_saudi_target,
    'message', 'Demo employees created successfully'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.dev_backfill_kpis_v1(p_tenant uuid, p_days int DEFAULT 365)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_existing_count int;
  v_inserted_count int := 0;
  v_total_employees int;
  v_saudi_employees int;
  v_saudization_rate numeric;
  v_date date;
BEGIN
  -- Check if snapshots already exist for this tenant
  SELECT COUNT(*) INTO v_existing_count 
  FROM public.kpi_snapshots 
  WHERE company_id = p_tenant;
  
  -- If data exists, return early (idempotent)
  IF v_existing_count > 0 THEN
    RETURN json_build_object(
      'inserted_count', 0,
      'existing_count', v_existing_count,
      'message', 'KPI snapshots already exist for this tenant'
    );
  END IF;
  
  -- Get current employee counts
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE is_saudi = true)
  INTO v_total_employees, v_saudi_employees
  FROM public.hr_employees 
  WHERE company_id = p_tenant AND employment_status = 'active';
  
  -- Calculate saudization rate
  IF v_total_employees > 0 THEN
    v_saudization_rate := ROUND((v_saudi_employees::numeric / v_total_employees::numeric) * 100, 1);
  ELSE
    v_saudization_rate := 0;
  END IF;
  
  -- Generate snapshots for each day in the range
  FOR v_date IN 
    SELECT generate_series(
      CURRENT_DATE - p_days + 1, 
      CURRENT_DATE, 
      '1 day'::interval
    )::date
  LOOP
    INSERT INTO public.kpi_snapshots (
      company_id,
      snap_date,
      total_employees,
      saudization_rate,
      hse_safety_score,
      active_users,
      docs_processed,
      training_hours,
      compliance_score,
      talent_pipeline_strength,
      predictive_risk_high,
      employee_experience_10,
      workforce_forecast_accuracy
    ) VALUES (
      p_tenant,
      v_date,
      v_total_employees,
      v_saudization_rate,
      85.0 + (random() * 10), -- Random safety score 85-95
      FLOOR(v_total_employees * (0.6 + random() * 0.3)), -- 60-90% active users
      FLOOR(random() * 50) + 10, -- 10-60 docs processed
      FLOOR(random() * 100) + 20, -- 20-120 training hours
      75.0 + (random() * 20), -- Random compliance score 75-95
      FLOOR(random() * 20) + 5, -- Talent pipeline 5-25
      FLOOR(random() * 10), -- High risk employees 0-10
      7.0 + (random() * 2.5), -- Employee experience 7-9.5
      80.0 + (random() * 15) -- Forecast accuracy 80-95%
    );
    
    v_inserted_count := v_inserted_count + 1;
  END LOOP;
  
  RETURN json_build_object(
    'inserted_count', v_inserted_count,
    'days_backfilled', p_days,
    'total_employees', v_total_employees,
    'saudization_rate', v_saudization_rate,
    'message', 'KPI snapshots backfilled successfully'
  );
END;
$$;