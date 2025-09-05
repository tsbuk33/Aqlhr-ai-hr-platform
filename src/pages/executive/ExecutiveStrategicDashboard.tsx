import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Target, 
  Download, Share2, Calendar, Award, AlertTriangle,
  BarChart3, PieChart, FileText, Eye, ExternalLink,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { UniversalAIIntegrator } from '@/components/ai/UniversalAIIntegrator';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const ExecutiveStrategicDashboard = () => {
  const { isArabic } = useSimpleLanguage();
  const [timeFrame, setTimeFrame] = useState('quarterly');

  useEffect(() => {
    document.title = isArabic ? 'لوحة القيادة الاستراتيجية التنفيذية - عقل' : 'Executive Strategic Dashboard - AqlHR';
  }, [isArabic]);

  // Strategic KPIs focused on business impact and ROI
  const strategicKPIs = [
    {
      title: isArabic ? 'العائد على الاستثمار في الموارد البشرية' : 'HR ROI',
      value: '342%',
      change: '+18.5%',
      trend: 'up',
      target: '320%',
      description: isArabic ? 'تجاوز الهدف المحدد' : 'Exceeded target',
      icon: DollarSign,
      color: 'success'
    },
    {
      title: isArabic ? 'إنتاجية القوى العاملة' : 'Workforce Productivity',
      value: '96.2%',
      change: '+4.7%',
      trend: 'up',
      target: '92%',
      description: isArabic ? 'أعلى مستوى تاريخي' : 'Historical high',
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: isArabic ? 'تكلفة الموظف الواحد' : 'Cost Per Employee',
      value: '18.2K',
      unit: isArabic ? 'ريال سعودي' : 'SAR',
      change: '-2.3%',
      trend: 'down',
      target: '19K',
      description: isArabic ? 'تحسن في الكفاءة' : 'Efficiency improvement',
      icon: Users,
      color: 'success'
    },
    {
      title: isArabic ? 'مؤشر المخاطر الاستراتيجية' : 'Strategic Risk Index',
      value: '12%',
      change: '+1.2%',
      trend: 'up',
      target: '10%',
      description: isArabic ? 'يتطلب انتباه' : 'Requires attention',
      icon: AlertTriangle,
      color: 'warning'
    }
  ];

  // Board-ready executive summaries
  const executiveSummaries = [
    {
      title: isArabic ? 'تقرير الأداء الربعي للمجلس' : 'Board Quarterly Performance Report',
      description: isArabic ? 'تقرير شامل جاهز لعرض مجلس الإدارة يشمل جميع المؤشرات الاستراتيجية' : 'Comprehensive board-ready report covering all strategic indicators',
      status: 'ready',
      lastUpdated: isArabic ? 'محدث منذ دقائق' : 'Updated minutes ago',
      icon: FileText,
      actions: ['view', 'download', 'present']
    },
    {
      title: isArabic ? 'تحليل العائد على الاستثمار' : 'ROI Analysis Brief',
      description: isArabic ? 'تحليل مفصل لعائد الاستثمار مع التوصيات الاستراتيجية' : 'Detailed ROI analysis with strategic recommendations',
      status: 'ready',
      lastUpdated: isArabic ? 'اليوم' : 'Today',
      icon: BarChart3,
      actions: ['view', 'download']
    },
    {
      title: isArabic ? 'مخاطر القوى العاملة الاستراتيجية' : 'Strategic Workforce Risks',
      description: isArabic ? 'تقييم المخاطر الحرجة التي تتطلب قرارات تنفيذية' : 'Critical risk assessment requiring executive decisions',
      status: 'urgent',
      lastUpdated: isArabic ? 'منذ ساعة' : '1 hour ago',
      icon: AlertTriangle,
      actions: ['view', 'escalate']
    }
  ];

  // Strategic initiatives tracking
  const strategicInitiatives = [
    {
      initiative: isArabic ? 'رؤية 2030 - التوطين' : 'Vision 2030 - Localization',
      progress: 87,
      status: 'on-track',
      impact: isArabic ? 'عالي' : 'High',
      nextMilestone: isArabic ? 'نهاية الربع' : 'End of Quarter'
    },
    {
      initiative: isArabic ? 'التحول الرقمي للموارد البشرية' : 'HR Digital Transformation',
      progress: 72,
      status: 'at-risk',
      impact: isArabic ? 'متوسط' : 'Medium',
      nextMilestone: isArabic ? '30 يوماً' : '30 days'
    },
    {
      initiative: isArabic ? 'تطوير المواهب القيادية' : 'Leadership Talent Development',
      progress: 94,
      status: 'ahead',
      impact: isArabic ? 'عالي' : 'High',
      nextMilestone: isArabic ? 'مكتمل' : 'Complete'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-status-success/10 text-status-success';
      case 'urgent':
        return 'bg-status-danger/10 text-status-danger';
      case 'processing':
        return 'bg-status-warning/10 text-status-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const exportToBoardPresentation = () => {
    console.log('Exporting board presentation...');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Executive Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {isArabic ? '🎯 لوحة القيادة الاستراتيجية التنفيذية' : '🎯 Executive Strategic Dashboard'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {isArabic 
              ? 'نظرة شاملة على الأداء الاستراتيجي للموارد البشرية مع رؤى قابلة للتنفيذ للقيادة التنفيذية'
              : 'Comprehensive strategic HR performance overview with actionable insights for executive leadership'
            }
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={exportToBoardPresentation} className="bg-gradient-primary text-white">
              <Download className="h-4 w-4 mr-2" />
              {isArabic ? 'تصدير عرض المجلس' : 'Export Board Presentation'}
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              {isArabic ? 'مشاركة مع القيادة' : 'Share with Leadership'}
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              {isArabic ? 'جدولة التحديث' : 'Schedule Update'}
            </Button>
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-surface rounded-lg p-1">
            {['monthly', 'quarterly', 'yearly'].map((period) => (
              <Button
                key={period}
                variant={timeFrame === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFrame(period)}
                className="min-w-[100px]"
              >
                {isArabic 
                  ? period === 'monthly' ? 'شهري' : period === 'quarterly' ? 'ربعي' : 'سنوي'
                  : period === 'monthly' ? 'Monthly' : period === 'quarterly' ? 'Quarterly' : 'Yearly'
                }
              </Button>
            ))}
          </div>
        </div>

        {/* Strategic KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {strategicKPIs.map((kpi, index) => {
            const IconComponent = kpi.icon;
            return (
              <Card key={index} className="relative overflow-hidden bg-surface border-border-subtle hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium text-muted-foreground mb-2">
                        {kpi.title}
                      </CardTitle>
                      <div className="flex items-end gap-2 mb-2">
                        <span className="text-3xl font-bold text-foreground">
                          {kpi.value}
                        </span>
                        {kpi.unit && (
                          <span className="text-sm text-muted-foreground pb-1">
                            {kpi.unit}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${kpi.color === 'success' ? 'bg-status-success/10' : kpi.color === 'warning' ? 'bg-status-warning/10' : 'bg-status-info/10'}`}>
                      <IconComponent className={`h-5 w-5 ${kpi.color === 'success' ? 'text-status-success' : kpi.color === 'warning' ? 'text-status-warning' : 'text-status-info'}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-status-success' : 
                      kpi.trend === 'down' ? (kpi.color === 'success' ? 'text-status-success' : 'text-status-danger') : 
                      'text-muted-foreground'
                    }`}>
                      {getTrendIcon(kpi.trend)}
                      <span>{kpi.change}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {isArabic ? 'هدف' : 'Target'}: {kpi.target}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Executive Reports and Strategic Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Board-Ready Reports */}
          <Card className="bg-surface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {isArabic ? 'التقارير التنفيذية الجاهزة' : 'Board-Ready Reports'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'تقارير محضرة مسبقاً للعروض التنفيذية' : 'Pre-prepared reports for executive presentations'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {executiveSummaries.map((report, index) => {
                const IconComponent = report.icon;
                return (
                  <div key={index} className="p-4 border border-border-subtle rounded-lg bg-background hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground truncate pr-2">{report.title}</h4>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status === 'ready' ? (isArabic ? 'جاهز' : 'Ready') : 
                             report.status === 'urgent' ? (isArabic ? 'عاجل' : 'Urgent') : 
                             (isArabic ? 'قيد المعالجة' : 'Processing')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {report.lastUpdated}
                          </span>
                          <div className="flex gap-2">
                            {report.actions.includes('view') && (
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                {isArabic ? 'عرض' : 'View'}
                              </Button>
                            )}
                            {report.actions.includes('download') && (
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                {isArabic ? 'تحميل' : 'Download'}
                              </Button>
                            )}
                            {report.actions.includes('present') && (
                              <Button size="sm">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {isArabic ? 'عرض' : 'Present'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Strategic Initiatives Progress */}
          <Card className="bg-surface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {isArabic ? 'المبادرات الاستراتيجية' : 'Strategic Initiatives'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'تتبع تقدم المبادرات الاستراتيجية الحرجة' : 'Track progress of critical strategic initiatives'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategicInitiatives.map((initiative, index) => (
                <div key={index} className="p-4 border border-border-subtle rounded-lg bg-background">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-foreground">{initiative.initiative}</h4>
                    <Badge variant={
                      initiative.status === 'on-track' ? 'default' :
                      initiative.status === 'ahead' ? 'default' : 'destructive'
                    }>
                      {initiative.status === 'on-track' ? (isArabic ? 'على المسار' : 'On Track') :
                       initiative.status === 'ahead' ? (isArabic ? 'متقدم' : 'Ahead') :
                       (isArabic ? 'في خطر' : 'At Risk')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{isArabic ? 'التقدم' : 'Progress'}</span>
                        <span className="font-medium">{initiative.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            initiative.status === 'ahead' ? 'bg-status-success' :
                            initiative.status === 'on-track' ? 'bg-primary' : 'bg-status-warning'
                          }`}
                          style={{ width: `${initiative.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isArabic ? 'التأثير:' : 'Impact:'} 
                        <span className={`ml-1 font-medium ${
                          initiative.impact === (isArabic ? 'عالي' : 'High') ? 'text-status-danger' : 'text-status-warning'
                        }`}>
                          {initiative.impact}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        {isArabic ? 'المرحلة القادمة:' : 'Next:'} 
                        <span className="ml-1 font-medium text-foreground">{initiative.nextMilestone}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Integration for Executive Intelligence */}
      <UniversalAIIntegrator 
        pageType="executive" 
        moduleName="executive-strategic-dashboard" 
        companyId="demo-company" 
        enabledFeatures={['executive-insights', 'board-presentations', 'strategic-intelligence', 'risk-assessment']}
      />
    </div>
  );
};

export default ExecutiveStrategicDashboard;