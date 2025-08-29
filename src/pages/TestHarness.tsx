import { useEffect } from 'react';
import TestHarness from '@/components/TestHarness';
import AISystemValidator from '@/components/AISystemValidator';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from "@/hooks/useLanguageCompat";

const TestHarnessPage = () => {
  useEffect(() => {
    document.title = 'AqlHR Test Harness - System Validation';
  }, []);
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      <Tabs defaultValue="ai-validation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-validation">🤖 AI System Validation</TabsTrigger>
          <TabsTrigger value="full-test">🛡️ Full Test Suite</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-validation" className="mt-6">
          <AISystemValidator />
        </TabsContent>
        
        <TabsContent value="full-test" className="mt-6">
          <TestHarness />
        </TabsContent>
      </Tabs>
      
      <AqlHRAIAssistant moduleContext="testHarness.validation" />

      {/* AI Integration for Test Harness */}
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="test-harness" 
        companyId="demo-company" 
        enabledFeatures={['intelligent-automation', 'contextual-help', 'real-time-insights']}
      />
    </div>
  );
};

export default TestHarnessPage;