import React, { useState, useEffect } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Database,
  Server,
  Globe,
  Mail,
  Shield,
  Zap,
  RefreshCw,
  Activity,
  HardDrive
} from 'lucide-react';

interface HealthCheck {
  id: string;
  name: string;
  nameAr: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  responseTime: number;
  lastCheck: string;
  uptime: number;
  icon: any;
  description: string;
  descriptionAr: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  messageAr: string;
  timestamp: string;
  resolved: boolean;
}

export const SystemHealthMonitoring: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    {
      id: 'database',
      name: 'Database Connection',
      nameAr: 'اتصال قاعدة البيانات',
      status: 'healthy',
      responseTime: 45,
      lastCheck: '2 minutes ago',
      uptime: 99.8,
      icon: Database,
      description: 'Primary database connection is stable',
      descriptionAr: 'اتصال قاعدة البيانات الأساسية مستقر'
    },
    {
      id: 'api',
      name: 'API Services',
      nameAr: 'خدمات API',
      status: 'healthy',
      responseTime: 120,
      lastCheck: '1 minute ago',
      uptime: 99.95,
      icon: Server,
      description: 'All API endpoints responding normally',
      descriptionAr: 'جميع نقاط API تستجيب بشكل طبيعي'
    },
    {
      id: 'auth',
      name: 'Authentication Service',
      nameAr: 'خدمة المصادقة',
      status: 'warning',
      responseTime: 340,
      lastCheck: '3 minutes ago',
      uptime: 98.2,
      icon: Shield,
      description: 'Slower than usual response times detected',
      descriptionAr: 'تم اكتشاف أوقات استجابة أبطأ من المعتاد'
    },
    {
      id: 'email',
      name: 'Email Service',
      nameAr: 'خدمة البريد الإلكتروني',
      status: 'healthy',
      responseTime: 890,
      lastCheck: '5 minutes ago',
      uptime: 99.1,
      icon: Mail,
      description: 'Email delivery is functioning properly',
      descriptionAr: 'تسليم البريد الإلكتروني يعمل بشكل صحيح'
    },
    {
      id: 'cdn',
      name: 'CDN & Assets',
      nameAr: 'شبكة التوصيل والأصول',
      status: 'healthy',
      responseTime: 76,
      lastCheck: '1 minute ago',
      uptime: 99.9,
      icon: Globe,
      description: 'Content delivery network is optimal',
      descriptionAr: 'شبكة توصيل المحتوى مثلى'
    },
    {
      id: 'backup',
      name: 'Backup Systems',
      nameAr: 'أنظمة النسخ الاحتياطي',
      status: 'critical',
      responseTime: 0,
      lastCheck: '2 hours ago',
      uptime: 87.5,
      icon: HardDrive,
      description: 'Backup service is currently offline',
      descriptionAr: 'خدمة النسخ الاحتياطي غير متصلة حالياً'
    }
  ]);

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'error',
      message: 'Backup service connection lost',
      messageAr: 'فقدان اتصال خدمة النسخ الاحتياطي',
      timestamp: '10 minutes ago',
      resolved: false
    },
    {
      id: '2',
      type: 'warning',
      message: 'Authentication service response time degraded',
      messageAr: 'تدهور وقت استجابة خدمة المصادقة',
      timestamp: '15 minutes ago',
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      message: 'Scheduled maintenance completed successfully',
      messageAr: 'تمت الصيانة المجدولة بنجاح',
      timestamp: '2 hours ago',
      resolved: true
    }
  ]);

  const [overallHealth, setOverallHealth] = useState({
    score: 85,
    status: 'warning' as 'healthy' | 'warning' | 'critical',
    services: {
      operational: 4,
      degraded: 1,
      offline: 1
    }
  });

  const refreshHealthChecks = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update health checks with simulated data
    setHealthChecks(prev => prev.map(check => ({
      ...check,
      responseTime: Math.max(10, check.responseTime + (Math.random() - 0.5) * 100),
      lastCheck: 'Just now',
      status: Math.random() > 0.8 ? 'warning' : 
              Math.random() > 0.95 ? 'critical' : 'healthy'
    })));
    
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Calculate overall health based on individual services
    const healthyCount = healthChecks.filter(check => check.status === 'healthy').length;
    const warningCount = healthChecks.filter(check => check.status === 'warning').length;
    const criticalCount = healthChecks.filter(check => check.status === 'critical').length;
    
    const totalServices = healthChecks.length;
    const score = ((healthyCount * 100) + (warningCount * 50)) / totalServices;
    
    setOverallHealth({
      score: Math.round(score),
      status: criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy',
      services: {
        operational: healthyCount,
        degraded: warningCount,
        offline: criticalCount
      }
    });
  }, [healthChecks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return CheckCircle;
      default: return Clock;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {isArabic ? 'مراقبة صحة النظام' : 'System Health Monitoring'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshHealthChecks}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isArabic ? 'تحديث' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Overall Health Score */}
          <div className="text-center mb-4">
            <div className={`text-4xl font-bold mb-2 ${getStatusColor(overallHealth.status)}`}>
              {overallHealth.score}%
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              {isArabic ? 'الصحة العامة للنظام' : 'Overall System Health'}
            </div>
            <Progress value={overallHealth.score} className="h-3" />
            <div className="text-xs text-muted-foreground mt-2">
              {isArabic ? 'آخر تحديث:' : 'Last updated:'} {lastUpdated.toLocaleTimeString()}
            </div>
          </div>

          {/* Service Status Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{overallHealth.services.operational}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'تعمل' : 'Operational'}</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{overallHealth.services.degraded}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'متدهورة' : 'Degraded'}</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{overallHealth.services.offline}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'غير متصلة' : 'Offline'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Checks */}
      <div className="space-y-3">
        {healthChecks.map((check) => {
          const Icon = check.icon;
          const StatusIcon = getStatusIcon(check.status);
          
          return (
            <Card key={check.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-sm">
                        {isArabic ? check.nameAr : check.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isArabic ? check.descriptionAr : check.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 ${getStatusColor(check.status)}`} />
                    <Badge className={getStatusBadgeColor(check.status)}>
                      {isArabic 
                        ? check.status === 'healthy' ? 'سليم'
                          : check.status === 'warning' ? 'تحذير' : 'حرج'
                        : check.status
                      }
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">
                      {isArabic ? 'وقت الاستجابة:' : 'Response:'}
                    </span>
                    <div className="font-medium">{check.responseTime}ms</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {isArabic ? 'وقت التشغيل:' : 'Uptime:'}
                    </span>
                    <div className="font-medium">{check.uptime}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {isArabic ? 'آخر فحص:' : 'Last check:'}
                    </span>
                    <div className="font-medium">{check.lastCheck}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'التنبيهات الأخيرة' : 'Recent Alerts'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              
              return (
                <div key={alert.id} className={`p-3 rounded-lg ${alert.resolved ? 'opacity-60' : ''} ${
                  alert.type === 'error' ? 'bg-red-50' :
                  alert.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertIcon className={`h-4 w-4 mt-0.5 ${getAlertColor(alert.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {isArabic ? alert.messageAr : alert.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        {alert.resolved && (
                          <Badge variant="outline" className="text-xs">
                            {isArabic ? 'محلول' : 'Resolved'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};