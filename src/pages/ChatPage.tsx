import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';
import { EnhancedAIShowcase } from '@/components/ai/EnhancedAIShowcase';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const ChatPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
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
      
      {/* AI Integration for Chat Page */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="chat-interface" 
        companyId="demo-company" 
        enabledFeatures={['intelligent-assistance', 'contextual-help', 'conversation-ai', 'natural-language']}
      />
    </div>
  );
};

export default ChatPage;