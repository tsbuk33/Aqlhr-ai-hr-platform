import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ModuleAIChatProps {
  moduleKey: string;
  context?: {
    moduleName: string;
    currentData?: any;
    uploadedDocs?: string[];
  };
  className?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

const ModuleAIChat: React.FC<ModuleAIChatProps> = ({
  moduleKey,
  context,
  className = "",
  isMinimized = false,
  onToggleMinimize,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isArabic = language === 'ar';

  const getLocalizedText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage = getLocalizedText(
        `${moduleKey}.aiChat.welcomeMessage`,
        isArabic 
          ? `مرحباً! أنا مساعد الذكاء الاصطناعي لوحدة ${moduleKey}. كيف يمكنني مساعدتك اليوم؟`
          : `Hello! I'm your AI assistant for ${moduleKey}. How can I help you today?`
      );
      
      setMessages([{
        id: '1',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [moduleKey, t, messages.length, isArabic]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      role: 'assistant',
      content: getLocalizedText('aiChat.typing', isArabic ? 'يكتب...' : 'Typing...'),
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-core-engine', {
        body: {
          query: inputValue.trim(),
          context: {
            module: moduleKey,
            language,
            ...context,
          },
          conversation_history: messages.slice(-10), // Last 10 messages for context
        },
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || getLocalizedText('aiChat.defaultError', isArabic ? 'عذراً، حدث خطأ في المعالجة' : 'Sorry, there was an error processing your request'),
        timestamp: new Date(),
      };

      // Remove typing indicator and add response
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        assistantMessage,
      ]);

    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Remove typing indicator and add error message
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      toast({
        title: getLocalizedText('common.error', isArabic ? 'خطأ' : 'Error'),
        description: getLocalizedText('aiChat.errorMessage', isArabic ? 'حدث خطأ أثناء التواصل مع المساعد الذكي' : 'An error occurred while communicating with the AI assistant'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-20 ${isArabic ? 'left-4' : 'right-4'} z-40`}>
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-shadow"
          size="icon"
          variant="secondary"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-5 w-5 text-primary" />
          {getLocalizedText(
            `${moduleKey}.aiChat.title`,
            isArabic ? `مساعد ${moduleKey} الذكي` : `${moduleKey} AI Assistant`
          )}
          <Badge variant="secondary" className="text-xs">
            {getLocalizedText('aiChat.beta', isArabic ? 'تجريبي' : 'Beta')}
          </Badge>
        </CardTitle>
        
        <div className="flex items-center gap-1">
          {onToggleMinimize && (
            <Button variant="ghost" size="icon" onClick={onToggleMinimize}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`
                      rounded-lg px-3 py-2 text-sm
                      ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                      }
                      ${message.isTyping ? 'animate-pulse' : ''}
                    `}
                  >
                    {message.content}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 order-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getLocalizedText('aiChat.placeholder', isArabic ? 'اكتب رسالتك هنا...' : 'Type your message here...')}
              disabled={isLoading}
              className={isArabic ? 'text-right' : 'text-left'}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleAIChat;