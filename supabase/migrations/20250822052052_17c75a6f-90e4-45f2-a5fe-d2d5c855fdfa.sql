-- 1) Events we count toward ROI (no PII)
create table if not exists public.value_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  occurred_at timestamptz default now(),
  event_type text check (event_type in ('task_created','letter_generated','autopilot_run','gov_sync','doc_processed','pulse_sent','export_generated')) not null,
  qty numeric default 1,
  module text,
  ref_id uuid,
  meta jsonb
);
create index if not exists idx_value_events_tenant_time on public.value_events(tenant_id, occurred_at desc);

-- 2) Daily snapshots for quick trends
create table if not exists public.value_metrics_snapshots (
  tenant_id uuid not null,
  snap_date date not null,
  tasks int default 0,
  letters int default 0,
  docs int default 0,
  autopilot_runs int default 0,
  exports int default 0,
  est_hours_saved numeric default 0,
  primary key (tenant_id, snap_date)
);
create index if not exists idx_value_snap_tenant on public.value_metrics_snapshots(tenant_id);

-- 3) Share links (read-only viewers)
create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  kind text check (kind in ('dashboard_snapshot','cci_export')) not null,
  token text not null,
  expires_at timestamptz not null,
  payload jsonb,
  created_at timestamptz default now(),
  created_by uuid
);
create unique index if not exists uq_share_token on public.share_links(token);

-- RLS (tenant-scoped)
alter table public.value_events enable row level security;
alter table public.value_metrics_snapshots enable row level security;
alter table public.share_links enable row level security;

create policy if not exists "tenant_rw_value_events" on public.value_events
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_value_snap" on public.value_metrics_snapshots
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy if not exists "tenant_rw_share_links" on public.share_links
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());

-- 4) Helper to emit an ROI event (used by triggers/edge)
create or replace function public.roi_emit_event(
  p_tenant uuid,
  p_event text,
  p_qty numeric default 1,
  p_module text default null,
  p_ref uuid default null,
  p_meta jsonb default '{}'::jsonb
) returns void
language sql
security definer
set search_path=public
as $$
  insert into public.value_events(tenant_id, event_type, qty, module, ref_id, meta)
  values (p_tenant, p_event, p_qty, p_module, p_ref, p_meta);
$$;

-- 5) Snapshot upsert for a given date (coefficients are conservative)
create or replace function public.roi_snapshot_upsert_v1(p_tenant uuid, p_date date)
returns void
language sql
security definer
set search_path=public
as $$
  with d as (
    select
      coalesce(sum(qty) filter (where event_type='task_created'),0) as tasks,
      coalesce(sum(qty) filter (where event_type='letter_generated'),0) as letters,
      coalesce(sum(qty) filter (where event_type='doc_processed'),0) as docs,
      coalesce(sum(qty) filter (where event_type='autopilot_run'),0) as autopilot_runs,
      coalesce(sum(qty) filter (where event_type='export_generated'),0) as exports
    from public.value_events
    where tenant_id=p_tenant
      and occurred_at::date = p_date
  )
  insert into public.value_metrics_snapshots(tenant_id, snap_date, tasks, letters, docs, autopilot_runs, exports, est_hours_saved)
  select p_tenant, p_date, tasks, letters, docs, autopilot_runs, exports,
         round(tasks*0.25 + letters*0.5 + docs*0.05 + autopilot_runs*1.0 + exports*0.15, 2)
  from d
  on conflict (tenant_id, snap_date) do update set
    tasks=excluded.tasks,
    letters=excluded.letters,
    docs=excluded.docs,
    autopilot_runs=excluded.autopilot_runs,
    exports=excluded.exports,
    est_hours_saved=excluded.est_hours_saved;
$$;

-- 6) Backfill last N days
create or replace function public.roi_backfill_snapshots_v1(p_tenant uuid, p_days int default 30)
returns void
language plpgsql
security definer
set search_path=public
as $$
declare d date := current_date - (p_days::int - 1);
begin
  while d <= current_date loop
    perform public.roi_snapshot_upsert_v1(p_tenant, d);
    d := d + 1;
  end loop;
end; $$;

