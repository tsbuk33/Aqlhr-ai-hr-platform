import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, Target, Award, ShieldCheck, Brain, Zap, BarChart3, Activity } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

export function ExecutiveDashboardSection() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  const metrics = [
    {
      title: isArabic ? 'دقة التنبؤ بالقوى العاملة' : 'Workforce Forecast Accuracy',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
    },
    {
      title: isArabic ? 'قوة خط المواهب' : 'Talent Pipeline Strength',
      value: '76',
      subtitle: isArabic ? 'مرشح عالي الإمكانات' : 'high-potential candidates',
      icon: Users,
    },
    {
      title: isArabic ? 'نقاط تجربة الموظف' : 'Employee Experience Score',
      value: '8.7/10',
      change: '+0.3',
      subtitle: isArabic ? 'تحسن ربع سنوي' : 'quarterly improvement',
      trend: 'up',
      icon: Award,
    },
    {
      title: isArabic ? 'مؤشر المخاطر التنبؤي' : 'Predictive Risk Index',
      value: '12',
      subtitle: isArabic ? 'موظف عالي المخاطر' : 'high-risk employees',
      icon: ShieldCheck,
    },
  ];

  const operationalMetrics = [
    {
      title: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: '2,847',
      change: '+12%',
      icon: Users,
    },
    {
      title: isArabic ? 'عمليات الذكاء الاصطناعي' : 'AI Processes',
      value: '156',
      subtitle: '+24 أداة نشطة',
      icon: Brain,
    },
    {
      title: isArabic ? 'التكاملات الحكومية' : 'Gov Integrations',
      value: '46',
      subtitle: 'Complete 22 Gov + 24 Tools',
      icon: Zap,
    },
    {
      title: isArabic ? 'نقاط الامتثال' : 'Compliance Score',
      value: '94%',
      change: '+2.1%',
      subtitle: isArabic ? 'الامتثال التنظيمي' : 'regulatory compliance',
      icon: ShieldCheck,
    },
  ];

  const hrAnalytics = [
    {
      title: isArabic ? 'معدل دوران الموظفين' : 'Turnover Rate',
      value: '8.2%',
      change: '-1.3%',
      subtitle: isArabic ? 'تحسن من العام الماضي' : 'improvement from last year',
      trend: 'down',
    },
    {
      title: isArabic ? 'معدل توظيف النساء حسب القسم' : 'Women Hiring Rate by Dept',
      value: '34.2%',
      change: '+4.8%',
      subtitle: 'IT: 42% | HR: 68% | Finance: 29%',
      trend: 'up',
    },
    {
      title: isArabic ? 'دوران النساء حسب القسم' : 'Women Turnover by Dept',
      value: '6.1%',
      change: '-2.3%',
      subtitle: isArabic ? 'تحسن من العام الماضي' : 'improvement from last year',
      trend: 'down',
    },
    {
      title: isArabic ? 'النساء في القيادة' : 'Women in Leadership',
      value: '28.6%',
      change: '+5.2%',
      subtitle: isArabic ? 'من إجمالي مناصب القيادة' : 'of total leadership positions',
      trend: 'up',
    },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-success" />;
  };

  return (
    <div className="space-y-12 py-12">
      {/* Executive Dashboard Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          {isArabic ? 'لوحة القيادة التنفيذية لعقل HR' : 'AqlHR Executive Dashboard'}
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          {isArabic 
            ? 'منصة ذكية متطورة لإدارة الموارد البشرية في المملكة العربية السعودية'
            : 'Advanced Intelligent Platform for Human Resources Management in Saudi Arabia'
          }
        </p>
        <div className="flex items-center justify-center gap-2 text-success">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            {isArabic ? 'جميع الأنظمة تعمل بكفاءة' : 'All Systems Operational'}
          </span>
        </div>
      </div>

      {/* Strategic Intelligence Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {isArabic ? 'لوحة الذكاء الاستراتيجي' : 'Strategic Intelligence Panel'}
            </CardTitle>
            <Badge variant="secondary">AI Insights</Badge>
          </div>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'الذكاء التنبؤي والتحليلات الاستراتيجية المتطورة'
              : 'Predictive intelligence and advanced strategic analytics'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                  {metric.change && (
                    <div className={`flex items-center gap-1 text-sm ${metric.trend === 'up' ? 'text-success' : 'text-success'}`}>
                      {getTrendIcon(metric.trend)}
                      <span>{metric.change}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  {metric.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {isArabic ? 'الملخص التنفيذي' : 'Executive Summary'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'نظرة عامة على مؤشرات الأداء الرئيسية للموارد البشرية'
              : 'Overview of key human resources performance indicators'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {operationalMetrics.map((metric, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <metric.icon className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  {metric.change && (
                    <p className="text-xs text-success mt-1">{metric.change} vs last month</p>
                  )}
                  {metric.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Executive Intelligence Center */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Badge className="mb-4" variant="default">PREMIUM</Badge>
            <h2 className="text-2xl font-bold mb-2">
              {isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isArabic 
                ? 'رؤى استراتيجية متطورة عبر جميع وحدات الموارد البشرية'
                : 'Advanced strategic insights across all HR modules'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {isArabic ? 'التحليلات التنفيذية' : 'Executive Analytics'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'رؤى متطورة للقيادة العليا' : 'Advanced insights for senior leadership'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-3">
                <Brain className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">
                {isArabic ? 'الذكاء الاصطناعي المتطور' : 'Advanced AI'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'تحليلات ذكية وتوصيات في الوقت الفعلي' : 'Smart analytics and real-time recommendations'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-success/10 rounded-full w-fit mx-auto mb-3">
                <Target className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">
                {isArabic ? 'دعم اتخاذ القرار' : 'Decision Support'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'دعم اتخاذ القرارات الاستراتيجية' : 'Strategic decision-making support'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              {isArabic ? 'فتح المركز التنفيذي' : 'Open Executive Center'}
            </Button>
            <Button variant="outline" size="lg">
              {isArabic ? 'تطبيق الهاتف التنفيذي' : 'Mobile Executive App'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced HR Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {isArabic ? 'تحليلات الموارد البشرية المتطورة' : 'Advanced HR Analytics'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'تحليلات وأداء شاملة للموارد البشرية والاتجاهات'
              : 'Comprehensive human resources performance analytics and trends'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hrAnalytics.map((metric, index) => (
              <Card key={index} className="p-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{metric.title}</p>
                  {metric.change && (
                    <div className={`flex items-center gap-1 text-xs ${metric.trend === 'up' ? 'text-success' : 'text-success'}`}>
                      {getTrendIcon(metric.trend)}
                      <span>{metric.change}</span>
                    </div>
                  )}
                  {metric.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}