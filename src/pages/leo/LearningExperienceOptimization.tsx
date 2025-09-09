import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Target, TrendingUp, Award, Clock, Play, Users, Star, Zap, Filter, Heart, Link, Activity, CheckCircle, Globe, BarChart3, FileText, User, Briefcase, Calendar } from 'lucide-react';

const LearningExperienceOptimization: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Ensure HTML direction is set correctly
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${isRTL ? 'font-arabic' : ''}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Learning stats
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
      title: t('leo.modules.leadership.title'),
      duration: 12,
      progress: 75,
      type: t('leo.modules.leadership.subtitle'),
      nextLesson: t('leo.modules.leadership.description')
    },
    {
      id: '2', 
      title: t('leo.modules.digitalTransformation.title'),
      duration: 8,
      progress: 30,
      type: t('leo.modules.digitalTransformation.subtitle'),
      nextLesson: t('leo.modules.digitalTransformation.description')
    },
    {
      id: '3',
      title: t('leo.modules.safetyProtocols.title'),
      duration: 10,
      progress: 90,
      type: t('leo.modules.safetyProtocols.subtitle'),
      nextLesson: t('leo.modules.safetyProtocols.description')
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 main-content ${isRTL ? 'font-arabic text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section - FIXED WITH PROPER TRANSLATIONS */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('leo.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('leo.subtitle')}
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
                {t('leo.engagement_score')}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {learningStats.totalHours}
              </div>
              <div className="text-sm text-gray-600">
                {t('leo.metrics.learningHours')}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {learningStats.learningStreak}
              </div>
              <div className="text-sm text-gray-600">
                {t('leo.metrics.dayStreak')}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {learningStats.skillsAcquired}
              </div>
              <div className="text-sm text-gray-600">
                {t('leo.metrics.skillsAcquired')}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {learningStats.completedModules}
              </div>
              <div className="text-sm text-gray-600">
                {t('leo.metrics.modulesCompleted')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - FIXED WITH PROPER TRANSLATIONS */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 justify-center">
            <TabsTrigger value="dashboard">
              {t('leo.dashboard')}
            </TabsTrigger>
            <TabsTrigger value="learning">
              {t('leo.my_learning')}
            </TabsTrigger>
            <TabsTrigger value="progress">
              {t('leo.skills_progress')}
            </TabsTrigger>
            <TabsTrigger value="paths">
              {t('leo.learning_paths')}
            </TabsTrigger>
            <TabsTrigger value="ai">
              {t('leo.smart_ai')}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              {t('leo.analytics')}
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
                    {t('leo.demo_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    {t('leo.demo.description')}
                  </p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {t('leo.demo.dataLoaded')}
                  </Badge>
                </CardContent>
              </Card>

              {/* Continue Learning */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {t('leo.modules.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeModules.map((module) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{module.title}</h4>
                        <Badge variant="secondary">{t('leo.modules.leadership.active')}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {module.nextLesson}
                      </p>
                      <div className="flex items-center justify-between">
                        <Progress value={module.progress} className="flex-1 ml-4" />
                        <span className="text-sm font-medium">{module.progress}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {module.duration} {isRTL ? 'دقيقة' : 'min'}
                        </span>
                        <Button size="sm" variant="outline">
                          {t('common.next')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs with complete translations and center alignment */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {t('leo.modules.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {t('leo.tabs.myLearning')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {t('leo.tabs.skillsProgress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {t('leo.tabs.skillsProgress')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {t('leo.tabs.learningPaths')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {t('leo.tabs.learningPaths')}
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
                  {t('leo.tabs.smartAI')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {t('leo.tabs.smartAI')}
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
                  {t('leo.tabs.analytics')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {t('leo.tabs.analytics')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearningExperienceOptimization;

