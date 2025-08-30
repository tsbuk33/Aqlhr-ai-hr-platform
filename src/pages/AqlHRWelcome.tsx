import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Shield, Zap, TrendingUp, Clock, Award } from 'lucide-react';
import { LinkL, useSwitchLang } from '@/lib/i18n/LinkL';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useAqlHRLocalization } from '@/hooks/useAqlHRLocalization';

export default function AqlHRWelcome() {
  const { lang } = useUnifiedLocale();
  const { isArabic, formatters, directionClasses } = useAqlHRLocalization();
  const switchLang = useSwitchLang();

  // SEO and document setup
  useEffect(() => {
    const title = isArabic ? 'AqlHR - منصة الموارد البشرية الذكية' : 'AqlHR - Smart HR Platform';
    const description = isArabic 
      ? 'منصة شاملة لإدارة الموارد البشرية مع قدرات الذكاء الاصطناعي المتقدمة، مصممة خصيصاً للسوق السعودي'
      : 'Comprehensive HR management platform with advanced AI capabilities, designed specifically for the Saudi market';

    document.title = title;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AqlHR',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description,
      provider: {
        '@type': 'Organization',
        name: 'AqlHR',
        url: window.location.origin
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'SAR'
      }
    };

    let scriptTag = document.getElementById('aqlhr-json-ld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'aqlhr-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);
  }, [lang, isArabic]);

  const features = [
    {
      Icon: Users,
      titleEn: 'Employee Management',
      titleAr: 'إدارة الموظفين',
      descEn: 'Complete employee lifecycle management with Saudi compliance',
      descAr: 'إدارة شاملة لدورة حياة الموظف مع الامتثال للأنظمة السعودية'
    },
    {
      Icon: BarChart3,
      titleEn: 'Advanced Analytics',
      titleAr: 'التحليلات المتقدمة',
      descEn: 'AI-powered insights and predictive workforce analytics',
      descAr: 'رؤى مدعومة بالذكاء الاصطناعي وتحليلات القوى العاملة التنبؤية'
    },
    {
      Icon: Shield,
      titleEn: 'Compliance & Security',
      titleAr: 'الامتثال والأمان',
      descEn: 'Full compliance with Saudi labor laws and GDPR standards',
      descAr: 'امتثال كامل لقوانين العمل السعودية ومعايير الخصوصية'
    },
    {
      Icon: TrendingUp,
      titleEn: 'Performance Tracking',
      titleAr: 'تتبع الأداء',
      descEn: 'Real-time performance monitoring and goal tracking',
      descAr: 'مراقبة الأداء في الوقت الفعلي وتتبع الأهداف'
    },
    {
      Icon: Clock,
      titleEn: 'Time & Attendance',
      titleAr: 'الوقت والحضور',
      descEn: 'Automated time tracking with mobile check-in capabilities',
      descAr: 'تتبع الوقت التلقائي مع إمكانيات تسجيل الدخول عبر الجوال'
    },
    {
      Icon: Award,
      titleEn: 'Saudization Tracking',
      titleAr: 'تتبع السعودة',
      descEn: 'Monitor and optimize Saudization rates for Nitaqat compliance',
      descAr: 'مراقبة وتحسين معدلات السعودة للامتثال لبرنامج نطاقات'
    }
  ];

  const stats = [
    { valueEn: '500+', valueAr: '٥٠٠+', labelEn: 'Companies Trust Us', labelAr: 'شركة تثق بنا' },
    { valueEn: '50K+', valueAr: '٥٠ ألف+', labelEn: 'Employees Managed', labelAr: 'موظف تتم إدارته' },
    { valueEn: '99.9%', valueAr: '٩٩.٩٪', labelEn: 'Uptime Guarantee', labelAr: 'ضمان وقت التشغيل' },
    { valueEn: '24/7', valueAr: '٢٤/٧', labelEn: 'Support Available', labelAr: 'دعم متاح' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 px-4 py-2 bg-primary text-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {isArabic ? 'تجاوز إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      {/* Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AqlHR</h1>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'منصة الموارد البشرية الذكية' : 'Smart HR Platform'}
              </p>
            </div>
          </div>
          
          <nav aria-label={isArabic ? 'تبديل اللغة' : 'Language switcher'}>
            <LinkL 
              to={switchLang(isArabic ? 'en' : 'ar')} 
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              aria-label={isArabic ? 'تغيير اللغة إلى الإنجليزية' : 'Switch to Arabic'}
            >
              <span className="text-lg" aria-hidden="true">🌐</span>
              <span className="font-medium">
                {isArabic ? 'English' : 'عربي'}
              </span>
              <span className="text-xs opacity-70">
                ({isArabic ? 'EN' : 'AR'})
              </span>
            </LinkL>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1" role="main">
        {/* Hero Section */}
        <section className="py-16 px-4 text-center bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {isArabic ? 'مستقبل إدارة الموارد البشرية' : 'The Future of HR Management'}
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {isArabic 
                ? 'منصة شاملة مدعومة بالذكاء الاصطناعي لإدارة الموارد البشرية، مصممة خصيصاً للسوق السعودي مع الامتثال الكامل للأنظمة المحلية'
                : 'AI-powered comprehensive HR management platform designed specifically for the Saudi market with full compliance to local regulations'
              }
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button asChild size="lg" className="px-8">
                <LinkL to="/auth">
                  {isArabic ? 'ابدأ رحلتك الآن' : 'Start Your Journey'}
                </LinkL>
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                {isArabic ? 'شاهد العرض التوضيحي' : 'Watch Demo'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {isArabic ? stat.valueAr : stat.valueEn}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4" aria-labelledby="features-heading">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h3 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
                {isArabic ? 'الميزات المتقدمة' : 'Advanced Features'}
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {isArabic 
                  ? 'اكتشف كيف تساعدك منصة AqlHR في تحويل إدارة الموارد البشرية وزيادة الكفاءة'
                  : 'Discover how AqlHR helps transform your HR management and boost efficiency'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const { Icon } = feature;
                return (
                  <div 
                    key={index} 
                    className="p-6 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-2 text-lg">
                          {isArabic ? feature.titleAr : feature.titleEn}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {isArabic ? feature.descAr : feature.descEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {isArabic ? 'جاهز لتحويل إدارة الموارد البشرية؟' : 'Ready to Transform Your HR?'}
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              {isArabic 
                ? 'انضم إلى مئات الشركات السعودية التي تثق في AqlHR لإدارة مواردها البشرية'
                : 'Join hundreds of Saudi companies that trust AqlHR for their HR management'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="px-8">
                <LinkL to="/auth">
                  {isArabic ? 'ابدأ التجربة المجانية' : 'Start Free Trial'}
                </LinkL>
              </Button>
              <Button variant="ghost" size="lg" className="px-8">
                {isArabic ? 'تحدث مع خبير' : 'Talk to Expert'}
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-semibold">AqlHR</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {formatters.number(2025)} AqlHR • {isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}