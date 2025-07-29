import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillMatrixDashboard } from '@/components/skills/SkillMatrixDashboard';
import { JobAnalysisWorkspace } from '@/components/skills/JobAnalysisWorkspace';
import { UniversalDocumentManager } from '@/components/common/UniversalDocumentManager';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Target, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Award,
  Zap,
  Brain,
  BarChart3,
  FileText,
  Settings,
  Upload,
  Database
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';

export default function SkillIntelligence() {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('matrix');
  const [marketIntelligence, setMarketIntelligence] = useState(null);
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);

  const fetchMarketIntelligence = async () => {
    setIsLoadingIntelligence(true);
    try {
      const { data, error } = await supabase.functions.invoke('external-intelligence', {
        body: {
          moduleContext: 'skills',
          query: 'Current skill demands, salary trends, and emerging technologies in Saudi Arabia technology and HR sector',
          dataType: 'market_data',
          country: 'Saudi Arabia',
          industry: 'HR Technology'
        }
      });

      if (error) throw error;

      setMarketIntelligence(data.externalInsight);
      toast({
        title: "Market Intelligence Updated",
        description: "Latest Saudi market data retrieved successfully"
      });
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      toast({
        title: "Error",
        description: "Failed to fetch market intelligence",
        variant: "destructive"
      });
    } finally {
      setIsLoadingIntelligence(false);
    }
  };

  useEffect(() => {
    fetchMarketIntelligence();
  }, []);

  const features = [
    {
      icon: Target,
      title: language === 'ar' ? 'مصفوفة المهارات الذكية' : 'Intelligent Skill Matrix',
      description: language === 'ar' 
        ? 'إدارة شاملة للمهارات التقنية والسلوكية مع تحليل الفجوات'
        : 'Comprehensive technical and behavioral skills management with gap analysis',
      color: 'text-blue-600'
    },
    {
      icon: Briefcase,
      title: language === 'ar' ? 'تحليل الوظائف بالذكاء الاصطناعي' : 'AI-Powered Job Analysis',
      description: language === 'ar' 
        ? 'إنشاء أوصاف الوظائف ومواصفاتها وتقييمها تلقائياً'
        : 'Automated job description generation, specification, and evaluation',
      color: 'text-green-600'
    },
    {
      icon: Brain,
      title: language === 'ar' ? 'التوصيات الذكية' : 'Intelligent Recommendations',
      description: language === 'ar' 
        ? 'توصيات مدعومة بالذكاء الاصطناعي لتطوير المهارات والتوظيف'
        : 'AI-driven recommendations for skill development and recruitment',
      color: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      title: language === 'ar' ? 'تحليل السوق' : 'Market Intelligence',
      description: language === 'ar' 
        ? 'تحليل اتجاهات السوق السعودي ومتطلبات المهارات المستقبلية'
        : 'Saudi market trends analysis and future skill requirements',
      color: 'text-orange-600'
    }
  ];

  const integrationPoints = [
    {
      module: language === 'ar' ? 'بيانات الموظفين الرئيسية' : 'Employee Master Data',
      status: 'connected',
      features: [
        language === 'ar' ? 'ربط تلقائي للمهارات' : 'Automatic skill mapping',
        language === 'ar' ? 'ملفات المهارات الفردية' : 'Individual skill profiles'
      ]
    },
    {
      module: language === 'ar' ? 'التوظيف والاختيار' : 'Recruitment & Hiring',
      status: 'connected',
      features: [
        language === 'ar' ? 'مطابقة المهارات للمرشحين' : 'Candidate skill matching',
        language === 'ar' ? 'إنشاء عروض العمل' : 'Job offer generation'
      ]
    },
    {
      module: language === 'ar' ? 'إدارة الأداء' : 'Performance Management',
      status: 'connected',
      features: [
        language === 'ar' ? 'تقييم الأداء القائم على المهارات' : 'Skill-based performance reviews',
        language === 'ar' ? 'خطط التطوير الشخصية' : 'Personal development plans'
      ]
    },
    {
      module: language === 'ar' ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center',
      status: 'connected',
      features: [
        language === 'ar' ? 'تحليلات المهارات للقيادة' : 'Executive skill analytics',
        language === 'ar' ? 'ذكاء خط المواهب' : 'Talent pipeline intelligence'
      ]
    }
  ];

  return (
    <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          {language === 'ar' ? 'ذكاء المهارات وتحليل الوظائف' : 'Skill Intelligence & Job Analysis'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'نظام ذكي شامل لإدارة المهارات وتحليل الوظائف مع الذكاء الاصطناعي المتقدم والامتثال للمعايير السعودية'
            : 'Comprehensive intelligent system for skill management and job analysis with advanced AI and Saudi compliance standards'
          }
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Intelligence Panel */}
      {marketIntelligence && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              {language === 'ar' ? 'ذكاء السوق المباشر' : 'Live Market Intelligence'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'معلومات السوق السعودي المحدثة من مصادر خارجية'
                : 'Real-time Saudi market insights from external sources'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <pre className="whitespace-pre-wrap text-sm">{marketIntelligence}</pre>
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={fetchMarketIntelligence} 
                  disabled={isLoadingIntelligence}
                  size="sm"
                  variant="outline"
                >
                  {isLoadingIntelligence ? 'Updating...' : 'Refresh Intelligence'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {language === 'ar' ? 'نقاط التكامل' : 'Integration Points'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'اتصال سلس مع جميع وحدات AqlHR للحصول على ذكاء شامل'
              : 'Seamless connection with all AqlHR modules for comprehensive intelligence'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationPoints.map((integration, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{integration.module}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">
                      {language === 'ar' ? 'متصل' : 'Connected'}
                    </span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {integration.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Application */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="matrix" className="gap-2">
              <Target className="h-4 w-4" />
              {language === 'ar' ? 'مصفوفة المهارات' : 'Skill Matrix'}
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <Briefcase className="h-4 w-4" />
              {language === 'ar' ? 'تحليل الوظائف' : 'Job Analysis'}
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <Database className="h-4 w-4" />
              {language === 'ar' ? 'إدارة المستندات' : 'Document Management'}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="matrix">
          <SkillMatrixDashboard />
        </TabsContent>

        <TabsContent value="analysis">
          <JobAnalysisWorkspace />
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {language === 'ar' ? 'مركز إدارة مستندات المهارات' : 'Skills Document Management Center'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'رفع وإدارة المستندات المتعلقة بالمهارات، شهادات التدريب، وسيرة الموظفين الذاتية'
                  : 'Upload and manage skills-related documents, training certificates, and employee resumes'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalDocumentManager 
                moduleName="Skills Intelligence"
                moduleNameAr="ذكاء المهارات"
                description="Upload and manage skills-related documents, training certificates, and employee resumes"
                descriptionAr="رفع وإدارة المستندات المتعلقة بالمهارات، شهادات التدريب، وسيرة الموظفين الذاتية"
                platform="skills-intelligence"
                moduleType="hr"
                acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.jpg', '.jpeg', '.png']}
                maxFileSize={50 * 1024 * 1024}
                maxFiles={20}
                showAsCard={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button size="lg" className="gap-2">
          <Zap className="h-5 w-5" />
          {language === 'ar' ? 'تشغيل التحليل الشامل' : 'Run Comprehensive Analysis'}
        </Button>
        <Button variant="outline" size="lg" className="gap-2">
          <BarChart3 className="h-5 w-5" />
          {language === 'ar' ? 'عرض التقارير التنفيذية' : 'View Executive Reports'}
        </Button>
        <Button variant="outline" size="lg" className="gap-2">
          <FileText className="h-5 w-5" />
          {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
        </Button>
      </div>

      {/* AI Assistant Integration */}
      <AqlHRAIAssistant 
        moduleContext="skills-intelligence" 
        companyId="demo-company"
      />
    </div>
  );
}