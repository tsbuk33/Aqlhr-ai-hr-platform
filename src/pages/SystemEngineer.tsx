import { useEffect } from 'react';
import SystemEngineerDashboard from '@/components/SystemEngineerDashboard';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const SystemEngineerPage = () => {
  useEffect(() => {
    document.title = 'AqlHR System Engineer - Auto-Adaptive AI SuperIntelligence';
  }, []);

  return (
    <>
      <SystemEngineerDashboard />
      <AqlHRAIAssistant moduleContext="systemEngineer.dashboard" />
      
      {/* AI Integration for System Engineer */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="system-engineer-dashboard" 
        companyId="demo-company" 
        enabledFeatures={['diagnostic-analysis', 'performance-optimization', 'real-time-insights', 'intelligent-automation']}
      />
    </>
  );
};

export default SystemEngineerPage;