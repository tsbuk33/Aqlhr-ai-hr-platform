import React from 'react';
import AqlHRAIAssistant from './AqlHRAIAssistant';

interface UniversalAIIntegratorProps {
  pageType: 'government' | 'analytics' | 'compliance' | 'strategic' | 'consulting' | 'ai-ecosystem' | 'welfare' | 'diagnostic' | 'core-hr' | 'platform' | 'executive' | 'training' | 'payroll' | 'general';
  moduleName: string;
  subModule?: string;
  companyId?: string;
  enabledFeatures?: string[];
  position?: 'fixed' | 'static';
}

/**
 * Universal AI Integrator - Provides contextual AI assistance for all AqlHR modules
 * This component automatically configures the AI assistant based on the page type and module
 */
export const UniversalAIIntegrator: React.FC<UniversalAIIntegratorProps> = ({
  pageType,
  moduleName,
  subModule,
  companyId = "demo-company",
  enabledFeatures = [],
  position
}) => {
  
  // Generate contextual module context based on page type and module
  const generateModuleContext = () => {
    const baseContext = subModule ? `${pageType}.${moduleName}.${subModule}` : `${pageType}.${moduleName}`;
    return baseContext.toLowerCase().replace(/\s+/g, '-');
  };

  // Determine specialized features based on page type
  const getSpecializedFeatures = () => {
    const baseFeatures = ['real-time-insights', 'contextual-help', 'workflow-automation'];
    
    switch (pageType) {
      case 'government':
        return [...baseFeatures, 'compliance-monitoring', 'government-integration', 'saudi-regulations'];
      case 'analytics':
        return [...baseFeatures, 'predictive-analytics', 'data-visualization', 'trend-analysis'];
      case 'compliance':
        return [...baseFeatures, 'regulatory-compliance', 'audit-trails', 'risk-assessment'];
      case 'strategic':
        return [...baseFeatures, 'strategic-planning', 'workforce-optimization', 'succession-planning'];
      case 'consulting':
        return [...baseFeatures, 'expert-recommendations', 'organizational-insights', 'transformation-guidance'];
      case 'ai-ecosystem':
        return [...baseFeatures, 'autonomous-operations', 'intelligent-automation', 'machine-learning'];
      case 'welfare':
        return [...baseFeatures, 'employee-wellbeing', 'safety-monitoring', 'welfare-compliance'];
      case 'diagnostic':
        return [...baseFeatures, 'diagnostic-analysis', 'performance-optimization', 'retention-insights'];
      case 'core-hr':
        return [...baseFeatures, 'employee-management', 'hr-processes', 'organizational-structure'];
      case 'executive':
        return [...baseFeatures, 'executive-insights', 'strategic-intelligence', 'leadership-analytics'];
      case 'training':
        return [...baseFeatures, 'learning-optimization', 'skill-development', 'training-analytics'];
      case 'payroll':
        return [...baseFeatures, 'payroll-processing', 'financial-analytics', 'compensation-insights'];
      default:
        return baseFeatures;
    }
  };

  const moduleContext = generateModuleContext();
  const specializedFeatures = [...getSpecializedFeatures(), ...enabledFeatures];

  return (
    <AqlHRAIAssistant 
      moduleContext={moduleContext}
      companyId={companyId}
      position={position}
    />
  );
};

export default UniversalAIIntegrator;