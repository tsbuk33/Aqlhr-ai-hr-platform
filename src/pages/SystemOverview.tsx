import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, Brain, Target, TrendingUp, Users, Zap, 
  Shield, Building, Award, Clock, DollarSign, Globe,
  ChevronRight, Sparkles
} from 'lucide-react';
import { LinkL } from '@/lib/i18n/LinkL';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function SystemOverview() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const executiveCards = [
    {
      title: isArabic ? 'التحليلات التنفيذية' : 'Executive Analytics',
      subtitle: isArabic ? 'رؤى متقدمة للقيادة العليا' : 'Advanced insights for senior leadership',
      description: isArabic 
        ? 'لوحات قيادة تفاعلية مع مؤشرات الأداء الرئيسية والتحليلات التنبؤية'
        : 'Interactive dashboards with KPIs and predictive analytics',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      title: isArabic ? 'الذكاء الاصطناعي المتقدم' : 'Advanced AI',
      subtitle: isArabic ? 'تحليلات ذكية وتوصيات فورية' : 'Smart analytics and real-time recommendations',
      description: isArabic 
        ? 'محرك ذكي لمعالجة البيانات وتقديم التوصيات الاستراتيجية'
        : 'Intelligent engine for data processing and strategic recommendations',
      icon: Brain,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200'
    },
    {
      title: isArabic ? 'دعم اتخاذ القرارات' : 'Decision Support',
      subtitle: isArabic ? 'دعم استراتيجي لاتخاذ القرارات' : 'Strategic decision-making support',
      description: isArabic 
        ? 'أدوات متطورة لمحاكاة السيناريوهات وتقييم المخاطر'
        : 'Advanced tools for scenario modeling and risk assessment',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    }
  ];

  const systemStats = [
    {
      label: isArabic ? 'وحدة نشطة' : 'Active Modules',
      value: '105+',
      icon: Zap,
      color: 'text-primary'
    },
    {
      label: isArabic ? 'مستخدم نشط' : 'Active Users',
      value: '2,847',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: isArabic ? 'معدل الأداء' : 'Performance',
      value: '99.9%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: isArabic ? 'الامتثال الحكومي' : 'Gov Compliance',
      value: '100%',
      icon: Shield,
      color: 'text-purple-600'
    }
  ];

  const integrationStats = [
    {
      title: isArabic ? 'الموظفين' : 'Employees',
      value: '+12%',
      subtitle: isArabic ? 'مقارنة بالشهر الماضي' : 'vs last month'
    },
    {
      title: isArabic ? 'العمليات الذكية' : 'AI Processes', 
      value: isArabic ? '+24 أداة نشطة' : '+24 شاطة نشطة',
      subtitle: isArabic ? 'Complete 22 Gov + 24 Tools' : 'Complete 22 Gov + 24 Tools'
    },
    {
      title: isArabic ? 'التكاملات' : 'Integrations',
      value: '+2.1%',
      subtitle: isArabic ? 'الامتثال التنظيمي' : 'regulatory compliance'
    }
  ];

  return (
    <div className={`min-h-screen bg-background ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section - Boxed */}
        <div className="bg-card border rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-4 uppercase tracking-wide">
              {isArabic ? 'مميز' : 'PREMIUM'}
            </Badge>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {isArabic ? 'مركز الذكاء التنفيذي عقل HR' : 'AqlHR Executive Intelligence Center'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isArabic 
                ? 'رؤى استراتيجية متقدمة عبر جميع وحدات الموارد البشرية'
                : 'Advanced strategic insights across all HR modules'
              }
            </p>
          </div>

          {/* Integration Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {integrationStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold text-foreground mb-1">{stat.title}</div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Executive Cards - Three Card Row */}
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
                  <Button className="w-full" variant="default" asChild>
                    <LinkL to="/executive-center">
                      {isArabic ? 'فتح الوحدة' : 'Open Module'}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </LinkL>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Statistics - Boxed */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isArabic ? 'إحصائيات النظام' : 'System Statistics'}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Core HR Modules - Boxed */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-4">
              {isArabic ? 'الوحدات الأساسية' : 'Core HR Modules'}
            </h3>
            <p className="text-muted-foreground">
              {isArabic 
                ? 'نظام متكامل يجمع جميع وحدات الموارد البشرية في منصة واحدة'
                : 'Integrated system bringing all HR modules together in one platform'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, title: isArabic ? 'إدارة الموظفين' : 'Employee Management', path: '/employees' },
              { icon: Clock, title: isArabic ? 'الوقت والحضور' : 'Time & Attendance', path: '/time-attendance' },
              { icon: DollarSign, title: isArabic ? 'الرواتب' : 'Payroll', path: '/payroll' },
              { icon: BarChart3, title: isArabic ? 'التحليلات' : 'Analytics', path: '/analytics' },
              { icon: Shield, title: isArabic ? 'الامتثال' : 'Compliance', path: '/government' },
              { icon: Brain, title: isArabic ? 'الذكاء الاصطناعي' : 'AI Features', path: '/ai-features' },
              { icon: Building, title: isArabic ? 'التنظيم' : 'Organization', path: '/organization' },
              { icon: Award, title: isArabic ? 'الأداء' : 'Performance', path: '/performance' }
            ].map((module, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <div className="mx-auto p-2 bg-primary/10 rounded-lg w-fit">
                      <module.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-medium text-sm">{module.title}</h4>
                  <Button variant="ghost" size="sm" className="mt-2 w-full" asChild>
                    <LinkL to={module.path}>
                      {isArabic ? 'عرض' : 'View'}
                    </LinkL>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Smart Integration - Boxed */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <div className="mb-4">
              <Sparkles className="h-8 w-8 mx-auto text-primary mb-2" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              {isArabic ? 'التكامل الذكي' : 'Smart Integration'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {isArabic 
                ? 'اكتشف القوة الكاملة لمنصة AqlHR مع أكثر من 105 وحدة متكاملة وذكاء اصطناعي متقدم'
                : 'Discover the full power of AqlHR platform with 105+ integrated modules and advanced AI'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="px-8" asChild>
                <LinkL to="/dashboard">
                  {isArabic ? 'انتقل إلى لوحة التحكم' : 'Go to Dashboard'}
                </LinkL>
              </Button>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <LinkL to="/executive-center">
                  {isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence'}
                </LinkL>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}