-- 7) ROI summary & trend RPCs
create or replace function public.roi_get_last30_v1(p_tenant uuid)
returns jsonb
language sql
stable
security definer
set search_path=public
as $$
  with win as (
    select * from public.value_metrics_snapshots
    where tenant_id=p_tenant and snap_date >= current_date - 29
  ), agg as (
    select coalesce(sum(tasks),0) as tasks,
           coalesce(sum(letters),0) as letters,
           coalesce(sum(docs),0) as docs,
           coalesce(sum(autopilot_runs),0) as autopilot_runs,
           coalesce(sum(exports),0) as exports,
           coalesce(sum(est_hours_saved),0) as hours_saved
    from win
  )
  select jsonb_build_object(
    'tasks',(select tasks from agg),
    'letters',(select letters from agg),
    'docs',(select docs from agg),
    'autopilot_runs',(select autopilot_runs from agg),
    'exports',(select exports from agg),
    'hours_saved',(select hours_saved from agg)
  );
$$;

create or replace function public.roi_get_trend_v1(p_tenant uuid, p_days int default 30)
returns table(d date, tasks int, letters int, docs int, autopilot_runs int, exports int, hours_saved numeric)
language sql
stable
security definer
set search_path=public
as $$
  select snap_date, tasks, letters, docs, autopilot_runs, exports, est_hours_saved
  from public.value_metrics_snapshots
  where tenant_id=p_tenant and snap_date >= current_date - (p_days::int - 1)
  order by snap_date;
$$;

-- 8) Triggers (create only if source table exists)
do $$
begin
  if to_regclass('public.tasks') is not null then
    execute $trg$ create or replace function public.trg_roi_task_created() returns trigger
    language plpgsql security definer as $fn$
    begin
      perform public.roi_emit_event(new.tenant_id, 'task_created', 1, coalesce(new.module,'system'), new.id, jsonb_build_object('priority',new.priority));
      perform public.roi_snapshot_upsert_v1(new.tenant_id, now()::date);
      return new;
    end $fn$;
    $trg$;
    if not exists (select 1 from pg_trigger where tgname='after_task_created_roi') then
      execute 'create trigger after_task_created_roi after insert on public.tasks for each row execute function public.trg_roi_task_created()';
    end if;
  end if;

  if to_regclass('public.compliance_letters') is not null then
    execute $trg$ create or replace function public.trg_roi_letter_generated() returns trigger
    language plpgsql security definer as $fn$
    begin
      perform public.roi_emit_event(new.tenant_id, 'letter_generated', 1, 'compliance', new.id, jsonb_build_object('type',new.type,'lang',new.lang));
      perform public.roi_snapshot_upsert_v1(new.tenant_id, now()::date);
      return new;
    end $fn$; $trg$;
    if not exists (select 1 from pg_trigger where tgname='after_letter_generated_roi') then
      execute 'create trigger after_letter_generated_roi after insert on public.compliance_letters for each row execute function public.trg_roi_letter_generated()';
    end if;
  end if;

  if to_regclass('public.compliance_runs') is not null then
    execute $trg$ create or replace function public.trg_roi_autopilot_run() returns trigger
    language plpgsql security definer as $fn$
    begin
      perform public.roi_emit_event(new.tenant_id, 'autopilot_run', 1, 'compliance', new.id, new.stats);
      perform public.roi_snapshot_upsert_v1(new.tenant_id, now()::date);
      return new;
    end $fn$; $trg$;
    if not exists (select 1 from pg_trigger where tgname='after_autopilot_run_roi') then
      execute 'create trigger after_autopilot_run_roi after insert on public.compliance_runs for each row execute function public.trg_roi_autopilot_run()';
    end if;
  end if;

  if to_regclass('public.docs_events') is not null then
    execute $trg$ create or replace function public.trg_roi_doc_processed() returns trigger
    language plpgsql security definer as $fn$
    begin
      perform public.roi_emit_event(new.tenant_id, 'doc_processed', 1, 'documents', new.id, jsonb_build_object('kind',new.kind));
      perform public.roi_snapshot_upsert_v1(new.tenant_id, now()::date);
      return new;
    end $fn$; $trg$;
    if not exists (select 1 from pg_trigger where tgname='after_doc_processed_roi') then
      execute 'create trigger after_doc_processed_roi after insert on public.docs_events for each row execute function public.trg_roi_doc_processed()';
    end if;
  end if;
end $$;