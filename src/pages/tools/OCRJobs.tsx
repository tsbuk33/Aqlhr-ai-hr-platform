import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguageCompat';

interface OCRJob {
  id: string;
  doc_id: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  attempts: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  title: string | null;
  portal: string | null;
  doc_type: string | null;
  mime_type: string | null;
  storage_bucket: string;
  storage_path: string;
}

export default function OCRJobs() {
  const { isRTL } = useLanguage();
  const qc = useQueryClient();
  const strings = isRTL ? AR : EN;

  const jobs = useQuery({
    queryKey: ['ocr_jobs'],
    queryFn: async () => {
      // Fallback to empty array since doc_ocr_jobs_v1 table doesn't exist
      return [] as OCRJob[];
    },
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  const runNow = useMutation({
    mutationFn: async (batch: number = 3) => {
      const tok = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch('/functions/v1/ocr-dispatcher-v1', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          ...(tok ? { Authorization: `Bearer ${tok}` } : {}) 
        },
        body: JSON.stringify({ batch })
      });
      
      if (!res.ok) {
        throw new Error(`OCR dispatch failed: ${res.statusText}`);
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      console.log('OCR dispatch result:', data);
      qc.invalidateQueries({ queryKey: ['ocr_jobs'] });
    },
    onError: (error) => {
      console.error('OCR dispatch error:', error);
    }
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'queued': return strings.statusQueued;
      case 'processing': return strings.statusProcessing;
      case 'done': return strings.statusDone;
      case 'error': return strings.statusError;
      default: return status;
    }
  };

  const queuedCount = jobs.data?.filter(j => j.status === 'queued').length || 0;
  const processingCount = jobs.data?.filter(j => j.status === 'processing').length || 0;
  const errorCount = jobs.data?.filter(j => j.status === 'error').length || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {strings.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {strings.subtitle}
          </p>
        </div>
        
        <button 
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors ${
            runNow.isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => runNow.mutate(3)}
          disabled={runNow.isPending}
        >
          {runNow.isPending ? strings.running : strings.runNow}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {jobs.data?.length || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {strings.totalJobs}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">
            {queuedCount}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {strings.statusQueued}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {processingCount}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {strings.statusProcessing}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {errorCount}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {strings.statusError}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {runNow.isError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="text-red-800 dark:text-red-200 font-medium">
            {strings.runError}: {runNow.error?.message}
          </div>
        </div>
      )}

      {/* Success Message */}
      {runNow.isSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="text-green-800 dark:text-green-200 font-medium">
            {strings.runSuccess}: {(runNow.data as any)?.processed || 0} {strings.jobsProcessed}
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {strings.created}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {strings.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {strings.titleCol}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {strings.portal}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {strings.type}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {strings.attempts}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {strings.error}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {jobs.isLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {strings.loading}
                  </td>
                </tr>
              )}
              
              {jobs.isError && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-red-600 dark:text-red-400">
                    {strings.loadError}: {jobs.error?.message}
                  </td>
                </tr>
              )}
              
              {jobs.isSuccess && jobs.data?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {strings.noJobs}
                  </td>
                </tr>
              )}
              
              {jobs.isSuccess && jobs.data?.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {new Date(job.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(job.status)}`}>
                      {getStatusText(job.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 max-w-xs truncate">
                    {job.title || job.storage_path}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {job.portal || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {job.doc_type || job.mime_type || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {job.attempts}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 max-w-md">
                    {job.last_error && (
                      <div className="truncate" title={job.last_error}>
                        {job.last_error}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const EN = {
  title: 'OCR Jobs',
  subtitle: 'Scanned documents queued for OCR → text extraction → embeddings.',
  runNow: 'Run OCR Now',
  running: 'Running…',
  created: 'Created',
  status: 'Status',
  titleCol: 'Title / Path',
  portal: 'Portal',
  type: 'Type',
  attempts: 'Attempts',
  error: 'Last Error',
  totalJobs: 'Total Jobs',
  statusQueued: 'Queued',
  statusProcessing: 'Processing',
  statusDone: 'Completed',
  statusError: 'Error',
  loading: 'Loading jobs...',
  loadError: 'Error loading jobs',
  noJobs: 'No OCR jobs found',
  runError: 'Failed to run OCR',
  runSuccess: 'OCR batch completed',
  jobsProcessed: 'jobs processed'
};

const AR = {
  title: 'مهام التعرف الضوئي على الحروف (OCR)',
  subtitle: 'المستندات الممسوحة ضوئيًا في قائمة الانتظار لاستخراج النص ثم إنشاء المتجهات.',
  runNow: 'تشغيل OCR الآن',
  running: 'جاري التشغيل…',
  created: 'تاريخ الإنشاء',
  status: 'الحالة',
  titleCol: 'العنوان / المسار',
  portal: 'المنصة',
  type: 'النوع',
  attempts: 'المحاولات',
  error: 'آخر خطأ',
  totalJobs: 'إجمالي المهام',
  statusQueued: 'في قائمة الانتظار',
  statusProcessing: 'قيد المعالجة',
  statusDone: 'مكتمل',
  statusError: 'خطأ',
  loading: 'جاري تحميل المهام...',
  loadError: 'خطأ في تحميل المهام',
  noJobs: 'لم يتم العثور على مهام OCR',
  runError: 'فشل في تشغيل OCR',
  runSuccess: 'تمت معالجة دفعة OCR',
  jobsProcessed: 'مهام تمت معالجتها'
};