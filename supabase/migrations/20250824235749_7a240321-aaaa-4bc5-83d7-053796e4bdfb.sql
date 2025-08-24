-- Create retention overview RPC
CREATE OR REPLACE FUNCTION public.retention_overview_v1(p_tenant uuid)
 RETURNS TABLE(
   avg_risk numeric,
   high_risk_percentage numeric,
   target_turnover numeric,
   low_risk_count integer,
   med_risk_count integer,
   high_risk_count integer,
   last_12m_exits integer,
   sparkline_data jsonb
 )
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_avg_risk numeric;
  v_high_risk_pct numeric;
  v_target_turnover numeric := 12.0; -- Default 12% target
  v_low_count integer;
  v_med_count integer;
  v_high_count integer;
  v_exits_12m integer;
  v_sparkline jsonb;
BEGIN
  -- Calculate average risk score for active employees
  SELECT COALESCE(AVG(rf.features->>'risk_score')::numeric, 0)
  INTO v_avg_risk
  FROM public.retention_features rf
  JOIN public.hr_employees e ON rf.employee_id = e.id
  WHERE rf.tenant_id = p_tenant 
    AND e.employment_status = 'active'
    AND rf.period_month >= date_trunc('month', current_date - interval '3 months');

  -- Calculate risk distribution counts
  WITH risk_categorized AS (
    SELECT 
      CASE 
        WHEN (rf.features->>'risk_score')::numeric <= 0.3 THEN 'low'
        WHEN (rf.features->>'risk_score')::numeric <= 0.7 THEN 'medium'
        ELSE 'high'
      END as risk_category
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND rf.period_month >= date_trunc('month', current_date - interval '3 months')
  )
  SELECT 
    COUNT(*) FILTER (WHERE risk_category = 'low'),
    COUNT(*) FILTER (WHERE risk_category = 'medium'),
    COUNT(*) FILTER (WHERE risk_category = 'high'),
    COALESCE(COUNT(*) FILTER (WHERE risk_category = 'high') * 100.0 / NULLIF(COUNT(*), 0), 0)
  INTO v_low_count, v_med_count, v_high_count, v_high_risk_pct
  FROM risk_categorized;

  -- Count exits in last 12 months
  SELECT COUNT(*)
  INTO v_exits_12m
  FROM public.hr_employees e
  WHERE e.company_id = p_tenant
    AND e.employment_status IN ('terminated', 'resigned')
    AND e.termination_date >= current_date - interval '12 months';

  -- Generate sparkline data (exits by month for last 12 months)
  WITH monthly_exits AS (
    SELECT 
      date_trunc('month', e.termination_date) as exit_month,
      COUNT(*) as exit_count
    FROM public.hr_employees e
    WHERE e.company_id = p_tenant
      AND e.employment_status IN ('terminated', 'resigned')
      AND e.termination_date >= current_date - interval '12 months'
    GROUP BY date_trunc('month', e.termination_date)
  ),
  months_series AS (
    SELECT generate_series(
      date_trunc('month', current_date - interval '11 months'),
      date_trunc('month', current_date),
      '1 month'::interval
    ) as month_date
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'month', to_char(ms.month_date, 'YYYY-MM'),
      'exits', COALESCE(me.exit_count, 0)
    ) ORDER BY ms.month_date
  )
  INTO v_sparkline
  FROM months_series ms
  LEFT JOIN monthly_exits me ON ms.month_date = me.exit_month;

  RETURN QUERY SELECT 
    COALESCE(v_avg_risk, 0) * 100, -- Convert to percentage
    COALESCE(v_high_risk_pct, 0),
    v_target_turnover,
    COALESCE(v_low_count, 0),
    COALESCE(v_med_count, 0),
    COALESCE(v_high_count, 0),
    COALESCE(v_exits_12m, 0),
    COALESCE(v_sparkline, '[]'::jsonb);
END;
$function$

-- Create retention drivers RPC
CREATE OR REPLACE FUNCTION public.retention_drivers_v1(p_tenant uuid)
 RETURNS TABLE(
   driver_name text,
   contribution_percentage numeric,
   affected_count integer
 )
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH driver_analysis AS (
    -- Analyze compensation issues
    SELECT 'Compensation' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'salary_percentile')::numeric < 25 -- Bottom quartile salary
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
    
    UNION ALL
    
    -- Analyze manager relationship issues  
    SELECT 'Manager Relationship' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'tenure_months')::numeric BETWEEN 6 AND 24 -- Critical period
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
    
    UNION ALL
    
    -- Analyze growth opportunity issues
    SELECT 'Growth Opportunities' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'tenure_months')::numeric > 24 -- Long tenure without promotion
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
    
    UNION ALL
    
    -- Analyze workload issues (high performers)
    SELECT 'Workload Management' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'performance_rating')::numeric >= 4.0 -- High performers
      AND (rf.features->>'risk_score')::numeric > 0.7 -- But high risk
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
    
    UNION ALL
    
    -- Analyze commute/location issues (based on departments with higher turnover)
    SELECT 'Commute/Location' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND e.dept_id IN (
        SELECT dept_id 
        FROM public.hr_employees 
        WHERE company_id = p_tenant 
          AND employment_status IN ('terminated', 'resigned')
          AND termination_date >= current_date - interval '6 months'
        GROUP BY dept_id 
        HAVING COUNT(*) > 2
      )
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
  ),
  total_at_risk AS (
    SELECT COUNT(*) as total
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'risk_score')::numeric > 0.5
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
  )
  SELECT 
    da.driver,
    CASE 
      WHEN tar.total > 0 THEN (da.count * 100.0 / tar.total)
      ELSE 0
    END,
    da.count
  FROM driver_analysis da, total_at_risk tar
  WHERE da.count > 0
  ORDER BY 
    CASE 
      WHEN tar.total > 0 THEN (da.count * 100.0 / tar.total)
      ELSE 0
    END DESC
  LIMIT 5;
