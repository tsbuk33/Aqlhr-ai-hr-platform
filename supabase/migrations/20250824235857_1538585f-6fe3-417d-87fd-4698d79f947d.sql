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
    SELECT 'Compensation' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'salary_percentile')::numeric < 25
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
    
    UNION ALL
    
    SELECT 'Manager Relationship' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'tenure_months')::numeric BETWEEN 6 AND 24
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
    
    UNION ALL
    
    SELECT 'Growth Opportunities' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'tenure_months')::numeric > 24
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
    
    UNION ALL
    
    SELECT 'Workload Management' as driver, COUNT(*) as count,
           AVG((rf.features->>'risk_score')::numeric) * 100 as avg_risk
    FROM public.retention_features rf
    JOIN public.hr_employees e ON rf.employee_id = e.id
    WHERE rf.tenant_id = p_tenant 
      AND e.employment_status = 'active'
      AND (rf.features->>'performance_rating')::numeric >= 4.0
      AND (rf.features->>'risk_score')::numeric > 0.7
      AND rf.period_month >= date_trunc('month', current_date - interval '1 month')
    
    UNION ALL
    
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