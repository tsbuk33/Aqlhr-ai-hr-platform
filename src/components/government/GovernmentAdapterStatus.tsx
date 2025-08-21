import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Clock, XCircle, Loader2, RefreshCw, Lock, AlertCircle } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useFeatureAccess, useUserRole } from '@/hooks/useGovernmentAdapters';

interface GovernmentAdapter {
  system: string;
  mode: string;
  status: string;
  last_sync: string | null;
}

interface GovernmentAdapterStatusProps {
  adapters: GovernmentAdapter[];
  syncing: string | null;
  onSyncSystem: (system: string) => void;
  onSyncAll: () => void;
}

export const GovernmentAdapterStatus: React.FC<GovernmentAdapterStatusProps> = ({
  adapters,
  syncing,
  onSyncSystem,
  onSyncAll
}) => {
  const { isArabic } = useSimpleLanguage();
  const { hasAccess: hasFeatureAccess, loading: featureLoading } = useFeatureAccess('gov_adapters');
  const { canManageIntegrations, loading: roleLoading } = useUserRole();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string, mode: string) => {
    const variant = status === 'connected' ? 'default' : 
                   status === 'error' ? 'destructive' : 'secondary';
    
    const statusText = isArabic ? {
      connected: 'متصل',
      error: 'خطأ',
      pending: 'في الانتظار'
    }[status] : status;

    const modeText = isArabic ? {
      test: 'اختبار',
      live: 'مباشر'
    }[mode] : mode;

    return (
      <div className="flex gap-1">
        <Badge variant={variant}>{statusText}</Badge>
        <Badge variant="outline">{modeText}</Badge>
      </div>
    );
  };

  const getSystemDisplayName = (system: string) => {
    const names = {
      MOL: isArabic ? 'وزارة العمل' : 'Ministry of Labor',
      QIWA: isArabic ? 'منصة قوى' : 'Qiwa Platform',
      GOSI: isArabic ? 'التأمينات الاجتماعية' : 'GOSI',
      ABSHER: isArabic ? 'منصة أبشر' : 'Absher Platform'
    };
    return names[system as keyof typeof names] || system;
  };

  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return isArabic ? 'لم يتم المزامنة' : 'Never synced';
    
    const date = new Date(lastSync);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return isArabic ? 'الآن' : 'Just now';
    if (diffMinutes < 60) return isArabic ? `منذ ${diffMinutes} دقيقة` : `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return isArabic ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return isArabic ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  };

  const allConnected = adapters.every(adapter => adapter.status === 'connected');

  // Show feature access check
  if (featureLoading || roleLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Upsell modal content
  const UpsellModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!hasFeatureAccess} size="lg" className="gap-2">
          <Lock className="h-4 w-4" />
          {isArabic ? 'مزامنة شاملة' : 'Sync All Systems'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {isArabic ? 'ميزة متقدمة' : 'Premium Feature'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {isArabic 
              ? 'التكاملات الحكومية متاحة في الخطط المتقدمة فقط'
              : 'Government integrations are available in Growth+ plans only'
            }
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'مراقبة نطاقات تلقائية' : 'Automatic Nitaqat monitoring'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'تحديثات الإقامة الآلية' : 'Automated Iqama updates'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'مزامنة راتب GOSI' : 'GOSI wage sync'}
              </span>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href={`mailto:sales@company.com?subject=${isArabic ? 'طلب ترقية الخطة' : 'Plan Upgrade Request'}`}>
              {isArabic ? 'تواصل مع المبيعات' : 'Contact Sales'}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const PermissionModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={canManageIntegrations} size="lg" className="gap-2">
          <Lock className="h-4 w-4" />
          {isArabic ? 'مزامنة شاملة' : 'Sync All Systems'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {isArabic ? 'صلاحيات محدودة' : 'Limited Permissions'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {isArabic 
              ? 'تحتاج صلاحيات إدارية لإجراء مزامنة الأنظمة الحكومية'
              : 'You need administrative permissions to sync government systems'
            }
          </p>
          <p className="text-sm text-muted-foreground">
            {isArabic 
              ? 'الأدوار المطلوبة: إداري، مدير الموارد البشرية، أو مدير عام'
              : 'Required roles: Admin, HR Manager, or Super Admin'
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'ربط وتكامل مع الأنظمة الحكومية السعودية (وزارة العمل، قوى، التأمينات، أبشر)'
              : 'Connect and integrate with Saudi government systems (MOL, Qiwa, GOSI, Absher)'
            }
          </p>
        </div>
        {!hasFeatureAccess ? (
          <UpsellModal />
        ) : !canManageIntegrations ? (
          <PermissionModal />
        ) : (
          <Button
            onClick={onSyncAll}
            disabled={syncing !== null}
            size="lg"
            className="gap-2"
          >
            {syncing === 'ALL' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isArabic ? 'مزامنة شاملة' : 'Sync All Systems'}
          </Button>
        )}
      </div>

      {/* Overall Status Banner */}
      <Card className={`border-l-4 ${allConnected ? 'border-l-green-500 bg-green-50/50' : 'border-l-yellow-500 bg-yellow-50/50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            {allConnected ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <Clock className="h-6 w-6 text-yellow-500" />
            )}
            <div>
              <p className="font-medium">
                {allConnected 
                  ? (isArabic ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems operational')
                  : (isArabic ? 'بعض الأنظمة تحتاج إعداد' : 'Some systems need setup')
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? `${adapters.filter(a => a.status === 'connected').length}/${adapters.length} أنظمة متصلة`
                  : `${adapters.filter(a => a.status === 'connected').length}/${adapters.length} systems connected`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adapters.map((adapter) => (
          <Card key={adapter.system} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">
                {getSystemDisplayName(adapter.system)}
              </CardTitle>
              {getStatusIcon(adapter.status)}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {getStatusBadge(adapter.status, adapter.mode)}
                <p className="text-xs text-muted-foreground">
                  {formatLastSync(adapter.last_sync)}
                </p>
              </div>
              
               <div className="flex gap-2">
                 {!hasFeatureAccess ? (
                   <Button size="sm" disabled className="flex-1 gap-2">
                     <Lock className="h-3 w-3" />
                     {isArabic ? 'اختبار' : 'Test Sync'}
                   </Button>
                 ) : !canManageIntegrations ? (
                   <Button size="sm" disabled className="flex-1 gap-2">
                     <Lock className="h-3 w-3" />
                     {isArabic ? 'اختبار' : 'Test Sync'}
                   </Button>
                 ) : (
                   <Button
                     size="sm"
                     onClick={() => onSyncSystem(adapter.system)}
                     disabled={syncing !== null}
                     className="flex-1"
                   >
                     {syncing === adapter.system ? (
                       <Loader2 className="h-3 w-3 animate-spin" />
                     ) : (
                       <RefreshCw className="h-3 w-3" />
                     )}
                     {isArabic ? 'اختبار' : 'Test Sync'}
                   </Button>
                 )}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};