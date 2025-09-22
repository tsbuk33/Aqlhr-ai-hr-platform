import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useAICore } from '@/hooks/useAICore';
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Globe,
  Zap,
  Calendar,
  FileText,
  Mic,
  Volume2
} from 'lucide-react';

const AIEnhancedExecutiveIntelligence = () => {
  const { language } = useLanguage();
  const { getWorkforceAnalytics, loading } = useAICore();
  const [activeTab, setActiveTab] = useState('overview');
  const [aiMode, setAIMode] = useState('advisor');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const isArabic = language === 'ar';

  useEffect(() => {
    fetchExecutiveAnalytics();
  }, []);

  const fetchExecutiveAnalytics = async () => {
    try {
      const data = await getWorkforceAnalytics('demo-company', 'comprehensive');
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Strategic KPIs with AI predictions
  const strategicKPIs = [
    {
      id: 1,
      title: isArabic ? 'معدل السعودة' : 'Saudization Rate',
      current: 67,
      target: 75,
      predicted: 73,
      trend: 'up',
      confidence: 0.94,
      impact: 'high',
      description: isArabic 
        ? 'توقع الوصول إلى 73% خلال 6 أشهر مع خطة التوظيف الحالية'
        : 'Expected to reach 73% within 6 months with current hiring plan'
    },
    {
      id: 2,
      title: isArabic ? 'الإنتاجية التشغيلية' : 'Operational Efficiency',
      current: 89,
      target: 95,
      predicted: 92,
      trend: 'up',
      confidence: 0.87,
      impact: 'medium',
      description: isArabic 
        ? 'تحسن متوقع 3% مع تنفيذ برامج الأتمتة'
        : '3% improvement expected with automation programs'
    },
    {
      id: 3,
      title: isArabic ? 'معدل الاحتفاظ بالمواهب' : 'Talent Retention',
      current: 92,
      target: 95,
      predicted: 94,
      trend: 'up',
      confidence: 0.91,
      impact: 'high',
      description: isArabic 
        ? 'استقرار ممتاز مع برامج التطوير المهني'
        : 'Excellent stability with professional development programs'
    },
    {
      id: 4,
      title: isArabic ? 'مؤشر الامتثال' : 'Compliance Index',
      current: 98,
      target: 100,
      predicted: 99,
      trend: 'up',
      confidence: 0.96,
      impact: 'critical',
      description: isArabic 
        ? 'امتثال ممتاز مع تحسينات طفيفة مطلوبة'
        : 'Excellent compliance with minor improvements needed'
    }
  ];

  // AI Strategic Scenarios
  const strategicScenarios = [
    {
      id: 1,
      title: isArabic ? 'سيناريو التوسع السريع' : 'Rapid Expansion Scenario',
      description: isArabic 
        ? 'توسع بنسبة 30% خلال 12 شهر'
        : '30% expansion within 12 months',
      probability: 0.75,
      impact: {
        workforce: '+45 employees',
        cost: 'SAR 2.3M',
        timeline: '12 months',
        risks: ['Talent shortage', 'Integration challenges']
      },
      recommendations: [
        isArabic ? 'بدء التوظيف المكثف' : 'Start intensive recruitment',
        isArabic ? 'تطوير برامج التدريب' : 'Develop training programs',
        isArabic ? 'تحسين البنية التحتية' : 'Improve infrastructure'
      ]
    },
    {
      id: 2,
      title: isArabic ? 'سيناريو الأتمتة الشاملة' : 'Full Automation Scenario',
      description: isArabic 
        ? 'أتمتة 60% من العمليات الروتينية'
        : 'Automate 60% of routine processes',
      probability: 0.68,
      impact: {
        efficiency: '+35%',
        cost_savings: 'SAR 1.8M annually',
        timeline: '8 months',
        workforce_impact: 'Upskilling required'
      },
      recommendations: [
        isArabic ? 'استثمار في التكنولوجيا' : 'Invest in technology',
        isArabic ? 'إعادة تأهيل الموظفين' : 'Reskill employees',
        isArabic ? 'إدارة التغيير' : 'Change management'
      ]
    }
  ];

  // Voice-activated AI commands
  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('saudization') || lowerCommand.includes('السعودة')) {
      setActiveTab('saudization');
    } else if (lowerCommand.includes('forecast') || lowerCommand.includes('توقع')) {
      setActiveTab('predictions');
    } else if (lowerCommand.includes('risks') || lowerCommand.includes('مخاطر')) {
      setActiveTab('risks');
    } else if (lowerCommand.includes('scenarios') || lowerCommand.includes('سيناريو')) {
      setActiveTab('scenarios');
    }
  };

  const generateExecutiveBriefing = () => {
    const briefingContent = `
# ${isArabic ? 'موجز تنفيذي يومي' : 'Daily Executive Briefing'}
${new Date().toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}

## ${isArabic ? 'النقاط الرئيسية' : 'Key Highlights'}

**${isArabic ? 'الأداء العام:' : 'Overall Performance:'}** ${isArabic ? 'ممتاز' : 'Excellent'} (94%)

**${isArabic ? 'المخاطر الحرجة:' : 'Critical Risks:'}** ${isArabic ? 'منخفضة' : 'Low'} (2 items)

**${isArabic ? 'الفرص الاستراتيجية:' : 'Strategic Opportunities:'}** ${isArabic ? 'عالية' : 'High'} (5 identified)

## ${isArabic ? 'التوصيات الفورية' : 'Immediate Recommendations'}

1. ${isArabic ? 'تسريع خطة السعودة للوصول للهدف' : 'Accelerate Saudization plan to meet target'}
2. ${isArabic ? 'تنفيذ برنامج الأتمتة في العمليات' : 'Implement automation in operations'}
3. ${isArabic ? 'مراجعة استراتيجية الاحتفاظ بالمواهب' : 'Review talent retention strategy'}

${isArabic ? 'تم إنشاؤه بواسطة مانوس الذكي' : 'Generated by Manus AI'}
    `;

    // Create and download briefing
    const blob = new Blob([briefingContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-briefing-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* AI Strategic Advisor Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isArabic ? 'مركز الذكاء التنفيذي المدعوم بالذكاء الاصطناعي' : 'AI-Enhanced Executive Intelligence Centre'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'رؤى استراتيجية مدعومة بالذكاء الاصطناعي' : 'AI-powered strategic insights and decision support'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={generateExecutiveBriefing} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                {isArabic ? 'موجز تنفيذي' : 'Executive Briefing'}
              </Button>
              <Badge variant="default" className="bg-green-500">
                {isArabic ? 'مانوس نشط' : 'Manus Active'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Strategic KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {strategicKPIs.map((kpi) => (
          <Card key={kpi.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              kpi.impact === 'critical' ? 'bg-red-500' :
              kpi.impact === 'high' ? 'bg-orange-500' :
              kpi.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{kpi.current}%</span>
                  <Badge variant="outline">
                    {Math.round(kpi.confidence * 100)}% {isArabic ? 'ثقة' : 'confidence'}
                  </Badge>
                </div>
                <Progress value={(kpi.current / kpi.target) * 100} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{isArabic ? 'الهدف:' : 'Target:'} {kpi.target}%</span>
                  <span className="text-primary font-medium">
                    {isArabic ? 'متوقع:' : 'Predicted:'} {kpi.predicted}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights and Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="predictions">{isArabic ? 'التوقعات' : 'Predictions'}</TabsTrigger>
          <TabsTrigger value="scenarios">{isArabic ? 'السيناريوهات' : 'Scenarios'}</TabsTrigger>
          <TabsTrigger value="risks">{isArabic ? 'المخاطر' : 'Risks'}</TabsTrigger>
          <TabsTrigger value="insights">{isArabic ? 'الرؤى' : 'Insights'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {isArabic ? 'أداء المؤسسة' : 'Organizational Performance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800">
                        {isArabic ? 'الأداء الممتاز' : 'Excellent Performance'}
                      </h4>
                      <p className="text-sm text-green-600 mt-1">
                        {isArabic ? 'جميع المؤشرات في المسار الصحيح' : 'All metrics on track'}
                      </p>
                      <div className="mt-3">
                        <Progress value={94} className="h-3" />
                        <p className="text-xs text-green-600 mt-1">94% {isArabic ? 'من الأهداف محققة' : 'of targets achieved'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <AIInsightCard 
                moduleContext="executive"
                companyId="demo-company"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {isArabic ? 'التوقعات الاستراتيجية' : 'Strategic Predictions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategicKPIs.map((kpi) => (
                  <div key={kpi.id} className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium">{kpi.title}</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{isArabic ? 'حالي:' : 'Current:'}</span>
                        <span className="font-medium">{kpi.current}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{isArabic ? 'متوقع:' : 'Predicted:'}</span>
                        <span className="font-medium text-primary">{kpi.predicted}%</span>
                      </div>
                      <Progress value={kpi.confidence * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">{kpi.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid gap-6">
            {strategicScenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <Badge variant="outline">
                      {Math.round(scenario.probability * 100)}% {isArabic ? 'احتمالية' : 'probability'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{scenario.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(scenario.impact).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-sm font-medium">{key.replace('_', ' ')}</p>
                        <p className="text-lg font-bold text-primary">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">{isArabic ? 'التوصيات:' : 'Recommendations:'}</h5>
                    <ul className="space-y-1">
                      {scenario.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                {isArabic ? 'تحليل المخاطر الاستراتيجية' : 'Strategic Risk Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800">
                    {isArabic ? 'مخاطر متوسطة' : 'Medium Risk'}
                  </h4>
                  <p className="text-sm text-yellow-600 mt-1">
                    {isArabic ? 'مراقبة مطلوبة للمؤشرات التالية' : 'Monitoring required for the following indicators'}
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li className="text-sm">• {isArabic ? 'معدل دوران الموظفين في الهندسة' : 'Engineering team turnover rate'}</li>
                    <li className="text-sm">• {isArabic ? 'تحديات التوسع الجغرافي' : 'Geographical expansion challenges'}</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">
                    {isArabic ? 'مخاطر منخفضة' : 'Low Risk'}
                  </h4>
                  <p className="text-sm text-green-600 mt-1">
                    {isArabic ? 'الوضع مستقر في المجالات التالية' : 'Stable situation in the following areas'}
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li className="text-sm">• {isArabic ? 'الامتثال التنظيمي' : 'Regulatory compliance'}</li>
                    <li className="text-sm">• {isArabic ? 'الاستقرار المالي' : 'Financial stability'}</li>
                    <li className="text-sm">• {isArabic ? 'رضا الموظفين' : 'Employee satisfaction'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsightCard 
            moduleContext="executive"
            companyId="demo-company"
          />
        </TabsContent>
      </Tabs>

      {/* AI Floating Assistant */}
      <AIFloatingAssistant 
        moduleContext="executive"
        companyId="demo-company"
        currentPageData={{ activeTab, strategicKPIs }}
      />
    </div>
  );
};

export default AIEnhancedExecutiveIntelligence;