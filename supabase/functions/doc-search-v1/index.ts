// Deno Edge: Semantic search across doc_chunks with pgvector
// POST { q: string, top_k?: number, portal?: string, source?: 'gov'|'hr'|'import'|'manual', with_urls?: boolean }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const EMBED_PROVIDER = Deno.env.get('EMBED_PROVIDER') ?? 'openai';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return j({ ok:false, error:'method_not_allowed' }, 405);
    const auth = req.headers.get('Authorization') || '';
    const user = createClient(URL, ANON, { global: { headers: { Authorization: auth } } });

    const { q, top_k = 8, portal = null, source = null, with_urls = false } = await req.json();
    if (!q || !q.toString().trim()) return j({ ok:false, error:'missing_query' }, 400);

    const e = await embedOne(q.toString());
    if (!e.ok) return j({ ok:false, error:'embed_failed', details: e.error }, 502);

    // Use RLS via user client
    const { data, error } = await user.rpc('doc_semantic_search_v1', {
      p_embedding: e.vector,
      p_top_k: top_k,
      p_portal: portal,
      p_source: source
    });
    if (error) return j({ ok:false, error:'search_failed', details: error.message }, 500);

    if (with_urls) {
      const admin = createClient(URL, SERVICE);
      for (const r of (data || [])) {
        try {
          const s = await admin.storage.from(r.storage_bucket).createSignedUrl(r.storage_path, 600);
          r.signed_url = s?.data?.signedUrl ?? null;
        } catch(_) {}
      }
    }

    return j({ ok:true, results: data });
  } catch (e) {
    return j({ ok:false, error:'unexpected', details: String(e?.message || e) }, 500);
  }
});

function j(o:any, s=200){ return new Response(JSON.stringify(o), { status:s, headers:{'Content-Type':'application/json'} }) }

async function embedOne(text: string){
  try {
    if (EMBED_PROVIDER === 'openai' && OPENAI_API_KEY) {
      const r = await fetch('https://api.openai.com/v1/embeddings', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: text })
      });
      if (!r.ok) return { ok:false, error: await r.text() };
      const jr = await r.json();
      return { ok:true, vector: jr.data[0].embedding };
    }
    // Orchestrator fallback
    const r = await fetch(`${URL}/functions/v1/ai-orchestrator`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${SERVICE}` },
      body: JSON.stringify({ op:'embedding', input: text })
    });
    if (!r.ok) return { ok:false, error: await r.text() };
    const jr = await r.json();
    const vec = jr.vector || jr.embedding || jr.data;
    return { ok:true, vector: vec };
  } catch(e:any) {
    return { ok:false, error: String(e?.message || e) };
  }
}