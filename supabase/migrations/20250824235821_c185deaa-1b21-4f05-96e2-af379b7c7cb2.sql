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
  v_target_turnover numeric := 12.0;
  v_low_count integer;
  v_med_count integer;
  v_high_count integer;
  v_exits_12m integer;
  v_sparkline jsonb;
BEGIN
  SELECT COALESCE(AVG(rf.features->>'risk_score')::numeric, 0)
  INTO v_avg_risk
  FROM public.retention_features rf
  JOIN public.hr_employees e ON rf.employee_id = e.id
  WHERE rf.tenant_id = p_tenant 
    AND e.employment_status = 'active'
    AND rf.period_month >= date_trunc('month', current_date - interval '3 months');

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

  SELECT COUNT(*)
  INTO v_exits_12m
  FROM public.hr_employees e
  WHERE e.company_id = p_tenant
    AND e.employment_status IN ('terminated', 'resigned')
    AND e.termination_date >= current_date - interval '12 months';

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
    COALESCE(v_avg_risk, 0) * 100,
    COALESCE(v_high_risk_pct, 0),
    v_target_turnover,
    COALESCE(v_low_count, 0),
    COALESCE(v_med_count, 0),
    COALESCE(v_high_count, 0),
    COALESCE(v_exits_12m, 0),
    COALESCE(v_sparkline, '[]'::jsonb);
END;
$function$