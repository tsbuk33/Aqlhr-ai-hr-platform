import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import PageHeader from '@/components/common/PageHeader';
import AuditLogViewer from '@/components/security/AuditLogViewer';
import SecurityConfigPanel from '@/components/security/SecurityConfigPanel';

const SecurityPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={isArabic ? 'إدارة الأمان' : 'Security Management'}
        description={isArabic 
          ? 'إعدادات الأمان وسجل المراجعة للنظام'
          : 'Security settings and audit logs for system monitoring'
        }
      />

      <Tabs defaultValue="audit-logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="audit-logs">
            {isArabic ? 'سجل المراجعة' : 'Audit Logs'}
          </TabsTrigger>
          <TabsTrigger value="security-config">
            {isArabic ? 'إعدادات الأمان' : 'Security Settings'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-4">
          <AuditLogViewer />
        </TabsContent>

        <TabsContent value="security-config" className="space-y-4">
          <SecurityConfigPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityPage;