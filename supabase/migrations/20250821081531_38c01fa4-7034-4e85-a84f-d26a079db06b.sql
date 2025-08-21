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

drop policy if exists "tenant_rw_sessions" on public.assistant_sessions;
drop policy if exists "tenant_rw_messages" on public.assistant_messages;
drop policy if exists "tenant_rw_tool_logs" on public.assistant_tool_logs;

create policy "tenant_rw_sessions" on public.assistant_sessions
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy "tenant_rw_messages" on public.assistant_messages
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
create policy "tenant_rw_tool_logs" on public.assistant_tool_logs
  for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());