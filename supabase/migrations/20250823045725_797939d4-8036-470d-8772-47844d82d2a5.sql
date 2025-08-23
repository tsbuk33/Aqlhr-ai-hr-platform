-- Create diagnostic overview view for cross-signals analysis (fixed)
CREATE OR REPLACE VIEW public.diagnostic_overview_v1 AS
WITH cci_latest AS (
  SELECT 
    tenant_id,
    COALESCE(psych_safety, 0) as psych_safety,
    COALESCE(balance_score, 0) as balance_score,
    COALESCE(risk_index, 0) as risk_index,
    COALESCE((cvf->>'adaptability')::numeric, 0) as cvf_balance,
    COALESCE(n, 0) as cci_n
  FROM public.cci_scores_public_v1 
  WHERE scope = 'company'
),
retention_latest AS (
  SELECT 
    tenant_id,
    COALESCE(AVG(CASE WHEN features->>'risk_score' IS NOT NULL THEN (features->>'risk_score')::numeric END), 0) as avg_risk_score,
    COUNT(DISTINCT employee_id) as employees_at_risk,
    COALESCE(MAX(period_month), CURRENT_DATE - INTERVAL '1 month') as latest_period
  FROM public.retention_features 
  WHERE period_month >= CURRENT_DATE - INTERVAL '3 months'
  GROUP BY tenant_id
),
compliance_latest AS (
  SELECT 
    e.company_id as tenant_id,
    COUNT(*) FILTER (WHERE e.iqama_expiry IS NOT NULL AND e.iqama_expiry <= CURRENT_DATE + INTERVAL '30 days' AND NOT e.is_saudi) as iqama_expiring_30d,
    COALESCE(AVG(CASE WHEN e.is_saudi THEN 100.0 ELSE 0.0 END), 0) as saudization_rate,
    CASE 
      WHEN AVG(CASE WHEN e.is_saudi THEN 100.0 ELSE 0.0 END) >= 40 THEN 'green'
      WHEN AVG(CASE WHEN e.is_saudi THEN 100.0 ELSE 0.0 END) >= 25 THEN 'yellow' 
      ELSE 'red'
    END as nitaqat_status
  FROM public.hr_employees e
  WHERE e.employment_status = 'active'
  GROUP BY e.company_id
)
SELECT 
  COALESCE(c.tenant_id, r.tenant_id, comp.tenant_id) as tenant_id,
  
  -- CCI Metrics
  COALESCE(c.psych_safety, 0) as cci_psych_safety,
  COALESCE(c.balance_score, 0) as cci_balance_score,  
  COALESCE(c.risk_index, 0) as cci_risk_index,
  COALESCE(c.cvf_balance, 0) as cci_cvf_balance,
  COALESCE(c.cci_n, 0) as cci_sample_size,
  
  -- OSI Metrics (will be filled when OSI functions are available)
  0 as osi_total_layers,
  0 as osi_highest_saudi_layer,
  0 as osi_critical_layers,
  0 as osi_layers_meeting_target,
  0 as osi_span_outliers,
  0.0 as osi_management_cost,
  
  -- Retention Metrics  
  COALESCE(r.avg_risk_score, 0) as retention_avg_risk,
  COALESCE(r.employees_at_risk, 0) as retention_employees_at_risk,
  COALESCE(r.latest_period, CURRENT_DATE - INTERVAL '1 month') as retention_latest_period,
  
  -- Compliance Metrics
  COALESCE(comp.iqama_expiring_30d, 0) as compliance_iqama_expiring_30d,
  COALESCE(comp.saudization_rate, 0) as compliance_saudization_rate,
  COALESCE(comp.nitaqat_status, 'unknown') as compliance_nitaqat_status,
  
  -- Overall Health Indicators
  CASE 
    WHEN COALESCE(c.psych_safety, 0) < 60 OR COALESCE(r.avg_risk_score, 0) > 70 OR COALESCE(comp.iqama_expiring_30d, 0) > 10 THEN 'critical'
    WHEN COALESCE(c.balance_score, 0) < 70 OR COALESCE(comp.nitaqat_status, 'unknown') = 'yellow' THEN 'warning'
    ELSE 'healthy'
  END as overall_health_status,
  
  NOW() as computed_at

FROM cci_latest c
FULL OUTER JOIN retention_latest r ON c.tenant_id = r.tenant_id
FULL OUTER JOIN compliance_latest comp ON COALESCE(c.tenant_id, r.tenant_id) = comp.tenant_id
WHERE COALESCE(c.tenant_id, r.tenant_id, comp.tenant_id) IS NOT NULL;

-- Enable RLS on the view  
CREATE POLICY "diagnostic_overview_tenant_access" ON public.diagnostic_overview_v1
  FOR SELECT 
  USING (tenant_id = get_user_company_id());