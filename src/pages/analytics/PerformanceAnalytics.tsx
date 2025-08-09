import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Target, Users, BarChart3, Clock, Award, FileText, Download, Filter, RefreshCw } from "lucide-react";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import EnhancedModuleAIChat from '@/components/universal/EnhancedModuleAIChat';
import { AqlHRAIAssistant } from '@/components/ai';

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-center lg:text-left space-y-2">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {t.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            {language === 'ar' ? 'الفلاتر' : 'Filters'}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            {language === 'ar' ? 'تقرير جديد' : 'New Report'}
          </Button>
        </div>
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
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-primary">2,456</div>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    +12%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
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
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">4.2/5</div>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    +0.3
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
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
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-600">87%</div>
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                    +5%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
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
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-orange-600">234%</div>
                  <Badge variant="secondary" className="text-orange-600 bg-orange-50">
                    +18%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
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

          {/* Department Performance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {language === 'ar' ? 'أداء الأقسام التفصيلي' : 'Department Performance Breakdown'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Development Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم التطوير' : 'Development Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط الأداء:' : 'Avg Performance:'}</span>
                      <span className="font-bold text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>24</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل الموظفين:' : 'Top Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed'}</span>
                          <span className="text-yellow-600">4.9/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'سارة أحمد' : 'Sara Ahmed'}</span>
                          <span className="text-yellow-600">4.8/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'محمد علي' : 'Mohamed Ali'}</span>
                          <span className="text-yellow-600">4.7/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم المبيعات' : 'Sales Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط الأداء:' : 'Avg Performance:'}</span>
                      <span className="font-bold text-blue-600">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>18</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل الموظفين:' : 'Top Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'فاطمة علي' : 'Fatima Ali'}</span>
                          <span className="text-yellow-600">4.8/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'خالد سعد' : 'Khalid Saad'}</span>
                          <span className="text-yellow-600">4.6/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'نور محمد' : 'Nour Mohamed'}</span>
                          <span className="text-yellow-600">4.5/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم التسويق' : 'Marketing Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط الأداء:' : 'Avg Performance:'}</span>
                      <span className="font-bold text-orange-600">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>15</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل الموظفين:' : 'Top Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan'}</span>
                          <span className="text-yellow-600">4.7/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'ليلى أحمد' : 'Layla Ahmed'}</span>
                          <span className="text-yellow-600">4.4/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'يوسف محمود' : 'Youssef Mahmoud'}</span>
                          <span className="text-yellow-600">4.3/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HR Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم الموارد البشرية' : 'HR Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط الأداء:' : 'Avg Performance:'}</span>
                      <span className="font-bold text-purple-600">88%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>12</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل الموظفين:' : 'Top Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'مريم سالم' : 'Mariam Salem'}</span>
                          <span className="text-yellow-600">4.6/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'عبدالله خالد' : 'Abdullah Khalid'}</span>
                          <span className="text-yellow-600">4.5/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'هدى محمد' : 'Huda Mohamed'}</span>
                          <span className="text-yellow-600">4.4/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finance Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم المالية' : 'Finance Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط الأداء:' : 'Avg Performance:'}</span>
                      <span className="font-bold text-red-600">83%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>10</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل الموظفين:' : 'Top Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'علي حسين' : 'Ali Hussein'}</span>
                          <span className="text-yellow-600">4.5/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'رانيا أحمد' : 'Rania Ahmed'}</span>
                          <span className="text-yellow-600">4.3/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'محمد صالح' : 'Mohamed Saleh'}</span>
                          <span className="text-yellow-600">4.2/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم العمليات' : 'Operations Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط الأداء:' : 'Avg Performance:'}</span>
                      <span className="font-bold text-indigo-600">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>16</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل الموظفين:' : 'Top Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'سلمان عبدالله' : 'Salman Abdullah'}</span>
                          <span className="text-yellow-600">4.6/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'دانا محمد' : 'Dana Mohamed'}</span>
                          <span className="text-yellow-600">4.4/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'طارق سعد' : 'Tarek Saad'}</span>
                          <span className="text-yellow-600">4.3/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
      
      {/* Main AqlHR AI Assistant - Performance Analytics */}
      <AqlHRAIAssistant 
        moduleContext="analytics.performance"
        position="fixed"
      />
    </div>
  );
};

export default PerformanceAnalytics;