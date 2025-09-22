import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Brain, TrendingUp, Users, AlertTriangle, CheckCircle, Target, Zap } from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';

interface CrossModuleInsight {
  id: string;
  title: string;
  titleAr: string;
  modules: string[];
  correlation: number;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  recommendation: string;
  recommendationAr: string;
  actionable: boolean;
  estimatedValue: number;
}

interface IntelligentDecision {
  id: string;
  type: 'hiring' | 'promotion' | 'training' | 'allocation' | 'risk';
  title: string;
  titleAr: string;
  probability: number;
  factors: string[];
  recommendation: string;
  recommendationAr: string;
  timeline: string;
  roi: number;
}

interface WorkflowOrchestration {
  id: string;
  name: string;
  nameAr: string;
  fromModule: string;
  toModule: string;
  status: 'active' | 'completed' | 'pending' | 'error';
  progress: number;
  estimatedCompletion: string;
  automationLevel: number;
}

const CrossModuleIntelligence = () => {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';
  
  const [insights, setInsights] = useState<CrossModuleInsight[]>([
    {
      id: '1',
      title: 'Performance-Training Correlation Analysis',
      titleAr: 'تحليل الارتباط بين الأداء والتدريب',
      modules: ['Performance', 'Learning', 'Analytics'],
      correlation: 0.87,
      impact: 'high',
      confidence: 94.5,
      recommendation: 'Increase technical training for engineering team by 40% to improve performance scores',
      recommendationAr: 'زيادة التدريب التقني لفريق الهندسة بنسبة 40% لتحسين درجات الأداء',
      actionable: true,
      estimatedValue: 125000
    },
    {
      id: '2',
      title: 'Compliance-Payroll Integration Impact',
      titleAr: 'تأثير تكامل الامتثال والمرتبات',
      modules: ['Compliance', 'Payroll', 'Government'],
      correlation: 0.92,
      impact: 'high',
      confidence: 98.2,
      recommendation: 'Automated GOSI compliance reduces payroll processing time by 65%',
      recommendationAr: 'أتمتة امتثال الجوسي تقلل وقت معالجة المرتبات بنسبة 65%',
      actionable: true,
      estimatedValue: 180000
    },
    {
      id: '3',
      title: 'Recruitment-Performance Predictive Model',
      titleAr: 'نموذج تنبؤي للتوظيف والأداء',
      modules: ['Recruitment', 'Performance', 'AI Analytics'],
      correlation: 0.79,
      impact: 'medium',
      confidence: 89.7,
      recommendation: 'Adjust recruitment criteria to improve long-term performance outcomes',
      recommendationAr: 'تعديل معايير التوظيف لتحسين نتائج الأداء طويل المدى',
      actionable: true,
      estimatedValue: 95000
    }
  ]);

  const [decisions, setDecisions] = useState<IntelligentDecision[]>([
    {
      id: '1',
      type: 'hiring',
      title: 'Senior Software Engineer Hiring',
      titleAr: 'توظيف مهندس برمجيات أول',
      probability: 92.5,
      factors: ['Technical Skills', 'Cultural Fit', 'Market Demand', 'Budget Allocation'],
      recommendation: 'Proceed with hiring - high success probability based on multi-factor analysis',
      recommendationAr: 'المتابعة مع التوظيف - احتمالية نجاح عالية بناءً على التحليل متعدد العوامل',
      timeline: '2-3 weeks',
      roi: 245000
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Team Lead Promotion - Ahmad Al-Rashid',
      titleAr: 'ترقية قائد فريق - أحمد الراشد',
      probability: 88.3,
      factors: ['Performance History', 'Leadership Skills', 'Team Feedback', 'Business Impact'],
      recommendation: 'Recommend promotion with additional leadership training',
      recommendationAr: 'يُنصح بالترقية مع تدريب قيادي إضافي',
      timeline: '1 month',
      roi: 150000
    },
    {
      id: '3',
      type: 'risk',
      title: 'High Attrition Risk - Marketing Department',
      titleAr: 'خطر استنزاف عالي - قسم التسويق',
      probability: 76.2,
      factors: ['Job Satisfaction', 'Workload', 'Market Opportunities', 'Compensation'],
      recommendation: 'Implement retention strategy with improved benefits and career development',
      recommendationAr: 'تنفيذ استراتيجية الاحتفاظ مع تحسين المزايا والتطوير المهني',
      timeline: 'Immediate',
      roi: 200000
    }
  ]);

  const [orchestrations, setOrchestrations] = useState<WorkflowOrchestration[]>([
    {
      id: '1',
      name: 'Recruitment to Onboarding Transition',
      nameAr: 'انتقال من التوظيف إلى التأهيل',
      fromModule: 'Recruitment',
      toModule: 'Onboarding',
      status: 'active',
      progress: 75,
      estimatedCompletion: '2024-01-20T14:30:00Z',
      automationLevel: 95
    },
    {
      id: '2',
      name: 'Performance to Development Planning',
      nameAr: 'تخطيط من الأداء إلى التطوير',
      fromModule: 'Performance',
      toModule: 'Learning',
      status: 'completed',
      progress: 100,
      estimatedCompletion: '2024-01-15T16:00:00Z',
      automationLevel: 87
    },
    {
      id: '3',
      name: 'Compliance to Payroll Integration',
      nameAr: 'تكامل الامتثال مع المرتبات',
      fromModule: 'Compliance',
      toModule: 'Payroll',
      status: 'active',
      progress: 60,
      estimatedCompletion: '2024-01-18T10:00:00Z',
      automationLevel: 92
    }
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-brand-destructive';
      case 'medium': return 'bg-brand-warning';
      case 'low': return 'bg-brand-success';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-brand-primary';
      case 'completed': return 'bg-brand-success';
      case 'pending': return 'bg-brand-warning';
      case 'error': return 'bg-brand-destructive';
      default: return 'bg-muted';
    }
  };

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'hiring': return <Users className="w-5 h-5" />;
      case 'promotion': return <TrendingUp className="w-5 h-5" />;
      case 'training': return <Target className="w-5 h-5" />;
      case 'allocation': return <Zap className="w-5 h-5" />;
      case 'risk': return <AlertTriangle className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-SA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <Brain className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isArabic ? 'الذكاء عبر الوحدات' : 'Cross-Module Intelligence'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? 'تحليل ذكي وتنسيق بين جميع وحدات الموارد البشرية' : 'Intelligent analysis and orchestration across all HR modules'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'الرؤى النشطة' : 'Active Insights'}
                </p>
                <p className="text-2xl font-bold text-brand-primary">
                  {insights.length}
                </p>
              </div>
              <Brain className="w-8 h-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'متوسط الثقة' : 'Avg Confidence'}
                </p>
                <p className="text-2xl font-bold text-brand-success">
                  {(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-brand-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'القرارات المعلقة' : 'Pending Decisions'}
                </p>
                <p className="text-2xl font-bold text-brand-warning">
                  {decisions.length}
                </p>
              </div>
              <Target className="w-8 h-8 text-brand-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'القيمة المتوقعة' : 'Projected Value'}
                </p>
                <p className="text-2xl font-bold text-brand-accent">
                  {formatCurrency(insights.reduce((acc, i) => acc + i.estimatedValue, 0))}
                </p>
              </div>
              <CurrencyIcon className="w-8 h-8 text-brand-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">
            {isArabic ? 'الرؤى الذكية' : 'Intelligent Insights'}
          </TabsTrigger>
          <TabsTrigger value="decisions">
            {isArabic ? 'شجرة القرارات' : 'Decision Trees'}
          </TabsTrigger>
          <TabsTrigger value="orchestration">
            {isArabic ? 'تنسيق سير العمل' : 'Workflow Orchestration'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {isArabic ? insight.titleAr : insight.title}
                    </CardTitle>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                  <CardDescription>
                    {isArabic ? 'الوحدات المشاركة: ' : 'Involved modules: '} 
                    {insight.modules.join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{isArabic ? 'الارتباط' : 'Correlation'}</p>
                      <p className="text-xl font-bold text-brand-primary">{(insight.correlation * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{isArabic ? 'الثقة' : 'Confidence'}</p>
                      <p className="text-xl font-bold text-brand-success">{insight.confidence}%</p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      {isArabic ? 'التوصية:' : 'Recommendation:'}
                    </p>
                    <p className="text-sm">
                      {isArabic ? insight.recommendationAr : insight.recommendation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">{isArabic ? 'القيمة المقدرة' : 'Est. Value'}</p>
                      <p className="font-semibold text-brand-accent">{formatCurrency(insight.estimatedValue)}</p>
                    </div>
                    {insight.actionable && (
                      <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/80">
                        {isArabic ? 'تطبيق' : 'Apply'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {decisions.map((decision) => (
              <Card key={decision.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                      {getDecisionIcon(decision.type)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {isArabic ? decision.titleAr : decision.title}
                      </CardTitle>
                      <CardDescription>
                        {isArabic ? 'احتمالية النجاح: ' : 'Success probability: '} {decision.probability}%
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      {isArabic ? 'العوامل المؤثرة:' : 'Influencing factors:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {decision.factors.map((factor, index) => (
                        <Badge key={index} variant="outline">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      {isArabic ? 'التوصية:' : 'Recommendation:'}
                    </p>
                    <p className="text-sm">
                      {isArabic ? decision.recommendationAr : decision.recommendation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'الجدول الزمني' : 'Timeline'}</p>
                      <p className="font-semibold">{decision.timeline}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'العائد المتوقع' : 'Expected ROI'}</p>
                      <p className="font-semibold text-brand-success">{formatCurrency(decision.roi)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" className="bg-brand-success hover:bg-brand-success/80">
                      {isArabic ? 'موافق' : 'Approve'}
                    </Button>
                    <Button size="sm" variant="outline">
                      {isArabic ? 'مراجعة' : 'Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orchestration" className="space-y-4">
          <div className="space-y-4">
            {orchestrations.map((orchestration) => (
              <Card key={orchestration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {isArabic ? orchestration.nameAr : orchestration.name}
                    </CardTitle>
                    <Badge className={getStatusColor(orchestration.status)}>
                      {orchestration.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {orchestration.fromModule} → {orchestration.toModule}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isArabic ? 'التقدم' : 'Progress'}</span>
                      <span>{orchestration.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-brand-primary h-2 rounded-full transition-all"
                        style={{ width: `${orchestration.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'مستوى الأتمتة' : 'Automation Level'}</p>
                      <p className="font-semibold text-brand-primary">{orchestration.automationLevel}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'الإنجاز المتوقع' : 'Est. Completion'}</p>
                      <p className="font-semibold">{formatDate(orchestration.estimatedCompletion)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrossModuleIntelligence;