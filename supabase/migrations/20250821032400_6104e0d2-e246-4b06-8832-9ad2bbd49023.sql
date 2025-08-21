-- Create function to backfill KPI snapshots with random walk data
CREATE OR REPLACE FUNCTION public.dashboard_backfill_v1(p_tenant uuid, days integer DEFAULT 365)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_current_data RECORD;
  v_date date;
  v_multiplier numeric;
  v_days_ago integer;
BEGIN
  -- Get current KPI values for the tenant
  SELECT 
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
  INTO v_current_data
  FROM public.dashboard_get_v1(p_tenant)
  LIMIT 1;
  
  -- If no current data, use defaults
  IF NOT FOUND THEN
    v_current_data := ROW(
      100, -- total_employees
      55.0, -- saudization_rate
      8.5, -- hse_safety_score
      85, -- active_users
      250, -- docs_processed
      120, -- training_hours
      85.0, -- compliance_score
      3, -- talent_pipeline_strength
      5, -- predictive_risk_high
      7.5, -- employee_experience_10
      88.5 -- workforce_forecast_accuracy
    );
  END IF;
  
  -- Generate historical data with random walk
  FOR v_days_ago IN 1..days LOOP
    v_date := CURRENT_DATE - v_days_ago;
    
    -- Create variance that decreases as we go back in time (more stable in past)
    v_multiplier := 0.95 + (random() * 0.1); -- 95% to 105% of current values
    
    -- Add seasonal variation (lower activity in summer, higher in winter)
    IF EXTRACT(MONTH FROM v_date) IN (6, 7, 8) THEN
      v_multiplier := v_multiplier * 0.9; -- Summer slowdown
    ELSIF EXTRACT(MONTH FROM v_date) IN (1, 2, 12) THEN
      v_multiplier := v_multiplier * 1.1; -- Winter increase
    END IF;
    
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
      GREATEST(1, ROUND(v_current_data.total_employees * v_multiplier)),
      GREATEST(0, LEAST(100, v_current_data.saudization_rate * v_multiplier)),
      GREATEST(0, LEAST(10, v_current_data.hse_safety_score * v_multiplier)),
      GREATEST(0, ROUND(v_current_data.active_users * v_multiplier)),
      GREATEST(0, ROUND(v_current_data.docs_processed * v_multiplier)),
      GREATEST(0, ROUND(v_current_data.training_hours * v_multiplier)),
      GREATEST(0, LEAST(100, v_current_data.compliance_score * v_multiplier)),
      GREATEST(0, ROUND(v_current_data.talent_pipeline_strength * v_multiplier)),
      GREATEST(0, ROUND(v_current_data.predictive_risk_high * v_multiplier)),
      GREATEST(0, LEAST(10, v_current_data.employee_experience_10 * v_multiplier)),
      GREATEST(0, LEAST(100, v_current_data.workforce_forecast_accuracy * v_multiplier))
    )
    ON CONFLICT (company_id, snap_date) DO NOTHING;
  END LOOP;
END;
$$;

