import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Calendar, 
  FileText, 
  CheckCircle, 
  TrendingUp,
  Brain,
  Zap,
  Eye,
  Target,
  BarChart3,
  Lightbulb,
  Sparkles,
  Radar,
  Activity,
  Cpu,
  Database,
  LineChart,
  TrendingDown,
  Filter,
  Settings,
  UserPlus,
  Clock,
  Star,
  Award,
  Shield,
  Globe,
  Briefcase,
  GraduationCap,
  MessageSquare,
  PieChart,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { getCurrentLang, isRTL } from '@/lib/i18n/localeDriver';
import { t } from '@/i18n/strings';
import { AqlHRAIAssistant } from '@/components/ai';
import AIQueryInterface from "@/components/ai/AIQueryInterface";
import AutomationWorkflowEngine from "@/components/ai/AutomationWorkflowEngine";
import CrossModuleIntelligence from "@/components/ai/CrossModuleIntelligence";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

// Recruitment-specific translations
const recruitmentStrings = {
  // Page title and description
  page_title: { en: 'Recruitment & Talent Acquisition', ar: 'التوظيف واستقطاب المواهب' },
  page_description: { en: 'Comprehensive system for managing recruitment and talent acquisition processes', ar: 'نظام شامل لإدارة عمليات التوظيف واستقطاب المواهب' },
  
  // KPI labels  
  active_jobs: { en: 'Active Jobs', ar: 'الوظائف النشطة' },
  new_candidates: { en: 'New Candidates', ar: 'المرشحين الجدد' },
  scheduled_interviews: { en: 'Scheduled Interviews', ar: 'المقابلات المجدولة' },
  hires_this_month: { en: 'Hires This Month', ar: 'التوظيفات هذا الشهر' },
  
  // Module names
  job_management: { en: 'Job Management', ar: 'إدارة الوظائف' },
  talent_search: { en: 'Talent Search', ar: 'البحث عن المواهب' },
  interview_scheduling: { en: 'Interview Scheduling', ar: 'جدولة المقابلات' },
  candidate_assessment: { en: 'Candidate Assessment', ar: 'تقييم المرشحين' },
  candidate_management: { en: 'Candidate Management', ar: 'إدارة المرشحين' },
  recruitment_analytics: { en: 'Recruitment Analytics', ar: 'تحليلات التوظيف' },
  
  // Module descriptions
  job_management_desc: { en: 'Create and manage job openings', ar: 'إنشاء وإدارة الوظائف الشاغرة' },
  talent_search_desc: { en: 'Smart search for suitable candidates', ar: 'البحث الذكي عن المرشحين المناسبين' },
  interview_scheduling_desc: { en: 'Schedule and manage interviews', ar: 'جدولة وإدارة المقابلات الشخصية' },
  candidate_assessment_desc: { en: 'Comprehensive candidate evaluation', ar: 'تقييم شامل لقدرات المرشحين' },
  candidate_management_desc: { en: 'Track candidate status through hiring stages', ar: 'متابعة حالة المرشحين عبر مراحل التوظيف' },
  recruitment_analytics_desc: { en: 'Comprehensive recruitment analysis and reports', ar: 'تحليل وتقارير شاملة لعملية التوظيف' },
  
  // Actions
  open_module: { en: 'Open Module', ar: 'فتح الوحدة' },
  
  // Badges
  core: { en: 'Core', ar: 'أساسي' },
  ai: { en: 'AI', ar: 'ذكي' },
  process: { en: 'Process', ar: 'عملية' },
  assessment: { en: 'Assessment', ar: 'تقييم' },
  management: { en: 'Management', ar: 'إدارة' },
  analytics: { en: 'Analytics', ar: 'تحليلات' }
};

// Helper function for translations
const tr = (key: keyof typeof recruitmentStrings) => {
  const lang = getCurrentLang();
  return recruitmentStrings[key][lang];
};

