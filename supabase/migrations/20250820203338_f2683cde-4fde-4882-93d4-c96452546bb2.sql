-- Fix CCI Security Issues
-- 1. Fix the security definer view issue by making it a regular view
DROP VIEW IF EXISTS public.cci_scores_public_v1;

-- Recreate as a regular view with security barrier
CREATE VIEW public.cci_scores_public_v1 
WITH (security_barrier = true) AS
SELECT 
  cs.id,
  cs.tenant_id, 
  cs.survey_id,
  cs.wave_id,
  cs.scope,
  cs.scope_id,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cs.n >= s.anonymity_min_n 
    THEN cs.cvf ELSE NULL 
  END as cvf,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cs.n >= s.anonymity_min_n 
    THEN cs.web ELSE NULL 
  END as web,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cs.n >= s.anonymity_min_n 
    THEN cs.barrett ELSE NULL 
  END as barrett,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cs.n >= s.anonymity_min_n 
    THEN cs.psych_safety ELSE NULL 
  END as psych_safety,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cs.n >= s.anonymity_min_n 
    THEN cs.risk_index ELSE NULL 
  END as risk_index,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cs.n >= s.anonymity_min_n 
    THEN cs.balance_score ELSE NULL 
  END as balance_score,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cs.n >= s.anonymity_min_n 
    THEN cs.values_tags ELSE NULL 
  END as values_tags,
  cs.n,
  cs.last_computed_at,
  cs.created_at
FROM public.cci_scores cs
LEFT JOIN public.cci_surveys s ON s.id = cs.survey_id;

-- 2. Hide materialized view from API by revoking permissions
REVOKE ALL ON public.cci_response_quality_v1 FROM anon, authenticated;

-- 3. Ensure all CCI functions have proper search paths
ALTER FUNCTION public.cci_is_response_valid(jsonb, integer) SET search_path = public;
ALTER FUNCTION public.cci_response_quality_trigger() SET search_path = public;
ALTER FUNCTION public.refresh_cci_quality_stats() SET search_path = public;
ALTER FUNCTION public.cci_responses_assign_wave() SET search_path = public;