import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAICore } from '@/hooks/useAICore';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Brain, Send, Loader2, MessageCircle, TrendingUp, Users, BarChart3 } from 'lucide-react';

interface AIQueryInterfaceProps {
  moduleContext?: string;
  companyId?: string;
  className?: string;
  onResponse?: (response: any) => void;
}

const AIQueryInterface: React.FC<AIQueryInterfaceProps> = ({
  moduleContext = 'general',
  companyId,
  className = '',
  onResponse
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { queryAI, loading, error } = useAICore();
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isArabic = language === 'ar';

  const quickQueries = [
    {
      icon: Users,
      text: isArabic ? 'ما هو معدل السعودة الحالي؟' : 'What is our current Saudization rate?',
      category: 'workforce'
    },
    {
      icon: TrendingUp,
      text: isArabic ? 'توقع معدل دوران الموظفين للربع القادم' : 'Predict turnover rate for next quarter',
      category: 'analytics'
    },
    {
      icon: BarChart3,
      text: isArabic ? 'كيف يمكن تحسين كفاءة التوظيف؟' : 'How can we improve hiring efficiency?',
      category: 'optimization'
    }
  ];

  const handleSubmit = async (queryText?: string) => {
    const finalQuery = queryText || query;
    if (!finalQuery.trim()) return;

    try {
      const response = await queryAI(finalQuery, {
        language: language as 'en' | 'ar',
        moduleContext,
        companyId,
        userId: 'current-user' // This should come from auth context
      });

      const newResponse = {
        id: Date.now(),
        query: finalQuery,
        response: response.ai_response,
        confidence_score: response.confidence_score,
        execution_time: response.execution_time_ms,
        timestamp: new Date(),
        recommendations: response.recommendations || []
      };

      setResponses(prev => [newResponse, ...prev]);
      setQuery('');
      onResponse?.(newResponse);

      toast({
        title: isArabic ? 'تم تحليل الاستفسار' : 'Query Analyzed',
        description: isArabic 
          ? `نسبة الثقة: ${Math.round(response.confidence_score * 100)}%`
          : `Confidence: ${Math.round(response.confidence_score * 100)}%`,
      });
    } catch (err) {
      toast({
        title: isArabic ? 'خطأ في التحليل' : 'Analysis Error',
        description: err instanceof Error ? err.message : 'Failed to process query',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main AI Query Interface */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {isArabic ? 'مساعد الذكاء الاصطناعي - مانوس' : 'Manus.im AI Assistant'}
            <Badge variant="secondary" className="ml-auto">
              {moduleContext}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Query Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {quickQueries.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start h-auto p-3 text-left"
                onClick={() => handleSubmit(item.text)}
                disabled={loading}
              >
                <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-xs">{item.text}</span>
              </Button>
            ))}
          </div>

          {/* Query Input */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isArabic 
                ? 'اسأل مانوس عن أي شيء متعلق بالموارد البشرية...'
                : 'Ask Manus anything about HR operations...'
              }
              className="min-h-[80px] pr-12 resize-none"
              dir={isArabic ? 'rtl' : 'ltr'}
              disabled={loading}
            />
            <Button
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {error && (
            <div className="text-sm text-status-danger bg-status-danger/10 p-3 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response History */}
      {responses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {isArabic ? 'تاريخ التحليلات' : 'Analysis History'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded 
                  ? (isArabic ? 'إخفاء' : 'Collapse')
                  : (isArabic ? 'عرض المزيد' : 'Expand')
                }
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {responses.slice(0, isExpanded ? responses.length : 2).map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 space-y-3"
              >
                {/* Query */}
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium text-muted-foreground">
                    {isArabic ? 'السؤال:' : 'Query:'}
                  </p>
                  <p className="text-sm mt-1" dir={isArabic ? 'rtl' : 'ltr'}>
                    {item.query}
                  </p>
                </div>

                {/* Response */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {isArabic ? 'التحليل:' : 'Analysis:'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={item.confidence_score > 0.8 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {Math.round(item.confidence_score * 100)}% {isArabic ? 'ثقة' : 'confidence'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.execution_time}ms
                      </span>
                    </div>
                  </div>
                  <div className="text-sm leading-relaxed" dir={isArabic ? 'rtl' : 'ltr'}>
                    {item.response}
                  </div>
                </div>

                {/* Recommendations */}
                {item.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {isArabic ? 'التوصيات:' : 'Recommendations:'}
                    </p>
                    <div className="space-y-2">
                      {item.recommendations.map((rec: any, index: number) => (
                        <div
                          key={index}
                          className="bg-primary/5 p-3 rounded-md border border-primary/20"
                        >
                          <h4 className="text-sm font-medium">
                            {isArabic ? rec.title_ar || rec.title : rec.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isArabic ? rec.description_ar || rec.description : rec.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  {item.timestamp.toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIQueryInterface;