import { useLanguage } from "@/hooks/useLanguageCompat";
import { AqlHRAIAssistant } from '@/components/ai';
import { localePath, resolveLang } from '@/lib/i18n/localePath';

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
          <div className="flex justify-center">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">
                {isArabic ? 'مرحباً بك في مركز الذكاء التنفيذي' : 'Welcome to Executive Intelligence Center'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isArabic 
                  ? 'يرجى الانتقال إلى مركز التنفيذي للوصول إلى جميع الميزات'
                  : 'Please navigate to Executive Center to access all features'
                }
              </p>
              <button 
                onClick={() => window.location.href = localePath('dashboard')}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isArabic ? 'انتقل إلى لوحة التحكم' : 'Go to Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AqlHRAIAssistant 
        moduleContext="executive.intelligence" 
        position="fixed"
        className="executive-ai-assistant"
      />
    </div>
  );
};

export default ExecutiveIntelligenceCenter;