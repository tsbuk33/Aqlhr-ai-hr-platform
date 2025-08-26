import React from 'react';
import { AutonomousPerformanceManager } from '@/components/ai-ecosystem/AutonomousPerformanceManager';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AutonomousPerformanceManagerPage: React.FC = () => {
  return (
    <div>
      <AutonomousPerformanceManager />
      
      {/* AI Integration for Autonomous Performance Manager */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="autonomous-performance-manager" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'performance-optimization', 'employee-management', 'intelligent-automation']}
      />
    </div>
  );
};

export default AutonomousPerformanceManagerPage;