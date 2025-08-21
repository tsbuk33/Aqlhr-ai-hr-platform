-- Assistant sessions/messages (no PII in messages; store user_id ref)
create table if not exists public.assistant_sessions(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  created_at timestamptz default now(),
  created_by uuid,
  lang text check (lang in ('en','ar')) default 'en'
);

create table if not exists public.assistant_messages(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  session_id uuid not null references public.assistant_sessions(id) on delete cascade,
  role text check (role in ('user','assistant','tool')) not null,
  content text not null,
  created_at timestamptz default now(),
  tool_name text,
  tool_payload jsonb,
  tool_result jsonb
);

-- Tool call audit
create table if not exists public.assistant_tool_logs(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  called_at timestamptz default now(),
  tool_name text not null,
  requested_by uuid,
  payload jsonb,
  result_summary text
);

alter table public.assistant_sessions enable row level security;
alter table public.assistant_messages enable row level security;
alter table public.assistant_tool_logs enable row level security;

-- Drop existing policies if they exist before creating new ones
drop policy if exists "tenant_rw_sessions" on public.assistant_sessions;
drop policy if exists "tenant_rw_messages" on public.assistant_messages;
drop policy if exists "tenant_rw_tool_logs" on public.assistant_tool_logs;

create policy "tenant_rw_sessions" on public.assistant_sessions
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy "tenant_rw_messages" on public.assistant_messages
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy "tenant_rw_tool_logs" on public.assistant_tool_logs
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());

-- A) Headcount/Saudization snapshot for chat
create or replace function public.ask_headcount_v1(p_tenant uuid)
returns table(
  total int,
  saudi int,
  non_saudi int,
  saudization_rate numeric
) language sql stable security definer set search_path=public as $$
  with active as (
    select * from public.hr_employees
    where company_id=p_tenant and employment_status='active'
  )
  select count(*)::int as total,
         count(*) filter (where is_saudi)::int as saudi,
         count(*) filter (where not is_saudi)::int as non_saudi,
         case when count(*)=0 then 0 else round((count(*) filter (where is_saudi))::numeric/count(*)*100,1) end as saudization_rate
  from active;
$$;

-- B) Saudization color helper
create or replace function public.ask_saudization_status_v1(p_tenant uuid)
returns table(color text, rate numeric)
language sql stable security definer set search_path=public as $$
  select color, rate from public.saudization_color_v1(p_tenant);
$$;

-- C) Iqama expiring summary (aggregated; PDPL-safe by default)
create or replace function public.ask_iqama_expiring_summary_v1(p_tenant uuid, p_days int default 30)
returns table(
  days_ahead int,
  total int,
  by_department jsonb
) language sql stable security definer set search_path=public as $$
  with x as (
    select e.dept_id, d.name_en, d.name_ar
    from public.hr_employees e
    left join public.hr_departments d on d.id=e.dept_id
    where e.company_id=p_tenant
      and e.employment_status='active'
      and not e.is_saudi
      and e.iqama_expiry is not null
      and e.iqama_expiry <= current_date + (p_days::text || ' days')::interval
  ), agg as (
    select count(*) as total,
           jsonb_object_agg(coalesce(name_en,'Unknown'), dept_count) as dep_en,
           jsonb_object_agg(coalesce(name_ar,'غير معروف'), dept_count) as dep_ar
    from (
      select coalesce(name_en,'Unknown') as name_en,
             coalesce(name_ar,'غير معروف') as name_ar,
             count(*) as dept_count
      from x group by 1,2
    ) t
  )
  select p_days as days_ahead,
         coalesce((select total from agg),0)::int as total,
         jsonb_build_object('en',(select dep_en from agg),'ar',(select dep_ar from agg)) as by_department;
$$;

-- D) Iqama expiring detailed list (ROLE-GATED; admin only)
create or replace function public.ask_iqama_expiring_list_admin_v1(p_tenant uuid, p_days int default 30)
returns table(
  employee_id uuid,
  employee_no text,
  full_name_en text,
  full_name_ar text,
  dept_en text,
  dept_ar text,
  expiry_date date
) language sql stable security definer set search_path=public as $$
  -- Require admin roles
  with roles as (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role in ('admin','hr_manager','super_admin')
  )
  select e.id, e.employee_no, e.full_name_en, e.full_name_ar, d.name_en, d.name_ar, e.iqama_expiry
  from public.hr_employees e
  left join public.hr_departments d on d.id=e.dept_id
  where exists (select 1 from roles)
    and e.company_id=p_tenant and e.employment_status='active'
    and not e.is_saudi
    and e.iqama_expiry is not null
    and e.iqama_expiry <= current_date + (p_days::text || ' days')::interval
  order by e.iqama_expiry asc;
$$;

-- E) Evidence/doc search via vectors (returns titles/ids only)
create or replace function public.ask_search_evidence_v1(p_tenant uuid, p_query text, p_limit int default 5)
returns table(
  evidence_id uuid,
  title text,
  tags text[],
  score numeric
) language sql stable security definer set search_path=public as $$
  select e.id, coalesce(e.title,'(untitled)'), e.ai_tags, 1.0 as score
  from public.cci_evidence e
  where e.tenant_id=p_tenant
  order by e.created_at desc
  limit p_limit;
  -- NOTE: Replace with vector similarity when your embed function is wired here.
$$;