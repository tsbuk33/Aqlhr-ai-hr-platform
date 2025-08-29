import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  Zap, 
  BarChart3,
  Award,
  Clock,
  Shield,
  Eye,
  Sparkles
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const PerformancePage = () => {
  const { isArabic } = useSimpleLanguage();

  const aiScenarios = [
    {
      id: 'performance_prediction',
      title: isArabic ? 'محرك توقع الأداء الذكي' : 'Intelligent Performance Prediction Engine',
      description: isArabic ? 'توقع أداء الموظفين والفرق للأشهر القادمة بدقة عالية' : 'Predict employee and team performance for upcoming months with high accuracy',
      icon: Target,
      scenario: isArabic 
        ? 'نماذج التنبؤ حللت أداء 1,847 موظف وتوقعت الأداء للربع القادم بدقة 94.7%. حددت 67 موظف معرض لانخفاض الأداء ووضعت خطط تدخل مبكر وفرت SAR 1.8M في تكاليف الدوران.'
        : 'Prediction models analyzed 1,847 employee performance and forecasted next quarter with 94.7% accuracy. Identified 67 employees at risk of performance decline and created early intervention plans saving SAR 1.8M in turnover costs.',
      metrics: {
        employees_analyzed: 1847,
        prediction_accuracy: '94.7%',
        at_risk_identified: 67,
        intervention_success: '89%',
        turnover_prevention: 'SAR 1.8M',
        early_warning_time: '45 days'
      },
      aiPower: 'Performance ML + Behavioral Analytics + Risk Prediction + Intervention Planning'
    },
    {
      id: 'skill_gap_analysis',
      title: isArabic ? 'تحليل فجوات المهارات الذكي' : 'Intelligent Skills Gap Analysis',  
      description: isArabic ? 'تحديد وتحليل فجوات المهارات وإنشاء خطط التطوير المخصصة' : 'Identify and analyze skills gaps and create personalized development plans',
      icon: Star,
      scenario: isArabic
        ? 'محرك المهارات الذكي حلل 2,156 ملف مهاري وحدد 347 فجوة مهارية عبر 15 قسم. أنشأ خطط تطوير مخصصة لـ892 موظف وتوقع تحسن الأداء بنسبة 43% خلال 6 أشهر.'
        : 'Smart skills engine analyzed 2,156 skill profiles and identified 347 skills gaps across 15 departments. Created personalized development plans for 892 employees and predicted 43% performance improvement within 6 months.',
      metrics: {
        skill_profiles_analyzed: 2156,
        gaps_identified: 347,
        departments_covered: 15,
        development_plans: 892,
        predicted_improvement: '43%',
        time_to_proficiency: '6 months'
      },
      aiPower: 'Skills Mapping + Gap Analysis + Development Planning + Learning Path Optimization'
    },
    {
      id: 'goal_alignment',
      title: isArabic ? 'محاذاة الأهداف الذكية' : 'Smart Goal Alignment System',
      description: isArabic ? 'محاذاة أهداف الموظفين مع استراتيجية الشركة تلقائياً' : 'Automatically align employee goals with company strategy',
      icon: CheckCircle,
      scenario: isArabic
        ? 'نظام المحاذاة الذكي ربط 1,534 هدف فردي بـ23 هدف استراتيجي للشركة. حقق محاذاة بنسبة 91% وزاد الإنتاجية بـ38% عبر التركيز على الأولويات الصحيحة.'
        : 'Smart alignment system connected 1,534 individual goals with 23 strategic company objectives. Achieved 91% alignment and increased productivity by 38% through focus on right priorities.',
      metrics: {
        individual_goals: 1534,
        strategic_objectives: 23,
        alignment_rate: '91%',
        productivity_increase: '38%',
        goal_completion: '84%',
        strategic_impact: '92%'
      },
      aiPower: 'Goal Mapping + Strategic Alignment + Priority Optimization + Impact Measurement'
    },
    {
      id: 'feedback_intelligence',
      title: isArabic ? 'ذكاء التغذية الراجعة' : 'Feedback Intelligence Engine',
      description: isArabic ? 'تحليل وفهم التغذية الراجعة وتوليد رؤى قابلة للتنفيذ' : 'Analyze and understand feedback to generate actionable insights',
      icon: Eye,
      scenario: isArabic
        ? 'محرك التغذية الراجعة حلل 8,456 تعليق وتقييم واستخرج 234 رؤية قابلة للتنفيذ. حدد 15 نمط سلوكي وأنشأ خطط تحسين مخصصة لـ456 موظف.'
        : 'Feedback engine analyzed 8,456 comments and reviews and extracted 234 actionable insights. Identified 15 behavioral patterns and created personalized improvement plans for 456 employees.',
      metrics: {
        feedback_analyzed: 8456,
        actionable_insights: 234,
        behavioral_patterns: 15,
        improvement_plans: 456,
        sentiment_accuracy: '96.2%',
        response_time: '2 hours'
      },
      aiPower: 'NLP Analysis + Sentiment Detection + Pattern Recognition + Action Planning'
    },
    {
      id: 'performance_coaching',
      title: isArabic ? 'التدريب الذكي للأداء' : 'Intelligent Performance Coaching',
      description: isArabic ? 'توجيه وتدريب مخصص لتحسين الأداء الفردي' : 'Personalized coaching and guidance for individual performance improvement',
      icon: Award,
      scenario: isArabic
        ? 'نظام التدريب الذكي قدم 3,267 توجيه مخصص لـ789 موظف. حقق تحسن في الأداء بنسبة 52% وزاد رضا الموظفين عن التطوير بـ67%.'
        : 'Smart coaching system delivered 3,267 personalized coaching sessions to 789 employees. Achieved 52% performance improvement and increased development satisfaction by 67%.',
      metrics: {
        coaching_sessions: 3267,
        employees_coached: 789,
        performance_improvement: '52%',
        satisfaction_increase: '67%',
        skill_development: '78%',
        retention_improvement: '29%'
      },
      aiPower: 'Personalized Coaching + Learning Analytics + Progress Tracking + Adaptive Content'
    },
    {
      id: 'team_optimization',
      title: isArabic ? 'تحسين الفرق الذكي' : 'Smart Team Optimization',
      description: isArabic ? 'تحليل وتحسين ديناميكيات الفرق وتشكيلات العمل' : 'Analyze and optimize team dynamics and work formations',
      icon: Users,
      scenario: isArabic
        ? 'محرك تحسين الفرق حلل 124 فريق عمل وأعاد تشكيل 34 فريق لتحسين الأداء. زاد الإنتاجية الجماعية بـ41% وحسن التعاون بنسبة 58%.'
        : 'Team optimization engine analyzed 124 work teams and restructured 34 teams for better performance. Increased collective productivity by 41% and improved collaboration by 58%.',
      metrics: {
        teams_analyzed: 124,
        teams_restructured: 34,
        productivity_increase: '41%',
        collaboration_improvement: '58%',
        team_satisfaction: '73%',
        project_success_rate: '86%'
      },
      aiPower: 'Team Analytics + Dynamic Optimization + Collaboration Intelligence + Success Prediction'
    }
  ];

  const realTimeStats = {
    performancePrediction: 94.7,
    skillsAnalysis: 92.4,
    goalAlignment: 91.0,
    coachingEffectiveness: 89.3
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl">
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {isArabic ? 'إدارة الأداء بالذكاء الاصطناعي' : 'AI-Powered Performance Management'}
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {isArabic ? 'نظام متقدم لإدارة الأداء مدعوم بالذكاء الاصطناعي مع توقعات دقيقة وتطوير مخصص' : 'Advanced AI-driven performance management system with precise predictions and personalized development'}
        </p>
        
        {/* Real-time AI Intelligence Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600">{realTimeStats.performancePrediction}%</div>
            <div className="text-sm text-purple-600/80">{isArabic ? 'توقع الأداء' : 'Performance Prediction'}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
            <div className="text-2xl font-bold text-pink-600">{realTimeStats.skillsAnalysis}%</div>
            <div className="text-sm text-pink-600/80">{isArabic ? 'تحليل المهارات' : 'Skills Analysis'}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="text-2xl font-bold text-indigo-600">{realTimeStats.goalAlignment}%</div>
            <div className="text-sm text-indigo-600/80">{isArabic ? 'محاذاة الأهداف' : 'Goal Alignment'}</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
            <div className="text-2xl font-bold text-teal-600">{realTimeStats.coachingEffectiveness}%</div>
            <div className="text-sm text-teal-600/80">{isArabic ? 'فعالية التدريب' : 'Coaching Effectiveness'}</div>
          </div>
        </div>
      </div>

      {/* AI Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {aiScenarios.map((scenario) => {
          const IconComponent = scenario.icon;
          return (
            <Card key={scenario.id} className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/5 group-hover:from-purple-500/10 group-hover:to-pink-600/10 transition-all duration-300" />
              
              <CardHeader className="relative">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-purple-600 transition-colors">
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {scenario.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* AI Scenario */}
                <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 p-4 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        {isArabic ? 'سيناريو الذكاء الاصطناعي' : 'AI Intelligence Scenario'}
                      </h4>
                      <p className="text-sm text-purple-600/80 dark:text-purple-400/80 leading-relaxed">
                        {scenario.scenario}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(scenario.metrics).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="bg-surface/50 p-3 rounded-lg border border-border/50">
                      <div className="text-lg font-bold text-foreground">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Power Badge */}
                <div className="flex items-center gap-2 pt-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <Badge variant="secondary" className="text-xs">
                    {scenario.aiPower}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Assistant */}
      <AqlHRAIAssistant 
        moduleContext="performance" 
        companyId="demo-company"
      />
      
      {/* AI Integration for Performance */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="performance-management" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'performance-optimization', 'predictive-analytics', 'strategic-planning']}
      />
    </div>
  );
};

export default PerformancePage;