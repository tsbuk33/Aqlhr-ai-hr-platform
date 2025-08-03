import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Zap, 
  Globe, 
  Shield, 
  RefreshCw,
  Bot,
  Minimize2,
  Maximize2,
  Settings,
  Network
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useAIAgentOrchestrator } from '@/hooks/useAIAgentOrchestrator';
import { useToast } from '@/hooks/use-toast';

interface UniversalAIAgentProps {
  moduleContext: string;
  position?: 'fixed' | 'static';
  className?: string;
  defaultProvider?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  provider?: string;
  confidence?: number;
  timestamp: Date;
}

export const UniversalAIAgent: React.FC<UniversalAIAgentProps> = ({
  moduleContext,
  position = 'fixed',
  className = '',
  defaultProvider
}) => {
  const { isArabic } = useSimpleLanguage();
  const { toast } = useToast();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>(defaultProvider || 'auto');
  const [showProviderSelection, setShowProviderSelection] = useState(false);

  const {
    queryAIAgent,
    getBestResponse,
    getProviderStatus,
    isLoading,
    availableProviders,
    providerStatus
  } = useAIAgentOrchestrator();

  useEffect(() => {
    initializeAgent();
    loadProviderStatus();
  }, [moduleContext]);

  const initializeAgent = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: isArabic 
        ? `🤖 مرحباً! أنا النظام الذكي متعدد المحركات لـ AqlHR. يمكنني الاتصال بعدة مقدمي خدمات الذكاء الاصطناعي لتقديم أفضل الإجابات.\n\nالمحركات المتاحة: OpenAI، Claude، Gemini، وأنظمة صينية متقدمة مثل Qwen وDeepSeek.`
        : `🤖 Hello! I'm the multi-engine AI system for AqlHR. I can connect to multiple AI providers to give you the best answers.\n\nAvailable engines: OpenAI, Claude, Gemini, and advanced Chinese systems like Qwen and DeepSeek.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const loadProviderStatus = async () => {
    try {
      await getProviderStatus();
    } catch (error) {
      console.error('Error loading provider status:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      let result;
      
      if (selectedProvider === 'auto') {
        // Use the best available provider
        result = await getBestResponse(inputValue, {
          module: moduleContext,
          enableFallback: true
        });
      } else {
        // Use specific provider
        result = await queryAIAgent(inputValue, {
          module: moduleContext,
          provider: selectedProvider,
          enableFallback: true
        });
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        provider: result.provider,
        confidence: result.confidence,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show success toast with provider info
      toast({
        title: isArabic ? 'تم الرد بنجاح' : 'Response Generated',
        description: isArabic 
          ? `تم الحصول على الرد من ${result.provider} بدقة ${result.confidence}%`
          : `Response from ${result.provider} with ${result.confidence}% confidence`
      });

    } catch (error) {
      console.error('Error querying AI agent:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: isArabic 
          ? `🚫 عذراً، واجهت مشكلة في الاتصال بأنظمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى أو تغيير مقدم الخدمة.\n\nالخطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
          : `🚫 Sorry, I encountered an issue connecting to AI systems. Please try again or switch providers.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: isArabic ? 'خطأ في النظام' : 'System Error',
        description: isArabic ? 'فشل في الحصول على رد من أنظمة الذكاء الاصطناعي' : 'Failed to get response from AI systems',
        variant: 'destructive'
      });
    }
  };

  const getProviderBadgeColor = (provider: string) => {
    const colors: Record<string, string> = {
      'openai': 'bg-green-100 text-green-800',
      'claude': 'bg-purple-100 text-purple-800',
      'gemini': 'bg-blue-100 text-blue-800',
      'qwen': 'bg-red-100 text-red-800',
      'ernie': 'bg-yellow-100 text-yellow-800',
      'deepseek': 'bg-indigo-100 text-indigo-800'
    };
    return colors[provider] || 'bg-gray-100 text-gray-800';
  };

  const baseClasses = position === 'fixed' 
    ? 'fixed bottom-6 left-6 z-50 w-96 h-[600px] flex flex-col' 
    : 'w-full max-w-md mx-auto h-[600px] flex flex-col';

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className={`${position === 'fixed' ? 'fixed bottom-6 left-6 z-50' : ''} ${className} bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full w-16 h-16 p-0`}
      >
        <Network className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Card className={`${baseClasses} ${className} ${isArabic ? 'rtl' : 'ltr'} shadow-2xl border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 backdrop-blur-md`} dir={isArabic ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Network className="h-5 w-5 text-purple-600 animate-pulse" />
            {isArabic ? 'الوكيل الذكي العالمي' : 'Universal AI Agent'}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProviderSelection(!showProviderSelection)}
              className="p-1 h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
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
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></div>
              {availableProviders.length} {isArabic ? 'محرك متاح' : 'Engines Available'}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {isArabic ? 'آمن ومشفر' : 'Secure & Encrypted'}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {isArabic ? 'عالمي' : 'Global'}
            </Badge>
          </div>

          {showProviderSelection && (
            <div className="space-y-2">
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder={isArabic ? "اختر المحرك" : "Select Engine"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    {isArabic ? '🤖 اختيار تلقائي (الأفضل)' : '🤖 Auto-Select (Best)'}
                  </SelectItem>
                  {availableProviders.map(provider => (
                    <SelectItem key={provider} value={provider}>
                      {providerStatus[provider]?.name || provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Chat Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? (isArabic ? 'justify-start' : 'justify-end') : (isArabic ? 'justify-end' : 'justify-start')}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/80 text-gray-800 border border-purple-200 shadow-sm'
                }`}
              >
                {message.content}
                {message.provider && (
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                    <Badge className={`${getProviderBadgeColor(message.provider)} text-xs px-1 py-0`}>
                      {message.provider}
                    </Badge>
                    {message.confidence && (
                      <span>{message.confidence}% {isArabic ? 'دقة' : 'confidence'}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-center">
              <div className="bg-white/80 p-3 rounded-lg text-sm text-gray-600 flex items-center gap-2 border border-purple-200">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {isArabic ? 'جاري الاستعلام من أنظمة الذكاء الاصطناعي...' : 'Querying AI systems...'}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 space-y-2 border-t border-purple-200 pt-2">
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isArabic ? 'اكتب سؤالك للوكيل الذكي العالمي...' : 'Ask the Universal AI Agent...'}
              className={`resize-none min-h-[60px] max-h-24 ${isArabic ? 'text-right' : 'text-left'} border-purple-200 focus:border-purple-400`}
              rows={2}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadProviderStatus}
                className="text-xs px-2 h-7"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {isArabic ? 'تحديث' : 'Refresh'}
              </Button>
              <span className="text-xs text-gray-500">
                {selectedProvider === 'auto' ? (isArabic ? 'تلقائي' : 'Auto') : selectedProvider}
              </span>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 h-7"
            >
              <Zap className="h-3 w-3 mr-1" />
              {isArabic ? 'إرسال' : 'Send'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 text-center pt-2 border-t border-purple-200">
          <p className="text-xs text-gray-500">
            {isArabic ? 'مدعوم بأنظمة ذكاء اصطناعي متعددة' : 'Powered by Multiple AI Systems'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversalAIAgent;