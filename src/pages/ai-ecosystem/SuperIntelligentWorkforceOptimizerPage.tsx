import React from 'react';
import { SuperIntelligentWorkforceOptimizer } from '@/components/ai-ecosystem/SuperIntelligentWorkforceOptimizer';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const SuperIntelligentWorkforceOptimizerPage: React.FC = () => {
  return (
    <div>
      <SuperIntelligentWorkforceOptimizer />
      
      {/* AI Integration for Super Intelligent Workforce Optimizer */}
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="super-intelligent-workforce-optimizer" 
        companyId="demo-company" 
        enabledFeatures={['strategic-planning', 'workforce-optimization', 'predictive-analytics', 'autonomous-operations']}
      />
    </div>
  );
};

export default SuperIntelligentWorkforceOptimizerPage;