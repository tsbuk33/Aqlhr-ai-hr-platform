import { useLanguage } from "@/hooks/useLanguageCompat";

// Executive Intelligence Center - CENTERED
const ExecutiveIntelligenceCenter = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`page-container ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="executive-header text-center">
        <h1 className="text-4xl font-bold text-center mb-4">
          {isArabic ? 'مركز الذكاء التنفيذي عقل HR' : 'AqlHR Executive Intelligence Center'}
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
          {isArabic 
            ? 'نظام تشغيل الموارد البشرية المتقدم - تنسيق أكثر من 105 وحدة بتميز الذكاء الاصطناعي'
            : 'The Ultimate HR Operating System - Orchestrating 105+ Modules with AI Excellence'
          }
        </p>
      </div>
      
      <div className="executive-content">
        {/* Dashboard cards centered */}
        <div className="dashboard-grid">
          {/* All dashboard components */}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveIntelligenceCenter;