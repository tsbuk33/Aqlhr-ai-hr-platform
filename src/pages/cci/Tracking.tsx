import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users,
  BarChart3,
  Target,
  RefreshCw,
  Play
} from 'lucide-react';
import { useLocale } from '@/i18n/locale';

const Tracking: React.FC = () => {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  const pulseWaves = [
    {
      wave: '30-day',
      title: isArabic ? 'موجة الـ 30 يوم' : '30-Day Pulse',
      status: 'completed',
      responseRate: 78,
      lastRun: '2024-01-15',
      nextRun: '2024-02-14',
      participants: 247,
      insights: 12
    },
    {
      wave: '60-day',
      title: isArabic ? 'موجة الـ 60 يوم' : '60-Day Pulse',
      status: 'in-progress',
      responseRate: 45,
      lastRun: '2024-01-10',
      nextRun: '2024-03-10',
      participants: 189,
      insights: 8
    },
    {
      wave: '90-day',
      title: isArabic ? 'موجة الـ 90 يوم' : '90-Day Pulse',
      status: 'scheduled',
      responseRate: 0,
      lastRun: null,
      nextRun: '2024-04-10',
      participants: 0,
      insights: 0
    }
  ];

  const adoptionMetrics = [
    {
      initiative: isArabic ? 'تعزيز الشفافية' : 'Transparency Enhancement',
      progress: 68,
      target: 80,
      trend: 'up',
      adoptionRate: 72,
      resistance: 15
    },
    {
      initiative: isArabic ? 'برنامج القيادة التحويلية' : 'Transformational Leadership',
      progress: 45,
      target: 75,
      trend: 'up',
      adoptionRate: 58,
      resistance: 28
    },
    {
      initiative: isArabic ? 'تعزيز الأمان النفسي' : 'Psychological Safety',
      progress: 82,
      target: 85,
      trend: 'up',
      adoptionRate: 89,
      resistance: 8
    },
    {
      initiative: isArabic ? 'إعادة تصميم المكافآت' : 'Rewards Redesign',
      progress: 25,
      target: 60,
      trend: 'down',
      adoptionRate: 34,
      resistance: 42
    }
  ];

  const culturalIndicators = [
    {
      indicator: isArabic ? 'درجة التوازن الثقافي' : 'Culture Balance Score',
      current: 78,
      baseline: 65,
      target: 85,
      change: '+13'
    },
    {
      indicator: isArabic ? 'مؤشر الأمان النفسي' : 'Psychological Safety Index',
      current: 82,
      baseline: 71,
      target: 90,
      change: '+11'
    },
    {
      indicator: isArabic ? 'محاذاة القيم' : 'Values Alignment',
      current: 65,
      baseline: 52,
      target: 80,
      change: '+13'
    },
    {
      indicator: isArabic ? 'مشاركة الموظفين' : 'Employee Engagement',
      current: 74,
      baseline: 68,
      target: 85,
      change: '+6'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'scheduled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return isArabic ? 'مكتمل' : 'Completed';
      case 'in-progress': return isArabic ? 'قيد التنفيذ' : 'In Progress';
      case 'scheduled': return isArabic ? 'مجدول' : 'Scheduled';
      default: return status;
    }
  };

  return (
    <div className={`min-h-screen bg-background p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? 'تتبع النبضات والتبني' : 'Pulse Tracking & Adoption'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic ? 'عقل للموارد البشرية - موجات 30/60/90 ومقاييس التبني' : 'AqlHR — 30/60/90 Pulse Waves & Adoption Metrics'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Play className="mr-2 h-4 w-4" />
              {isArabic ? 'تشغيل النبضة' : 'Run Pulse'}
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {isArabic ? 'تحديث البيانات' : 'Refresh Data'}
            </Button>
          </div>
        </div>

        {/* Pulse Waves Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pulseWaves.map((wave, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{wave.title}</CardTitle>
                  <Badge variant={getStatusColor(wave.status)}>
                    {getStatusText(wave.status)}
                  </Badge>
                </div>
                <CardDescription>
                  {isArabic ? 'آخر تشغيل' : 'Last run'}: {wave.lastRun || (isArabic ? 'لم يتم بعد' : 'Not run yet')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{isArabic ? 'معدل الاستجابة' : 'Response Rate'}</span>
                    <span>{wave.responseRate}%</span>
                  </div>
                  <Progress value={wave.responseRate} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">{isArabic ? 'المشاركون' : 'Participants'}</div>
                    <div className="font-medium">{wave.participants}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{isArabic ? 'الرؤى' : 'Insights'}</div>
                    <div className="font-medium">{wave.insights}</div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'التشغيل التالي' : 'Next run'}: {wave.nextRun}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="adoption" className="space-y-6">
          <TabsList>
            <TabsTrigger value="adoption">{isArabic ? 'مقاييس التبني' : 'Adoption Metrics'}</TabsTrigger>
            <TabsTrigger value="cultural">{isArabic ? 'المؤشرات الثقافية' : 'Cultural Indicators'}</TabsTrigger>
            <TabsTrigger value="trends">{isArabic ? 'تحليل الاتجاهات' : 'Trend Analysis'}</TabsTrigger>
          </TabsList>

          {/* Adoption Metrics */}
          <TabsContent value="adoption" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {isArabic ? 'تقدم المبادرات' : 'Initiative Progress'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تتبع تقدم مبادرات التغيير الثقافي' : 'Track progress of cultural change initiatives'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {adoptionMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{metric.initiative}</h4>
                        <div className="flex items-center gap-2">
                          {metric.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <Badge variant={metric.progress >= metric.target * 0.8 ? 'default' : 'secondary'}>
                            {metric.progress}% / {metric.target}%
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{isArabic ? 'التقدم الإجمالي' : 'Overall Progress'}</span>
                            <span>{metric.progress}% of {metric.target}%</span>
                          </div>
                          <Progress value={metric.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              {isArabic ? 'معدل التبني' : 'Adoption Rate'}
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={metric.adoptionRate} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{metric.adoptionRate}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              {isArabic ? 'معدل المقاومة' : 'Resistance Rate'}
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={metric.resistance} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{metric.resistance}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Indicators */}
          <TabsContent value="cultural" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isArabic ? 'المؤشرات الثقافية الرئيسية' : 'Key Cultural Indicators'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تطور المؤشرات الثقافية عبر الزمن' : 'Evolution of cultural indicators over time'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {culturalIndicators.map((indicator, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{indicator.indicator}</h5>
                            <Badge variant="outline" className="text-green-600">
                              {indicator.change}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{isArabic ? 'الحالي' : 'Current'}</span>
                              <span>{indicator.current}%</span>
                            </div>
                            <Progress value={indicator.current} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="text-muted-foreground">{isArabic ? 'الأساس' : 'Baseline'}</div>
                              <div className="font-medium">{indicator.baseline}%</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">{isArabic ? 'الهدف' : 'Target'}</div>
                              <div className="font-medium">{indicator.target}%</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trend Analysis */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {isArabic ? 'تحليل الاتجاهات' : 'Trend Analysis'}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? 'اتجاهات التغيير الثقافي على مدى 90 يوم' : '90-day cultural change trends'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {isArabic ? 'اتجاه إيجابي: تحسن مستمر في الأمان النفسي' : 'Positive Trend: Consistent improvement in psychological safety'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {isArabic ? 'استقرار: محاذاة القيم تظهر تحسناً ثابتاً' : 'Stable: Values alignment showing steady improvement'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">
                          {isArabic ? 'يحتاج انتباه: مقاومة في مبادرة المكافآت' : 'Needs Attention: Resistance in rewards initiative'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {isArabic ? 'الجدول الزمني القادم' : 'Upcoming Schedule'}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? 'موجات النبض والمحطات المجدولة' : 'Scheduled pulse waves and milestones'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{isArabic ? 'نبضة 60 يوم' : '60-Day Pulse'}</div>
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? 'تقييم متوسط المدى' : 'Mid-term assessment'}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {isArabic ? '25 يناير' : 'Jan 25'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{isArabic ? 'مراجعة المبادرات' : 'Initiative Review'}</div>
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? 'تقييم التقدم الشهري' : 'Monthly progress evaluation'}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {isArabic ? '1 فبراير' : 'Feb 1'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{isArabic ? 'نبضة 90 يوم' : '90-Day Pulse'}</div>
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? 'تقييم طويل المدى' : 'Long-term assessment'}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {isArabic ? '10 أبريل' : 'Apr 10'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* AI Integration for CCI Tracking */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="cci-tracking" 
        companyId="demo-company" 
        enabledFeatures={['culture-tracking', 'progress-monitoring', 'trend-analysis', 'predictive-insights']}
      />
    </div>
  );
};

export default Tracking;