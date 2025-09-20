import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GraduationCap, Brain, Target, TrendingUp, Users, BookOpen } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function LEOPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const leoFeatures = [
    {
      icon: Brain,
      title: isArabic ? 'تحسين التعلّم بالذكاء الاصطناعي' : 'AI-Powered Learning Optimization',
      description: isArabic ? 'خوارزميات ذكية لتخصيص التجربة التعليمية' : 'Smart algorithms to personalize learning experiences'
    },
    {
      icon: Target,
      title: isArabic ? 'مسارات التعلّم المخصصة' : 'Personalized Learning Paths',
      description: isArabic ? 'مسارات تعليمية مصممة حسب احتياجات كل موظف' : 'Learning paths tailored to each employee\'s needs'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'تحليلات التقدّم' : 'Progress Analytics',
      description: isArabic ? 'مراقبة وتحليل تقدّم الموظفين في التعلّم' : 'Monitor and analyze employee learning progress'
    },
    {
      icon: Users,
      title: isArabic ? 'التعلّم التفاعلي' : 'Interactive Learning',
      description: isArabic ? 'أدوات تفاعلية لتحسين تجربة التعلّم' : 'Interactive tools to enhance learning experience'
    },
    {
      icon: BookOpen,
      title: isArabic ? 'مكتبة المحتوى' : 'Content Library',
      description: isArabic ? 'مكتبة شاملة من المواد التعليمية والدورات' : 'Comprehensive library of educational materials and courses'
    },
    {
      icon: GraduationCap,
      title: isArabic ? 'إدارة الشهادات' : 'Certification Management',
      description: isArabic ? 'تتبع وإدارة الشهادات والمؤهلات' : 'Track and manage certifications and qualifications'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'LEO - تحسين التجربة التعليمية' : 'LEO - Learning Experience Optimization'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'منصة متقدمة لتحسين التجربة التعليمية باستخدام الذكاء الاصطناعي والتحليلات المتقدمة'
            : 'Advanced platform for optimizing learning experiences using AI and advanced analytics'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {leoFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-blue-100">
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

      <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول لاستكشاف منصة LEO الكاملة'
            : '🔒 Login to explore the complete LEO platform'
          }
        </p>
      </div>
    </div>
  );
}