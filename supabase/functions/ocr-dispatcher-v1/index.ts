// Deno Edge: OCR dispatcher for queued docs.
// POST { batch?: number, provider?: 'azure'|'google'|'openai'|'aws'|'tesseract' }
// Requires SERVICE_ROLE for storage signed URLs; respects tenant via row data.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Provider secrets (optional; choose one you have)
const AZURE_VISION_ENDPOINT = Deno.env.get('AZURE_VISION_ENDPOINT'); // e.g., https://<res>.cognitiveservices.azure.com
const AZURE_VISION_KEY = Deno.env.get('AZURE_VISION_KEY');
const GOOGLE_VISION_API_KEY = Deno.env.get('GOOGLE_VISION_API_KEY');
// OPENAI (vision) optional for images pages → text fallback
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const DEFAULT_PROVIDER = Deno.env.get('DEFAULT_OCR_PROVIDER') ?? 'azure';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return j({ ok:false, error:'method_not_allowed' }, 405);

    const admin = createClient(URL, SERVICE);
    const { batch = 3, provider } = await safeJson(req);

    // Fetch jobs
    const { data: jobs, error } = await admin
      .from('doc_ocr_queue')
      .select('*')
      .eq('status','queued')
      .order('created_at', { ascending: true })
      .limit(Math.max(1, Math.min(10, batch)));

    if (error) return j({ ok:false, error: error.message }, 500);
    if (!jobs?.length) return j({ ok:true, processed: 0, note: 'no_queued_jobs' });

    const results: any[] = [];
    for (const job of jobs) {
      const res = await processJob(admin, job, provider ?? DEFAULT_PROVIDER);
      results.push({ id: job.id, ...res });
    }

    return j({ ok:true, processed: results.length, results });
  } catch (e:any) {
    return j({ ok:false, error: String(e?.message || e) }, 500);
  }
});

function j(o:any, s=200){ return new Response(JSON.stringify(o), { status:s, headers:{'Content-Type':'application/json'} }) }
async function safeJson(req: Request){ try{ return await req.json() }catch{ return {} } }

async function processJob(admin: any, job: any, provider: string) {
  const start = Date.now();
  // Mark processing
  await admin.from('doc_ocr_queue').update({ status:'processing', attempts: job.attempts + 1, updated_at: new Date().toISOString() }).eq('id', job.id);

  try {
    // Signed URL
    const s = await admin.storage.from(job.storage_bucket).createSignedUrl(job.storage_path, 900);
    if (s.error) throw new Error('signed_url_failed: ' + s.error.message);
    const fileUrl = s.data.signedUrl as string;

    // Extract text
    const text = await extractWithProvider(provider, fileUrl, job);
    if (!text || text.trim().length === 0) throw new Error('ocr_empty_text');

    // Language detect
    const { data: langRow, error: langErr } = await admin.rpc('detect_lang_simple', { p_text: text }).single();
    const lang = langRow ?? null; // function returns scalar text via .single()

    // Chunk + embed
    const chunks = chunkText(text, 1200, 200);
    const embeds = await embedBatch(chunks);
    // Insert chunks
    const rows = chunks.map((content, i) => ({ doc_id: job.doc_id, chunk_index: i, content, embedding: embeds[i] as any }));
    // wipe old chunks if any (safe): optional
    await admin.from('doc_chunks').delete().eq('doc_id', job.doc_id);
    // bulk insert
    for (let i=0;i<rows.length;i+=200) {
      const slice = rows.slice(i, i+200);
      const ins = await admin.from('doc_chunks').insert(slice);
      if (ins.error) throw new Error('chunks_insert_failed: ' + ins.error.message);
    }

    // update corpus language if null
    await admin.from('doc_corpus').update({ language: lang }).eq('id', job.doc_id);

    // mark done
    await admin.from('doc_ocr_queue').update({ status:'done', last_error: null, updated_at: new Date().toISOString() }).eq('id', job.id);
    return { ok:true, ms: Date.now() - start, chunks: chunks.length, provider };
  } catch (e:any) {
    await admin.from('doc_ocr_queue').update({ status:'error', last_error: String(e?.message || e), updated_at: new Date().toISOString() }).eq('id', job.id);
    return { ok:false, error: String(e?.message || e), provider };
  }
}

