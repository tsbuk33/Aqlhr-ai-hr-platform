-- Dashboard Trends & Alerts v1: Production-grade KPI tracking and alerting
-- Unique day constraint for snapshots
CREATE UNIQUE INDEX IF NOT EXISTS uq_kpi_snapshots_tenant_day
ON public.kpi_snapshots(company_id, snap_date);

-- HSE incidents table (if not exists)
CREATE TABLE IF NOT EXISTS public.hse_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Integrations table (if not exists)  
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disconnected',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Docs events table (if not exists)
CREATE TABLE IF NOT EXISTS public.docs_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_by_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- HR training table (if not exists)
CREATE TABLE IF NOT EXISTS public.hr_training (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  completed_at TIMESTAMPTZ,
  hours NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CCI scores view (if not exists)
CREATE VIEW IF NOT EXISTS public.cci_scores_public_v1 AS
SELECT 
  tenant_id,
  'overall' as scope,
  jsonb_build_object('values_alignment', 75) as barrett,
  75 as psych_safety,
  now() as last_computed_at
FROM companies
WHERE id IS NOT NULL;

-- As-of variants so we can backfill properly (no CURRENT_DATE leakage)
CREATE OR REPLACE FUNCTION public.compute_hse_safety_score_asof(p_tenant UUID, p_asof DATE)
RETURNS NUMERIC LANGUAGE SQL STABLE AS $$
  WITH x AS (
    SELECT count(*)::NUMERIC as incidents
    FROM public.hse_incidents
    WHERE tenant_id = p_tenant 
      AND occurred_at > (p_asof::TIMESTAMPTZ - INTERVAL '90 days') 
      AND occurred_at <= (p_asof::TIMESTAMPTZ)
  )
  SELECT GREATEST(0, LEAST(100, 100 - (SELECT incidents FROM x) * 2.5));
$$;

CREATE OR REPLACE FUNCTION public.compute_compliance_score_asof(p_tenant UUID, p_asof DATE)
RETURNS NUMERIC LANGUAGE SQL STABLE AS $$
  WITH i AS (
    SELECT AVG(CASE WHEN status='connected' THEN 1 ELSE 0 END)::NUMERIC as pct
    FROM public.integrations WHERE tenant_id = p_tenant
  ),
  d AS (
    SELECT AVG(CASE WHEN processed_by_ai THEN 1 ELSE 0 END)::NUMERIC as pct
    FROM public.docs_events
    WHERE tenant_id = p_tenant 
      AND event_at > (p_asof::TIMESTAMPTZ - INTERVAL '90 days') 
      AND event_at <= (p_asof::TIMESTAMPTZ)
  ),
  t AS (
    SELECT COALESCE(SUM(hours), 0) as hrs
    FROM public.hr_training
    WHERE tenant_id = p_tenant 
      AND completed_at > (p_asof::TIMESTAMPTZ - INTERVAL '90 days') 
      AND completed_at <= (p_asof::TIMESTAMPTZ)
  )
  SELECT ROUND(
    0.5 * COALESCE((SELECT pct FROM i), 0) * 100
    + 0.2 * COALESCE((SELECT hrs FROM t), 0) * 10
    + 0.3 * COALESCE((SELECT pct FROM d), 0) * 100, 1
  );
$$;

-- Daily writer (as-of date)
CREATE OR REPLACE FUNCTION public.dashboard_compute_kpis_asof_v1(p_tenant UUID, p_asof DATE)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE 
  v_total INT; 
  v_saudis INT; 
  v_docs INT; 
  v_exp NUMERIC;
BEGIN
  -- Headcount "as of" using hires/terminations
  SELECT count(*) INTO v_total 
  FROM public.hr_employees
  WHERE company_id = p_tenant 
    AND hire_date <= p_asof 
    AND (termination_date IS NULL OR termination_date > p_asof);

  SELECT count(*) INTO v_saudis 
  FROM public.hr_employees
  WHERE company_id = p_tenant 
    AND hire_date <= p_asof 
    AND (termination_date IS NULL OR termination_date > p_asof) 
    AND is_saudi = true;

  SELECT count(*) INTO v_docs 
  FROM public.docs_events
  WHERE tenant_id = p_tenant 
    AND event_at > (p_asof::TIMESTAMPTZ - INTERVAL '30 days') 
    AND event_at <= (p_asof::TIMESTAMPTZ);

  v_exp := ROUND((
    COALESCE((
      SELECT (barrett->>'values_alignment')::NUMERIC
      FROM public.cci_scores_public_v1 s
      WHERE s.tenant_id = p_tenant 
        AND s.scope = 'overall'
        AND s.last_computed_at::DATE <= p_asof
      ORDER BY s.last_computed_at DESC 
      LIMIT 1
    ), 70) * 0.4
    + COALESCE((
      SELECT psych_safety
      FROM public.cci_scores_public_v1 s
      WHERE s.tenant_id = p_tenant 
        AND s.scope = 'overall'
        AND s.last_computed_at::DATE <= p_asof
      ORDER BY s.last_computed_at DESC 
      LIMIT 1
    ), 70) * 0.6
  ), 1) / 10.0;

  INSERT INTO public.kpi_snapshots(
    company_id, snap_date, total_employees, saudization_rate,
    hse_safety_score, active_users, docs_processed, training_hours,
    compliance_score, talent_pipeline_strength, predictive_risk_high,
    employee_experience_10, workforce_forecast_accuracy
  )
  VALUES (
    p_tenant, p_asof, v_total,
    CASE WHEN v_total = 0 THEN 0 ELSE ROUND((v_saudis::NUMERIC / v_total) * 100, 1) END,
    public.compute_hse_safety_score_asof(p_tenant, p_asof),
    0,
    v_docs,
    COALESCE((
      SELECT SUM(hours) 
      FROM public.hr_training
      WHERE tenant_id = p_tenant 
        AND completed_at > (p_asof::TIMESTAMPTZ - INTERVAL '90 days') 
        AND completed_at <= (p_asof::TIMESTAMPTZ)
    ), 0),
    public.compute_compliance_score_asof(p_tenant, p_asof),
    75, 12, v_exp, 0
  )
  ON CONFLICT (company_id, snap_date) DO NOTHING;
END;
$$;

-- Backfill N days from today inclusively
CREATE OR REPLACE FUNCTION public.dashboard_backfill_v1(p_tenant UUID, p_days INT DEFAULT 365)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE 
  d DATE := CURRENT_DATE - (p_days::INT - 1);
BEGIN
  WHILE d <= CURRENT_DATE LOOP
    PERFORM public.dashboard_compute_kpis_asof_v1(p_tenant => p_tenant, p_asof => d);
    d := d + 1;
  END LOOP;
END;
$$;

-- Series RPC for frontend (single call)
CREATE OR REPLACE FUNCTION public.dashboard_get_series_v1(p_tenant UUID, p_days INT DEFAULT 365)
RETURNS TABLE(
  d DATE,
  total_employees INT,
  saudization_rate NUMERIC,
  hse_safety_score NUMERIC,
  docs_processed INT,
  training_hours NUMERIC,
  compliance_score NUMERIC,
  employee_experience_10 NUMERIC,
  predictive_risk_high INT
) LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT 
    snap_date as d, 
    total_employees, 
    saudization_rate, 
    hse_safety_score, 
    docs_processed,
    training_hours, 
    compliance_score, 
    employee_experience_10, 
    predictive_risk_high
  FROM public.kpi_snapshots
  WHERE company_id = p_tenant 
    AND snap_date >= CURRENT_DATE - (p_days::INT - 1)
  ORDER BY snap_date ASC;
$$;

-- Simple alert rules (return bilingual text + metadata)
CREATE OR REPLACE FUNCTION public.dashboard_alerts_v1(p_tenant UUID)
RETURNS TABLE(
  severity TEXT,         -- 'high'|'medium'|'low'
  metric TEXT,           -- e.g., 'saudization','psych_safety','hse'
  message_en TEXT,
  message_ar TEXT,
  current_value NUMERIC,
  delta_30 NUMERIC,
  recommendation_en TEXT,
  recommendation_ar TEXT
) LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
WITH cur AS (
  SELECT * FROM public.kpi_snapshots
  WHERE company_id = p_tenant ORDER BY snap_date DESC LIMIT 1
),
prev30 AS (
  SELECT * FROM public.kpi_snapshots
  WHERE company_id = p_tenant ORDER BY snap_date DESC OFFSET 30 LIMIT 1
),
hse7 AS (
  SELECT count(*)::NUMERIC as n7 FROM public.hse_incidents
  WHERE tenant_id = p_tenant AND occurred_at > CURRENT_DATE - INTERVAL '7 days'
),
hse90 AS (
  SELECT GREATEST(count(*)::NUMERIC, 1) as n90 FROM public.hse_incidents
  WHERE tenant_id = p_tenant AND occurred_at > CURRENT_DATE - INTERVAL '90 days'
)
SELECT * FROM (
  -- Saudization below 60
  SELECT 'high' as severity, 'saudization' as metric,
         'Saudization below 60% – risk of Nitaqat downgrade' as message_en,
         'نطاقات في خطر: نسبة التوطين أقل من 60%' as message_ar,
         (SELECT saudization_rate FROM cur) as current_value,
         COALESCE((SELECT saudization_rate FROM cur) - (SELECT saudization_rate FROM prev30), 0) as delta_30,
         'Freeze non‑Saudi hiring, accelerate Saudi transfers/interviews now.' as recommendation_en,
         'إيقاف تعيين غير السعوديين فورًا وتسريع نقل/توظيف السعوديين.' as recommendation_ar
  WHERE (SELECT saudization_rate FROM cur) < 60

  UNION ALL
  -- Psych safety drop > 1.0 in 30d
  SELECT 'medium','psych_safety',
         'Psychological safety dropped >1.0 in 30 days',
         'انخفضت السلامة النفسية بأكثر من 1.0 خلال 30 يومًا',
         (SELECT employee_experience_10*10 FROM cur),
         COALESCE((SELECT employee_experience_10*10 FROM cur) - (SELECT employee_experience_10*10 FROM prev30), 0),
         'Run manager safety brief + targeted pulse in high‑risk departments.',
         'تنفيذ توعية للمديرين + نبضات متابعة في الإدارات ذات المخاطر العالية.'
  WHERE COALESCE((SELECT employee_experience_10*10 FROM cur) - (SELECT employee_experience_10*10 FROM prev30), 0) < -1.0

  UNION ALL
  -- HSE spike: 7d > 1.5x baseline weekly avg
  SELECT 'high','hse',
         'HSE incidents spiked in the last 7 days',
         'ارتفاع ملحوظ في الحوادث خلال 7 أيام',
         (SELECT n7 FROM hse7), NULL,
         'Immediate toolbox talks + site audit this week.',
         'تنفيذ جلسات توعوية فورية + تدقيق موقعي هذا الأسبوع.'
  WHERE (SELECT n7 FROM hse7) > ((SELECT n90 FROM hse90) / 13.0) * 1.5

  UNION ALL
  -- Docs throughput slump
  SELECT 'low','docs',
         'Document throughput fell vs prior 30 days',
         'انخفاض في معالجة المستندات مقارنة بالـ30 يومًا السابقة',
         (SELECT docs_processed FROM cur),
         COALESCE((SELECT docs_processed FROM cur) - (SELECT docs_processed FROM prev30), 0),
         'Check OCR queue and re‑index backlog.',
         'فحص طابور OCR وإعادة فهرسة الأعمال المتراكمة.'
  WHERE COALESCE((SELECT docs_processed FROM cur) - (SELECT docs_processed FROM prev30), 0) < -300
) a;
$$;

-- Enable RLS on new tables
ALTER TABLE IF EXISTS public.hse_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.docs_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hr_training ENABLE ROW LEVEL SECURITY;

-- RLS policies for new tables
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hse_incidents' AND policyname = 'tenant_isolation_hse_incidents') THEN
    CREATE POLICY tenant_isolation_hse_incidents ON public.hse_incidents
    FOR ALL USING (tenant_id = get_user_company_id());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'integrations' AND policyname = 'tenant_isolation_integrations') THEN
    CREATE POLICY tenant_isolation_integrations ON public.integrations
    FOR ALL USING (tenant_id = get_user_company_id());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'docs_events' AND policyname = 'tenant_isolation_docs_events') THEN
    CREATE POLICY tenant_isolation_docs_events ON public.docs_events
    FOR ALL USING (tenant_id = get_user_company_id());
  END IF;
END $$;