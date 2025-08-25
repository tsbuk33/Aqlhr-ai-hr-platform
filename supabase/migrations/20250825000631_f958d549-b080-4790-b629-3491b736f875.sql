CREATE OR REPLACE FUNCTION public.dev_seed_retention_v1(p_tenant uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_employee record;
  v_risk_score numeric;
  v_features jsonb;
  v_period_month date;
BEGIN
  DELETE FROM public.retention_features WHERE tenant_id = p_tenant;
  
  WITH employees_to_exit AS (
    SELECT id, employee_no
    FROM public.hr_employees 
    WHERE company_id = p_tenant 
      AND employment_status = 'active'
    ORDER BY RANDOM()
    LIMIT GREATEST(1, (SELECT COUNT(*) FROM public.hr_employees WHERE company_id = p_tenant AND employment_status = 'active') / 10)
  )
  UPDATE public.hr_employees 
  SET 
    employment_status = CASE WHEN random() > 0.5 THEN 'terminated' ELSE 'resigned' END,
    termination_date = current_date - (random() * 365)::int,
    termination_reason = CASE 
      WHEN random() < 0.3 THEN 'Better opportunity'
      WHEN random() < 0.6 THEN 'Compensation'
      WHEN random() < 0.8 THEN 'Career growth'
      ELSE 'Personal reasons'
    END
  WHERE id IN (SELECT id FROM employees_to_exit);
  
  FOR v_period_month IN 
    SELECT generate_series(
      date_trunc('month', current_date - interval '2 months'),
      date_trunc('month', current_date),
      '1 month'::interval
    )::date
  LOOP
    FOR v_employee IN 
      SELECT * FROM public.hr_employees 
      WHERE company_id = p_tenant 
        AND employment_status = 'active'
    LOOP
      v_risk_score := LEAST(1.0, GREATEST(0.0, 
        random() * 0.3 + 
        CASE WHEN v_employee.hire_date < current_date - interval '5 years' THEN 0.2 ELSE 0 END + 
        CASE WHEN v_employee.basic_salary < 5000 THEN 0.3 ELSE 0 END + 
        CASE WHEN v_employee.grade_id IS NULL THEN 0.2 ELSE 0 END
      ));
      
      v_features := jsonb_build_object(
        'risk_score', v_risk_score,
        'tenure_months', EXTRACT(months FROM age(current_date, v_employee.hire_date)),
        'salary_percentile', 25 + (random() * 50)::int,
        'performance_rating', 2.5 + (random() * 2.0),
        'manager_rating', 3.0 + (random() * 2.0),
        'commute_distance_km', (random() * 50)::int,
        'training_hours_6m', (random() * 40)::int,
        'promotion_eligible', random() > 0.7,
        'high_performer', v_risk_score < 0.3 AND random() > 0.6,
        'flight_risk_indicators', jsonb_build_array(
          CASE WHEN v_risk_score > 0.7 THEN 'salary_below_market' ELSE null END,
          CASE WHEN v_risk_score > 0.6 THEN 'limited_growth' ELSE null END,
          CASE WHEN v_risk_score > 0.8 THEN 'manager_conflict' ELSE null END
        ) - 'null'::jsonb
      );
      
      INSERT INTO public.retention_features (
        tenant_id,
        employee_id,
        period_month,
        features
      ) VALUES (
        p_tenant,
        v_employee.id,
        v_period_month,
        v_features
      ) ON CONFLICT (tenant_id, employee_id, period_month) DO UPDATE SET
        features = EXCLUDED.features;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Seeded retention data for tenant % - % employees processed', p_tenant, 
    (SELECT COUNT(*) FROM public.hr_employees WHERE company_id = p_tenant);
END;
$function$