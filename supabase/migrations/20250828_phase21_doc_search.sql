-- Phase 21: Semantic Document Search (RAG)
-- Requirements: pgvector extension already enabled elsewhere; keep for idempotency
create extension if not exists "vector";

-- 1) Document catalog (universal across gov/hr/manual/import)
create table if not exists public.doc_corpus (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  storage_bucket text not null,
  storage_path   text not null,
  source text check (source in ('gov','hr','import','manual')) default 'manual',
  portal text null,                             -- e.g., QIWA, GOSI, Absher
  doc_type text null,                           -- e.g., iqama, contract, letter
  title text null,
  mime_type text null,
  size_bytes integer null,
  storage_etag text null,
  sha256 text null,
  language text null,                           -- 'ar'|'en'|...
  created_by uuid null,
  created_at timestamptz default now(),
  unique (tenant_id, storage_bucket, storage_path)
);

-- 2) Chunk table with embeddings
create table if not exists public.doc_chunks (
  id bigserial primary key,
  doc_id uuid not null references public.doc_corpus(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  token_count int null,
  embedding vector(1536) null,                  -- 1536 matches OpenAI text-embedding-3-* (and many providers)
  created_at timestamptz default now(),
  unique (doc_id, chunk_index)
);

-- 3) Index for ANN search
create index if not exists idx_doc_chunks_embedding
  on public.doc_chunks
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- 4) RLS
alter table public.doc_corpus enable row level security;
alter table public.doc_chunks enable row level security;

drop policy if exists "doc_corpus_tenant_rw" on public.doc_corpus;
create policy "doc_corpus_tenant_rw" on public.doc_corpus
  for all using (tenant_id = public.get_user_company_id())
  with check (tenant_id = public.get_user_company_id());

drop policy if exists "doc_chunks_tenant_rw" on public.doc_chunks;
create policy "doc_chunks_tenant_rw" on public.doc_chunks
  for all using (
    exists (
      select 1 from public.doc_corpus c
      where c.id = doc_id and c.tenant_id = public.get_user_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.doc_corpus c
      where c.id = doc_id and c.tenant_id = public.get_user_company_id()
    )
  );

-- 5) RPC: Search by embedding (client/edge supplies embedding as float8[])
create or replace function public.doc_semantic_search_v1(
  p_embedding double precision[],
  p_top_k int default 8,
  p_portal text default null,   -- filter
  p_source text default null    -- 'gov'|'hr'|'import'|'manual'
)
returns table (
  doc_id uuid,
  storage_bucket text,
  storage_path text,
  title text,
  portal text,
  doc_type text,
  snippet text,
  score numeric
)
language sql
security definer
set search_path = public
as $$
  with q as (select (p_embedding)::vector(1536) as e)
  select
    c.id as doc_id,
    c.storage_bucket,
    c.storage_path,
    coalesce(c.title, c.storage_path) as title,
    c.portal,
    c.doc_type,
    substr(ch.content, 1, 320) as snippet,
    (1 - (ch.embedding <=> (select e from q)))::numeric as score
  from public.doc_chunks ch
  join public.doc_corpus c on c.id = ch.doc_id
  where c.tenant_id = public.get_user_company_id()
    and ch.embedding is not null
    and (p_portal is null or c.portal = p_portal)
    and (p_source is null or c.source = p_source)
  order by ch.embedding <=> (select e from q)
  limit coalesce(p_top_k, 8);
$$;

-- 6) RPC: recent docs (for UI)
create or replace function public.doc_recent_v1(p_limit int default 20)
returns table (
  doc_id uuid, storage_bucket text, storage_path text, title text, portal text, doc_type text, created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select c.id, c.storage_bucket, c.storage_path, coalesce(c.title, c.storage_path), c.portal, c.doc_type, c.created_at
  from public.doc_corpus c
  where c.tenant_id = public.get_user_company_id()
  order by c.created_at desc
  limit coalesce(p_limit, 20);
$$;

-- 7) Realtime (optional helpful for ingestion progress)
alter publication supabase_realtime add table public.doc_corpus;
alter publication supabase_realtime add table public.doc_chunks;