import React, { useState, useEffect } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  nameAr: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: any;
  threshold: {
    warning: number;
    critical: number;
  };
}

interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  network: number;
  database: number;
}

export const SystemPerformanceMonitoring: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      nameAr: 'استخدام المعالج',
      value: 45,
      unit: '%',
      status: 'good',
      trend: 'stable',
      icon: Cpu,
      threshold: { warning: 70, critical: 90 }
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      nameAr: 'استخدام الذاكرة',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      icon: HardDrive,
      threshold: { warning: 60, critical: 85 }
    },
    {
      id: 'disk',
      name: 'Disk Usage',
      nameAr: 'استخدام القرص',
      value: 32,
      unit: '%',
      status: 'good',
      trend: 'down',
      icon: Database,
      threshold: { warning: 75, critical: 90 }
    },
    {
      id: 'network',
      name: 'Network I/O',
      nameAr: 'دخل/خرج الشبكة',
      value: 156,
      unit: 'MB/s',
      status: 'good',
      trend: 'stable',
      icon: Wifi,
      threshold: { warning: 800, critical: 1000 }
    },
    {
      id: 'database',
      name: 'Database Connections',
      nameAr: 'اتصالات قاعدة البيانات',
      value: 47,
      unit: 'active',
      status: 'good',
      trend: 'up',
      icon: Server,
      threshold: { warning: 80, critical: 95 }
    },
    {
      id: 'response_time',
      name: 'Response Time',
      nameAr: 'وقت الاستجابة',
      value: 285,
      unit: 'ms',
      status: 'good',
      trend: 'down',
      icon: Clock,
      threshold: { warning: 500, critical: 1000 }
    }
  ]);

  const [performanceHistory] = useState<PerformanceData[]>([
    { timestamp: '10:00', cpu: 42, memory: 65, network: 150, database: 45 },
    { timestamp: '10:15', cpu: 38, memory: 67, network: 148, database: 48 },
    { timestamp: '10:30', cpu: 45, memory: 69, network: 152, database: 46 },
    { timestamp: '10:45', cpu: 41, memory: 66, network: 155, database: 49 },
    { timestamp: '11:00', cpu: 45, memory: 68, network: 156, database: 47 }
  ]);

  const [alertsCount] = useState({
    critical: 2,
    warning: 5,
    info: 12
  });

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update metrics with random variations
    setSystemMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, metric.value + (Math.random() - 0.5) * 10),
      status: metric.value > metric.threshold.critical ? 'critical' :
              metric.value > metric.threshold.warning ? 'warning' : 'good'
    })));
    
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMetrics();
    }, 30000); // Auto refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {isArabic ? 'مراقبة أداء النظام' : 'System Performance Monitoring'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshMetrics}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isArabic ? 'تحديث' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'آخر تحديث:' : 'Last updated:'} {lastUpdated.toLocaleTimeString()}
            </div>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{alertsCount.critical}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'حرج' : 'Critical'}</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{alertsCount.warning}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'تحذير' : 'Warning'}</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{alertsCount.info}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'معلومات' : 'Info'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="space-y-3">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);
          
          return (
            <Card key={metric.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-sm">
                        {isArabic ? metric.nameAr : metric.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold">
                          {metric.value.toFixed(0)} {metric.unit}
                        </span>
                        <TrendIcon className={`h-3 w-3 ${getTrendColor(metric.trend)}`} />
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={getStatusBadgeColor(metric.status)}>
                    {isArabic 
                      ? metric.status === 'good' ? 'جيد'
                        : metric.status === 'warning' ? 'تحذير' : 'حرج'
                      : metric.status
                    }
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Progress 
                    value={Math.min(100, (metric.value / (metric.threshold.critical * 1.2)) * 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 {metric.unit}</span>
                    <span className="text-yellow-600">
                      ⚠ {metric.threshold.warning} {metric.unit}
                    </span>
                    <span className="text-red-600">
                      🚨 {metric.threshold.critical} {metric.unit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'سجل الأداء' : 'Performance History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceHistory.slice(-3).map((data, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{data.timestamp}</span>
                  <div className="flex items-center gap-2">
                    {data.cpu > 70 && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {data.cpu <= 70 && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>CPU: {data.cpu}%</div>
                  <div>Memory: {data.memory}%</div>
                  <div>Network: {data.network} MB/s</div>
                  <div>DB: {data.database} conn</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};