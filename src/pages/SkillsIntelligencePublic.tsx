import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Brain, Target, TrendingUp, Users, BookOpen, Zap } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function SkillsIntelligencePublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const skillsFeatures = [
    {
      icon: Brain,
      title: isArabic ? 'خريطة المهارات الذكية' : 'Intelligent Skills Mapping',
      description: isArabic ? 'تحليل شامل لمهارات الموظفين والفجوات' : 'Comprehensive analysis of employee skills and gaps'
    },
    {
      icon: Target,
      title: isArabic ? 'تحليل الفجوات' : 'Gap Analysis',
      description: isArabic ? 'تحديد الفجوات في المهارات ووضع خطط التطوير' : 'Identify skill gaps and create development plans'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'التنبؤ بالمهارات المستقبلية' : 'Future Skills Prediction',
      description: isArabic ? 'توقع المهارات المطلوبة في المستقبل' : 'Predict future skill requirements'
    },
    {
      icon: Users,
      title: isArabic ? 'مطابقة المواهب' : 'Talent Matching',
      description: isArabic ? 'مطابقة المهارات مع متطلبات المناصب' : 'Match skills with job requirements'
    },
    {
      icon: BookOpen,
      title: isArabic ? 'مسارات التطوير' : 'Development Pathways',
      description: isArabic ? 'مسارات مخصصة لتطوير المهارات' : 'Customized pathways for skill development'
    },
    {
      icon: Zap,
      title: isArabic ? 'تحسين الأداء' : 'Performance Enhancement',
      description: isArabic ? 'ربط المهارات بمؤشرات الأداء' : 'Link skills to performance indicators'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'ذكاء المهارات' : 'Skills Intelligence'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'منصة متقدمة لتحليل المهارات وخرائط التطوير المهني باستخدام الذكاء الاصطناعي'
            : 'Advanced platform for skills analysis and professional development mapping using AI'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {skillsFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                  <feature.icon className="h-6 w-6 text-blue-600" />
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

      <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول لاستكشاف منصة ذكاء المهارات الكاملة'
            : '🔒 Login to explore the complete Skills Intelligence platform'
          }
        </p>
      </div>
    </div>
  );
}