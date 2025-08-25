-- dev_backfill_kpis_v1 (no parameters) function definition
CREATE OR REPLACE FUNCTION public.dev_backfill_kpis_v1()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select public.dev_backfill_kpis_v1(public.get_demo_tenant_id(), 365);
$function$

-- dev_backfill_kpis_v1 (with parameters) function definition  
-- Note: This function was truncated in the query result
-- The complete definition should be restored from migration files
-- This function generates historical KPI snapshots for dashboard time series