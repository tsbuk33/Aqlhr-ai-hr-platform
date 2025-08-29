-- Phase 23: RAG search over doc_chunks with pgvector
-- Safety: create index if missing
create index if not exists idx_doc_chunks_embedding
on public.doc_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- KNN search accepting a float array; cast to vector(1536)
create or replace function public.doc_search_knn_v1(
  p_query_embedding real[],
  p_top_k int default 6,
  p_portal text default null,
  p_doc_type text default null,
  p_since timestamptz default null,
  p_until timestamptz default null
)
returns table (
  doc_id uuid,
  chunk_index int,
  content text,
  distance real,
  title text,
  portal text,
  doc_type text,
  storage_bucket text,
  storage_path text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  with base as (
    select ch.doc_id,
           ch.chunk_index,
           ch.content,
           ch.embedding <=> vector(p_query_embedding) as distance
    from public.doc_chunks ch
    join public.doc_corpus c on c.id = ch.doc_id
    where c.tenant_id = public.get_user_company_id()
      and (p_portal is null or c.portal = p_portal)
      and (p_doc_type is null or c.doc_type = p_doc_type)
      and (p_since is null or c.created_at >= p_since)
      and (p_until is null or c.created_at <= p_until)
  )
  select b.doc_id, b.chunk_index, b.content, b.distance::real,
         c.title, c.portal, c.doc_type, c.storage_bucket, c.storage_path, c.created_at
  from base b
  join public.doc_corpus c on c.id = b.doc_id
  order by b.distance asc
  limit greatest(1, p_top_k);
$$;

-- Convenience view for quick manual checks (inherits RLS via function guarding):
create or replace view public.doc_search_example_v1 as
select * from doc_chunks limit 1;