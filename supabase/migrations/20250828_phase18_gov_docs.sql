-- Phase 18: gov documents, extractions, adapter status (RLS-safe)

-- 1) Base documents metadata (non-PII; scoped by tenant)
create table if not exists public.gov_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  portal text not null, -- 'QIWA' | 'GOSI' | 'Absher' | ...
  context text not null default 'gov',
  doc_type text,
  storage_bucket text not null,
  storage_path text not null,
  ref_id text,
  expires_on date,
  notes text,
  uploaded_by uuid,
  uploaded_at timestamptz default now()
);
alter table public.gov_documents enable row level security;

drop policy if exists "gov_documents_tenant_rw" on public.gov_documents;
create policy "gov_documents_tenant_rw" on public.gov_documents
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

create index if not exists idx_gov_docs_tenant_portal on public.gov_documents(tenant_id, portal);
create index if not exists idx_gov_docs_expiry on public.gov_documents(expires_on);

-- 2) AI OCR/Parse results linked to documents
create table if not exists public.gov_document_extractions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  doc_id uuid not null references public.gov_documents(id) on delete cascade,
  provider text, -- 'openai' | 'genspark' | 'manus' | 'gemini' | 'tesseract'
  language text, -- 'ar' | 'en' | 'mixed'
  ocr_text text,
  ai_json jsonb, -- structured fields {name, iqama, permit_no, ...}
  quality numeric, -- 0..1
  extracted_at timestamptz default now()
);
alter table public.gov_document_extractions enable row level security;

drop policy if exists "gov_doc_extr_tenant_rw" on public.gov_document_extractions;
create policy "gov_doc_extr_tenant_rw" on public.gov_document_extractions
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

create index if not exists idx_gov_doc_extr_doc on public.gov_document_extractions(doc_id);
create index if not exists idx_gov_doc_extr_tenant on public.gov_document_extractions(tenant_id);

-- 3) Live adapter status (drives uploader visibility)
create table if not exists public.gov_adapter_status (
  tenant_id uuid not null,
  portal text not null,
  status text not null check (status in ('ok','degraded','down','unknown')),
  last_checked timestamptz default now(),
  details text,
  primary key (tenant_id, portal)
);
alter table public.gov_adapter_status enable row level security;

drop policy if exists "gov_adapter_status_tenant_rw" on public.gov_adapter_status;
create policy "gov_adapter_status_tenant_rw" on public.gov_adapter_status
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

create index if not exists idx_gov_adapter_status_tenant on public.gov_adapter_status(tenant_id, portal);

-- Optional helper (read-only)
create or replace function public.gov_adapter_status_get(p_tenant uuid, p_portal text)
returns public.gov_adapter_status
language sql
stable
set search_path = public
as $$
  select * from public.gov_adapter_status
  where tenant_id = p_tenant and portal = p_portal
  limit 1
$$;