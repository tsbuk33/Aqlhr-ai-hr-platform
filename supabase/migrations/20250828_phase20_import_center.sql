-- Phase 20: Import Center RPCs + Realtime publication

-- List jobs for current tenant with optional filters & paging
create or replace function public.import_jobs_list_v1(
  p_limit int default 50,
  p_offset int default 0,
  p_mode text default null,
  p_status text default null
)
returns table (
  id uuid,
  mode text,
  status text,
  total_rows int,
  processed_rows int,
  success_rows int,
  failed_rows int,
  created_at timestamptz,
  finished_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    j.id, j.mode, j.status, j.total_rows, j.processed_rows,
    j.success_rows, j.failed_rows, j.created_at, j.finished_at
  from public.import_jobs j
  where j.tenant_id = public.get_user_company_id()
    and (p_mode   is null or j.mode   = p_mode)
    and (p_status is null or j.status = p_status)
  order by j.created_at desc
  limit coalesce(p_limit, 50)
  offset coalesce(p_offset, 0);
$$;

-- Fetch rows for a job (errors‑only or all) with paging
create or replace function public.import_rows_by_job_v1(
  p_job uuid,
  p_only_errors boolean default false,
  p_limit int default 500,
  p_offset int default 0
)
returns table (
  id uuid,
  row_index int,
  raw jsonb,
  normalized jsonb,
  error text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select r.id, r.row_index, r.raw, r.normalized, r.error, r.created_at
  from public.import_rows r
  join public.import_jobs j on j.id = r.job_id
  where j.tenant_id = public.get_user_company_id()
    and r.job_id = p_job
    and (not p_only_errors or r.error is not null)
  order by r.row_index asc
  limit coalesce(p_limit, 500)
  offset coalesce(p_offset, 0);
$$;

-- Enable realtime for UI progress (safe, tenant‑scoped in client)
alter publication supabase_realtime add table public.import_jobs;
alter publication supabase_realtime add table public.import_rows;