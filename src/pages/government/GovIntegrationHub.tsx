import { GovHubDashboard } from '@/components/government/GovHubDashboard';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const GovIntegrationHub = () => {
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
    </div>
  );
};

export default GovIntegrationHub;