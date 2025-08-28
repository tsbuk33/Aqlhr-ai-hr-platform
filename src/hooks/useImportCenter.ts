import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { listImportJobs, getImportRows } from '@/lib/api/importCenter';

export function useImportJobs(filters?: { status?: string; mode?: string }) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['importJobs', filters?.status, filters?.mode],
    queryFn: () => listImportJobs(filters ?? {}),
    refetchInterval: 10_000
  });

  useEffect(() => {
    const channel = supabase
      .channel('import_jobs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'import_jobs' },
        () => qc.invalidateQueries({ queryKey: ['importJobs'] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return q;
}

export function useImportRows(jobId?: string, onlyErrors = false) {
  return useQuery({
    queryKey: ['importRows', jobId, onlyErrors],
    queryFn: () => jobId ? getImportRows(jobId, { onlyErrors }) : Promise.resolve([]),
    enabled: !!jobId
  });
}