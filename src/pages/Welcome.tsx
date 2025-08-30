import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Shield, Zap, Globe } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import LanguageToggle from '@/components/LanguageToggle';
import { LinkL } from '@/lib/i18n/LinkL';

const Welcome = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const features = [
    { icon: Users, title: isArabic ? 'إدارة الموظفين' : 'Employee Management', description: isArabic ? 'إدارة شاملة لبيانات الموظفين والهيكل التنظيمي' : 'Comprehensive employee data and organizational structure management' },
    { icon: BarChart3, title: isArabic ? 'التحليلات الذكية' : 'Smart Analytics', description: isArabic ? 'رؤى مدفوعة بالذكاء الاصطناعي لاتخاذ قرارات استراتيجية' : 'AI-powered insights for strategic decision making' },
    { icon: Shield, title: isArabic ? 'الامتثال والحوكمة' : 'Compliance & Governance', description: isArabic ? 'ضمان الامتثال لقوانين العمل السعودية ومعايير الحوكمة' : 'Ensure compliance with Saudi labor laws and governance standards' },
    { icon: Zap, title: isArabic ? 'الأتمتة الذكية' : 'Smart Automation', description: isArabic ? 'أتمتة العمليات الروتينية وتحسين الكفاءة التشغيلية' : 'Automate routine processes and improve operational efficiency' }
  ];

  return (
    <>
      <header className="px-4 py-4 flex justify-between items-center w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">{isArabic ? 'نظام الموارد البشرية' : 'AqlHR'}</span>
        </div>
        <LanguageToggle />
      </header>

      <section className="px-4 py-8 text-center w-full max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {isArabic ? 'مستقبل الموارد البشرية' : 'The Future of HR'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isArabic 
                ? 'منصة شاملة لإدارة الموارد البشرية مصممة خصيصاً للسوق السعودي مع تقنيات الذكاء الاصطناعي المتقدمة'
                : 'A comprehensive HR management platform designed specifically for the Saudi market with advanced AI capabilities'
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkL to="/dashboard">
              <Button size="lg" className="min-w-40">
                {isArabic ? 'ابدأ الآن' : 'Get Started'}
              </Button>
            </LinkL>
            <Button variant="outline" size="lg" className="min-w-40">
              {isArabic ? 'تعرف أكثر' : 'Learn More'}
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 w-full max-w-4xl">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isArabic ? 'جاهز للبدء؟' : 'Ready to Get Started?'}
              </h2>
              <p className="text-muted-foreground">
                {isArabic 
                  ? 'انضم إلى مئات الشركات التي تثق في منصتنا لإدارة مواردها البشرية'
                  : 'Join hundreds of companies that trust our platform for their HR management'
                }
              </p>
              <LinkL to="/auth/signup">
                <Button size="lg" className="min-w-40">
                  {isArabic ? 'إنشاء حساب' : 'Create Account'}
                </Button>
              </LinkL>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="px-4 py-6 border-t w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{isArabic ? '© 2024 نظام الموارد البشرية. جميع الحقوق محفوظة.' : '© 2024 AqlHR. All rights reserved.'}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              {isArabic ? 'الخصوصية' : 'Privacy'}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {isArabic ? 'الشروط' : 'Terms'}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {isArabic ? 'الدعم' : 'Support'}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Welcome;