import { useLanguage } from "@/hooks/useLanguageCompat";
import PageHeader from "@/components/common/PageHeader";
import { ReactNode } from "react";

interface PageTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
}

// Universal Page Template - CENTERED LAYOUT
// Apply this pattern to all platform pages for consistency
const PageTemplate = ({ title, description, children }: PageTemplateProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`page-container ${isArabic ? 'rtl' : 'ltr'}`}>
      <PageHeader title={title} description={description} />
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;

// List of pages to update with this centering pattern:
const pagesToUpdate = [
  'ExecutiveIntelligenceCenter',
  'PerformanceManagement',
  'EmployeeMasterData', 
  'PayrollProcessing',
  'HealthSafety',
  'GovernmentIntegrations',
  'WorkforceAnalytics',
  'AIFeatures',
  'MobileAIAssistant',
  'CrossModuleIntelligence',
  'AutomationWorkflows',
  'PredictiveAnalytics',
  'DocumentIntelligence'
];

// Usage example for any page:
// <PageTemplate 
//   title={isArabic ? 'العنوان بالعربية' : 'English Title'}
//   description={isArabic ? 'الوصف بالعربية' : 'English Description'}
// >
//   {/* Page content here */}
// </PageTemplate>