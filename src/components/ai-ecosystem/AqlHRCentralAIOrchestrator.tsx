import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Eye, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Cpu,
  Network,
  Activity,
  Layers
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';

interface AIModule {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'predictive' | 'automation' | 'intelligence' | 'compliance' | 'optimization';
  status: 'active' | 'learning' | 'optimizing' | 'maintenance';
  accuracy: number;
  processingSpeed: number;
  impact: 'critical' | 'high' | 'medium' | 'low';
  saudiCompliance: boolean;
  integration: string[];
  kpis: {
    processed: number;
    efficiency: number;
    cost_savings: number;
    user_satisfaction: number;
  };
}

interface PredictiveInsight {
  id: string;
  module: string;
  insight: string;
  insightAr: string;
  confidence: number;
  timeframe: string;
  impact: 'positive' | 'negative' | 'neutral';
  actionRequired: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

export const AqlHRCentralAIOrchestrator: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [aiModules, setAiModules] = useState<AIModule[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [systemHealth, setSystemHealth] = useState(98.7);
  const [totalProcessing, setTotalProcessing] = useState(15847);
  const [efficiency, setEfficiency] = useState(96.3);
  const [costSavings, setCostSavings] = useState(2.4);

  useEffect(() => {
    const mockModules: AIModule[] = [
      {
        id: 'workforce_predictor',
        name: 'Workforce Demand Predictor',
        nameAr: 'متنبئ الطلب على القوى العاملة',
        description: 'AI-powered workforce planning and demand forecasting',
        descriptionAr: 'تخطيط القوى العاملة والتنبؤ بالطلب بالذكاء الاصطناعي',
        category: 'predictive',
        status: 'active',
        accuracy: 94.8,
        processingSpeed: 1200,
        impact: 'critical',
        saudiCompliance: true,
        integration: ['HRMS', 'Payroll', 'Government Systems'],
        kpis: { processed: 2847, efficiency: 94.8, cost_savings: 0.8, user_satisfaction: 96 }
      },
      {
        id: 'compliance_automator',
        name: 'Saudi Compliance Automator',
        nameAr: 'مؤتمت الامتثال السعودي',
        description: 'Automated compliance monitoring for Saudi regulations',
        descriptionAr: 'مراقبة الامتثال الآلي للوائح السعودية',
        category: 'compliance',
        status: 'active',
        accuracy: 99.2,
        processingSpeed: 800,
        impact: 'critical',
        saudiCompliance: true,
        integration: ['QIWA', 'GOSI', 'MOL', 'Absher'],
        kpis: { processed: 5432, efficiency: 99.2, cost_savings: 1.2, user_satisfaction: 98 }
      },
      {
        id: 'performance_optimizer',
        name: 'Performance Intelligence Engine',
        nameAr: 'محرك ذكاء الأداء',
        description: 'AI-driven performance analysis and optimization',
        descriptionAr: 'تحليل الأداء والتحسين بالذكاء الاصطناعي',
        category: 'optimization',
        status: 'learning',
        accuracy: 91.5,
        processingSpeed: 950,
        impact: 'high',
        saudiCompliance: true,
        integration: ['Performance Management', 'Learning Systems'],
        kpis: { processed: 1876, efficiency: 91.5, cost_savings: 0.4, user_satisfaction: 92 }
      }
    ];

    const mockInsights: PredictiveInsight[] = [
      {
        id: '1',
        module: 'Workforce Predictor',
        insight: 'Expected 15% increase in Saudi talent demand in Q2 2025',
        insightAr: 'متوقع زيادة 15% في الطلب على المواهب السعودية في الربع الثاني 2025',
        confidence: 87,
        timeframe: '3 months',
        impact: 'positive',
        actionRequired: true,
        priority: 'high'
      },
      {
        id: '2',
        module: 'Compliance Automator',
        insight: 'New MOL regulation will affect 34% of current policies',
        insightAr: 'لائحة وزارة العمل الجديدة ستؤثر على 34% من السياسات الحالية',
        confidence: 94,
        timeframe: '1 month',
        impact: 'negative',
        actionRequired: true,
        priority: 'urgent'
      }
    ];

    setAiModules(mockModules);
    setInsights(mockInsights);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'learning': return 'bg-blue-500';
      case 'optimizing': return 'bg-yellow-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'predictive': return <Brain className="h-5 w-5" />;
      case 'automation': return <Zap className="h-5 w-5" />;
      case 'intelligence': return <Eye className="h-5 w-5" />;
      case 'compliance': return <ShieldCheck className="h-5 w-5" />;
      case 'optimization': return <Target className="h-5 w-5" />;
      default: return <Cpu className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isArabic ? 'منسق الذكاء الاصطناعي المركزي - عقل' : 'AqlHR Central AI Orchestrator'}
        </h1>
        <p className="text-xl text-muted-foreground">
          {isArabic 
            ? 'النظام الأكثر تقدماً لإدارة وتنسيق جميع قدرات الذكاء الاصطناعي في المملكة العربية السعودية'
            : 'The most advanced system for managing and orchestrating all AI capabilities in Saudi Arabia'
          }
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  {isArabic ? 'صحة النظام' : 'System Health'}
                </p>
                <p className="text-3xl font-bold text-green-700">{systemHealth}%</p>
              </div>
              <Activity className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  {isArabic ? 'العمليات المعالجة' : 'Total Processing'}
                </p>
                <p className="text-3xl font-bold text-blue-700">{totalProcessing.toLocaleString()}</p>
              </div>
              <Cpu className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  {isArabic ? 'الكفاءة الإجمالية' : 'Overall Efficiency'}
                </p>
                <p className="text-3xl font-bold text-purple-700">{efficiency}%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  {isArabic ? 'التوفير (مليون ريال)' : 'Cost Savings (M SAR)'}
                </p>
                <p className="text-3xl font-bold text-orange-700">{costSavings}</p>
              </div>
              <DollarSign className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">
            {isArabic ? 'وحدات الذكاء' : 'AI Modules'}
          </TabsTrigger>
          <TabsTrigger value="insights">
            {isArabic ? 'الرؤى التنبؤية' : 'Predictive Insights'}
          </TabsTrigger>
          <TabsTrigger value="performance">
            {isArabic ? 'الأداء' : 'Performance'}
          </TabsTrigger>
          <TabsTrigger value="saudi-focus">
            {isArabic ? 'التركيز السعودي' : 'Saudi Focus'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {aiModules.map((module) => (
              <Card key={module.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(module.category)}
                      <div>
                        <CardTitle className="text-lg">
                          {isArabic ? module.nameAr : module.name}
                        </CardTitle>
                        <CardDescription>
                          {isArabic ? module.descriptionAr : module.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(module.status)} text-white`}>
                      {module.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'الدقة' : 'Accuracy'}
                      </p>
                      <Progress value={module.accuracy} className="h-2" />
                      <p className="text-sm font-medium">{module.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'السرعة' : 'Speed'}
                      </p>
                      <p className="text-sm font-medium">{module.processingSpeed}/min</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant={module.saudiCompliance ? "default" : "secondary"}>
                      {module.saudiCompliance 
                        ? (isArabic ? 'متوافق سعودياً' : 'Saudi Compliant')
                        : (isArabic ? 'غير متوافق' : 'Non-Compliant')
                      }
                    </Badge>
                    <Badge variant="outline">
                      {module.impact}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {isArabic ? 'التكاملات:' : 'Integrations:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {module.integration.map((int, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {int}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className={`border-2 ${getPriorityColor(insight.priority)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{insight.module}</Badge>
                        <Badge className={
                          insight.priority === 'urgent' 
                            ? 'bg-red-500 text-white'
                            : insight.priority === 'high'
                            ? 'bg-orange-500 text-white'
                            : 'bg-blue-500 text-white'
                        }>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-lg font-medium mb-2">
                        {isArabic ? insight.insightAr : insight.insight}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>{isArabic ? 'الثقة:' : 'Confidence:'} {insight.confidence}%</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{isArabic ? 'الإطار الزمني:' : 'Timeframe:'} {insight.timeframe}</span>
                        </span>
                      </div>
                    </div>
                    {insight.actionRequired && (
                      <Button size="sm" className="bg-primary text-white">
                        {isArabic ? 'اتخاذ إجراء' : 'Take Action'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'أداء الوحدات' : 'Module Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiModules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {isArabic ? module.nameAr : module.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {module.kpis.efficiency}%
                        </span>
                      </div>
                      <Progress value={module.kpis.efficiency} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'المؤشرات الرئيسية' : 'Key Metrics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'إجمالي العمليات المعالجة' : 'Total Operations Processed'}</span>
                    <span className="font-bold">{totalProcessing.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'متوسط دقة النظام' : 'Average System Accuracy'}</span>
                    <span className="font-bold">95.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'وقت الاستجابة المتوسط' : 'Average Response Time'}</span>
                    <span className="font-bold">847ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'معدل رضا المستخدمين' : 'User Satisfaction Rate'}</span>
                    <span className="font-bold">96.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saudi-focus" className="space-y-6">
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-green-600" />
                <span>{isArabic ? 'التميز السعودي في الذكاء الاصطناعي' : 'Saudi AI Excellence'}</span>
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'نظام عقل مصمم خصيصاً للسوق السعودي مع الامتثال الكامل للوائح المحلية'
                  : 'AqlHR system specifically designed for Saudi market with full local compliance'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-white border">
                  <ShieldCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium">{isArabic ? 'الامتثال الحكومي' : 'Government Compliance'}</h3>
                  <p className="text-sm text-muted-foreground">100%</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium">{isArabic ? 'السعودة المدعومة بالذكاء' : 'AI-Powered Saudization'}</h3>
                  <p className="text-sm text-muted-foreground">94.8%</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border">
                  <Network className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium">{isArabic ? 'التكامل الحكومي' : 'Gov Integration'}</h3>
                  <p className="text-sm text-muted-foreground">15 {isArabic ? 'منصة' : 'Platforms'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{isArabic ? 'المميزات الخاصة بالسوق السعودي:' : 'Saudi Market Specific Features:'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{isArabic ? 'تحليل النطاقات الذكي' : 'Smart Nitaqat Analysis'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{isArabic ? 'تحليل المحتوى المحلي' : 'Local Content Analysis'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{isArabic ? 'التقويم الهجري التلقائي' : 'Automatic Hijri Calendar'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{isArabic ? 'معالجة اللغة العربية المتقدمة' : 'Advanced Arabic NLP'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant moduleContext="central.ai.orchestrator" />
    </div>
  );
};

export default AqlHRCentralAIOrchestrator;