import React, { useState } from 'react';
import { QueryGatekeeperInterface } from './QueryGatekeeperInterface';
import { useAskAqlV2 } from '@/hooks/useAskAqlV2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { ClarificationRequest } from '@/lib/ai-specialists/QueryGatekeeper';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  module?: string;
  clarificationNeeded?: boolean;
}

export const SmartQueryInterface: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { messages: aqlMessages, isLoading, sendMessage } = useAskAqlV2();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [pendingClarification, setPendingClarification] = useState<ClarificationRequest | null>(null);

  const handleValidQuery = async (query: string, module?: string) => {
    // Add user message to local state
    const userMessage: ChatMessage = {
      role: 'user',
      content: query,
      timestamp: new Date(),
      module,
      clarificationNeeded: false
    };
    
    setLocalMessages(prev => [...prev, userMessage]);
    setPendingClarification(null);

    // Add system message about validation
    const systemMessage: ChatMessage = {
      role: 'system',
      content: isArabic 
        ? `✅ تم التحقق من الاستفسار بنجاح${module ? ` - تم توجيهه إلى وحدة ${module}` : ''}`
        : `✅ Query validated successfully${module ? ` - routed to ${module} module` : ''}`,
      timestamp: new Date()
    };
    
    setLocalMessages(prev => [...prev, systemMessage]);

    try {
      // Send to AQL AI
      await sendMessage(query);
      
      // Add success message
      const successMessage: ChatMessage = {
        role: 'system',
        content: isArabic 
          ? '🤖 تم إرسال الاستفسار إلى النظام الذكي'
          : '🤖 Query sent to AI system',
        timestamp: new Date()
      };
      
      setLocalMessages(prev => [...prev, successMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'system',
        content: isArabic 
          ? '❌ فشل في إرسال الاستفسار'
          : '❌ Failed to send query',
        timestamp: new Date()
      };
      
      setLocalMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleClarificationNeeded = (clarification: ClarificationRequest) => {
    setPendingClarification(clarification);
    
    const clarificationMessage: ChatMessage = {
      role: 'system',
      content: isArabic 
        ? '⚠️ يحتاج استفسارك إلى توضيح. يرجى مراجعة الاقتراحات أدناه.'
        : '⚠️ Your query needs clarification. Please review suggestions below.',
      timestamp: new Date(),
      clarificationNeeded: true
    };
    
    setLocalMessages(prev => [...prev, clarificationMessage]);
  };

  const handleRetryWithClarification = () => {
    setPendingClarification(null);
  };

  // Combine local messages with AQL messages
  const allMessages = [
    ...localMessages,
    ...aqlMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      timestamp: msg.timestamp || new Date(),
      module: undefined,
      clarificationNeeded: false
    }))
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Query Gatekeeper Interface */}
      <QueryGatekeeperInterface
        onValidQuery={handleValidQuery}
        onClarificationNeeded={handleClarificationNeeded}
      />

      {/* Pending Clarification */}
      {pendingClarification && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              {isArabic ? 'توضيح مطلوب' : 'Clarification Required'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-yellow-700">
                <strong>{isArabic ? 'الاستفسار الأصلي:' : 'Original Query:'}</strong> {pendingClarification.originalQuery}
              </p>
              
              {pendingClarification.issues.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    {isArabic ? 'القضايا:' : 'Issues:'}
                  </p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    {pendingClarification.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button variant="outline" size="sm" onClick={handleRetryWithClarification}>
                {isArabic ? 'أعد المحاولة' : 'Try Again'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      {allMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {isArabic ? 'سجل المحادثة' : 'Conversation Log'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allMessages.map((message, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary/10 ml-8' 
                      : message.role === 'system'
                      ? 'bg-muted text-muted-foreground text-sm'
                      : 'bg-secondary/10 mr-8'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {message.role === 'user' 
                            ? (isArabic ? 'مستخدم' : 'User')
                            : message.role === 'system'
                            ? (isArabic ? 'نظام' : 'System')
                            : (isArabic ? 'مساعد' : 'Assistant')
                          }
                        </Badge>
                        {message.module && (
                          <Badge variant="secondary" className="text-xs">
                            {message.module}
                          </Badge>
                        )}
                        {message.clarificationNeeded && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg mr-8">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'المساعد يعمل...' : 'Assistant is thinking...'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-500" />
            {isArabic 
              ? 'بوابة التحقق نشطة - جميع الاستفسارات يتم فحصها للوضوح والدقة'
              : 'Validation gateway active - all queries are screened for clarity and specificity'
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
