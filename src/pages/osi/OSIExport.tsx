import React from 'react';
import { OSIExport as NewOSIExport } from '@/components/diagnostic/OSIExport';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

export const OSIExport: React.FC<{ caseId?: string }> = ({ caseId }) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <NewOSIExport />
      
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="osi-export" 
        companyId="demo-company" 
        enabledFeatures={['data-export', 'report-generation', 'osi-analytics', 'document-generation']}
      />
      
      <AqlHRAIAssistant 
        moduleContext={`osi.export${caseId ? `.case-${caseId}` : ''}`} 
        companyId="demo-company"
      />
    </div>
  );
};
