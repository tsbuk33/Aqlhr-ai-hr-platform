import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { 
  Building2, 
  Shield, 
  FileText, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Play
} from 'lucide-react';
import { format } from 'date-fns';

interface GovAdapter {
  system: string;
  status: string;
  last_sync: string | null;
  last_error: string | null;
}

const GovernmentIntegrations: React.FC = () => {
  const { companyId } = useUserCompany();
  const { isArabic } = useSimpleLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [runningSync, setRunningSync] = useState<string | null>(null);

  // Fetch government integration status
  const { data: integrations, isLoading } = useQuery({
    queryKey: ['gov-integrations', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .rpc('gov_get_status_v1' as any, { p_tenant_id: companyId });

      if (error) throw error;
      return data as GovAdapter[];
    },
    enabled: !!companyId,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Queue sync job mutation
  const queueSyncMutation = useMutation({
    mutationFn: async ({ system, jobType }: { system: string; jobType: string }) => {
      if (!companyId) throw new Error('No company ID');

      const { data, error } = await supabase
        .rpc('gov_queue_job_v1' as any, {
          p_tenant_id: companyId,
          p_job_type: system,
          p_params: { job_type: jobType, manual_trigger: true }
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      setRunningSync(variables.system);
      toast({
        title: isArabic ? 'تم بدء المزامنة' : 'Sync Started',
        description: isArabic 
          ? `تم بدء مزامنة ${getSystemDisplayName(variables.system)}`
          : `Started sync for ${getSystemDisplayName(variables.system)}`,
      });
      
      // Clear running state after 5 seconds and refresh data
      setTimeout(() => {
        setRunningSync(null);
        queryClient.invalidateQueries({ queryKey: ['gov-integrations', companyId] });
      }, 5000);
    },
    onError: (error) => {
      setRunningSync(null);
      toast({
        title: isArabic ? 'خطأ في المزامنة' : 'Sync Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const getSystemDisplayName = (system: string) => {
    const names: Record<string, { en: string; ar: string }> = {
      qiwa: { en: 'Qiwa', ar: 'قوى' },
      gosi: { en: 'GOSI', ar: 'التأمينات الاجتماعية' },
      absher: { en: 'Absher', ar: 'أبشر' }
    };
    return names[system] ? names[system][isArabic ? 'ar' : 'en'] : system;
  };

  const getSystemIcon = (system: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      qiwa: Building2,
      gosi: Shield,
      absher: FileText
    };
    return icons[system] || Building2;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'default';
      case 'demo':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'demo':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleRunSync = (system: string) => {
    queueSyncMutation.mutate({ system, jobType: 'full_sync' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تكاملات الجهات الحكومية' : 'Government Integrations'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'إدارة التكاملات مع الجهات الحكومية السعودية'
            : 'Manage integrations with Saudi government entities'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations?.map((integration) => {
          const Icon = getSystemIcon(integration.system);
          const isRunning = runningSync === integration.system;
          
          return (
            <Card key={integration.system} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  {getSystemDisplayName(integration.system)}
                  <div className="flex gap-2">
                    {getStatusIcon(integration.status)}
                    <Badge variant={getStatusColor(integration.status)}>
                      {integration.status === 'connected' 
                        ? (isArabic ? 'متصل' : 'Connected')
                        : integration.status === 'demo'
                        ? (isArabic ? 'تجربة' : 'Demo')
                        : integration.status === 'error'
                        ? (isArabic ? 'خطأ' : 'Error')
                        : (isArabic ? 'غير متصل' : 'Disconnected')
                      }
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  {integration.system === 'qiwa' && (isArabic ? 'نظام قوى لإدارة العمالة' : 'Qiwa workforce management system')}
                  {integration.system === 'gosi' && (isArabic ? 'مؤسسة التأمينات الاجتماعية' : 'General Organization for Social Insurance')}
                  {integration.system === 'absher' && (isArabic ? 'منصة أبشر الحكومية' : 'Absher government services platform')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {integration.last_sync && (
                  <div className="text-sm text-muted-foreground">
                    <strong>{isArabic ? 'آخر مزامنة:' : 'Last sync:'}</strong>{' '}
                    {format(new Date(integration.last_sync), 'PPp')}
                  </div>
                )}

                {integration.last_error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {integration.last_error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={() => handleRunSync(integration.system)}
                  disabled={isRunning || queueSyncMutation.isPending}
                  className="w-full"
                  variant={integration.status === 'error' ? 'destructive' : 'default'}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {isArabic ? 'جاري المزامنة...' : 'Syncing...'}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {isArabic ? 'تشغيل المزامنة' : 'Run Sync Now'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!integrations?.length && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isArabic ? 'لا توجد تكاملات' : 'No Integrations Found'}
            </h3>
            <p className="text-muted-foreground">
              {isArabic 
                ? 'لم يتم العثور على تكاملات حكومية نشطة'
                : 'No active government integrations found'
              }
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isArabic ? 'سجل المزامنة' : 'Sync Log'}</CardTitle>
          <CardDescription>
            {isArabic 
              ? 'آخر 10 عمليات مزامنة مع الجهات الحكومية'
              : 'Latest 10 synchronization activities with government entities'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{isArabic ? 'سجل المزامنة قيد التطوير' : 'Sync log viewer coming soon'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GovernmentIntegrations;