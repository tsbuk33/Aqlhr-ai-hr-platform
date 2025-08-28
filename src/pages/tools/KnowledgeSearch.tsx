import React from 'react';
import { useDocSearch, useRecentDocs, getSignedUrl } from '@/hooks/useSemanticSearch';
import { useLanguage } from '@/hooks/useLanguageCompat';

interface SearchResult {
  doc_id: string;
  storage_bucket: string;
  storage_path: string;
  title: string;
  portal: string | null;
  doc_type: string | null;
  snippet: string;
  score: number;
}

interface RecentDoc {
  doc_id: string;
  storage_bucket: string;
  storage_path: string;
  title: string;
  portal: string | null;
  doc_type: string | null;
  created_at: string;
}

export default function KnowledgeSearch() {
  const { isRTL } = useLanguage();
  const [q, setQ] = React.useState('');
  const [portal, setPortal] = React.useState<string | undefined>(undefined);
  const [source, setSource] = React.useState<string | undefined>(undefined);
  const search = useDocSearch();
  const recent = useRecentDocs();

  const strings = isRTL ? AR : EN;

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;
    search.mutate({ q, top_k: 8, portal: portal ?? null, source: (source as any) ?? null, with_urls: false });
  };

  const openDocument = async (doc_id: string) => {
    try {
      const url = await getSignedUrl(doc_id);
      window.open(url, '_blank');
    } catch (e) {
      alert(strings.openError);
      console.error('Failed to open document:', e);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {strings.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {strings.subtitle}
        </p>
      </div>

      {/* Search Form */}
      <form className="flex flex-col md:flex-row gap-3 mb-6" onSubmit={onSearch}>
        <input
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder={strings.placeholder}
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        
        <select 
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          value={portal ?? ''} 
          onChange={e => setPortal(e.target.value || undefined)}
        >
          <option value="">{strings.allPortals}</option>
          <option value="QIWA">QIWA</option>
          <option value="GOSI">GOSI</option>
          <option value="Absher">Absher</option>
          <option value="Mudad">Mudad</option>
          <option value="Muqeem">Muqeem</option>
        </select>
        
        <select 
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          value={source ?? ''} 
          onChange={e => setSource(e.target.value || undefined)}
        >
          <option value="">{strings.allSources}</option>
          <option value="gov">{strings.govSource}</option>
          <option value="hr">{strings.hrSource}</option>
          <option value="import">{strings.importSource}</option>
          <option value="manual">{strings.manualSource}</option>
        </select>
        
        <button 
          type="submit" 
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors ${
            search.isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={search.isPending}
        >
          {search.isPending ? strings.searching : strings.search}
        </button>
      </form>

      {/* Search Results */}
      {search.isSuccess && Array.isArray((search.data as any)?.results) && (
        <SearchResultsList 
          results={(search.data as any).results} 
          strings={strings}
          onOpenDocument={openDocument}
        />
      )}

      {/* Error State */}
      {search.isError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="text-red-800 dark:text-red-200 font-medium">
            {strings.searchError}
          </div>
        </div>
      )}

      {/* Recent Documents (when not searching) */}
      {!search.isPending && !search.isSuccess && !search.isError && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {strings.recent}
          </h2>
          {recent.isLoading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {strings.loadingRecent}
            </div>
          )}
          {recent.isError && (
            <div className="text-center py-8 text-red-600 dark:text-red-400">
              {strings.recentError}
            </div>
          )}
          {recent.isSuccess && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(recent.data ?? []).map((doc: RecentDoc) => (
                <DocumentCard 
                  key={doc.doc_id} 
                  doc={doc}
                  strings={strings}
                  onOpen={openDocument}
                />
              ))}
              {recent.data?.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  {strings.noRecentDocs}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultsList({ 
  results, 
  strings, 
  onOpenDocument 
}: { 
  results: SearchResult[]; 
  strings: any; 
  onOpenDocument: (docId: string) => void;
}) {
  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {strings.searchResults} ({results.length})
      </h2>
      
      {results.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {strings.noResults}
        </div>
      )}
      
      {results.map((result, idx) => (
        <div 
          key={idx} 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {result.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                {result.portal && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                    {result.portal}
                  </span>
                )}
                {result.doc_type && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    {result.doc_type}
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {strings.relevance}: {(result.score * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {result.snippet}
            </p>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => onOpenDocument(result.doc_id)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              {strings.openDocument}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentCard({ 
  doc, 
  strings, 
  onOpen 
}: { 
  doc: RecentDoc; 
  strings: any; 
  onOpen: (docId: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
        {doc.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-3">
        {doc.portal && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
            {doc.portal}
          </span>
        )}
        {doc.doc_type && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
            {doc.doc_type}
          </span>
        )}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {new Date(doc.created_at).toLocaleDateString()}
      </div>
      
      <button 
        onClick={() => onOpen(doc.doc_id)}
        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        {strings.openDocument}
      </button>
    </div>
  );
}

const EN = {
  title: 'Knowledge Search',
  subtitle: 'Search across your uploaded government and HR documents using semantic understanding.',
  placeholder: 'Search e.g., "expiring iqama policy" or "Saudi labor contract terms"…',
  allPortals: 'All Portals',
  allSources: 'All Sources',
  govSource: 'Government',
  hrSource: 'HR Documents',
  importSource: 'Imported Data',
  manualSource: 'Manual Uploads',
  search: 'Search',
  searching: 'Searching...',
  searchResults: 'Search Results',
  recent: 'Recent Documents',
  noResults: 'No results found. Try different keywords or filters.',
  noRecentDocs: 'No recent documents found.',
  loadingRecent: 'Loading recent documents...',
  recentError: 'Error loading recent documents.',
  searchError: 'Search failed. Please try again.',
  relevance: 'Relevance',
  openDocument: 'Open Document',
  openError: 'Failed to open document. Please try again.'
};

const AR = {
  title: 'بحث المعرفة',
  subtitle: 'ابحث عبر مستنداتك الحكومية والموارد البشرية باستخدام الفهم الدلالي.',
  placeholder: 'ابحث مثلًا: "سياسة الإقامات المنتهية" أو "بنود عقد العمل السعودي"...',
  allPortals: 'جميع المنصات',
  allSources: 'جميع المصادر',
  govSource: 'المستندات الحكومية',
  hrSource: 'مستندات الموارد البشرية',
  importSource: 'البيانات المستوردة',
  manualSource: 'الرفع اليدوي',
  search: 'بحث',
  searching: 'جاري البحث...',
  searchResults: 'نتائج البحث',
  recent: 'المستندات الحديثة',
  noResults: 'لم يتم العثور على نتائج. جرب كلمات مفتاحية أو مرشحات مختلفة.',
  noRecentDocs: 'لم يتم العثور على مستندات حديثة.',
  loadingRecent: 'جاري تحميل المستندات الحديثة...',
  recentError: 'خطأ في تحميل المستندات الحديثة.',
  searchError: 'فشل البحث. يرجى المحاولة مرة أخرى.',
  relevance: 'الملاءمة',
  openDocument: 'فتح المستند',
  openError: 'فشل في فتح المستند. يرجى المحاولة مرة أخرى.'
};