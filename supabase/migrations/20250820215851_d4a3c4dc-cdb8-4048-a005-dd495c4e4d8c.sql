-- Migration: unique in-progress guard for idempotency
CREATE UNIQUE INDEX IF NOT EXISTS uq_agent_actions_in_progress
  ON public.agent_actions(tenant_id, action_type, (input_data->>'surveyId'), (input_data->>'waveId'))
  WHERE status = 'running';

-- Add index for better performance on agent actions lookups
CREATE INDEX IF NOT EXISTS idx_agent_actions_tenant_type_status 
  ON public.agent_actions(tenant_id, action_type, status);

-- Add missing RPC function for CCI overview if not exists
CREATE OR REPLACE FUNCTION public.cci_get_overview_v1(
  p_tenant uuid,
  p_survey uuid,
  p_wave uuid
) RETURNS TABLE(
  balance_score numeric,
  risk_index numeric,
  psych_safety numeric,
  barrett jsonb,
  cvf jsonb,
  web jsonb,
  n integer,
  last_computed_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Mock data for now - replace with actual computation logic
  RETURN QUERY
  SELECT 
    75.5::numeric as balance_score,
    25.3::numeric as risk_index,
    68.2::numeric as psych_safety,
    '{"values_alignment": 72}'::jsonb as barrett,
    '{"Clan": 65, "Adhocracy": 70, "Market": 60, "Hierarchy": 80}'::jsonb as cvf,
    '{"Rituals & Routines": 55, "Power Structures": 75, "Control Systems": 70}'::jsonb as web,
    45 as n,
    now() as last_computed_at;
END;
$$;