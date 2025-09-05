import React, { useEffect } from 'react';
import { useLanguage } from "@/hooks/useLanguageCompat";
import { AIOrchestrationController } from '@/components/ai/AIOrchestrationController';
import { ArabicNLPInterface } from '@/components/ai/ArabicNLPInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Cpu, Zap, Languages } from 'lucide-react';

const AIEngineTest = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  useEffect(() => {
    document.title = 'AqlHR AI Engine Test - Foundation Systems';
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'اختبار محرك الذكاء الاصطناعي' : 'AI Engine Foundation Test'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'اختبار وتقييم أنظمة الذكاء الاصطناعي الأساسية للمنصة'
            : 'Testing and validation of core AI foundation systems'
          }
        </p>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {isArabic ? 'حالة النظام' : 'System Status'}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? 'نظرة عامة على حالة مكونات الذكاء الاصطناعي الأساسية'
              : 'Overview of core AI component status'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span className="text-sm">AI Orchestration</span>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <span className="text-sm">Arabic NLP</span>
              </div>
              <Badge variant="default">Ready</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Decision Engine</span>
              </div>
              <Badge variant="default">Online</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIOrchestrationController />
        <ArabicNLPInterface />
      </div>

      {/* Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isArabic ? 'تعليمات الاختبار' : 'Testing Instructions'}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? 'كيفية اختبار مكونات الذكاء الاصطناعي المختلفة'
              : 'How to test the different AI components'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <p className="text-sm">
              <strong>AI Orchestration:</strong> Click "Start Orchestration" to activate autonomous workflow management.
            </p>
          </div>
          <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
            <p className="text-sm">
              <strong>Arabic NLP:</strong> Enter Arabic or English text to test language processing capabilities.
            </p>
          </div>
          <div className="p-3 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/20">
            <p className="text-sm">
              <strong>Decision Engine:</strong> Automated policy-based decisions are running in the background.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIEngineTest;