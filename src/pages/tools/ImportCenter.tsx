import React, { useState } from 'react';
import { useImportJobs, useImportRows } from '@/hooks/useImportCenter';
import { retryImportJob, buildCsv } from '@/lib/api/importCenter';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  RefreshCw, 
  ArrowLeft, 
  Download, 
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

export default function ImportCenter() {
  const { isArabic } = useLanguage();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<string | undefined>(undefined);
  const [selectedJob, setSelectedJob] = useState<string | undefined>(undefined);
  
  const jobs = useImportJobs({ status, mode });
  const rows = useImportRows(selectedJob, true); // errors-only by default

  const strings = {
    title: isArabic ? 'مركز الاستيراد' : 'Import Center',
    filterStatus: isArabic ? 'الحالة' : 'Status',
    filterMode: isArabic ? 'النوع' : 'Mode', 
    created: isArabic ? 'أُنشئت' : 'Created',
    totals: isArabic ? 'الإجمالي/المعالج/النجح/الفشل' : 'Total/Processed/Success/Failed',
    details: isArabic ? 'تفاصيل' : 'Details',
    retryFailed: isArabic ? 'إعادة المحاولة للأخطاء' : 'Retry Failed',
    downloadErrors: isArabic ? 'تنزيل الأخطاء CSV' : 'Download Errors CSV',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    back: isArabic ? 'رجوع' : 'Back',
    noJobs: isArabic ? 'لا توجد عمليات استيراد بعد' : 'No import jobs yet',
    errorsForJob: isArabic ? 'أخطاء للوظيفة' : 'Errors for Job',
    loading: isArabic ? 'جارٍ التحميل...' : 'Loading...',
    noErrors: isArabic ? 'لا توجد أخطاء' : 'No errors found',
    statusLabels: {
      queued: isArabic ? 'في الانتظار' : 'Queued',
      validated: isArabic ? 'تم التحقق' : 'Validated', 
      processing: isArabic ? 'قيد المعالجة' : 'Processing',
      completed: isArabic ? 'مكتمل' : 'Completed',
      failed: isArabic ? 'فشل' : 'Failed'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'validated': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Upload className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{strings.title}</h1>
        </div>
        
        <div className="flex gap-2">
          <Select value={status || ''} onValueChange={(v) => setStatus(v || undefined)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={strings.filterStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{strings.filterStatus}</SelectItem>
              <SelectItem value="queued">{strings.statusLabels.queued}</SelectItem>
              <SelectItem value="validated">{strings.statusLabels.validated}</SelectItem>
              <SelectItem value="processing">{strings.statusLabels.processing}</SelectItem>
              <SelectItem value="completed">{strings.statusLabels.completed}</SelectItem>
              <SelectItem value="failed">{strings.statusLabels.failed}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={mode || ''} onValueChange={(v) => setMode(v || undefined)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={strings.filterMode} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{strings.filterMode}</SelectItem>
              <SelectItem value="employees">Employees</SelectItem>
              <SelectItem value="gov">Government</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => jobs.refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {strings.refresh}
          </Button>
        </div>
      </div>

      {!selectedJob ? (
        <JobsList 
          jobs={jobs} 
          strings={strings} 
          onSelectJob={setSelectedJob}
          getStatusIcon={getStatusIcon}
          getStatusVariant={getStatusVariant}
        />
      ) : (
        <JobDetail
          jobId={selectedJob}
          onBack={() => setSelectedJob(undefined)}
          strings={strings}
          rows={rows}
        />
      )}
    </div>
  );
}

function JobsList({ jobs, strings, onSelectJob, getStatusIcon, getStatusVariant }: any) {
  if (jobs.isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">{strings.loading}</div>
        </CardContent>
      </Card>
    );
  }

  if (!jobs.data?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          {strings.noJobs}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Jobs ({jobs.data.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Mode</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">{strings.created}</th>
                <th className="text-left p-2">{strings.totals}</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.data.map((j: any) => (
                <tr key={j.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono text-xs">{j.id.slice(0, 8)}…</td>
                  <td className="p-2">
                    <Badge variant="outline">{j.mode}</Badge>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(j.status)}
                      <Badge variant={getStatusVariant(j.status)}>
                        {strings.statusLabels[j.status] || j.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-2 text-sm">
                    {new Date(j.created_at).toLocaleString()}
                  </td>
                  <td className="p-2 font-mono text-sm">
                    {j.total_rows}/{j.processed_rows}/{j.success_rows}/{j.failed_rows}
                  </td>
                  <td className="p-2">
                    <Button 
                      size="sm" 
                      onClick={() => onSelectJob(j.id)}
                      disabled={j.status === 'queued'}
                    >
                      {strings.details}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function JobDetail({ jobId, onBack, strings, rows }: any) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | undefined>(undefined);

  const downloadCsv = () => {
    if (!rows.data?.length) return;
    
    const csv = buildCsv(
      rows.data.map((r: any) => ({ 
        row_index: r.row_index, 
        raw: r.raw, 
        error: r.error 
      }))
    );
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `import_job_${jobId}_errors.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const retryAll = async () => {
    try {
      setBusy(true);
      setMsg(undefined);
      const res = await retryImportJob(jobId);
      setMsg(`Retry completed: ${res.success} succeeded, ${res.failed} failed`);
      rows.refetch();
    } catch (error: any) {
      setMsg(`Error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {strings.errorsForJob} {jobId.slice(0, 8)}…
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadCsv} disabled={!rows.data?.length}>
              <Download className="h-4 w-4 mr-2" />
              {strings.downloadErrors}
            </Button>
            <Button 
              size="sm" 
              onClick={retryAll} 
              disabled={busy || !rows.data?.length}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {strings.retryFailed}
            </Button>
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {strings.back}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {msg && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{msg}</AlertDescription>
          </Alert>
        )}
        
        {rows.isLoading ? (
          <div className="text-center py-8">{strings.loading}</div>
        ) : !rows.data?.length ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-300" />
            {strings.noErrors}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Error</th>
                  <th className="text-left p-2">Raw Data</th>
                </tr>
              </thead>
              <tbody>
                {rows.data.map((r: any) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono">{r.row_index}</td>
                    <td className="p-2 text-red-600 text-sm max-w-xs truncate">
                      {r.error}
                    </td>
                    <td className="p-2">
                      <pre className="text-xs bg-gray-100 p-2 rounded max-w-md overflow-x-auto">
                        {JSON.stringify(r.raw, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}