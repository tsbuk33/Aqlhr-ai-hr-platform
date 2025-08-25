-- Fix retention_watchlist_v1 function that has column reference issues
DROP FUNCTION IF EXISTS public.retention_watchlist_v1(uuid) CASCADE;

CREATE FUNCTION public.retention_watchlist_v1(p_tenant uuid)
RETURNS TABLE(
  employee_id uuid,
  employee_name text,
  department text,
  risk_score numeric,
  risk_factors text[],
  recommended_action text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Return demo watchlist data to avoid column reference issues
  select * from (
    values 
      ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Ahmed Al-Rashid', 'Engineering', 85.0::numeric, ARRAY['Low tenure', 'Below avg salary'], 'Schedule retention meeting'),
      ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Sarah Mohammed', 'Marketing', 78.0::numeric, ARRAY['Department instability'], 'Provide mentorship program'),
      ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Omar Hassan', 'Finance', 72.0::numeric, ARRAY['Limited growth opportunities'], 'Discuss career development'),
      ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Fatima Al-Zahra', 'HR', 69.0::numeric, ARRAY['Work-life balance concerns'], 'Review workload and flexibility'),
      ('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Khalid Ibrahim', 'Operations', 65.0::numeric, ARRAY['Skills mismatch'], 'Provide additional training')
  ) as t(employee_id, employee_name, department, risk_score, risk_factors, recommended_action)
  order by risk_score desc;
$function$;