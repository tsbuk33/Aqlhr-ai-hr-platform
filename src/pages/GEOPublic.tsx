import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, MessageCircle, TrendingUp, Users, Zap } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function GEOPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const geoFeatures = [
    {
      icon: Sparkles,
      title: isArabic ? 'تحسين المشاركة التوليدية' : 'Generative Engagement Optimization',
      description: isArabic ? 'خوارزميات ذكية لتحسين مشاركة الموظفين' : 'Smart algorithms to optimize employee engagement'
    },
    {
      icon: Heart,
      title: isArabic ? 'قياس الرضا الوظيفي' : 'Job Satisfaction Measurement',
      description: isArabic ? 'أدوات متقدمة لقياس وتحليل رضا الموظفين' : 'Advanced tools to measure and analyze employee satisfaction'
    },
    {
      icon: MessageCircle,
      title: isArabic ? 'تحليل التفاعل' : 'Interaction Analysis',
      description: isArabic ? 'تحليل أنماط التفاعل والتواصل في المؤسسة' : 'Analyze interaction and communication patterns in the organization'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'تحليلات المشاركة' : 'Engagement Analytics',
      description: isArabic ? 'رؤى متعمقة حول مستويات مشاركة الموظفين' : 'Deep insights into employee engagement levels'
    },
    {
      icon: Users,
      title: isArabic ? 'إدارة الفرق' : 'Team Management',
      description: isArabic ? 'أدوات لتحسين ديناميكيات الفريق والتعاون' : 'Tools to improve team dynamics and collaboration'
    },
    {
      icon: Zap,
      title: isArabic ? 'التحفيز الذكي' : 'Smart Motivation',
      description: isArabic ? 'نظام ذكي لتحفيز الموظفين وزيادة الإنتاجية' : 'Smart system to motivate employees and increase productivity'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'GEO - تحسين المشاركة التوليدية' : 'GEO - Generative Engagement Optimization'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'منصة متقدمة لتحسين مشاركة الموظفين باستخدام التقنيات التوليدية والذكاء الاصطناعي'
            : 'Advanced platform for optimizing employee engagement using generative technologies and AI'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {geoFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-secondary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                  <feature.icon className="h-6 w-6 text-purple-600" />
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

      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول لاستكشاف منصة GEO الكاملة'
            : '🔒 Login to explore the complete GEO platform'
          }
        </p>
      </div>
    </div>
  );
}