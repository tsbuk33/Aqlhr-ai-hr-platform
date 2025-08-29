-- Policy Risk Assessments Table
-- Stores results from policy risk analysis for audit trails and trending

create table if not exists public.policy_risk_assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  lang text not null check (lang in ('en','ar')),
  policy_doc_id uuid references public.documents(id) on delete set null,
  title text,
  scores jsonb not null,
  mitigations jsonb not null,
  citations jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add indexes for performance
create index if not exists policy_risk_assessments_company_id_idx 
  on public.policy_risk_assessments(company_id);

create index if not exists policy_risk_assessments_created_at_idx 
  on public.policy_risk_assessments(created_at desc);

create index if not exists policy_risk_assessments_policy_doc_id_idx 
  on public.policy_risk_assessments(policy_doc_id);

-- Enable Row Level Security
alter table public.policy_risk_assessments enable row level security;

-- RLS Policies - tenant isolation
create policy "tenant_read_policy_risk_assessments"
on public.policy_risk_assessments
for select
using (company_id = public.get_user_company_id());

create policy "tenant_insert_policy_risk_assessments"
on public.policy_risk_assessments
for insert
with check (company_id = public.get_user_company_id());

create policy "tenant_update_policy_risk_assessments"
on public.policy_risk_assessments
for update
using (company_id = public.get_user_company_id())
with check (company_id = public.get_user_company_id());

create policy "tenant_delete_policy_risk_assessments"
on public.policy_risk_assessments
for delete
using (company_id = public.get_user_company_id());

-- Updated timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger policy_risk_assessments_updated_at
  before update on public.policy_risk_assessments
  for each row
  execute function public.handle_updated_at();

-- Grant permissions
grant select, insert, update, delete on public.policy_risk_assessments to authenticated;
grant usage on sequence policy_risk_assessments_id_seq to authenticated;

-- Add comments for documentation
comment on table public.policy_risk_assessments is 'Stores policy risk analysis results with RLS tenant isolation';
comment on column public.policy_risk_assessments.scores is 'JSONB containing compliance, business, and implementation risk scores with confidence levels';
comment on column public.policy_risk_assessments.mitigations is 'JSONB array of mitigation strategies with impact/effort ratings';
comment on column public.policy_risk_assessments.citations is 'JSONB array of RAG citations with document references and similarity scores';