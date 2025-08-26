import React from 'react';
import { OSIOverview as NewOSIOverview } from '@/components/diagnostic/OSIOverview';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

export const OSIOverview: React.FC<{ caseId?: string }> = ({ caseId }) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <NewOSIOverview />
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="osi-overview" 
        companyId="demo-company" 
        enabledFeatures={['organizational-design', 'strategic-insights', 'osi-analytics', 'overview-dashboard']}
      />
      
      <AqlHRAIAssistant 
        moduleContext={`osi.overview${caseId ? `.case-${caseId}` : ''}`} 
        companyId="demo-company"
      />
    </div>
  );
};
