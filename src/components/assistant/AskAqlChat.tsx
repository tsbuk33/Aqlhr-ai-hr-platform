import React, { useState, useRef, useEffect } from 'react';
import { useAskAqlV2 } from '@/hooks/useAskAqlV2';
import { useAIStream } from '@/lib/ai/useAIStream';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, MessageSquare, User, Bot, ChevronDown, ChevronUp, ExternalLink, Download, Eye, Square } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useLocale } from '@/i18n/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface PendingConfirmation {
  message: string;
  originalQuery: string;
}

const AskAqlChat: React.FC = () => {
  const { isArabic, language } = useSimpleLanguage();
  const { t } = useLocale();
  const { messages, isLoading, sendMessage, clearChat } = useAskAqlV2();
  const { start: startStream, cancel: cancelStream, isStreaming, error: streamError, partial, meta } = useAIStream();
  const [userInput, setUserInput] = useState('');
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [useStreaming, setUseStreaming] = useState(true);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, partial]);

  // Complete streaming message when done
  useEffect(() => {
    if (!isStreaming && currentStreamingMessage && partial) {
      setCurrentStreamingMessage(null);
    }
  }, [isStreaming, currentStreamingMessage, partial]);

  const handleSend = async (confirm = false) => {
    if (!userInput.trim() && !confirm) return;
    if (isLoading || isStreaming) return;
    
    const input = confirm && pendingConfirmation ? pendingConfirmation.originalQuery : userInput;
    if (!confirm) setUserInput('');
    
    try {
      if (useStreaming && !confirm) {
        // Start streaming response
        setCurrentStreamingMessage(Date.now().toString());
        await startStream({
          lang: language,
          moduleContext: 'assistant',
          pageType: 'chat',
          intent: 'general',
          message: input,
        });
      } else {
        // Fall back to non-streaming
        const response = await sendMessage(input, confirm);
        setLastResponse(response);
        
        // Handle confirmation requests
        if (response && 'needsConfirmation' in response && response.needsConfirmation && !confirm) {
          setPendingConfirmation({
            message: response.text,
            originalQuery: input
          });
        } else {
          setPendingConfirmation(null);
          
          // Handle actions
          if (response && 'actions' in response && response.actions) {
            response.actions.forEach((action: any) => {
              if (action.type === 'download' && action.href) {
                window.open(action.href, '_blank');
              } else if (action.type === 'navigate' && action.href) {
                window.location.href = action.href;
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fall back to non-streaming on error
      if (useStreaming && !confirm) {
        setUseStreaming(false);
        const response = await sendMessage(input, confirm);
        setLastResponse(response);
      } else {
        toast.error(isArabic ? 'حدث خطأ في إرسال الرسالة' : 'Error sending message');
      }
    }
  };

  const handleConfirm = () => {
    if (pendingConfirmation) {
      handleSend(true);
    }
  };

  const handleStopStreaming = () => {
    cancelStream();
    setCurrentStreamingMessage(null);
  };

  const handleStopStreaming = () => {
    cancelStream();
    setCurrentStreamingMessage(null);
  };

  const renderCitations = (citations: any[]) => {
    if (!citations || citations.length === 0) return null;
    
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="mt-2 h-6 px-2 text-xs">
            {isArabic ? 'المصادر' : 'Sources'} ({citations.length})
            {isOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="text-xs text-muted-foreground space-y-1">
            {citations.map((citation: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-1">
                <code className="bg-muted px-1 rounded">{citation.source}</code>
                {citation.scope && <span className="text-xs opacity-75">{citation.scope}</span>}
                {citation.note && <span className="text-xs italic">{citation.note}</span>}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderActions = (actions: any[]) => {
    if (!actions || actions.length === 0) return null;
    
    return (
      <div className="mt-2 flex gap-2 flex-wrap">
        {actions.map((action: any, idx: number) => (
          <Button 
            key={idx} 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (action.type === 'download' && action.href) {
                window.open(action.href, '_blank');
              } else if (action.type === 'navigate' && action.href) {
                window.location.href = action.href;
              } else if (action.type === 'link' && action.href) {
                window.open(action.href, '_blank');
              }
            }}
            className="text-xs"
          >
            {action.type === 'download' && <Download className="w-3 h-3 mr-1" />}
            {action.type === 'link' && <ExternalLink className="w-3 h-3 mr-1" />}
            {action.type === 'navigate' && <Eye className="w-3 h-3 mr-1" />}
            {action.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isArabic ? 'ابدأ محادثة مع مساعد عقل الذكي' : 'Start a conversation with Aql Assistant'}
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'assistant' && index === messages.length - 1 && lastResponse && (
                      <>
                        {renderActions(lastResponse.actions)}
                        {renderCitations(lastResponse.citations)}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {currentStreamingMessage && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                      <p className="text-sm whitespace-pre-wrap">
                        {partial || t('ai_streaming.streaming', 'Streaming...')}
                        {isStreaming && (
                          <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-1" />
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleTimeString()}
                      </span>
                      {meta?.provider && (
                        <Badge variant="secondary" className="text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                          {t('ai_streaming.live', 'Live')} · {meta.provider}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {pendingConfirmation && (
              <div className="flex justify-center">
                <div className="p-4 bg-warning/10 border border-warning rounded-lg max-w-md">
                  <p className="text-sm mb-3 text-center">{pendingConfirmation.message}</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="default" onClick={handleConfirm}>
                      {isArabic ? 'تأكيد' : 'Confirm'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      {isArabic ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          {/* Quick Action Chips */}
          {messages.length === 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">
                {isArabic ? 'إجراءات سريعة:' : 'Quick Actions:'}
              </p>
              <div className="flex gap-2 flex-wrap mb-3">
                {[
                  { label: isArabic ? 'التوطين الآن' : 'Saudization now', query: isArabic ? 'ما هي نسبة التوطين الحالية؟' : 'What is our current saudization rate?' },
                  { label: isArabic ? 'هويات منتهية (30 يوم)' : 'Expiring iqamas (30d)', query: isArabic ? 'أظهر هويات المقيم المنتهية خلال 30 يوم' : 'Show expiring iqamas in the next 30 days' },
                  { label: isArabic ? 'فحص الامتثال' : 'Run compliance check', query: isArabic ? 'تشغيل فحص الامتثال الآن' : 'Run compliance check now' },
                  { label: isArabic ? 'تصدير CCI (PDF)' : 'Export CCI (PDF)', query: isArabic ? 'تصدير تقرير الثقافة التنظيمية بصيغة PDF' : 'Export CCI executive PDF' },
                  { label: isArabic ? 'البحث في الأدلة' : 'Find evidence', query: isArabic ? 'ابحث عن الأدلة' : 'Find evidence documents' }
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setUserInput(action.query)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat Input */}
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isArabic ? 'اسأل مساعد عقل عن أي شيء...' : 'Ask Aql Assistant anything...'}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !pendingConfirmation) {
                  handleSend();
                }
              }}
              disabled={isLoading || !!pendingConfirmation}
              className="flex-1"
              dir={isArabic ? 'rtl' : 'ltr'}
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading || !userInput.trim() || !!pendingConfirmation}
              size="sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Footer */}
          <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
            <span>
              {isArabic ? 'مدعوم بالذكاء الاصطناعي' : 'Powered by AI'}
            </span>
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearChat}
                className="h-6 px-2 text-xs"
              >
                {isArabic ? 'مسح المحادثة' : 'Clear chat'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AskAqlChat;