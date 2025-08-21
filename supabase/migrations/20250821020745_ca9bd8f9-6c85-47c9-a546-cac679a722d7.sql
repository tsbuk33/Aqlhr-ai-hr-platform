-- Demo tenant resolver and owner bootstrap functions
-- Safe demo tenant resolver (uses company_id, not tenant_id based on schema)
CREATE OR REPLACE FUNCTION public.get_demo_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH c AS (
    SELECT company_id FROM public.kpi_snapshots ORDER BY snap_date DESC LIMIT 1
  ), e AS (
    SELECT company_id FROM public.hr_employees LIMIT 1
  ), s AS (
    SELECT tenant_id FROM public.cci_surveys LIMIT 1  -- This table uses tenant_id
  )
  SELECT company_id FROM c
  UNION ALL SELECT company_id FROM e
  UNION ALL SELECT tenant_id FROM s
  LIMIT 1;
$$;

-- RPC to read integrations status via definer (for "All systems operational" banner)
-- Note: Need to check if integrations table exists or use tool_integrations
CREATE OR REPLACE FUNCTION public.integrations_status_v1(p_tenant uuid)
RETURNS TABLE(connected bigint, total bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) FILTER (WHERE sync_status = 'active') as connected,
    COUNT(*) as total
  FROM public.tool_integrations
  WHERE company_id = p_tenant;
$$;

-- Dashboard data getter function (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.dashboard_get_v1(p_tenant uuid)
RETURNS TABLE(
  snap_date text,
  total_employees numeric,
  saudization_rate numeric,
  hse_safety_score numeric,
  active_users numeric,
  docs_processed numeric,
  training_hours numeric,
  compliance_score numeric,
  talent_pipeline_strength numeric,
  predictive_risk_high numeric,
  employee_experience_10 numeric,
  workforce_forecast_accuracy numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    snap_date::text,
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
  FROM public.kpi_snapshots 
  WHERE company_id = p_tenant
  ORDER BY snap_date DESC 
  LIMIT 1;
$$;

-- Function to get user's company ID safely (handles both auth and demo modes)
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT company_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    public.get_demo_tenant_id()
  );
$$;