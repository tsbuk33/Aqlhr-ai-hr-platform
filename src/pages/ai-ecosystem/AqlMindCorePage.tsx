import React from 'react';
import { AqlMindCore } from '@/components/ai-ecosystem/AqlMindCore';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AqlMindCorePage: React.FC = () => {
  return (
    <div>
      <AqlMindCore />
      
      {/* AI Integration for AqlMind Core */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="aql-mind-core" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'machine-learning', 'contextual-help']}
      />
    </div>
  );
};

export default AqlMindCorePage;