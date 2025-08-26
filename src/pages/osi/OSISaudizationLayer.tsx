import React from 'react';
import { OSISaudizationByLayers } from '@/components/diagnostic/OSISaudizationByLayers';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

export const OSISaudizationLayer: React.FC<{ caseId?: string }> = ({ caseId }) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <OSISaudizationByLayers />
      
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="osi-saudization-layer" 
        companyId="demo-company" 
        enabledFeatures={['saudization-tracking', 'organizational-design', 'layer-analysis', 'localization']}
      />
      
      <AqlHRAIAssistant 
        moduleContext={`osi.saudization-layer${caseId ? `.case-${caseId}` : ''}`} 
        companyId="demo-company"
      />
    </div>
  );
};
