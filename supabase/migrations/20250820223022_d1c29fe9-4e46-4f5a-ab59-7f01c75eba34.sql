-- Create or replace the overview RPC
CREATE OR REPLACE FUNCTION public.cci_get_overview_v1(p_tenant uuid, p_survey uuid, p_wave uuid)
RETURNS TABLE(balance_score numeric, risk_index numeric, psych_safety numeric, barrett jsonb, cvf jsonb, web jsonb, n int, last_computed_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT s.balance_score, s.risk_index, s.psych_safety, s.barrett, s.cvf, s.web, s.n, s.last_computed_at
  FROM public.cci_scores_public_v1 s
  WHERE s.tenant_id=p_tenant AND s.survey_id=p_survey AND s.wave_id=p_wave AND s.scope='overall';
$$;

-- Create or replace the heatmap RPC  
CREATE OR REPLACE FUNCTION public.cci_get_heatmap_v1(p_tenant uuid, p_survey uuid, p_wave uuid, p_scope text)
RETURNS TABLE(scope_id uuid, balance_score numeric, psych_safety numeric, risk_index numeric, n int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT scope_id, balance_score, psych_safety, risk_index, n
  FROM public.cci_scores_public_v1
  WHERE tenant_id=p_tenant AND survey_id=p_survey AND wave_id=p_wave AND scope=p_scope;
$$;