-- Normalize safety: simple inverse incidence rate (demo)
create or replace function public.compute_hse_safety_score(p_company uuid)
returns numeric language sql stable set search_path=public as $$
  with x as (
    select count(*)::numeric as incidents
    from public.hse_incidents where company_id=p_company and occurred_at >= current_date - interval '90 days'
  )
  select greatest(0, least(100, 100 - (select incidents from x) * 2.5));
$$;

-- Workforce forecast accuracy: demo MAPE between planned vs actual headcount
create or replace function public.compute_workforce_forecast_accuracy(p_company uuid)
returns numeric language sql stable set search_path=public as $$ select 0; $$;

-- Compliance score: demo blend (integrations + docs + training)
create or replace function public.compute_compliance_score(p_company uuid)
returns numeric language sql stable set search_path=public as $$
  with i as (select avg(case when status='connected' then 1 else 0 end)::numeric as pct from public.integrations where company_id=p_company),
       d as (select avg(case when processed_by_ai then 1 else 0 end)::numeric from public.docs_events where company_id=p_company),
       t as (select coalesce(sum(hours),0)/1000.0 from public.hr_training where company_id=p_company)
  select round( 0.5*coalesce((select pct from i),0)*100
              + 0.2*coalesce((select * from t),0)*10
              + 0.3*coalesce((select pct from d),0)*100 , 1);
$$;

-- Daily snapshot writer
create or replace function public.dashboard_compute_kpis_v1(p_company uuid)
returns void language plpgsql security definer set search_path=public as $$
declare v_total int; v_saudis int; v_docs int; v_active_users int := 0;
begin
  select count(*) into v_total from public.hr_employees where company_id=p_company and employment_status='active';
  select count(*) into v_saudis from public.hr_employees where company_id=p_company and employment_status='active' and is_saudi=true;
  select count(*) into v_docs from public.docs_events where company_id=p_company and event_at >= now() - interval '30 days';
  insert into public.kpi_snapshots(company_id, total_employees, saudization_rate, hse_safety_score, active_users, docs_processed,
                                  training_hours, compliance_score, talent_pipeline_strength, predictive_risk_high,
                                  employee_experience_10, workforce_forecast_accuracy, snap_date)
  values (
    p_company,
    v_total,
    case when v_total=0 then 0 else round((v_saudis::numeric/v_total)*100,1) end,
    public.compute_hse_safety_score(p_company),
    v_active_users,
    v_docs,
    coalesce((select sum(hours) from public.hr_training where company_id=p_company and completed_at >= current_date - interval '90 days'),0),
    public.compute_compliance_score(p_company),
    75,
    12,
    round( (coalesce((select (barrett->>'values_alignment')::numeric from public.cci_scores_public_v1 s 
                      where s.tenant_id=p_company and s.scope='overall' order by last_computed_at desc limit 1),70) * 0.4)
          + (coalesce((select psych_safety from public.cci_scores_public_v1 s 
                      where s.tenant_id=p_company and s.scope='overall' order by last_computed_at desc limit 1),70) * 0.6), 1) / 10.0,
    public.compute_workforce_forecast_accuracy(p_company),
    current_date
  ) on conflict (company_id, snap_date) do update set
    total_employees = excluded.total_employees,
    saudization_rate = excluded.saudization_rate,
    hse_safety_score = excluded.hse_safety_score,
    active_users = excluded.active_users,
    docs_processed = excluded.docs_processed,
    training_hours = excluded.training_hours,
    compliance_score = excluded.compliance_score,
    talent_pipeline_strength = excluded.talent_pipeline_strength,
    predictive_risk_high = excluded.predictive_risk_high,
    employee_experience_10 = excluded.employee_experience_10,
    workforce_forecast_accuracy = excluded.workforce_forecast_accuracy;
end;
$$;

-- Read API for the dashboard
create or replace function public.dashboard_get_v1(p_company uuid)
returns table(
  snap_date date, total_employees int, saudization_rate numeric, hse_safety_score numeric,
  active_users int, docs_processed int, training_hours numeric, compliance_score numeric,
  talent_pipeline_strength int, predictive_risk_high int, employee_experience_10 numeric,
  workforce_forecast_accuracy numeric
) language sql stable security definer set search_path=public as $$
  select snap_date, total_employees, saudization_rate, hse_safety_score, active_users, docs_processed,
         training_hours, compliance_score, talent_pipeline_strength, predictive_risk_high,
         employee_experience_10, workforce_forecast_accuracy
  from public.kpi_snapshots
  where company_id = p_company
  order by snap_date desc
  limit 1;
$$;