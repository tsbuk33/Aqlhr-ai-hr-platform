import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, Users, BarChart3, Award, Calendar } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function PerformancePublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const performanceFeatures = [
    {
      icon: Target,
      title: isArabic ? 'إدارة الأهداف' : 'Goal Management',
      description: isArabic ? 'وضع ومتابعة أهداف الموظفين والفرق' : 'Set and track employee and team goals'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'تقييم الأداء' : 'Performance Reviews',
      description: isArabic ? 'عمليات تقييم دورية وشاملة للأداء' : 'Regular and comprehensive performance evaluations'
    },
    {
      icon: Users,
      title: isArabic ? 'تطوير الموظفين' : 'Employee Development',
      description: isArabic ? 'خطط التطوير والنمو المهني' : 'Development and career growth plans'
    },
    {
      icon: BarChart3,
      title: isArabic ? 'تحليلات الأداء' : 'Performance Analytics',
      description: isArabic ? 'تحليلات متقدمة لمؤشرات الأداء' : 'Advanced analytics for performance indicators'
    },
    {
      icon: Award,
      title: isArabic ? 'نظام المكافآت' : 'Rewards System',
      description: isArabic ? 'إدارة المكافآت والتقدير' : 'Manage rewards and recognition'
    },
    {
      icon: Calendar,
      title: isArabic ? 'التقييم المستمر' : 'Continuous Assessment',
      description: isArabic ? 'تقييم مستمر ومتابعة دورية' : 'Continuous evaluation and regular follow-up'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'إدارة الأداء' : 'Performance Management'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'نظام شامل لإدارة وتقييم أداء الموظفين مع مؤشرات الأداء الرئيسية والتقييمات'
            : 'Comprehensive system for managing and evaluating employee performance with KPIs and reviews'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {performanceFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
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

      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى نظام إدارة الأداء الكامل'
            : '🔒 Login to access the complete Performance Management system'
          }
        </p>
      </div>
    </div>
  );
}