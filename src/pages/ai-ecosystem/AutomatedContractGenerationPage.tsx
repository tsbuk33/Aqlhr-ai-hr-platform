import React from 'react';
import { AutomatedContractGeneration } from '@/components/ai-ecosystem/AutomatedContractGeneration';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AutomatedContractGenerationPage: React.FC = () => {
  return (
    <div>
      <AutomatedContractGeneration />
      
      {/* AI Integration for Automated Contract Generation */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="automated-contract-generation" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'workflow-automation', 'compliance-monitoring']}
      />
    </div>
  );
};

export default AutomatedContractGenerationPage;