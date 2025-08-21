-- ===== HR core =====
create table if not exists public.hr_departments(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  code text not null,
  name_en text not null,
  name_ar text not null,
  parent_id uuid references public.hr_departments(id),
  created_at timestamptz default now()
);
create unique index if not exists uq_dept_tenant_code on public.hr_departments(tenant_id, code);

create table if not exists public.hr_locations(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  name_en text not null,
  name_ar text not null
);

create table if not exists public.hr_grades(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  code text not null,
  min_salary numeric,
  max_salary numeric
);
create unique index if not exists uq_grade_tenant_code on public.hr_grades(tenant_id, code);

create table if not exists public.hr_jobs(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  code text not null,
  title_en text not null,
  title_ar text not null,
  family text
);
create unique index if not exists uq_job_tenant_code on public.hr_jobs(tenant_id, code);

create table if not exists public.hr_employees(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  employee_no text not null,
  full_name_en text not null,
  full_name_ar text not null,
  gender text check (gender in ('M','F')) not null,
  nationality_code text not null,
  is_saudi boolean not null,
  dob date,
  hire_date date not null,
  termination_date date,
  dept_id uuid references public.hr_departments(id),
  job_id uuid references public.hr_jobs(id),
  grade_id uuid references public.hr_grades(id),
  location_id uuid references public.hr_locations(id),
  manager_id uuid references public.hr_employees(id),
  employment_status text check (employment_status in ('active','terminated','on_leave')) default 'active',
  base_salary numeric,
  allowances numeric,
  iqama_expiry date,
  created_at timestamptz default now()
);
create unique index if not exists uq_emp_tenant_empno on public.hr_employees(tenant_id, employee_no);
create index if not exists idx_emp_tenant_dept on public.hr_employees(tenant_id, dept_id);

-- Activity to drive KPIs
create table if not exists public.hr_attendance(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  employee_id uuid not null references public.hr_employees(id) on delete cascade,
  work_date date not null,
  tardy_minutes int default 0,
  overtime_minutes int default 0
);
create index if not exists idx_att_tenant_emp_date on public.hr_attendance(tenant_id, employee_id, work_date);

create table if not exists public.hr_leaves(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  employee_id uuid not null references public.hr_employees(id) on delete cascade,
  leave_type text check (leave_type in ('annual','sick','unpaid','other')) not null,
  start_date date not null,
  end_date date not null,
  days int not null
);

create table if not exists public.hr_training(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  employee_id uuid references public.hr_employees(id),
  course_name text,
  hours numeric,
  completed_at date
);

create table if not exists public.hse_incidents(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  occurred_at date not null,
  dept_id uuid references public.hr_departments(id),
  severity text check (severity in ('NearMiss','FirstAid','LTI','Recordable')) not null,
  days_lost int default 0,
  description text
);

create table if not exists public.docs_events(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  event_at timestamptz default now(),
  type text check (type in ('upload','ocr','extract','approve')) not null,
  module text,
  processed_by_ai boolean default false
);

create table if not exists public.integrations(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  name text not null,
  category text check (category in ('Gov','Tool')) not null,
  status text check (status in ('connected','partial','failed','pending')) not null default 'pending',
  last_sync timestamptz
);

-- ===== KPI snapshot + RPC =====
create table if not exists public.kpi_snapshots(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  snap_date date not null default current_date,
  total_employees int,
  saudization_rate numeric,
  hse_safety_score numeric,
  active_users int,
  docs_processed int,
  training_hours numeric,
  compliance_score numeric,
  talent_pipeline_strength int,
  predictive_risk_high int,
  employee_experience_10 numeric,
  workforce_forecast_accuracy numeric
);

-- ===== RLS (deny by default) =====
alter table public.hr_departments enable row level security;
alter table public.hr_locations  enable row level security;
alter table public.hr_grades     enable row level security;
alter table public.hr_jobs       enable row level security;
alter table public.hr_employees  enable row level security;
alter table public.hr_attendance enable row level security;
alter table public.hr_leaves     enable row level security;
alter table public.hr_training   enable row level security;
alter table public.hse_incidents enable row level security;
alter table public.docs_events   enable row level security;
alter table public.integrations  enable row level security;
alter table public.kpi_snapshots enable row level security;

