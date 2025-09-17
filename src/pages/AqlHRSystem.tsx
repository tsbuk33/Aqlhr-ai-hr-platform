import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2, Users, BarChart3, Target, Shield, Zap, TrendingUp, 
  Clock, Award, Brain, Cog, Database, Globe, Workflow
} from 'lucide-react';
import { LinkL } from '@/lib/i18n/LinkL';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function AqlHRSystem() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  // SEO setup
  useEffect(() => {
    const title = isArabic ? 'نظام AqlHR - نظرة عامة على النظام' : 'AqlHR System - System Overview';
    const description = isArabic 
      ? 'اكتشف قوة منصة AqlHR الشاملة لإدارة الموارد البشرية مع الذكاء الاصطناعي والامتثال للأنظمة السعودية'
      : 'Discover the power of AqlHR comprehensive HR platform with AI capabilities and Saudi compliance';

    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [isArabic]);

  const systemModules = [
    {
      Icon: Users,
      titleEn: 'Core HR Management',
      titleAr: 'إدارة الموارد البشرية الأساسية',
      descEn: 'Complete employee lifecycle management with Saudi labor law compliance',
      descAr: 'إدارة شاملة لدورة حياة الموظف مع الامتثال لقانون العمل السعودي',
      features: [
        { en: 'Employee Master Data', ar: 'البيانات الأساسية للموظفين' },
        { en: 'Time & Attendance', ar: 'الوقت والحضور' },
        { en: 'Leave Management', ar: 'إدارة الإجازات' },
        { en: 'Performance Management', ar: 'إدارة الأداء' }
      ]
    },
    {
      Icon: BarChart3,
      titleEn: 'Advanced Analytics',
      titleAr: 'التحليلات المتقدمة',
      descEn: 'AI-powered workforce analytics and predictive insights',
      descAr: 'تحليلات القوى العاملة مدعومة بالذكاء الاصطناعي والرؤى التنبؤية',
      features: [
        { en: 'Workforce Analytics', ar: 'تحليلات القوى العاملة' },
        { en: 'Predictive Modeling', ar: 'النمذجة التنبؤية' },
        { en: 'Executive Dashboards', ar: 'لوحات القيادة التنفيذية' },
        { en: 'Custom Reports', ar: 'التقارير المخصصة' }
      ]
    },
    {
      Icon: Shield,
      titleEn: 'Compliance & Government',
      titleAr: 'الامتثال والتكامل الحكومي',
      descEn: 'Seamless integration with Saudi government platforms',
      descAr: 'تكامل سلس مع المنصات الحكومية السعودية',
      features: [
        { en: 'Qiwa Integration', ar: 'تكامل قوى' },
        { en: 'GOSI Integration', ar: 'تكامل التأمينات الاجتماعية' },
        { en: 'Nitaqat Compliance', ar: 'امتثال نطاقات' },
        { en: 'MOL Compliance', ar: 'امتثال وزارة العمل' }
      ]
    },
    {
      Icon: Brain,
      titleEn: 'AI & Automation',
      titleAr: 'الذكاء الاصطناعي والأتمتة',
      descEn: 'Smart automation and AI-driven decision making',
      descAr: 'الأتمتة الذكية واتخاذ القرارات مدعومة بالذكاء الاصطناعي',
      features: [
        { en: 'Document Intelligence', ar: 'ذكاء المستندات' },
        { en: 'Automated Workflows', ar: 'سير العمل الآلي' },
        { en: 'Smart Recommendations', ar: 'التوصيات الذكية' },
        { en: 'Arabic NLP', ar: 'معالجة اللغة العربية' }
      ]
    },
    {
      Icon: TrendingUp,
      titleEn: 'Strategic Planning',
      titleAr: 'التخطيط الاستراتيجي',
      descEn: 'Long-term workforce planning and strategic HR initiatives',
      descAr: 'تخطيط القوى العاملة طويل الأجل والمبادرات الاستراتيجية للموارد البشرية',
      features: [
        { en: 'Workforce Planning', ar: 'تخطيط القوى العاملة' },
        { en: 'Succession Planning', ar: 'تخطيط التعاقب' },
        { en: 'Talent Acquisition', ar: 'اكتساب المواهب' },
        { en: 'Leadership Development', ar: 'تطوير القيادة' }
      ]
    },
    {
      Icon: Cog,
      titleEn: 'Platform Features',
      titleAr: 'ميزات المنصة',
      descEn: 'Core platform capabilities and integrations',
      descAr: 'قدرات المنصة الأساسية والتكاملات',
      features: [
        { en: 'Mobile Application', ar: 'التطبيق المحمول' },
        { en: 'API Gateway', ar: 'بوابة API' },
        { en: 'Security Framework', ar: 'إطار الأمان' },
        { en: 'Multi-language Support', ar: 'دعم متعدد اللغات' }
      ]
    }
  ];

  const stats = [
    { valueEn: '15+', valueAr: '١٥+', labelEn: 'Core Modules', labelAr: 'وحدة أساسية' },
    { valueEn: '100+', valueAr: '١٠٠+', labelEn: 'Features', labelAr: 'ميزة' },
    { valueEn: '20+', valueAr: '٢٠+', labelEn: 'Gov Integrations', labelAr: 'تكامل حكومي' },
    { valueEn: '99.9%', valueAr: '٩٩.٩٪', labelEn: 'Uptime', labelAr: 'وقت التشغيل' }
  ];

  const executiveCards = [
    {
      title: isArabic ? 'التحليلات التنفيذية' : 'Executive Analytics',
      subtitle: isArabic ? 'رؤى متقدمة للقيادة العليا' : 'Advanced insights for senior leadership',
      icon: BarChart3
    },
    {
      title: isArabic ? 'الذكاء الاصطناعي المتقدم' : 'Advanced AI',
      subtitle: isArabic ? 'تحليلات ذكية وتوصيات فورية' : 'Smart analytics and real-time recommendations',
      icon: Brain
    },
    {
      title: isArabic ? 'دعم اتخاذ القرارات' : 'Decision Support',
      subtitle: isArabic ? 'دعم استراتيجي لاتخاذ القرارات' : 'Strategic decision-making support',
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="aqlhr-center-container">
        {/* Executive Intelligence Center - Boxed Hero */}
        <section className="bg-card border rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-4">
            <Badge variant="secondary" className="uppercase tracking-wide">
              {isArabic ? 'مميز' : 'PREMIUM'}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-center">
            {isArabic ? 'مركز الذكاء التنفيذي عقل HR' : 'AqlHR Executive Intelligence Center'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mt-2">
            {isArabic ? 'رؤى استراتيجية متقدمة عبر جميع وحدات الموارد البشرية' : 'Advanced strategic insights across all HR modules'}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {executiveCards.map((card, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-3 p-3 bg-primary/10 rounded-full w-fit">
                    <card.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.subtitle}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="aqlhr-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="aqlhr-stat-card">
              <div className="text-3xl font-bold text-primary mb-2">
                {isArabic ? stat.valueAr : stat.valueEn}
              </div>
              <div className="text-muted-foreground">
                {isArabic ? stat.labelAr : stat.labelEn}
              </div>
            </div>
          ))}
        </section>

        {/* System Modules */}
        <section className="space-y-8">
          <div className="aqlhr-center-text">
            <h2 className="text-3xl font-bold mb-4">
              {isArabic ? 'وحدات النظام' : 'System Modules'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isArabic 
                ? 'اكتشف الوحدات المتنوعة التي تشكل منصة AqlHR الشاملة'
                : 'Discover the diverse modules that make up the comprehensive AqlHR platform'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {systemModules.map((module, index) => {
              const { Icon } = module;
              return (
                <Card key={index} className="aqlhr-card">
                  <CardHeader className="aqlhr-card-header">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="aqlhr-stat-icon bg-primary/10 rounded-lg p-3">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="aqlhr-card-title">
                          {isArabic ? module.titleAr : module.titleEn}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="aqlhr-card-description">
                      {isArabic ? module.descAr : module.descEn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="aqlhr-card-content">
                    <div className="grid grid-cols-2 gap-3">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>{isArabic ? feature.ar : feature.en}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center bg-muted/30 rounded-2xl">
          <div className="aqlhr-center-container">
            <h3 className="text-3xl font-bold mb-4">
              {isArabic ? 'جاهز لاستكشاف النظام؟' : 'Ready to Explore the System?'}
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {isArabic 
                ? 'ابدأ رحلتك مع AqlHR واستكشف جميع الوحدات والميزات المتقدمة'
                : 'Start your journey with AqlHR and explore all the advanced modules and features'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="px-8">
                <LinkL to="/dashboard">
                  {isArabic ? 'انتقل إلى لوحة التحكم' : 'Go to Dashboard'}
                </LinkL>
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                {isArabic ? 'جدولة عرض توضيحي' : 'Schedule Demo'}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}