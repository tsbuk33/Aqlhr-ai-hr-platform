import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface ChatMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp?: Date;
}

interface Citation {
  source: string;
  scope?: string;
  note?: string;
}

interface Action {
  label: string;
  type: 'link' | 'download' | 'navigate';
  href?: string;
}

interface AssistantResponse {
  text: string;
  lang: 'en' | 'ar';
  actions?: Action[];
  citations?: Citation[];
  needsConfirmation?: boolean;
}

export const useAskAqlV2 = () => {
  const { language } = useSimpleLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendMessage = async (content: string, confirm = false): Promise<AssistantResponse | void> => {
    setIsLoading(true);
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data: response, error } = await supabase.functions.invoke('ask-aql-router-v1', {
        body: {
          sessionId,
          messages: [...messages, userMessage],
          lang: language,
          confirm
        }
      });

      if (error) throw error;

      const assistantResponse: AssistantResponse = response;
      
      // Store session ID from response headers or generate one
      if (!sessionId && response.sessionId) {
        setSessionId(response.sessionId);
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Return the full response for UI to handle actions/confirmations
      return assistantResponse;

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    sessionId
  };
};