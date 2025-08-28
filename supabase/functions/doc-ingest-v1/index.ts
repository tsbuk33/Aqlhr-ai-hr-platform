// Deno Edge: Ingest a storage object into doc_corpus + doc_chunks with embeddings
// POST { bucket, path, source?, portal?, doc_type?, title? }
// Auth: user JWT (tenant inferred via get_user_company_id)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY'); // optional; orchestrator fallback otherwise
const EMBED_PROVIDER = Deno.env.get('EMBED_PROVIDER') ?? 'openai'; // 'openai'|'genspark'|'manus'

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return j({ ok:false, error:'method_not_allowed' }, 405);
    const auth = req.headers.get('Authorization') || '';
    const user = createClient(URL, ANON, { global: { headers: { Authorization: auth } } });
    const admin = createClient(URL, SERVICE);

    const body = await req.json();
    const bucket = String(body.bucket || '').trim();
    const path   = String(body.path || '').trim();
    if (!bucket || !path) return j({ ok:false, error:'missing_bucket_or_path' }, 400);

    const { data: tenant_id, error: terr } = await user.rpc('get_user_company_id');
    if (terr || !tenant_id) return j({ ok:false, error:'tenant_resolve_failed' }, 403);

    // fetch object to detect mime & load text if feasible
    const dl = await admin.storage.from(bucket).download(path);
    if (dl.error) return j({ ok:false, error:'download_failed', details: dl.error.message }, 400);

    // Detect type
    const mime = dl.data.type || body.mime_type || 'application/octet-stream';

    // Try text extraction for common text/csv/json/markdown
    const buf = await dl.data.arrayBuffer();
    let text = '';
    if (mime.startsWith('text/') || /csv|json|markdown|md/i.test(mime)) {
      text = new TextDecoder('utf-8').decode(new Uint8Array(buf));
    } else if (/pdf/i.test(mime)) {
      // try delegating to existing ai-document-processor if present
      try {
        const r = await fetch(`${URL}/functions/v1/ai-document-processor`, {
          method:'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SERVICE}` },
          body: JSON.stringify({ bucket, path, op: 'extract_text' })
        });
        if (r.ok) {
          const jr = await r.json();
          text = (jr.text || '').toString();
        }
      } catch (_) { /* ignore */ }
    } else {
      // unsupported binary types: we'll handle after upsert
    }

    // Upsert corpus row first (needed for OCR enqueue)
    const up = await admin.from('doc_corpus').upsert({
      tenant_id, storage_bucket: bucket, storage_path: path,
      source: body.source ?? 'manual',
      portal: body.portal ?? null,
      doc_type: body.doc_type ?? null,
      title: body.title ?? null,
      mime_type: mime,
      size_bytes: (buf?.byteLength ?? null)
    }, { onConflict: 'tenant_id,storage_bucket,storage_path' }).select('id').single();

    if (up.error) return j({ ok:false, error:'catalog_upsert_failed', details: up.error.message }, 500);
    const doc_id = up.data.id as string;

    // If we had no text (binary/PDF without text), enqueue OCR and return
    if (!text || text.trim().length === 0) {
      await admin.rpc('doc_enqueue_ocr_v1', { p_doc_id: doc_id, p_provider: null });
      return j({ ok:true, queued:true, doc_id: doc_id, note:'ocr_enqueued' }, 202);
    }

    const chunks = chunkText(text, 1200, 200);
    if (!chunks.length) return j({ ok:false, error:'no_text_content' }, 400);

    // Embeddings
    const embeds = await embedBatch(chunks, { provider: EMBED_PROVIDER, openaiKey: OPENAI_API_KEY });
    if (!embeds.ok) return j({ ok:false, error:'embed_failed', details: embeds.error }, 502);

    // Insert chunks
    const rows = chunks.map((content, i) => ({
      doc_id, chunk_index: i, content, token_count: null, embedding: embeds.vectors![i] as any
    }));
    // Insert in batches to avoid payload limits
    const batchSize = 200;
    for (let i=0;i<rows.length;i+=batchSize){
      const slice = rows.slice(i, i+batchSize);
      const ins = await admin.from('doc_chunks').insert(slice);
      if (ins.error) return j({ ok:false, error:'chunks_insert_failed', details: ins.error.message }, 500);
    }

    return j({ ok:true, doc_id, chunks: chunks.length });
  } catch (e) {
    return j({ ok:false, error:'unexpected', details: String(e?.message || e) }, 500);
  }
});

function j(o:any, s=200){ return new Response(JSON.stringify(o), { status:s, headers:{'Content-Type':'application/json'} }) }

function chunkText(src: string, size=1200, overlap=200){
  const out: string[] = [];
  const s = src.replace(/\r/g,'').split(/\n{2,}/).join('\n'); // normalize
  for (let i=0;i<s.length;i+= (size - overlap)) out.push(s.slice(i, i+size));
  return out.filter(t => t.trim().length>0);
}

async function embedBatch(texts: string[], opts: { provider: string; openaiKey?: string; }) {
  try {
    if (opts.provider === 'openai' && opts.openaiKey) {
      // OpenAI embeddings
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${opts.openaiKey}` },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: texts })
      });
      if (!res.ok) return { ok:false, error: await res.text() };
      const jr = await res.json();
      const vecs = jr.data.map((d:any)=> d.embedding);
      return { ok:true, vectors: vecs };
    }
    // Fallback to your Universal AI Orchestrator (which already routes to Genspark/Manus/OpenAI)
    const r = await fetch(`${URL}/functions/v1/ai-orchestrator`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` },
      body: JSON.stringify({ op:'embedding.batch', input: texts })
    });
    if (!r.ok) return { ok:false, error: await r.text() };
    const jr = await r.json();
    const vecs = jr.vectors || jr.data || [];
    return { ok:true, vectors: vecs };
  } catch(e:any) {
    return { ok:false, error: String(e?.message || e) };
  }
}