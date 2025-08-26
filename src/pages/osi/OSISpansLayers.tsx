import React from 'react';
import { OSILayers } from '@/components/diagnostic/OSILayers';
import { OSISpan } from '@/components/diagnostic/OSISpan';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

export const OSISpansLayers: React.FC<{ caseId?: string }> = ({ caseId }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <OSILayers />
        <OSISpan />
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="osi-spans-layers" 
        companyId="demo-company" 
        enabledFeatures={['organizational-design', 'layer-analysis', 'span-analysis', 'osi-analytics']}
      />
      
      <AqlHRAIAssistant 
        moduleContext={`osi.spans-layers${caseId ? `.case-${caseId}` : ''}`} 
        companyId="demo-company"
      />
    </div>
  );
};
