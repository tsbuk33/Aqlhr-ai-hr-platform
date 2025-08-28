import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Shield, Zap, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import LanguageToggle from '@/components/LanguageToggle';
import { LinkL } from '@/lib/i18n/LinkL';

const Welcome = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';


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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isArabic ? 'عقل HR' : 'AqlHR'}</h1>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'منصة الموارد البشرية الذكية' : 'Smart HR Platform'}
            </p>
          </div>
        </div>
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isArabic ? 'مستقبل الموارد البشرية' : 'The Future of HR'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isArabic 
                ? 'منصة شاملة للموارد البشرية مدعومة بالذكاء الاصطناعي، مصممة خصيصاً للشركات السعودية'
                : 'AI-powered comprehensive HR platform designed specifically for Saudi companies'
              }
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild className="text-lg px-8 py-3">
              <LinkL to="/auth">{isArabic ? 'ابدأ الآن' : 'Get Started'}</LinkL>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              {isArabic ? 'شاهد العرض التوضيحي' : 'Watch Demo'}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">
            {isArabic ? 'لماذا تختار عقل HR؟' : 'Why Choose AqlHR?'}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isArabic 
              ? 'نوفر حلولاً متقدمة ومتكاملة لإدارة الموارد البشرية تتماشى مع رؤية المملكة 2030'
              : 'We provide advanced and integrated HR management solutions aligned with Saudi Vision 2030'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="text-3xl font-bold">
                {isArabic ? 'ابدأ رحلتك الرقمية اليوم' : 'Start Your Digital Journey Today'}
              </h3>
              <p className="text-lg text-muted-foreground">
                {isArabic 
                  ? 'انضم إلى آلاف الشركات التي تثق في منصتنا لإدارة مواردها البشرية بكفاءة وذكاء'
                  : 'Join thousands of companies that trust our platform to manage their human resources efficiently and intelligently'
                }
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <LinkL to="/auth">
                    <Globe className="mr-2 h-5 w-5" />
                    {isArabic ? 'الوصول إلى المنصة' : 'Access Platform'}
                  </LinkL>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-muted-foreground">
          <p>
            {isArabic 
              ? '© 2024 عقل HR. جميع الحقوق محفوظة.' 
              : '© 2024 AqlHR. All rights reserved.'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;