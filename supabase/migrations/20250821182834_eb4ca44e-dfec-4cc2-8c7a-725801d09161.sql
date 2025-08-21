-- 1) Honest banner (Gov + Tools) – add if missing
CREATE OR REPLACE FUNCTION public.integrations_overview_v2(p_tenant uuid)
RETURNS TABLE(integration_group text, connected integer, total integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT 'tools'::text as integration_group,
         COUNT(*) FILTER (WHERE sync_status='connected')::integer as connected,
         COUNT(*)::integer as total
  FROM public.tool_integrations 
  WHERE company_id = p_tenant

  UNION ALL

  SELECT 'gov'::text as integration_group,
         COUNT(*) FILTER (WHERE status='connected')::integer as connected,
         COUNT(*)::integer as total
  FROM public.gov_adapters 
  WHERE tenant_id = p_tenant;
$$;

-- 2) Recreate alerts with demo alert guard (simplified without HSE incidents)
DROP FUNCTION IF EXISTS public.dashboard_alerts_v1(uuid);

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
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
WITH demo_tenant AS (
  SELECT public.get_demo_tenant_id() as id
),
cur AS (
  SELECT * FROM public.kpi_snapshots
  WHERE company_id = p_tenant
  ORDER BY snap_date DESC
  LIMIT 1
),
prev30 AS (
  SELECT * FROM public.kpi_snapshots
  WHERE company_id = p_tenant
    AND snap_date <= current_date - 30
  ORDER BY snap_date DESC
  LIMIT 1
)
SELECT * FROM (
  -- Saudization risk
  SELECT 'high'::text, 'saudization'::text,
         'Saudization below 60% – risk of Nitaqat downgrade'::text,
         'نطاقات في خطر: نسبة التوطين أقل من 60%'::text,
         (SELECT saudization_rate FROM cur),
         COALESCE((SELECT saudization_rate FROM cur) - (SELECT saudization_rate FROM prev30), 0),
         'Freeze non‑Saudi hiring; accelerate Saudi transfers/interviews.'::text,
         'إيقاف تعيين غير السعوديين وتسريع نقل/توظيف السعوديين.'::text
  WHERE (SELECT saudization_rate FROM cur) < 60

  UNION ALL

  -- Psych safety drop
  SELECT 'medium'::text, 'psych_safety'::text,
         'Psychological safety dropped >1.0 in 30 days'::text,
         'انخفضت السلامة النفسية بأكثر من 1.0 خلال 30 يومًا'::text,
         (SELECT employee_experience_10 * 10 FROM cur),
         COALESCE((SELECT employee_experience_10 * 10 FROM cur) - (SELECT employee_experience_10 * 10 FROM prev30), 0),
         'Run manager safety brief + targeted pulse in high‑risk departments.'::text,
         'تنفيذ توعية للمديرين + نبضات متابعة في الإدارات ذات المخاطر.'::text
  WHERE COALESCE((SELECT employee_experience_10 * 10 FROM cur) - (SELECT employee_experience_10 * 10 FROM prev30), 0) < -1.0

  UNION ALL

  -- Demo-only alert (kept for Preview/demo tenants only)
  SELECT 'low'::text, 'demo'::text,
         'Demo alert for testing purposes'::text,
         'تنبيه تجريبي لأغراض الاختبار'::text,
         42::numeric,
         -2.5::numeric,
         'This is a demo recommendation.'::text,
         'هذه توصية تجريبية.'::text
  WHERE p_tenant = (SELECT id FROM demo_tenant)
) a;
$$;

-- 3) Support indexes (safe if already present)
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_company_date ON public.kpi_snapshots(company_id, snap_date);