-- Rebuild anonymity-protected view (tenant-safe, no leaks)
DROP VIEW IF EXISTS public.cci_scores_public_v1 CASCADE;

CREATE VIEW public.cci_scores_public_v1 AS
SELECT
  cs.id,
  cs.tenant_id,
  cs.survey_id,
  cs.wave_id,
  cs.scope,
  cs.scope_id,
  -- Suppress ALL metrics when below threshold
  CASE WHEN cs.n >= COALESCE(s.anonymity_min_n, 7) THEN cs.cvf END            AS cvf,
  CASE WHEN cs.n >= COALESCE(s.anonymity_min_n, 7) THEN cs.web END            AS web,
  CASE WHEN cs.n >= COALESCE(s.anonymity_min_n, 7) THEN cs.barrett END        AS barrett,
  CASE WHEN cs.n >= COALESCE(s.anonymity_min_n, 7) THEN cs.psych_safety END   AS psych_safety,
  CASE WHEN cs.n >= COALESCE(s.anonymity_min_n, 7) THEN cs.risk_index END     AS risk_index,
  CASE WHEN cs.n >= COALESCE(s.anonymity_min_n, 7) THEN cs.balance_score END  AS balance_score,
  CASE WHEN cs.n >= COALESCE(s.anonymity_min_n, 7) THEN cs.values_tags END    AS values_tags,
  -- Mask group size when below threshold
  CASE WHEN cs.n >= COALESCE(s.anonymity_min_n, 7) THEN cs.n END              AS n,
  cs.last_computed_at,
  cs.created_at
FROM public.cci_scores cs
JOIN public.cci_surveys s
  ON s.id = cs.survey_id
 AND s.tenant_id = cs.tenant_id;  -- enforce same-tenant join

-- Harden the view against planner push-down tricks
ALTER VIEW public.cci_scores_public_v1 SET (security_barrier = true);

-- Grants – allow API access for app users + Edge Functions
GRANT SELECT ON public.cci_scores_public_v1 TO authenticated, service_role;

-- Ensure helper functions always run in the public schema
ALTER FUNCTION public.get_user_company_id() SET search_path = public;
ALTER FUNCTION public.cci_responses_assign_wave() SET search_path = public;

-- Optional but recommended: document intent
COMMENT ON VIEW public.cci_scores_public_v1 IS
'Anonymity-protected CCI scores. Suppresses ALL metrics and masks n when group size < anonymity_min_n. Enforces same-tenant INNER JOIN.';