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
    HAVING COUNT(DISTINCT e.id) >= 3
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
    HAVING COUNT(DISTINCT e.id) >= 3
  )
  SELECT 
    dr.unit_name,
    dr.unit_type,
    dr.headcount,
    COALESCE(dr.avg_risk, 0) * 100,
    dr.exits_12m
  FROM department_risk dr
  WHERE COALESCE(dr.avg_risk, 0) > 0.5
  
  UNION ALL
  
  SELECT 
    gr.unit_name,
    gr.unit_type,
    gr.headcount,
    COALESCE(gr.avg_risk, 0) * 100,
    gr.exits_12m
  FROM grade_risk gr
  WHERE COALESCE(gr.avg_risk, 0) > 0.5
  
  ORDER BY risk_score DESC, recent_exits_12m DESC
  LIMIT 20;
END;
$function$