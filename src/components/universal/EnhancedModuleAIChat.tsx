import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, X, Minimize2, Maximize2, FileText, Globe, Sparkles, Check, X as XIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';
import { useDocumentAwareAI, DocumentContext } from '@/hooks/useDocumentAwareAI';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  sources?: DocumentContext[];
  confidence?: number;
}

interface SpellingSuggestion {
  original: string;
  suggested: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

interface EnhancedModuleAIChatProps {
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

const EnhancedModuleAIChat: React.FC<EnhancedModuleAIChatProps> = ({
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
  const [spellingSuggestions, setSpellingSuggestions] = useState<SpellingSuggestion[]>([]);
  const [isSpellChecking, setIsSpellChecking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isArabic = language === 'ar';

  const {
    documents,
    moduleDocuments,
    queryWithDocuments,
    loading: docsLoading
  } = useDocumentAwareAI(moduleKey);

  useEffect(() => {
    // Initialize with enhanced welcome message showing available documents
    if (messages.length === 0) {
      const docCount = moduleDocuments.length;
      const welcomeMessage = docCount > 0 
        ? `${isArabic ? 'مرحباً! أنا مساعد الذكاء الاصطناعي للسلامة والصحة المهنية. لدي إمكانية الوصول إلى' : 'Hello! I\'m your Health & Safety AI assistant. I have access to'} ${docCount} ${isArabic ? 'وثيقة مرفوعة في هذه الوحدة ويمكنني مساعدتك في تحليلها.' : 'document(s) uploaded to this module and can help you analyze them.'}`
        : isArabic ? 'مرحباً! أنا مساعد الذكاء الاصطناعي للسلامة والصحة المهنية. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I\'m your Health & Safety AI assistant. How can I help you today?';

      setMessages([{
        id: '1',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [moduleKey, t, messages.length, moduleDocuments.length]);

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
      content: t('aiChat.analyzing'),
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await queryWithDocuments(inputValue.trim(), {
        language: language as 'en' | 'ar',
        includeAllDocs: false // Only include module-specific and global docs
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence,
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
        title: t('common.error'),
        description: t('aiChat.errorMessage'),
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

  const performSpellCheck = async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setSpellingSuggestions([]);
      return;
    }

    setIsSpellChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('spell-checker', {
        body: {
          text: text.trim(),
          language: language as 'en' | 'ar',
          autoFix: false
        }
      });

      if (error) throw error;

      if (data?.suggestions?.length > 0) {
        setSpellingSuggestions(data.suggestions);
        setShowSuggestions(true);
      } else {
        setSpellingSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Spell check error:', error);
      // Silently fail for spell checking
    } finally {
      setIsSpellChecking(false);
    }
  };

  const autoFixSpelling = async () => {
    if (!inputValue.trim()) return;

    setIsSpellChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('spell-checker', {
        body: {
          text: inputValue.trim(),
          language: language as 'en' | 'ar',
          autoFix: true
        }
      });

      if (error) throw error;

      if (data?.correctedText && data.correctedText !== inputValue.trim()) {
        setInputValue(data.correctedText);
        setSpellingSuggestions([]);
        setShowSuggestions(false);
        toast({
          title: t('spellCheck.fixed'),
          description: t('spellCheck.fixedMessage'),
        });
      }
    } catch (error) {
      console.error('Auto-fix error:', error);
      toast({
        title: t('common.error'),
        description: t('spellCheck.error'),
        variant: 'destructive',
      });
    } finally {
      setIsSpellChecking(false);
    }
  };

  const applySuggestion = (suggestion: SpellingSuggestion) => {
    const newText = inputValue.substring(0, suggestion.startIndex) + 
                   suggestion.suggested + 
                   inputValue.substring(suggestion.endIndex);
    setInputValue(newText);
    setSpellingSuggestions(prev => prev.filter(s => s !== suggestion));
    if (spellingSuggestions.length <= 1) {
      setShowSuggestions(false);
    }
  };

  const dismissSuggestion = (suggestion: SpellingSuggestion) => {
    setSpellingSuggestions(prev => prev.filter(s => s !== suggestion));
    if (spellingSuggestions.length <= 1) {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Debounced spell checking
    const timeoutId = setTimeout(() => {
      performSpellCheck(newValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 ${isArabic ? 'left-4' : 'right-4'} z-50`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleMinimize}
                className="rounded-full w-12 h-12 shadow-lg relative"
                size="icon"
              >
                <MessageCircle className="h-6 w-6" />
                {moduleDocuments.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {moduleDocuments.length}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AqlHR AI Assistant</p>
              {moduleDocuments.length > 0 && (
                <p className="text-xs">{moduleDocuments.length} documents available</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-5 w-5 text-primary" />
          {isArabic ? 'مساعد السلامة والصحة المهنية الذكي' : 'Health & Safety AI Assistant'}
          <Badge variant="secondary" className="text-xs">
            {isArabic ? 'مُحسن بالذكاء الاصطناعي' : 'AI Enhanced'}
          </Badge>
          {moduleDocuments.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {moduleDocuments.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{moduleDocuments.length} documents available for analysis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
                  
                  {/* Source documents indicator */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.sources.map((source, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {source.fileName.length > 15 
                                  ? `${source.fileName.substring(0, 15)}...` 
                                  : source.fileName
                                }
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Source: {source.fileName}</p>
                              <p className="text-xs">Module: {source.moduleKey}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  )}
                  
                  {/* Confidence indicator */}
                  {message.confidence && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        message.confidence > 0.8 ? 'bg-green-500' :
                        message.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(message.confidence * 100)}% confident
                      </span>
                    </div>
                  )}
                  
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
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  moduleDocuments.length > 0 
                    ? t('aiChat.placeholderWithDocs') 
                    : t('aiChat.placeholder')
                }
                disabled={isLoading || docsLoading}
                className={`${isArabic ? 'text-right' : 'text-left'} ${
                  spellingSuggestions.length > 0 ? 'border-yellow-400' : ''
                }`}
              />
              
              {/* Spelling Check Indicator */}
              {isSpellChecking && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                </div>
              )}
              
              {/* Spelling Suggestions Popover */}
              {spellingSuggestions.length > 0 && (
                <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {spellingSuggestions.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {isArabic ? 'اقتراحات إملائية' : 'Spelling Suggestions'}
                        </h4>
                        <Button
                          onClick={autoFixSpelling}
                          disabled={isSpellChecking}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          {isArabic ? 'إصلاح الكل' : 'Fix All'}
                        </Button>
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {spellingSuggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm line-through text-red-500">
                                  {suggestion.original}
                                </span>
                                <span className="text-sm text-green-600 font-medium">
                                  {suggestion.suggested}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {Math.round(suggestion.confidence * 100)}% {isArabic ? 'ثقة' : 'confidence'}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                onClick={() => applySuggestion(suggestion)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => dismissSuggestion(suggestion)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                              >
                                <XIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading || docsLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {documents.length > moduleDocuments.length && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {documents.length - moduleDocuments.length} additional documents available company-wide
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedModuleAIChat;