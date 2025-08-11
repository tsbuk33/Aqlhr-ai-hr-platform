import React from 'react';
import { AqlHRAIAssistant } from '@/components/ai';
import { EnhancedAIShowcase } from '@/components/ai/EnhancedAIShowcase';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const ChatPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'مساعد ذكي للإجابة على جميع استفساراتك في الموارد البشرية'
            : 'Your intelligent assistant for all HR-related questions and tasks'
          }
        </p>
      </div>

      <EnhancedAIShowcase />
      
      <AqlHRAIAssistant moduleContext="chat.assistant" />
    </div>
  );
};

export default ChatPage;