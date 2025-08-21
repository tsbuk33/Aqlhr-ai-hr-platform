import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};