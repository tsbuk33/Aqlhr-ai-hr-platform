-- Demo fallback (used if no session)
CREATE OR REPLACE FUNCTION public.get_demo_tenant_id()
RETURNS uuid 
LANGUAGE sql 
STABLE SECURITY DEFINER 
SET search_path = public 
AS $$
  WITH c AS (SELECT company_id as tenant_id FROM public.kpi_snapshots ORDER BY snap_date DESC LIMIT 1),
       e AS (SELECT company_id as tenant_id FROM public.hr_employees LIMIT 1),
       s AS (SELECT tenant_id FROM public.cci_surveys LIMIT 1)
  SELECT tenant_id FROM c 
  UNION ALL SELECT tenant_id FROM e 
  UNION ALL SELECT tenant_id FROM s 
  LIMIT 1;
$$;

-- 12-month series (definer; used by trends/sparklines)  
CREATE OR REPLACE FUNCTION public.dashboard_get_series_v1(p_tenant uuid, p_days int DEFAULT 365)
RETURNS TABLE(
  d date,
  total_employees int,
  saudization_rate numeric,
  hse_safety_score numeric,
  docs_processed int,
  training_hours numeric,
  compliance_score numeric,
  employee_experience_10 numeric,
  predictive_risk_high int
) 
LANGUAGE sql 
STABLE SECURITY DEFINER 
SET search_path = public 
AS $$
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
$$;

-- Issues & Alerts (definer; bilingual messages)
CREATE OR REPLACE FUNCTION public.dashboard_alerts_v1(p_tenant uuid)
RETURNS TABLE(
  severity text, 
  metric text, 
  message_en text, 
  message_ar text,
  current_value numeric, 
  delta_30 numeric,
  recommendation_en text, 
  recommendation_ar text
) 
LANGUAGE sql 
STABLE SECURITY DEFINER 
SET search_path = public 
AS $$
WITH cur AS (
  SELECT * FROM public.kpi_snapshots 
  WHERE company_id = p_tenant 
  ORDER BY snap_date DESC 
  LIMIT 1
), prev30 AS (
  SELECT * FROM public.kpi_snapshots 
  WHERE company_id = p_tenant 
    AND snap_date <= current_date - 30
  ORDER BY snap_date DESC 
  LIMIT 1
)
SELECT * FROM (
  SELECT 'high'::text, 'saudization'::text,
         'Saudization below 60% – risk of Nitaqat downgrade'::text,
         'نطاقات في خطر: نسبة التوطين أقل من 60%'::text,
         (SELECT saudization_rate FROM cur),
         COALESCE((SELECT saudization_rate FROM cur) - (SELECT saudization_rate FROM prev30), 0),
         'Freeze non‑Saudi hiring; accelerate Saudi transfers/interviews.'::text,
         'إيقاف تعيين غير السعوديين وتسريع نقل/توظيف السعوديين.'::text 
  WHERE (SELECT saudization_rate FROM cur) < 60

  UNION ALL
  SELECT 'medium'::text, 'psych_safety'::text,
         'Psychological safety dropped >1.0 in 30 days'::text,
         'انخفضت السلامة النفسية بأكثر من 1.0 خلال 30 يومًا'::text,
         (SELECT employee_experience_10 * 10 FROM cur),
         COALESCE((SELECT employee_experience_10 * 10 FROM cur) - (SELECT employee_experience_10 * 10 FROM prev30), 0),
         'Run manager safety brief + targeted pulse in high‑risk departments.'::text,
         'تنفيذ توعية للمديرين + نبضات متابعة في الإدارات ذات المخاطر.'::text
  WHERE COALESCE((SELECT employee_experience_10 * 10 FROM cur) - (SELECT employee_experience_10 * 10 FROM prev30), 0) < -1.0

  UNION ALL
  SELECT 'low'::text, 'demo'::text,
         'Demo alert for testing purposes'::text,
         'تنبيه تجريبي لأغراض الاختبار'::text,
         42::numeric,
         -2.5::numeric,
         'This is a demo recommendation.'::text,
         'هذه توصية تجريبية.'::text
  WHERE (SELECT COUNT(*) FROM cur) > 0
) a;
$$;

-- UI error/observability (tenant-scoped)
CREATE TABLE IF NOT EXISTS public.ui_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  page text NOT NULL,
  level text CHECK (level IN ('info','warn','error')) DEFAULT 'error',
  message text,
  details jsonb,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ui_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_rw_ui_events" ON public.ui_events;
CREATE POLICY "tenant_rw_ui_events" ON public.ui_events
  FOR ALL USING (tenant_id = public.get_user_company_id()) 
  WITH CHECK (tenant_id = public.get_user_company_id());

CREATE INDEX IF NOT EXISTS idx_ui_events_tenant_time ON public.ui_events(tenant_id, created_at DESC);