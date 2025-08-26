import React from 'react';
import { AIDecisionEngine } from '@/components/ai-ecosystem/AIDecisionEngine';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AIDecisionEnginePage: React.FC = () => {
  return (
    <div>
      <AIDecisionEngine />
      
      {/* AI Integration for AI Decision Engine */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="ai-decision-engine" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'predictive-analytics', 'strategic-intelligence']}
      />
    </div>
  );
};

export default AIDecisionEnginePage;