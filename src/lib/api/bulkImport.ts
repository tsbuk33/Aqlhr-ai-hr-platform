import { supabase } from '@/integrations/supabase/client';

// Basic tenant ID retrieval - can be enhanced based on actual auth flow
export async function getTenantId(): Promise<string | null> {
  try {
    // Try to get current user and use their ID as tenant for now
    // This should be replaced with actual tenant resolution logic
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function bulkImportEmployees(rows: any[], { dryRun = false } = {}) {
  const tenant = await getTenantId();
  
  const { data, error } = await supabase.functions.invoke('bulk-excel-import-v1', {
    body: { mode: 'employees', rows, tenant_id: tenant, dryRun }
  });
  
  if (error) {
    throw new Error(error.message || 'Import failed');
  }
  
  return data;
}

export async function bulkImportGovDocs(rows: any[], { dryRun = false } = {}) {
  const tenant = await getTenantId();
  
  const { data, error } = await supabase.functions.invoke('bulk-excel-import-v1', {
    body: { mode: 'gov', rows, tenant_id: tenant, dryRun }
  });
  
  if (error) {
    throw new Error(error.message || 'Import failed');
  }
  
  return data;
}

// Fetch import job status
export async function getImportJobStatus(jobId: string) {
  const { data, error } = await supabase
    .from('import_jobs')
    .select('*')
    .eq('id', jobId)
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Fetch import job rows with details
export async function getImportJobRows(jobId: string, { limit = 100, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('import_rows')
    .select('*')
    .eq('job_id', jobId)
    .order('row_index', { ascending: true })
    .range(offset, offset + limit - 1);
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}