END;
$function$

-- Create retention watchlist RPC
CREATE OR REPLACE FUNCTION public.retention_watchlist_v1(p_tenant uuid)
 RETURNS TABLE(
   unit_name text,
   unit_type text,
   headcount integer,
   risk_score numeric,
   recent_exits_12m integer
 )
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH department_risk AS (
    SELECT 
      COALESCE(d.name_en, 'Unknown Department') as unit_name,
      'Department' as unit_type,
      COUNT(DISTINCT e.id) as headcount,
      AVG((rf.features->>'risk_score')::numeric) as avg_risk,
      COUNT(DISTINCT exits.id) as exits_12m
    FROM public.hr_employees e
    LEFT JOIN public.hr_departments d ON e.dept_id = d.id
    LEFT JOIN public.retention_features rf ON e.id = rf.employee_id 
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
      AND rf.tenant_id = p_tenant
    LEFT JOIN public.hr_employees exits ON exits.dept_id = e.dept_id
      AND exits.company_id = p_tenant
      AND exits.employment_status IN ('terminated', 'resigned')
      AND exits.termination_date >= current_date - interval '12 months'
    WHERE e.company_id = p_tenant
      AND e.employment_status = 'active'
    GROUP BY d.name_en, e.dept_id
    HAVING COUNT(DISTINCT e.id) >= 3 -- Only units with 3+ employees
  ),
  grade_risk AS (
    SELECT 
      COALESCE(g.name_en, 'Grade ' || e.grade_id::text) as unit_name,
      'Grade' as unit_type,
      COUNT(DISTINCT e.id) as headcount,
      AVG((rf.features->>'risk_score')::numeric) as avg_risk,
      COUNT(DISTINCT exits.id) as exits_12m
    FROM public.hr_employees e
    LEFT JOIN public.hr_grades g ON e.grade_id = g.id
    LEFT JOIN public.retention_features rf ON e.id = rf.employee_id 
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
      AND rf.tenant_id = p_tenant
    LEFT JOIN public.hr_employees exits ON exits.grade_id = e.grade_id
      AND exits.company_id = p_tenant
      AND exits.employment_status IN ('terminated', 'resigned')
      AND exits.termination_date >= current_date - interval '12 months'
    WHERE e.company_id = p_tenant
      AND e.employment_status = 'active'
    GROUP BY g.name_en, e.grade_id
    HAVING COUNT(DISTINCT e.id) >= 3 -- Only units with 3+ employees
  )
  SELECT 
    dr.unit_name,
    dr.unit_type,
    dr.headcount,
    COALESCE(dr.avg_risk, 0) * 100, -- Convert to percentage
    dr.exits_12m
  FROM department_risk dr
  WHERE COALESCE(dr.avg_risk, 0) > 0.5 -- Risk threshold
  
  UNION ALL
  
  SELECT 
    gr.unit_name,
    gr.unit_type,
    gr.headcount,
    COALESCE(gr.avg_risk, 0) * 100, -- Convert to percentage
    gr.exits_12m
  FROM grade_risk gr
  WHERE COALESCE(gr.avg_risk, 0) > 0.5 -- Risk threshold
  
  ORDER BY risk_score DESC, recent_exits_12m DESC
  LIMIT 20;
END;
$function$

-- Update the dev seeding function to be more robust
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
  -- Clear existing retention data for this tenant
  DELETE FROM public.retention_features WHERE tenant_id = p_tenant;
  
  -- Seed historical exit dates for some employees (last 12 months)
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
  
  -- Generate retention features for active employees for last 3 months
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
      -- Calculate risk score based on various factors
      v_risk_score := LEAST(1.0, GREATEST(0.0, 
        random() * 0.3 + -- Base randomness
        CASE WHEN v_employee.hire_date < current_date - interval '5 years' THEN 0.2 ELSE 0 END + -- Tenure factor
        CASE WHEN v_employee.basic_salary < 5000 THEN 0.3 ELSE 0 END + -- Salary factor
        CASE WHEN v_employee.grade_id IS NULL THEN 0.2 ELSE 0 END -- Career progression factor
      ));
      
      -- Build comprehensive features JSON
      v_features := jsonb_build_object(
        'risk_score', v_risk_score,
        'tenure_months', EXTRACT(months FROM age(current_date, v_employee.hire_date)),
        'salary_percentile', 25 + (random() * 50)::int, -- Random percentile 25-75
        'performance_rating', 2.5 + (random() * 2.0), -- Rating 2.5-4.5
        'manager_rating', 3.0 + (random() * 2.0), -- Manager rating 3.0-5.0
        'commute_distance_km', (random() * 50)::int, -- 0-50km commute
        'training_hours_6m', (random() * 40)::int, -- 0-40 hours training
        'promotion_eligible', random() > 0.7,
        'high_performer', v_risk_score < 0.3 AND random() > 0.6,
        'flight_risk_indicators', jsonb_build_array(
          CASE WHEN v_risk_score > 0.7 THEN 'salary_below_market' ELSE null END,
          CASE WHEN v_risk_score > 0.6 THEN 'limited_growth' ELSE null END,
          CASE WHEN v_risk_score > 0.8 THEN 'manager_conflict' ELSE null END
        ) - 'null'::jsonb
      );
      
      -- Insert retention feature record
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