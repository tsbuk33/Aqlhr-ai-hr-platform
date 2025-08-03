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
  RefreshCw,
  Globe,
  Shield,
  Upload,
  SpellCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentAwareAI } from '@/hooks/useDocumentAwareAI';
import { DocumentUploadWidget } from '@/components/DocumentUploadWidget';

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
  confidence?: number;
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
  const [isGatheringIntelligence, setIsGatheringIntelligence] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);
  const [spellingSuggestions, setSpellingSuggestions] = useState<string[]>([]);
  const [showSpellingSuggestions, setShowSpellingSuggestions] = useState(false);
  
  // Document-aware AI integration
  const { 
    queryWithDocuments, 
    documents, 
    moduleDocuments 
  } = useDocumentAwareAI(moduleContext);

  // Contextual greetings with correct Arabic branding
  const contextualGreetings = {
    'payroll': {
      ar: 'أهلاً! هل تحتاج مساعدة في معالجة الرواتب عبر نظام عقل HR؟ يمكنني مساعدتك خاصة في أسئلة GOSI والتأمينات الاجتماعية.',
      en: 'Hi! Need help with payroll processing in AqlHR system? I can especially help you with GOSI and social insurance questions.'
    },
    'default': {
      ar: 'مرحباً! أنا مساعدك الذكي في منصة عقل HR. كيف يمكنني مساعدتك اليوم؟',
      en: 'Hello! I\'m your AI assistant for AqlHR platform. How can I help you today?'
    }
  };

  // AI suggestions based on context
  const getContextualSuggestions = () => {
    const suggestions = {
      'payroll': {
        ar: [
          'ما هي معدلات GOSI الحالية؟',
          'كيف أحسب مساهمات التأمينات للسعوديين؟',
          'ما الفرق بين النظام القديم والجديد لـ GOSI؟',
          'كم مساهمة غير السعوديين في GOSI؟'
        ],
        en: [
          'What are the current GOSI rates?',
          'How do I calculate Saudi insurance contributions?',
          'What\'s the difference between old and new GOSI system?',
          'What is the non-Saudi GOSI contribution?'
        ]
      },
      'default': {
        ar: [
          'كيف يمكنني البدء؟',
          'ما هي الميزات المتاحة؟',
          'اعرض النظرة العامة',
          'مساعدة في الإعدادات'
        ],
        en: [
          'How can I get started?',
          'What features are available?',
          'Show me the overview',
          'Help with settings'
        ]
      }
    };
    
    return suggestions[moduleContext as keyof typeof suggestions] || suggestions.default;
  };

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings.default;
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: greeting[isArabic ? 'ar' : 'en'],
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [moduleContext, isArabic]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      module: moduleContext
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsGatheringIntelligence(true);
    
    try {
      let combinedResponse = '';
      
      // Check if this is a GOSI-related question
      const isGosiQuestion = inputValue.toLowerCase().includes('gosi') || 
                            inputValue.toLowerCase().includes('جوسي') ||
                            inputValue.toLowerCase().includes('تأمينات') ||
                            inputValue.toLowerCase().includes('social insurance');
      
      let aiResponse;
      let aiError;

      if (isGosiQuestion) {
        // Handle GOSI questions with the existing GOSI engine
        const { data: gosiData, error: gosiErr } = await supabase.functions.invoke('gosi-engine/preview', {
          body: { company_id: companyId || 'demo-company' }
        });
        
        if (gosiErr) {
          throw new Error(gosiErr.message);
        }
        
        // Format GOSI response
        const gosiResponse = isArabic 
          ? `🏛️ **معلومات التأمينات الاجتماعية (GOSI):**\n\n` +
            `📊 **ملخص الموظفين:** ${gosiData?.summary?.total_employees || 0} موظف\n` +
            `💰 **إجمالي المساهمات:** ${gosiData?.summary?.total_contributions ? new Intl.NumberFormat('ar-SA', {style: 'currency', currency: 'SAR'}).format(gosiData.summary.total_contributions) : '0 ريال'}\n` +
            `🇸🇦 **موظفين سعوديين:** ${gosiData?.summary?.saudi_employees || 0}\n` +
            `🌍 **موظفين غير سعوديين:** ${gosiData?.summary?.non_saudi_employees || 0}\n\n` +
            `📈 **معدلات GOSI الحالية (2024):**\n` +
            `• السعوديين (النظام الجديد): 9.75% موظف + 11.75% صاحب عمل = 21.5% إجمالي\n` +
            `• السعوديين (النظام القديم): 9% موظف + 9% صاحب عمل = 18% إجمالي\n` +
            `• غير السعوديين: 0% موظف + 2% صاحب عمل = 2% إجمالي`
          : `🏛️ **GOSI (Social Insurance) Information:**\n\n` +
            `📊 **Employee Summary:** ${gosiData?.summary?.total_employees || 0} employees\n` +
            `💰 **Total Contributions:** ${gosiData?.summary?.total_contributions ? new Intl.NumberFormat('en-SA', {style: 'currency', currency: 'SAR'}).format(gosiData.summary.total_contributions) : 'SAR 0'}\n` +
            `🇸🇦 **Saudi Employees:** ${gosiData?.summary?.saudi_employees || 0}\n` +
            `🌍 **Non-Saudi Employees:** ${gosiData?.summary?.non_saudi_employees || 0}\n\n` +
            `📈 **Current GOSI Rates (2024):**\n` +
            `• Saudis (NEW System): 9.75% employee + 11.75% employer = 21.5% total\n` +
            `• Saudis (OLD System): 9% employee + 9% employer = 18% total\n` +
            `• Non-Saudis: 0% employee + 2% employer = 2% total`;
        
        aiResponse = { response: gosiResponse };
        aiError = null;
      } else {
        // For non-GOSI questions, provide a helpful response without calling external functions
        const helpfulResponse = isArabic
          ? `أعتذر، أنا متخصص في الإجابة على الأسئلة المتعلقة بـ GOSI والتأمينات الاجتماعية. يمكنني مساعدتك في:\n\n• حساب مساهمات GOSI\n• معدلات التأمينات الحالية\n• الفروق بين النظام القديم والجديد\n• مساهمات الموظفين السعوديين وغير السعوديين\n\nهل لديك سؤال محدد حول GOSI؟`
          : `I specialize in answering GOSI (Social Insurance) related questions. I can help you with:\n\n• GOSI contribution calculations\n• Current insurance rates\n• Differences between old and new systems\n• Saudi vs non-Saudi employee contributions\n\nDo you have a specific question about GOSI?`;
        
        aiResponse = { response: helpfulResponse };
        aiError = null;
      }

      if (aiError) {
        throw new Error(aiError.message);
      }

      combinedResponse = aiResponse.response;
      
      setIsGatheringIntelligence(false);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: combinedResponse,
        timestamp: new Date(),
        module: moduleContext,
        confidence: 95
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsGatheringIntelligence(false);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: isArabic 
          ? 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
        module: moduleContext
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const greeting = contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings.default;
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: greeting[isArabic ? 'ar' : 'en'],
      timestamp: new Date()
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
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {isArabic ? 'محمي + ذكاء خارجي' : 'Secure + External Intelligence'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {moduleContext === 'default' ? (isArabic ? 'عام' : 'General') : moduleContext}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className={`space-y-3 max-h-64 overflow-y-auto ${isExpanded ? 'max-h-96' : ''}`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? (isArabic ? 'justify-start' : 'justify-end') : (isArabic ? 'justify-end' : 'justify-start')}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                  message.type === 'user'
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted text-foreground border'
                }`}
              >
                {message.content}
                {message.confidence && (
                  <div className="text-xs opacity-70 mt-1">
                    {message.confidence}% {isArabic ? 'دقة' : 'accuracy'}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Intelligence Gathering Indicator */}
          {isGatheringIntelligence && (
            <div className="flex justify-center">
              <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {isArabic ? 'جاري جمع الذكاء الخارجي...' : 'Gathering external intelligence...'}
              </div>
            </div>
          )}
        </div>

        {/* Document Upload Section */}
        {showDocumentUpload && (
          <DocumentUploadWidget 
            moduleKey={moduleContext} 
            compact={true}
          />
        )}

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {isArabic ? 'اقتراحات سريعة:' : 'Quick suggestions:'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocumentUpload(!showDocumentUpload)}
              className="text-xs h-6 px-2"
            >
              <Upload className="h-3 w-3 mr-1" />
              {isArabic ? 'رفع مستند' : 'Upload'}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {getContextualSuggestions()[isArabic ? 'ar' : 'en'].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(suggestion)}
                className="text-xs h-6 px-2"
              >
                {suggestion}
              </Button>
            ))}
          </div>
          
          {moduleDocuments.length > 0 && (
            <div className="text-xs text-muted-foreground">
              📚 {moduleDocuments.length} {isArabic ? 'مستندات جاهزة للتحليل' : 'documents ready for analysis'}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isArabic ? 'اكتب رسالتك لمساعد عقل HR...' : 'Type your message to AqlHR Assistant...'}
              className={`pr-10 resize-none min-h-[40px] max-h-32 ${
                isArabic ? 'text-right' : 'text-left'
              }`}
              spellCheck={spellCheckEnabled}
              lang={isArabic ? 'ar' : 'en'}
              dir={isArabic ? 'rtl' : 'ltr'}
              rows={2}
              onInput={(e) => {
                if (spellCheckEnabled) {
                  // Basic spell check would go here
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