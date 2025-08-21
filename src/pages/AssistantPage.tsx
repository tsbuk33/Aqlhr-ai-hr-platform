import React from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import AskAqlChat from '@/components/assistant/AskAqlChat';
import PageHeader from '@/components/common/PageHeader';

const AssistantPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  return (
    <div className="container mx-auto p-6 h-full flex flex-col">
      <PageHeader
        title={isArabic ? 'مساعد عقل الذكي' : 'Ask Aql Assistant'}
        description={isArabic 
          ? 'مساعد الذكاء الاصطناعي للموارد البشرية السعودية - اسأل عن البيانات، أنشئ المهام، واحصل على التقارير'
          : 'Your AI-powered Saudi HR Assistant - Ask about data, create tasks, and get reports'
        }
      />
      
      <div className="flex-1 mt-6">
        <AskAqlChat />
      </div>
    </div>
  );
};

export default AssistantPage;