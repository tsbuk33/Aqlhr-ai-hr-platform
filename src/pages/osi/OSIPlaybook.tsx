import React from 'react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

export const OSIPlaybook: React.FC<{ caseId?: string }> = ({ caseId }) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">OSI Playbook</h1>
        <p className="text-muted-foreground">Organizational Structure Index strategic playbook and recommendations</p>
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="osi-playbook" 
        companyId="demo-company" 
        enabledFeatures={['strategic-planning', 'organizational-design', 'playbook-generation', 'recommendations']}
      />
      
      <AqlHRAIAssistant 
        moduleContext={`osi.playbook${caseId ? `.case-${caseId}` : ''}`} 
        companyId="demo-company"
      />
    </div>
  );
};
