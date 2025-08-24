-- Create dev_seed_retention_v1 RPC for demo data
CREATE OR REPLACE FUNCTION public.dev_seed_retention_v1(p_tenant uuid DEFAULT public.get_demo_tenant_id())
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_employee_count integer;
  v_exit_count integer;
  v_employee record;
  v_exit_date date;
  v_reason text;
  v_is_voluntary boolean;
BEGIN
  -- Get total employees for the tenant
  SELECT count(*) INTO v_employee_count
  FROM hr_employees 
  WHERE company_id = p_tenant AND employment_status = 'active';
  
  -- If no employees, nothing to do
  IF v_employee_count = 0 THEN
    RETURN;
  END IF;
  
  -- Calculate target exits (8-12% annualized)
  v_exit_count := GREATEST(1, (v_employee_count * 0.10)::integer);
  
  -- Clean existing demo exits for idempotency (remove any exits from last 12 months)
  DELETE FROM hr_employees 
  WHERE company_id = p_tenant 
    AND employment_status = 'terminated'
    AND termination_date >= (CURRENT_DATE - INTERVAL '12 months')
    AND (termination_reason LIKE '%demo%' OR termination_reason IS NULL);
  
  -- Create exits by updating existing active employees
  WITH random_employees AS (
    SELECT id, dept_id, grade_id, is_saudi, full_name_en
    FROM hr_employees
    WHERE company_id = p_tenant 
      AND employment_status = 'active'
    ORDER BY random()
    LIMIT v_exit_count
  )
  UPDATE hr_employees 
  SET 
    employment_status = 'terminated',
    termination_date = (CURRENT_DATE - (random() * 365)::integer),
    termination_reason = CASE 
      WHEN random() < 0.4 THEN 'Resignation - Better opportunity'
      WHEN random() < 0.6 THEN 'Resignation - Personal reasons'  
      WHEN random() < 0.75 THEN 'End of contract'
      WHEN random() < 0.85 THEN 'Performance issues'
      ELSE 'Restructuring'
    END,
    is_voluntary_termination = (random() < 0.7) -- 70% voluntary
  WHERE id IN (SELECT id FROM random_employees);
  
  -- Create retention features for terminated employees over last 12 months
  INSERT INTO retention_features (tenant_id, employee_id, period_month, features)
  SELECT 
    p_tenant,
    e.id,
    date_trunc('month', e.termination_date)::date,
    jsonb_build_object(
      'tenure_months', EXTRACT(months FROM age(e.termination_date, e.hire_date)),
      'salary_percentile', (random() * 100)::integer,
      'has_manager', (e.manager_id IS NOT NULL),
      'is_saudi', e.is_saudi,
      'dept_size', COALESCE((
        SELECT count(*) FROM hr_employees e2 
        WHERE e2.dept_id = e.dept_id AND e2.company_id = p_tenant
      ), 1),
      'performance_rating', (1 + random() * 4)::numeric(3,2),
      'exit_risk_score', (50 + random() * 50)::integer
    )
  FROM hr_employees e
  WHERE e.company_id = p_tenant 
    AND e.employment_status = 'terminated'
    AND e.termination_date >= (CURRENT_DATE - INTERVAL '12 months')
  ON CONFLICT (tenant_id, employee_id, period_month) DO NOTHING;
  
  -- Create retention risks for current employees based on exit patterns
  INSERT INTO retention_risks (tenant_id, employee_id, period_month, risk_score, risk_factors)
  SELECT 
    p_tenant,
    e.id,
    date_trunc('month', CURRENT_DATE)::date,
    CASE 
      WHEN e.is_saudi = false AND EXTRACT(months FROM age(CURRENT_DATE, e.hire_date)) < 12 THEN 75 + (random() * 25)::integer
      WHEN e.manager_id IS NULL THEN 60 + (random() * 30)::integer  
      WHEN e.basic_salary < (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY basic_salary) FROM hr_employees WHERE company_id = p_tenant) THEN 50 + (random() * 40)::integer
      ELSE 20 + (random() * 40)::integer
    END,
    jsonb_build_array(
      CASE WHEN e.is_saudi = false AND EXTRACT(months FROM age(CURRENT_DATE, e.hire_date)) < 12 THEN 'low_tenure' END,
      CASE WHEN e.manager_id IS NULL THEN 'no_manager' END,
      CASE WHEN e.basic_salary < (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY basic_salary) FROM hr_employees WHERE company_id = p_tenant) THEN 'below_median_salary' END
    ) - '{null}'::jsonb
  FROM hr_employees e
  WHERE e.company_id = p_tenant 
    AND e.employment_status = 'active'
    AND random() < 0.3 -- Only 30% of employees get risk records
  ON CONFLICT (tenant_id, employee_id, period_month) DO NOTHING;
  
  -- Call backfill to update KPI snapshots
  PERFORM public.dev_backfill_kpis_v1(p_tenant, 365);
  
  RAISE NOTICE 'Seeded % exits for tenant % with retention analytics', v_exit_count, p_tenant;
END;
$$;