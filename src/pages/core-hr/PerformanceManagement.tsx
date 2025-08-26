import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, Target, Users, Star, Award, Brain, Zap, Activity, Shield,
  ArrowUp, ArrowDown, Eye, Edit, MoreVertical, Download, Bell, MessageCircle,
  CheckCircle, AlertTriangle, Clock, BarChart3, PieChart, LineChart,
  Lightbulb, Rocket, Compass, Map, Route, Flag, Trophy, Crown
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { AqlHRAIAssistant } from '@/components/ai';
import { ModuleDocumentUploader } from '@/components/universal';

const PerformanceManagement = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  // AI-Enhanced Performance Intelligence System
  const [aiInsights, setAIInsights] = useState({
    performancePrediction: {
      topPerformers: 234,
      atRiskEmployees: 47,
      potentialPromotions: 89,
      skillGapsCritical: 156,
      overallHealthScore: 87.3,
    },
    talentAnalytics: {
      highPotential: 123,
      successorReadiness: 67,
      retentionRisk: 'medium',
      leadershipPipeline: 45,
      diversityIndex: 78.9,
    },
    goalIntelligence: {
      goalsOnTrack: 78.2,
      overdueMilestones: 23,
      adaptiveGoalsCreated: 156,
      alignmentScore: 92.1,
    },
    feedbackAnalytics: {
      continuousFeedbackRate: 89.4,
      participationRate: 94.7,
      actionItemCompletion: 82.3,
      managerEffectiveness: 88.6,
    },
    developmentIntelligence: {
      skillsDevelopment: 85.7,
      careerPathClarity: 79.8,
      mentoringMatches: 234,
      learningEngagement: 91.2,
    },
    biasDetection: {
      reviewBiasScore: 96.8,
      diversityCompliance: 94.2,
      fairnessIndex: 97.1,
      calibrationAccuracy: 89.4,
    }
  });

  // Enhanced performance statistics with AI insights
  const enhancedPerformanceStats = [
    {
      label: language === 'ar' ? 'نقاط الأداء بالذكاء الاصطناعي' : 'AI Performance Score',
      value: `${aiInsights.performancePrediction.overallHealthScore}%`,
      trend: '+5.2%',
      icon: Brain,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/5'
    },
    {
      label: language === 'ar' ? 'المواهب عالية الإمكانات' : 'High Potential Talent',
      value: `${aiInsights.talentAnalytics.highPotential}`,
      trend: '+12%',
      icon: Star,
      color: 'text-yellow-600',
      bgGradient: 'from-yellow-500/10 to-yellow-600/5'
    },
    {
      label: language === 'ar' ? 'موظفون معرضون للخطر' : 'At-Risk Employees',
      value: `${aiInsights.performancePrediction.atRiskEmployees}`,
      trend: '-18%',
      icon: Shield,
      color: 'text-red-600',
      bgGradient: 'from-red-500/10 to-red-600/5'
    },
    {
      label: language === 'ar' ? 'درجة اكتشاف التحيز' : 'Bias Detection Score',
      value: `${aiInsights.biasDetection.reviewBiasScore}%`,
      trend: '+3%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgGradient: 'from-green-500/10 to-green-600/5'
    }
  ];

  // AI-powered performance insights
  const performanceInsights = [
    {
      type: 'talent_development',
      title: language === 'ar' ? 'خط أنابيب المواهب الذكي' : 'Smart Talent Pipeline',
      description: language === 'ar' 
        ? 'تحديد 89 موظف جاهز للترقية بناءً على تحليل الأداء والإمكانات'
        : 'Identified 89 employees ready for promotion based on performance and potential analysis',
      impact: 'High',
      confidence: 94,
      icon: Rocket,
    },
    {
      type: 'performance_coaching',
      title: language === 'ar' ? 'التدريب التنبؤي' : 'Predictive Coaching',
      description: language === 'ar' 
        ? '47 موظف يحتاج تدخل فوري لتحسين الأداء مع خطط مخصصة'
        : '47 employees need immediate performance intervention with personalized coaching plans',
      impact: 'Critical',
      confidence: 91,
      icon: Target,
    },
    {
      type: 'succession_planning',
      title: language === 'ar' ? 'تخطيط الخلافة الذكي' : 'AI Succession Planning',
      description: language === 'ar' 
        ? 'تحديد 67 خليفة جاهز للأدوار القيادية الحرجة'
        : 'Identified 67 ready successors for critical leadership roles',
      impact: 'Medium',
      confidence: 88,
      icon: Crown,
    }
  ];

  // Top performers with AI analysis
  const topPerformers = [
    {
      id: 'EMP001',
      name: language === 'ar' ? 'أحمد محمد السالم' : 'Ahmed Mohamed Al-Salem',
      department: language === 'ar' ? 'الهندسة' : 'Engineering',
      role: language === 'ar' ? 'مطور أول' : 'Senior Developer',
      aiScore: 97,
      performanceRating: 4.8,
      potentialRating: 'High',
      nextAction: 'promotion_ready',
      strengths: ['Technical Excellence', 'Leadership', 'Innovation'],
      riskLevel: 'low'
    },
    {
      id: 'EMP002',
      name: language === 'ar' ? 'فاطمة عبدالله النهدي' : 'Fatima Abdullah Al-Nahdi',
      department: language === 'ar' ? 'المبيعات' : 'Sales',
      role: language === 'ar' ? 'مدير مبيعات' : 'Sales Manager',
      aiScore: 94,
      performanceRating: 4.6,
      potentialRating: 'High',
      nextAction: 'succession_candidate',
      strengths: ['Client Relations', 'Strategy', 'Team Building'],
      riskLevel: 'low'
    },
    {
      id: 'EMP003',
      name: language === 'ar' ? 'محمد علي القحطاني' : 'Mohammed Ali Al-Qahtani',
      department: language === 'ar' ? 'التسويق' : 'Marketing',
      role: language === 'ar' ? 'أخصائي تسويق رقمي' : 'Digital Marketing Specialist',
      aiScore: 91,
      performanceRating: 4.4,
      potentialRating: 'Medium-High',
      nextAction: 'skill_development',
      strengths: ['Analytics', 'Creativity', 'Campaign Management'],
      riskLevel: 'medium'
    }
  ];

  const getPotentialBadge = (potential: string) => {
    switch (potential) {
      case 'High':
        return { variant: 'default' as const, label: language === 'ar' ? 'عالي' : 'High', color: 'bg-green-500' };
      case 'Medium-High':
        return { variant: 'secondary' as const, label: language === 'ar' ? 'متوسط-عالي' : 'Med-High', color: 'bg-blue-500' };
      case 'Medium':
        return { variant: 'outline' as const, label: language === 'ar' ? 'متوسط' : 'Medium', color: 'bg-yellow-500' };
      default:
        return { variant: 'outline' as const, label: potential, color: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <TrendingUp className="h-10 w-10 text-primary" />
              <Brain className="absolute -top-1 -right-1 h-5 w-5 text-purple-600 bg-white rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-yellow-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'ذكاء الأداء الاصطناعي' : 'AI Performance Intelligence'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === 'ar' 
                  ? 'نظام ذكي متطور لإدارة الأداء والتنبؤ بالمواهب وتطوير القيادات'
                  : 'Advanced intelligent performance management with talent prediction and leadership development'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span>Performance Health: {aiInsights.performancePrediction.overallHealthScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>High Potential: {aiInsights.talentAnalytics.highPotential}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Bias Score: {aiInsights.biasDetection.reviewBiasScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-500" />
              <span>Goal Alignment: {aiInsights.goalIntelligence.alignmentScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Brain className="h-4 w-4" />
            {language === 'ar' ? 'تحليل المواهب' : 'Talent Analytics'}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تقرير الأداء' : 'Performance Report'}
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-yellow-600">
            <Rocket className="h-4 w-4" />
            {language === 'ar' ? 'تحسين تلقائي' : 'Auto Optimize'}
          </Button>
        </div>
      </div>

      {/* AI-Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {enhancedPerformanceStats.map((stat, index) => (
          <Card key={index} className={`border-l-4 border-l-primary bg-gradient-to-br ${stat.bgGradient} hover:shadow-lg transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <div className="flex items-center gap-2">
                    {stat.trend.startsWith('+') ? (
                      <ArrowUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.bgGradient}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Performance Intelligence Dashboard */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Performers AI Analysis */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              {language === 'ar' ? 'تحليل أفضل المؤدين' : 'Top Performers AI Analysis'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'تحليل ذكي لأفضل المؤدين مع توصيات التطوير' : 'Intelligent top performer analysis with development recommendations'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{performer.name}</span>
                        <Badge variant="outline" className="text-xs">{performer.id}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{performer.department} • {performer.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge {...getPotentialBadge(performer.potentialRating)} className="text-xs" />
                      <Badge variant="secondary" className="text-xs">AI: {performer.aiScore}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance Rating</span>
                      <span className="font-medium">{performer.performanceRating}/5.0</span>
                    </div>
                    <Progress value={(performer.performanceRating / 5) * 100} className="h-2" />
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {performer.strengths.slice(0, 3).map((strength, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Performance Insights Engine */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              {language === 'ar' ? 'محرك رؤى الأداء' : 'Performance Insights Engine'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'رؤى ذكية وتوصيات لتحسين الأداء' : 'Intelligent insights and recommendations for performance improvement'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceInsights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <insight.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{insight.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.impact === 'High' || insight.impact === 'Critical' ? 'default' : 'secondary'} className="text-xs">
                        {insight.impact}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}%
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                  <Progress value={insight.confidence} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goal Intelligence & Alignment */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              {language === 'ar' ? 'ذكاء الأهداف والمواءمة' : 'Goal Intelligence & Alignment'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'تحليل ذكي لمواءمة الأهداف وتتبع الإنجاز' : 'Smart goal alignment analysis and achievement tracking'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'الأهداف على المسار' : 'Goals On Track'}</span>
                </div>
                <Badge variant="default">{aiInsights.goalIntelligence.goalsOnTrack}%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'درجة المواءمة' : 'Alignment Score'}</span>
                </div>
                <Badge variant="default">{aiInsights.goalIntelligence.alignmentScore}%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'المعالم المتأخرة' : 'Overdue Milestones'}</span>
                </div>
                <Badge variant="secondary">{aiInsights.goalIntelligence.overdueMilestones}</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button className="w-full gap-2">
                <Target className="h-4 w-4" />
                {language === 'ar' ? 'إنشاء أهداف ذكية' : 'Generate Smart Goals'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bias Detection & Fairness Engine */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              {language === 'ar' ? 'محرك اكتشاف التحيز' : 'Bias Detection & Fairness Engine'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'اكتشاف التحيز وضمان العدالة في تقييمات الأداء' : 'Bias detection and fairness assurance in performance evaluations'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{language === 'ar' ? 'درجة اكتشاف التحيز' : 'Review Bias Score'}</span>
                  <Badge variant="default">{aiInsights.biasDetection.reviewBiasScore}%</Badge>
                </div>
                <Progress value={aiInsights.biasDetection.reviewBiasScore} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{language === 'ar' ? 'مؤشر العدالة' : 'Fairness Index'}</span>
                  <Badge variant="default">{aiInsights.biasDetection.fairnessIndex}%</Badge>
                </div>
                <Progress value={aiInsights.biasDetection.fairnessIndex} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{language === 'ar' ? 'امتثال التنوع' : 'Diversity Compliance'}</span>
                  <Badge variant="secondary">{aiInsights.biasDetection.diversityCompliance}%</Badge>
                </div>
                <Progress value={aiInsights.biasDetection.diversityCompliance} className="h-2" />
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{language === 'ar' ? 'لم يتم اكتشاف تحيز كبير' : 'No significant bias detected'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ModuleDocumentUploader moduleKey="performance-management" />
      <AqlHRAIAssistant moduleContext="performance.management" />
    </div>
  );
};

export default PerformanceManagement;