-- Standard tenant read/write policies
create policy if not exists "tenant_rw_hr_departments" on public.hr_departments
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_hr_locations" on public.hr_locations
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_hr_grades" on public.hr_grades
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_hr_jobs" on public.hr_jobs
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_hr_employees" on public.hr_employees
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_hr_att" on public.hr_attendance
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_hr_leaves" on public.hr_leaves
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_hr_training" on public.hr_training
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_hse" on public.hse_incidents
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_docs" on public.docs_events
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_integrations" on public.integrations
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_kpis" on public.kpi_snapshots
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());

-- Normalize safety: simple inverse incidence rate (demo)
create or replace function public.compute_hse_safety_score(p_tenant uuid)
returns numeric language sql stable as $$
  with x as (
    select count(*)::numeric as incidents
    from public.hse_incidents where tenant_id=p_tenant and occurred_at >= current_date - interval '90 days'
  )
  select greatest(0, least(100, 100 - (select incidents from x) * 2.5));
$$;

-- Workforce forecast accuracy: demo MAPE between planned vs actual headcount
create or replace function public.compute_workforce_forecast_accuracy(p_tenant uuid)
returns numeric language sql stable as $$ select 0; $$;

-- Compliance score: demo blend (integrations + docs + training)
create or replace function public.compute_compliance_score(p_tenant uuid)
returns numeric language sql stable as $$
  with i as (select avg(case when status='connected' then 1 else 0 end)::numeric as pct from public.integrations where tenant_id=p_tenant),
       d as (select avg(case when processed_by_ai then 1 else 0 end)::numeric from public.docs_events where tenant_id=p_tenant),
       t as (select coalesce(sum(hours),0)/1000.0 from public.hr_training where tenant_id=p_tenant)
  select round( 0.5*coalesce((select pct from i),0)*100
              + 0.2*coalesce((select * from t),0)*10
              + 0.3*coalesce((select pct from d),0)*100 , 1);
$$;

-- Daily snapshot writer
create or replace function public.dashboard_compute_kpis_v1(p_tenant uuid)
returns void language plpgsql security definer set search_path=public as $$
declare v_total int; v_saudis int; v_docs int; v_active_users int := 0;
begin
  select count(*) into v_total from public.hr_employees where tenant_id=p_tenant and employment_status='active';
  select count(*) into v_saudis from public.hr_employees where tenant_id=p_tenant and employment_status='active' and is_saudi=true;
  select count(*) into v_docs from public.docs_events where tenant_id=p_tenant and event_at >= now() - interval '30 days';
  insert into public.kpi_snapshots(tenant_id, total_employees, saudization_rate, hse_safety_score, active_users, docs_processed,
                                  training_hours, compliance_score, talent_pipeline_strength, predictive_risk_high,
                                  employee_experience_10, workforce_forecast_accuracy, snap_date)
  values (
    p_tenant,
    v_total,
    case when v_total=0 then 0 else round((v_saudis::numeric/v_total)*100,1) end,
    public.compute_hse_safety_score(p_tenant),
    v_active_users,
    v_docs,
    coalesce((select sum(hours) from public.hr_training where tenant_id=p_tenant and completed_at >= current_date - interval '90 days'),0),
    public.compute_compliance_score(p_tenant),
    75,
    12,
    round( (coalesce((select (barrett->>'values_alignment')::numeric from public.cci_scores_public_v1 s 
                      where s.tenant_id=p_tenant and s.scope='overall' order by last_computed_at desc limit 1),70) * 0.4)
          + (coalesce((select psych_safety from public.cci_scores_public_v1 s 
                      where s.tenant_id=p_tenant and s.scope='overall' order by last_computed_at desc limit 1),70) * 0.6), 1) / 10.0,
    public.compute_workforce_forecast_accuracy(p_tenant),
    current_date
  ) on conflict (tenant_id, snap_date) do update set
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
create or replace function public.dashboard_get_v1(p_tenant uuid)
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
  where tenant_id = p_tenant
  order by snap_date desc
  limit 1;
$$;