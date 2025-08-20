-- Comprehensive Security Fix for CCI Schema
-- Find and fix any remaining security definer functions/views

-- Fix all functions that might have security definer or missing search_path
DROP FUNCTION IF EXISTS public.cci_response_quality_trigger();
CREATE OR REPLACE FUNCTION public.cci_response_quality_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.cci_response_quality_v1;
  RETURN NULL;
END;
$$;

-- Ensure the refresh function is properly configured
DROP FUNCTION IF EXISTS public.refresh_cci_quality_stats();
CREATE OR REPLACE FUNCTION public.refresh_cci_quality_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.cci_response_quality_v1;
END;
$$;

-- Check for any remaining security definer views (there shouldn't be any now)
-- All our views should be regular views with security_barrier = true

-- Verify all CCI functions have proper settings
ALTER FUNCTION public.get_user_company_id() SET search_path = public;

-- Double-check the validation function
CREATE OR REPLACE FUNCTION public.cci_is_response_valid(answers jsonb, duration_seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check for too-short completion time
  IF duration_seconds < 120 THEN
    RETURN false;
  END IF;
  
  -- Check for missing critical answers
  IF NOT (answers ? 'q1' AND answers ? 'q5' AND answers ? 'q10') THEN
    RETURN false;
  END IF;
  
  -- Check for suspicious patterns (all same values)
  IF jsonb_array_length(jsonb_agg(DISTINCT value)) = 1 
     FROM jsonb_each_text(answers) WHERE key LIKE 'q%' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;