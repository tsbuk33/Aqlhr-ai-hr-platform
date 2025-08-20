-- Flatten answers -> one row per (response, item, value)
create or replace view public.cci_answers_v1 as
select
  r.tenant_id,
  r.survey_id,
  r.wave_id,
  (kv.key::uuid) as item_id,
  (kv.value)::int as value,
  r.department_id,
  r.project_id,
  r.grade_id,
  r.is_flagged
from public.cci_responses r,
     jsonb_each_text(r.answers) as kv
where r.is_flagged = false;

-- Create public view for cci_scores if it doesn't exist
create or replace view public.cci_scores_public_v1 as
select 
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
from public.cci_scores;

-- Normalize to 0..100
create or replace function public.cci_norm_0_100(val int, minv int, maxv int)
returns numeric
language sql immutable
as $$ select case when maxv=minv then 0 else ((val - minv)::numeric / (maxv - minv)) * 100 end $$;

create or replace function public.cci_compute_scores_v1(p_tenant uuid, p_survey uuid, p_wave uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- wipe existing for this wave
  delete from public.cci_scores 
  where tenant_id = p_tenant and survey_id = p_survey and wave_id = p_wave;

  with items as (
    select i.id, i.framework, i.dimension, i.scale_min, i.scale_max
    from public.cci_survey_items i
    where i.survey_id = p_survey and i.tenant_id = p_tenant
  ),
  ans as (
    select a.*, i.framework, i.dimension, i.scale_min, i.scale_max
    from public.cci_answers_v1 a
    join items i on i.id = a.item_id
    where a.survey_id = p_survey and a.wave_id = p_wave and a.tenant_id = p_tenant
  ),
  cvf as (
    select 'cvf' as k, dimension,
           avg(cci_norm_0_100(value, min(scale_min), max(scale_max))) as score
    from ans where framework = 'cvf'
    group by dimension
  ),
  web as (
    select 'web' as k, dimension,
           avg(cci_norm_0_100(value, min(scale_min), max(scale_max))) as score
    from ans where framework = 'web'
    group by dimension
  ),
  psych as (
    select avg(cci_norm_0_100(value, min(scale_min), max(scale_max))) as score
    from ans where framework = 'psych_safety'
  ),
  counts as (
    select count(distinct respondent_hash) as n
    from public.cci_responses 
    where tenant_id=p_tenant and survey_id=p_survey and wave_id=p_wave and is_flagged=false
  ),
  values_alignment as (
    -- proxy: Jaccard similarity between selected current vs desired values (collected on client as arrays in answers JSON)
    select coalesce(
      100.0 * cardinality( (select array_agg(value) from jsonb_array_elements_text(r.answers->'values_current')) 
                           && 
                           (select array_agg(value) from jsonb_array_elements_text(r.answers->'values_desired')) ) 
      / nullif( cardinality( (select array_agg(value) from jsonb_array_elements_text(r.answers->'values_current')) 
                             || 
                             (select array_agg(value) from jsonb_array_elements_text(r.answers->'values_desired')) ),0)
    ,50) as score
    from public.cci_responses r
    where tenant_id=p_tenant and survey_id=p_survey and wave_id=p_wave and is_flagged=false
    limit 1
  )
  insert into public.cci_scores (
    id, tenant_id, survey_id, wave_id, scope, scope_id,
    cvf, web, barrett, psych_safety, risk_index, balance_score, values_tags, n, last_computed_at
  )
  select
    gen_random_uuid(), p_tenant, p_survey, p_wave, 'overall', null,
    -- cvf json
    (select jsonb_object_agg(dimension, score) from cvf),
    -- web json
    (select jsonb_object_agg(dimension, score) from web),
    -- barrett proxy
    jsonb_build_object('values_alignment', (select score from values_alignment)),
    (select score from psych),
    null,  -- risk_index computed below
    null,  -- balance_score computed below
    null,
    (select n from counts),
    now()
  ;

  -- compute balance_score and risk_index in a simple update
  update public.cci_scores s
  set balance_score = round(
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
  where s.tenant_id=p_tenant and s.survey_id=p_survey and s.wave_id=p_wave and s.scope='overall';
end;
$$;

create or replace function public.cci_get_overview_v1(p_tenant uuid, p_survey uuid, p_wave uuid)
returns table(
  balance_score numeric, risk_index numeric, psych_safety numeric, barrett jsonb,
  cvf jsonb, web jsonb, n int, last_computed_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select s.balance_score, s.risk_index, s.psych_safety, s.barrett, s.cvf, s.web, s.n, s.last_computed_at
  from public.cci_scores_public_v1 s
  where s.tenant_id = p_tenant and s.survey_id = p_survey and s.wave_id = p_wave and s.scope='overall';
$$;

create or replace function public.cci_get_heatmap_v1(p_tenant uuid, p_survey uuid, p_wave uuid, p_scope text)
returns table(scope_id uuid, balance_score numeric, psych_safety numeric, risk_index numeric, n int)
language sql
stable
security definer
set search_path = public
as $$
  select scope_id, balance_score, psych_safety, risk_index, n
  from public.cci_scores_public_v1
  where tenant_id=p_tenant and survey_id=p_survey and wave_id=p_wave and scope = p_scope;
$$;