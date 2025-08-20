-- Drop existing view first
DROP VIEW IF EXISTS public.cci_scores_public_v1;
DROP VIEW IF EXISTS public.cci_answers_v1;

-- Flatten answers -> one row per (response, item, value)
CREATE OR REPLACE VIEW public.cci_answers_v1 AS
SELECT
  r.tenant_id,
  r.survey_id,
  r.wave_id,
  (kv.key::uuid) as item_id,
  (kv.value)::int as value,
  r.department_id,
  r.project_id,
  r.grade_id,
  r.is_flagged
FROM public.cci_responses r,
     jsonb_each_text(r.answers) as kv
WHERE r.is_flagged = false;

-- Create public view for cci_scores
CREATE OR REPLACE VIEW public.cci_scores_public_v1 AS
SELECT 
  tenant_id,
  survey_id, 
  wave_id,
  scope,
  scope_id,
  balance_score,
  risk_index,
  psych_safety,
  barrett,
  cvf,
  web,
  n,
  last_computed_at
FROM public.cci_scores;

-- Normalize to 0..100
CREATE OR REPLACE FUNCTION public.cci_norm_0_100(val int, minv int, maxv int)
RETURNS numeric
LANGUAGE sql IMMUTABLE
AS $$ SELECT CASE WHEN maxv=minv THEN 0 ELSE ((val - minv)::numeric / (maxv - minv)) * 100 END $$;

CREATE OR REPLACE FUNCTION public.cci_compute_scores_v1(p_tenant uuid, p_survey uuid, p_wave uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- wipe existing for this wave
  DELETE FROM public.cci_scores 
  WHERE tenant_id = p_tenant AND survey_id = p_survey AND wave_id = p_wave;

  WITH items AS (
    SELECT i.id, i.framework, i.dimension, i.scale_min, i.scale_max
    FROM public.cci_survey_items i
    WHERE i.survey_id = p_survey AND i.tenant_id = p_tenant
  ),
  ans AS (
    SELECT a.*, i.framework, i.dimension, i.scale_min, i.scale_max
    FROM public.cci_answers_v1 a
    JOIN items i ON i.id = a.item_id
    WHERE a.survey_id = p_survey AND a.wave_id = p_wave AND a.tenant_id = p_tenant
  ),
  cvf AS (
    SELECT 'cvf' as k, dimension,
           avg(cci_norm_0_100(value, min(scale_min), max(scale_max))) as score
    FROM ans WHERE framework = 'cvf'
    GROUP BY dimension
  ),
  web AS (
    SELECT 'web' as k, dimension,
           avg(cci_norm_0_100(value, min(scale_min), max(scale_max))) as score
    FROM ans WHERE framework = 'web'
    GROUP BY dimension
  ),
  psych AS (
    SELECT avg(cci_norm_0_100(value, min(scale_min), max(scale_max))) as score
    FROM ans WHERE framework = 'psych_safety'
  ),
  counts AS (
    SELECT count(distinct respondent_hash) as n
    FROM public.cci_responses 
    WHERE tenant_id=p_tenant AND survey_id=p_survey AND wave_id=p_wave AND is_flagged=false
  ),
  values_alignment AS (
    -- proxy: Jaccard similarity between selected current vs desired values (collected on client as arrays in answers JSON)
    SELECT coalesce(
      100.0 * cardinality( (SELECT array_agg(value) FROM jsonb_array_elements_text(r.answers->'values_current')) 
                           && 
                           (SELECT array_agg(value) FROM jsonb_array_elements_text(r.answers->'values_desired')) ) 
      / nullif( cardinality( (SELECT array_agg(value) FROM jsonb_array_elements_text(r.answers->'values_current')) 
                             || 
                             (SELECT array_agg(value) FROM jsonb_array_elements_text(r.answers->'values_desired')) ),0)
    ,50) as score
    FROM public.cci_responses r
    WHERE tenant_id=p_tenant AND survey_id=p_survey AND wave_id=p_wave AND is_flagged=false
    LIMIT 1
  )
  INSERT INTO public.cci_scores (
    id, tenant_id, survey_id, wave_id, scope, scope_id,
    cvf, web, barrett, psych_safety, risk_index, balance_score, values_tags, n, last_computed_at
  )
  SELECT
    gen_random_uuid(), p_tenant, p_survey, p_wave, 'overall', null,
    -- cvf json
    (SELECT jsonb_object_agg(dimension, score) FROM cvf),
    -- web json
    (SELECT jsonb_object_agg(dimension, score) FROM web),
    -- barrett proxy
    jsonb_build_object('values_alignment', (SELECT score FROM values_alignment)),
    (SELECT score FROM psych),
    null,  -- risk_index computed below
    null,  -- balance_score computed below
    null,
    (SELECT n FROM counts),
    now()
  ;

  -- compute balance_score and risk_index in a simple update
  UPDATE public.cci_scores s
  SET balance_score = round(
      0.40 * ( (s.cvf->>'Clan')::numeric + (s.cvf->>'Adhocracy')::numeric +
               (s.cvf->>'Market')::numeric + (s.cvf->>'Hierarchy')::numeric ) / 4
    + 0.20 * ( (s.web->>'Stories')::numeric + (s.web->>'Symbols')::numeric + (s.web->>'Power Structures')::numeric
              + (s.web->>'Control Systems')::numeric + (s.web->>'Rituals & Routines')::numeric + (s.web->>'Organizational Structure')::numeric ) / 6
    + 0.15 * coalesce((s.barrett->>'values_alignment')::numeric,70)
    + 0.15 * s.psych_safety
    + 0.10 * 70  -- evidence quality placeholder until evidence scorer is implemented
  ,2),
  risk_index = round(
      (100 - coalesce(s.psych_safety,50)) * 0.40
    + (100 - coalesce((s.barrett->>'values_alignment')::numeric,70)) * 0.25
    + greatest(0, 25 - least(25,
        abs( (s.cvf->>'Clan')::numeric - (s.cvf->>'Market')::numeric )/2 +
        abs( (s.cvf->>'Adhocracy')::numeric - (s.cvf->>'Hierarchy')::numeric )/2 )) * 0.20
    + 15  -- placeholder for outcome links (turnover/HSE/complaints); will be data‑driven later
  ,2)
  WHERE s.tenant_id=p_tenant AND s.survey_id=p_survey AND s.wave_id=p_wave AND s.scope='overall';
END;
$$;

CREATE OR REPLACE FUNCTION public.cci_get_overview_v1(p_tenant uuid, p_survey uuid, p_wave uuid)
RETURNS table(
  balance_score numeric, risk_index numeric, psych_safety numeric, barrett jsonb,
  cvf jsonb, web jsonb, n int, last_computed_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.balance_score, s.risk_index, s.psych_safety, s.barrett, s.cvf, s.web, s.n, s.last_computed_at
  FROM public.cci_scores_public_v1 s
  WHERE s.tenant_id = p_tenant AND s.survey_id = p_survey AND s.wave_id = p_wave AND s.scope='overall';
$$;

CREATE OR REPLACE FUNCTION public.cci_get_heatmap_v1(p_tenant uuid, p_survey uuid, p_wave uuid, p_scope text)
RETURNS table(scope_id uuid, balance_score numeric, psych_safety numeric, risk_index numeric, n int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT scope_id, balance_score, psych_safety, risk_index, n
  FROM public.cci_scores_public_v1
  WHERE tenant_id=p_tenant AND survey_id=p_survey AND wave_id=p_wave AND scope = p_scope;
$$;