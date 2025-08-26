import React from 'react';
import { AqlHRCentralAIOrchestrator } from '@/components/ai-ecosystem/AqlHRCentralAIOrchestrator';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AqlHRCentralAIOrchestratorPage: React.FC = () => {
  return (
    <div>
      <AqlHRCentralAIOrchestrator />
      
      {/* AI Integration for AqlHR Central AI Orchestrator */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="aqlhr-central-ai-orchestrator" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'workflow-automation', 'strategic-intelligence']}
      />
    </div>
  );
};

export default AqlHRCentralAIOrchestratorPage;