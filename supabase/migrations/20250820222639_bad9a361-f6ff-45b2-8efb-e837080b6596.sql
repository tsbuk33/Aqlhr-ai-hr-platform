-- 1) Create view to handle reverse scoring and extract Likert responses (properly structured)
create or replace view public.cci_answers_v1 as
select
  r.tenant_id,
  r.survey_id,
  r.wave_id,
  r.respondent_hash,
  (regexp_replace(kv.key, '^item::', ''))::uuid as item_id,
  (kv.value)::int as raw_value,
  i.scale_min, 
  i.scale_max, 
  i.reverse_scored,
  case when i.reverse_scored
       then (i.scale_min + i.scale_max) - (kv.value)::int
       else (kv.value)::int end as adj_value,
  i.framework,
  i.dimension,
  r.department_id, 
  r.project_id, 
  r.grade_id,
  r.is_flagged
from public.cci_responses r
cross join lateral jsonb_each_text(r.answers) as kv
join public.cci_survey_items i on i.id = (regexp_replace(kv.key, '^item::', ''))::uuid 
                                 and i.survey_id = r.survey_id
where r.is_flagged = false
  and kv.key ~ '^item::[0-9a-fA-F-]{36}$';  -- only Likert items with item:: prefix

-- 2) Update compute function to use adjusted values and handle values alignment
create or replace function public.cci_compute_scores_v1(p_tenant uuid, p_survey uuid, p_wave uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Clear existing scores
  delete from public.cci_scores 
  where tenant_id = p_tenant 
    and survey_id = p_survey 
    and wave_id = p_wave;

  -- Main computation with adjusted values
  with ans as (
    select a.*
    from public.cci_answers_v1 a
    where a.tenant_id = p_tenant 
      and a.survey_id = p_survey 
      and a.wave_id = p_wave
  ),
  
  -- CVF scoring (Competing Values Framework)
  cvf as (
    select 
      dimension, 
      round(avg( (adj_value - scale_min)::numeric / nullif(scale_max - scale_min, 0) * 100 )::numeric, 2) as score
    from ans 
    where framework = 'CVF' 
    group by dimension
  ),
  
  -- Cultural Web scoring
  web as (
    select 
      dimension, 
      round(avg( (adj_value - scale_min)::numeric / nullif(scale_max - scale_min, 0) * 100 )::numeric, 2) as score
    from ans 
    where framework = 'Cultural Web' 
    group by dimension
  ),
  
  -- Psychological Safety scoring
  psych as (
    select round(avg( (adj_value - scale_min)::numeric / nullif(scale_max - scale_min, 0) * 100 )::numeric, 2) as score
    from ans 
    where framework = 'Psychological Safety'
  ),
  
  -- KSA Context scoring
  ksa as (
    select round(avg( (adj_value - scale_min)::numeric / nullif(scale_max - scale_min, 0) * 100 )::numeric, 2) as score
    from ans 
    where framework = 'KSA Context'
  ),
  
  -- Response count
  counts as (
    select count(distinct respondent_hash) as n
    from public.cci_responses 
    where tenant_id = p_tenant 
      and survey_id = p_survey 
      and wave_id = p_wave 
      and is_flagged = false
  ),
  
  -- Values alignment calculation using intersection over union
  values_alignment as (
    select
      round(
        coalesce(
          avg(
            case 
              when (r.answers ? 'values_current') and (r.answers ? 'values_desired') then
                100.0 * cardinality( 
                  (select array_agg(x::text) from jsonb_array_elements_text(r.answers->'values_current') as x)
                  & 
                  (select array_agg(y::text) from jsonb_array_elements_text(r.answers->'values_desired') as y)
                ) / nullif(
                  cardinality( 
                    (select array_agg(x::text) from jsonb_array_elements_text(r.answers->'values_current') as x)
                    | 
                    (select array_agg(y::text) from jsonb_array_elements_text(r.answers->'values_desired') as y)
                  ), 0
                )
              else null
            end
          ), 
          50.0  -- Default if no values data
        )::numeric, 2
      ) as score
    from public.cci_responses r
    where tenant_id = p_tenant 
      and survey_id = p_survey 
      and wave_id = p_wave 
      and is_flagged = false
  )
  
  -- Insert computed scores
  insert into public.cci_scores(
    id, tenant_id, survey_id, wave_id, scope, scope_id,
    cvf, web, barrett, psych_safety, ksa_context, risk_index, balance_score, values_tags, n, last_computed_at
  )
  select 
    gen_random_uuid(), 
    p_tenant, 
    p_survey, 
    p_wave, 
    'overall', 
    null,
    (select jsonb_object_agg(dimension, score) from cvf),
    (select jsonb_object_agg(dimension, score) from web),
    jsonb_build_object('values_alignment', coalesce((select score from values_alignment), 50.0)),
    (select score from psych),
    (select score from ksa),
    null, -- Will be computed in update below
    null, -- Will be computed in update below
    null,
    (select n from counts), 
    now();

  -- Update computed metrics (balance_score and risk_index)
  update public.cci_scores s
  set 
    balance_score = round(
      0.30 * ( 
        coalesce((s.cvf->>'Clan')::numeric, 50) + 
        coalesce((s.cvf->>'Adhocracy')::numeric, 50) + 
        coalesce((s.cvf->>'Market')::numeric, 50) + 
        coalesce((s.cvf->>'Hierarchy')::numeric, 50) 
      ) / 4
      + 0.25 * ( 
        coalesce((s.web->>'Stories')::numeric, 50) + 
        coalesce((s.web->>'Symbols')::numeric, 50) + 
        coalesce((s.web->>'Power Structures')::numeric, 50) +
        coalesce((s.web->>'Control Systems')::numeric, 50) + 
        coalesce((s.web->>'Rituals & Routines')::numeric, 50) + 
        coalesce((s.web->>'Organizational Structure')::numeric, 50) 
      ) / 6
      + 0.15 * coalesce((s.barrett->>'values_alignment')::numeric, 50)
      + 0.20 * coalesce(s.psych_safety, 50)
      + 0.10 * coalesce(s.ksa_context, 50)
    , 2),
    
    risk_index = round(
      (100 - coalesce(s.psych_safety, 50)) * 0.35
      + (100 - coalesce((s.barrett->>'values_alignment')::numeric, 50)) * 0.25
      + greatest(0, 30 - least(30,
          abs(coalesce((s.cvf->>'Clan')::numeric, 50) - coalesce((s.cvf->>'Market')::numeric, 50)) / 2 +
          abs(coalesce((s.cvf->>'Adhocracy')::numeric, 50) - coalesce((s.cvf->>'Hierarchy')::numeric, 50)) / 2 
        )) * 0.25
      + (100 - coalesce(s.ksa_context, 50)) * 0.15
    , 2)
  where s.tenant_id = p_tenant 
    and s.survey_id = p_survey 
    and s.wave_id = p_wave 
    and s.scope = 'overall';
end;
$$;