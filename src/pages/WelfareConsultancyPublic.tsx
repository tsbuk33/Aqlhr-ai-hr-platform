import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heart, Shield, Users, Activity, Home, Smile } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function WelfareConsultancyPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const welfareFeatures = [
    {
      icon: Heart,
      title: isArabic ? 'برامج الرفاهية' : 'Wellness Programs',
      description: isArabic ? 'برامج شاملة لتحسين رفاهية الموظفين' : 'Comprehensive programs to improve employee wellness'
    },
    {
      icon: Shield,
      title: isArabic ? 'السلامة المهنية' : 'Occupational Safety',
      description: isArabic ? 'إدارة وضمان السلامة في بيئة العمل' : 'Manage and ensure workplace safety'
    },
    {
      icon: Users,
      title: isArabic ? 'الدعم النفسي' : 'Psychological Support',
      description: isArabic ? 'خدمات الدعم النفسي والاستشارة' : 'Psychological support and counseling services'
    },
    {
      icon: Activity,
      title: isArabic ? 'برامج الصحة' : 'Health Programs',
      description: isArabic ? 'برامج اللياقة البدنية والصحة العامة' : 'Fitness and general health programs'
    },
    {
      icon: Home,
      title: isArabic ? 'التوازن بين العمل والحياة' : 'Work-Life Balance',
      description: isArabic ? 'استراتيجيات تحسين التوازن بين العمل والحياة' : 'Strategies to improve work-life balance'
    },
    {
      icon: Smile,
      title: isArabic ? 'قياس الرضا' : 'Satisfaction Measurement',
      description: isArabic ? 'أدوات قياس رضا الموظفين ورفاهيتهم' : 'Tools to measure employee satisfaction and wellbeing'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'استشارات رفاهية الموظفين' : 'Employee Welfare Consultancy'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'خدمات استشارية متخصصة لتحسين رفاهية الموظفين وبيئة العمل الصحية'
            : 'Specialized consultancy services to improve employee welfare and healthy work environment'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {welfareFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
                  <feature.icon className="h-6 w-6 text-green-600" />
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

      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى خدمات الاستشارة الكاملة'
            : '🔒 Login to access complete consultancy services'
          }
        </p>
      </div>
    </div>
  );
}