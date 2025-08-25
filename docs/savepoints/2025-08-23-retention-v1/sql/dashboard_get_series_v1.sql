CREATE OR REPLACE FUNCTION public.dashboard_get_series_v1(p_tenant uuid, p_days integer DEFAULT 365)
 RETURNS TABLE(d date, total_employees integer, saudization_rate numeric, hse_safety_score numeric, docs_processed integer, training_hours numeric, compliance_score numeric, employee_experience_10 numeric, predictive_risk_high integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    snap_date as d, 
    total_employees::int, 
    saudization_rate, 
    hse_safety_score, 
    COALESCE(docs_processed, 0)::int,
    training_hours, 
    compliance_score, 
    employee_experience_10, 
    COALESCE(predictive_risk_high, 0)::int
  FROM public.kpi_snapshots
  WHERE company_id = p_tenant 
    AND snap_date >= current_date - (p_days::int - 1)
  ORDER BY snap_date ASC;
$function$