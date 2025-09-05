import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/hooks/useLanguageCompat';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  Eye, 
  BarChart3,
  Lightbulb,
  Settings,
  Activity,
  CheckCircle
} from 'lucide-react';

interface LearningInsights {
  overallMetrics: any;
  recentLearnings: any[];
  predictiveCapabilities: any;
  systemEvolution: any;
}

interface PatternAnalysis {
  patterns: any;
  insights: any;
  behavioralMetrics: any;
  predictions: any;
}

export const AdaptiveLearningDashboard = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [learningInsights, setLearningInsights] = useState<LearningInsights | null>(null);
  const [patternAnalysis, setPatternAnalysis] = useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeOptimizations, setActiveOptimizations] = useState(0);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    setLoading(true);
    try {
      const [insightsResponse, patternsResponse] = await Promise.all([
        supabase.functions.invoke('adaptive-learning-engine', {
          body: {
            action: 'get_learning_insights',
            userId: 'demo-user'
          }
        }),
        supabase.functions.invoke('adaptive-learning-engine', {
          body: {
            action: 'analyze_patterns',
            data: {
              userSessions: 247,
              interactions: 1523,
              workflows: 89
            }
          }
        })
      ]);

      if (insightsResponse.data?.success) {
        setLearningInsights(insightsResponse.data.data);
      }

      if (patternsResponse.data?.success) {
        setPatternAnalysis(patternsResponse.data.data);
      }

      setActiveOptimizations(15);
    } catch (error) {
      console.error('Error loading learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('adaptive-learning-engine', {
        body: {
          action: 'optimize_performance',
          data: {
            responseTime: 1.2,
            throughput: 2500,
            errorRate: 0.1
          }
        }
      });

      if (response.data?.success) {
        await loadLearningData();
      }
    } catch (error) {
      console.error('Error running optimization:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !learningInsights) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!learningInsights || !patternAnalysis) return null;

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isArabic ? 'لوحة التعلم التكيفي' : 'Adaptive Learning Dashboard'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? 'خوارزميات التحسين المستمر والتعلم الذكي' : 'Continuous Improvement Algorithms & Intelligent Learning'}
          </p>
        </div>
        <Button 
          onClick={runOptimization}
          disabled={loading}
          className="bg-brand-primary hover:bg-brand-primary/90"
        >
          {loading ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              {isArabic ? 'جاري التحسين...' : 'Optimizing...'}
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              {isArabic ? 'تشغيل التحسين' : 'Run Optimization'}
            </>
          )}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-brand-primary" />
              <div className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'فعالية التعلم' : 'Learning Effectiveness'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {learningInsights.overallMetrics.learningEffectiveness}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-brand-success" />
              <div className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'نجاح التكيف' : 'Adaptation Success'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {learningInsights.overallMetrics.adaptationSuccess}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-brand-accent" />
              <div className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'تحسن الرضا' : 'Satisfaction Improvement'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              +{learningInsights.overallMetrics.userSatisfactionImprovement}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-brand-warning" />
              <div className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'مكاسب الإنتاجية' : 'Productivity Gain'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              +{learningInsights.overallMetrics.productivityGain}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="insights" className="w-full">
        <TabsList>
          <TabsTrigger value="insights">
            {isArabic ? 'رؤى التعلم' : 'Learning Insights'}
          </TabsTrigger>
          <TabsTrigger value="patterns">
            {isArabic ? 'تحليل الأنماط' : 'Pattern Analysis'}
          </TabsTrigger>
          <TabsTrigger value="optimization">
            {isArabic ? 'التحسين' : 'Optimization'}
          </TabsTrigger>
          <TabsTrigger value="evolution">
            {isArabic ? 'تطور النظام' : 'System Evolution'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-brand-accent" />
                <span>{isArabic ? 'التعلمات الحديثة' : 'Recent Learnings'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningInsights.recentLearnings.map((learning, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{learning.insight}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          {isArabic ? 'الثقة:' : 'Confidence:'} {(learning.confidence * 100).toFixed(0)}%
                        </span>
                        <span>
                          {isArabic ? 'التأثير:' : 'Impact:'} {learning.impact}
                        </span>
                        <span>
                          {isArabic ? 'التاريخ:' : 'Date:'} {learning.implementedDate}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={learning.impact === 'High' ? 'default' : 'secondary'}
                      className={learning.impact === 'High' ? 'bg-brand-success' : ''}
                    >
                      {learning.impact}
                    </Badge>
                  </div>
                  <Progress value={learning.confidence * 100} className="w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-brand-primary" />
                <span>{isArabic ? 'القدرات التنبؤية' : 'Predictive Capabilities'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-primary">
                    {(learningInsights.predictiveCapabilities.accuracyScore * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'نقاط الدقة' : 'Accuracy Score'}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-success">
                    {learningInsights.predictiveCapabilities.predictionHorizon}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'أفق التنبؤ' : 'Prediction Horizon'}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-accent">
                    {learningInsights.predictiveCapabilities.confidenceLevel}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'مستوى الثقة' : 'Confidence Level'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'المقاييس السلوكية' : 'Behavioral Metrics'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'نقاط التفاعل' : 'Engagement Score'}</span>
                    <span className="font-semibold">{patternAnalysis.behavioralMetrics.engagementScore}</span>
                  </div>
                  <Progress value={patternAnalysis.behavioralMetrics.engagementScore} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'مؤشر الكفاءة' : 'Efficiency Index'}</span>
                    <span className="font-semibold">{patternAnalysis.behavioralMetrics.efficiencyIndex}</span>
                  </div>
                  <Progress value={patternAnalysis.behavioralMetrics.efficiencyIndex} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'مستوى الرضا' : 'Satisfaction Level'}</span>
                    <span className="font-semibold">{patternAnalysis.behavioralMetrics.satisfactionLevel}</span>
                  </div>
                  <Progress value={patternAnalysis.behavioralMetrics.satisfactionLevel} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'معدل التبني' : 'Adoption Rate'}</span>
                    <span className="font-semibold">{patternAnalysis.behavioralMetrics.adoptionRate}</span>
                  </div>
                  <Progress value={patternAnalysis.behavioralMetrics.adoptionRate} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'التنبؤات' : 'Predictions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {isArabic ? 'الإجراءات التالية' : 'Next Actions'}
                  </h4>
                  {patternAnalysis.predictions.nextActions.map((action: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                      <CheckCircle className="w-4 h-4 text-brand-success" />
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isArabic ? 'وقت الإكمال' : 'Time to Completion'}
                    </span>
                    <span className="font-medium">{patternAnalysis.predictions.timeToCompletion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isArabic ? 'احتمالية النجاح' : 'Success Probability'}
                    </span>
                    <span className="font-medium">{(patternAnalysis.predictions.successProbability * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-brand-primary" />
                <span>{isArabic ? 'التحسينات النشطة' : 'Active Optimizations'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 space-y-4">
                <div className="text-6xl font-bold text-brand-primary">
                  {activeOptimizations}
                </div>
                <div className="text-lg text-muted-foreground">
                  {isArabic ? 'تحسينات نشطة في النظام' : 'Active system optimizations'}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-brand-success">95%</div>
                    <div className="text-xs text-muted-foreground">
                      {isArabic ? 'كفاءة' : 'Efficiency'}
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-brand-accent">12</div>
                    <div className="text-xs text-muted-foreground">
                      {isArabic ? 'تحسينات' : 'Improvements'}
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-brand-warning">24/7</div>
                    <div className="text-xs text-muted-foreground">
                      {isArabic ? 'مراقبة' : 'Monitoring'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-brand-success" />
                <span>{isArabic ? 'تطور النظام' : 'System Evolution'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-primary">
                    v{learningInsights.systemEvolution.version}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'إصدار النظام' : 'System Version'}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-success">
                    {learningInsights.systemEvolution.learningCycles}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'دورات التعلم' : 'Learning Cycles'}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-accent">
                    {learningInsights.systemEvolution.totalAdaptations}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'إجمالي التكيفات' : 'Total Adaptations'}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-warning">
                    {learningInsights.systemEvolution.activeOptimizations}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'التحسينات النشطة' : 'Active Optimizations'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};