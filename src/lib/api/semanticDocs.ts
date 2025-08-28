import { supabase } from '@/integrations/supabase/client';

async function token() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}

export async function ingestDocument(params: { bucket: string; path: string; source?: string; portal?: string; doc_type?: string; title?: string }) {
  const t = await token();
  const res = await fetch('/functions/v1/doc-ingest-v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function semanticSearch(params: { q: string; top_k?: number; portal?: string | null; source?: 'gov'|'hr'|'import'|'manual'|null; with_urls?: boolean }) {
  const t = await token();
  const res = await fetch('/functions/v1/doc-search-v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function signedUrlForDocId(doc_id: string) {
  const t = await token();
  const res = await fetch(`/functions/v1/doc-signed-url-v1?doc_id=${encodeURIComponent(doc_id)}`, {
    headers: { ...(t ? { Authorization: `Bearer ${t}` } : {}) }
  });
  return res.json();
}

export async function recentDocs(limit = 20) {
  // Fallback to mock data since doc_recent_v1 function doesn't exist
  return [] as Array<{ doc_id: string; storage_bucket: string; storage_path: string; title: string; portal: string|null; doc_type: string|null; created_at: string }>;
}