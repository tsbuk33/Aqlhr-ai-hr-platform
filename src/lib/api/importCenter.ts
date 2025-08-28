import { supabase } from '@/integrations/supabase/client';

export async function listImportJobs(params: { status?: string; mode?: string; limit?: number; offset?: number } = {}) {
  const { status, mode, limit = 50, offset = 0 } = params;
  const { data, error } = await supabase.rpc('import_jobs_list_v1', {
    p_status: status ?? null,
    p_mode: mode ?? null,
    p_limit: limit,
    p_offset: offset
  });
  if (error) throw error;
  return data as Array<{
    id: string; mode: string; status: string;
    total_rows: number; processed_rows: number; success_rows: number; failed_rows: number;
    created_at: string; finished_at: string | null;
  }>;
}

export async function getImportRows(jobId: string, opts: { onlyErrors?: boolean; limit?: number; offset?: number } = {}) {
  const { onlyErrors = false, limit = 500, offset = 0 } = opts;
  const { data, error } = await supabase.rpc('import_rows_by_job_v1', {
    p_job: jobId, p_only_errors: onlyErrors, p_limit: limit, p_offset: offset
  });
  if (error) throw error;
  return data as Array<{ id: string; row_index: number; raw: any; normalized: any; error: string | null; created_at: string }>;
}

export async function retryImportJob(jobId: string, rowIds?: string[]) {
  const tok = await token();
  const resp = await supabase.functions.invoke('bulk-import-retry-v1', {
    body: { job_id: jobId, row_ids: rowIds && rowIds.length ? rowIds : undefined }
  });
  
  if (resp.error) {
    throw new Error(resp.error.message || 'Retry failed');
  }
  
  return resp.data;
}

export function buildCsv(rows: Array<{ row_index: number; raw: any; error: string | null }>) {
  const cols = new Set<string>();
  for (const r of rows) Object.keys(r.raw || {}).forEach(k => cols.add(k));
  const header = ['row_index', ...Array.from(cols), 'error'];
  const lines = [header.join(',')];
  for (const r of rows) {
    const fields = [String(r.row_index), ...Array.from(cols).map(k => csvSafe(r.raw?.[k])), csvSafe(r.error ?? '')];
    lines.push(fields.join(','));
  }
  return lines.join('\n');
}

function csvSafe(v: any) {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

async function token() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}