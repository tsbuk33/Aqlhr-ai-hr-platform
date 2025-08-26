import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Target, Users, Award, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";

interface PerformanceMetric {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  overallScore: number;
  kpiProgress: number;
  goalsCompleted: number;
  totalGoals: number;
  riskLevel: 'low' | 'medium' | 'high';
  aiRecommendations: string[];
  nextReviewDate: string;
  improvementAreas: string[];
}

interface PerformanceInsight {
  id: string;
  type: 'trend' | 'alert' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
}

export const AutonomousPerformanceManager: React.FC = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [insights, setInsights] = useState<PerformanceInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const translations = {
    ar: {
      title: "مدير الأداء المستقل",
      subtitle: "نظام ذكي لإدارة ومراقبة الأداء تلقائياً",
      overview: "نظرة عامة",
      insights: "الرؤى الذكية",
      automation: "الأتمتة",
      totalEmployees: "إجمالي الموظفين",
      highPerformers: "الأداء المتميز",
      atRiskEmployees: "الموظفون المعرضون للخطر",
      avgPerformance: "متوسط الأداء",
      aiInsights: "الرؤى الذكية",
      riskPrediction: "التنبؤ بالمخاطر",
      talentOptimization: "تحسين المواهب",
      generateReviews: "إنشاء مراجعات تلقائية",
      optimizeGoals: "تحسين الأهداف",
      predictTurnover: "التنبؤ بالاستقالات",
      department: "القسم",
      overallScore: "النتيجة الإجمالية",
      kpiProgress: "تقدم المؤشرات",
      goalsCompleted: "الأهداف المكتملة",
      riskLevel: "مستوى المخاطر",
      nextReview: "المراجعة التالية",
      recommendations: "التوصيات",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      viewDetails: "عرض التفاصيل",
      processAll: "معالجة الكل"
    },
    en: {
      title: "Autonomous Performance Manager",
      subtitle: "AI-powered system for automated performance management and monitoring",
      overview: "Overview",
      insights: "Smart Insights", 
      automation: "Automation",
      totalEmployees: "Total Employees",
      highPerformers: "High Performers",
      atRiskEmployees: "At-Risk Employees",
      avgPerformance: "Avg Performance",
      aiInsights: "AI Insights",
      riskPrediction: "Risk Prediction",
      talentOptimization: "Talent Optimization",
      generateReviews: "Generate Auto Reviews",
      optimizeGoals: "Optimize Goals",
      predictTurnover: "Predict Turnover",
      department: "Department",
      overallScore: "Overall Score",
      kpiProgress: "KPI Progress",
      goalsCompleted: "Goals Completed",
      riskLevel: "Risk Level",
      nextReview: "Next Review",
      recommendations: "Recommendations",
      low: "Low",
      medium: "Medium", 
      high: "High",
      viewDetails: "View Details",
      processAll: "Process All"
    }
  };

  const t = isRTL ? translations.ar : translations.en;

  useEffect(() => {
    generatePerformanceData();
    generateInsights();
  }, []);

  const generatePerformanceData = () => {
    const mockMetrics: PerformanceMetric[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'أحمد محمد',
        department: 'التطوير',
        overallScore: 92,
        kpiProgress: 88,
        goalsCompleted: 8,
        totalGoals: 10,
        riskLevel: 'low',
        aiRecommendations: ['زيادة المسؤوليات القيادية', 'تطوير مهارات جديدة'],
        nextReviewDate: '2024-03-15',
        improvementAreas: ['التواصل', 'إدارة الوقت']
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'فاطمة علي',
        department: 'التسويق',
        overallScore: 78,
        kpiProgress: 65,
        goalsCompleted: 5,
        totalGoals: 8,
        riskLevel: 'medium',
        aiRecommendations: ['توفير تدريب إضافي', 'مراجعة الأهداف'],
        nextReviewDate: '2024-03-20',
        improvementAreas: ['التحليل', 'العرض']
      },
      {
        id: '3',
        employeeId: 'EMP003',
        employeeName: 'سارة خالد',
        department: 'الموارد البشرية',
        overallScore: 45,
        kpiProgress: 35,
        goalsCompleted: 2,
        totalGoals: 7,
        riskLevel: 'high',
        aiRecommendations: ['خطة تحسين فورية', 'إشراف مكثف'],
        nextReviewDate: '2024-03-10',
        improvementAreas: ['الأداء العام', 'الالتزام']
      }
    ];
    setMetrics(mockMetrics);
  };

  const generateInsights = () => {
    const mockInsights: PerformanceInsight[] = [
      {
        id: '1',
        type: 'alert',
        title: 'مخاطر استقالة محتملة',
        description: '3 موظفين يظهرون علامات إنخفاض في الأداء والرضا الوظيفي',
        impact: 'high',
        actionRequired: true
      },
      {
        id: '2', 
        type: 'opportunity',
        title: 'فرصة للترقية',
        description: '5 موظفين جاهزون للترقية بناءً على أدائهم المتميز',
        impact: 'medium',
        actionRequired: false
      },
      {
        id: '3',
        type: 'trend',
        title: 'تحسن في الأداء العام',
        description: 'زيادة 15% في متوسط الأداء خلال الربع الماضي',
        impact: 'high',
        actionRequired: false
      }
    ];
    setInsights(mockInsights);
  };

  const handleAutomatedAction = async (action: string) => {
    setLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "تم تنفيذ العملية",
        description: `تم تنفيذ ${action} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تنفيذ العملية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-success" />;
      case 'trend': return <BarChart3 className="w-5 h-5 text-primary" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t.totalEmployees}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">847</div>
            <div className="text-xs text-muted-foreground">+12 من الشهر الماضي</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              {t.highPerformers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">234</div>
            <div className="text-xs text-muted-foreground">27.6% من الإجمالي</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t.atRiskEmployees}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">43</div>
            <div className="text-xs text-muted-foreground">5.1% من الإجمالي</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              {t.avgPerformance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">82.4%</div>
            <div className="text-xs text-muted-foreground">+5.2% من الربع الماضي</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="insights">{t.insights}</TabsTrigger>
          <TabsTrigger value="automation">{t.automation}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{metric.employeeName}</CardTitle>
                      <CardDescription>{metric.department}</CardDescription>
                    </div>
                    <Badge variant={metric.riskLevel === 'high' ? 'destructive' : metric.riskLevel === 'medium' ? 'secondary' : 'default'}>
                      {t[metric.riskLevel as keyof typeof t]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t.overallScore}</div>
                      <div className="text-2xl font-bold">{metric.overallScore}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t.kpiProgress}</div>
                      <Progress value={metric.kpiProgress} className="mb-1" />
                      <div className="text-sm">{metric.kpiProgress}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t.goalsCompleted}</div>
                      <div className="text-lg font-semibold">{metric.goalsCompleted}/{metric.totalGoals}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">{t.recommendations}:</div>
                    <div className="flex flex-wrap gap-2">
                      {metric.aiRecommendations.map((rec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground">
                      {t.nextReview}: {metric.nextReviewDate}
                    </div>
                    <Button variant="outline" size="sm">
                      {t.viewDetails}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'secondary' : 'default'}>
                          {insight.impact}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{insight.description}</p>
                      {insight.actionRequired && (
                        <Button size="sm" className="mt-3">
                          اتخاذ إجراء
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t.generateReviews}
                </CardTitle>
                <CardDescription>
                  إنشاء تقييمات الأداء تلقائياً بناءً على البيانات والمؤشرات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleAutomatedAction('إنشاء التقييمات')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Clock className="w-4 h-4 animate-spin mr-2" /> : null}
                  إنشاء تقييمات لجميع الموظفين
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {t.optimizeGoals}
                </CardTitle>
                <CardDescription>
                  تحسين الأهداف الفردية بناءً على الأداء والقدرات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleAutomatedAction('تحسين الأهداف')}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? <Clock className="w-4 h-4 animate-spin mr-2" /> : null}
                  تحسين أهداف الفريق
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t.predictTurnover}
                </CardTitle>
                <CardDescription>
                  التنبؤ بالاستقالات المحتملة واتخاذ إجراءات وقائية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleAutomatedAction('التنبؤ بالاستقالات')}
                  disabled={loading}
                  variant="secondary"
                  className="w-full"
                >
                  {loading ? <Clock className="w-4 h-4 animate-spin mr-2" /> : null}
                  تحليل مخاطر الاستقالة
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  معالجة شاملة
                </CardTitle>
                <CardDescription>
                  تنفيذ جميع عمليات الذكاء الاصطناعي للأداء
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleAutomatedAction('المعالجة الشاملة')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Clock className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t.processAll}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};