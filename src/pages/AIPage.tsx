import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Bot, TrendingUp, Shield, Users } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';

const AIPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  const aiFeatures = [
    {
      title: isArabic ? 'محرك التوصيات الذكية' : 'Smart Recommendations Engine',
      description: isArabic ? 'نظام ذكي لتقديم توصيات مخصصة للموارد البشرية' : 'Intelligent system for personalized HR recommendations',
      icon: Brain,
      badge: 'AI Core'
    },
    {
      title: isArabic ? 'أتمتة سير العمل' : 'Workflow Automation',
      description: isArabic ? 'أتمتة العمليات الروتينية وتحسين الكفاءة' : 'Automate routine processes and improve efficiency',
      icon: Zap,
      badge: 'Automation'
    },
    {
      title: isArabic ? 'المساعد الذكي' : 'AI Assistant',
      description: isArabic ? 'مساعد ذكي للإجابة على استفسارات الموظفين' : 'Intelligent assistant for employee queries',
      icon: Bot,
      badge: 'Assistant'
    },
    {
      title: isArabic ? 'التحليل التنبؤي' : 'Predictive Analytics',
      description: isArabic ? 'تحليل البيانات للتنبؤ بالاتجاهات المستقبلية' : 'Data analysis for future trend prediction',
      icon: TrendingUp,
      badge: 'Analytics'
    },
    {
      title: isArabic ? 'الأمان المتقدم' : 'Advanced Security',
      description: isArabic ? 'حماية البيانات بتقنيات الذكاء الاصطناعي' : 'Data protection with AI technologies',
      icon: Shield,
      badge: 'Security'
    },
    {
      title: isArabic ? 'إدارة المواهب الذكية' : 'Smart Talent Management',
      description: isArabic ? 'إدارة وتطوير المواهب بذكاء اصطناعي' : 'AI-powered talent management and development',
      icon: Users,
      badge: 'Talent'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'منصة الذكاء الاصطناعي' : 'AI Platform'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'استكشف قوة الذكاء الاصطناعي في إدارة الموارد البشرية'
            : 'Explore the power of artificial intelligence in human resources management'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <feature.icon className="h-8 w-8 text-primary" />
                <Badge variant="secondary">{feature.badge}</Badge>
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <AqlHRAIAssistant moduleContext="ai.platform" />
    </div>
  );
};

export default AIPage;