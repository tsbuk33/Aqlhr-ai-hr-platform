// Deno Edge: RAG answer with inline citations; bilingual; SSE stream.
// Flow: embed question -> RPC KNN -> build context -> stream LLM via orchestrator -> pass through tokens
// and emit `event: citations` first so client can render sources immediately.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ORCH_URL = `${URL}/functions/v1/ai-orchestrator`;

type SearchHit = {
  doc_id: string; chunk_index: number; content: string; distance: number;
  title: string | null; portal: string | null; doc_type: string | null;
  storage_bucket: string; storage_path: string; created_at: string;
};

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return res({ ok:false, error:'method_not_allowed' }, 405);

    const auth = req.headers.get('authorization') || undefined;
    const user = createClient(URL, ANON, { global: { headers: auth ? { Authorization: auth } : {} }});

    const wantsStream = req.headers.get('accept')?.includes('text/event-stream') ||
                        (await safeJsonPeek(req))?.stream === true;

    const body = await safeJson(req);
    const { question, lang = 'en', top_k = 6, filters = {} } = body || {};
    if (!question || typeof question !== 'string') return res({ ok:false, error:'missing_question' }, 400);

    // 1) Get embedding from orchestrator (cost-intelligent, unified)
    const embedR = await fetch(ORCH_URL, {
      method:'POST', headers: { 'Content-Type':'application/json', ...(auth ? { Authorization: auth } : {}) },
      body: JSON.stringify({ op:'embedding', input: question })
    });
    if (!embedR.ok) return res({ ok:false, error:'embed_failed', detail: await embedR.text() }, 500);
    const embedJ = await embedR.json();
    const queryVec: number[] = embedJ.vector || embedJ.data;
    if (!Array.isArray(queryVec)) return res({ ok:false, error:'embed_vector_missing' }, 500);

    // 2) RPC KNN search
    const { data: hits, error: rpcErr } = await user.rpc('doc_search_knn_v1', {
      p_query_embedding: queryVec,
      p_top_k: top_k,
      p_portal: filters.portal ?? null,
      p_doc_type: filters.doc_type ?? null,
      p_since: filters.since ?? null,
      p_until: filters.until ?? null
    }) as unknown as { data: SearchHit[], error: any };

    if (rpcErr) return res({ ok:false, error:'search_failed', detail: rpcErr.message }, 500);

    // 3) Build context (dedupe by doc, keep best chunk per doc)
    const byDoc = new Map<string, SearchHit>();
    for (const h of (hits || [])) {
      if (!byDoc.has(h.doc_id)) byDoc.set(h.doc_id, h);
    }
    const top = Array.from(byDoc.values()).slice(0, Math.max(1, Math.min(5, top_k)));

    // 4) Citations payload
    const citations = top.map((h, i) => ({
      n: i+1,
      doc_id: h.doc_id,
      title: h.title || h.storage_path.split('/').pop() || 'Document',
      portal: h.portal,
      doc_type: h.doc_type,
      created_at: h.created_at,
      storage_bucket: h.storage_bucket,
      storage_path: h.storage_path
    }));

    // 5) Compose bilingual system prompt
    const sys = (lang === 'ar')
      ? 'أنت مساعد موارد بشرية في السعودية. أجب بدقة وباختصار مستندًا فقط إلى المقتطفات الموثقة. أضف علامات استشهاد [^1] [^2] في نهاية الجمل ذات الصلة. إذا كانت المعلومات غير كافية، قل بوضوح "لا تتوفر بيانات كافية".'
      : 'You are a Saudi HR assistant. Answer accurately and concisely using ONLY the provided excerpts. Add inline citations like [^1] [^2] at the end of relevant sentences. If evidence is insufficient, say clearly: "Insufficient data."';

    // 6) Build context string
    const ctx = top.map((h, i) => `[^${i+1}] ${h.title || 'Document'} | portal=${h.portal ?? '-'} | type=${h.doc_type ?? '-'}\n${h.content}`).join('\n\n---\n\n');

    // 7) Streaming vs non-streaming
    if (wantsStream) {
      // SSE stream: send citations first, then pipe orchestrator SSE tokens
      const stream = new ReadableStream({
        async start(controller) {
          const enc = new TextEncoder();
          function send(evt: string, payload: any) {
            controller.enqueue(enc.encode(`event: ${evt}\n`));
            controller.enqueue(enc.encode(`data: ${JSON.stringify(payload)}\n\n`));
          }
          // citations
          send('citations', { citations });

          // call orchestrator chat.stream
          const r = await fetch(ORCH_URL, {
            method:'POST',
            headers: { 'Content-Type':'application/json', ...(auth ? { Authorization: auth } : {} ), 'Accept':'text/event-stream' },
            body: JSON.stringify({
              op: 'chat.stream',
              lang,
              system: sys,
              messages: [
                { role:'user', content: `${question}\n\nCONTEXT:\n${ctx}` }
              ],
              policy: { // light guardrails
                refuse_if_no_context: true
              }
            })
          });
          if (!r.ok || !r.body) {
            send('error', { message: await r.text() });
            controller.close();
            return;
          }
          const reader = r.body.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            controller.enqueue(value); // passthrough orchestrator SSE (token, done, cost, etc.)
          }
          controller.close();
        }
      });
      return new Response(stream, { status: 200, headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }});
    } else {
      // one-shot completion
      const r = await fetch(ORCH_URL, {
        method:'POST',
        headers: { 'Content-Type':'application/json', ...(auth ? { Authorization: auth } : {}) },
        body: JSON.stringify({
          op: 'chat',
          lang,
          system: sys,
          messages: [{ role:'user', content: `${question}\n\nCONTEXT:\n${ctx}` }]
        })
      });
      if (!r.ok) return res({ ok:false, error:'llm_failed', detail: await r.text() }, 500);
      const jr = await r.json();
      return res({ ok:true, answer: jr.text || jr.output || '', citations });
    }
  } catch (e:any) {
    return res({ ok:false, error: String(e?.message || e) }, 500);
  }
});

function res(o:any, s=200){ return new Response(JSON.stringify(o), { status:s, headers:{ 'Content-Type':'application/json' }}) }
async function safeJson(req: Request){ try{ return await req.json() } catch { return {} } }
async function safeJsonPeek(req: Request){ try{ const c = req.clone(); return await c.json() } catch { return {} } }