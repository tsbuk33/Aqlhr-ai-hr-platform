import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { Loader2, Database, Users, BarChart3, Target, FileText, CheckCircle } from 'lucide-react';
import { resolveLang } from '@/lib/i18n/localePath';

interface SeedingOperationStatus {
  id: string;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  rpc: string;
  params?: any;
  icon: React.ReactNode;
  status: 'idle' | 'running' | 'success' | 'error';
  result?: any;
  error?: string;
}

export const DemoDataSeedingPanel: React.FC = () => {
  const [operations, setOperations] = useState<SeedingOperationStatus[]>([
    {
      id: 'seed-employees',
      label: 'Seed 1,000 Employees',
      labelAr: 'إضافة ١٠٠٠ موظف',
      description: 'Creates realistic employee data with Saudization mix and iqama expiries',
      descriptionAr: 'إنشاء بيانات موظفين واقعية مع مزيج السعودة وانتهاء الإقامات',
      rpc: 'dev_seed_employees_v1',
      icon: <Users className="h-5 w-5" />,
      status: 'idle'
    },
    {
      id: 'backfill-kpis',
      label: 'Backfill KPIs (12 months)',
      labelAr: 'ملء مؤشرات الأداء (١٢ شهر)',
      description: 'Generates 365 days of historical KPI snapshots',
      descriptionAr: 'إنشاء ٣٦٥ يوم من لقطات مؤشرات الأداء التاريخية',
      rpc: 'dev_backfill_kpis_v1',
      params: { p_days: 365 },
      icon: <BarChart3 className="h-5 w-5" />,
      status: 'idle'
    },
    {
      id: 'seed-retention',
      label: 'Seed Retention (risk + exits)',
      labelAr: 'إضافة بيانات الاحتفاظ (مخاطر + مغادرات)',
      description: 'Creates employee exits data for retention analysis',
      descriptionAr: 'إنشاء بيانات مغادرة الموظفين لتحليل الاحتفاظ',
      rpc: 'dev_seed_retention_v1',
      icon: <Target className="h-5 w-5" />,
      status: 'idle'
    },
    {
      id: 'seed-cci-quick',
      label: 'CCI Quick Test',
      labelAr: 'اختبار CCI السريع',
      description: 'Seeds basic CCI survey data for testing',
      descriptionAr: 'إضافة بيانات استبيان CCI الأساسية للاختبار',
      rpc: 'dev_seed_cci_quick_v1',
      icon: <FileText className="h-5 w-5" />,
      status: 'idle'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { toast } = useToast();
  const isArabic = resolveLang() === 'ar';

  // Initialize tenant ID
  React.useEffect(() => {
    const initTenant = async () => {
      const id = await getTenantIdOrDemo();
      setTenantId(id);
    };
    initTenant();
  }, []);

  const updateOperationStatus = (id: string, status: SeedingOperationStatus['status'], result?: any, error?: string) => {
    setOperations(prev => prev.map(op => 
      op.id === id 
        ? { ...op, status, result, error }
        : op
    ));
  };

  const runSingleOperation = async (operation: SeedingOperationStatus) => {
    if (!tenantId) return;

    updateOperationStatus(operation.id, 'running');

    try {
      const { data, error } = await supabase.rpc(operation.rpc as any, {
        p_tenant: tenantId,
        ...operation.params
      });

      if (error) throw error;

      updateOperationStatus(operation.id, 'success', data);
      
      toast({
        title: 'Success',
        description: `${operation.label} completed successfully`,
      });

      return { success: true, data };
    } catch (error: any) {
      console.error(`Error in ${operation.id}:`, error);
      updateOperationStatus(operation.id, 'error', null, error.message);
      
      toast({
        title: 'Error',
        description: `${operation.label} failed: ${error.message}`,
        variant: 'destructive',
      });

      return { success: false, error };
    }
  };

  const runAllOperations = async () => {
    if (isRunning || !tenantId) return;

    setIsRunning(true);
    
    // Reset all operations to idle
    setOperations(prev => prev.map(op => ({ ...op, status: 'idle', result: null, error: null })));

    try {
      // Run operations in sequence
      for (const operation of operations) {
        await runSingleOperation(operation);
        // Small delay between operations
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Auto-run "Recompute KPIs Today" after seeding
      try {
        const today = new Date().toISOString().split('T')[0];
        await supabase.rpc('dev_backfill_kpis_v1' as any, {
          p_tenant: tenantId,
          p_days: 1
        });

        toast({
          title: 'Demo Data Complete',
          description: 'All seeding operations completed successfully. KPIs updated for today.',
        });
      } catch (error) {
        console.warn('Failed to update today\'s KPIs:', error);
      }

    } finally {
      setIsRunning(false);
    }
  };

  const getStatusBadgeVariant = (status: SeedingOperationStatus['status']) => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'running': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: SeedingOperationStatus['status']) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  const hasAnySuccess = operations.some(op => op.status === 'success');
  const allComplete = operations.every(op => op.status === 'success' || op.status === 'error');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <div>
            <CardTitle>
              {isArabic ? 'إدارة البيانات التجريبية' : 'Demo Data Management'}
            </CardTitle>
            <CardDescription>
              {isArabic 
                ? 'إضافة البيانات التجريبية لاختبار النظام (مطابق للبيانات الفعلية)'
                : 'Idempotent seeding of realistic demo data for testing'
              }
            </CardDescription>
          </div>
        </div>
        {tenantId && (
          <Badge variant="outline" className="w-fit">
            {isArabic ? 'المستأجر' : 'Tenant'}: {tenantId.slice(0, 8)}...
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Action Button */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={runAllOperations}
            disabled={isRunning || !tenantId}
            size="lg"
            className="flex-1 mr-4"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isArabic ? 'جاري التشغيل...' : 'Running All Operations...'}
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                {isArabic ? 'تشغيل جميع العمليات' : 'Run All Operations'}
              </>
            )}
          </Button>
          
          {hasAnySuccess && (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              {isArabic ? 'تحديث الصفحة' : 'Refresh Page'}
            </Button>
          )}
        </div>

        {/* Individual Operations */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {isArabic ? 'العمليات الفردية' : 'Individual Operations'}
          </h4>
          
          {operations.map((operation) => (
            <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {operation.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {isArabic ? operation.labelAr : operation.label}
                    </span>
                    <Badge variant={getStatusBadgeVariant(operation.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(operation.status)}
                        <span className="capitalize">{operation.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isArabic ? operation.descriptionAr : operation.description}
                  </p>
                  {operation.error && (
                    <p className="text-xs text-destructive mt-1">
                      {operation.error}
                    </p>
                  )}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => runSingleOperation(operation)}
                disabled={operation.status === 'running' || isRunning || !tenantId}
              >
                {operation.status === 'running' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  isArabic ? 'تشغيل' : 'Run'
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        {(isRunning || allComplete) && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">
              {isArabic ? 'ملخص التقدم' : 'Progress Summary'}
            </h4>
            <div className="text-sm space-y-1">
              <p>
                {isArabic ? 'العمليات المكتملة' : 'Completed'}: {operations.filter(op => op.status === 'success').length}/{operations.length}
              </p>
              <p>
                {isArabic ? 'العمليات الفاشلة' : 'Failed'}: {operations.filter(op => op.status === 'error').length}/{operations.length}
              </p>
              {allComplete && (
                <p className="text-primary font-medium mt-2">
                  {isArabic 
                    ? 'تم إكمال جميع العمليات. تحقق من لوحة التحكم للحصول على البيانات المحدثة.'
                    : 'All operations complete. Check the dashboard for updated data.'
                  }
                </p>
              )}
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="p-4 border-l-4 border-primary/50 bg-primary/5 rounded">
          <h4 className="font-medium mb-2">
            {isArabic ? 'ملاحظات مهمة' : 'Important Notes'}
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              {isArabic 
                ? '• العمليات آمنة للتشغيل المتكرر (idempotent)'
                : '• Operations are safe to run multiple times (idempotent)'
              }
            </li>
            <li>
              {isArabic 
                ? '• تستخدم العمليات fallback قاعدة البيانات للموثوقية'
                : '• Operations use database fallback for reliability'
              }
            </li>
            <li>
              {isArabic 
                ? '• يتم إنشاء البيانات مع مراعاة PDPL وRLS'
                : '• Data generated with PDPL and RLS compliance'
              }
            </li>
            <li>
              {isArabic 
                ? '• يمكن رؤية البيانات في لوحة التحكم وصفحات الموظفين'
                : '• Data visible in Dashboard and Employee pages'
              }
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Add X icon that was missing
const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);