// Deno (Supabase Edge) - bulk import (employees | gov)
// Body: { tenant_id?: string, mode: 'employees'|'gov', rows: any[], dryRun?: boolean }
// Auth: Bearer <supabase user JWT>; we verify tenant via userClient then use adminClient for upserts.
// For 'gov', rows must include storage_bucket & storage_path to satisfy NOT NULL.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type Mode = 'employees'|'gov';
interface ReqBody {
  tenant_id?: string;
  mode: Mode;
  rows: any[];
  dryRun?: boolean;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405);
    }
    const auth = req.headers.get('Authorization') || '';
    const body = await req.json() as ReqBody;
    if (!body?.mode || !Array.isArray(body.rows)) {
      return json({ ok: false, error: 'invalid_payload' }, 400);
    }

    // userClient with RLS and the caller's JWT (to discover tenant)
    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: auth } } });
    const tenant = await deriveTenant(userClient, body.tenant_id);
    if (!tenant) return json({ ok: false, error: 'tenant_resolve_failed' }, 401);

    // adminClient for privileged upserts after our tenant check
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Create job
    const job = await admin.from('import_jobs').insert({
      tenant_id: tenant, mode: body.mode, started_by: await getUserId(userClient), status: 'validated',
      total_rows: body.rows.length
    }).select('id').single();
    if (job.error) return json({ ok: false, error: 'job_create_failed', details: job.error.message }, 500);

    // Validate rows, normalize
    const normalized: { idx: number; raw: any; normalized?: any; error?: string }[] = [];
    for (let i = 0; i < body.rows.length; i++) {
      const raw = body.rows[i];
      if (body.mode === 'employees') {
        const { ok, norm, err } = normalizeEmployee(raw, tenant);
        normalized.push({ idx: i, raw, normalized: ok ? norm : undefined, error: err });
      } else {
        const { ok, norm, err } = normalizeGov(raw, tenant);
        normalized.push({ idx: i, raw, normalized: ok ? norm : undefined, error: err });
      }
    }

    // Persist row diagnostics
    const rowsPayload = normalized.map((r) => ({
      tenant_id: tenant,
      job_id: job.data.id,
      row_index: r.idx,
      raw: r.raw,
      normalized: r.normalized ?? null,
      error: r.error ?? null
    }));
    // Chunk insert to avoid payload limits
    await batchInsert(admin, 'import_rows', rowsPayload, 500);

    if (body.dryRun) {
      await admin.from('import_jobs').update({ status: 'validated' }).eq('id', job.data.id);
      return json({
        ok: true,
        job_id: job.data.id,
        dryRun: true,
        totals: {
          total: normalized.length,
          valid: normalized.filter(r => !r.error).length,
          invalid: normalized.filter(r => r.error).length
        }
      });
    }

    // Process: upserts
    let success = 0, failed = 0, processed = 0;

    if (body.mode === 'employees') {
      // Map to hr_employees minimal schema: company_id, name, iqama, nationality, gender, employee_code (optional)
      // Upsert by iqama if present; else by employee_code; else fail.
      const valids = normalized.filter(r => r.normalized);
      for (const chunk of chunker(valids, 300)) {
        const up = await upsertEmployees(admin, chunk.map(c => c.normalized));
        processed += chunk.length;
        if (up.error) {
          failed += chunk.length;
          await markChunkErrors(admin, job.data.id, chunk, up.error.message);
        } else {
          success += up.count ?? chunk.length;
          await markChunkInserted(admin, job.data.id, chunk);
        }
        await updateJob(admin, job.data.id, processed, success, failed, 'processing');
      }
    } else {
      // gov docs must include storage_bucket + storage_path per row (we keep Phase 18 integrity)
      const valids = normalized.filter(r => r.normalized);
      for (const chunk of chunker(valids, 300)) {
        const ins = await admin.from('gov_documents').insert(chunk.map(c => c.normalized)).select('id');
        processed += chunk.length;
        if (ins.error) {
          failed += chunk.length;
          await markChunkErrors(admin, job.data.id, chunk, ins.error.message);
        } else {
          success += ins.data?.length ?? chunk.length;
          await markChunkInserted(admin, job.data.id, chunk, ins.data?.map(d => d.id));
        }
        await updateJob(admin, job.data.id, processed, success, failed, 'processing');
      }
    }

    await admin.from('import_jobs').update({
      status: failed > 0 ? 'completed' : 'completed',
      processed_rows: processed,
      success_rows: success,
      failed_rows: failed,
      finished_at: new Date().toISOString()
    }).eq('id', job.data.id);

    return json({
      ok: true,
      job_id: job.data.id,
      totals: { total: normalized.length, processed, success, failed }
    });

  } catch (e) {
    return json({ ok: false, error: 'unexpected', details: String(e?.message || e) }, 500);
  }
});

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

