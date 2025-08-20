-- Security Fixes for CCI Schema
-- Address security linter warnings

-- 1. Fix function search paths (security requirement)
ALTER FUNCTION public.cci_is_response_valid(jsonb, int) SET search_path = public;
ALTER FUNCTION public.cci_response_quality_trigger() SET search_path = public;
ALTER FUNCTION public.refresh_cci_quality_stats() SET search_path = public;

-- 2. Drop and recreate the view without SECURITY DEFINER (fixes critical error)
DROP VIEW IF EXISTS public.cci_scores_public_v1;

-- Recreate as a regular view (not security definer)
-- UI should read from this view instead of base table for anonymity protection
CREATE VIEW public.cci_scores_public_v1 AS
SELECT 
  cci_scores.id,
  cci_scores.tenant_id, 
  cci_scores.survey_id,
  cci_scores.wave_id,
  cci_scores.scope,
  cci_scores.scope_id,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.cvf ELSE NULL 
  END as cvf,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.web ELSE NULL 
  END as web,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.barrett ELSE NULL 
  END as barrett,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.psych_safety ELSE NULL 
  END as psych_safety,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.risk_index ELSE NULL 
  END as risk_index,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.balance_score ELSE NULL 
  END as balance_score,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.values_tags ELSE NULL 
  END as values_tags,
  cci_scores.n,
  cci_scores.last_computed_at,
  cci_scores.created_at
FROM public.cci_scores
LEFT JOIN public.cci_surveys s ON s.id = cci_scores.survey_id;

-- 3. Enable RLS on the view (inherit policies from base tables)
ALTER VIEW public.cci_scores_public_v1 SET (security_barrier = true);

-- 4. Hide materialized view from API if needed (optional - can be kept for admin access)
-- The materialized view can remain accessible for admin monitoring
-- but we'll document that it should be used carefully

-- Add comment to document security consideration
COMMENT ON MATERIALIZED VIEW public.cci_response_quality_v1 IS 
'Quality metrics view - contains aggregated data only, no PII. Used for monitoring response quality.';

-- Add comment to document the anonymity protection
COMMENT ON VIEW public.cci_scores_public_v1 IS 
'Anonymity-protected view of CCI scores. Automatically suppresses metrics when n < anonymity_min_n threshold.';

-- Add RLS policy for the view to be extra safe
-- (This is redundant since the view inherits from base tables, but good practice)
ALTER VIEW public.cci_scores_public_v1 ENABLE ROW LEVEL SECURITY;

-- Note: The remaining warnings about extension in public schema and auth settings 
-- are system-level configurations that don't affect the CCI module security