-- Phase 22: OCR pipeline (queue + helpers + security)
create type public.ocr_status as enum ('queued','processing','done','error');

create table if not exists public.doc_ocr_queue (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  doc_id uuid not null references public.doc_corpus(id) on delete cascade,
  storage_bucket text not null,
  storage_path   text not null,
  provider text default null,              -- 'azure' | 'google' | 'openai' | 'aws' | 'tesseract'
  status public.ocr_status not null default 'queued',
  attempts int not null default 0,
  last_error text null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- basic indexes
create index if not exists idx_ocr_queue_tenant_status on public.doc_ocr_queue(tenant_id, status, created_at);
create index if not exists idx_ocr_queue_doc on public.doc_ocr_queue(doc_id);

-- RLS
alter table public.doc_ocr_queue enable row level security;

drop policy if exists "ocr_queue_tenant_rw" on public.doc_ocr_queue;
create policy "ocr_queue_tenant_rw" on public.doc_ocr_queue
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

-- helper: simple AR/EN language detection (heuristic)
create or replace function public.detect_lang_simple(p_text text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  ar_count int;
  en_count int;
begin
  if p_text is null or length(p_text)=0 then
    return null;
  end if;
  -- count Arabic letters
  select coalesce( sum( case when ch ~ '[\u0600-\u06FF]' then 1 else 0 end ), 0)
  into ar_count
  from regexp_split_to_table(p_text, '') ch;
  -- count ASCII letters
  select coalesce( sum( case when ch ~ '[A-Za-z]' then 1 else 0 end ), 0)
  into en_count
  from regexp_split_to_table(p_text, '') ch;

  if ar_count > en_count then return 'ar'; end if;
  if en_count > ar_count then return 'en'; end if;
  return null;
end;
$$;

-- RPC: enqueue OCR for a doc (idempotent)
create or replace function public.doc_enqueue_ocr_v1(p_doc_id uuid, p_provider text default null)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_row record;
  v_exists boolean;
begin
  select tenant_id, storage_bucket, storage_path into v_row
  from public.doc_corpus
  where id = p_doc_id and tenant_id = public.get_user_company_id();

  if not found then
    raise exception 'doc_not_found_or_forbidden';
  end if;

  select exists(select 1 from public.doc_ocr_queue where doc_id = p_doc_id and status in ('queued','processing'))
  into v_exists;
  if v_exists then return false; end if;

  insert into public.doc_ocr_queue(tenant_id, doc_id, storage_bucket, storage_path, provider, status)
  values (v_row.tenant_id, p_doc_id, v_row.storage_bucket, v_row.storage_path, p_provider, 'queued');

  return true;
end;
$$;

-- optional trigger: if a corpus row is inserted with likely scanned content, auto-enqueue
create or replace function public.doc_corpus_autoqueue_ocr()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.mime_type ilike 'application/pdf'
     or new.mime_type ilike 'image/%'
  then
    perform public.doc_enqueue_ocr_v1(new.id, null);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_doc_corpus_autoqueue_ocr on public.doc_corpus;
create trigger trg_doc_corpus_autoqueue_ocr
after insert on public.doc_corpus
for each row execute function public.doc_corpus_autoqueue_ocr();

-- admin view for UI
create or replace view public.doc_ocr_jobs_v1 as
select q.id, q.doc_id, q.status, q.attempts, q.last_error, q.created_at, q.updated_at,
       c.title, c.portal, c.doc_type, c.mime_type, c.storage_bucket, c.storage_path
from public.doc_ocr_queue q
join public.doc_corpus c on c.id = q.doc_id
where q.tenant_id = public.get_user_company_id();

-- realtime helpful
alter publication supabase_realtime add table public.doc_ocr_queue;