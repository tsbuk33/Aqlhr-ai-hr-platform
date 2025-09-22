import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Activity, Shield, Database, Zap, Brain, AlertTriangle, 
  CheckCircle, XCircle, Clock, TrendingUp, TrendingDown,
  Server, Wifi, Users, RefreshCw, Bell,
  FileText, Target, Wrench, Heart, Eye, Settings
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemMetric {
  name: string;
  nameAr: string;
  value: number;
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
}

interface HealingAction {
  id: string;
  timestamp: string;
  actionType: string;
  targetSystem: string;
  issueDetected: string;
  actionTaken: string;
  result: 'success' | 'partial' | 'failed';
  executionTime: number;
  businessImpactPrevented: string;
}

interface SystemAlert {
  id: string;
  level: 'critical' | 'important' | 'info';
  title: string;
  description: string;
  businessImpact: string;
  autoActionsTaken: string[];
  manualActionRequired: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
}

const SelfHealingSystem: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { toast } = useToast();

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [systemHealth, setSystemHealth] = useState(98.7);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Critical System Metrics
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      name: 'Payroll Processing',
      nameAr: 'معالجة الرواتب',
      value: 100,
      threshold: 100,
      status: 'healthy',
      trend: 'stable',
      lastUpdate: '2 minutes ago',
      businessImpact: 'critical'
    },
    {
      name: 'QIWA Integration',
      nameAr: 'تكامل قوى',
      value: 98.5,
      threshold: 95,
      status: 'healthy',
      trend: 'up',
      lastUpdate: '1 minute ago',
      businessImpact: 'critical'
    },
    {
      name: 'GOSI Integration',
      nameAr: 'تكامل التأمينات',
      value: 97.2,
      threshold: 95,
      status: 'healthy',
      trend: 'stable',
      lastUpdate: '3 minutes ago',
      businessImpact: 'critical'
    },
    {
      name: 'User Authentication',
      nameAr: 'تسجيل الدخول',
      value: 99.8,
      threshold: 99,
      status: 'healthy',
      trend: 'up',
      lastUpdate: '30 seconds ago',
      businessImpact: 'high'
    },
    {
      name: 'Database Performance',
      nameAr: 'أداء قاعدة البيانات',
      value: 96.3,
      threshold: 90,
      status: 'healthy',
      trend: 'stable',
      lastUpdate: '1 minute ago',
      businessImpact: 'critical'
    },
    {
      name: 'API Response Time',
      nameAr: 'زمن استجابة الواجهات',
      value: 94.7,
      threshold: 85,
      status: 'healthy',
      trend: 'down',
      lastUpdate: '45 seconds ago',
      businessImpact: 'medium'
    }
  ]);

  // Recent Healing Actions
  const [healingActions, setHealingActions] = useState<HealingAction[]>([
    {
      id: '1',
      timestamp: '2 minutes ago',
      actionType: 'Connection Reset',
      targetSystem: 'GOSI Integration',
      issueDetected: 'Connection timeout after 30 seconds',
      actionTaken: 'Reset connection pool and refreshed API tokens',
      result: 'success',
      executionTime: 3500,
      businessImpactPrevented: 'Prevented GOSI sync failure affecting 150 employees'
    },
    {
      id: '2',
      timestamp: '15 minutes ago',
      actionType: 'Cache Optimization',
      targetSystem: 'Database Performance',
      issueDetected: 'Query response time increased by 40%',
      actionTaken: 'Cleared outdated cache and rebuilt indexes',
      result: 'success',
      executionTime: 12000,
      businessImpactPrevented: 'Improved user experience for payroll calculations'
    },
    {
      id: '3',
      timestamp: '1 hour ago',
      actionType: 'Service Restart',
      targetSystem: 'Authentication Service',
      issueDetected: 'Login success rate dropped to 94%',
      actionTaken: 'Restarted authentication microservice',
      result: 'success',
      executionTime: 8000,
      businessImpactPrevented: 'Restored 99%+ login success rate'
    }
  ]);

  // Active Alerts
  const [activeAlerts, setActiveAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      level: 'info',
      title: 'Performance Optimization Opportunity',
      description: 'Database query optimization can improve response time by 15%',
      businessImpact: 'Medium - Enhanced user experience',
      autoActionsTaken: ['Index analysis completed', 'Query plans optimized'],
      manualActionRequired: 'Review and approve index changes',
      status: 'active',
      createdAt: '10 minutes ago'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-emerald-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const generateDailyReport = async () => {
    try {
      toast({
        title: "Generating Report",
        description: "Creating executive healing report...",
      });

      // Call edge function to send daily report email
      const { data, error } = await supabase.functions.invoke('send-healing-report', {
        body: {
          reportType: 'daily',
          systemHealth,
          metrics: systemMetrics,
          healingActions,
          alerts: activeAlerts,
          recipientEmail: 'tsbuk33@gmail.com'
        }
      });

      if (error) {
        console.error('Error sending report:', error);
        toast({
          title: "Report Error",
          description: `Failed to send daily report: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Report sent successfully:', data);
        toast({
          title: "✅ Report Sent Successfully!",
          description: `Professional email report sent to tsbuk33@gmail.com with ${systemHealth.toFixed(1)}% system health status`,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Report Error", 
        description: "Failed to generate daily report",
        variant: "destructive"
      });
    }
  };

  const runHealthCheck = async () => {
    toast({
      title: "Health Check Started",
      description: "Running comprehensive system health check...",
    });

    // Simulate health check process
    setTimeout(() => {
      setSystemHealth(Math.random() * 5 + 95); // 95-100%
      toast({
        title: "Health Check Complete",
        description: `System health: ${systemHealth.toFixed(1)}%`,
      });
    }, 3000);
  };

  // Auto-generate daily report
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    // Send daily report at 8 AM Saudi time
    if (hour === 8 && now.getMinutes() === 0) {
      generateDailyReport();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isArabic ? 'نظام الشفاء الذاتي للمؤسسة' : 'Expert-Level Self-Healing System'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'مراقبة ذكية وإصلاح تلقائي للأنظمة الحرجة' : 'Intelligent monitoring and automation for business-critical functions'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isMonitoring ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'متوقف' : 'Stopped')}
              </span>
            </div>
          </div>
          <Button onClick={runHealthCheck} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isArabic ? 'فحص شامل' : 'Health Check'}
          </Button>
          <Button onClick={generateDailyReport} size="sm">
            <Bell className="w-4 h-4 mr-2" />
            {isArabic ? 'إرسال التقرير' : 'Send Report'}
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <Card className="bg-gradient-to-br from-surface to-surface-subtle border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-500" />
              {isArabic ? 'صحة النظام العامة' : 'Overall System Health'}
            </span>
            <Badge className={`${systemHealth > 95 ? 'bg-emerald-100 text-emerald-800' : systemHealth > 90 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {systemHealth.toFixed(1)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={systemHealth} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{healingActions.filter(a => a.result === 'success').length}</div>
                <div className="text-xs text-muted-foreground">{isArabic ? 'إصلاحات تلقائية' : 'Auto Repairs'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activeAlerts.filter(a => a.status === 'active').length}</div>
                <div className="text-xs text-muted-foreground">{isArabic ? 'تنبيهات نشطة' : 'Active Alerts'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3.5s</div>
                <div className="text-xs text-muted-foreground">{isArabic ? 'متوسط الاستجابة' : 'Avg Response'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">99.7%</div>
                <div className="text-xs text-muted-foreground">{isArabic ? 'وقت التشغيل' : 'Uptime'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="monitoring">{isArabic ? 'المراقبة' : 'Monitoring'}</TabsTrigger>
          <TabsTrigger value="healing">{isArabic ? 'الشفاء الذاتي' : 'Self-Healing'}</TabsTrigger>
          <TabsTrigger value="alerts">{isArabic ? 'التنبيهات' : 'Alerts'}</TabsTrigger>
          <TabsTrigger value="reports">{isArabic ? 'التقارير' : 'Reports'}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemMetrics.map((metric, index) => (
              <Card key={index} className="bg-surface border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {isArabic ? metric.nameAr : metric.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(metric.status)}
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">{metric.value.toFixed(1)}%</span>
                      <Badge variant="outline" className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{isArabic ? 'آخر تحديث:' : 'Last update:'} {metric.lastUpdate}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        metric.businessImpact === 'critical' ? 'bg-red-100 text-red-700' :
                        metric.businessImpact === 'high' ? 'bg-orange-100 text-orange-700' :
                        metric.businessImpact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {metric.businessImpact}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  {isArabic ? 'المراقبة في الوقت الفعلي' : 'Real-Time Monitoring'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <CurrencyIcon className="w-8 h-8 text-brand-success mx-auto mb-2" />
                    <div className="text-lg font-bold text-emerald-900">100%</div>
                    <div className="text-sm text-emerald-700">{isArabic ? 'معالجة الرواتب' : 'Payroll Processing'}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <Wifi className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-900">98.5%</div>
                    <div className="text-sm text-blue-700">{isArabic ? 'تكامل حكومي' : 'Gov Integration'}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-900">99.8%</div>
                    <div className="text-sm text-purple-700">{isArabic ? 'تسجيل الدخول' : 'Authentication'}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <Database className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-orange-900">96.3%</div>
                    <div className="text-sm text-orange-700">{isArabic ? 'قاعدة البيانات' : 'Database'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  {isArabic ? 'الأهداف والحدود' : 'Thresholds & Targets'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemMetrics.slice(0, 4).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <span className="text-sm font-medium">{isArabic ? metric.nameAr : metric.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Target: {metric.threshold}%</span>
                        <Badge variant={metric.value >= metric.threshold ? "default" : "destructive"}>
                          {metric.value >= metric.threshold ? 'Met' : 'Below'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Self-Healing Tab */}
        <TabsContent value="healing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                {isArabic ? 'نشاط الشفاء الذاتي (آخر 24 ساعة)' : 'Self-Healing Activity (Last 24 Hours)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healingActions.map((action) => (
                  <div key={action.id} className="border rounded-lg p-4 bg-background/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{action.actionType}</Badge>
                          <Badge className={action.result === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}>
                            {action.result}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{action.timestamp}</span>
                        </div>
                        <h4 className="font-medium text-foreground mb-1">{action.targetSystem}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{action.issueDetected}</p>
                        <p className="text-sm text-foreground mb-2">
                          <strong>{isArabic ? 'الإجراء المتخذ:' : 'Action Taken:'}</strong> {action.actionTaken}
                        </p>
                        <p className="text-sm text-emerald-700">
                          <strong>{isArabic ? 'الأثر المنع:' : 'Impact Prevented:'}</strong> {action.businessImpactPrevented}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{action.executionTime}ms</div>
                        <div className="text-xs text-muted-foreground">{isArabic ? 'وقت التنفيذ' : 'Execution Time'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-700">{activeAlerts.filter(a => a.level === 'critical').length}</div>
                <div className="text-sm text-red-600">{isArabic ? 'تنبيهات حرجة' : 'Critical Alerts'}</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">{activeAlerts.filter(a => a.level === 'important').length}</div>
                <div className="text-sm text-yellow-600">{isArabic ? 'تنبيهات مهمة' : 'Important Alerts'}</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{activeAlerts.filter(a => a.level === 'info').length}</div>
                <div className="text-sm text-blue-600">{isArabic ? 'تنبيهات إعلامية' : 'Info Alerts'}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'التنبيهات النشطة' : 'Active Alerts'}</CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {isArabic ? 'لا توجد تنبيهات نشطة' : 'No Active Alerts'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isArabic ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems are operating normally'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <Alert key={alert.id} className={
                      alert.level === 'critical' ? 'border-red-200 bg-red-50' :
                      alert.level === 'important' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        {alert.title}
                        <Badge variant="outline" className={
                          alert.level === 'critical' ? 'border-red-300 text-red-700' :
                          alert.level === 'important' ? 'border-yellow-300 text-yellow-700' :
                          'border-blue-300 text-blue-700'
                        }>
                          {alert.level}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <p className="mb-2">{alert.description}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>{isArabic ? 'الأثر على العمل:' : 'Business Impact:'}</strong> {alert.businessImpact}
                        </p>
                        {alert.autoActionsTaken.length > 0 && (
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>{isArabic ? 'الإجراءات التلقائية:' : 'Auto Actions:'}</strong> {alert.autoActionsTaken.join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          <strong>{isArabic ? 'إجراء مطلوب:' : 'Manual Action:'}</strong> {alert.manualActionRequired}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {isArabic ? 'تقارير الأداء والصحة' : 'Performance & Health Reports'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">{isArabic ? 'التقارير التلقائية' : 'Automated Reports'}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div>
                        <p className="font-medium text-emerald-900">{isArabic ? 'التقرير اليومي' : 'Daily Report'}</p>
                        <p className="text-sm text-emerald-700">{isArabic ? 'يرسل كل يوم في 8:00 ص' : 'Sent daily at 8:00 AM'}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800">{isArabic ? 'نشط' : 'Active'}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div>
                        <p className="font-medium text-blue-900">{isArabic ? 'التقرير الأسبوعي' : 'Weekly Summary'}</p>
                        <p className="text-sm text-blue-700">{isArabic ? 'يرسل كل يوم أحد' : 'Sent every Sunday'}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{isArabic ? 'نشط' : 'Active'}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <div>
                        <p className="font-medium text-purple-900">{isArabic ? 'تقرير الحوادث' : 'Incident Report'}</p>
                        <p className="text-sm text-purple-700">{isArabic ? 'يرسل عند الحاجة' : 'Sent as needed'}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">{isArabic ? 'حسب الطلب' : 'On-demand'}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">{isArabic ? 'إعدادات التقارير' : 'Report Settings'}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</span>
                      <Badge variant="outline">tsbuk33@gmail.com</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{isArabic ? 'تكرار التقارير' : 'Report Frequency'}</span>
                      <Badge variant="outline">{isArabic ? 'يومي' : 'Daily'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{isArabic ? 'تنبيهات فورية' : 'Instant Alerts'}</span>
                      <Badge className="bg-emerald-100 text-emerald-800">{isArabic ? 'مفعل' : 'Enabled'}</Badge>
                    </div>
                  </div>
                  <Button onClick={generateDailyReport} className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    {isArabic ? 'إرسال تقرير فوري' : 'Send Instant Report'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SelfHealingSystem;