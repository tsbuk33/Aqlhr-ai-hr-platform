import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  Database, 
  Cloud, 
  HardDrive,
  CheckCircle,
  AlertTriangle,
  Clock,
  Pause,
  Play
} from 'lucide-react';

export const DataSyncManagement: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [activeSync, setActiveSync] = useState<string | null>('employees');

  const syncJobs = [
    {
      id: 'employees',
      name: isArabic ? 'بيانات الموظفين' : 'Employee Data',
      source: 'Local DB',
      target: 'Cloud Backup',
      status: 'running',
      progress: 67,
      lastSync: isArabic ? 'منذ ساعة' : '1 hour ago',
      errors: 0
    },
    {
      id: 'attendance',
      name: isArabic ? 'الحضور والغياب' : 'Attendance Records',
      source: 'Biometric System',
      target: 'HR Database',
      status: 'completed',
      progress: 100,
      lastSync: isArabic ? 'منذ ١٠ دقائق' : '10 minutes ago',
      errors: 0
    },
    {
      id: 'payroll',
      name: isArabic ? 'بيانات الرواتب' : 'Payroll Data',
      source: 'Accounting System',
      target: 'HR Database',
      status: 'pending',
      progress: 0,
      lastSync: isArabic ? 'منذ ٣ ساعات' : '3 hours ago',
      errors: 2
    },
    {
      id: 'government',
      name: isArabic ? 'البيانات الحكومية' : 'Government Data',
      source: 'GOSI/MOL APIs',
      target: 'Compliance DB',
      status: 'error',
      progress: 23,
      lastSync: isArabic ? 'منذ يوم' : '1 day ago',
      errors: 5
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      running: 'default',
      completed: 'secondary',
      pending: 'outline',
      error: 'destructive'
    } as const;

    const labels = {
      running: isArabic ? 'جاري التشغيل' : 'Running',
      completed: isArabic ? 'مكتمل' : 'Completed',
      pending: isArabic ? 'في الانتظار' : 'Pending',
      error: isArabic ? 'خطأ' : 'Error'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handlePauseResume = (jobId: string, currentStatus: string) => {
    if (currentStatus === 'running') {
      setActiveSync(null);
    } else if (currentStatus === 'pending' || currentStatus === 'error') {
      setActiveSync(jobId);
    }
  };

  const handleRetry = (jobId: string) => {
    setActiveSync(jobId);
    console.log(`Retrying sync job: ${jobId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {isArabic ? 'إدارة مزامنة البيانات' : 'Data Sync Management'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {syncJobs.map((job) => (
          <div key={job.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
            {/* Job Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(job.status)}
                <div>
                  <div className="font-medium">{job.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {job.source} → {job.target}
                  </div>
                </div>
              </div>
              {getStatusBadge(job.status)}
            </div>

            {/* Progress Bar */}
            {job.status === 'running' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{isArabic ? 'التقدم' : 'Progress'}</span>
                  <span>{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="h-2" />
              </div>
            )}

            {/* Job Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-medium">{job.lastSync}</div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'آخر مزامنة' : 'Last Sync'}
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium ${job.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {job.errors}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'أخطاء' : 'Errors'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">
                  {job.status === 'completed' ? '100%' : `${job.progress}%`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'مكتمل' : 'Complete'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {job.status === 'running' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePauseResume(job.id, job.status)}
                  className="flex-1"
                >
                  <Pause className="h-3 w-3 mr-1" />
                  {isArabic ? 'إيقاف مؤقت' : 'Pause'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePauseResume(job.id, job.status)}
                  className="flex-1"
                >
                  <Play className="h-3 w-3 mr-1" />
                  {isArabic ? 'تشغيل' : 'Start'}
                </Button>
              )}
              
              {job.status === 'error' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRetry(job.id)}
                  className="flex-1"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {isArabic ? 'إعادة المحاولة' : 'Retry'}
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* System Overview */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <HardDrive className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{isArabic ? 'التخزين المحلي' : 'Local Storage'}</span>
              </div>
              <div className="text-lg font-semibold">847 GB</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'متاح' : 'Available'}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Cloud className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{isArabic ? 'النسخ الاحتياطي' : 'Cloud Backup'}</span>
              </div>
              <div className="text-lg font-semibold">2.3 TB</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'مستخدم' : 'Used'}</div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {isArabic ? 'مزامنة جميع البيانات' : 'Sync All Data'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};