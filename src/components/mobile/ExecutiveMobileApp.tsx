import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import type { User } from '@supabase/supabase-js';
import { StrategicKPIDashboard } from './executive/StrategicKPIDashboard';
import { AIPoweredInsights } from './executive/AIPoweredInsights';
import { BoardReportGeneration } from './executive/BoardReportGeneration';
import { SecureDocumentAccess } from './executive/SecureDocumentAccess';
import { ExecutiveCalendar } from './executive/ExecutiveCalendar';
import { CrisisManagementTools } from './executive/CrisisManagementTools';
import { PredictiveAnalytics } from './executive/PredictiveAnalytics';
import { VoiceActivatedCommands } from './executive/VoiceActivatedCommands';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building,
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


  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable':
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'stable':
        return 'text-blue-500';
    }
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">{isArabic ? 'حرج' : 'Critical'}</Badge>;
      case 'warning':
        return <Badge variant="default">{isArabic ? 'تحذير' : 'Warning'}</Badge>;
      case 'info':
        return <Badge variant="secondary">{isArabic ? 'معلومات' : 'Info'}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {isArabic ? 'تحميل لوحة التحكم التنفيذية' : 'Loading Executive Dashboard'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? 'جاري تحميل البيانات التنفيذية...' : 'Loading executive data...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">
            {isArabic ? 'خطأ في تحميل البيانات' : 'Data Loading Error'}
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch}>
            {isArabic ? 'إعادة المحاولة' : 'Retry'}
          </Button>
        </div>
      </div>
    );
  }
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
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="dashboard" className="text-xs">
              {isArabic ? 'الرئيسية' : 'Home'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              {isArabic ? 'التحليلات' : 'Analytics'}
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs">
              {isArabic ? 'التقارير' : 'Reports'}
            </TabsTrigger>
            <TabsTrigger value="crisis" className="text-xs">
              {isArabic ? 'الأزمات' : 'Crisis'}
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-xs">
              {isArabic ? 'الصوت' : 'Voice'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <StrategicKPIDashboard isArabic={isArabic} />
            <AIPoweredInsights screenSize="mobile" />
            <ExecutiveCalendar isArabic={isArabic} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <PredictiveAnalytics isArabic={isArabic} expanded={true} />
            <StrategicKPIDashboard isArabic={isArabic} detailed={true} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <BoardReportGeneration isArabic={isArabic} expanded={true} />
            <SecureDocumentAccess isArabic={isArabic} userClearanceLevel={5} expanded={true} />
          </TabsContent>

          <TabsContent value="crisis" className="space-y-4">
            <CrisisManagementTools isArabic={isArabic} expanded={true} />
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <VoiceActivatedCommands isArabic={isArabic} expanded={true} />
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
              {insights.slice(0, 3).map((insight) => (
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