import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Key,
  Brain,
  Zap
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { supabase } from '@/integrations/supabase/client';

export const ManusAISetup: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [isInitializing, setIsInitializing] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStatus, setSetupStatus] = useState<string>('');

  const initializeKnowledgeBase = async () => {
    setIsInitializing(true);
    setSetupProgress(0);
    
    try {
      setSetupStatus(isArabic ? 'بدء فهرسة منصة عقل HR...' : 'Starting AqlHR platform indexing...');
      setSetupProgress(20);
      
      // Crawl current domain pages
      const currentDomain = window.location.origin;
      const { data, error } = await supabase.functions.invoke('aqlhr-knowledge-crawler', {
        body: {
          url: currentDomain,
          action: 'crawl',
          limit: 100
        }
      });
      
      if (error) throw new Error(error.message);
      
      setSetupStatus(isArabic ? 'جاري معالجة الصفحات...' : 'Processing pages...');
      setSetupProgress(60);
      
      // Wait and check status
      if (data.jobId) {
        setTimeout(async () => {
          const { data: statusData } = await supabase.functions.invoke('aqlhr-knowledge-crawler', {
            body: {
              action: 'status',
              jobId: data.jobId
            }
          });
          
          setSetupProgress(100);
          setSetupStatus(isArabic 
            ? `تم الانتهاء! تم فهرسة ${statusData?.completed || 0} صفحة`
            : `Completed! Indexed ${statusData?.completed || 0} pages`
          );
        }, 5000);
      }
      
    } catch (error) {
      console.error('Knowledge base initialization error:', error);
      setSetupStatus(isArabic 
        ? 'حدث خطأ في الفهرسة. يرجى المحاولة مرة أخرى.'
        : 'Indexing error occurred. Please try again.'
      );
    } finally {
      setTimeout(() => setIsInitializing(false), 3000);
    }
  };

  const apiRequirements = [
    {
      name: 'OpenAI API',
      description: isArabic ? 'للذكاء الاصطناعي العام وإنشاء الصور' : 'For general AI and image generation',
      required: true,
      status: 'configured'
    },
    {
      name: 'Anthropic Claude',
      description: isArabic ? 'للتحليل المتقدم والنصوص الطويلة' : 'For advanced analysis and long texts',
      required: false,
      status: 'optional'
    },
    {
      name: 'Google Gemini',
      description: isArabic ? 'للتحليل متعدد الوسائط' : 'For multimodal analysis',
      required: false,
      status: 'optional'
    },
    {
      name: 'Firecrawl API',
      description: isArabic ? 'لفهرسة صفحات المنصة' : 'For platform page indexing',
      required: true,
      status: 'needed'
    },
    {
      name: 'DeepSeek AI',
      description: isArabic ? 'للذكاء الاصطناعي المفتوح المصدر' : 'For open-source AI capabilities',
      required: false,
      status: 'optional'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {isArabic ? 'إعداد Manus AI المتقدم' : 'Advanced Manus AI Setup'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Knowledge Base Setup */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              {isArabic ? 'قاعدة المعرفة المتقدمة' : 'Advanced Knowledge Base'}
            </h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg">
              <p className="text-sm mb-4">
                {isArabic 
                  ? 'سيقوم Manus AI بفهرسة جميع صفحات منصة عقل HR لتوفير إجابات دقيقة حول كيفية استخدام المنصة ووحداتها.'
                  : 'Manus AI will index all AqlHR platform pages to provide accurate answers about platform usage and modules.'
                }
              </p>
              
              {isInitializing && (
                <div className="space-y-2 mb-4">
                  <Progress value={setupProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">{setupStatus}</p>
                </div>
              )}
              
              <Button 
                onClick={initializeKnowledgeBase}
                disabled={isInitializing}
                className="flex items-center gap-2"
              >
                {isInitializing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {isArabic ? 'بدء فهرسة المنصة' : 'Initialize Platform Knowledge'}
              </Button>
            </div>
          </div>

          {/* API Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Key className="h-4 w-4" />
              {isArabic ? 'متطلبات واجهات البرمجة' : 'API Requirements'}
            </h3>
            
            <div className="grid gap-3">
              {apiRequirements.map((api, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{api.name}</h4>
                      <Badge 
                        variant={api.required ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {api.required ? (isArabic ? 'مطلوب' : 'Required') : (isArabic ? 'اختياري' : 'Optional')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {api.status === 'configured' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : api.status === 'needed' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Globe className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {isArabic ? 'الميزات المتاحة' : 'Available Features'}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                  {isArabic ? '✅ متوفر حالياً' : '✅ Currently Available'}
                </h4>
                <ul className="text-sm space-y-1 text-green-600 dark:text-green-400">
                  <li>• {isArabic ? 'الذكاء الاصطناعي المتقدم' : 'Advanced AI Chat'}</li>
                  <li>• {isArabic ? 'إنشاء الصور' : 'Image Generation'}</li>
                  <li>• {isArabic ? 'العروض التقديمية' : 'Presentations'}</li>
                  <li>• {isArabic ? 'المستندات المهنية' : 'Professional Documents'}</li>
                  <li>• {isArabic ? 'المخططات البيانية' : 'Data Visualizations'}</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
                <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
                  {isArabic ? '🚀 مع إضافة المفاتيح' : '🚀 With Additional APIs'}
                </h4>
                <ul className="text-sm space-y-1 text-purple-600 dark:text-purple-400">
                  <li>• {isArabic ? 'فهرسة صفحات المنصة' : 'Platform Page Indexing'}</li>
                  <li>• {isArabic ? 'إجابات دقيقة عن المنصة' : 'Accurate Platform Answers'}</li>
                  <li>• {isArabic ? 'تحديثات من الإنترنت' : 'Internet Updates'}</li>
                  <li>• {isArabic ? 'تحليل متقدم' : 'Advanced Analysis'}</li>
                  <li>• {isArabic ? 'دعم متعدد اللغات' : 'Multilingual Support'}</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};