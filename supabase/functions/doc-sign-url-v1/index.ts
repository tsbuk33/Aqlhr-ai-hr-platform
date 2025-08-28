// Deno Edge: sign a citation's storage file after tenant check via RLS
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve( async (req) => {
  try {
    if (req.method !== 'POST') return j({ ok:false, error:'method_not_allowed' }, 405);
    const auth = req.headers.get('authorization') || undefined;
    const user = createClient(URL, ANON, { global: { headers: auth ? { Authorization: auth } : {} }});
    const admin = createClient(URL, SERVICE);

    const { doc_id, expires = 600 } = await req.json();
    if (!doc_id) return j({ ok:false, error:'missing_doc_id' }, 400);

    // RLS check: select corpus row through user client
    const { data, error } = await user
      .from('doc_corpus')
      .select('id, storage_bucket, storage_path')
      .eq('id', doc_id)
      .single();
    if (error || !data) return j({ ok:false, error: 'doc_not_found_or_forbidden' }, 404);

    // Admin signing
    const r = await admin.storage.from(data.storage_bucket).createSignedUrl(data.storage_path, expires);
    if (r.error) return j({ ok:false, error:r.error.message }, 500);

    return j({ ok:true, url: r.data.signedUrl });
  } catch(e:any) {
    return j({ ok:false, error: String(e?.message || e) }, 500);
  }
});

function j(o:any, s=200){ return new Response(JSON.stringify(o), { status:s, headers:{ 'Content-Type':'application/json' }}) }