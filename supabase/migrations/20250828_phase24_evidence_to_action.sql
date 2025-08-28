-- Phase 24: Evidence -> Action loop (feedback, notes, task RPC)
-- Builds on Phase 23 RAG system to create actionable items from evidence-based answers

-- 1) Feedback table for tracking assistant answer helpfulness
create table if not exists public.assistant_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  created_at timestamptz default now(),
  created_by uuid,
  session_id uuid,
  message_id uuid,
  question text,
  answer text,
  helpful boolean not null,
  reason text
);

alter table public.assistant_feedback enable row level security;

drop policy if exists "assistant_feedback_rw" on public.assistant_feedback;
create policy "assistant_feedback_rw" on public.assistant_feedback
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

create index if not exists idx_assistant_feedback_tenant_time
  on public.assistant_feedback(tenant_id, created_at desc);

-- 2) Report notes table for saving answer + citations snapshots
create table if not exists public.assistant_report_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  created_at timestamptz default now(),
  created_by uuid,
  title text not null,
  content text not null,           -- the rendered answer (EN/AR)
  lang text check (lang in ('en','ar')) not null default 'en',
  citations jsonb not null default '[]'::jsonb
);

alter table public.assistant_report_notes enable row level security;

drop policy if exists "assistant_report_notes_rw" on public.assistant_report_notes;
create policy "assistant_report_notes_rw" on public.assistant_report_notes
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

create index if not exists idx_assistant_report_notes_tenant_time
  on public.assistant_report_notes(tenant_id, created_at desc);

-- 3) RPC: create task (unified entry point for UI/assistant)
-- Ensures compatibility with existing task schema
create or replace function public.assistant_create_task_v1(
  p_title text,
  p_description text,
  p_priority text default 'medium',
  p_due_at timestamptz default null,
  p_assignee uuid default null,
  p_labels text[] default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_tenant_id uuid;
begin
  -- Get tenant context
  v_tenant_id := public.get_user_company_id();
  
  -- Insert task with proper tenant isolation
  insert into public.tasks (
    tenant_id, 
    title, 
    description, 
    priority, 
    due_at, 
    assignee_id, 
    labels,
    created_by,
    status
  )
  values (
    v_tenant_id, 
    p_title, 
    p_description, 
    p_priority, 
    p_due_at, 
    p_assignee, 
    coalesce(p_labels, array[]::text[]),
    auth.uid(),
    'pending'
  )
  returning id into v_id;

  return v_id;
exception 
  when undefined_table then
    -- Fallback: inform about missing tasks table
    raise exception 'tasks table not found; please ensure tasks schema exists';
  when others then
    -- Log error and re-raise
    raise exception 'task creation failed: %', SQLERRM;
end;
$$;

-- 4) RPC: save note with tenant isolation
create or replace function public.assistant_save_note_v1(
  p_title text,
  p_content text,
  p_lang text,
  p_citations jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.assistant_report_notes (
    tenant_id, 
    created_by, 
    title, 
    content, 
    lang, 
    citations
  )
  values (
    public.get_user_company_id(), 
    auth.uid(), 
    p_title, 
    p_content, 
    p_lang, 
    coalesce(p_citations, '[]'::jsonb)
  )
  returning id into v_id;
  
  return v_id;
end;
$$;

-- 5) RPC: log feedback with session tracking
create or replace function public.assistant_log_feedback_v1(
  p_session_id uuid,
  p_message_id uuid,
  p_question text,
  p_answer text,
  p_helpful boolean,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.assistant_feedback (
    tenant_id, 
    created_by, 
    session_id, 
    message_id, 
    question, 
    answer, 
    helpful, 
    reason
  )
  values (
    public.get_user_company_id(), 
    auth.uid(), 
    p_session_id, 
    p_message_id, 
    p_question, 
    p_answer, 
    p_helpful, 
    p_reason
  );
end;
$$;

-- 6) Grant necessary permissions
grant execute on function public.assistant_create_task_v1(text, text, text, timestamptz, uuid, text[]) to authenticated;
grant execute on function public.assistant_save_note_v1(text, text, text, jsonb) to authenticated;
grant execute on function public.assistant_log_feedback_v1(uuid, uuid, text, text, boolean, text) to authenticated;

-- 7) Add useful indexes for performance
create index if not exists idx_assistant_feedback_helpful 
  on public.assistant_feedback(tenant_id, helpful, created_at desc);

create index if not exists idx_assistant_report_notes_lang
  on public.assistant_report_notes(tenant_id, lang, created_at desc);

-- 8) Add comments for documentation
comment on table public.assistant_feedback is 'Stores user feedback on assistant answers for quality improvement';
comment on table public.assistant_report_notes is 'Saved evidence-based answers with citations for future reference';
comment on function public.assistant_create_task_v1 is 'Creates a task from assistant interaction with proper tenant isolation';
comment on function public.assistant_save_note_v1 is 'Saves an assistant answer as a report note with citations';
comment on function public.assistant_log_feedback_v1 is 'Logs user feedback on assistant answer quality';