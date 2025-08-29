import React from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import AskAqlChat from '@/components/assistant/AskAqlChat';
import PageHeader from '@/components/common/PageHeader';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AssistantPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  return (
    <div className="container mx-auto p-6 h-full flex flex-col space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader
        title={isArabic ? 'مساعد عقل الذكي' : 'Ask Aql Assistant'}
        description={isArabic 
          ? 'مساعد الذكاء الاصطناعي للموارد البشرية السعودية - اسأل عن البيانات، أنشئ المهام، واحصل على التقارير'
          : 'Your AI-powered Saudi HR Assistant - Ask about data, create tasks, and get reports'
        }
      />
      
      <div className="flex-1">
        <AskAqlChat />
      </div>
      
      {/* AI Integration for Assistant */}
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="ask-aql-assistant" 
        companyId="demo-company" 
        enabledFeatures={['contextual-help', 'real-time-insights', 'workflow-automation', 'intelligent-automation']}
      />
    </div>
  );
};

export default AssistantPage;