import { useLocale } from '@/i18n/locale';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, Target, TrendingUp, Users, Zap } from 'lucide-react';

// Executive Intelligence Center - Restored Layout
const ExecutiveIntelligenceCenter = () => {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  
  const executiveCards = [
    {
      title: isArabic ? 'التحليلات التنفيذية' : 'Executive Analytics',
      subtitle: isArabic ? 'رؤى متقدمة للقيادة العليا' : 'Advanced insights for senior leadership',
      description: isArabic 
        ? 'لوحات قيادة تفاعلية مع مؤشرات الأداء الرئيسية والتحليلات التنبؤية'
        : 'Interactive dashboards with KPIs and predictive analytics',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    {
      title: isArabic ? 'الذكاء الاصطناعي المتقدم' : 'Advanced AI',
      subtitle: isArabic ? 'تحليلات ذكية وتوصيات فورية' : 'Smart analytics and real-time recommendations',
      description: isArabic 
        ? 'محرك ذكي لمعالجة البيانات وتقديم التوصيات الاستراتيجية'
        : 'Intelligent engine for data processing and strategic recommendations',
      icon: Brain,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
    },
    {
      title: isArabic ? 'دعم اتخاذ القرارات' : 'Decision Support',
      subtitle: isArabic ? 'دعم استراتيجي لاتخاذ القرارات' : 'Strategic decision-making support',
      description: isArabic 
        ? 'أدوات متطورة لمحاكاة السيناريوهات وتقييم المخاطر'
        : 'Advanced tools for scenario modeling and risk assessment',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
    },
  ];

  const systemStats = [
    {
      label: isArabic ? 'وحدة نشطة' : 'Active Modules',
      value: '105+',
      icon: Zap,
    },
    {
      label: isArabic ? 'مستخدم نشط' : 'Active Users',
      value: '2,847',
      icon: Users,
    },
    {
      label: isArabic ? 'معدل الأداء' : 'Performance',
      value: '99.9%',
      icon: TrendingUp,
    },
  ];
  
  return (
    <div className={`min-h-screen bg-background ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section - Boxed */}
        <div className="bg-card border rounded-lg p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {isArabic ? 'مركز الذكاء التنفيذي عقل HR' : 'AqlHR Executive Intelligence Center'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isArabic 
                ? 'نظام تشغيل الموارد البشرية المتقدم - تنسيق أكثر من 105 وحدة بتميز الذكاء الاصطناعي'
                : 'The Ultimate HR Operating System - Orchestrating 105+ Modules with AI Excellence'
              }
            </p>
          </div>
        </div>

        {/* Stats Section - Boxed */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isArabic ? 'إحصائيات النظام' : 'System Statistics'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {systemStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Cards Section - Three Card Row */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isArabic ? 'الوحدات التنفيذية' : 'Executive Modules'}
            </h2>
            <p className="text-muted-foreground">
              {isArabic 
                ? 'أدوات متطورة للقيادة والإدارة التنفيذية'
                : 'Advanced tools for executive leadership and management'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {executiveCards.map((card, index) => (
              <Card key={index} className={`${card.bgColor} hover:shadow-lg transition-shadow`}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-background rounded-full w-fit">
                    <card.icon className={`h-8 w-8 ${card.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{card.title}</CardTitle>
                  <CardDescription className="text-sm font-medium">
                    {card.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {card.description}
                  </p>
                  <Button className="w-full" variant="default">
                    {isArabic ? 'فتح الوحدة' : 'Open Module'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Section - Boxed */}
        <div className="bg-card border rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">
              {isArabic ? 'التكامل الذكي' : 'Smart Integration'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isArabic 
                ? 'نظام متكامل يجمع جميع وحدات الموارد البشرية في منصة واحدة'
                : 'Integrated system bringing all HR modules together in one platform'
              }
            </p>
            <Button size="lg" className="px-8">
              {isArabic ? 'استكشف جميع الوحدات' : 'Explore All Modules'}
            </Button>
          </div>
        </div>
      </div>
      
      <AqlHRAIAssistant 
        moduleContext="executive.intelligence" 
        position="fixed"
        className="executive-ai-assistant"
      />
      <UniversalAIIntegrator 
        pageType="executive" 
        moduleName="executive-intelligence-center" 
        companyId="demo-company" 
        enabledFeatures={['executive-insights', 'strategic-intelligence', 'leadership-analytics', 'predictive-analytics']}
      />
    </div>
  );
};

export default ExecutiveIntelligenceCenter;