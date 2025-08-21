-- Add integrations_overview_v2 function for combined Gov + Tools status
CREATE OR REPLACE FUNCTION public.integrations_overview_v2(p_tenant uuid)
RETURNS TABLE(integration_group text, connected integer, total integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  -- Tools bucket (existing tool_integrations table)
  SELECT 'tools'::text as integration_group,
         COUNT(*) FILTER (WHERE sync_status='connected')::integer as connected,
         COUNT(*)::integer as total
  FROM public.tool_integrations WHERE company_id = p_tenant
  UNION ALL
  -- Gov bucket
  SELECT 'gov'::text as integration_group,
         COUNT(*) FILTER (WHERE status='connected')::integer as connected,
         COUNT(*)::integer as total
  FROM public.gov_adapters WHERE tenant_id = p_tenant;
$$;