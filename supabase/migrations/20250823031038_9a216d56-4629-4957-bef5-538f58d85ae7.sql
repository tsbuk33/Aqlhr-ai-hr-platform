-- Fix retention functions by dropping and recreating with correct signatures
-- Drop existing functions first
DROP FUNCTION IF EXISTS public.retention_get_overview_v1(uuid);
DROP FUNCTION IF EXISTS public.retention_get_hotspots_v1(uuid);
DROP FUNCTION IF EXISTS public.retention_get_drivers_v1(uuid);
DROP FUNCTION IF EXISTS public.retention_get_watchlist_v1(uuid);
DROP FUNCTION IF EXISTS public.retention_seed_demo_v1(uuid);
DROP FUNCTION IF EXISTS public.retention_compute_v1(uuid, date);
DROP FUNCTION IF EXISTS public.retention_compute_v1(uuid);

-- Update the retention_seed_demo_v1 function to use correct column names
CREATE OR REPLACE FUNCTION public.retention_seed_demo_v1(p_tenant uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_start_date DATE := CURRENT_DATE - INTERVAL '24 months';
  v_employee RECORD;
  v_month_offset INTEGER;
  v_risk_score NUMERIC;
  v_factors JSONB;
  v_employee_count INTEGER;
BEGIN
  -- Check how many employees we have for this tenant
  SELECT COUNT(*) INTO v_employee_count
  FROM hr_employees 
  WHERE company_id = p_tenant AND employment_status = 'active';
  
  RAISE NOTICE 'Found % active employees for tenant %', v_employee_count, p_tenant;
  
  -- Clean up existing data for this tenant
  DELETE FROM retention_risks WHERE tenant_id = p_tenant;
  DELETE FROM retention_actions WHERE tenant_id = p_tenant;
  DELETE FROM retention_features WHERE tenant_id = p_tenant;
  
  -- Generate retention features and risks for each employee over past 24 months
  FOR v_employee IN 
    SELECT 
      id,
      full_name_en,
      full_name_ar,
      dept_id,
      manager_id,
      hire_date,
      base_salary,  -- Use base_salary instead of basic_salary
      is_saudi,
      age,
      gender,
      employment_status,
      experience_years
    FROM hr_employees 
    WHERE company_id = p_tenant 
      AND employment_status = 'active'
  LOOP
    -- Generate data for each month in the past 24 months
    FOR v_month_offset IN 0..23 LOOP
      DECLARE
        v_period_month DATE := DATE_TRUNC('month', v_start_date + (v_month_offset || ' months')::INTERVAL);
        v_tenure_months INTEGER := GREATEST(1, EXTRACT(months FROM AGE(v_period_month, COALESCE(v_employee.hire_date, CURRENT_DATE - INTERVAL '2 years'))));
        v_salary_percentile NUMERIC;
        v_age_factor NUMERIC;
        v_tenure_factor NUMERIC;
        v_dept_factor NUMERIC;
        v_experience_factor NUMERIC;
      BEGIN
        -- Skip if employee wasn't hired yet (but allow for employees without hire_date)
        IF v_employee.hire_date IS NOT NULL AND v_employee.hire_date > v_period_month THEN
          CONTINUE;
        END IF;
        
        -- Calculate various risk factors based on actual employee data
        v_salary_percentile := CASE 
          WHEN COALESCE(v_employee.base_salary, 5000) < 5000 THEN 0.8
          WHEN COALESCE(v_employee.base_salary, 5000) < 10000 THEN 0.6
          WHEN COALESCE(v_employee.base_salary, 5000) < 20000 THEN 0.4
          ELSE 0.2
        END;
        
        v_age_factor := CASE 
          WHEN COALESCE(v_employee.age, 30) < 25 THEN 0.7
          WHEN COALESCE(v_employee.age, 30) < 35 THEN 0.3
          WHEN COALESCE(v_employee.age, 30) < 45 THEN 0.2
          ELSE 0.4
        END;
        
        v_tenure_factor := CASE 
          WHEN v_tenure_months < 12 THEN 0.9
          WHEN v_tenure_months < 24 THEN 0.6
          WHEN v_tenure_months < 60 THEN 0.3
          ELSE 0.2
        END;
        
        v_experience_factor := CASE 
          WHEN COALESCE(v_employee.experience_years, 1) < 2 THEN 0.8
          WHEN COALESCE(v_employee.experience_years, 1) < 5 THEN 0.5
          WHEN COALESCE(v_employee.experience_years, 1) < 10 THEN 0.3
          ELSE 0.2
        END;
        
        v_dept_factor := random() * 0.3; -- Random department-specific factor
        
        -- Calculate overall risk score
        v_risk_score := LEAST(100.0, 
          (v_salary_percentile * 0.25) +
          (v_age_factor * 0.15) +
          (v_tenure_factor * 0.30) +
          (v_experience_factor * 0.20) +
          (v_dept_factor * 0.10) +
          (random() * 0.30) -- Some randomness
        ) * 100;
        
        -- Build factors JSON
        v_factors := jsonb_build_object(
          'compensation_risk', v_salary_percentile,
          'tenure_risk', v_tenure_factor,
          'age_risk', v_age_factor,
          'experience_risk', v_experience_factor,
          'workload_pressure', random() * 0.8,
          'career_development', random() * 0.6,
          'work_life_balance', random() * 0.7,
          'manager_relationship', random() * 0.5,
          'job_satisfaction', random() * 0.8
        );
        
        -- Insert retention features
        INSERT INTO retention_features (
          tenant_id,
          employee_id,
          period_month,
          features
        ) VALUES (
          p_tenant,
          v_employee.id,
          v_period_month,
          v_factors
        ) ON CONFLICT (tenant_id, employee_id, period_month) DO NOTHING;
        
        -- Insert retention risk
        INSERT INTO retention_risks (
          tenant_id,
          employee_id,
          period_month,
          risk_score,
          risk_band,
          top_factors
        ) VALUES (
          p_tenant,
          v_employee.id,
          v_period_month,
          v_risk_score,
          CASE 
            WHEN v_risk_score >= 70 THEN 'high'
            WHEN v_risk_score >= 40 THEN 'medium'
            ELSE 'low'
          END,
          v_factors
        ) ON CONFLICT (tenant_id, employee_id, period_month) DO NOTHING;
        
      END;
    END LOOP;
  END LOOP;
  
  -- Generate some sample retention actions
  INSERT INTO retention_actions (
    tenant_id,
    title,
    description,
    status,
    priority,
    created_at
  ) VALUES 
    (p_tenant, 'Implement Career Development Program', 'Create structured career paths and development opportunities for high-risk employees', 'draft', 'high', NOW()),
    (p_tenant, 'Salary Benchmarking Review', 'Review and adjust compensation packages to market standards', 'in_progress', 'medium', NOW() - INTERVAL '1 week'),
    (p_tenant, 'Manager Training Initiative', 'Train managers on employee engagement and retention strategies', 'completed', 'high', NOW() - INTERVAL '2 weeks'),
    (p_tenant, 'Work-Life Balance Survey', 'Conduct survey to identify work-life balance issues', 'draft', 'low', NOW()),
    (p_tenant, 'Exit Interview Analysis', 'Analyze patterns from exit interviews to identify improvement areas', 'in_progress', 'medium', NOW() - INTERVAL '3 days'),
    (p_tenant, 'Recognition Program Launch', 'Launch employee recognition and rewards program', 'draft', 'high', NOW()),
    (p_tenant, 'Remote Work Policy Review', 'Review and update remote work policies based on employee feedback', 'completed', 'low', NOW() - INTERVAL '1 month')
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Retention demo data seeded successfully for tenant %. Processed % employees.', p_tenant, v_employee_count;
END;
$function$;

-- Update the compute function to work with current month
CREATE OR REPLACE FUNCTION public.retention_compute_v1(p_tenant uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_target_month date := DATE_TRUNC('month', CURRENT_DATE);
  v_computed_count INTEGER;
BEGIN
  -- This function computes aggregated retention metrics for a specific month
  -- For now, we ensure the risk bands are properly calculated
  
  -- Update any missing or incorrect risk bands
  UPDATE retention_risks 
  SET risk_band = CASE 
    WHEN risk_score >= 70 THEN 'high'
    WHEN risk_score >= 40 THEN 'medium'
    ELSE 'low'
  END
  WHERE tenant_id = p_tenant 
    AND period_month = v_target_month
    AND (risk_band IS NULL OR risk_band NOT IN ('high', 'medium', 'low'));
  
  -- Get count of computed records
  SELECT COUNT(*) INTO v_computed_count
  FROM retention_risks 
  WHERE tenant_id = p_tenant AND period_month = v_target_month;
  
  RAISE NOTICE 'Retention analysis computed for tenant % for month %. Records: %', p_tenant, v_target_month, v_computed_count;
END;
$function$;

-- Create overview function that matches useRetention expectations
CREATE OR REPLACE FUNCTION public.retention_get_overview_v1(p_tenant uuid)
RETURNS TABLE(
  total_employees INTEGER,
  avg_risk NUMERIC,
  pct_high NUMERIC,
  pct_med NUMERIC,
  pct_low NUMERIC,
  target_turnover NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_current_month DATE := DATE_TRUNC('month', CURRENT_DATE);
BEGIN
  RETURN QUERY
  WITH current_risks AS (
    SELECT 
      rr.risk_score,
      rr.risk_band
    FROM retention_risks rr
    WHERE rr.tenant_id = p_tenant 
      AND rr.period_month = v_current_month
  ),
  stats AS (
    SELECT 
      COUNT(*)::INTEGER as total_emp,
      COALESCE(AVG(risk_score), 0)::NUMERIC as avg_risk_score,
      COALESCE((COUNT(*) FILTER (WHERE risk_band = 'high')::NUMERIC / GREATEST(COUNT(*), 1) * 100), 0)::NUMERIC as pct_high_risk,
      COALESCE((COUNT(*) FILTER (WHERE risk_band = 'medium')::NUMERIC / GREATEST(COUNT(*), 1) * 100), 0)::NUMERIC as pct_med_risk,
      COALESCE((COUNT(*) FILTER (WHERE risk_band = 'low')::NUMERIC / GREATEST(COUNT(*), 1) * 100), 0)::NUMERIC as pct_low_risk
    FROM current_risks
  )
  SELECT 
    s.total_emp,
    ROUND(s.avg_risk_score, 1),
    ROUND(s.pct_high_risk, 1),
    ROUND(s.pct_med_risk, 1),
    ROUND(s.pct_low_risk, 1),
    15.0::NUMERIC as target_turnover_rate
  FROM stats s;
END;
$function$;

-- Create hotspots function
CREATE OR REPLACE FUNCTION public.retention_get_hotspots_v1(p_tenant uuid)
RETURNS TABLE(
  department_id UUID,
  dept_name_en TEXT,
  dept_name_ar TEXT,
  n INTEGER,
  avg_risk NUMERIC,
  pct_high NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_current_month DATE := DATE_TRUNC('month', CURRENT_DATE);
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    COALESCE(d.name_en, 'Unknown Department'),
    COALESCE(d.name_ar, 'قسم غير معروف'),
    COUNT(rr.*)::INTEGER,
    ROUND(AVG(rr.risk_score), 1)::NUMERIC,
    ROUND((COUNT(*) FILTER (WHERE rr.risk_band = 'high')::NUMERIC / GREATEST(COUNT(*), 1) * 100), 1)::NUMERIC
  FROM retention_risks rr
  JOIN hr_employees e ON rr.employee_id = e.id
  LEFT JOIN hr_departments d ON e.dept_id = d.id
  WHERE rr.tenant_id = p_tenant 
    AND rr.period_month = v_current_month
    AND e.company_id = p_tenant
  GROUP BY d.id, d.name_en, d.name_ar
  HAVING COUNT(*) >= 3  -- Only show departments with at least 3 employees
  ORDER BY AVG(rr.risk_score) DESC;
END;
$function$;

-- Create drivers function
CREATE OR REPLACE FUNCTION public.retention_get_drivers_v1(p_tenant uuid)
RETURNS TABLE(
  factor_name TEXT,
  avg_impact NUMERIC,
  frequency INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH factor_analysis AS (
    SELECT 
      'Compensation Risk' as factor,
      AVG((rf.features->>'compensation_risk')::NUMERIC * 100) as impact,
      COUNT(*) as freq
    FROM retention_features rf
    WHERE rf.tenant_id = p_tenant
    
    UNION ALL
    
    SELECT 
      'Tenure Risk' as factor,
      AVG((rf.features->>'tenure_risk')::NUMERIC * 100) as impact,
      COUNT(*) as freq
    FROM retention_features rf
    WHERE rf.tenant_id = p_tenant
    
    UNION ALL
    
    SELECT 
      'Work-Life Balance' as factor,
      AVG((rf.features->>'work_life_balance')::NUMERIC * 100) as impact,
      COUNT(*) as freq
    FROM retention_features rf
    WHERE rf.tenant_id = p_tenant
    
    UNION ALL
    
    SELECT 
      'Career Development' as factor,
      AVG((rf.features->>'career_development')::NUMERIC * 100) as impact,
      COUNT(*) as freq
    FROM retention_features rf
    WHERE rf.tenant_id = p_tenant
    
    UNION ALL
    
    SELECT 
      'Experience Risk' as factor,
      AVG((rf.features->>'experience_risk')::NUMERIC * 100) as impact,
      COUNT(*) as freq
    FROM retention_features rf
    WHERE rf.tenant_id = p_tenant
  )
  SELECT 
    fa.factor,
    ROUND(COALESCE(fa.impact, 0), 1),
    fa.freq::INTEGER
  FROM factor_analysis fa
  ORDER BY fa.impact DESC;
END;
$function$;

-- Create watchlist function
CREATE OR REPLACE FUNCTION public.retention_get_watchlist_v1(p_tenant uuid)
RETURNS TABLE(
  employee_id UUID,
  employee_name_en TEXT,
  employee_name_ar TEXT,
  dept_name_en TEXT,
  dept_name_ar TEXT,
  manager_name TEXT,
  risk_score NUMERIC,
  band TEXT,
  top_factors JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_current_month DATE := DATE_TRUNC('month', CURRENT_DATE);
BEGIN
  RETURN QUERY
  SELECT 
    rr.employee_id,
    COALESCE(e.full_name_en, 'Unknown Employee'),
    COALESCE(e.full_name_ar, 'موظف غير معروف'),
    COALESCE(d.name_en, 'Unknown Department'),
    COALESCE(d.name_ar, 'قسم غير معروف'),
    COALESCE(m.full_name_en, 'No Manager'),
    ROUND(rr.risk_score, 1),
    rr.risk_band,
    rr.top_factors
  FROM retention_risks rr
  JOIN hr_employees e ON rr.employee_id = e.id
  LEFT JOIN hr_departments d ON e.dept_id = d.id
  LEFT JOIN hr_employees m ON e.manager_id = m.id
  WHERE rr.tenant_id = p_tenant 
    AND rr.period_month = v_current_month
    AND e.company_id = p_tenant
    AND rr.risk_band IN ('high', 'medium')
  ORDER BY rr.risk_score DESC
  LIMIT 50;
END;
$function$;