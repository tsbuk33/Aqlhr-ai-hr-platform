import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Sparkles, TrendingUp, Users, FileText } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
// Use demo tenant for now - replace with actual tenant context when available
import { supabase } from '@/integrations/supabase/client';

interface AIAssistantProps {
  module?: string;
  context?: string;
  placeholder?: string;
  suggestedActions?: string[];
}

export const EnhancedAIAssistant = ({ 
  module = 'general', 
  context = '',
  placeholder,
  suggestedActions = []
}: AIAssistantProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [automationScore, setAutomationScore] = useState<number | null>(null);

  const defaultSuggestedActions = [
    isArabic ? 'تحليل بيانات الموظفين' : 'Analyze employee data',
    isArabic ? 'إنشاء تقرير السعودة' : 'Generate Saudization report',
    isArabic ? 'مراجعة الامتثال' : 'Review compliance status',
    isArabic ? 'إدارة الرواتب' : 'Manage payroll'
  ];

  const actions = suggestedActions.length > 0 ? suggestedActions : defaultSuggestedActions;

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          prompt,
          context,
          module,
          action: 'chat',
          tenantId: 'demo-company' // Replace with actual tenant context
        }
      });

      if (error) throw error;
      
      setResponse(data.response);
      setAutomationScore(data.automation_score);
      setPrompt('');
    } catch (error) {
      console.error('AI Assistant error:', error);
      setResponse(isArabic ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedAction = (action: string) => {
    setPrompt(action);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            {isArabic ? 'مساعد أقل الذكي' : 'AqlHR AI Assistant'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'مساعدك الذكي لإدارة الموارد البشرية' : 'Your intelligent HR management assistant'}
          </p>
        </div>
        {automationScore && (
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            {automationScore}% {isArabic ? 'أتمتة' : 'Automation'}
          </Badge>
        )}
      </div>

      {/* Suggested Actions */}
      {actions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {isArabic ? 'إجراءات مقترحة:' : 'Suggested Actions:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedAction(action)}
                className="text-xs"
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder || (isArabic ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I help you today?')}
            className="flex-1"
            rows={2}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !prompt.trim()}
            size="icon"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Response Area */}
        {response && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Bot className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-sm leading-relaxed">{response}</p>
                {automationScore && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {isArabic ? 'مستوى الأتمتة:' : 'Automation Level:'} {automationScore}%
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary animate-pulse" />
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'جاري التفكير...' : 'Thinking...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Context Info */}
      {context && (
        <div className="text-xs text-muted-foreground border-t pt-2">
          {isArabic ? 'السياق:' : 'Context:'} {context} | {isArabic ? 'الوحدة:' : 'Module:'} {module}
        </div>
      )}
    </Card>
  );
};