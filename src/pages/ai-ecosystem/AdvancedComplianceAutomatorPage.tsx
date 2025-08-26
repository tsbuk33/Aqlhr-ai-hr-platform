import React from 'react';
import { AdvancedComplianceAutomator } from '@/components/ai-ecosystem/AdvancedComplianceAutomator';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AdvancedComplianceAutomatorPage: React.FC = () => {
  return (
    <div>
      <AdvancedComplianceAutomator />
      
      {/* AI Integration for Advanced Compliance Automator */}
      <UniversalAIIntegrator 
        pageType="compliance" 
        moduleName="advanced-compliance-automator" 
        companyId="demo-company" 
        enabledFeatures={['regulatory-compliance', 'audit-trails', 'risk-assessment', 'intelligent-automation']}
      />
    </div>
  );
};

export default AdvancedComplianceAutomatorPage;