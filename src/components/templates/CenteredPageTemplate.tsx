import { useLanguage } from "@/hooks/useLanguageCompat";
import PageHeader from "@/components/common/PageHeader";

// Performance Management Page - CENTERED LAYOUT
const PerformanceManagementPage = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`page-container ${isArabic ? 'rtl' : 'ltr'}`}>
      <PageHeader
        title={isArabic ? 'إدارة الأداء' : 'Performance Management'}
        description={isArabic 
          ? 'نظام شامل لتقييم ومتابعة أداء الموظفين مع مؤشرات الأداء الرئيسية'
          : 'Comprehensive system for evaluating and monitoring employee performance with key performance indicators'
        }
      />
      
      <div className="page-content">
        {/* All content centered */}
        <div className="content-grid">
          {/* Performance management components */}
        </div>
      </div>
      
      <div className="page-footer">
        {/* Footer content centered */}
      </div>
    </div>
  );
};

export default PerformanceManagementPage;