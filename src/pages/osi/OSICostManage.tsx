import React from 'react';
import { OSICost } from '@/components/diagnostic/OSICost';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

export const OSICostManage: React.FC<{ caseId?: string }> = ({ caseId }) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <OSICost />
      
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="osi-cost-manage" 
        companyId="demo-company" 
        enabledFeatures={['cost-analysis', 'organizational-design', 'financial-optimization', 'osi-analytics']}
      />
      
      <AqlHRAIAssistant 
        moduleContext={`osi.cost-manage${caseId ? `.case-${caseId}` : ''}`} 
        companyId="demo-company"
      />
    </div>
  );
};
