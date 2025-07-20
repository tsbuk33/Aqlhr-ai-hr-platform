import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  MessageCircle, 
  Send, 
  Trash2, 
  Minimize2, 
  Maximize2, 
  Bot,
  Lightbulb,
  TrendingUp,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface AqlHRAIAssistantProps {
  moduleContext?: string;
  companyId?: string;
  position?: 'fixed' | 'static';
  className?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  module?: string;
}

export const AqlHRAIAssistant: React.FC<AqlHRAIAssistantProps> = ({ 
  moduleContext = 'default',
  companyId,
  position = 'fixed',
  className = ''
}) => {
  const { isArabic } = useSimpleLanguage();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Contextual greetings with correct Arabic branding
  const contextualGreetings = {
    'executive': {
      ar: 'مرحباً! أنا مساعدك الذكي في مركز الذكاء التنفيذي عقل HR. كيف يمكنني مساعدتك في اتخاذ القرارات الاستراتيجية؟',
      en: 'Hello! I\'m your AI assistant for AqlHR Executive Intelligence Center. How can I help you make strategic decisions?'
    },
    'employees': {
      ar: 'مرحباً! كيف يمكنني مساعدتك في إدارة بيانات الموظفين في منصة عقل HR؟',
      en: 'Hello! How can I help you with employee management in AqlHR platform?'
    },
    'payroll': {
      ar: 'أهلاً! هل تحتاج مساعدة في معالجة الرواتب عبر نظام عقل HR؟',
      en: 'Hi! Need help with payroll processing in AqlHR system?'
    },
    'government': {
      ar: 'مرحباً! كيف يمكنني مساعدتك في التكامل الحكومي لمنصة عقل HR؟',
      en: 'Hello! How can I assist with government integrations in AqlHR platform?'
    },
    'analytics': {
      ar: 'مرحباً! أنا هنا لمساعدتك في التحليلات والذكاء الاصطناعي في عقل HR. ما الذي تريد تحليله؟',
      en: 'Hello! I\'m here to help with analytics and AI intelligence in AqlHR. What would you like to analyze?'
    },
    'core-hr': {
      ar: 'مرحباً! كيف يمكنني مساعدتك في وحدات الموارد البشرية الأساسية في عقل HR؟',
      en: 'Hello! How can I help you with Core HR modules in AqlHR?'
    },
    'default': {
      ar: 'مرحباً! أنا مساعدك الذكي في منصة عقل HR. كيف يمكنني مساعدتك اليوم؟',
      en: 'Hello! I\'m your AI assistant for AqlHR platform. How can I help you today?'
    }
  };

  // AI suggestions based on context
  const getContextualSuggestions = () => {
    const suggestions = {
      'executive': {
        ar: [
          'اعرض التحليلات التنفيذية لهذا الشهر',
          'ما هي التوصيات الاستراتيجية الجديدة؟',
          'أظهر حالة التكامل الحكومي',
          'تحليل مؤشرات الأداء الرئيسية'
        ],
        en: [
          'Show executive analytics for this month',
          'What are the new strategic recommendations?',
          'Display government integration status',
          'Analyze key performance indicators'
        ]
      },
      'employees': {
        ar: [
          'إضافة موظف جديد',
          'البحث عن سجلات الموظفين',
          'تحديث بيانات الموظف',
          'تقارير الموظفين'
        ],
        en: [
          'Add new employee',
          'Search employee records',
          'Update employee data',
          'Employee reports'
        ]
      },
      'default': {
        ar: [
          'ما الجديد في عقل HR؟',
          'كيف يمكنني استخدام الذكاء الاصطناعي؟',
          'اعرض الميزات المتاحة',
          'مساعدة في التنقل'
        ],
        en: [
          'What\'s new in AqlHR?',
          'How can I use AI features?',
          'Show available features',
          'Help with navigation'
        ]
      }
    };

    return suggestions[moduleContext as keyof typeof suggestions] || suggestions.default;
  };

  // System messages with correct branding
  const systemMessages = {
    welcome: {
      ar: 'مرحباً بك في مساعد عقل HR الذكي! أنا هنا لمساعدتك في جميع احتياجاتك المتعلقة بالموارد البشرية.',
      en: 'Welcome to AqlHR AI Assistant! I\'m here to help you with all your HR needs.'
    },
    processing: {
      ar: 'جاري معالجة طلبك في نظام عقل HR...',
      en: 'Processing your request in AqlHR system...'
    },
    error: {
      ar: 'عذراً، حدث خطأ في الاتصال بخوادم عقل HR. يرجى المحاولة مرة أخرى.',
      en: 'Sorry, there was an error connecting to AqlHR servers. Please try again.'
    }
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      type: 'assistant',
      content: (contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings.default)[isArabic ? 'ar' : 'en'],
      timestamp: new Date(),
      module: moduleContext
    };
    setMessages([welcomeMessage]);
  }, [moduleContext, isArabic]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with correct branding
    setTimeout(() => {
      const responses = {
        ar: [
          `شكراً لسؤالك. دعني أساعدك في ذلك عبر نظام عقل HR المتطور.`,
          `أفهم احتياجك. سأقوم بتحليل البيانات في عقل HR وأعود إليك بالنتائج.`,
          `ممتاز! يمكنني مساعدتك في هذا الأمر باستخدام قدرات الذكاء الاصطناعي في عقل HR.`,
          `تم فهم طلبك. سأستخدم محرك التحليل الذكي في عقل HR لإعطائك أفضل النتائج.`
        ],
        en: [
          `Thank you for your question. Let me help you with that through the advanced AqlHR system.`,
          `I understand your need. I'll analyze the data in AqlHR and get back to you with results.`,
          `Excellent! I can help you with this using AqlHR's AI capabilities.`,
          `Request understood. I'll use AqlHR's intelligent analysis engine to give you the best results.`
        ]
      };

      const randomResponse = responses[isArabic ? 'ar' : 'en'][Math.floor(Math.random() * responses[isArabic ? 'ar' : 'en'].length)];

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
        module: moduleContext
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleClearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-new',
      type: 'assistant',
      content: (contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings.default)[isArabic ? 'ar' : 'en'],
      timestamp: new Date(),
      module: moduleContext
    };
    setMessages([welcomeMessage]);
  };

  const baseClasses = position === 'fixed' 
    ? 'fixed bottom-6 right-6 z-50 w-96 max-h-[600px]' 
    : 'w-full max-w-md mx-auto';

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className={`${position === 'fixed' ? 'fixed bottom-6 right-6 z-50' : ''} ${className} bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full w-16 h-16 p-0`}
      >
        <Bot className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Card className={`${baseClasses} ${className} ${isArabic ? 'rtl' : 'ltr'} shadow-2xl border-brand-primary/20 bg-background/95 backdrop-blur-md`} dir={isArabic ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-brand-primary animate-pulse" />
            {isArabic ? 'مساعد عقل HR الذكي' : 'AqlHR AI Assistant'}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-8 w-8"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="p-1 h-8 w-8"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-brand-success/10 text-brand-success text-xs">
            <div className="w-2 h-2 bg-brand-success rounded-full mr-1 animate-pulse"></div>
            {isArabic ? 'متصل بعقل HR' : 'Connected to AqlHR'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {moduleContext === 'default' ? (isArabic ? 'عام' : 'General') : moduleContext}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className={`space-y-3 ${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-y-auto scrollbar-thin scrollbar-thumb-brand-primary/20`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? (isArabic ? 'justify-start' : 'justify-end') : (isArabic ? 'justify-end' : 'justify-start')}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-brand-primary text-white'
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`flex ${isArabic ? 'justify-end' : 'justify-start'}`}>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">{systemMessages.processing[isArabic ? 'ar' : 'en']}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            {isArabic ? 'اقتراحات سريعة:' : 'Quick suggestions:'}
          </p>
          <div className="flex flex-wrap gap-1">
            {getContextualSuggestions()[isArabic ? 'ar' : 'en'].slice(0, 2).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(suggestion)}
                className="text-xs h-7 px-2"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isArabic ? 'اكتب رسالتك لمساعد عقل HR...' : 'Type your message to AqlHR Assistant...'}
              className="flex-1 min-h-[60px] resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-xs px-2 h-7"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isArabic ? 'مسح المحادثة' : 'Clear Chat'}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-3 h-7"
            >
              <Send className="h-3 w-3 mr-1" />
              {isArabic ? 'إرسال' : 'Send'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {isArabic ? 'مدعوم بذكاء عقل HR الاصطناعي' : 'Powered by AqlHR AI Intelligence'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AqlHRAIAssistant;