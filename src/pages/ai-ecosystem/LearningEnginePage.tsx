import React from 'react';
import { LearningEngine } from '@/components/ai-ecosystem/LearningEngine';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const LearningEnginePage: React.FC = () => {
  return (
    <div>
      <LearningEngine />
      
      {/* AI Integration for Learning Engine */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="learning-engine" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'machine-learning', 'learning-optimization', 'skill-development']}
      />
    </div>
  );
};

export default LearningEnginePage;