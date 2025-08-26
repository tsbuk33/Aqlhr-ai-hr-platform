import React from 'react';
import { AutomatedPolicyGenerator } from '@/components/ai-ecosystem/AutomatedPolicyGenerator';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AutomatedPolicyGeneratorPage: React.FC = () => {
  return (
    <div>
      <AutomatedPolicyGenerator />
      
      {/* AI Integration for Automated Policy Generator */}
      <UniversalAIIntegrator 
        pageType="compliance" 
        moduleName="automated-policy-generator" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'regulatory-compliance', 'intelligent-automation', 'audit-trails']}
      />
    </div>
  );
};

export default AutomatedPolicyGeneratorPage;