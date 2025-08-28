import { useMutation, useQuery } from '@tanstack/react-query';
import { recentDocs, semanticSearch, signedUrlForDocId } from '@/lib/api/semanticDocs';

export function useRecentDocs() {
  return useQuery({ queryKey: ['recentDocs'], queryFn: () => recentDocs(20) });
}

export function useDocSearch() {
  return useMutation({
    mutationFn: (args: { q: string; top_k?: number; portal?: string|null; source?: 'gov'|'hr'|'import'|'manual'|null; with_urls?: boolean }) =>
      semanticSearch({ ...args }),
  });
}

export async function getSignedUrl(doc_id: string) {
  const r = await signedUrlForDocId(doc_id);
  if (!r?.ok) throw new Error(r?.error || 'signed_url_failed');
  return r.url as string;
}