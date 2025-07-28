import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import ModuleAIChat from '@/components/universal/ModuleAIChat';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';

const TestPage: React.FC = () => {
  const { language } = useSimpleLanguage();
  const isArabic = language === 'ar';

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Document Upload Panel */}
        <div className="mb-6">
          <ModuleDocumentUploader 
            moduleKey="demo.testPage"
            maxFiles={5}
            maxSize={10 * 1024 * 1024}
            acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'صفحة تجريبية' : 'Test Page'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={isArabic ? 'text-right' : 'text-left'}>
              {isArabic 
                ? 'هذه صفحة تجريبية لاختبار إدماج مساعد الذكاء الاصطناعي'
                : 'This is a test page for AI assistant embedding'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Panel */}
      <div className="fixed bottom-4 right-4 z-50">
        <ModuleAIChat 
          moduleKey="demo.testPage"
          context={{
            moduleName: "demo.testPage",
            currentData: {}
          }}
          className="w-80 h-96 shadow-2xl rounded-lg"
        />
      </div>
    </>
  );
};

export default TestPage;