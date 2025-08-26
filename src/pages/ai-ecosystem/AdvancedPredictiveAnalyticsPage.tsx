import React from 'react';
import { AdvancedPredictiveAnalytics } from '@/components/ai-ecosystem/AdvancedPredictiveAnalytics';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AdvancedPredictiveAnalyticsPage: React.FC = () => {
  return (
    <div>
      <AdvancedPredictiveAnalytics />
      
      {/* AI Integration for Advanced Predictive Analytics */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="advanced-predictive-analytics" 
        companyId="demo-company" 
        enabledFeatures={['predictive-analytics', 'data-visualization', 'trend-analysis', 'machine-learning']}
      />
    </div>
  );
};

export default AdvancedPredictiveAnalyticsPage;