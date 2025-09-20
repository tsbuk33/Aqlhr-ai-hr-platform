import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import type { User } from '@supabase/supabase-js';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building,
  DollarSign,
  AlertCircle,
  Target,
  Award,
  Calendar,
  FileText,
  PieChart,
  Activity,
  Globe,
  Settings
} from 'lucide-react';

interface ExecutiveProfile {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  company: string;
}

interface ExecutiveMetric {
  id: string;
  title: string;
  titleAr: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

interface ExecutiveAlert {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
}

interface ExecutiveMobileAppProps {
  user?: User | null;
}

export const ExecutiveMobileApp: React.FC<ExecutiveMobileAppProps> = ({ user }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const [executive, setExecutive] = useState<ExecutiveProfile | null>(null);
  const [metrics, setMetrics] = useState<ExecutiveMetric[]>([]);
  const [alerts, setAlerts] = useState<ExecutiveAlert[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user) {
      loadExecutiveData();
    }
  }, [user]);

  const loadExecutiveData = () => {
    // Use actual user data
    setExecutive({
      id: user?.id || 'exec_001',
      name: user?.email?.split('@')[0] || 'Executive',
      nameAr: 'التنفيذي',
      title: 'Chief Executive Officer',
      titleAr: 'الرئيس التنفيذي',
      company: 'AqlHR Solutions'
    });

    // Mock metrics
    setMetrics([
      {
        id: 'metric_001',
        title: 'Total Employees',
        titleAr: 'إجمالي الموظفين',
        value: 1247,
        change: 8.5,
        trend: 'up',
        period: 'vs last month'
      },
      {
        id: 'metric_002',
        title: 'Employee Satisfaction',
        titleAr: 'رضا الموظفين',
        value: '94%',
        change: 2.1,
        trend: 'up',
        period: 'vs last quarter'
      },
      {
        id: 'metric_003',
        title: 'Turnover Rate',
        titleAr: 'معدل دوران الموظفين',
        value: '3.2%',
        change: -0.8,
        trend: 'down',
        period: 'vs last quarter'
      },
      {
        id: 'metric_004',
        title: 'Saudization Rate',
        titleAr: 'نسبة السعودة',
        value: '78%',
        change: 4.2,
        trend: 'up',
        period: 'vs target'
      },
      {
        id: 'metric_005',
        title: 'Training Hours',
        titleAr: 'ساعات التدريب',
        value: '15.6K',
        change: 12.3,
        trend: 'up',
        period: 'this month'
      },
      {
        id: 'metric_006',
        title: 'Performance Score',
        titleAr: 'نقاط الأداء',
        value: '4.7/5',
        change: 0.3,
        trend: 'up',
        period: 'company average'
      }
    ]);

    // Mock alerts
    setAlerts([
      {
        id: 'alert_001',
        title: 'Critical Compliance Issue',
        titleAr: 'مشكلة امتثال حرجة',
        description: 'Labour compliance report requires immediate attention',
        descriptionAr: 'تقرير الامتثال العمالي يتطلب اهتماماً فورياً',
        severity: 'critical',
        timestamp: new Date().toISOString()
      },
      {
        id: 'alert_002',
        title: 'Budget Variance Alert',
        titleAr: 'تنبيه انحراف الميزانية',
        description: 'HR budget exceeded by 15% this quarter',
        descriptionAr: 'تم تجاوز ميزانية الموارد البشرية بنسبة 15% هذا الربع',
        severity: 'warning',
        timestamp: new Date().toISOString()
      },
      {
        id: 'alert_003',
        title: 'New Regulation Update',
        titleAr: 'تحديث اللوائح الجديدة',
        description: 'Ministry of Labour released new guidelines',
        descriptionAr: 'وزارة العمل أصدرت إرشادات جديدة',
        severity: 'info',
        timestamp: new Date().toISOString()
      }
    ]);
  };


  const getTrendIcon = (trend: ExecutiveMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable':
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: ExecutiveMetric['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'stable':
        return 'text-blue-500';
    }
  };

  const getSeverityColor = (severity: ExecutiveAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getSeverityBadge = (severity: ExecutiveAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">{isArabic ? 'حرج' : 'Critical'}</Badge>;
      case 'warning':
        return <Badge variant="default">{isArabic ? 'تحذير' : 'Warning'}</Badge>;
      case 'info':
        return <Badge variant="secondary">{isArabic ? 'معلومات' : 'Info'}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              {isArabic ? 'تنفيذي - مطلوب تسجيل الدخول' : 'Executive - Authentication Required'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {isArabic ? 'يرجى تسجيل الدخول للوصول إلى تطبيق التنفيذي' : 'Please authenticate to access the Executive app'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-medium">
              {isArabic ? executive?.nameAr : executive?.name}
            </h2>
            <p className="text-xs opacity-90">
              {isArabic ? executive?.titleAr : executive?.title}
            </p>
            <p className="text-xs opacity-80">
              {executive?.company}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="dashboard" className="text-xs">
              {isArabic ? 'لوحة التحكم' : 'Dashboard'}
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs">
              {isArabic ? 'المقاييس' : 'Metrics'}
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">
              {isArabic ? 'التنبيهات' : 'Alerts'}
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">
              {isArabic ? 'الرؤى' : 'Insights'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-2 gap-3">
              {metrics.slice(0, 4).map((metric) => (
                <Card key={metric.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? metric.titleAr : metric.title}
                        </p>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <p className="text-xl font-bold">
                        {metric.value}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {metric.period}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Critical Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {isArabic ? 'التنبيهات الحرجة' : 'Critical Alerts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.filter(a => a.severity === 'critical').map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {isArabic ? alert.titleAr : alert.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isArabic ? alert.descriptionAr : alert.description}
                          </p>
                        </div>
                        {getSeverityBadge(alert.severity)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <FileText className="h-4 w-4 mb-1" />
                      <span className="text-xs">
                        {isArabic ? 'التقارير التنفيذية' : 'Executive Reports'}
                      </span>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <Target className="h-4 w-4 mb-1" />
                      <span className="text-xs">
                        {isArabic ? 'مراجعة الأهداف' : 'Goal Review'}
                      </span>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <Award className="h-4 w-4 mb-1" />
                      <span className="text-xs">
                        {isArabic ? 'الإنجازات' : 'Achievements'}
                      </span>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <Globe className="h-4 w-4 mb-1" />
                      <span className="text-xs">
                        {isArabic ? 'نظرة عامة' : 'Overview'}
                      </span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">
                          {isArabic ? metric.titleAr : metric.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold">
                            {metric.value}
                          </span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(metric.trend)}
                            <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                              {metric.change > 0 ? '+' : ''}{metric.change}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {metric.period}
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <PieChart className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className={getSeverityColor(alert.severity)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">
                          {isArabic ? alert.titleAr : alert.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isArabic ? alert.descriptionAr : alert.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-2">
                        {getSeverityBadge(alert.severity)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isArabic ? 'رؤى استراتيجية' : 'Strategic Insights'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        {isArabic ? 'اتجاه إيجابي' : 'Positive Trend'}
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      {isArabic 
                        ? 'رضا الموظفين في أعلى مستوياته منذ 3 سنوات'
                        : 'Employee satisfaction at highest level in 3 years'
                      }
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {isArabic ? 'تحقيق الهدف' : 'Goal Achievement'}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {isArabic 
                        ? 'نسبة السعودة تجاوزت الهدف المطلوب بـ 8%'
                        : 'Saudization rate exceeded target by 8%'
                      }
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        {isArabic ? 'يتطلب انتباه' : 'Requires Attention'}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      {isArabic 
                        ? 'تكاليف التدريب زادت 15% هذا الربع'
                        : 'Training costs increased 15% this quarter'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};