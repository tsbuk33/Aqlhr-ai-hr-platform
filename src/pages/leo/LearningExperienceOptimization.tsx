import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Target, TrendingUp, Award, Clock, Play, Users, Star, Zap, Filter, Heart, Link, Activity, CheckCircle, Globe, BarChart3, FileText, User, Briefcase, Calendar } from 'lucide-react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { AqlHRAIAssistant } from '@/components/ai';

const LearningExperienceOptimization: React.FC = () => {
  const { t, language, isRTL } = useLanguage();

  // Learning stats with proper translations
  const learningStats = {
    completedModules: 24,
    skillsAcquired: 8,
    learningStreak: 12,
    totalHours: 45.5,
    engagementScore: 87
  };

  // Active modules with translations
  const activeModules = [
    {
      id: '1',
      title: language === 'ar' ? 'تحليل البيانات المتقدم' : 'Advanced Data Analytics',
      duration: 12,
      progress: 75,
      type: language === 'ar' ? 'تقني' : 'Technical',
      nextLesson: language === 'ar' ? 'أساسيات التعلم الآلي' : 'Machine Learning Basics'
    },
    {
      id: '2', 
      title: language === 'ar' ? 'القيادة في الثقافة السعودية' : 'Leadership in Saudi Culture',
      duration: 8,
      progress: 30,
      type: language === 'ar' ? 'سلوكي' : 'Behavioral',
      nextLesson: language === 'ar' ? 'الذكاء الثقافي' : 'Cultural Intelligence'
    },
    {
      id: '3',
      title: language === 'ar' ? 'تنفيذ رؤية 2030' : 'Vision 2030 Implementation',
      duration: 10,
      progress: 90,
      type: language === 'ar' ? 'استراتيجي' : 'Strategic',
      nextLesson: language === 'ar' ? 'التحول الاقتصادي' : 'Economic Transformation'
    }
  ];

  const recommendations = [
    {
      id: '1',
      title: language === 'ar' ? 'الذكاء الاصطناعي في تحول الموارد البشرية' : 'AI in HR Transformation',
      description: language === 'ar' ? 'تعلم كيف يحدث الذكاء الاصطناعي ثورة في ممارسات الموارد البشرية في المملكة العربية السعودية' : 'Learn how AI is revolutionizing HR practices in Saudi Arabia',
      duration: 15,
      relevanceScore: 95,
      skillArea: language === 'ar' ? 'تقنية الموارد البشرية' : 'HR Technology',
      priority: language === 'ar' ? 'عالي' : 'High',
      type: language === 'ar' ? 'فيديو' : 'video'
    },
    {
      id: '2',
      title: language === 'ar' ? 'التواصل عبر الثقافات' : 'Cross-Cultural Communication',
      description: language === 'ar' ? 'إتقان التواصل عبر خلفيات ثقافية متنوعة' : 'Master communication across diverse cultural backgrounds',
      duration: 20,
      relevanceScore: 88,
      skillArea: language === 'ar' ? 'التواصل' : 'Communication',
      priority: language === 'ar' ? 'متوسط' : 'Medium',
      type: language === 'ar' ? 'تفاعلي' : 'interactive'
    },
    {
      id: '3',
      title: language === 'ar' ? 'إدارة المشاريع الرقمية' : 'Digital Project Management',
      description: language === 'ar' ? 'إدارة المشاريع المتقدمة للتحول الرقمي' : 'Advanced project management for digital transformation',
      duration: 25,
      relevanceScore: 82,
      skillArea: language === 'ar' ? 'إدارة المشاريع' : 'Project Management',
      priority: language === 'ar' ? 'متوسط' : 'Medium',
      type: language === 'ar' ? 'ورشة عمل' : 'workshop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 main-content" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section - FIXED WITH PROPER TRANSLATIONS */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'ليو - تحسين تجربة التعلم' : 'LEO - Learning Experience Optimization'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'التعلم المصغر المدعوم بالذكاء الاصطناعي، المسارات التكيفية وتطوير المهارات الشخصية'
              : 'AI-Powered Micro-Learning, Adaptive Pathways & Personalized Skill Development'
            }
          </p>
        </div>

        {/* Stats Cards - CENTERED LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 justify-center">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {learningStats.engagementScore}%
              </div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'نقاط المشاركة' : 'Engagement Score'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {learningStats.totalHours}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'ساعات التعلم' : 'Learning Hours'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {learningStats.learningStreak}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'أيام متتالية' : 'Day Streak'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {learningStats.skillsAcquired}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'المهارات المكتسبة' : 'Skills Acquired'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {learningStats.completedModules}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'الوحدات المكتملة' : 'Modules Completed'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - FIXED WITH PROPER TRANSLATIONS */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 justify-center">
            <TabsTrigger value="dashboard">
              {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </TabsTrigger>
            <TabsTrigger value="learning">
              {language === 'ar' ? 'تعلمي' : 'My Learning'}
            </TabsTrigger>
            <TabsTrigger value="progress">
              {language === 'ar' ? 'تقدم المهارات' : 'Skills Progress'}
            </TabsTrigger>
            <TabsTrigger value="paths">
              {language === 'ar' ? 'مسارات التعلم' : 'Learning Paths'}
            </TabsTrigger>
            <TabsTrigger value="ai">
              {language === 'ar' ? 'الذكاء الذكي' : 'Smart AI'}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              {language === 'ar' ? 'التحليلات' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Demo Data Active */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <Activity className="h-5 w-5 text-green-500" />
                    {language === 'ar' ? 'بيانات العرض التوضيحي المباشر نشطة' : 'Live Demo Data Active'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'ar' 
                      ? 'عرض 5 وحدات تدريبية، 5 سجلات تعلم، و6 ملفات شخصية للموظفين مع تتبع التقدم في الوقت الفعلي'
                      : 'Viewing 5 training modules, 5 learning records, and 6 employee profiles with real-time progress tracking'
                    }
                  </p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {language === 'ar' ? 'تم تحميل البيانات' : 'Data Loaded'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Continue Learning */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {language === 'ar' ? 'متابعة التعلم' : 'Continue Learning'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeModules.map((module) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{module.title}</h4>
                        <Badge variant="secondary">{module.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {language === 'ar' ? 'التالي: ' : 'Next: '}{module.nextLesson}
                      </p>
                      <div className="flex items-center justify-between">
                        <Progress value={module.progress} className="flex-1 ml-4" />
                        <span className="text-sm font-medium">{module.progress}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {module.duration} {language === 'ar' ? 'دقيقة' : 'min'}
                        </span>
                        <Button size="sm" variant="outline">
                          {language === 'ar' ? 'متابعة' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Brain className="h-5 w-5 text-purple-500" />
                  {language === 'ar' ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4 text-center">
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          variant={rec.priority === (language === 'ar' ? 'عالي' : 'High') ? 'destructive' : 'secondary'}
                          className="mb-2"
                        >
                          {rec.priority}
                        </Badge>
                        <span className="text-sm font-bold text-blue-600">
                          {rec.relevanceScore}% {language === 'ar' ? 'تطابق' : 'match'}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          ⏱️ {rec.duration} {language === 'ar' ? 'دقيقة' : 'min'}
                        </span>
                        <Button size="sm">
                          {language === 'ar' ? 'ابدأ' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with complete translations and center alignment */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {language === 'ar' ? 'وحدات التدريب النشطة (5 إجمالي)' : 'Active Training Modules (5 total)'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {language === 'ar' ? 'محتوى التعلم الخاص بك' : 'Your learning content'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {language === 'ar' ? 'تقدم التعلم الفردي' : 'Individual Learning Progress'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {language === 'ar' ? 'تقدم مهاراتك' : 'Your skills progress'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {language === 'ar' ? 'مسارات التعلم المخصصة' : 'Personalized Learning Paths'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {language === 'ar' ? 'مساراتك التعليمية' : 'Your learning paths'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Brain className="h-5 w-5 text-purple-500" />
                  {language === 'ar' ? 'مساعد الذكاء الاصطناعي للتعلم' : 'AI Learning Assistant'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {language === 'ar' ? 'مساعدك الذكي للتعلم' : 'Your smart learning assistant'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  {language === 'ar' ? 'تحليلات التعلم' : 'Learning Analytics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {language === 'ar' ? 'تحليلات التعلم والأداء' : 'Learning and performance analytics'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Assistant Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Brain className="h-5 w-5 text-purple-500" />
              {language === 'ar' ? 'مساعد عقل HR الذكي' : 'AqlHR AI Assistant'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AqlHRAIAssistant />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningExperienceOptimization;

