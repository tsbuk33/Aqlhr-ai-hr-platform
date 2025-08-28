import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useTranslation } from 'react-i18next';
import AskAqlChat from '@/components/assistant/AskAqlChat';
import { RAGAnswer } from '@/components/assistant/RAGAnswer';
import PageHeader from '@/components/common/PageHeader';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, FileText, Bot, Search } from 'lucide-react';

const AssistantPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');

  // Handle deep-linking via URL parameters
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'rag' || mode === 'evidence') {
      setActiveTab('rag');
    } else if (mode === 'chat') {
      setActiveTab('chat');
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    
    // Update URL to reflect current tab
    const newSearchParams = new URLSearchParams(searchParams);
    if (newTab === 'rag') {
      newSearchParams.set('mode', 'rag');
    } else if (newTab === 'chat') {
      newSearchParams.set('mode', 'chat');
    }
    
    // Use replace to avoid cluttering browser history
    navigate({ search: newSearchParams.toString() }, { replace: true });
  };

  return (
    <div className="container mx-auto p-6 h-full flex flex-col space-y-6">
      <PageHeader
        title={isArabic ? 'مساعد عقل الذكي' : 'Ask Aql Assistant'}
        description={isArabic 
          ? 'مساعد الذكاء الاصطناعي للموارد البشرية السعودية - اسأل عن البيانات، أنشئ المهام، واحصل على التقارير'
          : 'Your AI-powered Saudi HR Assistant - Ask about data, create tasks, and get reports'
        }
      />
      
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('assistant.tabs.chat', 'General Chat')}
            </TabsTrigger>
            <TabsTrigger value="rag" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('assistant.tabs.rag', 'Ask with Evidence')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1">
            <div className="h-full">
              <AskAqlChat />
            </div>
          </TabsContent>
          
          <TabsContent value="rag" className="flex-1">
            <div className="h-full">
              <RAGAnswer />
            </div>
          </TabsContent>
        </Tabs>
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