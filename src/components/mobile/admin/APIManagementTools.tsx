import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Key, 
  Activity, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';

export const APIManagementTools: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [refreshing, setRefreshing] = useState(false);

  const apiEndpoints = [
    {
      name: '/api/employees',
      nameAr: '/api/الموظفين',
      method: 'GET',
      status: 'healthy',
      calls: '12.4K',
      avgResponse: '145ms',
      errorRate: '0.1%',
      lastUsed: isArabic ? 'منذ ثانية' : '1s ago'
    },
    {
      name: '/api/attendance',
      nameAr: '/api/الحضور',
      method: 'POST',
      status: 'healthy',
      calls: '8.7K',
      avgResponse: '89ms',
      errorRate: '0.3%',
      lastUsed: isArabic ? 'منذ ٥ ثوانٍ' : '5s ago'
    },
    {
      name: '/api/government/gosi',
      nameAr: '/api/حكومي/التأمينات',
      method: 'PUT',
      status: 'warning',
      calls: '234',
      avgResponse: '2.3s',
      errorRate: '3.2%',
      lastUsed: isArabic ? 'منذ دقيقة' : '1m ago'
    },
    {
      name: '/api/reports/generate',
      nameAr: '/api/التقارير/إنشاء',
      method: 'POST',
      status: 'error',
      calls: '45',
      avgResponse: '12.5s',
      errorRate: '15.8%',
      lastUsed: isArabic ? 'منذ ١٠ دقائق' : '10m ago'
    }
  ];

  const apiKeys = [
    {
      name: 'Mobile App Key',
      nameAr: 'مفتاح التطبيق المحمول',
      key: '***-***-***-abc123',
      permissions: ['read', 'write'],
      lastUsed: isArabic ? 'منذ دقيقة' : '1 minute ago',
      status: 'active'
    },
    {
      name: 'Government Integration Key', 
      nameAr: 'مفتاح التكامل الحكومي',
      key: '***-***-***-def456',
      permissions: ['read', 'government'],
      lastUsed: isArabic ? 'منذ ٥ دقائق' : '5 minutes ago',
      status: 'active'
    },
    {
      name: 'Analytics Service Key',
      nameAr: 'مفتاح خدمة التحليلات',
      key: '***-***-***-ghi789',
      permissions: ['read'],
      lastUsed: isArabic ? 'منذ يوم' : '1 day ago',
      status: 'inactive'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMethodBadge = (method: string) => {
    const variants = {
      GET: 'secondary',
      POST: 'default',
      PUT: 'outline',
      DELETE: 'destructive'
    } as const;

    return (
      <Badge variant={variants[method as keyof typeof variants] || 'secondary'} className="text-xs">
        {method}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary'
    } as const;

    const labels = {
      active: isArabic ? 'نشط' : 'Active',
      inactive: isArabic ? 'غير نشط' : 'Inactive'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {isArabic ? 'أدوات إدارة API' : 'API Management Tools'}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Endpoints */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'نقاط API النهائية' : 'API Endpoints'}
          </div>
          {apiEndpoints.slice(0, 3).map((endpoint, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(endpoint.status)}
                  <span className="text-sm font-mono">
                    {isArabic ? endpoint.nameAr : endpoint.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {getMethodBadge(endpoint.method)}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-blue-600">{endpoint.calls}</div>
                  <div className="text-muted-foreground">{isArabic ? 'استدعاءات' : 'Calls'}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-600">{endpoint.avgResponse}</div>
                  <div className="text-muted-foreground">{isArabic ? 'الاستجابة' : 'Response'}</div>
                </div>
                <div className="text-center">
                  <div className={`font-medium ${parseFloat(endpoint.errorRate) > 2 ? 'text-red-600' : 'text-green-600'}`}>
                    {endpoint.errorRate}
                  </div>
                  <div className="text-muted-foreground">{isArabic ? 'أخطاء' : 'Errors'}</div>
                </div>
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* API Keys */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'مفاتيح API' : 'API Keys'}
          </div>
          {apiKeys.slice(0, 2).map((keyInfo, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {isArabic ? keyInfo.nameAr : keyInfo.name}
                  </span>
                </div>
                {getStatusBadge(keyInfo.status)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                <div>{keyInfo.key}</div>
                <div>{isArabic ? `آخر استخدام: ${keyInfo.lastUsed}` : `Last used: ${keyInfo.lastUsed}`}</div>
              </div>
              <div className="flex items-center gap-1">
                {keyInfo.permissions.map((permission, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold text-green-600">98.7%</span>
            </div>
            <div className="text-xs text-muted-foreground">{isArabic ? 'وقت التشغيل' : 'Uptime'}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-semibold text-blue-600">24.7K</span>
            </div>
            <div className="text-xs text-muted-foreground">{isArabic ? 'الطلبات اليوم' : 'Requests Today'}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Settings className="h-4 w-4 text-orange-600" />
              <span className="text-lg font-semibold text-orange-600">156ms</span>
            </div>
            <div className="text-xs text-muted-foreground">{isArabic ? 'متوسط الاستجابة' : 'Avg Response'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};