import React from 'react';
import { AICommandCenter } from '@/components/ai-ecosystem/AICommandCenter';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AICommandCenterPage: React.FC = () => {
  return (
    <div>
      <AICommandCenter />
      
      {/* AI Integration for AI Command Center */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="ai-command-center" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'real-time-insights', 'workflow-automation']}
      />
    </div>
  );
};

export default AICommandCenterPage;