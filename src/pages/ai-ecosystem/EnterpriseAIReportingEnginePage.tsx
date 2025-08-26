import React from 'react';
import { EnterpriseAIReportingEngine } from '@/components/ai-ecosystem/EnterpriseAIReportingEngine';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const EnterpriseAIReportingEnginePage: React.FC = () => {
  return (
    <div>
      <EnterpriseAIReportingEngine />
      
      {/* AI Integration for Enterprise AI Reporting Engine */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="enterprise-ai-reporting-engine" 
        companyId="demo-company" 
        enabledFeatures={['predictive-analytics', 'data-visualization', 'executive-insights', 'strategic-intelligence']}
      />
    </div>
  );
};

export default EnterpriseAIReportingEnginePage;