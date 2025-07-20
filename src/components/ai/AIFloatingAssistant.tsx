import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAICore } from '@/hooks/useAICore';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Brain, 
  Mic, 
  MicOff,
  Maximize2,
  Minimize2,
  X,
  TrendingUp,
  Users,
  BarChart3,
  Download,
  Volume2
} from 'lucide-react';

interface AIFloatingAssistantProps {
  moduleContext?: string;
  companyId?: string;
  currentPageData?: any;
}

const AIFloatingAssistant: React.FC<AIFloatingAssistantProps> = ({
  moduleContext = 'general',
  companyId = 'demo-company',
  currentPageData
}) => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const { queryAI, loading } = useAICore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const isArabic = language === 'ar';

  // Module name translations
  const getModuleNameArabic = (context: string) => {
    const moduleNames: Record<string, string> = {
      'executive': 'تنفيذي',
      'workforce_planning': 'تخطيط القوى العاملة',
      'recruitment': 'التوظيف',
      'performance': 'الأداء',
      'health_safety': 'الصحة والسلامة',
      'payroll': 'الرواتب',
      'employees': 'الموظفين',
      'government': 'حكومي',
      'strategic': 'استراتيجي',
      'general': 'عام'
    };
    return moduleNames[context] || context;
  };

  // Smart suggestions based on module context
  const getContextualSuggestions = () => {
    const suggestions: Record<string, string[]> = {
      'executive': [
        isArabic ? 'ما هي التوقعات الاستراتيجية للربع القادم؟' : 'What are the strategic forecasts for next quarter?',
        isArabic ? 'تحليل المخاطر الحالية للمنظمة' : 'Analyze current organizational risks',
        isArabic ? 'توصيات لتحسين الأداء التنفيذي' : 'Recommendations for executive performance improvement'
      ],
      'workforce_planning': [
        isArabic ? 'توقع احتياجات التوظيف للـ 6 أشهر القادمة' : 'Predict hiring needs for next 6 months',
        isArabic ? 'تحليل فجوات المهارات في الفرق' : 'Analyze skills gaps in teams',
        isArabic ? 'تحسين توزيع الموظفين على المشاريع' : 'Optimize employee allocation across projects'
      ],
      'recruitment': [
        isArabic ? 'تقييم المرشحين بالذكاء الاصطناعي' : 'AI candidate assessment',
        isArabic ? 'تحليل التوافق الثقافي للمرشحين' : 'Analyze cultural fit for candidates',
        isArabic ? 'توقع نجاح التوظيف' : 'Predict hiring success'
      ],
      'performance': [
        isArabic ? 'توقع الأداء للـ 6 أشهر القادمة' : 'Predict performance for next 6 months',
        isArabic ? 'إنذار مبكر لمخاطر الأداء' : 'Early warning for performance risks',
        isArabic ? 'خطط التطوير الشخصية' : 'Personalized development plans'
      ],
      'health_safety': [
        isArabic ? 'تحليل مخاطر السلامة الحالية' : 'Analyze current safety risks',
        isArabic ? 'توصيات لتحسين بيئة العمل' : 'Recommendations for workplace improvement',
        isArabic ? 'مراقبة الامتثال للوائح' : 'Monitor regulatory compliance'
      ]
    };

    return suggestions[moduleContext] || [
      isArabic ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I help you today?',
      isArabic ? 'عرض تحليل البيانات' : 'Show data analysis',
      isArabic ? 'إنشاء تقرير' : 'Generate report'
    ];
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = isArabic ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: isArabic ? 'خطأ في التعرف على الصوت' : 'Voice Recognition Error',
          description: isArabic ? 'فشل في التعرف على الصوت' : 'Failed to recognize speech',
          variant: 'destructive',
        });
      };
    }
  }, [isArabic, toast]);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      toast({
        title: isArabic ? 'غير مدعوم' : 'Not Supported',
        description: isArabic ? 'التعرف على الصوت غير مدعوم في هذا المتصفح' : 'Voice recognition not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (queryText?: string) => {
    const finalQuery = queryText || query;
    if (!finalQuery.trim()) return;

    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: finalQuery,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuery('');

    try {
      const response = await queryAI(finalQuery, {
        language: language as 'en' | 'ar',
        moduleContext,
        companyId,
        userId: 'current-user'
      });

      // Add AI response to conversation
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.ai_response,
        confidence_score: response.confidence_score,
        execution_time: response.execution_time_ms,
        recommendations: response.recommendations || [],
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);

      // Show success notification
      toast({
        title: isArabic ? 'تم التحليل' : 'Analysis Complete',
        description: isArabic 
          ? `ثقة: ${Math.round(response.confidence_score * 100)}%`
          : `Confidence: ${Math.round(response.confidence_score * 100)}%`,
      });

    } catch (error) {
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: error instanceof Error ? error.message : 'AI query failed',
        variant: 'destructive',
      });
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isArabic ? 'ar-SA' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const exportConversation = () => {
    const conversationText = conversation.map(msg => 
      `${msg.type === 'user' ? (isArabic ? 'المستخدم' : 'User') : (isArabic ? 'مانوس' : 'AI')}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <Brain className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${isRTL ? 'bottom-6 left-6' : 'bottom-6 right-6'} z-50 ${isExpanded ? 'w-96 h-[600px]' : 'w-80 h-96'} transition-all duration-300`}>
      <Card className="h-full flex flex-col shadow-2xl border-primary/20" dir={isRTL ? 'rtl' : 'ltr'}>
        <CardHeader className="pb-3 border-b">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Brain className="h-4 w-4 text-primary" />
              {isArabic ? 'مساعد مانوس الذكي' : 'Manus AI Assistant'}
              <Badge variant="secondary" className="text-xs">
                {isArabic ? getModuleNameArabic(moduleContext) : moduleContext}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 space-y-4">
          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {conversation.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Brain className="h-8 w-8 mx-auto mb-3 text-primary/50" />
                <p className="text-sm">
                  {isArabic ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I help you today?'}
                </p>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {getContextualSuggestions().slice(0, 2).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto p-2 text-left justify-start"
                      onClick={() => handleSubmit(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              conversation.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.type === 'ai' && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(message.confidence_score * 100)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {message.execution_time}ms
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => speakResponse(message.content)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {conversation.length > 0 && (
            <div className="flex gap-2 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportConversation}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                {isArabic ? 'تصدير' : 'Export'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConversation([])}
                className="text-xs"
              >
                {isArabic ? 'مسح' : 'Clear'}
              </Button>
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isArabic 
                  ? 'اسأل مانوس عن أي شيء...'
                  : 'Ask Manus anything...'
                }
                className="min-h-[60px] pr-20 resize-none"
                dir={isArabic ? 'rtl' : 'ltr'}
                disabled={loading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="absolute bottom-2 right-2 flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={toggleVoiceRecognition}
                  disabled={loading}
                >
                  {isListening ? (
                    <MicOff className="h-3 w-3 text-red-500" />
                  ) : (
                    <Mic className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleSubmit()}
                  disabled={loading || !query.trim()}
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex gap-1 flex-wrap">
              {getContextualSuggestions().slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => setQuery(suggestion)}
                  disabled={loading}
                >
                  {suggestion.length > 25 ? `${suggestion.slice(0, 25)}...` : suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFloatingAssistant;