import React from 'react';
import { RealtimeEventProcessor } from '@/components/ai-ecosystem/RealtimeEventProcessor';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const RealtimeEventProcessorPage: React.FC = () => {
  return (
    <div>
      <RealtimeEventProcessor />
      
      {/* AI Integration for Realtime Event Processor */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="realtime-event-processor" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'real-time-insights', 'intelligent-automation', 'predictive-analytics']}
      />
    </div>
  );
};

export default RealtimeEventProcessorPage;