import React from 'react';
import { useLocation } from 'react-router-dom';
import { UniversalAIIntegrator } from './UniversalAIIntegrator';

interface PageWithAIProps {
  children: React.ReactNode;
  pageType?: 'government' | 'analytics' | 'compliance' | 'strategic' | 'consulting' | 'ai-ecosystem' | 'welfare' | 'diagnostic' | 'core-hr' | 'platform' | 'executive' | 'training' | 'payroll' | 'general';
  moduleName?: string;
  subModule?: string;
  enabledFeatures?: string[];
}

/**
 * Higher-order component that automatically adds AI integration to any page
 * Based on the current route, it intelligently determines the appropriate AI context
 */
export const PageWithAI: React.FC<PageWithAIProps> = ({
  children,
  pageType,
  moduleName,
  subModule,
  enabledFeatures = []
}) => {
  const location = useLocation();
  
  // Auto-determine page type and module name from route if not provided
  const getPageConfigFromRoute = () => {
    const path = location.pathname.toLowerCase();
    
    // Extract module from path
    const segments = path.split('/').filter(Boolean);
    const routeModule = segments[segments.length - 1] || 'dashboard';
    
    // Determine page type based on route patterns
    let detectedPageType: typeof pageType = 'general';
    let detectedModuleName = moduleName || routeModule;
    let defaultFeatures: string[] = [];
    
    if (path.includes('/government') || path.includes('/gov-')) {
      detectedPageType = 'government';
      defaultFeatures = ['compliance-monitoring', 'government-integration', 'saudi-regulations'];
    } else if (path.includes('/analytics') || path.includes('/executive-center')) {
      detectedPageType = 'analytics';
      defaultFeatures = ['predictive-analytics', 'data-visualization', 'trend-analysis'];
    } else if (path.includes('/compliance') || path.includes('/audit')) {
      detectedPageType = 'compliance';
      defaultFeatures = ['regulatory-compliance', 'audit-trails', 'risk-assessment'];
    } else if (path.includes('/ai-ecosystem') || path.includes('/ai-')) {
      detectedPageType = 'ai-ecosystem';
      defaultFeatures = ['autonomous-operations', 'intelligent-automation', 'machine-learning'];
    } else if (path.includes('/diagnostic') || path.includes('/retention')) {
      detectedPageType = 'diagnostic';
      defaultFeatures = ['diagnostic-analysis', 'performance-optimization', 'retention-insights'];
    } else if (path.includes('/employees') || path.includes('/people') || path.includes('/recruitment') || path.includes('/performance')) {
      detectedPageType = 'core-hr';
      defaultFeatures = ['employee-management', 'hr-processes', 'organizational-structure'];
    } else if (path.includes('/training') || path.includes('/learning')) {
      detectedPageType = 'training';
      defaultFeatures = ['learning-optimization', 'skill-development', 'training-analytics'];
    } else if (path.includes('/payroll') || path.includes('/compensation')) {
      detectedPageType = 'payroll';
      defaultFeatures = ['payroll-processing', 'financial-analytics', 'compensation-insights'];
    } else if (path.includes('/admin') || path.includes('/system')) {
      detectedPageType = 'platform';
      defaultFeatures = ['system-management', 'user-administration', 'security-monitoring'];
    } else if (path.includes('/strategic') || path.includes('/consulting')) {
      detectedPageType = 'strategic';
      defaultFeatures = ['strategic-planning', 'workforce-optimization', 'succession-planning'];
    }
    
    return {
      pageType: pageType || detectedPageType,
      moduleName: detectedModuleName,
      features: [...defaultFeatures, ...enabledFeatures]
    };
  };
  
  const config = getPageConfigFromRoute();
  
  return (
    <>
      {children}
      <UniversalAIIntegrator
        pageType={config.pageType}
        moduleName={config.moduleName}
        subModule={subModule}
        companyId="demo-company"
        enabledFeatures={config.features}
      />
    </>
  );
};

export default PageWithAI;