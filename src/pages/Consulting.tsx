import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, BarChart3, Trophy, Lightbulb, ArrowRight, Star, Users, Building, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AqlHRAIAssistant } from '@/components/ai';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const Consulting = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';
  const navigate = useNavigate();
  
  const consultingServices = [
    {
      id: 'ai-assessment',
      title: isArabic ? 'تقييم الذكاء التنظيمي الاستراتيجي' : 'AI Strategic Assessment',
      titleEn: 'AI Strategic Assessment',
      description: isArabic ? 'تقييم شامل يقارن منظمتكم مع أنجح الشركات السعودية' : 'Comprehensive assessment comparing your organization to Saudi Arabia\'s most successful corporations',
      icon: Brain,
      badge: isArabic ? 'جديد' : 'NEW',
      badgeColor: 'bg-brand-accent text-background',
      path: '/consulting/ai-assessment',
      priority: 1,
      features: [
        isArabic ? '35 سؤال تكيفي' : '35 adaptive questions',
        isArabic ? 'تحليل فوري بالذكاء الاصطناعي' : 'Immediate AI analysis', 
        isArabic ? 'مقارنة بالشركات النخبة' : 'Elite corporate benchmarking',
        isArabic ? 'توصيات استراتيجية' : 'Strategic recommendations'
      ]
    },
    {
      id: 'strategic-planning',
      title: isArabic ? 'التخطيط الاستراتيجي' : 'Strategic Planning',
      description: isArabic ? 'تطوير استراتيجيات الموارد البشرية طويلة المدى' : 'Long-term HR strategy development',
      icon: Target,
      path: '/consulting/strategic-planning',
      priority: 2
    },
    {
      id: 'digital-transformation', 
      title: isArabic ? 'التحول الرقمي' : 'Digital Transformation',
      description: isArabic ? 'تحديث الأنظمة والعمليات الرقمية' : 'Digital systems and process modernization',
      icon: TrendingUp,
      path: '/consulting/digital-transformation',
      priority: 3
    },
    {
      id: 'change-management',
      title: isArabic ? 'إدارة التغيير' : 'Change Management', 
      description: isArabic ? 'قيادة التحولات التنظيمية بنجاح' : 'Leading successful organizational transformations',
      icon: Users,
      path: '/consulting/change-management',
      priority: 4
    },
    {
      id: 'benchmarking',
      title: isArabic ? 'تحليل المقارنات المرجعية' : 'Benchmarking Analysis',
      description: isArabic ? 'مقارنة الأداء مع أفضل الشركات' : 'Performance comparison with industry leaders',
      icon: BarChart3,
      path: '/consulting/benchmarking',
      priority: 5
    },
    {
      id: 'culture-transformation',
      title: isArabic ? 'تحويل الثقافة التنظيمية' : 'Culture Transformation',
      description: isArabic ? 'بناء ثقافة منظمة قوية ومتماسكة' : 'Building strong and cohesive organizational culture',
      icon: Building,
      path: '/consulting/culture-transformation',
      priority: 6
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {isArabic ? 'الاستشارات المتميزة' : 'Premium Consulting'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {isArabic ? 'استشارات الموارد البشرية التنفيذية من الخبراء' : 'Executive HR consulting from industry experts'}
        </p>
        <Badge className="bg-brand-primary text-background">
          {isArabic ? 'خدمات استشارية متميزة' : 'Premium Consulting Services'}
        </Badge>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Trophy className="h-8 w-8 text-brand-accent mx-auto mb-3" />
            <p className="text-3xl font-bold text-brand-primary">75th</p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'المئين السوقي' : 'Market Percentile'}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <BarChart3 className="h-8 w-8 text-brand-secondary mx-auto mb-3" />
            <p className="text-3xl font-bold text-brand-secondary">94.2%</p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'نقاط العدالة في الأجور' : 'Pay Equity Score'}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-brand-accent mx-auto mb-3" />
            <p className="text-3xl font-bold text-brand-accent">SAR 2.3M</p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'الوفورات السنوية' : 'Annual Savings'}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Star className="h-8 w-8 text-brand-primary mx-auto mb-3" />
            <p className="text-3xl font-bold text-brand-primary">8.4/10</p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'نقاط الثقافة' : 'Culture Score'}</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Assessment Tool Highlight */}
      <Card className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border-2 border-brand-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-background">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">
                    {isArabic ? 'تقييم الذكاء التنظيمي الاستراتيجي AqlHR' : 'AqlHR Strategic Organizational Intelligence Assessment'}
                  </CardTitle>
                  <Badge className="bg-brand-accent text-background">
                    {isArabic ? 'جديد' : 'NEW'}
                  </Badge>
                </div>
                <CardDescription className="text-lg">
                  {isArabic 
                    ? 'اكتشف كيف تقارن منظمتكم مع أنجح الشركات في المملكة العربية السعودية'
                    : 'Discover how your organization compares to Saudi Arabia\'s most successful corporations'
                  }
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/consulting/ai-assessment')}
              size="lg"
              className="bg-brand-primary hover:bg-brand-primary/90 text-background"
            >
              {isArabic ? 'ابدأ التقييم' : 'START ASSESSMENT'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {consultingServices[0].features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consulting Services Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isArabic ? 'خدماتنا الاستشارية' : 'Our Consulting Services'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultingServices.slice(1).map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-brand-primary" />
                      <CardTitle className="text-lg group-hover:text-brand-primary transition-colors">
                        {service.title}
                      </CardTitle>
                    </div>
                    {service.badge && (
                      <Badge className={service.badgeColor || 'bg-brand-secondary'}>
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-brand-primary group-hover:text-background transition-colors"
                    onClick={() => navigate(service.path)}
                  >
                    {isArabic ? 'تعلم المزيد' : 'Learn More'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {isArabic ? 'قصص نجاح عملائنا' : 'Client Success Stories'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-primary">340%</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'عائد على الاستثمار في تحويل الثقافة' : 'Culture Transformation ROI'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-secondary">23%</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'تحسن في الكفاءة التشغيلية' : 'Operational Efficiency Improvement'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-accent">95%</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'رضا العملاء عن الخدمات' : 'Client Satisfaction Rate'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {isArabic ? 'إدارة الوثائق' : 'Document Management'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'لماذا تختار خدماتنا الاستشارية؟' : 'Why Choose Our Consulting Services?'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-brand-primary">
                    {isArabic ? 'خبرة سعودية متخصصة' : 'Specialized Saudi Expertise'}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {isArabic ? 'فهم عميق للسوق السعودي' : 'Deep understanding of Saudi market'}</li>
                    <li>• {isArabic ? 'خبرة في الأنظمة واللوائح المحلية' : 'Expertise in local regulations and systems'}</li>
                    <li>• {isArabic ? 'شراكة مع أكبر الشركات السعودية' : 'Partnership with major Saudi corporations'}</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-brand-primary">
                    {isArabic ? 'نهج متكامل' : 'Integrated Approach'}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {isArabic ? 'حلول شاملة من التقييم إلى التنفيذ' : 'Complete solutions from assessment to implementation'}</li>
                    <li>• {isArabic ? 'تكامل مع منصة AqlHR' : 'Integration with AqlHR platform'}</li>
                    <li>• {isArabic ? 'دعم مستمر وتطوير طويل المدى' : 'Continuous support and long-term development'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <UniversalDocumentManager
            moduleName={isArabic ? "الاستشارات التنفيذية" : "Executive Consulting"}
            description={isArabic ? "إدارة شاملة لوثائق الاستشارات والتقارير" : "Comprehensive management of consulting documents and reports"}
            platform="consulting"
            moduleType="hr"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.ppt', '.pptx']}
            maxFileSize={30}
            maxFiles={100}
          />
        </TabsContent>
      </Tabs>
      
      <ModuleDocumentUploader moduleKey="consulting.services" />
      <AqlHRAIAssistant moduleContext="consulting.services" />
      
      {/* AI Integration for Consulting Services */}
      <UniversalAIIntegrator 
        pageType="consulting" 
        moduleName="consulting-services" 
        companyId="demo-company" 
        enabledFeatures={['strategic-consulting', 'executive-insights', 'benchmarking-analysis', 'organizational-assessment']}
      />
    </div>
  );
};

export default Consulting;