function chunkText(src: string, size=1200, overlap=200){
  const out: string[] = [];
  const s = src.replace(/\r/g,'').split(/\n{2,}/).join('\n');
  for (let i=0;i<s.length;i+= (size - overlap)) out.push(s.slice(i, i+size));
  return out.filter(t => t.trim().length>0);
}

async function embedBatch(texts: string[]){
  // Use the existing orchestrator from Phase 21 for embeddings (OpenAI/Genspark/Manus)
  const r = await fetch(`${URL}/functions/v1/ai-orchestrator`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${SERVICE}` },
    body: JSON.stringify({ op:'embedding.batch', input: texts })
  });
  if (!r.ok) throw new Error('embed_failed: ' + await r.text());
  const jr = await r.json();
  const vecs = jr.vectors || jr.data;
  if (!Array.isArray(vecs) || vecs.length !== texts.length) throw new Error('embed_mismatch');
  return vecs;
}

async function extractWithProvider(provider: string, fileUrl: string, job: any): Promise<string> {
  const mime = (job?.storage_path || '').toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/*';

  if (provider === 'azure') {
    if (!AZURE_VISION_ENDPOINT || !AZURE_VISION_KEY) throw new Error('azure_not_configured');
    // Azure Read 3.x
    const submit = await fetch(`${AZURE_VISION_ENDPOINT}/vision/v3.2/read/analyze`, {
      method:'POST',
      headers: { 'Ocp-Apim-Subscription-Key': AZURE_VISION_KEY, 'Content-Type':'application/json' },
      body: JSON.stringify({ url: fileUrl })
    });
    if (!submit.ok) throw new Error('azure_submit_failed: ' + await submit.text());
    const opLoc = submit.headers.get('operation-location');
    if (!opLoc) throw new Error('azure_missing_operation_location');

    // poll
    for (let i=0;i<30;i++){
      await sleep(2000);
      const st = await fetch(opLoc, { headers: { 'Ocp-Apim-Subscription-Key': AZURE_VISION_KEY }});
      if (!st.ok) throw new Error('azure_poll_failed: ' + await st.text());
      const jr = await st.json();
      const status = jr.status || jr.analyzeResult?.status || jr.status?.toLowerCase();
      if (status === 'succeeded') {
        const lines: string[] = [];
        const pages = jr.analyzeResult?.readResults || jr.analyzeResult?.pages || [];
        for (const p of pages) {
          const pls = p.lines || p.lines ?? [];
          for (const l of pls) lines.push(l.text || '');
        }
        return lines.join('\n');
      }
      if (status === 'failed') throw new Error('azure_failed');
    }
    throw new Error('azure_timeout');
  }

  if (provider === 'google') {
    if (!GOOGLE_VISION_API_KEY) throw new Error('google_not_configured');
    const r = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`, {
      method:'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { source: { imageUri: fileUrl } },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
        }]
      })
    });
    if (!r.ok) throw new Error('google_failed: ' + await r.text());
    const jr = await r.json();
    const text = jr?.responses?.[0]?.fullTextAnnotation?.text || '';
    return text;
  }

  if (provider === 'openai') {
    if (!OPENAI_API_KEY) throw new Error('openai_not_configured');
    // Best-effort: instruct vision model to read the document
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role:'system', content:'You are an OCR assistant. Extract the visible text content from the provided document image or PDF page. Return plain text only.'},
          { role:'user', content:[
            { type:'text', text:'Extract all text as UTF-8 plain text.'},
            { type:'image_url', image_url: { url: fileUrl } }
          ]}
        ],
        temperature: 0
      })
    });
    if (!r.ok) throw new Error('openai_vision_failed: ' + await r.text());
    const jr = await r.json();
    const text = jr?.choices?.[0]?.message?.content || '';
    return text;
  }

  // default: not configured
  throw new Error('provider_not_configured');
}

function sleep(ms:number){ return new Promise(res => setTimeout(res, ms)); }