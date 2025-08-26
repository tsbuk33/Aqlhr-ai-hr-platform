import React from 'react';
import { IntelligenceGatherer } from '@/components/ai-ecosystem/IntelligenceGatherer';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const IntelligenceGathererPage: React.FC = () => {
  return (
    <div>
      <IntelligenceGatherer />
      
      {/* AI Integration for Intelligence Gatherer */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="intelligence-gatherer" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'data-visualization', 'trend-analysis']}
      />
    </div>
  );
};

export default IntelligenceGathererPage;