import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, Target, Smartphone } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

export function ExecutiveCenter() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  const executiveFeatures = [
    {
      id: 1,
      title: isArabic ? 'التحليلات التنفيذية' : 'Executive Analytics',
      description: isArabic ? 'رؤى متقدمة للقيادة العليا' : 'Advanced insights for senior leadership',
      icon: BarChart3,
      buttonText: isArabic ? 'فتح المركز التنفيذي' : 'Open Executive Center',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
    },
    {
      id: 2,
      title: isArabic ? 'الذكاء الاصطناعي المتقدم' : 'Advanced AI',
      description: isArabic ? 'تحليلات ذكية وتوصيات فورية' : 'Smart analytics and real-time recommendations',
      icon: Brain,
      buttonText: isArabic ? 'تفعيل الذكاء الاصطناعي' : 'Enable AI Assistant',
      color: 'text-orange-600',
      bgColor: 'bg-orange-600/10',
    },
    {
      id: 3,
      title: isArabic ? 'دعم اتخاذ القرارات' : 'Decision Support',
      description: isArabic ? 'دعم استراتيجي لاتخاذ القرارات' : 'Strategic decision-making support',
      icon: Target,
      buttonText: isArabic ? 'فتح مركز القرارات' : 'Open Decision Center',
      color: 'text-green-600',
      bgColor: 'bg-green-600/10',
    },
    {
      id: 4,
      title: isArabic ? 'تطبيق الموبايل التنفيذي' : 'Mobile Executive App',
      description: isArabic ? 'إدارة متنقلة للمدراء التنفيذيين' : 'Mobile management for executives',
      icon: Smartphone,
      buttonText: isArabic ? 'تحميل التطبيق' : 'Download App',
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10',
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`text-center ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center justify-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <Brain className="h-6 w-6 text-primary" />
            {isArabic ? 'المركز التنفيذي' : 'Executive Center'}
          </div>
        </CardTitle>
        <p className={`text-muted-foreground text-center ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic 
            ? 'أدوات وميزات متقدمة للقيادة التنفيذية'
            : 'Advanced tools and features for executive leadership'
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="executive-center-grid">
          {executiveFeatures.map((feature) => (
            <div key={feature.id} className="executive-feature-card">
              {/* Icon */}
              <div className={`executive-icon ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              
              {/* Content */}
              <h3 className="executive-title">
                {feature.title}
              </h3>
              <p className="executive-description">
                {feature.description}
              </p>
              
              {/* Button */}
              <Button 
                variant="default" 
                className="w-full footer-button-primary"
                size="sm"
              >
                {feature.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}