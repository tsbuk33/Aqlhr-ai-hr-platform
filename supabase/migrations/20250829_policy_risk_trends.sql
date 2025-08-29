-- Policy Risk Trends Analytics Migration
-- Speed filters
create index if not exists idx_policy_risk_assessments_company_created
  on public.policy_risk_assessments (company_id, created_at desc);

-- Daily rollups (materialized view)
create materialized view if not exists public.policy_risk_daily_mv as
select
  company_id,
  date_trunc('day', created_at)::date as day,
  count(*) as assessment_count,
  avg((scores->'overall'->>'value')::numeric) as overall_avg,
  max((scores->'overall'->>'value')::numeric) as overall_max,
  min((scores->'overall'->>'value')::numeric) as overall_min,
  avg((scores->'complianceRisk'->'saudiLaborLaw'->>'value')::numeric) as saudi_labor_avg,
  avg((scores->'complianceRisk'->'workplaceRights'->>'value')::numeric) as workplace_rights_avg,
  avg((scores->'complianceRisk'->'discriminationPrevention'->>'value')::numeric) as discrimination_prev_avg,
  avg((scores->'complianceRisk'->'dataProtection'->>'value')::numeric) as data_protection_avg,
  avg((scores->'businessRisk'->'operationalComplexity'->>'value')::numeric) as operational_complexity_avg,
  avg((scores->'businessRisk'->'resourceRequirements'->>'value')::numeric) as resource_requirements_avg,
  avg((scores->'businessRisk'->'stakeholderImpact'->>'value')::numeric) as stakeholder_impact_avg,
  avg((scores->'businessRisk'->'financialImplications'->>'value')::numeric) as financial_implications_avg,
  avg((scores->'implementationRisk'->'systemComplexity'->>'value')::numeric) as system_complexity_avg,
  avg((scores->'implementationRisk'->'changeResistance'->>'value')::numeric) as change_resistance_avg,
  avg((scores->'implementationRisk'->'trainingRequirements'->>'value')::numeric) as training_requirements_avg,
  avg((scores->'implementationRisk'->'monitoringDifficulty'->>'value')::numeric) as monitoring_difficulty_avg
from public.policy_risk_assessments
group by company_id, date_trunc('day', created_at)::date;

create index if not exists idx_policy_risk_daily_mv_company_day
  on public.policy_risk_daily_mv (company_id, day desc);

-- RLS wrapper for the MV
create view public.policy_risk_daily as
select * from public.policy_risk_daily_mv
where company_id = public.get_user_company_id();

grant select on public.policy_risk_daily to authenticated;

-- Function to refresh the materialized view
create or replace function public.refresh_policy_risk_daily_mv()
returns void
language plpgsql
security definer
as $$
begin
  refresh materialized view concurrently public.policy_risk_daily_mv;
end;
$$;

-- Grant execute permission to service_role
grant execute on function public.refresh_policy_risk_daily_mv() to service_role;

-- Add search indexes for filtering
create index if not exists idx_policy_risk_assessments_title_search
  on public.policy_risk_assessments using gin (to_tsvector('english', coalesce(title, '')));

-- Add index for date range filtering
create index if not exists idx_policy_risk_assessments_created_at_range
  on public.policy_risk_assessments (company_id, created_at);

-- Add composite index for ordering by overall score
create index if not exists idx_policy_risk_assessments_overall_score
  on public.policy_risk_assessments (company_id, ((scores->'overall'->>'value')::numeric) desc, created_at desc);