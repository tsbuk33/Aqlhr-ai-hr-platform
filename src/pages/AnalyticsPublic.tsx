import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, PieChart, Activity, Brain, Target } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function AnalyticsPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const analyticsModules = [
    {
      icon: BarChart3,
      title: isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics',
      description: isArabic ? 'رؤى شاملة حول أداء وتوزيع القوى العاملة' : 'Comprehensive insights into workforce performance and distribution'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'التحليلات التنبؤية' : 'Predictive Analytics',
      description: isArabic ? 'توقعات مدعومة بالذكاء الاصطناعي للقرارات المستقبلية' : 'AI-powered predictions for future decision making'
    },
    {
      icon: PieChart,
      title: isArabic ? 'تحليلات التكلفة' : 'Cost Analytics',
      description: isArabic ? 'تحليل مفصل لتكاليف الموارد البشرية والعائد على الاستثمار' : 'Detailed HR cost analysis and ROI measurement'
    },
    {
      icon: Activity,
      title: isArabic ? 'اللوحات التفاعلية' : 'Real-time Dashboards',
      description: isArabic ? 'لوحات تحكم تفاعلية مع البيانات المحدثة لحظياً' : 'Interactive dashboards with real-time data updates'
    },
    {
      icon: Brain,
      title: isArabic ? 'ذكاء الأعمال' : 'Business Intelligence',
      description: isArabic ? 'استخراج الرؤى الاستراتيجية من بيانات الموارد البشرية' : 'Extract strategic insights from HR data'
    },
    {
      icon: Target,
      title: isArabic ? 'مؤشرات الأداء الرئيسية' : 'KPI Tracking',
      description: isArabic ? 'متابعة مؤشرات الأداء الرئيسية وتحليل الاتجاهات' : 'Track key performance indicators and trend analysis'
    }
  ];

  const sampleMetrics = [
    { label: isArabic ? 'معدل الاحتفاظ بالموظفين' : 'Employee Retention Rate', value: '94.2%', trend: '+2.1%' },
    { label: isArabic ? 'مؤشر رضا الموظفين' : 'Employee Satisfaction', value: '4.6/5', trend: '+0.3' },
    { label: isArabic ? 'معدل السعودة' : 'Saudization Rate', value: '67.8%', trend: '+4.2%' },
    { label: isArabic ? 'كفاءة التوظيف' : 'Recruitment Efficiency', value: '18 days', trend: '-3 days' }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'الذكاء الاصطناعي والتحليلات' : 'AI & Analytics'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'رؤى متقدمة مدعومة بالذكاء الاصطناعي لاتخاذ قرارات موارد بشرية استراتيجية'
            : 'Advanced AI-powered insights for strategic HR decision making'
          }
        </p>
      </div>

      {/* Sample Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sampleMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-green-600">{metric.trend}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {analyticsModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <module.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {module.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              {isArabic ? '🎯 التحليلات الاستراتيجية' : '🎯 Strategic Analytics'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-primary/5 rounded-lg">
              <h4 className="font-semibold mb-2">
                {isArabic ? 'تحليل اتجاهات القوى العاملة' : 'Workforce Trend Analysis'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'تحليل متقدم لاتجاهات التوظيف والاستقالات وتوقعات النمو'
                  : 'Advanced analysis of hiring trends, turnover, and growth projections'
                }
              </p>
            </div>
            <div className="p-3 bg-secondary/5 rounded-lg">
              <h4 className="font-semibold mb-2">
                {isArabic ? 'تحليل الأداء التنبؤي' : 'Predictive Performance Analysis'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'توقع أداء الموظفين والمخاطر المحتملة باستخدام الذكاء الاصطناعي'
                  : 'Predict employee performance and potential risks using AI'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-xl text-secondary">
              {isArabic ? '📊 تقارير الامتثال' : '📊 Compliance Reports'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">
                {isArabic ? 'تقارير نطاقات السعودة' : 'Nitaqat Reports'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'تقارير تفصيلية عن حالة السعودة ومتطلبات الامتثال'
                  : 'Detailed reports on Saudization status and compliance requirements'
                }
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">
                {isArabic ? 'تقارير أنظمة العمل' : 'Labor Law Reports'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'تقارير الامتثال لأنظمة العمل السعودية'
                  : 'Saudi labor law compliance reporting'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول لرؤية التحليلات التفاعلية الكاملة والتقارير المخصصة'
            : '🔒 Login to view full interactive analytics and custom reports'
          }
        </p>
      </div>
    </div>
  );
}