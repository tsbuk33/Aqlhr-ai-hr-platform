import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Brain, Target, TrendingUp, Users, Star, Award, Lightbulb, BarChart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";

const SmartRecommendations = () => {
  const { language } = useLanguage();
  
  // Embedded translations
  const translations = {
    ar: {
      smart_recommendations: "التوصيات الذكية",
      smart_recommendations_desc: "منصة ذكية مدعومة بالذكاء الاصطناعي لاكتشاف المواهب وتطويرها وإدارتها بفعالية",
      how_sanadhr_creates: "كيف يخلق سند للموارد البشرية التوصيات",
      advanced_ml_desc: "خوارزميات التعلم الآلي المتقدمة لديها تحليل شامل للبيانات وتوليد توصيات مخصصة",
      data_collection: "جمع البيانات",
      data_collection_desc: "تحليل البيانات الشاملة من مصادر متعددة",
      data_points: "نقطة بيانات",
      ai_matching: "المطابقة الذكية",
      ai_matching_desc: "خوارزميات الذكاء الاصطناعي تطابق المؤهلات مع الأدوار",
      neural_networks: "الشبكات العصبية",
      current_recommendations: "التوصيات الحالية",
      ai_analysis: "تحليل الذكاء الاصطناعي",
      decision_factors: "عوامل القرار",
      success_tracking: "تتبع النجاح"
    },
    en: {
      smart_recommendations: "Smart Recommendations",
      smart_recommendations_desc: "AI-powered intelligent platform for effective talent discovery, development and management",
      how_sanadhr_creates: "How SanadHR Creates Recommendations",
      advanced_ml_desc: "Advanced machine learning algorithms provide comprehensive data analysis and generate personalized recommendations",
      data_collection: "Data Collection",
      data_collection_desc: "Comprehensive data analysis from multiple sources",
      data_points: "data points",
      ai_matching: "AI Matching",
      ai_matching_desc: "AI algorithms match qualifications with roles",
      neural_networks: "Neural Networks",
      current_recommendations: "Current Recommendations",
      ai_analysis: "AI Analysis",
      decision_factors: "Decision Factors",
      success_tracking: "Success Tracking"
    }
  };

  const t = (key: string) => translations[language as keyof typeof translations]?.[key as keyof typeof translations.ar] || key;
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('smart_recommendations')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('smart_recommendations_desc')}
        </p>
      </div>

      {/* AI Process Explanation */}
      <Card className="p-8">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Brain className="h-6 w-6 text-brand-primary" />
            {t('how_sanadhr_creates')}
          </CardTitle>
          <CardDescription>{t('advanced_ml_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <BarChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('data_collection')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('data_collection_desc')}
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                50+ {t('data_points')}
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('ai_matching')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai_matching_desc')}
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {t('neural_networks')}
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{language === 'ar' ? 'الترتيب الذكي' : 'Smart Ranking'}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'يتم ترتيب التوصيات حسب احتمالية النجاح والمواءمة الاستراتيجية' : 'Recommendations are ranked by success probability and strategic alignment'}
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {language === 'ar' ? 'دقة 87.6%' : '87.6% Accuracy'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{language === 'ar' ? 'إجمالي التوصيات' : 'Total Recommendations'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">342</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">{language === 'ar' ? '+47 هذا الشهر' : '+47 this month'}</span>
              </div>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'عبر 12 قسماً' : 'Across 12 departments'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{language === 'ar' ? 'دقة التنبؤ' : 'Prediction Accuracy'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-brand-success">87.6%</div>
              <Progress value={87.6} className="h-2" />
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'بناءً على النتائج التاريخية' : 'Based on historical outcomes'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{language === 'ar' ? 'الإجراءات المنفذة' : 'Implemented Actions'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-accent">289</div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-brand-accent" />
                <span className="text-muted-foreground">{language === 'ar' ? 'معدل قبول 84%' : '84% acceptance rate'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-hero opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{language === 'ar' ? 'معدل النجاح' : 'Success Rate'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-warning">94.1%</div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-brand-warning" />
                <span className="text-muted-foreground">{language === 'ar' ? 'الأداء بعد التنفيذ' : 'Post-implementation performance'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">{t('current_recommendations')}</TabsTrigger>
          <TabsTrigger value="analysis">{t('ai_analysis')}</TabsTrigger>
          <TabsTrigger value="factors">{t('decision_factors')}</TabsTrigger>
          <TabsTrigger value="outcomes">{t('success_tracking')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'توصيات المواهب النشطة' : 'Active Talent Recommendations'}</CardTitle>
              <CardDescription>{language === 'ar' ? 'اقتراحات مولدة بالذكاء الاصطناعي بناءً على التحليل في الوقت الفعلي' : 'AI-generated suggestions based on real-time analysis'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    employee: "Sarah Al-Rashid", 
                    current: "Senior Analyst", 
                    recommended: "Team Lead - Data Analytics", 
                    score: 94, 
                    reason: "Strong leadership potential, exceptional technical skills",
                    department: "Analytics"
                  },
                  { 
                    employee: "Ahmed Hassan", 
                    current: "HR Specialist", 
                    recommended: "HR Business Partner", 
                    score: 89, 
                    reason: "Deep business understanding, excellent stakeholder management",
                    department: "Human Resources"
                  },
                  { 
                    employee: "Nora Abdulla", 
                    current: "Finance Associate", 
                    recommended: "Transfer to Strategic Planning", 
                    score: 87, 
                    reason: "Analytical mindset, strategic thinking, cross-functional experience",
                    department: "Finance → Strategy"
                  }
                ].map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{rec.employee}</h4>
                        <p className="text-sm text-muted-foreground">{rec.current} → {rec.recommended}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand-success">{rec.score}%</div>
                        <p className="text-xs text-muted-foreground">{language === 'ar' ? 'نقاط المطابقة' : 'Match Score'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground italic">"{rec.reason}"</p>
                      <Badge variant="outline">{rec.department}</Badge>
                    </div>
                    <Progress value={rec.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إطار تحليل الذكاء الاصطناعي' : 'AI Analysis Framework'}</CardTitle>
              <CardDescription>{language === 'ar' ? 'كيف تقيم نماذج التعلم الآلي إمكانات المواهب' : 'How our machine learning models evaluate talent potential'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg mb-4">{language === 'ar' ? 'تحليل مقاييس الأداء' : 'Performance Metrics Analysis'}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'الأداء التاريخي' : 'Historical Performance'}</span>
                      <span className="text-sm font-medium">{language === 'ar' ? 'وزن 25%' : '25% weight'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'تقييمات المهارات' : 'Skill Assessments'}</span>
                      <span className="text-sm font-medium">{language === 'ar' ? 'وزن 20%' : '20% weight'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'مسار النمو' : 'Growth Trajectory'}</span>
                      <span className="text-sm font-medium">{language === 'ar' ? 'وزن 15%' : '15% weight'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'تعليقات الزملاء' : 'Peer Feedback'}</span>
                      <span className="text-sm font-medium">{language === 'ar' ? 'وزن 15%' : '15% weight'}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-lg mb-4">{language === 'ar' ? 'التحليل السلوكي' : 'Behavioral Analysis'}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'مؤشرات القيادة' : 'Leadership Indicators'}</span>
                      <span className="text-sm font-medium">{language === 'ar' ? 'وزن 10%' : '10% weight'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'نقاط التكيف' : 'Adaptability Score'}</span>
                      <span className="text-sm font-medium">{language === 'ar' ? 'وزن 8%' : '8% weight'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'الملاءمة الثقافية' : 'Cultural Fit'}</span>
                      <span className="text-sm font-medium">{language === 'ar' ? 'وزن 4%' : '4% weight'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'التطلعات المهنية' : 'Career Aspirations'}</span>
                      <span className="text-sm font-medium">{language === 'ar' ? 'وزن 3%' : '3% weight'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'عوامل القرار الرئيسية' : 'Key Decision Factors'}</CardTitle>
              <CardDescription>{language === 'ar' ? 'العناصر الحيوية التي تؤثر على دقة التوصيات' : 'Critical elements that influence recommendation accuracy'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {language === 'ar' ? 'مطابقة متطلبات الوظيفة' : 'Role Requirements Matching'}
                  </h4>
                  <p className="text-sm text-blue-700">{language === 'ar' ? 'يقارن الذكاء الاصطناعي مهارات المرشحين مع متطلبات الوظيفة التفصيلية وملفات النجاح' : 'AI compares candidate skills against detailed job requirements and success profiles'}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {language === 'ar' ? 'تحليل مسار الأداء' : 'Performance Trajectory Analysis'}
                  </h4>
                  <p className="text-sm text-green-700">{language === 'ar' ? 'اتجاهات الأداء التاريخية تتنبأ باحتمالية النجاح المستقبلي في الأدوار الجديدة' : 'Historical performance trends predict future success probability in new roles'}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {language === 'ar' ? 'ديناميكيات الفريق والملاءمة الثقافية' : 'Team Dynamics & Cultural Fit'}
                  </h4>
                  <p className="text-sm text-purple-700">{language === 'ar' ? 'تحليل الشبكة الاجتماعية يضمن أن التوصيات تأخذ في الاعتبار كيمياء الفريق والثقافة' : 'Social network analysis ensures recommendations consider team chemistry and culture'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'تتبع النجاح والنتائج' : 'Success Tracking & Outcomes'}</CardTitle>
              <CardDescription>{language === 'ar' ? 'كيف نقيس ونحسن فعالية التوصيات' : 'How we measure and improve recommendation effectiveness'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-success">94.1%</div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'معدل النجاح لـ 6 أشهر' : '6-month success rate'}</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-primary">23%</div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'تحسن الأداء' : 'Performance improvement'}</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-accent">156</div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'التوظيف الناجح' : 'Successful placements'}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">{language === 'ar' ? 'قصص النجاح الأخيرة' : 'Recent Success Stories'}</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border-l-4 border-green-400">
                    <p className="text-sm text-green-800">{language === 'ar' ? 'حقق المحلل المرقى أداءً أفضل بنسبة 34% في الدور الجديد خلال 3 أشهر' : 'Promoted analyst achieved 34% better performance in new role within 3 months'}</p>
                  </div>
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">{language === 'ar' ? 'أدى النقل بين الأقسام إلى زيادة الإنتاجية بنسبة 28% للفريق المستقبل' : 'Cross-department transfer resulted in 28% productivity increase for receiving team'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'إدارة التوصيات' : 'Recommendation Management'}</CardTitle>
          <CardDescription>{language === 'ar' ? 'مراجعة والعمل على توصيات المواهب المولدة بالذكاء الاصطناعي' : 'Review and act on AI-generated talent recommendations'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Lightbulb className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'مراجعة التوصيات الجديدة' : 'Review New Recommendations'}
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تحديد معايير التوصية' : 'Set Recommendation Criteria'}
            </Button>
            <Button variant="outline">
              <BarChart className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'عرض تحليلات النجاح' : 'View Success Analytics'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartRecommendations;