import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserPlus, Search, FileText, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function RecruitmentPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const features = [
    {
      icon: Search,
      title: isArabic ? 'البحث عن المواهب' : 'Talent Sourcing',
      description: isArabic ? 'أدوات البحث المتقدمة للعثور على أفضل المرشحين' : 'Advanced search tools to find the best candidates'
    },
    {
      icon: FileText,
      title: isArabic ? 'إدارة طلبات التوظيف' : 'Application Management',
      description: isArabic ? 'تتبع وإدارة جميع طلبات التوظيف' : 'Track and manage all job applications'
    },
    {
      icon: CheckCircle,
      title: isArabic ? 'عملية الفرز والتقييم' : 'Screening & Assessment',
      description: isArabic ? 'أدوات تقييم المرشحين والمقابلات' : 'Candidate evaluation and interview tools'
    },
    {
      icon: Users,
      title: isArabic ? 'التعيين والإدماج' : 'Hiring & Onboarding',
      description: isArabic ? 'عملية سلسة للتعيين وإدماج الموظفين الجدد' : 'Seamless hiring and new employee onboarding'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'تحليلات التوظيف' : 'Recruitment Analytics',
      description: isArabic ? 'مقاييس الأداء وتحليلات عملية التوظيف' : 'Performance metrics and recruitment process analytics'
    },
    {
      icon: UserPlus,
      title: isArabic ? 'بوابة المرشحين' : 'Candidate Portal',
      description: isArabic ? 'بوابة المرشحين لتتبع حالة طلباتهم' : 'Candidate portal to track application status'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'التوظيف والتعيين' : 'Recruitment & Hiring'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'نظام متكامل للتوظيف من البحث عن المواهب حتى إدماج الموظفين الجدد'
            : 'Comprehensive recruitment system from talent sourcing to new employee onboarding'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              {isArabic ? '🤖 الذكاء الاصطناعي في التوظيف' : '🤖 AI-Powered Recruitment'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'فرز السير الذاتية بالذكاء الاصطناعي' : 'AI-powered resume screening'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'توصيات المرشحين الذكية' : 'Smart candidate recommendations'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'تحليل التطابق مع الوظائف' : 'Job matching analysis'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-xl text-secondary">
              {isArabic ? '🏛️ التكامل الحكومي' : '🏛️ Government Integration'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'تكامل مع منصة قوى' : 'Qiwa platform integration'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'إدارة تأشيرات العمل' : 'Work visa management'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {isArabic ? 'امتثال نطاقات السعودة' : 'Nitaqat compliance tracking'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى النظام الكامل مع جميع الميزات والتقارير'
            : '🔒 Login to access the full system with all features and reports'
          }
        </p>
      </div>
    </div>
  );
}