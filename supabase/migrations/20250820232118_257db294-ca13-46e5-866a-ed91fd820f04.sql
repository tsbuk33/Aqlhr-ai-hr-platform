-- Drop and recreate the CCI compute scores function with evidence integration
DROP FUNCTION IF EXISTS cci_compute_scores_v1(UUID, UUID, UUID);

-- Recreate with evidence factor integration
CREATE OR REPLACE FUNCTION cci_compute_scores_v1(p_tenant UUID, p_survey UUID, p_wave UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_evidence_factor NUMERIC;
  v_base_balance NUMERIC := 70; -- Base balance score
  v_result JSONB;
BEGIN
  -- Get evidence quality factor (0-1 scale contributes up to 10% to balance)
  SELECT cci_evidence_quality_factor(p_tenant, p_survey) INTO v_evidence_factor;
  
  -- Calculate adjusted balance score: base (70) + evidence contribution (up to 10)
  v_base_balance := 70 + (v_evidence_factor * 10);
  
  -- Mock computation for now - in production this would analyze survey responses
  v_result := jsonb_build_object(
    'balance_score', v_base_balance,
    'risk_index', 25.0,
    'psych_safety', 82.0,
    'values_alignment', 78.0,
    'evidence_factor', v_evidence_factor,
    'evidence_contribution', (v_evidence_factor * 10),
    'computed_at', now()
  );
  
  -- Store computed scores
  INSERT INTO cci_scores (
    tenant_id, survey_id, wave_id, 
    scope, scope_id, n,
    balance_score, risk_index, psych_safety, values_alignment,
    computed_at, evidence_factor
  ) VALUES (
    p_tenant, p_survey, p_wave,
    'overall', p_tenant::text, 100,
    v_base_balance, 25.0, 82.0, 78.0,
    now(), v_evidence_factor
  )
  ON CONFLICT (tenant_id, survey_id, COALESCE(wave_id, '00000000-0000-0000-0000-000000000000'::UUID), scope, scope_id)
  DO UPDATE SET
    balance_score = EXCLUDED.balance_score,
    risk_index = EXCLUDED.risk_index,
    psych_safety = EXCLUDED.psych_safety,
    values_alignment = EXCLUDED.values_alignment,
    computed_at = EXCLUDED.computed_at,
    evidence_factor = EXCLUDED.evidence_factor;
  
  RETURN v_result;
END;
$$;

-- Add evidence_factor column to cci_scores if not exists
ALTER TABLE cci_scores 
ADD COLUMN IF NOT EXISTS evidence_factor NUMERIC DEFAULT 0.0;