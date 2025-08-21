-- Add integrations_overview_v2 function for combined Gov + Tools status
CREATE OR REPLACE FUNCTION public.integrations_overview_v2(p_tenant uuid)
RETURNS TABLE(grouping text, connected integer, total integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  -- Tools bucket (existing tool_integrations table)
  SELECT 'tools' as grouping,
         COUNT(*) FILTER (WHERE sync_status='connected')::integer as connected,
         COUNT(*)::integer as total
  FROM public.tool_integrations WHERE company_id = p_tenant
  UNION ALL
  -- Gov bucket
  SELECT 'gov' as grouping,
         COUNT(*) FILTER (WHERE status='connected')::integer as connected,
         COUNT(*)::integer as total
  FROM public.gov_adapters WHERE tenant_id = p_tenant;
$$;

-- Add plan feature for government adapters
INSERT INTO public.plan_features (plan_name, feature_key, is_enabled) VALUES
('growth', 'gov_adapters', true),
('enterprise', 'gov_adapters', true)
ON CONFLICT (plan_name, feature_key) DO NOTHING;

-- Ensure we have demo data for testing
INSERT INTO public.gov_adapters (tenant_id, system, mode, status) 
SELECT 
  (SELECT id FROM public.companies LIMIT 1),
  system,
  'test',
  'pending'
FROM (VALUES ('MOL'), ('QIWA'), ('GOSI'), ('ABSHER')) AS systems(system)
ON CONFLICT (tenant_id, system) DO NOTHING;