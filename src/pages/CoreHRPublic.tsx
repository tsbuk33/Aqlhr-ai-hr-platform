import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Clock, Calendar, Target, GraduationCap, Gift } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function CoreHRPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const modules = [
    {
      icon: Users,
      title: isArabic ? 'إدارة الموظفين' : 'Employee Management',
      description: isArabic ? 'نظام شامل لإدارة بيانات الموظفين والملفات الشخصية' : 'Comprehensive system for managing employee data and profiles'
    },
    {
      icon: Clock,
      title: isArabic ? 'الوقت والحضور' : 'Time & Attendance',
      description: isArabic ? 'تتبع ساعات العمل والحضور والانصراف' : 'Track work hours, check-ins, and check-outs'
    },
    {
      icon: Calendar,
      title: isArabic ? 'إدارة الإجازات' : 'Leave Management',
      description: isArabic ? 'إدارة طلبات الإجازات والأرصدة' : 'Manage leave requests and balances'
    },
    {
      icon: Target,
      title: isArabic ? 'إدارة الأداء' : 'Performance Management',
      description: isArabic ? 'تقييم الأداء ووضع الأهداف' : 'Performance evaluation and goal setting'
    },
    {
      icon: GraduationCap,
      title: isArabic ? 'التدريب والتطوير' : 'Training & Development',
      description: isArabic ? 'برامج التدريب وتطوير المهارات' : 'Training programs and skill development'
    },
    {
      icon: Gift,
      title: isArabic ? 'إدارة المزايا' : 'Benefits Administration',
      description: isArabic ? 'إدارة مزايا الموظفين والتأمينات' : 'Employee benefits and insurance management'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'الموارد البشرية الأساسية' : 'Core HR Systems'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'مجموعة شاملة من أنظمة الموارد البشرية الأساسية لإدارة جميع جوانب رأس المال البشري'
            : 'Comprehensive suite of core HR systems for managing all aspects of human capital'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
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
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? '🔒 يتطلب تسجيل الدخول للوصول إلى الميزات الكاملة'
                    : '🔒 Login required for full feature access'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">
          {isArabic ? 'الميزات المتقدمة' : 'Advanced Features'}
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ {isArabic ? 'تكامل مع 21+ بوابة حكومية سعودية' : 'Integration with 21+ Saudi government portals'}</li>
          <li>✓ {isArabic ? 'امتثال كامل لأنظمة العمل السعودية' : 'Full compliance with Saudi labor regulations'}</li>
          <li>✓ {isArabic ? 'تقارير تحليلية متقدمة' : 'Advanced analytics and reporting'}</li>
          <li>✓ {isArabic ? 'أتمتة سير العمل بالذكاء الاصطناعي' : 'AI-powered workflow automation'}</li>
        </ul>
      </div>
    </div>
  );
}