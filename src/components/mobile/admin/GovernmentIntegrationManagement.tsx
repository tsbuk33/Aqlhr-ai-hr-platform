import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export const GovernmentIntegrationManagement: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [syncing, setSyncing] = useState<string | null>(null);

  const integrations = [
    {
      name: 'GOSI',
      nameAr: 'التأمينات الاجتماعية',
      status: 'connected',
      lastSync: '2 min ago',
      lastSyncAr: 'منذ دقيقتين',
      apiCalls: '2,847',
      errors: 0
    },
    {
      name: 'QIWA',
      nameAr: 'قوى',
      status: 'connected', 
      lastSync: '5 min ago',
      lastSyncAr: 'منذ ٥ دقائق',
      apiCalls: '1,234',
      errors: 2
    },
    {
      name: 'MOL',
      nameAr: 'وزارة العمل',
      status: 'warning',
      lastSync: '1 hour ago',
      lastSyncAr: 'منذ ساعة',
      apiCalls: '567',
      errors: 5
    },
    {
      name: 'HRSD',
      nameAr: 'التنمية الاجتماعية',
      status: 'disconnected',
      lastSync: 'Never',
      lastSyncAr: 'أبداً',
      apiCalls: '0',
      errors: 0
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'default',
      warning: 'secondary', 
      disconnected: 'destructive'
    } as const;
    
    const labels = {
      connected: isArabic ? 'متصل' : 'Connected',
      warning: isArabic ? 'تحذير' : 'Warning',
      disconnected: isArabic ? 'منقطع' : 'Disconnected'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const handleSync = async (integrationName: string) => {
    setSyncing(integrationName);
    // Simulate sync process
    setTimeout(() => setSyncing(null), 3000);
  };

  const handleConfigure = (integrationName: string) => {
    console.log(`Configuring ${integrationName}...`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {isArabic ? 'إدارة التكامل الحكومي' : 'Government Integration Management'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.name} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(integration.status)}
                <div>
                  <div className="font-medium">
                    {isArabic ? integration.nameAr : integration.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? `آخر مزامنة: ${integration.lastSyncAr}` : `Last sync: ${integration.lastSync}`}
                  </div>
                </div>
              </div>
              {getStatusBadge(integration.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {integration.apiCalls}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'استدعاءات API' : 'API Calls'}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${integration.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {integration.errors}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'أخطاء' : 'Errors'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSync(integration.name)}
                disabled={syncing === integration.name}
                className="flex-1"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${syncing === integration.name ? 'animate-spin' : ''}`} />
                {isArabic ? 'مزامنة' : 'Sync'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConfigure(integration.name)}
                className="flex-1"
              >
                <Settings className="h-3 w-3 mr-1" />
                {isArabic ? 'إعداد' : 'Configure'}
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => integrations.forEach(int => handleSync(int.name))}
          >
            <Wifi className="h-4 w-4 mr-2" />
            {isArabic ? 'مزامنة جميع الأنظمة' : 'Sync All Systems'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};