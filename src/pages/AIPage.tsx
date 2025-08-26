import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Bot, TrendingUp, Shield, Users, ArrowRight, Play } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';
import { AIToolsTester } from '@/components/ai/AIToolsTester';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AIPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const navigate = useNavigate();

  const handleFeatureClick = (featureType: string) => {
    const routes: Record<string, string> = {
      'AI Core': '/ai-automation/smart-recommendations',
      'Automation': '/ai-automation/workflow-automation',
      'Assistant': '/chat',
      'Analytics': '/analytics',
      'Security': '/compliance',
      'Talent': '/talent-management'
    };

    const route = routes[featureType];
    if (route) {
      navigate(route);
    } else {
      toast.success(
        isArabic 
          ? `تم تفعيل ميزة ${featureType}` 
          : `${featureType} feature activated`
      );
    }
  };

  const aiFeatures = [
    {
      title: isArabic ? 'محرك التوصيات الذكية' : 'Smart Recommendations Engine',
      description: isArabic ? 'نظام ذكي لتقديم توصيات مخصصة للموارد البشرية' : 'Intelligent system for personalized HR recommendations',
      icon: Brain,
      badge: 'AI Core',
      isActive: true
    },
    {
      title: isArabic ? 'أتمتة سير العمل' : 'Workflow Automation',
      description: isArabic ? 'أتمتة العمليات الروتينية وتحسين الكفاءة' : 'Automate routine processes and improve efficiency',
      icon: Zap,
      badge: 'Automation',
      isActive: true
    },
    {
      title: isArabic ? 'المساعد الذكي' : 'AI Assistant',
      description: isArabic ? 'مساعد ذكي للإجابة على استفسارات الموظفين' : 'Intelligent assistant for employee queries',
      icon: Bot,
      badge: 'Assistant',
      isActive: true
    },
    {
      title: isArabic ? 'التحليل التنبؤي' : 'Predictive Analytics',
      description: isArabic ? 'تحليل البيانات للتنبؤ بالاتجاهات المستقبلية' : 'Data analysis for future trend prediction',
      icon: TrendingUp,
      badge: 'Analytics',
      isActive: true
    },
    {
      title: isArabic ? 'الأمان المتقدم' : 'Advanced Security',
      description: isArabic ? 'حماية البيانات بتقنيات الذكاء الاصطناعي' : 'Data protection with AI technologies',
      icon: Shield,
      badge: 'Security',
      isActive: true
    },
    {
      title: isArabic ? 'إدارة المواهب الذكية' : 'Smart Talent Management',
      description: isArabic ? 'إدارة وتطوير المواهب بذكاء اصطناعي' : 'AI-powered talent management and development',
      icon: Users,
      badge: 'Talent',
      isActive: true
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
          <Card 
            key={index} 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
              feature.isActive ? 'hover:border-primary' : 'opacity-75'
            }`}
            onClick={() => handleFeatureClick(feature.badge)}
          >
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <feature.icon className={`h-8 w-8 transition-colors ${
                  feature.isActive ? 'text-primary group-hover:text-primary/80' : 'text-muted-foreground'
                }`} />
                <Badge 
                  variant={feature.isActive ? "default" : "secondary"}
                  className="group-hover:scale-105 transition-transform"
                >
                  {feature.badge}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </CardDescription>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full group-hover:bg-primary/10 transition-colors"
                disabled={!feature.isActive}
              >
                <Play className="h-4 w-4 mr-2" />
                {isArabic ? 'تفعيل' : 'Activate'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Tools Testing Section */}
      <div className="mt-8">
        <AIToolsTester moduleContext="ai.platform" />
      </div>
      
      <AqlHRAIAssistant moduleContext="ai.platform" />

      {/* Universal AI Integration */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="ai-platform" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'machine-learning']}
      />
    </div>
  );
};

export default AIPage;