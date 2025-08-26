import React from 'react';
import { AutonomousTaskExecutor } from '@/components/ai-ecosystem/AutonomousTaskExecutor';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AutonomousTaskExecutorPage: React.FC = () => {
  return (
    <div>
      <AutonomousTaskExecutor />
      
      {/* AI Integration for Autonomous Task Executor */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="autonomous-task-executor" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'workflow-automation', 'real-time-insights']}
      />
    </div>
  );
};

export default AutonomousTaskExecutorPage;