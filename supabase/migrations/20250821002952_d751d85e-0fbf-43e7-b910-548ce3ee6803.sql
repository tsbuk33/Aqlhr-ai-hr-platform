-- ===== HR core =====
create table if not exists public.hr_departments(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  code text not null,
  name_en text not null,
  name_ar text not null,
  parent_id uuid references public.hr_departments(id),
  created_at timestamptz default now()
);

create table if not exists public.hr_locations(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  name_en text not null,
  name_ar text not null
);

create table if not exists public.hr_grades(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  code text not null,
  min_salary numeric,
  max_salary numeric
);

create table if not exists public.hr_jobs(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  code text not null,
  title_en text not null,
  title_ar text not null,
  family text
);

create table if not exists public.hr_employees(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
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

-- Activity to drive KPIs
create table if not exists public.hr_attendance(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  employee_id uuid not null references public.hr_employees(id) on delete cascade,
  work_date date not null,
  tardy_minutes int default 0,
  overtime_minutes int default 0
);

create table if not exists public.hr_leaves(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  employee_id uuid not null references public.hr_employees(id) on delete cascade,
  leave_type text check (leave_type in ('annual','sick','unpaid','other')) not null,
  start_date date not null,
  end_date date not null,
  days int not null
);

create table if not exists public.hr_training(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  employee_id uuid references public.hr_employees(id),
  course_name text,
  hours numeric,
  completed_at date
);

create table if not exists public.hse_incidents(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  occurred_at date not null,
  dept_id uuid references public.hr_departments(id),
  severity text check (severity in ('NearMiss','FirstAid','LTI','Recordable')) not null,
  days_lost int default 0,
  description text
);

create table if not exists public.docs_events(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  event_at timestamptz default now(),
  type text check (type in ('upload','ocr','extract','approve')) not null,
  module text,
  processed_by_ai boolean default false
);

create table if not exists public.integrations(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  name text not null,
  category text check (category in ('Gov','Tool')) not null,
  status text check (status in ('connected','partial','failed','pending')) not null default 'pending',
  last_sync timestamptz
);

-- ===== KPI snapshot + RPC =====
create table if not exists public.kpi_snapshots(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
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

-- Create indexes
create unique index if not exists uq_dept_company_code on public.hr_departments(company_id, code);
create unique index if not exists uq_grade_company_code on public.hr_grades(company_id, code);
create unique index if not exists uq_job_company_code on public.hr_jobs(company_id, code);
create unique index if not exists uq_emp_company_empno on public.hr_employees(company_id, employee_no);
create index if not exists idx_emp_company_dept on public.hr_employees(company_id, dept_id);
create index if not exists idx_att_company_emp_date on public.hr_attendance(company_id, employee_id, work_date);
create unique index if not exists uq_kpi_company_date on public.kpi_snapshots(company_id, snap_date);

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

-- Drop existing policies to avoid conflicts
drop policy if exists "tenant_rw_hr_departments" on public.hr_departments;
drop policy if exists "tenant_rw_hr_locations" on public.hr_locations;
drop policy if exists "tenant_rw_hr_grades" on public.hr_grades;
drop policy if exists "tenant_rw_hr_jobs" on public.hr_jobs;
drop policy if exists "tenant_rw_hr_employees" on public.hr_employees;
drop policy if exists "tenant_rw_hr_att" on public.hr_attendance;
drop policy if exists "tenant_rw_hr_leaves" on public.hr_leaves;
drop policy if exists "tenant_rw_hr_training" on public.hr_training;
drop policy if exists "tenant_rw_hse" on public.hse_incidents;
drop policy if exists "tenant_rw_docs" on public.docs_events;
drop policy if exists "tenant_rw_integrations" on public.integrations;
drop policy if exists "tenant_rw_kpis" on public.kpi_snapshots;

-- Standard company read/write policies
create policy "company_rw_hr_departments" on public.hr_departments
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_hr_locations" on public.hr_locations
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_hr_grades" on public.hr_grades
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_hr_jobs" on public.hr_jobs
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_hr_employees" on public.hr_employees
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_hr_att" on public.hr_attendance
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_hr_leaves" on public.hr_leaves
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_hr_training" on public.hr_training
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_hse" on public.hse_incidents
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_docs" on public.docs_events
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_integrations" on public.integrations
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());
create policy "company_rw_kpis" on public.kpi_snapshots
  for all using (company_id = public.get_user_company_id()) with check (company_id = public.get_user_company_id());