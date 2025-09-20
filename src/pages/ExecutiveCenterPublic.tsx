import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Building2, TrendingUp, Users, Target, Brain, Shield } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function ExecutiveCenterPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const executiveModules = [
    {
      icon: TrendingUp,
      title: isArabic ? 'التحليلات الاستراتيجية' : 'Strategic Analytics',
      description: isArabic ? 'رؤى استراتيجية لدعم القرارات التنفيذية' : 'Strategic insights for executive decision making'
    },
    {
      icon: Users,
      title: isArabic ? 'لوحة القيادة التنفيذية' : 'Executive Dashboard',
      description: isArabic ? 'مؤشرات الأداء الرئيسية والمقاييس التنفيذية' : 'Key performance indicators and executive metrics'
    },
    {
      icon: Target,
      title: isArabic ? 'إدارة الأهداف الاستراتيجية' : 'Strategic Goal Management',
      description: isArabic ? 'تتبع وإدارة الأهداف الاستراتيجية للمؤسسة' : 'Track and manage organizational strategic goals'
    },
    {
      icon: Brain,
      title: isArabic ? 'ذكاء الأعمال المتقدم' : 'Advanced Business Intelligence',
      description: isArabic ? 'تحليلات متقدمة وذكاء اصطناعي للقرارات' : 'Advanced analytics and AI for decision making'
    },
    {
      icon: Shield,
      title: isArabic ? 'إدارة المخاطر التنفيذية' : 'Executive Risk Management',
      description: isArabic ? 'تحديد وإدارة المخاطر على المستوى التنفيذي' : 'Identify and manage risks at executive level'
    },
    {
      icon: Building2,
      title: isArabic ? 'التخطيط التنظيمي' : 'Organizational Planning',
      description: isArabic ? 'تخطيط الهيكل التنظيمي والموارد البشرية' : 'Organizational structure and workforce planning'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'مركز متقدم للذكاء التنفيذي يوفر تحليلات استراتيجية ودعم اتخاذ القرارات للقيادة العليا'
            : 'Advanced executive intelligence center providing strategic analytics and decision support for senior leadership'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {executiveModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                  <module.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {module.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى مركز الذكاء التنفيذي الكامل'
            : '🔒 Login to access the complete Executive Intelligence Center'
          }
        </p>
      </div>
    </div>
  );
}