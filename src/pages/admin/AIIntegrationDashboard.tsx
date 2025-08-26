import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  BarChart3,
  Settings,
  Sparkles,
  TrendingUp,
  Network
} from 'lucide-react';
import { 
  MODULE_CATEGORIES, 
  generateAIIntegrationPlan, 
  getPriorityIntegrationPlan, 
  getIntegrationStats 
} from '@/utils/aiIntegrationAudit';
import AqlHRAIAssistant from '@/components/ai/AqlHRAIAssistant';

const AIIntegrationDashboard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [integrationStats, setIntegrationStats] = useState(getIntegrationStats());
  const [priorityPlan, setPriorityPlan] = useState(getPriorityIntegrationPlan());

  useEffect(() => {
    // Simulate real-time stats update
    const timer = setInterval(() => {
      setIntegrationStats(getIntegrationStats());
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const priorityColors = {
    high: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
  };

  return (
    <div className={`container mx-auto p-6 space-y-8 max-w-7xl ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isArabic ? 'لوحة تكامل الذكاء الاصطناعي' : 'AI Integration Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic 
                ? 'مراقبة وإدارة تكامل مساعد الذكاء الاصطناعي عبر 317+ صفحة'
                : 'Monitor and manage AI assistant integration across 317+ pages'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Network className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{integrationStats.total}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'إجمالي الصفحات' : 'Total Pages'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{integrationStats.integrated}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'متكامل مع AI' : 'AI Integrated'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{integrationStats.remaining}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'يحتاج تكامل' : 'Needs Integration'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{integrationStats.percentageComplete}%</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'نسبة الإكمال' : 'Completion Rate'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {isArabic ? 'تقدم التكامل الشامل' : 'Overall Integration Progress'}
                </h3>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {integrationStats.integrated}/{integrationStats.total}
                </Badge>
              </div>
              <Progress value={integrationStats.percentageComplete} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? `${integrationStats.remaining} صفحة تحتاج إلى تكامل AI`
                  : `${integrationStats.remaining} pages need AI integration`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="categories">
            {isArabic ? 'الفئات' : 'Categories'}
          </TabsTrigger>
          <TabsTrigger value="priority">
            {isArabic ? 'الأولويات' : 'Priority Plan'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Module Categories Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {isArabic ? 'فئات الوحدات' : 'Module Categories'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'نظرة عامة على جميع فئات الوحدات وحالة التكامل'
                  : 'Overview of all module categories and integration status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MODULE_CATEGORIES.map((category, index) => (
                  <Card key={index} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">
                          {category.name}
                        </h4>
                        <Badge className={priorityColors[category.priority]}>
                          {category.priority}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>{category.pages.length} pages</div>
                        <div className="flex flex-wrap gap-1">
                          {category.specialFeatures.slice(0, 2).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {category.specialFeatures.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.specialFeatures.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {MODULE_CATEGORIES.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {category.name}
                  </span>
                  <Badge className={priorityColors[category.priority]}>
                    {category.priority} priority
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {category.pages.length} pages • AI Context: {category.aiContext}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Special Features:</h5>
                    <div className="flex flex-wrap gap-2">
                      {category.specialFeatures.map((feature, idx) => (
                        <Badge key={idx} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Pages:</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {category.pages.map((page, idx) => (
                        <div key={idx} className="p-2 bg-muted rounded text-muted-foreground">
                          {page}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="priority" className="space-y-6">
          {/* High Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                {isArabic ? 'أولوية عالية' : 'High Priority'}
              </CardTitle>
              <CardDescription>
                {priorityPlan.high.length} {isArabic ? 'صفحة تحتاج تكامل فوري' : 'pages need immediate integration'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {priorityPlan.high.slice(0, 10).map((page, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="font-medium">{page.moduleName}</div>
                    <div className="text-sm text-muted-foreground">{page.category}</div>
                    <div className="text-xs text-blue-600 mt-1">{page.recommendedContext}</div>
                  </div>
                ))}
              </div>
              {priorityPlan.high.length > 10 && (
                <p className="text-sm text-muted-foreground mt-4">
                  {isArabic ? 'و' : 'and'} {priorityPlan.high.length - 10} {isArabic ? 'صفحة أخرى...' : 'more pages...'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Medium Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Settings className="h-5 w-5" />
                {isArabic ? 'أولوية متوسطة' : 'Medium Priority'}
              </CardTitle>
              <CardDescription>
                {priorityPlan.medium.length} {isArabic ? 'صفحة للتكامل التالي' : 'pages for next integration phase'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'سيتم تكامل هذه الصفحات بعد إكمال الأولويات العالية'
                  : 'These pages will be integrated after high priority completion'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Assistant */}
      <AqlHRAIAssistant 
        moduleContext="admin.ai-integration"
        companyId="aqlhr-platform"
      />
    </div>
  );
};

export default AIIntegrationDashboard;