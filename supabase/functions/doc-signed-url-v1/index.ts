// Deno Edge: Tenant-safe signed URL for a known doc (by doc_id) or (bucket,path)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
const URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    const auth = req.headers.get('Authorization') || '';
    const user = createClient(URL, ANON, { global: { headers: { Authorization: auth } } });
    const admin = createClient(URL, SERVICE);

    const u = new URL(req.url);
    const doc_id = u.searchParams.get('doc_id');
    let bucket = u.searchParams.get('bucket');
    let path   = u.searchParams.get('path');

    if (doc_id) {
      const { data, error } = await user.from('doc_corpus').select('storage_bucket,storage_path').eq('id', doc_id).single();
      if (error || !data) return j({ ok:false, error:'not_found' }, 404);
      bucket = data.storage_bucket; path = data.storage_path;
    }
    if (!bucket || !path) return j({ ok:false, error:'missing_params' }, 400);

    const signed = await admin.storage.from(bucket).createSignedUrl(path, 600);
    if (signed.error) return j({ ok:false, error: signed.error.message }, 500);
    return j({ ok:true, url: signed.data.signedUrl });
  } catch(e:any){
    return j({ ok:false, error:'unexpected', details: String(e?.message || e) }, 500);
  }
});

function j(o:any, s=200){ return new Response(JSON.stringify(o), { status:s, headers:{'Content-Type':'application/json'} }) }