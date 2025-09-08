import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Target, TrendingUp, Award, Clock, Play, Users, Star, Zap, Filter, Heart, Link, Activity, CheckCircle, Globe, BarChart3, FileText, User, Briefcase, Calendar } from 'lucide-react';
import { useLeoGeoIntegration } from '@/hooks/useLeoGeoIntegration';
import SmartRecommendationEngine from '@/components/SmartRecommendationEngine';
import { AqlHRAIAssistant } from '@/components/ai';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  generateDummyTrainingModules,
  generateDummyLearningProgress,
  generateDummyEmployees,
  generateAnalyticsData
} from '@/utils/dummyData';

const LearningExperienceOptimization: React.FC = () => {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  
  // AI Enhancement States
  const [marketIntelligence, setMarketIntelligence] = useState(null);
  const [learningAnalytics, setLearningAnalytics] = useState(null);
  const [skillGapPredictions, setSkillGapPredictions] = useState(null);
  const [jobSpecificRecommendations, setJobSpecificRecommendations] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [isLoadingJobRecommendations, setIsLoadingJobRecommendations] = useState(false);
  
  // Load comprehensive dummy data
  const trainingModules = generateDummyTrainingModules();
  const learningProgress = generateDummyLearningProgress();
  const employees = generateDummyEmployees();
  const analytics = generateAnalyticsData();
  
  // LEO-GEO Integration
  const { 
    getEngagementInsightsForLeo, 
    getAggregatedInsights, 
    loading: integrationLoading 
  } = useLeoGeoIntegration();

  // Mock data for demonstration
  const learningStats = {
    completedModules: 24,
    skillsAcquired: 8,
    learningStreak: 12,
    totalHours: 45.5,
    engagementScore: 87
  };

  const activeModules = [
    {
      id: '1',
      title: 'تحليل البيانات المتقدم',
      duration: 12,
      progress: 75,
      type: 'تقني',
      nextLesson: 'أساسيات التعلم الآلي'
    },
    {
      id: '2', 
      title: 'القيادة في الثقافة السعودية',
      duration: 8,
      progress: 30,
      type: 'سلوكي',
      nextLesson: 'الذكاء الثقافي'
    },
    {
      id: '3',
      title: 'تطبيق رؤية 2030',
      duration: 10,
      progress: 90,
      type: 'استراتيجي',
      nextLesson: 'التحول الاقتصادي'
    }
  ];

  const recommendations = [
    {
      id: '1',
      title: 'الذكاء الاصطناعي في تحول الموارد البشرية',
      description: 'تعلم كيف يحدث الذكاء الاصطناعي ثورة في ممارسات الموارد البشرية في المملكة العربية السعودية',
      duration: 15,
      relevanceScore: 95,
      skillArea: 'تقنية الموارد البشرية',
      priority: 'عالي',
      type: 'فيديو'
    },
    {
      id: '2',
      title: 'التواصل عبر الثقافات',
      description: 'إتقان التواصل عبر خلفيات ثقافية متنوعة',
      duration: 20,
      relevanceScore: 88,
      skillArea: 'التواصل',
      priority: 'متوسط',
      type: 'تفاعلي'
    },
    {
      id: '3',
      title: 'إدارة المشاريع الرقمية',
      description: 'إدارة المشاريع المتقدمة للتحول الرقمي',
      duration: 25,
      relevanceScore: 82,
      skillArea: 'إدارة المشاريع',
      priority: 'متوسط',
      type: 'محاكاة'
    }
  ];

  const learningPaths = [
    {
      id: '1',
      title: 'قائد التحول الرقمي للموارد البشرية',
      description: 'مسار شامل لتصبح قائداً في تقنية الموارد البشرية',
      completedModules: 8,
      totalModules: 15,
      progressPercent: 53,
      icon: '🚀',
      estimatedTime: '3 أشهر'
    },
    {
      id: '2',
      title: 'سفير الثقافة السعودية',
      description: 'فهم عميق للثقافة التجارية والممارسات السعودية',
      completedModules: 5,
      totalModules: 10,
      progressPercent: 50,
      icon: '🕌',
      estimatedTime: 'شهرين'
    },
    {
      id: '3',
      title: 'عامل تغيير رؤية 2030',
      description: 'قيادة مبادرات رؤية 2030 في مؤسستك',
      completedModules: 3,
      totalModules: 12,
      progressPercent: 25,
      icon: '🎯',
      estimatedTime: '4 أشهر'
    }
  ];

  const skillsProgress = [
    // Technical Skills
    { skill: 'الذكاء الاصطناعي والتعلم الآلي', current: 75, target: 90, growth: '+15%', category: 'تقني' },
    { skill: 'تحليل البيانات', current: 79, target: 90, growth: '+6%', category: 'تقني' },
    { skill: 'أنظمة تقنية الموارد البشرية', current: 85, target: 95, growth: '+11%', category: 'تقني' },
    { skill: 'الوعي بالأمن السيبراني', current: 72, target: 85, growth: '+9%', category: 'تقني' },
    { skill: 'التحول الرقمي', current: 68, target: 88, growth: '+14%', category: 'تقني' },
    
    // Leadership & Management
    { skill: 'القيادة الرقمية', current: 68, target: 85, growth: '+12%', category: 'قيادة' },
    { skill: 'التخطيط الاستراتيجي', current: 71, target: 88, growth: '+10%', category: 'قيادة' },
    { skill: 'إدارة التغيير', current: 74, target: 85, growth: '+8%', category: 'قيادة' },
    { skill: 'بناء الفريق', current: 88, target: 95, growth: '+5%', category: 'قيادة' },
    { skill: 'تدريب الأداء', current: 82, target: 90, growth: '+7%', category: 'قيادة' },
    
    // Cultural & Communication
    { skill: 'الذكاء الثقافي', current: 82, target: 95, growth: '+8%', category: 'ثقافي' },
    { skill: 'مهارات اللغة العربية', current: 65, target: 85, growth: '+18%', category: 'ثقافي' },
    { skill: 'التواصل عبر الثقافات', current: 76, target: 90, growth: '+13%', category: 'ثقافي' },
    { skill: 'البروتوكول التجاري السعودي', current: 91, target: 95, growth: '+3%', category: 'ثقافي' },
    { skill: 'التاريخ والتراث السعودي', current: 73, target: 88, growth: '+15%', category: 'ثقافي' },
    { skill: 'تقاليد يوم التأسيس', current: 68, target: 85, growth: '+17%', category: 'ثقافي' },
    { skill: 'احتفالات اليوم الوطني', current: 80, target: 92, growth: '+12%', category: 'ثقافي' },
    { skill: 'التقاليد والعادات السعودية', current: 75, target: 90, growth: '+15%', category: 'ثقافي' },
    { skill: 'العلاقات الدولية', current: 58, target: 75, growth: '+22%', category: 'ثقافي' },
    
    // HR Specialization
    { skill: 'اكتساب المواهب', current: 84, target: 92, growth: '+6%', category: 'موارد بشرية' },
    { skill: 'علاقات الموظفين', current: 89, target: 95, growth: '+4%', category: 'موارد بشرية' },
    { skill: 'التعويضات والمزايا', current: 77, target: 88, growth: '+9%', category: 'موارد بشرية' },
    { skill: 'التعلم والتطوير', current: 86, target: 93, growth: '+5%', category: 'موارد بشرية' },
    { skill: 'تحليلات الموارد البشرية', current: 71, target: 85, growth: '+12%', category: 'موارد بشرية' },
    { skill: 'التصميم التنظيمي', current: 63, target: 80, growth: '+16%', category: 'موارد بشرية' },
    
    // Compliance & Legal
    { skill: 'قانون العمل السعودي', current: 92, target: 98, growth: '+4%', category: 'امتثال' },
    { skill: 'اللائحة العامة لحماية البيانات وخصوصية البيانات', current: 69, target: 85, growth: '+14%', category: 'امتثال' },
    { skill: 'عقود العمل', current: 87, target: 95, growth: '+6%', category: 'امتثال' },
    { skill: 'لوائح الصحة والسلامة', current: 81, target: 90, growth: '+8%', category: 'امتثال' },
    { skill: 'الأخلاق والحوكمة', current: 78, target: 88, growth: '+9%', category: 'امتثال' },
    
    // Business & Finance
    { skill: 'الثقافة المالية', current: 66, target: 80, growth: '+15%', category: 'أعمال' },
    { skill: 'إدارة الميزانية', current: 73, target: 85, growth: '+11%', category: 'أعمال' },
    { skill: 'تحسين العمليات التجارية', current: 70, target: 85, growth: '+13%', category: 'أعمال' },
    { skill: 'إدارة المشاريع', current: 79, target: 88, growth: '+8%', category: 'أعمال' },
    { skill: 'إدارة الموردين', current: 64, target: 78, growth: '+17%', category: 'أعمال' },
    
    // Vision 2030 & Innovation
    { skill: 'تطبيق رؤية 2030', current: 75, target: 92, growth: '+16%', category: 'ابتكار' },
    { skill: 'إدارة الابتكار', current: 61, target: 80, growth: '+21%', category: 'ابتكار' },
    { skill: 'ممارسات الاستدامة', current: 68, target: 85, growth: '+18%', category: 'ابتكار' },
    { skill: 'الابتكار الرقمي', current: 72, target: 88, growth: '+14%', category: 'ابتكار' },
    { skill: 'ريادة الأعمال', current: 55, target: 75, growth: '+25%', category: 'ابتكار' }
  ];

  const microLearningModules = [
    {
      id: '1',
      title: 'فهم الشبكات العصبية',
      type: 'فيديو',
      duration: 5,
      difficulty: 'متوسط',
      completionRate: 89,
      rating: 4.7
    },
    {
      id: '2',
      title: 'آداب الأعمال السعودية',
      type: 'تفاعلي',
      duration: 8,
      difficulty: 'مبتدئ',
      completionRate: 94,
      rating: 4.9
    },
    {
      id: '3',
      title: 'الأهداف الاقتصادية لرؤية 2030',
      type: 'اختبار',
      duration: 10,
      difficulty: 'متقدم',
      completionRate: 76,
      rating: 4.5
    }
  ];

  const categories = ['الكل', 'تقني', 'قيادة', 'ثقافي', 'موارد بشرية', 'امتثال', 'أعمال', 'ابتكار'];
  
  const filteredSkills = selectedCategory === 'الكل' 
    ? skillsProgress 
    : skillsProgress.filter(skill => skill.category === selectedCategory);

  // AI Enhancement Functions
  const fetchMarketIntelligence = async () => {
    setIsLoadingIntelligence(true);
    try {
      const { data, error } = await supabase.functions.invoke('external-intelligence', {
        body: {
          moduleContext: 'learning',
          query: 'أحدث اتجاهات التعلم والتطوير، ومتطلبات المهارات، وتقنيات التدريب في قطاعات الموارد البشرية والتكنولوجيا في المملكة العربية السعودية',
          dataType: 'market_data',
          country: 'Saudi Arabia',
          industry: 'Learning & Development'
        }
      });

      if (error) throw error;

      setMarketIntelligence(data.externalInsight);
      toast({
        title: "تم تحديث ذكاء التعلم",
        description: "تم استرجاع أحدث بيانات سوق التعلم والتطوير السعودي بنجاح"
      });
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب ذكاء السوق للتعلم",
        variant: "destructive"
      });
    } finally {
      setIsLoadingIntelligence(false);
    }
  };

  const fetchLearningAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-workforce-analytics', {
        body: {
          company_id: 'demo-company',
          analysis_type: 'learning_comprehensive'
        }
      });

      if (error) throw error;

      setLearningAnalytics(data);
      toast({
        title: "تم إنشاء تحليلات التعلم",
        description: "رؤى التعلم المدعومة بالذكاء الاصطناعي جاهزة"
      });
    } catch (error) {
      console.error('Error fetching learning analytics:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء تحليلات التعلم",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const fetchSkillGapPredictions = async () => {
    setIsLoadingPredictions(true);
    try {
      const { data, error } = await supabase.functions.invoke('skill-gap-predictor', {
        body: {
          companyId: 'demo-company',
          analysisType: 'learning_pathway_optimization',
          skillCategories: categories.filter(cat => cat !== 'الكل')
        }
      });

      if (error) throw error;

      setSkillGapPredictions(data);
      toast({
        title: "توقعات فجوة المهارات جاهزة",
        description: "توقعات الذكاء الاصطناعي لتحسين مسار التعلم"
      });
    } catch (error) {
      console.error('Error fetching skill gap predictions:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء توقعات فجوة المهارات",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  const fetchJobSpecificRecommendations = async () => {
    setIsLoadingJobRecommendations(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-specific-learning-ai', {
        body: {
          employeeId: 'demo-employee-id',
          companyId: 'demo-company-id',
          language: 'ar'
        }
      });

      if (error) throw error;

      setJobSpecificRecommendations(data.recommendations);
      setEmployeeProfile(data.employeeProfile);
      toast({
        title: "التوصيات الخاصة بالوظيفة جاهزة",
        description: "تم إنشاء مسار تعلم شخصي بناءً على دورك"
      });
    } catch (error) {
      console.error('Error fetching job-specific recommendations:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء التوصيات الخاصة بالوظيفة",
        variant: "destructive"
      });
    } finally {
      setIsLoadingJobRecommendations(false);
    }
  };

  useEffect(() => {
    fetchMarketIntelligence();
    fetchLearningAnalytics();
    fetchSkillGapPredictions();
    fetchJobSpecificRecommendations();
  }, []);

  // Get integrated insights
  const engagementInsights = getEngagementInsightsForLeo();
  const aggregatedInsights = getAggregatedInsights();

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ليو - تحسين تجربة التعلم
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          التعلم المصغر المدعوم بالذكاء الاصطناعي، والمسارات التكيفية وتطوير المهارات الشخصية
        </p>
      </div>

      {/* Learning Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.engagementScore}%</div>
            <div className="text-sm text-muted-foreground">نقاط المشاركة</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.totalHours}</div>
            <div className="text-sm text-muted-foreground">ساعات التعلم</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.learningStreak}</div>
            <div className="text-sm text-muted-foreground">سلسلة الأيام</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.skillsAcquired}</div>
            <div className="text-sm text-muted-foreground">المهارات المكتسبة</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.completedModules}</div>
            <div className="text-sm text-muted-foreground">الوحدات المكتملة</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Demo Data Active */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">بيانات العرض التوضيحي المباشر نشطة</h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                عرض 5 وحدات تدريبية، 5 سجلات تعلم، و6 ملفات شخصية للموظفين مع تتبع التقدم في الوقت الفعلي
              </p>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              تم تحميل البيانات
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            لوحة التحكم
          </TabsTrigger>
          <TabsTrigger value="my-learning" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            تعلمي
          </TabsTrigger>
          <TabsTrigger value="skills-progress" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            تقدم المهارات
          </TabsTrigger>
          <TabsTrigger value="learning-paths" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            مسارات التعلم
          </TabsTrigger>
          <TabsTrigger value="smart-ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            الذكاء الذكي
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            التحليلات
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Training Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  وحدات التدريب النشطة (إجمالي 5)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeModules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{module.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          الدرس التالي: {module.nextLesson}
                        </p>
                      </div>
                      <Badge variant="outline">{module.type}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>التقدم</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {module.duration} ساعة
                      </span>
                      <Button size="sm">متابعة التعلم</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Smart Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  التوصيات الذكية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rec.description}
                        </p>
                      </div>
                      <Badge 
                        variant={rec.priority === 'عالي' ? 'destructive' : 'secondary'}
                        className="ml-2"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{rec.duration} دقيقة</span>
                        <span>نقاط الصلة: {rec.relevanceScore}%</span>
                        <Badge variant="outline">{rec.type}</Badge>
                      </div>
                      <Button size="sm" variant="outline">ابدأ الآن</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Learning Tab */}
        <TabsContent value="my-learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                وحدات التعلم المصغر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {microLearningModules.map((module) => (
                  <Card key={module.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{module.title}</h4>
                          <Badge variant="outline">{module.type}</Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{module.duration} دقائق</span>
                          <span>{module.difficulty}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{module.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            معدل الإكمال: {module.completionRate}%
                          </span>
                        </div>
                        <Button className="w-full" size="sm">
                          ابدأ الوحدة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Progress Tab */}
        <TabsContent value="skills-progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                تقدم المهارات
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSkills.map((skill, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{skill.skill}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{skill.category}</Badge>
                        <span className="text-sm text-green-600 font-medium">
                          {skill.growth}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>الحالي: {skill.current}%</span>
                        <span>الهدف: {skill.target}%</span>
                      </div>
                      <Progress value={skill.current} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="learning-paths" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                مسارات التعلم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learningPaths.map((path) => (
                  <Card key={path.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl mb-2">{path.icon}</div>
                          <h3 className="font-semibold">{path.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {path.description}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>التقدم</span>
                            <span>{path.progressPercent}%</span>
                          </div>
                          <Progress value={path.progressPercent} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{path.completedModules}/{path.totalModules} وحدات</span>
                            <span>{path.estimatedTime}</span>
                          </div>
                        </div>
                        <Button className="w-full">
                          متابعة المسار
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart AI Tab */}
        <TabsContent value="smart-ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  ذكاء السوق
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={fetchMarketIntelligence}
                    disabled={isLoadingIntelligence}
                    className="w-full"
                  >
                    {isLoadingIntelligence ? 'جاري التحميل...' : 'تحديث ذكاء السوق'}
                  </Button>
                  {marketIntelligence && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">{marketIntelligence}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  تحليلات التعلم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={fetchLearningAnalytics}
                    disabled={isLoadingAnalytics}
                    className="w-full"
                  >
                    {isLoadingAnalytics ? 'جاري التحليل...' : 'إنشاء تحليلات التعلم'}
                  </Button>
                  {learningAnalytics && (
                    <div className="p-4 bg-muted rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(learningAnalytics, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skill Gap Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  توقعات فجوة المهارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={fetchSkillGapPredictions}
                    disabled={isLoadingPredictions}
                    className="w-full"
                  >
                    {isLoadingPredictions ? 'جاري التنبؤ...' : 'إنشاء توقعات المهارات'}
                  </Button>
                  {skillGapPredictions && (
                    <div className="p-4 bg-muted rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(skillGapPredictions, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Job-Specific Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  التوصيات الخاصة بالوظيفة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={fetchJobSpecificRecommendations}
                    disabled={isLoadingJobRecommendations}
                    className="w-full"
                  >
                    {isLoadingJobRecommendations ? 'جاري الإنشاء...' : 'إنشاء توصيات الوظيفة'}
                  </Button>
                  {jobSpecificRecommendations && (
                    <div className="space-y-3">
                      {employeeProfile && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-800">الملف الشخصي للموظف</h4>
                          <p className="text-sm text-blue-600">{employeeProfile.role}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {jobSpecificRecommendations.map((rec: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <h5 className="font-medium">{rec.title}</h5>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">87%</div>
                <div className="text-sm text-muted-foreground">معدل إكمال الدورات</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">156</div>
                <div className="text-sm text-muted-foreground">إجمالي المتعلمين</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">4.8</div>
                <div className="text-sm text-muted-foreground">متوسط تقييم الدورات</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">2,340</div>
                <div className="text-sm text-muted-foreground">إجمالي ساعات التعلم</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>تحليلات الأداء التفصيلية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">أفضل الدورات أداءً</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'الذكاء الاصطناعي في الموارد البشرية', completion: 94 },
                        { name: 'القيادة في الثقافة السعودية', completion: 89 },
                        { name: 'تطبيق رؤية 2030', completion: 87 }
                      ].map((course, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{course.name}</span>
                          <span className="text-sm font-medium">{course.completion}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">المهارات الأكثر طلباً</h4>
                    <div className="space-y-2">
                      {[
                        { skill: 'الذكاء الاصطناعي', demand: 95 },
                        { skill: 'تحليل البيانات', demand: 88 },
                        { skill: 'القيادة الرقمية', demand: 82 }
                      ].map((skill, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{skill.skill}</span>
                          <span className="text-sm font-medium">{skill.demand}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Assistant Integration */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            مساعد عقل HR الذكي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AqlHRAIAssistant 
            context="learning_optimization"
            placeholder="اسأل عن التعلم والتطوير، المهارات، أو التوصيات الشخصية..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningExperienceOptimization;

