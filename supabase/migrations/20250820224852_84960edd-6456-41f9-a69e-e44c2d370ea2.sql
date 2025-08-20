-- Create reverse-scoring compute functions and RPCs (fixed syntax)

-- Flatten + adjust values view (handles reverse scoring)
CREATE OR REPLACE VIEW public.cci_answers_v1 AS
SELECT
  r.tenant_id,
  r.survey_id,
  r.wave_id,
  (kv.key::uuid) as item_id,
  (kv.value)::int as raw_value,
  i.scale_min, i.scale_max, i.reverse_scored,
  CASE WHEN i.reverse_scored
       THEN (i.scale_min + i.scale_max) - (kv.value)::int
       ELSE (kv.value)::int END as adj_value,
  r.department_id, r.project_id, r.grade_id,
  r.is_flagged
FROM public.cci_responses r
CROSS JOIN jsonb_each_text(r.answers) as kv
JOIN public.cci_survey_items i ON i.id = (kv.key::uuid) AND i.survey_id = r.survey_id
WHERE r.is_flagged = false
  AND kv.key ~ '^[0-9a-fA-F-]{36}$';

-- Compute per wave function
CREATE OR REPLACE FUNCTION public.cci_compute_scores_v1(p_tenant uuid, p_survey uuid, p_wave uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.cci_scores WHERE tenant_id=p_tenant AND survey_id=p_survey AND wave_id=p_wave;

  WITH ans AS (
    SELECT a.*, i.framework, i.dimension
    FROM public.cci_answers_v1 a
    JOIN public.cci_survey_items i ON i.id=a.item_id
    WHERE a.tenant_id=p_tenant AND a.survey_id=p_survey AND a.wave_id=p_wave
  ),
  cvf AS (
    SELECT dimension, AVG( (adj_value - MIN(scale_min))::numeric / NULLIF(MAX(scale_max)-MIN(scale_min),0) * 100 ) as score
    FROM ans WHERE framework='cvf' GROUP BY dimension
  ),
  web AS (
    SELECT dimension, AVG( (adj_value - MIN(scale_min))::numeric / NULLIF(MAX(scale_max)-MIN(scale_min),0) * 100 ) as score
    FROM ans WHERE framework='web' GROUP BY dimension
  ),
  psych AS (
    SELECT AVG( (adj_value - MIN(scale_min))::numeric / NULLIF(MAX(scale_max)-MIN(scale_min),0) * 100 ) as score
    FROM ans WHERE framework='psych_safety'
  ),
  counts AS (
    SELECT COUNT(DISTINCT respondent_hash) as n
    FROM public.cci_responses 
    WHERE tenant_id=p_tenant AND survey_id=p_survey AND wave_id=p_wave AND is_flagged=false
  ),
  values_alignment AS (
    SELECT
      COALESCE(
        100.0 * array_length(
          (SELECT array_agg(x) FROM jsonb_array_elements_text(r.answers->'values_current') AS x) &
          (SELECT array_agg(y) FROM jsonb_array_elements_text(r.answers->'values_desired') AS y), 1
        ) / NULLIF(
          array_length(
            (SELECT array_agg(x) FROM jsonb_array_elements_text(r.answers->'values_current') AS x) ||
            (SELECT array_agg(y) FROM jsonb_array_elements_text(r.answers->'values_desired') AS y), 1
          ), 0
        ), 50
      ) as score
    FROM public.cci_responses r
    WHERE tenant_id=p_tenant AND survey_id=p_survey AND wave_id=p_wave AND is_flagged=false
    LIMIT 1
  )
  INSERT INTO public.cci_scores(
    id, tenant_id, survey_id, wave_id, scope, scope_id,
    cvf, web, barrett, psych_safety, risk_index, balance_score, values_tags, n, last_computed_at
  )
  SELECT gen_random_uuid(), p_tenant, p_survey, p_wave, 'overall', null,
    (SELECT jsonb_object_agg(dimension, score) FROM cvf),
    (SELECT jsonb_object_agg(dimension, score) FROM web),
    jsonb_build_object('values_alignment', (SELECT score FROM values_alignment)),
    (SELECT score FROM psych),
    null, null, null,
    (SELECT n FROM counts), now();

  UPDATE public.cci_scores s
  SET balance_score = ROUND(
      0.40 * ( COALESCE((s.cvf->>'Clan')::numeric, 0) + COALESCE((s.cvf->>'Adhocracy')::numeric, 0) + COALESCE((s.cvf->>'Market')::numeric, 0) + COALESCE((s.cvf->>'Hierarchy')::numeric, 0) ) / 4
    + 0.20 * ( COALESCE((s.web->>'Stories')::numeric, 0) + COALESCE((s.web->>'Symbols')::numeric, 0) + COALESCE((s.web->>'Power Structures')::numeric, 0)
              + COALESCE((s.web->>'Control Systems')::numeric, 0) + COALESCE((s.web->>'Rituals & Routines')::numeric, 0) + COALESCE((s.web->>'Organizational Structure')::numeric, 0) ) / 6
    + 0.15 * COALESCE((s.barrett->>'values_alignment')::numeric,70)
    + 0.15 * COALESCE(s.psych_safety, 0)
    + 0.10 * 70
  ,2),
  risk_index = ROUND(
      (100 - COALESCE(s.psych_safety,50)) * 0.40
    + (100 - COALESCE((s.barrett->>'values_alignment')::numeric,70)) * 0.25
    + GREATEST(0, 25 - LEAST(25,
        ABS( COALESCE((s.cvf->>'Clan')::numeric, 0) - COALESCE((s.cvf->>'Market')::numeric, 0) )/2 +
        ABS( COALESCE((s.cvf->>'Adhocracy')::numeric, 0) - COALESCE((s.cvf->>'Hierarchy')::numeric, 0) )/2 )) * 0.20
    + 15
  ,2)
  WHERE s.tenant_id=p_tenant AND s.survey_id=p_survey AND s.wave_id=p_wave AND s.scope='overall';
END;
$$;

-- RPCs for UI
CREATE OR REPLACE FUNCTION public.cci_get_overview_v1(p_tenant uuid, p_survey uuid, p_wave uuid)
RETURNS TABLE(balance_score numeric, risk_index numeric, psych_safety numeric, barrett jsonb, cvf jsonb, web jsonb, n int, last_computed_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT s.balance_score, s.risk_index, s.psych_safety, s.barrett, s.cvf, s.web, s.n, s.last_computed_at
  FROM public.cci_scores_public_v1 s
  WHERE s.tenant_id=p_tenant AND s.survey_id=p_survey AND s.wave_id=p_wave AND s.scope='overall';
$$;

CREATE OR REPLACE FUNCTION public.cci_get_heatmap_v1(p_tenant uuid, p_survey uuid, p_wave uuid, p_scope text)
RETURNS TABLE(scope_id uuid, balance_score numeric, psych_safety numeric, risk_index numeric, n int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT scope_id, balance_score, psych_safety, risk_index, n
  FROM public.cci_scores_public_v1
  WHERE tenant_id=p_tenant AND survey_id=p_survey AND wave_id=p_wave AND scope=p_scope;
$$;