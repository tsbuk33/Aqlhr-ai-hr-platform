import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Target, Users, BarChart3, Clock, Award } from "lucide-react";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import EnhancedModuleAIChat from '@/components/universal/EnhancedModuleAIChat';

const PerformanceAnalytics = () => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();

  // Arabic translations for this page
  const translations = {
    ar: {
      title: "تحليلات الأداء",
      description: "رؤى شاملة حول أداء الأفراد والفرق مع مؤشرات الأداء الرئيسية",
      evaluations_completed: "التقييمات المكتملة",
      average_rating: "متوسط التقييم",
      goal_achievement: "تحقيق الأهداف",
      performance_roi: "عائد الاستثمار في الأداء",
      overview: "نظرة عامة",
      analytics: "التحليلات",
      reports: "التقارير",
      insights: "الإحصائيات",
      performance_metrics: "مؤشرات الأداء",
      team_performance: "أداء الفريق",
      individual_performance: "الأداء الفردي",
      top_performers: "أفضل الموظفين",
      improvement_areas: "مجالات التحسين",
      productivity_index: "مؤشر الإنتاجية",
      engagement_score: "درجة المشاركة"
    },
    en: {
      title: "Performance Analytics",
      description: "Comprehensive insights on individual and team performance with key metrics",
      evaluations_completed: "Evaluations Completed",
      average_rating: "Average Rating",
      goal_achievement: "Goal Achievement",
      performance_roi: "Performance ROI",
      overview: "Overview",
      analytics: "Analytics", 
      reports: "Reports",
      insights: "Insights",
      performance_metrics: "Performance Metrics",
      team_performance: "Team Performance",
      individual_performance: "Individual Performance",
      top_performers: "Top Performers",
      improvement_areas: "Improvement Areas",
      productivity_index: "Productivity Index",
      engagement_score: "Engagement Score"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const contextData = {
    moduleName: t.title,
    currentData: {
      evaluationsCompleted: 2456,
      averageRating: 4.2,
      goalAchievement: 87,
      performanceROI: 234
    },
    uploadedDocs: [],
    translations: {
      aiChat: {
        title: language === 'ar' ? 'مساعد الذكي لتحليلات الأداء' : 'Performance Analytics AI Assistant',
        welcomeMessage: language === 'ar' ? 'مرحباً! أنا هنا لمساعدتك في تحليل أداء الموظفين وتقديم الإحصائيات والتوصيات.' : 'Hello! I\'m here to help you analyze employee performance and provide insights and recommendations.',
        placeholder: language === 'ar' ? 'اسأل عن تحليلات الأداء...' : 'Ask about performance analytics...'
      }
    }
  };

  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t.description}
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t.overview}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t.analytics}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t.reports}
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            {t.insights}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.evaluations_completed}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">2,456</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? '+12% من الشهر الماضي' : '+12% from last month'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.average_rating}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">4.2/5</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? '+0.3 من الشهر الماضي' : '+0.3 from last month'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.goal_achievement}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">87%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? '+5% من الشهر الماضي' : '+5% from last month'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.performance_roi}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">234%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? '+18% من الشهر الماضي' : '+18% from last month'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t.team_performance}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'فريق التطوير' : 'Development Team'}</span>
                    <span className="font-bold text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'فريق المبيعات' : 'Sales Team'}</span>
                    <span className="font-bold text-blue-600">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'فريق التسويق' : 'Marketing Team'}</span>
                    <span className="font-bold text-orange-600">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t.top_performers}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed'}</span>
                    <span className="font-bold text-yellow-600">4.9/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'فاطمة علي' : 'Fatima Ali'}</span>
                    <span className="font-bold text-yellow-600">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan'}</span>
                    <span className="font-bold text-yellow-600">4.7/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.productivity_index}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">94.5</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'ممتاز - فوق المتوسط' : 'Excellent - Above Average'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.engagement_score}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">8.7/10</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'مرتفع - موظفون متفاعلون' : 'High - Engaged Workforce'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.improvement_areas}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'مجالات تحتاج تطوير' : 'Areas Need Development'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'التقارير المتاحة' : 'Available Reports'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-semibold">
                    {language === 'ar' ? 'تقرير الأداء الشهري' : 'Monthly Performance Report'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تحليل شامل لأداء الموظفين خلال الشهر' : 'Comprehensive analysis of employee performance for the month'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-semibold">
                    {language === 'ar' ? 'تقرير تحقيق الأهداف' : 'Goal Achievement Report'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تتبع تقدم الموظفين نحو أهدافهم' : 'Track employee progress towards their goals'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'نصائح وتوصيات' : 'Insights & Recommendations'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800">
                    {language === 'ar' ? 'أداء ممتاز' : 'Excellent Performance'}
                  </h4>
                  <p className="text-sm text-green-700">
                    {language === 'ar' 
                      ? 'فريق التطوير يحقق نتائج استثنائية. يُنصح بمشاركة أفضل الممارسات مع الفرق الأخرى.'
                      : 'Development team is achieving exceptional results. Consider sharing best practices with other teams.'
                    }
                  </p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800">
                    {language === 'ar' ? 'تحسين مطلوب' : 'Improvement Needed'}
                  </h4>
                  <p className="text-sm text-orange-700">
                    {language === 'ar'
                      ? 'بعض الموظفين يحتاجون دعم إضافي في التدريب والتطوير.'
                      : 'Some employees need additional support in training and development.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ModuleDocumentUploader moduleKey="analytics.performance" />
      <EnhancedModuleAIChat 
        moduleKey="analytics.performance"
        context={contextData}
      />
    </div>
  );
};

export default PerformanceAnalytics;