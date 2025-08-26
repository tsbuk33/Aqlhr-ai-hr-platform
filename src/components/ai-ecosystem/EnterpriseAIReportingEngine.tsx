import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  PieChart,
  Download,
  Send,
  Calendar,
  Filter,
  Search,
  Globe,
  Crown,
  Zap,
  Eye,
  Brain
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';

interface ReportTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'executive' | 'operational' | 'compliance' | 'strategic' | 'financial';
  aiEnhanced: boolean;
  saudiSpecific: boolean;
  frequency: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  stakeholders: string[];
  kpis: string[];
  visualizations: string[];
  languages: ('ar' | 'en')[];
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk' | 'prediction';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  actionRequired: boolean;
}

export const EnterpriseAIReportingEngine: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const mockTemplates: ReportTemplate[] = [
      {
        id: 'executive_dashboard',
        name: 'Executive Leadership Dashboard',
        nameAr: 'لوحة قيادة تنفيذية',
        description: 'Comprehensive executive insights with predictive analytics',
        descriptionAr: 'رؤى تنفيذية شاملة مع التحليلات التنبؤية',
        category: 'executive',
        aiEnhanced: true,
        saudiSpecific: true,
        frequency: 'real-time',
        stakeholders: ['CEO', 'CHRO', 'Board'],
        kpis: ['Workforce ROI', 'Saudization Rate', 'Employee Satisfaction', 'Cost per Hire'],
        visualizations: ['Trend Charts', 'Heat Maps', 'Predictive Models'],
        languages: ['ar', 'en']
      },
      {
        id: 'saudi_compliance_report',
        name: 'Saudi Regulatory Compliance Report',
        nameAr: 'تقرير الامتثال التنظيمي السعودي',
        description: 'AI-powered compliance monitoring and reporting',
        descriptionAr: 'مراقبة الامتثال والتقارير بالذكاء الاصطناعي',
        category: 'compliance',
        aiEnhanced: true,
        saudiSpecific: true,
        frequency: 'daily',
        stakeholders: ['Legal Team', 'HR Director', 'Compliance Officer'],
        kpis: ['Compliance Score', 'Violations', 'Risk Level', 'Nitaqat Status'],
        visualizations: ['Compliance Matrix', 'Risk Indicators', 'Trend Analysis'],
        languages: ['ar', 'en']
      },
      {
        id: 'workforce_analytics',
        name: 'Advanced Workforce Analytics',
        nameAr: 'تحليلات القوى العاملة المتقدمة',
        description: 'Deep workforce insights with AI predictions',
        descriptionAr: 'رؤى عميقة للقوى العاملة مع التنبؤات الذكية',
        category: 'strategic',
        aiEnhanced: true,
        saudiSpecific: true,
        frequency: 'weekly',
        stakeholders: ['HR Team', 'Department Heads', 'Strategy Team'],
        kpis: ['Retention Rate', 'Performance Trends', 'Skills Gap', 'Succession Readiness'],
        visualizations: ['Predictive Models', 'Skill Maps', 'Performance Distributions'],
        languages: ['ar', 'en']
      },
      {
        id: 'financial_hr_impact',
        name: 'HR Financial Impact Analysis',
        nameAr: 'تحليل الأثر المالي للموارد البشرية',
        description: 'ROI analysis of HR initiatives with cost optimization',
        descriptionAr: 'تحليل عائد الاستثمار لمبادرات الموارد البشرية مع تحسين التكاليف',
        category: 'financial',
        aiEnhanced: true,
        saudiSpecific: false,
        frequency: 'monthly',
        stakeholders: ['CFO', 'CHRO', 'Finance Team'],
        kpis: ['HR ROI', 'Cost per Employee', 'Training ROI', 'Productivity Index'],
        visualizations: ['ROI Dashboards', 'Cost Breakdowns', 'Efficiency Metrics'],
        languages: ['ar', 'en']
      }
    ];

    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'prediction',
        title: 'Workforce Demand Surge Expected',
        titleAr: 'متوقع ارتفاع في الطلب على القوى العاملة',
        description: 'AI predicts 18% increase in hiring demand across tech and healthcare sectors by Q3 2025',
        descriptionAr: 'الذكاء الاصطناعي يتنبأ بزيادة 18% في الطلب على التوظيف في قطاعي التكنولوجيا والرعاية الصحية بحلول الربع الثالث 2025',
        confidence: 89,
        impact: 'high',
        timeframe: '6 months',
        actionRequired: true
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'Cost Optimization Opportunity Identified',
        titleAr: 'تم تحديد فرصة تحسين التكاليف',
        description: 'AI analysis reveals potential 12% reduction in operational costs through workflow automation',
        descriptionAr: 'تحليل الذكاء الاصطناعي يكشف عن إمكانية تخفيض 12% في التكاليف التشغيلية من خلال أتمتة سير العمل',
        confidence: 92,
        impact: 'high',
        timeframe: '3 months',
        actionRequired: true
      },
      {
        id: '3',
        type: 'risk',
        title: 'Potential Compliance Risk Detected',
        titleAr: 'تم اكتشاف مخاطر امتثال محتملة',
        description: 'New regulatory changes may affect current Saudization strategies',
        descriptionAr: 'التغييرات التنظيمية الجديدة قد تؤثر على استراتيجيات السعودة الحالية',
        confidence: 76,
        impact: 'medium',
        timeframe: '2 months',
        actionRequired: true
      }
    ];

    setReportTemplates(mockTemplates);
    setAiInsights(mockInsights);
  }, []);

  const generateReport = async (templateId: string) => {
    setIsGenerating(true);
    // Simulate AI report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    
    // Show success notification
    alert(isArabic ? 'تم إنشاء التقرير بنجاح' : 'Report generated successfully!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'executive': return <Crown className="h-5 w-5" />;
      case 'operational': return <BarChart3 className="h-5 w-5" />;
      case 'compliance': return <Globe className="h-5 w-5" />;
      case 'strategic': return <Target className="h-5 w-5" />;
      case 'financial': return <DollarSign className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'opportunity': return <Zap className="h-5 w-5" />;
      case 'risk': return <Eye className="h-5 w-5" />;
      case 'prediction': return <Brain className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const filteredTemplates = reportTemplates.filter(template =>
    (isArabic ? template.nameAr : template.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (isArabic ? template.descriptionAr : template.description).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isArabic ? 'محرك التقارير المؤسسية بالذكاء الاصطناعي' : 'Enterprise AI Reporting Engine'}
        </h1>
        <p className="text-xl text-muted-foreground">
          {isArabic 
            ? 'أنشئ تقارير ذكية ومفصلة للإدارة التنفيذية والعملياتية مع التحليلات التنبؤية المتقدمة'
            : 'Generate intelligent, detailed reports for executive and operational management with advanced predictive analytics'
          }
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={isArabic ? 'البحث في التقارير...' : 'Search reports...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>{isArabic ? 'فلتر' : 'Filter'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">
            {isArabic ? 'قوالب التقارير' : 'Report Templates'}
          </TabsTrigger>
          <TabsTrigger value="insights">
            {isArabic ? 'الرؤى الذكية' : 'AI Insights'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {isArabic ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(template.category)}
                      <div>
                        <CardTitle className="text-lg">
                          {isArabic ? template.nameAr : template.name}
                        </CardTitle>
                        <CardDescription>
                          {isArabic ? template.descriptionAr : template.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {template.aiEnhanced && (
                        <Badge className="bg-purple-500 text-white">
                          {isArabic ? 'ذكي' : 'AI Enhanced'}
                        </Badge>
                      )}
                      {template.saudiSpecific && (
                        <Badge className="bg-green-500 text-white">
                          {isArabic ? 'سعودي' : 'Saudi Specific'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {isArabic ? 'التكرار' : 'Frequency'}
                      </p>
                      <Badge variant="outline">{template.frequency}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {isArabic ? 'اللغات' : 'Languages'}
                      </p>
                      <div className="flex space-x-1">
                        {template.languages.map((lang) => (
                          <Badge key={lang} variant="secondary" className="text-xs">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isArabic ? 'المؤشرات الرئيسية:' : 'Key KPIs:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.kpis.slice(0, 3).map((kpi, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {kpi}
                        </Badge>
                      ))}
                      {template.kpis.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.kpis.length - 3} {isArabic ? 'المزيد' : 'more'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => generateReport(template.id)}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          {isArabic ? 'إنشاء...' : 'Generating...'}
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          {isArabic ? 'إنشاء تقرير' : 'Generate Report'}
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={
                            insight.type === 'risk' 
                              ? 'bg-red-500 text-white'
                              : insight.type === 'opportunity'
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                          }>
                            {insight.type}
                          </Badge>
                          <Badge variant={insight.impact === 'high' ? 'destructive' : 'secondary'}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          {isArabic ? insight.titleAr : insight.title}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {isArabic ? insight.descriptionAr : insight.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <span>{isArabic ? 'الثقة:' : 'Confidence:'}</span>
                            <Progress value={insight.confidence} className="w-16 h-2" />
                            <span>{insight.confidence}%</span>
                          </div>
                          <span>{isArabic ? 'الإطار الزمني:' : 'Timeframe:'} {insight.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    {insight.actionRequired && (
                      <Button size="sm">
                        {isArabic ? 'اتخاذ إجراء' : 'Take Action'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'التقارير المُنشأة' : 'Reports Generated'}
                    </p>
                    <p className="text-3xl font-bold">2,847</p>
                  </div>
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'الرؤى المُكتشفة' : 'Insights Discovered'}
                    </p>
                    <p className="text-3xl font-bold">1,254</p>
                  </div>
                  <Eye className="h-12 w-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'التوفير (مليون ريال)' : 'Savings (M SAR)'}
                    </p>
                    <p className="text-3xl font-bold">4.2</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'دقة التنبؤات' : 'Prediction Accuracy'}
                    </p>
                    <p className="text-3xl font-bold">94.8%</p>
                  </div>
                  <Target className="h-12 w-12 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'استخدام التقارير حسب الفئة' : 'Report Usage by Category'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{isArabic ? 'تنفيذي' : 'Executive'}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={75} className="w-32" />
                    <span className="text-sm">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isArabic ? 'الامتثال' : 'Compliance'}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={68} className="w-32" />
                    <span className="text-sm">68%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isArabic ? 'استراتيجي' : 'Strategic'}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={52} className="w-32" />
                    <span className="text-sm">52%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isArabic ? 'مالي' : 'Financial'}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={41} className="w-32" />
                    <span className="text-sm">41%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant moduleContext="enterprise.ai.reporting" />
    </div>
  );
};

export default EnterpriseAIReportingEngine;