// Formatting utilities
const formatNumber = (num: number) => {
  const lang = getCurrentLang();
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
    useGrouping: true
  }).format(num);
};

const RecruitmentPage: React.FC = () => {
  const lang = getCurrentLang();
  const isArabicRTL = isRTL();
  const isArabic = lang === 'ar';
  const [loading, setLoading] = useState(false);
  const [aiAnalytics, setAiAnalytics] = useState({
    candidateMatch: 96.8,
    biasReduction: 94.2,
    timeToHire: 87.5,
    qualityScore: 92.1,
    costReduction: 2480000,
    automationLevel: 91.7
  });

  // AI-Powered Recruitment Intelligence Stats
  const aiStats = [
    {
      title: isArabic ? 'ذكاء مطابقة المرشحين' : 'Candidate Matching Intelligence',
      value: `${aiAnalytics.candidateMatch}%`,
      icon: Brain,
      variant: "primary" as const,
      trend: { value: "1,247 candidates analyzed", isPositive: true },
      description: isArabic ? 'مطابقة ذكية للمرشحين مع الوظائف' : 'AI-powered candidate-job matching accuracy'
    },
    {
      title: isArabic ? 'كشف التحيز في التوظيف' : 'Bias Detection & Fair Hiring',
      value: `${aiAnalytics.biasReduction}%`,
      icon: Shield,
      variant: "success" as const,
      trend: { value: "Zero bias incidents", isPositive: true },
      description: isArabic ? 'ضمان العدالة في عمليات التوظيف' : 'Ensuring fair and unbiased recruitment processes'
    },
    {
      title: isArabic ? 'تسريع التوظيف الذكي' : 'Smart Hiring Acceleration',
      value: `${aiAnalytics.timeToHire}%`,
      icon: Zap,
      variant: "accent" as const,
      trend: { value: "14 days avg time-to-hire", isPositive: true },
      description: isArabic ? 'تقليل الوقت المطلوب للتوظيف' : 'Reducing time-to-hire through AI optimization'
    },
    {
      title: isArabic ? 'جودة التوظيف المحسنة' : 'Enhanced Hiring Quality',
      value: `${aiAnalytics.qualityScore}%`,
      icon: Star,
      variant: "warning" as const,
      trend: { value: "95% retention after 6 months", isPositive: true },
      description: isArabic ? 'تحسين جودة المرشحين المختارين' : 'Improving quality of selected candidates'
    }
  ];

  // Advanced AI Scenarios for Customer Demo
  const aiScenarios = [
    {
      title: isArabic ? 'محرك البحث الذكي عن المواهب' : 'Intelligent Talent Discovery Engine',
      description: isArabic ? 'البحث عن المواهب المخفية باستخدام التعلم الآلي' : 'Discover hidden talent using machine learning algorithms',
      icon: Search,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      metrics: ['3.2M+ profiles scanned', '89% match accuracy', '47% faster discovery'],
      aiPower: 'NLP + Semantic Search + Predictive Modeling'
    },
    {
      title: isArabic ? 'مقيم المقابلات بالذكاء الاصطناعي' : 'AI-Powered Interview Analyzer',
      description: isArabic ? 'تحليل المقابلات وتقييم المرشحين تلقائياً' : 'Automatic interview analysis and candidate evaluation',
      icon: MessageSquare,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      metrics: ['97% assessment accuracy', '15 min analysis time', '85% bias reduction'],
      aiPower: 'Speech Analysis + Emotion AI + Competency Mapping'
    },
    {
      title: isArabic ? 'محلل التنوع والشمولية' : 'Diversity & Inclusion Analyzer',
      description: isArabic ? 'ضمان التنوع والعدالة في عمليات التوظيف' : 'Ensure diversity and fairness in recruitment processes',
      icon: Users,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      metrics: ['67% Saudi nationals', '43% female hires', '100% fair assessment'],
      aiPower: 'Bias Detection + Diversity Analytics + Fair Hiring Algorithms'
    },
    {
      title: isArabic ? 'متنبئ الأداء المستقبلي' : 'Future Performance Predictor',
      description: isArabic ? 'توقع أداء المرشحين بعد التوظيف' : 'Predict candidate performance post-hiring',
      icon: Radar,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      metrics: ['92% prediction accuracy', '6 months forecast', '23% performance boost'],
      aiPower: 'Predictive Analytics + Performance Modeling + Success Factors'
    },
    {
      title: isArabic ? 'مولد الوصف الوظيفي الذكي' : 'Smart Job Description Generator',
      description: isArabic ? 'إنشاء أوصاف وظيفية محسنة لجذب أفضل المواهب' : 'Generate optimized job descriptions to attract top talent',
      icon: FileText,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      metrics: ['3x more applications', '89% quality improvement', '12 languages supported'],
      aiPower: 'NLG + Market Analysis + Attraction Optimization'
    },
    {
      title: isArabic ? 'محسن خط أنابيب المواهب' : 'Talent Pipeline Optimizer',
      description: isArabic ? 'تحسين خط أنابيب المواهب للاحتياجات المستقبلية' : 'Optimize talent pipeline for future needs',
      icon: Cpu,
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      metrics: ['2,847 candidates in pipeline', '94% readiness score', '6 months lead time'],
      aiPower: 'Workforce Forecasting + Pipeline Management + Strategic Planning'
    }
  ];

  // Real-time AI Insights
  const realTimeInsights = [
    {
      type: 'TALENT_DISCOVERY',
      message: isArabic ? 'اكتشف الذكاء الاصطناعي 23 مرشحاً مثالياً لمنصب مدير تقنية المعلومات' : 'AI discovered 23 perfect candidates for IT Manager position',
      impact: 'High',
      action: isArabic ? 'مراجعة المرشحين' : 'Review Candidates'
    },
    {
      type: 'BIAS_ALERT',
      message: isArabic ? 'تم رصد تحيز محتمل في عملية فحص مرشحي قسم المبيعات' : 'Potential bias detected in Sales department candidate screening',
      impact: 'Medium',
      action: isArabic ? 'تعديل المعايير' : 'Adjust Criteria'
    },
    {
      type: 'PIPELINE_OPTIMIZATION',
      message: isArabic ? 'خط أنابيب المواهب محسن للربع القادم - 156 مرشحاً جاهزاً' : 'Talent pipeline optimized for next quarter - 156 candidates ready',
      impact: 'Info',
      action: isArabic ? 'عرض الخطة' : 'View Pipeline'
    }
  ];

  // Candidate Journey Analytics
  const candidateJourney = [
    { stage: isArabic ? 'التقديم' : 'Application', count: 1247, aiOptimization: 94 },
    { stage: isArabic ? 'الفحص الأولي' : 'Initial Screening', count: 423, aiOptimization: 97 },
    { stage: isArabic ? 'التقييم التقني' : 'Technical Assessment', count: 187, aiOptimization: 89 },
    { stage: isArabic ? 'المقابلة الشخصية' : 'Interview', count: 89, aiOptimization: 92 },
    { stage: isArabic ? 'التوظيف النهائي' : 'Final Hiring', count: 34, aiOptimization: 96 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl" dir={isArabicRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl -z-10"></div>
        <div className="p-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isArabic ? 'التوظيف الذكي بالذكاء الاصطناعي' : 'AI-Powered Smart Recruitment'}
            </h1>
            <UserPlus className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-6">
            {isArabic 
              ? 'نظام توظيف ثوري مدعوم بالذكاء الاصطناعي يكتشف المواهب، يضمن العدالة، ويتنبأ بالأداء لبناء فريق استثنائي'
              : 'Revolutionary AI-powered recruitment system that discovers talent, ensures fairness, and predicts performance to build exceptional teams'
            }
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {isArabic ? '1,247 مرشح نشط' : '1,247 Active Candidates'}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {isArabic ? '24/7 بحث ذكي' : '24/7 Smart Discovery'}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {isArabic ? '94.2% تقليل التحيز' : '94.2% Bias Reduction'}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="ai-dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-8">
          <TabsTrigger value="ai-dashboard" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            {isArabic ? 'لوحة الذكاء الاصطناعي' : 'AI Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {isArabic ? 'سيناريوهات ذكية' : 'AI Scenarios'}
          </TabsTrigger>
          <TabsTrigger value="talent-discovery" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {isArabic ? 'اكتشاف المواهب' : 'Talent Discovery'}
          </TabsTrigger>
          <TabsTrigger value="interview-ai" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {isArabic ? 'مقابلات ذكية' : 'Smart Interviews'}
          </TabsTrigger>
          <TabsTrigger value="diversity" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {isArabic ? 'التنوع والشمولية' : 'Diversity & Inclusion'}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {isArabic ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            {isArabic ? 'المساعد الذكي' : 'AI Assistant'}
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {isArabic ? 'الوثائق' : 'Documents'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-dashboard">
          <div className="space-y-8">
            {/* AI Intelligence Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiStats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-5 w-5 text-primary animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    {stat.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">{stat.trend.value}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Real-time AI Insights */}
            <Card className="bg-gradient-to-r from-background via-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary animate-pulse" />
                  {isArabic ? 'رؤى الذكاء الاصطناعي الفورية' : 'Real-time AI Recruitment Insights'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'اكتشافات ذكية مستمرة من تحليل بيانات التوظيف' : 'Continuous intelligent discoveries from recruitment data analysis'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {realTimeInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className={`p-2 rounded-full ${
                        insight.impact === 'High' ? 'bg-red-500/10 text-red-500' :
                        insight.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        <Brain className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{insight.message}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={insight.impact === 'High' ? 'destructive' : insight.impact === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                            {insight.impact} Impact
                          </Badge>
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            {insight.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Candidate Journey */}
            <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  {isArabic ? 'رحلة المرشحين الذكية' : 'AI-Enhanced Candidate Journey'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تحسين كل مرحلة من مراحل التوظيف بالذكاء الاصطناعي' : 'AI optimization at every stage of the recruitment process'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidateJourney.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{stage.stage}</h4>
                          <p className="text-sm text-muted-foreground">{stage.count} candidates</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary">{stage.aiOptimization}% AI Optimized</div>
                          <Progress value={stage.aiOptimization} className="w-24 h-2" />
                        </div>
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {isArabic ? 'سيناريوهات الذكاء الاصطناعي المتقدمة' : 'Advanced AI Recruitment Scenarios'}
              </h2>
              <p className="text-muted-foreground">
                {isArabic ? 'استكشف قوة الذكاء الاصطناعي في استقطاب وتوظيف المواهب' : 'Explore the power of AI in talent acquisition and hiring'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiScenarios.map((scenario, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                  <div className={`absolute inset-0 ${scenario.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <scenario.icon className="h-8 w-8 text-primary mb-3" />
                      <Badge variant="outline" className="text-xs">AI-Powered</Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        🧠 {scenario.aiPower}
                      </div>
                      <div className="space-y-2">
                        {scenario.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="font-medium">{metric}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4" variant="outline" size="sm">
                        {isArabic ? 'استكشاف السيناريو' : 'Explore Scenario'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="talent-discovery">
          <Card className="bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-6 w-6 text-blue-500 animate-pulse" />
                {isArabic ? 'محرك اكتشاف المواهب الذكي' : 'Intelligent Talent Discovery Engine'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'اكتشف المواهب المخفية باستخدام الذكاء الاصطناعي المتقدم' : 'Discover hidden talent using advanced AI algorithms'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg bg-background/50 border">
                  <Database className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{isArabic ? 'قاعدة بيانات المواهب' : 'Talent Database'}</h3>
                  <div className="text-2xl font-bold text-blue-500 mb-2">3.2M+</div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'ملف شخصي محلل بالذكاء الاصطناعي' : 'AI-analyzed profiles'}
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-background/50 border">
                  <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{isArabic ? 'دقة المطابقة' : 'Matching Accuracy'}</h3>
                  <div className="text-2xl font-bold text-green-500 mb-2">96.8%</div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'دقة مطابقة الوظائف مع المرشحين' : 'Job-candidate matching precision'}
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-background/50 border">
                  <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{isArabic ? 'سرعة البحث' : 'Search Speed'}</h3>
                  <div className="text-2xl font-bold text-purple-500 mb-2">2.3s</div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'متوسط وقت البحث الذكي' : 'Average intelligent search time'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview-ai">
          <Card className="bg-gradient-to-br from-green-500/10 via-background to-emerald-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-green-500" />
                {isArabic ? 'مقيم المقابلات بالذكاء الاصطناعي' : 'AI-Powered Interview Analyzer'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'تحليل ذكي للمقابلات وتقييم شامل للمرشحين' : 'Intelligent interview analysis and comprehensive candidate evaluation'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{isArabic ? 'تحليل المقابلات الصوتية' : 'Voice Interview Analysis'}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'وضوح التواصل' : 'Communication Clarity'}</span>
                      <span className="text-sm font-medium text-green-600">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'الثقة بالنفس' : 'Confidence Level'}</span>
                      <span className="text-sm font-medium text-blue-600">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'المعرفة التقنية' : 'Technical Knowledge'}</span>
                      <span className="text-sm font-medium text-purple-600">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{isArabic ? 'نتائج التحليل' : 'Analysis Results'}</h3>
                  <div className="text-center py-8">
                    <div className="text-3xl font-bold text-green-500 mb-2">97%</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isArabic ? 'دقة التقييم الإجمالية' : 'Overall Assessment Accuracy'}
                    </p>
                    <Badge variant="secondary" className="mb-2">
                      {isArabic ? '15 دقيقة وقت التحليل' : '15 min Analysis Time'}
                    </Badge>
                    <br />
                    <Badge variant="secondary">
                      {isArabic ? '85% تقليل التحيز' : '85% Bias Reduction'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversity">
          <Card className="bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-500" />
                {isArabic ? 'محلل التنوع والشمولية' : 'Diversity & Inclusion Analyzer'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'ضمان العدالة والتنوع في جميع عمليات التوظيف' : 'Ensuring fairness and diversity in all recruitment processes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg bg-background/50 border">
                  <PieChart className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{isArabic ? 'السعوديين' : 'Saudi Nationals'}</h3>
                  <div className="text-2xl font-bold text-green-500 mb-2">67%</div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'من إجمالي التوظيفات الجديدة' : 'Of total new hires'}
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-background/50 border">
                  <Users className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{isArabic ? 'التوظيف النسائي' : 'Female Hires'}</h3>
                  <div className="text-2xl font-bold text-pink-500 mb-2">43%</div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'تحقيق التوازن الجندري' : 'Achieving gender balance'}
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-background/50 border">
                  <CheckSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{isArabic ? 'التقييم العادل' : 'Fair Assessment'}</h3>
                  <div className="text-2xl font-bold text-blue-500 mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'خالي من التحيز والتمييز' : 'Bias-free evaluation'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'تحليلات التوظيف' : 'Recruitment Analytics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  {isArabic ? 'لوحة تحليلات التوظيف المتقدمة' : 'Advanced recruitment analytics dashboard'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'أداء القنوات' : 'Channel Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  {isArabic ? 'تحليل أداء قنوات التوظيف' : 'Recruitment channel performance analysis'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assistant">
          <AIQueryInterface 
            moduleContext="recruitment"
            companyId="demo-company"
            className="mb-6"
          />
        </TabsContent>

        <TabsContent value="documents">
          <ModuleDocumentUploader moduleKey="recruitment" />
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant 
        moduleContext="recruitment.management" 
        companyId="demo-company"
      />
    </div>
  );
};

export default RecruitmentPage;