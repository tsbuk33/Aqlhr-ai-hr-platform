import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Brain, 
  TrendingUp, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Zap, 
  Target,
  Clock,
  Award,
  Lightbulb,
  Map,
  Sparkles
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const TrainingPage = () => {
  const { isArabic } = useSimpleLanguage();

  const aiScenarios = [
    {
      id: 'personalized_learning',
      title: isArabic ? 'التعلم المخصص الذكي' : 'Intelligent Personalized Learning',
      description: isArabic ? 'مسارات تعليمية مخصصة لكل موظف بناءً على احتياجاته ومهاراته' : 'Customized learning paths for each employee based on their needs and skills',
      icon: BookOpen,
      scenario: isArabic 
        ? 'محرك التعلم الذكي حلل 1,654 ملف مهاري وأنشأ مسارات تعليمية مخصصة لـ1,234 موظف. زاد معدل إكمال التدريب بـ73% وحسن اكتساب المهارات بنسبة 84% عبر التخصيص الدقيق.'
        : 'Smart learning engine analyzed 1,654 skill profiles and created personalized learning paths for 1,234 employees. Increased training completion rate by 73% and improved skill acquisition by 84% through precise personalization.',
      metrics: {
        skill_profiles_analyzed: 1654,
        personalized_paths: 1234,
        completion_rate_increase: '73%',
        skill_acquisition_improvement: '84%',
        learning_efficiency: '91%',
        time_to_competency: '45% faster'
      },
      aiPower: 'Adaptive Learning + Skills Mapping + Progress Analytics + Content Optimization'
    },
    {
      id: 'competency_prediction',
      title: isArabic ? 'توقع الكفاءات الذكي' : 'Intelligent Competency Prediction',  
      description: isArabic ? 'توقع احتياجات المهارات المستقبلية وتخطيط التدريب المسبق' : 'Predict future skills needs and plan proactive training',
      icon: Target,
      scenario: isArabic
        ? 'نماذج التنبؤ حللت اتجاهات السوق وتوقعت احتياجات 89 مهارة جديدة للعامين القادمين. بدأت برامج تدريب استباقية لـ567 موظف ووفرت SAR 2.3M في تكاليف التأهيل الطارئ.'
        : 'Prediction models analyzed market trends and forecasted needs for 89 new skills for next two years. Started proactive training programs for 567 employees and saved SAR 2.3M in emergency upskilling costs.',
      metrics: {
        skills_predicted: 89,
        forecast_horizon: '2 years',
        proactive_training: 567,
        cost_savings: 'SAR 2.3M',
        preparedness_score: '93%',
        market_readiness: '87%'
      },
      aiPower: 'Market Analysis + Skills Forecasting + Proactive Planning + Cost Optimization'
    },
    {
      id: 'learning_optimization',
      title: isArabic ? 'تحسين التعلم التكيفي' : 'Adaptive Learning Optimization',
      description: isArabic ? 'تحسين محتوى وطرق التدريب بناءً على أنماط التعلم والأداء' : 'Optimize training content and methods based on learning patterns and performance',
      icon: Lightbulb,
      scenario: isArabic
        ? 'نظام التحسين التكيفي حلل 15,678 جلسة تدريب وحسن المحتوى لـ234 برنامج. زاد معدل الاستيعاب بـ62% وقلل وقت التدريب بنسبة 38% مع الحفاظ على جودة التعلم.'
        : 'Adaptive optimization system analyzed 15,678 training sessions and optimized content for 234 programs. Increased retention rate by 62% and reduced training time by 38% while maintaining learning quality.',
      metrics: {
        training_sessions: 15678,
        programs_optimized: 234,
        retention_increase: '62%',
        time_reduction: '38%',
        content_effectiveness: '91%',
        learner_satisfaction: '89%'
      },
      aiPower: 'Learning Analytics + Content Optimization + Adaptive Delivery + Performance Tracking'
    },
    {
      id: 'skill_gap_bridging',
      title: isArabic ? 'سد فجوات المهارات الذكي' : 'Intelligent Skills Gap Bridging',
      description: isArabic ? 'تحديد وسد فجوات المهارات بطرق مبتكرة وفعالة' : 'Identify and bridge skills gaps with innovative and effective methods',
      icon: Map,
      scenario: isArabic
        ? 'محرك سد الفجوات حدد 456 فجوة مهارية عبر 18 قسم وأنشأ حلول مخصصة لكل فجوة. حقق سد 78% من الفجوات خلال 6 أشهر وحسن الإنتاجية الإجمالية بـ34%.'
        : 'Gap bridging engine identified 456 skills gaps across 18 departments and created customized solutions for each gap. Achieved closure of 78% of gaps within 6 months and improved overall productivity by 34%.',
      metrics: {
        gaps_identified: 456,
        departments_covered: 18,
        gap_closure_rate: '78%',
        timeline: '6 months',
        productivity_improvement: '34%',
        capability_enhancement: '67%'
      },
      aiPower: 'Gap Analysis + Solution Design + Progress Tracking + Impact Measurement'
    },
    {
      id: 'micro_learning',
      title: isArabic ? 'التعلم المصغر الذكي' : 'Smart Micro-Learning System',
      description: isArabic ? 'تقديم المحتوى التعليمي في وحدات صغيرة ومركزة وفعالة' : 'Deliver learning content in small, focused, and effective units',
      icon: Clock,
      scenario: isArabic
        ? 'نظام التعلم المصغر قسم 1,234 دورة إلى 8,967 وحدة تعليمية ذكية. زاد معدل الإكمال بـ89% وحسن الاحتفاظ بالمعلومات بنسبة 76% عبر التعلم الموزع.'
        : 'Micro-learning system divided 1,234 courses into 8,967 smart learning units. Increased completion rate by 89% and improved information retention by 76% through distributed learning.',
      metrics: {
        courses_divided: 1234,
        micro_units: 8967,
        completion_increase: '89%',
        retention_improvement: '76%',
        engagement_rate: '94%',
        time_efficiency: '65%'
      },
      aiPower: 'Content Segmentation + Spaced Learning + Engagement Optimization + Retention Analytics'
    },
    {
      id: 'social_learning',
      title: isArabic ? 'التعلم الاجتماعي الذكي' : 'Intelligent Social Learning',
      description: isArabic ? 'تعزيز التعلم من خلال التفاعل والتشارك بين الموظفين' : 'Enhance learning through interaction and sharing among employees',
      icon: Users,
      scenario: isArabic
        ? 'منصة التعلم الاجتماعي ربطت 1,456 متعلم في 89 مجموعة تعلم تفاعلية. زادت مشاركة المعرفة بـ156% وحققت تسريع في التعلم بنسبة 47% عبر التعلم التشاركي.'
        : 'Social learning platform connected 1,456 learners in 89 interactive learning groups. Increased knowledge sharing by 156% and achieved 47% learning acceleration through collaborative learning.',
      metrics: {
        learners_connected: 1456,
        learning_groups: 89,
        knowledge_sharing_increase: '156%',
        learning_acceleration: '47%',
        peer_interaction: '83%',
        collective_intelligence: '91%'
      },
      aiPower: 'Social Network Analysis + Collaborative Learning + Knowledge Graphs + Peer Matching'
    }
  ];

  const realTimeStats = {
    learningEffectiveness: 91.4,
    skillDevelopment: 87.8,
    contentOptimization: 94.2,
    engagementRate: 89.6
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-xl">
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {isArabic ? 'التدريب والتطوير بالذكاء الاصطناعي' : 'AI-Powered Training & Development'}
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {isArabic ? 'نظام متطور للتدريب والتطوير مدعوم بالذكاء الاصطناعي مع تعلم مخصص وتنبؤ بالمهارات' : 'Advanced AI-driven training and development system with personalized learning and skills prediction'}
        </p>
        
        {/* Real-time AI Intelligence Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600">{realTimeStats.learningEffectiveness}%</div>
            <div className="text-sm text-green-600/80">{isArabic ? 'فعالية التعلم' : 'Learning Effectiveness'}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600">{realTimeStats.skillDevelopment}%</div>
            <div className="text-sm text-blue-600/80">{isArabic ? 'تطوير المهارات' : 'Skill Development'}</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
            <div className="text-2xl font-bold text-teal-600">{realTimeStats.contentOptimization}%</div>
            <div className="text-sm text-teal-600/80">{isArabic ? 'تحسين المحتوى' : 'Content Optimization'}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="text-2xl font-bold text-indigo-600">{realTimeStats.engagementRate}%</div>
            <div className="text-sm text-indigo-600/80">{isArabic ? 'معدل المشاركة' : 'Engagement Rate'}</div>
          </div>
        </div>
      </div>

      {/* AI Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {aiScenarios.map((scenario) => {
          const IconComponent = scenario.icon;
          return (
            <Card key={scenario.id} className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-600/5 group-hover:from-green-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
              
              <CardHeader className="relative">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-green-600 transition-colors">
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
                <div className="bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10 p-4 rounded-lg border border-green-200/50 dark:border-green-800/30">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                        {isArabic ? 'سيناريو الذكاء الاصطناعي' : 'AI Intelligence Scenario'}
                      </h4>
                      <p className="text-sm text-green-600/80 dark:text-green-400/80 leading-relaxed">
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
        moduleContext="training" 
        companyId="demo-company"
      />
      
      {/* AI Integration for Training */}
      <UniversalAIIntegrator 
        pageType="training" 
        moduleName="training-development" 
        companyId="demo-company" 
        enabledFeatures={['learning-optimization', 'skill-development', 'training-analytics', 'employee-management']}
      />
    </div>
  );
};

export default TrainingPage;