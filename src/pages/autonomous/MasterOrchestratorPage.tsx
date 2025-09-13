import React from 'react';
import MasterOrchestratorDashboard from '@/components/autonomous/MasterOrchestratorDashboard';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const MasterOrchestratorPage: React.FC = () => {
  return (
    <div>
      <MasterOrchestratorDashboard />
      
      {/* AI Integration for Master Orchestrator */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="master-autonomous-orchestrator" 
        companyId="demo-company" 
        enabledFeatures={[
          'autonomous-operations', 
          'intelligent-automation', 
          'workflow-automation', 
          'strategic-intelligence',
          'real-time-insights',
          'predictive-analytics',
          'government-compliance',
          'executive-dashboards'
        ]}
      />
    </div>
  );
};

export default MasterOrchestratorPage;