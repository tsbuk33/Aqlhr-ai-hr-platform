import React from 'react';
import { AutonomousWorkflowOrchestrator } from '@/components/ai-ecosystem/AutonomousWorkflowOrchestrator';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AutonomousWorkflowOrchestratorPage: React.FC = () => {
  return (
    <div>
      <AutonomousWorkflowOrchestrator />
      
      {/* AI Integration for Autonomous Workflow Orchestrator */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="autonomous-workflow-orchestrator" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'workflow-automation', 'intelligent-automation', 'process-optimization']}
      />
    </div>
  );
};

export default AutonomousWorkflowOrchestratorPage;