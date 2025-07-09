import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Monitor,
  Wifi,
  HardDrive
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PerformanceMetric {
  name: string;
  nameAr: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: Array<{ time: string; value: number; }>;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  messageAr: string;
  timestamp: string;
  resolved: boolean;
}

export const PerformanceMonitor = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'CPU Usage',
      nameAr: 'استخدام المعالج',
      value: 23.5,
      unit: '%',
      threshold: 80,
      status: 'good',
      trend: 'stable',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 30 + 15
      }))
    },
    {
      name: 'Memory Usage',
      nameAr: 'استخدام الذاكرة',
      value: 67.2,
      unit: '%',
      threshold: 85,
      status: 'good',
      trend: 'up',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 20 + 60
      }))
    },
    {
      name: 'Database Response Time',
      nameAr: 'زمن استجابة قاعدة البيانات',
      value: 45,
      unit: 'ms',
      threshold: 200,
      status: 'good',
      trend: 'down',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 50 + 30
      }))
    },
    {
      name: 'API Response Time',
      nameAr: 'زمن استجابة API',
      value: 120,
      unit: 'ms',
      threshold: 500,
      status: 'good',
      trend: 'stable',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 100 + 80
      }))
    },
    {
      name: 'Network Latency',
      nameAr: 'زمن استجابة الشبكة',
      value: 28,
      unit: 'ms',
      threshold: 100,
      status: 'good',
      trend: 'stable',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 30 + 20
      }))
    },
    {
      name: 'Disk Usage',
      nameAr: 'استخدام القرص الصلب',
      value: 45.8,
      unit: '%',
      threshold: 90,
      status: 'good',
      trend: 'up',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 10 + 40
      }))
    },
    {
      name: 'Active Users',
      nameAr: 'المستخدمون النشطون',
      value: 142,
      unit: 'users',
      threshold: 1000,
      status: 'good',
      trend: 'up',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 50 + 120
      }))
    },
    {
      name: 'Error Rate',
      nameAr: 'معدل الأخطاء',
      value: 0.8,
      unit: '%',
      threshold: 5,
      status: 'good',
      trend: 'down',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 2
      }))
    }
  ]);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'info',
      message: 'Performance monitoring started',
      messageAr: 'بدأت مراقبة الأداء',
      timestamp: new Date().toISOString(),
      resolved: false
    },
    {
      id: '2',
      type: 'warning',
      message: 'High memory usage detected on server-02',
      messageAr: 'تم اكتشاف استخدام عالي للذاكرة على الخادم-02',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      resolved: true
    }
  ]);

  const updateMetrics = useCallback(() => {
    setMetrics(prev => prev.map(metric => {
      // Simulate real-time updates
      const variation = (Math.random() - 0.5) * 0.1;
      const newValue = Math.max(0, metric.value + metric.value * variation);
      
      // Update status based on threshold
      let status: 'good' | 'warning' | 'critical' = 'good';
      if (newValue > metric.threshold * 0.8) status = 'warning';
      if (newValue > metric.threshold) status = 'critical';
      
      // Update trend
      const lastValue = metric.history[metric.history.length - 1]?.value || metric.value;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (newValue > lastValue * 1.05) trend = 'up';
      else if (newValue < lastValue * 0.95) trend = 'down';

      // Add new history point
      const newHistory = [
        ...metric.history.slice(1),
        { time: new Date().toISOString(), value: newValue }
      ];

      return {
        ...metric,
        value: newValue,
        status,
        trend,
        history: newHistory
      };
    }));
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(updateMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [isMonitoring, refreshInterval, updateMetrics]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-warning" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-success" />;
      default: return <div className="h-3 w-3 bg-muted rounded-full" />;
    }
  };

  const getMetricIcon = (name: string) => {
    if (name.toLowerCase().includes('cpu')) return <Cpu className="h-5 w-5" />;
    if (name.toLowerCase().includes('memory')) return <Monitor className="h-5 w-5" />;
    if (name.toLowerCase().includes('database')) return <Database className="h-5 w-5" />;
    if (name.toLowerCase().includes('api')) return <Globe className="h-5 w-5" />;
    if (name.toLowerCase().includes('network')) return <Wifi className="h-5 w-5" />;
    if (name.toLowerCase().includes('disk')) return <HardDrive className="h-5 w-5" />;
    if (name.toLowerCase().includes('users')) return <Activity className="h-5 w-5" />;
    return <BarChart3 className="h-5 w-5" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      good: 'default',
      warning: 'secondary',
      critical: 'destructive'
    } as const;

    const labels = {
      good: isRTL ? 'جيد' : 'Good',
      warning: isRTL ? 'تحذير' : 'Warning',
      critical: isRTL ? 'حرج' : 'Critical'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const criticalMetrics = metrics.filter(m => m.status === 'critical');
  const warningMetrics = metrics.filter(m => m.status === 'warning');

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Monitoring Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {isRTL ? 'مراقبة الأداء في الوقت الفعلي' : 'Real-time Performance Monitoring'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'مراقبة مستمرة لأداء النظام والتنبيهات' : 'Continuous system performance monitoring and alerts'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isMonitoring ? "default" : "outline"}
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="gap-2"
              >
                <Activity className="h-4 w-4" />
                {isMonitoring ? (isRTL ? 'إيقاف' : 'Stop') : (isRTL ? 'بدء' : 'Start')}
              </Button>
            </div>
          </div>
        </CardHeader>
        {(criticalMetrics.length > 0 || warningMetrics.length > 0) && (
          <CardContent>
            <Alert className={criticalMetrics.length > 0 ? "border-destructive" : "border-warning"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {criticalMetrics.length > 0 ? (
                  isRTL ? `${criticalMetrics.length} مقاييس في حالة حرجة` : `${criticalMetrics.length} metrics in critical state`
                ) : (
                  isRTL ? `${warningMetrics.length} مقاييس تحتاج للمراقبة` : `${warningMetrics.length} metrics need attention`
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getMetricIcon(metric.name)}
                  <CardTitle className="text-sm font-medium">
                    {isRTL ? metric.nameAr : metric.name}
                  </CardTitle>
                </div>
                {getStatusBadge(metric.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value.toFixed(1)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {metric.unit}
                    </span>
                  </span>
                  {getTrendIcon(metric.trend)}
                </div>
                
                <Progress 
                  value={(metric.value / metric.threshold) * 100} 
                  className="h-2"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{isRTL ? 'الحد الأقصى' : 'Threshold'}: {metric.threshold}{metric.unit}</span>
                </div>

                <div className="h-16 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metric.history.slice(-10)}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={metric.status === 'critical' ? '#ef4444' : 
                               metric.status === 'warning' ? '#f59e0b' : '#10b981'}
                        fill={metric.status === 'critical' ? '#ef444420' : 
                              metric.status === 'warning' ? '#f59e0b20' : '#10b98120'}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="charts">{isRTL ? 'الرسوم البيانية' : 'Charts'}</TabsTrigger>
          <TabsTrigger value="alerts">{isRTL ? 'التنبيهات' : 'Alerts'}</TabsTrigger>
          <TabsTrigger value="settings">{isRTL ? 'الإعدادات' : 'Settings'}</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metrics.slice(0, 4).map((metric) => (
              <Card key={metric.name}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getMetricIcon(metric.name)}
                    {isRTL ? metric.nameAr : metric.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="time" 
                          tickFormatter={(time) => new Date(time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(time) => new Date(time).toLocaleString()}
                          formatter={(value: number) => [`${value.toFixed(1)} ${metric.unit}`, isRTL ? metric.nameAr : metric.name]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={metric.status === 'critical' ? '#ef4444' : 
                                 metric.status === 'warning' ? '#f59e0b' : '#10b981'}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={
                alert.type === 'error' ? 'border-destructive' :
                alert.type === 'warning' ? 'border-warning' : 'border-info'
              }>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {alert.type === 'error' && <AlertTriangle className="h-4 w-4 text-destructive mt-1" />}
                    {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-warning mt-1" />}
                    {alert.type === 'info' && <CheckCircle className="h-4 w-4 text-info mt-1" />}
                    <div>
                      <AlertDescription className="font-medium">
                        {isRTL ? alert.messageAr : alert.message}
                      </AlertDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={alert.resolved ? "outline" : "secondary"}>
                    {alert.resolved ? (isRTL ? 'تم الحل' : 'Resolved') : (isRTL ? 'نشط' : 'Active')}
                  </Badge>
                </div>
              </Alert>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إعدادات المراقبة' : 'Monitoring Settings'}</CardTitle>
              <CardDescription>
                {isRTL ? 'تخصيص فترات التحديث والتنبيهات' : 'Customize refresh intervals and alerts'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {isRTL ? 'فترة التحديث' : 'Refresh Interval'}
                  </label>
                  <select 
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value={1000}>1 {isRTL ? 'ثانية' : 'second'}</option>
                    <option value={5000}>5 {isRTL ? 'ثواني' : 'seconds'}</option>
                    <option value={10000}>10 {isRTL ? 'ثواني' : 'seconds'}</option>
                    <option value={30000}>30 {isRTL ? 'ثانية' : 'seconds'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {isRTL ? 'حالة المراقبة' : 'Monitoring Status'}
                  </label>
                  <div className="mt-1">
                    <Badge variant={isMonitoring ? "default" : "secondary"}>
                      {isMonitoring ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'متوقف' : 'Stopped')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};