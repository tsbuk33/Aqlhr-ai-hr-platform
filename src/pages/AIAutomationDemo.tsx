import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedAIAssistant } from '@/components/ai/EnhancedAIAssistant';
import { AutomationMetricsDashboard } from '@/components/automation/AutomationMetricsDashboard';
import { Bot, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';

export const AIAutomationDemo = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const suggestedActions = [
    isArabic ? 'حلل أداء فريق المبيعات' : 'Analyze sales team performance',
    isArabic ? 'أنشئ تقرير السعودة الشهري' : 'Generate monthly Saudization report', 
    isArabic ? 'راجع حالة الامتثال للأنظمة' : 'Review regulatory compliance status',
    isArabic ? 'احسب مكافآت نهاية السنة' : 'Calculate year-end bonuses',
    isArabic ? 'تحديث بيانات موظفي الحكومة' : 'Sync government employee data'
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <div className="p-3 bg-secondary/10 rounded-full">
            <Zap className="h-8 w-8 text-secondary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">
          {isArabic ? 'مساعد أقل الذكي مع مقاييس الأتمتة' : 'AqlHR AI Assistant with Automation Metrics'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isArabic 
            ? 'اكتشف قوة الذكاء الاصطناعي في إدارة الموارد البشرية مع تتبع مقاييس الأتمتة في الوقت الفعلي'
            : 'Experience the power of AI-driven HR management with real-time automation metrics tracking'
          }
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            {isArabic ? 'مدعوم بـ Hugging Face' : 'Powered by Hugging Face'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            {isArabic ? 'مقاييس لحظية' : 'Real-time Metrics'}
          </Badge>
        </div>
      </div>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Assistant Demo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {isArabic ? 'المساعد الذكي' : 'AI Assistant Demo'}
            </h2>
          </div>
          <EnhancedAIAssistant 
            module="demo"
            context={isArabic ? 'عرض توضيحي لمساعد أقل الذكي' : 'AqlHR AI Assistant Demo'}
            placeholder={isArabic ? 'جرب سؤالاً عن إدارة الموارد البشرية...' : 'Try asking about HR management...'}
            suggestedActions={suggestedActions}
          />
          
          {/* Feature Highlights */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">
              {isArabic ? 'الميزات الرئيسية:' : 'Key Features:'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                {isArabic ? 'معالجة اللغة الطبيعية بالعربية والإنجليزية' : 'Natural language processing in Arabic & English'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                {isArabic ? 'متخصص في الأنظمة السعودية (قوى، جوسي، أبشر)' : 'Saudi regulations expert (Qiwa, GOSI, Absher)'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                {isArabic ? 'إجراءات مقترحة ذكية' : 'Smart suggested actions'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                {isArabic ? 'تتبع نقاط الأتمتة' : 'Automation scoring'}
              </li>
            </ul>
          </Card>
        </div>

        {/* Automation Metrics Demo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {isArabic ? 'مقاييس الأتمتة' : 'Automation Metrics'}
            </h2>
          </div>
          <AutomationMetricsDashboard 
            tenantId="demo-company"
            days={30}
          />

          {/* Metrics Info */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">
              {isArabic ? 'ما يتم قياسه:' : 'What We Track:'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-secondary rounded-full"></div>
                {isArabic ? 'إجمالي أوامر الذكاء الاصطناعي' : 'Total AI commands executed'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-secondary rounded-full"></div>
                {isArabic ? 'معدل نجاح الأتمتة' : 'Automation success rate'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-secondary rounded-full"></div>
                {isArabic ? 'نقاط جودة الاستجابة' : 'Response quality scores'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-secondary rounded-full"></div>
                {isArabic ? 'الإجراءات الأكثر استخداماً' : 'Most used automated actions'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-secondary rounded-full"></div>
                {isArabic ? 'اتجاهات الأداء اليومية' : 'Daily performance trends'}
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {isArabic ? 'كيفية الاستخدام:' : 'How to Use:'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">{isArabic ? '1. جرب الإجراءات المقترحة' : '1. Try Suggested Actions'}</h4>
            <p className="text-muted-foreground">
              {isArabic ? 'انقر على أي من الأزرار المقترحة أعلاه لبدء محادثة' : 'Click any suggested action button to start a conversation'}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">{isArabic ? '2. اطرح أسئلة مخصصة' : '2. Ask Custom Questions'}</h4>
            <p className="text-muted-foreground">
              {isArabic ? 'اكتب سؤالك باللغة العربية أو الإنجليزية' : 'Type your question in Arabic or English'}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">{isArabic ? '3. راقب نقاط الأتمتة' : '3. Monitor Automation Scores'}</h4>
            <p className="text-muted-foreground">
              {isArabic ? 'شاهد كيف يحسن الذكاء الاصطناعي من كفاءة عملك' : 'See how AI improves your workflow efficiency'}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">{isArabic ? '4. تتبع المقاييس' : '4. Track Metrics'}</h4>
            <p className="text-muted-foreground">
              {isArabic ? 'راجع لوحة المقاييس لقياس تأثير الأتمتة' : 'Review the metrics dashboard for automation impact'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};