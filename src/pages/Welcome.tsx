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
    {
      icon: Users,
      title: isArabic ? 'إدارة الموظفين' : 'Employee Management',
      description: isArabic ? 'إدارة شاملة لبيانات الموظفين والهيكل التنظيمي' : 'Comprehensive employee data and organizational structure management'
    },
    {
      icon: BarChart3,
      title: isArabic ? 'التحليلات الذكية' : 'Smart Analytics',
      description: isArabic ? 'رؤى مدفوعة بالذكاء الاصطناعي لاتخاذ قرارات استراتيجية' : 'AI-powered insights for strategic decision making'
    },
    {
      icon: Shield,
      title: isArabic ? 'الامتثال والحوكمة' : 'Compliance & Governance',
      description: isArabic ? 'ضمان الامتثال لقوانين العمل السعودية ومعايير الحوكمة' : 'Ensure compliance with Saudi labor laws and governance standards'
    },
    {
      icon: Zap,
      title: isArabic ? 'الأتمتة الذكية' : 'Smart Automation',
      description: isArabic ? 'أتمتة العمليات الروتينية وتحسين الكفاءة التشغيلية' : 'Automate routine processes and improve operational efficiency'
    }
  ];

  return (
<>
      {/* Header */}
      <header className="px-4 py-4 flex justify-between items-center w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{isArabic ? 'عقل HR' : 'AqlHR'}</h1>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'منصة الموارد البشرية الذكية' : 'Smart HR Platform'}
            </p>
          </div>
        </div>
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8 text-center w-full max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isArabic ? 'مستقبل الموارد البشرية' : 'The Future of HR'}
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              {isArabic 
                ? 'منصة شاملة للموارد البشرية مدعومة بالذكاء الاصطناعي، مصممة خصيصاً للشركات السعودية'
                : 'AI-powered comprehensive HR platform designed specifically for Saudi companies'
              }
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button asChild>
              <LinkL to="/auth">{isArabic ? 'ابدأ الآن' : 'Get Started'}</LinkL>
            </Button>
            <Button variant="outline">
              {isArabic ? 'شاهد العرض التوضيحي' : 'Watch Demo'}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-3">
            {isArabic ? 'لماذا تختار عقل HR؟' : 'Why Choose AqlHR?'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {isArabic 
              ? 'نوفر حلولاً متقدمة ومتكاملة لإدارة الموارد البشرية تتماشى مع رؤية المملكة 2030'
              : 'We provide advanced and integrated HR management solutions aligned with Saudi Vision 2030'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-3">
                <div className="mx-auto p-2 rounded-full bg-primary/10 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-8 w-full max-w-4xl">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">
                {isArabic ? 'ابدأ رحلتك الرقمية اليوم' : 'Start Your Digital Journey Today'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'انضم إلى آلاف الشركات التي تثق في منصتنا لإدارة مواردها البشرية بكفاءة وذكاء'
                  : 'Join thousands of companies that trust our platform to manage their human resources efficiently and intelligently'
                }
              </p>
              <div className="flex items-center justify-center">
                <Button asChild>
                  <LinkL to="/auth">
                    <Globe className="mr-2 h-4 w-4" />
                    {isArabic ? 'الوصول إلى المنصة' : 'Access Platform'}
                  </LinkL>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 border-t w-full max-w-4xl">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">
            {isArabic 
              ? '© 2024 عقل HR. جميع الحقوق محفوظة.' 
              : '© 2024 AqlHR. All rights reserved.'
            }
          </p>
        </div>
      </footer>
    </>
  );
};

export default Welcome;