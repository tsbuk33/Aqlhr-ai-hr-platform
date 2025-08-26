import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Users, DollarSign, Clock, 
  FileText, Download, Eye, Share2,
  BarChart3, PieChart, LineChart, Activity
} from 'lucide-react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const ExecutiveAnalyticsPage = () => {
  const { isArabic } = useSimpleLanguage();

  useEffect(() => {
    document.title = isArabic ? 'التحليلات التنفيذية - سند' : 'Executive Analytics - SanadHR';
  }, [isArabic]);

  const executiveMetrics = [
    {
      title: isArabic ? 'تكلفة القوى العاملة الإجمالية' : 'Total Workforce Cost',
      value: '24.5M',
      unit: isArabic ? 'ريال سعودي' : 'SAR',
      change: '+2.3%',
      trend: 'up',
      description: isArabic ? 'مقارنة بالشهر الماضي' : 'vs last month'
    },
    {
      title: isArabic ? 'العائد على الاستثمار في الموارد البشرية' : 'HR ROI',
      value: '312%',
      change: '+15%',
      trend: 'up',
      description: isArabic ? 'تحسن كبير في الربعية' : 'Significant quarterly improvement'
    },
    {
      title: isArabic ? 'إنتاجية الموظفين' : 'Employee Productivity',
      value: '94.2%',
      change: '+5.7%',
      trend: 'up',
      description: isArabic ? 'أعلى مستوى هذا العام' : 'Highest this year'
    },
    {
      title: isArabic ? 'معدل الاحتفاظ بالمواهب' : 'Talent Retention Rate',
      value: '89.3%',
      change: '+3.1%',
      trend: 'up',
      description: isArabic ? 'فوق متوسط الصناعة' : 'Above industry average'
    }
  ];

  const reports = [
    {
      title: isArabic ? 'تقرير الأداء الربعي' : 'Quarterly Performance Report',
      description: isArabic ? 'تحليل شامل لأداء الموارد البشرية للربع الحالي' : 'Comprehensive HR performance analysis for current quarter',
      lastUpdated: isArabic ? 'آخر تحديث: اليوم' : 'Last updated: Today',
      status: 'ready',
      icon: BarChart3
    },
    {
      title: isArabic ? 'تحليل التكاليف التفصيلي' : 'Detailed Cost Analysis',
      description: isArabic ? 'تفكيك تفصيلي لتكاليف الموارد البشرية حسب القسم' : 'Detailed breakdown of HR costs by department',
      lastUpdated: isArabic ? 'آخر تحديث: أمس' : 'Last updated: Yesterday',
      status: 'ready',
      icon: PieChart
    },
    {
      title: isArabic ? 'تقرير الاتجاهات والتوقعات' : 'Trends & Forecasting Report',
      description: isArabic ? 'توقعات القوى العاملة والاتجاهات المستقبلية' : 'Workforce predictions and future trends',
      lastUpdated: isArabic ? 'آخر تحديث: منذ ساعتين' : 'Last updated: 2 hours ago',
      status: 'processing',
      icon: LineChart
    },
    {
      title: isArabic ? 'لوحة قيادة المخاطر' : 'Risk Dashboard',
      description: isArabic ? 'تحليل المخاطر المحتملة في الموارد البشرية' : 'Analysis of potential HR risks',
      lastUpdated: isArabic ? 'آخر تحديث: هذا الصباح' : 'Last updated: This morning',
      status: 'ready',
      icon: Activity
    }
  ];

  const keyInsights = [
    {
      title: isArabic ? 'توصية استراتيجية' : 'Strategic Recommendation',
      content: isArabic ? 'تشير البيانات إلى فرصة لتحسين الكفاءة التشغيلية بنسبة 15% من خلال تحسين عمليات التوظيف.' : 'Data indicates an opportunity to improve operational efficiency by 15% through recruitment process optimization.',
      priority: 'high',
      category: isArabic ? 'الكفاءة التشغيلية' : 'Operational Efficiency'
    },
    {
      title: isArabic ? 'تحليل الاتجاهات' : 'Trend Analysis',
      content: isArabic ? 'معدل دوران الموظفين انخفض بشكل مستمر خلال الأشهر الستة الماضية، مما يشير إلى تحسن في رضا الموظفين.' : 'Employee turnover has consistently decreased over the past 6 months, indicating improved employee satisfaction.',
      priority: 'medium',
      category: isArabic ? 'رضا الموظفين' : 'Employee Satisfaction'
    },
    {
      title: isArabic ? 'فرصة التحسين' : 'Improvement Opportunity',
      content: isArabic ? 'يمكن تقليل وقت التوظيف بـ 30% من خلال تطبيق أدوات الذكاء الاصطناعي في عملية الفرز الأولي.' : 'Time-to-hire can be reduced by 30% through AI-powered initial screening implementation.',
      priority: 'high',
      category: isArabic ? 'التوظيف' : 'Recruitment'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? '📈 التحليلات التنفيذية' : '📈 Executive Analytics'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic ? 'رؤى استراتيجية وتحليلات عالية المستوى للقيادة التنفيذية' : 'Strategic insights and high-level analytics for executive leadership'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            {isArabic ? 'مشاركة' : 'Share'}
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isArabic ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Executive Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">{metric.change}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Executive Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isArabic ? 'التقارير التنفيذية' : 'Executive Reports'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'تقارير مُعدة خصيصاً للقيادة التنفيذية' : 'Reports tailored for executive leadership'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report, index) => {
              const IconComponent = report.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <IconComponent className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{report.title}</h4>
                      <Badge variant={report.status === 'ready' ? 'default' : 'secondary'}>
                        {report.status === 'ready' ? (isArabic ? 'جاهز' : 'Ready') : (isArabic ? 'قيد المعالجة' : 'Processing')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{report.lastUpdated}</p>
                    {report.status === 'ready' && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          {isArabic ? 'عرض' : 'View'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          {isArabic ? 'تحميل' : 'Download'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {isArabic ? 'الرؤى الاستراتيجية' : 'Strategic Insights'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'توصيات وتحليلات قائمة على البيانات' : 'Data-driven recommendations and analysis'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {keyInsights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                    {insight.priority === 'high' ? (isArabic ? 'عالية' : 'High') : (isArabic ? 'متوسطة' : 'Medium')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{insight.content}</p>
                <Badge variant="outline" className="text-xs">
                  {insight.category}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Integration for Executive Analytics */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="executive-analytics" 
        companyId="demo-company" 
        enabledFeatures={['executive-insights', 'strategic-intelligence', 'predictive-analytics', 'data-visualization']}
      />
    </div>
  );
};

export default ExecutiveAnalyticsPage;