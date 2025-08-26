import React from 'react';
import { SaudiAIComplianceEngine } from '@/components/ai-ecosystem/SaudiAIComplianceEngine';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const SaudiAIComplianceEnginePage: React.FC = () => {
  return (
    <div>
      <SaudiAIComplianceEngine />
      
      {/* AI Integration for Saudi AI Compliance Engine */}
      <UniversalAIIntegrator 
        pageType="compliance" 
        moduleName="saudi-ai-compliance-engine" 
        companyId="demo-company" 
        enabledFeatures={['compliance-monitoring', 'saudi-regulations', 'regulatory-compliance', 'audit-trails']}
      />
    </div>
  );
};

export default SaudiAIComplianceEnginePage;