import React from 'react';
import { PredictiveWorkforcePlanner } from '@/components/ai-ecosystem/PredictiveWorkforcePlanner';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const PredictiveWorkforcePlannerPage: React.FC = () => {
  return (
    <div>
      <PredictiveWorkforcePlanner />
      
      {/* AI Integration for Predictive Workforce Planner */}
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="predictive-workforce-planner" 
        companyId="demo-company" 
        enabledFeatures={['strategic-planning', 'workforce-optimization', 'predictive-analytics', 'succession-planning']}
      />
    </div>
  );
};

export default PredictiveWorkforcePlannerPage;