-- Create function to get time series data
CREATE OR REPLACE FUNCTION public.dashboard_get_series_v1(p_tenant uuid, days integer DEFAULT 30)
RETURNS TABLE(
  snap_date text,
  total_employees numeric,
  saudization_rate numeric,
  hse_safety_score numeric,
  compliance_score numeric,
  employee_experience_10 numeric,
  predictive_risk_high numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.snap_date::text,
    s.total_employees,
    s.saudization_rate,
    s.hse_safety_score,
    s.compliance_score,
    s.employee_experience_10,
    s.predictive_risk_high
  FROM public.kpi_snapshots s
  WHERE s.company_id = p_tenant
    AND s.snap_date >= CURRENT_DATE - days
  ORDER BY s.snap_date ASC;
END;
$$;

-- Create function for dashboard alerts/rules
CREATE OR REPLACE FUNCTION public.dashboard_rules_v1(p_tenant uuid)
RETURNS TABLE(
  id text,
  title text,
  message text,
  severity text,
  metric text,
  current_value numeric,
  threshold_value numeric,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_current RECORD;
  v_30d_ago RECORD;
  v_7d_ago RECORD;
BEGIN
  -- Get current snapshot
  SELECT * INTO v_current
  FROM public.kpi_snapshots
  WHERE company_id = p_tenant
  ORDER BY snap_date DESC
  LIMIT 1;
  
  -- Get 30-day ago snapshot
  SELECT * INTO v_30d_ago
  FROM public.kpi_snapshots
  WHERE company_id = p_tenant
    AND snap_date <= CURRENT_DATE - 30
  ORDER BY snap_date DESC
  LIMIT 1;
  
  -- Get 7-day ago snapshot
  SELECT * INTO v_7d_ago
  FROM public.kpi_snapshots
  WHERE company_id = p_tenant
    AND snap_date <= CURRENT_DATE - 7
  ORDER BY snap_date DESC
  LIMIT 1;
  
  -- Rule 1: Saudization dropping below 60%
  IF v_current.saudization_rate < 60 THEN
    id := 'saud_below_60';
    title := 'Saudization Rate Critical';
    message := 'Saudization rate has dropped below 60% - this may affect Nitaqat status';
    severity := 'High';
    metric := 'saudization_rate';
    current_value := v_current.saudization_rate;
    threshold_value := 60;
    created_at := now();
    RETURN NEXT;
  END IF;
  
  -- Rule 2: Employee Experience dropping significantly
  IF v_30d_ago.employee_experience_10 IS NOT NULL 
     AND v_current.employee_experience_10 < v_30d_ago.employee_experience_10 - 0.7 THEN
    id := 'exp_drop_30d';
    title := 'Employee Experience Declining';
    message := 'Employee experience score has dropped by more than 0.7 points in the last 30 days';
    severity := 'Medium';
    metric := 'employee_experience_10';
    current_value := v_current.employee_experience_10;
    threshold_value := v_30d_ago.employee_experience_10 - 0.7;
    created_at := now();
    RETURN NEXT;
  END IF;
  
  -- Rule 3: HSE Safety score spike (increase in incidents)
  IF v_7d_ago.hse_safety_score IS NOT NULL 
     AND v_current.hse_safety_score < v_7d_ago.hse_safety_score - 1.0 THEN
    id := 'hse_spike_7d';
    title := 'HSE Safety Score Alert';
    message := 'Safety score has decreased by more than 1 point in the last 7 days';
    severity := 'High';
    metric := 'hse_safety_score';
    current_value := v_current.hse_safety_score;
    threshold_value := v_7d_ago.hse_safety_score - 1.0;
    created_at := now();
    RETURN NEXT;
  END IF;
  
  -- Rule 4: Predictive risk high count increasing
  IF v_30d_ago.predictive_risk_high IS NOT NULL 
     AND v_current.predictive_risk_high > v_30d_ago.predictive_risk_high + 2 THEN
    id := 'risk_increase_30d';
    title := 'Predictive Risk Increasing';
    message := 'High-risk employee count has increased by more than 2 in the last 30 days';
    severity := 'Medium';
    metric := 'predictive_risk_high';
    current_value := v_current.predictive_risk_high;
    threshold_value := v_30d_ago.predictive_risk_high + 2;
    created_at := now();
    RETURN NEXT;
  END IF;
  
  -- Rule 5: Compliance score dropping
  IF v_30d_ago.compliance_score IS NOT NULL 
     AND v_current.compliance_score < v_30d_ago.compliance_score - 5 THEN
    id := 'compliance_drop_30d';
    title := 'Compliance Score Declining';
    message := 'Compliance score has dropped by more than 5 points in the last 30 days';
    severity := 'Medium';
    metric := 'compliance_score';
    current_value := v_current.compliance_score;
    threshold_value := v_30d_ago.compliance_score - 5;
    created_at := now();
    RETURN NEXT;
  END IF;
  
  -- If no alerts, return a synthetic positive alert for demo
  IF NOT FOUND THEN
    id := 'all_systems_normal';
    title := 'All Systems Operating Normally';
    message := 'No critical issues detected across key performance indicators';
    severity := 'Low';
    metric := 'overall';
    current_value := 100;
    threshold_value := 100;
    created_at := now();
    RETURN NEXT;
  END IF;
END;
$$;