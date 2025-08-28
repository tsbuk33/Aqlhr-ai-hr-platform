// Deno (Supabase Edge) - OCR + AI parse via Universal Orchestrator
// POST JSON: { tenant_id, doc_id, bucket, path, portal, lang?, providerHint? }
// Returns: { ok: true, text, fields, provider, quality }
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

interface ReqBody {
  tenant_id: string;
  doc_id: string;
  bucket: string;
  path: string;
  portal?: string;
  lang?: 'ar' | 'en';
  providerHint?: 'openai' | 'genspark' | 'manus' | 'gemini';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const ORCH_URL = Deno.env.get('AI_ORCHESTRATOR_URL') || 'https://your-edge-orchestrator/ai/orchestrate';
const ORCH_KEY = Deno.env.get('AI_ORCHESTRATOR_KEY') || '';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), { status: 405 });
    }
    const body = (await req.json()) as ReqBody;

    // 1) Get a signed URL to read file
    const { data: signed, error: signErr } = await supabase
      .storage.from(body.bucket)
      .createSignedUrl(body.path, 60 * 10); // 10 min

    if (signErr || !signed?.signedUrl) {
      return new Response(JSON.stringify({ ok: false, error: 'signed_url_failed', details: signErr?.message }), { status: 400 });
    }

    // 2) Download file as base64
    const fileResp = await fetch(signed.signedUrl);
    if (!fileResp.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'download_failed' }), { status: 400 });
    }
    const buf = new Uint8Array(await fileResp.arrayBuffer());
    const b64 = btoa(String.fromCharCode(...buf));

    // 3) Ask orchestrator to OCR + parse
    const orchReq = await fetch(ORCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ORCH_KEY ? { Authorization: `Bearer ${ORCH_KEY}` } : {}),
      },
      body: JSON.stringify({
        task: 'ocr_parse_gov_doc',
        prefer: body.providerHint || 'genspark', // cost-intelligent; you can reorder
        lang: body.lang || 'ar',
        input: { base64: b64, mime: guessMime(body.path), filename: body.path, portal: body.portal },
      }),
    });
    if (!orchReq.ok) {
      const errTxt = await orchReq.text();
      return new Response(JSON.stringify({ ok: false, error: 'orchestrator_failed', details: errTxt }), { status: 502 });
    }
    const orchJson = await orchReq.json() as any;
    const text = orchJson?.text || '';
    const fields = orchJson?.fields || {};
    const provider = orchJson?.provider || 'genspark';
    const quality = orchJson?.quality ?? null;

    // 4) Persist extraction
    const ins = await supabase.from('gov_document_extractions').insert({
      tenant_id: body.tenant_id,
      doc_id: body.doc_id,
      provider,
      language: body.lang || 'ar',
      ocr_text: text,
      ai_json: fields,
      quality,
    }).select('id').single();

    if (ins.error) {
      return new Response(JSON.stringify({ ok: false, error: 'db_insert_failed', details: ins.error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, text, fields, provider, quality }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'unexpected', details: String(e?.message || e) }), { status: 500 });
  }
});

function guessMime(p: string) {
  const ext = p.toLowerCase();
  if (ext.endsWith('.pdf')) return 'application/pdf';
  if (ext.endsWith('.png')) return 'image/png';
  if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}