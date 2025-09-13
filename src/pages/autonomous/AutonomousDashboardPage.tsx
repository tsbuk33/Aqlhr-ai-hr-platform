import React from 'react';
import AutonomousDashboard from '@/components/autonomous/AutonomousDashboard';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AutonomousDashboardPage: React.FC = () => {
  return (
    <div>
      <AutonomousDashboard />
      
      {/* AI Integration for Autonomous Dashboard */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="autonomous-dashboard" 
        companyId="demo-company" 
        enabledFeatures={[
          'autonomous-operations', 
          'intelligent-automation', 
          'saudi-compliance-monitoring',
          'real-time-insights',
          'executive-intelligence',
          'government-integration',
          'compliance-automation'
        ]}
      />
    </div>
  );
};

export default AutonomousDashboardPage;