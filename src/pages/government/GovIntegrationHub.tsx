import { GovHubDashboard } from '@/components/government/GovHubDashboard';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

export const GovIntegrationHub = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <GovHubDashboard />
      
      {/* AI Integration for Government Hub */}
      <UniversalAIIntegrator 
        pageType="government" 
        moduleName="gov-integration-hub" 
        companyId="demo-company" 
        enabledFeatures={['compliance-monitoring', 'government-integration', 'saudi-regulations', 'regulatory-compliance']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="government.integration-hub" 
        companyId="demo-company"
      />
    </div>
  );
};