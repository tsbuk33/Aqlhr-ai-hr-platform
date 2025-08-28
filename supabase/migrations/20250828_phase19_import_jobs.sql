-- Phase 19: import jobs + rows with tenant RLS

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  mode text not null check (mode in ('employees','gov')),
  started_by uuid,
  status text not null default 'queued' check (status in ('queued','validated','processing','completed','failed')),
  total_rows int default 0,
  processed_rows int default 0,
  success_rows int default 0,
  failed_rows int default 0,
  created_at timestamptz default now(),
  finished_at timestamptz
);
alter table public.import_jobs enable row level security;

drop policy if exists "import_jobs_tenant_rw" on public.import_jobs;
create policy "import_jobs_tenant_rw" on public.import_jobs
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

create index if not exists idx_import_jobs_tenant_created on public.import_jobs(tenant_id, created_at desc);

create table if not exists public.import_rows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  job_id uuid not null references public.import_jobs(id) on delete cascade,
  row_index int not null,
  raw jsonb not null,
  normalized jsonb,
  error text,
  inserted_ids jsonb,
  created_at timestamptz default now()
);
alter table public.import_rows enable row level security;

drop policy if exists "import_rows_tenant_rw" on public.import_rows;
create policy "import_rows_tenant_rw" on public.import_rows
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

create index if not exists idx_import_rows_job on public.import_rows(job_id, row_index);
create index if not exists idx_import_rows_tenant on public.import_rows(tenant_id);

comment on table public.import_jobs is 'Tracks bulk imports per tenant with row counts and status';
comment on table public.import_rows is 'Per-row validation and results for imports';

-- Optional helper to fetch the latest job summary
create or replace view public.import_job_summary_v1 as
select j.*, 
       (j.success_rows::numeric / nullif(j.total_rows,0))::numeric as success_ratio
from public.import_jobs j;