-- Recreate retention_overview_v1 with correct column names
CREATE OR REPLACE FUNCTION public.retention_overview_v1(p_tenant uuid)
RETURNS TABLE(
  total_employees integer,
  at_risk_count integer,
  high_performers integer,
  avg_tenure_months numeric,
  turnover_rate numeric,
  retention_score numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  with base_data as (
    select 
      e.id,
      e.employment_status,
      -- Cast text fields to numeric for calculations
      case when e.hire_date is not null 
           then extract(months from age(current_date, e.hire_date))::numeric 
           else 0 end as tenure_months,
      -- Use coalesce and safe casting for salary fields if they're text
      coalesce(
        case when e.base_salary::text ~ '^[0-9]+\.?[0-9]*$' 
             then e.base_salary::numeric 
             else 0 end, 0
      ) as salary_numeric
    from public.hr_employees e
    where e.company_id = p_tenant
      and e.employment_status = 'active'
  ),
  metrics as (
    select 
      count(*)::integer as total,
      count(*) filter (where tenure_months < 12)::integer as potential_risk,
      count(*) filter (where salary_numeric > 8000)::integer as high_perf,
      coalesce(avg(tenure_months), 0)::numeric as avg_tenure,
      -- Simple retention calculation
      case when count(*) > 0 
           then (100.0 - (count(*) filter (where tenure_months < 6)::numeric * 100.0 / count(*)))
           else 85.0 end as retention_pct,
      case when count(*) > 0
           then least(100, greatest(0, 85 + (avg(tenure_months) - 12) * 2))
           else 85.0 end as score
    from base_data
  )
  select 
    total,
    potential_risk,
    high_perf,
    round(avg_tenure, 1),
    round(retention_pct, 1),
    round(score, 1)
  from metrics;
$function$;

-- Recreate retention_drivers_v1 with correct column names
CREATE OR REPLACE FUNCTION public.retention_drivers_v1(p_tenant uuid)
RETURNS TABLE(
  driver_name text,
  impact_score numeric,
  risk_level text,
  affected_count integer,
  recommendation text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  with employee_data as (
    select 
      e.id,
      e.employment_status,
      -- Safe casting of text fields to numeric
      case when e.hire_date is not null 
           then extract(months from age(current_date, e.hire_date))::numeric 
           else 0 end as tenure_months,
      coalesce(
        case when e.base_salary::text ~ '^[0-9]+\.?[0-9]*$' 
             then e.base_salary::numeric 
             else 5000 end, 5000
      ) as salary_numeric,
      case when e.dept_id is not null then 'assigned' else 'unassigned' end as dept_status
    from public.hr_employees e
    where e.company_id = p_tenant
      and e.employment_status = 'active'
  ),
  driver_analysis as (
    select 
      'Low Tenure Risk' as driver,
      case when avg(tenure_months) < 12 then 85.0 else 65.0 end as impact,
      case when avg(tenure_months) < 12 then 'high' else 'medium' end as risk,
      count(*) filter (where tenure_months < 12)::integer as affected,
      'Focus on onboarding and early engagement programs' as rec
    from employee_data
    
    union all
    
    select 
      'Salary Competitiveness' as driver,
      case when avg(salary_numeric) < 6000 then 75.0 else 55.0 end as impact,
      case when avg(salary_numeric) < 6000 then 'high' else 'low' end as risk,
      count(*) filter (where salary_numeric < 6000)::integer as affected,
      'Review compensation packages and market benchmarks' as rec
    from employee_data
    
    union all
    
    select 
      'Department Assignment' as driver,
      70.0 as impact,
      'medium' as risk,
      count(*) filter (where dept_status = 'unassigned')::integer as affected,
      'Ensure all employees are properly assigned to departments' as rec
    from employee_data
  )
  select 
    driver,
    round(impact, 1),
    risk,
    affected,
    rec
  from driver_analysis
  order by impact desc;
$function$;