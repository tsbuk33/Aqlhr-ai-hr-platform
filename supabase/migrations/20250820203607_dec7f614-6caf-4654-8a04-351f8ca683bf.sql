-- Simple Security Fix - Clean approach
-- Fix remaining CCI security issues with a clean approach

-- Recreate the view without any security definer issues
DROP VIEW IF EXISTS public.cci_scores_public_v1 CASCADE;

CREATE VIEW public.cci_scores_public_v1 AS
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

-- Grant minimal permissions
GRANT SELECT ON public.cci_scores_public_v1 TO authenticated;

-- Ensure all our functions have search_path set properly
ALTER FUNCTION public.get_user_company_id() SET search_path = public;
ALTER FUNCTION public.cci_responses_assign_wave() SET search_path = public;