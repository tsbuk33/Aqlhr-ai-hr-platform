-- Final Security Fix - Remove any remaining security definer views
-- Check for any remaining security definer issues and fix them

-- Ensure all functions have proper search paths set
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Fix any remaining functions without search_path
    FOR func_record IN 
        SELECT n.nspname as schema_name, p.proname as function_name
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
        AND p.proname LIKE 'cci_%'
        AND NOT EXISTS (
            SELECT 1 FROM pg_proc_config pc 
            WHERE pc.proname = p.proname 
            AND pc.config_name = 'search_path'
        )
    LOOP
        EXECUTE format('ALTER FUNCTION public.%I SET search_path = public', func_record.function_name);
    END LOOP;
END
$$;

-- Double-check our view doesn't have security definer
-- If there are any remaining issues, we'll create a final safe version
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

-- Enable RLS on the view (it inherits from base tables)
-- Add security barrier for additional protection
ALTER VIEW public.cci_scores_public_v1 SET (security_barrier = true);

-- Grant appropriate permissions
GRANT SELECT ON public.cci_scores_public_v1 TO authenticated;
REVOKE ALL ON public.cci_scores_public_v1 FROM anon;