-- KSA Government Integration Hub v1 Database Schema

-- Drop existing function first
drop function if exists public.gov_get_status_v1(uuid);

-- Adapters config
create table if not exists public.gov_adapters (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  system text check (system in ('qiwa','gosi','absher')) not null,
  status text check (status in ('connected','disconnected','demo')) default 'demo',
  config jsonb default '{}'::jsonb,          -- {client_id, secrets, endpoints, mode}
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz default now(),
  unique (tenant_id, system)
);

-- Sync jobs
create table if not exists public.gov_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  system text check (system in ('qiwa','gosi','absher')) not null,
  job_type text check (job_type in ('full_sync','delta_sync','validate_iqamas','fetch_contribs','status_check')) not null,
  status text check (status in ('queued','running','success','error')) default 'queued',
  payload jsonb,
  result jsonb,
  created_at timestamptz default now(),
  started_at timestamptz,
  finished_at timestamptz,
  error text
);

-- Events / audit
create table if not exists public.gov_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  system text not null,
  event_at timestamptz default now(),
  kind text,         -- 'nitaqat_status','gosi_contrib','iqama_invalid', etc.
  severity text check (severity in ('info','warn','error')) default 'info',
  message text,
  data jsonb
);
create index if not exists idx_gov_events_tenant_time on public.gov_events(tenant_id, event_at desc);

-- Evidence locker for receipts/letters/reports
create table if not exists public.gov_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  system text not null,
  title text,
  storage_path text,     -- points to Supabase Storage
  meta jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table public.gov_adapters enable row level security;
alter table public.gov_sync_jobs enable row level security;
alter table public.gov_events enable row level security;
alter table public.gov_documents enable row level security;

-- Drop existing policies if they exist
drop policy if exists "tenant_rw_adapters" on public.gov_adapters;
drop policy if exists "tenant_rw_jobs" on public.gov_sync_jobs;
drop policy if exists "tenant_rw_events" on public.gov_events;
drop policy if exists "tenant_rw_docs" on public.gov_documents;

-- Create policies
create policy "tenant_rw_adapters" on public.gov_adapters
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());

create policy "tenant_rw_jobs" on public.gov_sync_jobs
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());

create policy "tenant_rw_events" on public.gov_events
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());

create policy "tenant_rw_docs" on public.gov_documents
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());

-- Helper RPCs
create or replace function public.gov_get_status_v1(p_tenant uuid)
returns table(system text, status text, last_synced_at timestamptz, last_error text)
language sql stable security definer set search_path=public as $$
  select system, status, last_synced_at, last_error
  from public.gov_adapters where tenant_id = p_tenant order by system;
$$;

create or replace function public.gov_queue_job_v1(p_tenant uuid, p_system text, p_job text, p_payload jsonb default '{}'::jsonb)
returns uuid
language sql security definer set search_path=public as $$
  insert into public.gov_sync_jobs(tenant_id, system, job_type, payload)
  values (p_tenant, p_system, p_job, p_payload)
  returning id;
$$;