async function deriveTenant(userClient: any, hinted?: string): Promise<string|null> {
  try {
    // Try to read tenant via SQL using auth.uid() context
    const { data, error } = await userClient.rpc('get_user_company_id');
    const t = data ?? null;
    if (hinted && t && hinted !== t) return null;
    return (hinted ?? t) || null;
  } catch {
    return hinted ?? null;
  }
}

async function getUserId(userClient: any): Promise<string|undefined> {
  try {
    const { data, error } = await userClient.auth.getUser();
    return data?.user?.id;
  } catch { return undefined; }
}

// Normalize employees
function normalizeEmployee(raw: any, tenant: string): { ok: boolean; norm?: any; err?: string } {
  const name = (raw.name ?? raw.Name ?? raw.full_name ?? '').toString().trim();
  const iqama = (raw.iqama ?? raw.Iqama ?? raw.residency ?? '').toString().trim();
  const empCode = (raw.employee_code ?? raw.EmployeeCode ?? '').toString().trim();
  const nationality = (raw.nationality ?? '').toString().trim();
  const gender = (raw.gender ?? '').toString().trim();
  if (!name) return { ok: false, err: 'missing_name' };
  if (!iqama && !empCode) return { ok: false, err: 'missing_iqama_or_employee_code' };

  const norm: any = {
    company_id: tenant, // hr_employees uses company_id (existing schema)
    full_name: name,
    nationality: nationality || null,
    gender: gender || null,
  };
  if (iqama) norm.iqama = iqama;
  if (empCode) norm.employee_code = empCode;

  return { ok: true, norm };
}

function normalizeGov(raw: any, tenant: string): { ok: boolean; norm?: any; err?: string } {
  const portal = (raw.portal ?? '').toString().trim() || 'QIWA';
  const doc_type = (raw.doc_type ?? '').toString().trim() || null;
  const ref_id = (raw.ref_id ?? '').toString().trim() || null;
  const expires_on = (raw.expires_on ?? '').toString().trim() || null;
  const notes = (raw.notes ?? '').toString().trim() || null;
  const bucket = (raw.storage_bucket ?? raw.bucket ?? '').toString().trim();
  const path = (raw.storage_path ?? raw.path ?? '').toString().trim();

  if (!bucket || !path) return { ok: false, err: 'missing_storage_bucket_or_path' };

  const norm = {
    tenant_id: tenant,
    portal,
    context: 'gov',
    doc_type,
    storage_bucket: bucket,
    storage_path: path,
    ref_id,
    expires_on: expires_on ? tryDate(expires_on) : null,
    notes
  };
  return { ok: true, norm };
}

function tryDate(s: string): string | null {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0,10);
}

async function batchInsert(client: any, table: string, rows: any[], size = 500) {
  for (const chunk of chunker(rows, size)) {
    const { error } = await client.from(table).insert(chunk);
    if (error) throw new Error(`insert_failed:${table}:${error.message}`);
  }
}

function* chunker<T>(arr: T[], size = 500) {
  for (let i = 0; i < arr.length; i += size) yield arr.slice(i, i + size);
}

async function upsertEmployees(client: any, rows: any[]) {
  // Prefer unique by iqama; fall back to employee_code if exists.
  const withIqama = rows.filter(r => r.iqama);
  const noIqama = rows.filter(r => !r.iqama && r.employee_code);

  const results: any = { error: null, count: 0 };
  if (withIqama.length) {
    const { error, count } = await client
      .from('hr_employees')
      .upsert(withIqama, { onConflict: 'iqama', ignoreDuplicates: false, defaultToNull: true })
      .select('id', { count: 'exact' });
    if (error) return { error, count: 0 };
    results.count += (count ?? withIqama.length);
  }
  if (noIqama.length) {
    const { error, count } = await client
      .from('hr_employees')
      .upsert(noIqama, { onConflict: 'employee_code', ignoreDuplicates: false, defaultToNull: true })
      .select('id', { count: 'exact' });
    if (error) return { error, count: results.count };
    results.count += (count ?? noIqama.length);
  }
  return results;
}

async function markChunkErrors(client: any, jobId: string, chunk: any[], reason: string) {
  for (const c of chunk) {
    await client.from('import_rows').update({ error: reason }).eq('job_id', jobId).eq('row_index', c.idx);
  }
}
async function markChunkInserted(client: any, jobId: string, chunk: any[], ids?: any[]) {
  // We mark as inserted without enumerating IDs for employees (upsert may not return per-row)
  for (let i = 0; i < chunk.length; i++) {
    await client.from('import_rows')
      .update({ error: null, inserted_ids: ids ? JSON.stringify([ids[i]]) : JSON.stringify([]) })
      .eq('job_id', jobId).eq('row_index', chunk[i].idx);
  }
}

async function updateJob(client: any, jobId: string, processed: number, success: number, failed: number, status: string) {
  await client.from('import_jobs').update({
    status,
    processed_rows: processed,
    success_rows: success,
    failed_rows: failed
  }).eq('id', jobId);
}