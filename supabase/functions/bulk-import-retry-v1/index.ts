// Deno Edge Function: retry errored rows for a given import job
// POST { job_id: string, row_ids?: string[] }  (optional subset)
// Auth: user JWT; we verify tenant & job ownership, then use service role for upserts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
    const auth = req.headers.get('Authorization') || '';
    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: auth } } });
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { job_id, row_ids } = await req.json();
    if (!job_id) return json({ ok: false, error: 'missing_job_id' }, 400);

    // Resolve tenant by job & current user
    const job = await admin.from('import_jobs')
      .select('id, tenant_id, mode, status, total_rows, processed_rows, success_rows, failed_rows')
      .eq('id', job_id).single();
    if (job.error) return json({ ok: false, error: 'job_not_found' }, 404);

    // Verify tenant match using current user context
    const { data: tid } = await userClient.rpc('get_user_company_id');
    if (!tid || tid !== job.data.tenant_id) return json({ ok: false, error: 'forbidden' }, 403);

    // Fetch errored rows (or subset)
    let q = admin.from('import_rows')
      .select('id, row_index, raw, normalized')
      .eq('job_id', job_id)
      .not('error', 'is', null)
      .order('row_index', { ascending: true });

    if (Array.isArray(row_ids) && row_ids.length) q = q.in('id', row_ids);

    const rows = await q;
    if (rows.error) return json({ ok: false, error: 'fetch_rows_failed', details: rows.error.message }, 500);
    if (!rows.data?.length) return json({ ok: true, retried: 0, success: 0, failed: 0 });

    // Normalize using Phase 19 logic (inline minimal)
    const mode = job.data.mode as 'employees' | 'gov';
    let success = 0, failed = 0;

    for (const r of rows.data) {
      const raw = r.raw || {};
      const n = mode === 'employees' ? normalizeEmployee(raw, job.data.tenant_id)
                                     : normalizeGov(raw, job.data.tenant_id);
      if (!n.ok) {
        await admin.from('import_rows').update({ error: n.err }).eq('id', r.id);
        failed++; continue;
      }
      if (mode === 'employees') {
        const up = await upsertEmployees(admin, [n.norm]);
        if (up.error) { failed++; await admin.from('import_rows').update({ error: up.error.message }).eq('id', r.id); }
        else { success++; await admin.from('import_rows').update({ error: null }).eq('id', r.id); }
      } else {
        const ins = await admin.from('gov_documents').insert(n.norm).select('id').single();
        if (ins.error) { failed++; await admin.from('import_rows').update({ error: ins.error.message }).eq('id', r.id); }
        else { success++; await admin.from('import_rows').update({ error: null, inserted_ids: JSON.stringify([ins.data.id]) }).eq('id', r.id); }
      }
    }

    // Update job counters
    const upd = await admin.from('import_jobs').update({
      processed_rows: (job.data.processed_rows ?? 0) + (success + failed),
      success_rows:   (job.data.success_rows   ?? 0) + success,
      failed_rows:    Math.max(0, (job.data.failed_rows ?? 0) - success) // we decreased failures by those succeeded
    }).eq('id', job_id);

    if (upd.error) return json({ ok: true, retried: rows.data.length, success, failed, warn: 'job_counters_update_failed' });

    return json({ ok: true, retried: rows.data.length, success, failed });
  } catch (e) {
    return json({ ok: false, error: 'unexpected', details: String(e?.message || e) }, 500);
  }
});

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

function normalizeEmployee(raw: any, tenant: string) {
  const name = (raw.name ?? raw.Name ?? raw.full_name ?? '').toString().trim();
  const iqama = (raw.iqama ?? raw.Iqama ?? raw.residency ?? '').toString().trim();
  const code  = (raw.employee_code ?? raw.EmployeeCode ?? '').toString().trim();
  if (!name) return { ok: false, err: 'missing_name' };
  if (!iqama && !code) return { ok: false, err: 'missing_iqama_or_employee_code' };
  const norm: any = { company_id: tenant, full_name: name };
  if (iqama) norm.iqama = iqama;
  if (code)  norm.employee_code = code;
  return { ok: true, norm };
}
function normalizeGov(raw: any, tenant: string) {
  const bucket = (raw.storage_bucket ?? raw.bucket ?? '').toString().trim();
  const path   = (raw.storage_path   ?? raw.path   ?? '').toString().trim();
  if (!bucket || !path) return { ok: false, err: 'missing_storage_bucket_or_path' };
  const portal   = (raw.portal ?? 'QIWA').toString().trim();
  const doc_type = (raw.doc_type ?? null); const ref_id = (raw.ref_id ?? null);
  const expires  = raw.expires_on ? new Date(raw.expires_on) : null;
  return {
    ok: true,
    norm: {
      tenant_id: tenant, context: 'gov', portal, doc_type,
      storage_bucket: bucket, storage_path: path,
      ref_id, expires_on: expires && !isNaN(expires.getTime()) ? expires.toISOString().slice(0,10) : null
    }
  };
}
async function upsertEmployees(client: any, rows: any[]) {
  const wIqama = rows.filter(r => r.iqama);
  const wCode  = rows.filter(r => !r.iqama && r.employee_code);
  if (!wIqama.length && !wCode.length) return { error: { message: 'no_keys' } };
  if (wIqama.length) {
    const { error } = await client.from('hr_employees')
      .upsert(wIqama, { onConflict: 'iqama', ignoreDuplicates: false, defaultToNull: true });
    if (error) return { error };
  }
  if (wCode.length) {
    const { error } = await client.from('hr_employees')
      .upsert(wCode, { onConflict: 'employee_code', ignoreDuplicates: false, defaultToNull: true });
    if (error) return { error };
  }
  return { error: null };
}