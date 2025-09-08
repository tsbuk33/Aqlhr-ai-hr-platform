import React, { createContext, useContext, useEffect, useState } from 'react';

// Comprehensive Arabic translations for all AQLHR modules
const translations = {
  ar: {
    // Core Navigation
    'لوحة التحكم': 'لوحة التحكم',
    'مركز الذكاء التنفيذي عقل HR': 'مركز الذكاء التنفيذي عقل HR',
    'الموارد البشرية الأساسية': 'الموارد البشرية الأساسية',
    'بيانات الموظفين الرئيسية': 'بيانات الموظفين الرئيسية',
    'التوظيف والتعيين': 'التوظيف والتعيين',
    'معالجة الرواتب': 'معالجة الرواتب',
    'إدارة المزايا': 'إدارة المزايا',
    'إدارة الأداء': 'إدارة الأداء',
    'التدريب والتطوير': 'التدريب والتطوير',
    'الوقت والحضور': 'الوقت والحضور',
    'إدارة الإجازات': 'إدارة الإجازات',
    'تخطيط التعاقب': 'تخطيط التعاقب',
    'إدارة التعويضات': 'إدارة التعويضات',
    'حاسبة السعودة والتأشيرات': 'حاسبة السعودة والتأشيرات',
    'الخدمة الذاتية للموظفين': 'الخدمة الذاتية للموظفين',
    'لوحة تحكم المدير': 'لوحة تحكم المدير',
    
    // LEO Module - Complete Arabic Translation
    'LEO - Learning Experience Optimization': 'تحسين تجربة التعلم - ليو',
    'LEO': 'ليو',
    'Learning Experience Optimization': 'تحسين تجربة التعلم',
    'Dashboard': 'لوحة التحكم',
    'My Learning': 'تعلمي',
    'Skills Progress': 'تقدم المهارات',
    'Learning Paths': 'مسارات التعلم',
    'Smart AI': 'الذكاء الاصطناعي الذكي',
    'Analytics': 'التحليلات',
    'AI-Powered Micro-Learning Platform': 'منصة التعلم المصغر المدعومة بالذكاء الاصطناعي',
    'Personalized learning experiences with intelligent content delivery': 'تجارب تعلم مخصصة مع توصيل المحتوى الذكي',
    
    // GEO Module - Complete Arabic Translation
    'GEO - Generative Engagement Optimization': 'تحسين المشاركة التوليدية - جيو',
    'GEO': 'جيو',
    'Generative Engagement Optimization': 'تحسين المشاركة التوليدية',
    'Employee Engagement': 'مشاركة الموظفين',
    'Feedback Systems': 'أنظمة التغذية الراجعة',
    'Recognition Programs': 'برامج التقدير',
    'Culture Analytics': 'تحليلات الثقافة',
    'Engagement Surveys': 'استطلاعات المشاركة',
    'Team Building': 'بناء الفريق',
    
    // Analytics Module - Complete Arabic Translation
    'analytics.title': 'التحليلات المتقدمة',
    'analytics.description': 'تحليلات شاملة للموارد البشرية والأداء التنظيمي',
    'Analytics Dashboard': 'لوحة تحكم التحليلات',
    'Performance Metrics': 'مؤشرات الأداء',
    'Workforce Analytics': 'تحليلات القوى العاملة',
    'Predictive Insights': 'الرؤى التنبؤية',
    'Data Visualization': 'تصور البيانات',
    'Custom Reports': 'التقارير المخصصة',
    'Real-time Monitoring': 'المراقبة في الوقت الفعلي',
    
    // Skills Intelligence Module
    'ذكاء المهارات وتحليل الوظائف': 'ذكاء المهارات وتحليل الوظائف',
    'Skills Intelligence & Job Analysis': 'ذكاء المهارات وتحليل الوظائف',
    'Skills Assessment': 'تقييم المهارات',
    'Job Analysis': 'تحليل الوظائف',
    'Competency Mapping': 'خريطة الكفاءات',
    'Skills Gap Analysis': 'تحليل فجوة المهارات',
    'Career Development': 'التطوير المهني',
    'Talent Management': 'إدارة المواهب',
    
    // AI & Analytics Section
    'الذكاء الاصطناعي والتحليلات': 'الذكاء الاصطناعي والتحليلات',
    'AI Intelligence': 'الذكاء الاصطناعي',
    'Advanced Analytics': 'التحليلات المتقدمة',
    'Machine Learning': 'التعلم الآلي',
    'Predictive Analytics': 'التحليلات التنبؤية',
    'Data Science': 'علم البيانات',
    'Business Intelligence': 'ذكاء الأعمال',
    
    // Smart Automation Engine
    'محرك الأتمتة الذكي': 'محرك الأتمتة الذكي',
    'Smart Automation Engine': 'محرك الأتمتة الذكي',
    'Process Automation': 'أتمتة العمليات',
    'Workflow Management': 'إدارة سير العمل',
    'Task Automation': 'أتمتة المهام',
    'Intelligent Routing': 'التوجيه الذكي',
    'Auto-Approval': 'الموافقة التلقائية',
    'Smart Notifications': 'الإشعارات الذكية',
    
    // Government Integrations
    'التكاملات الحكومية': 'التكاملات الحكومية',
    'Government Integrations': 'التكاملات الحكومية',
    'تكامل قوى': 'تكامل قوى',
    'تكامل التأمينات الاجتماعية': 'تكامل التأمينات الاجتماعية',
    'منصة أبشر': 'منصة أبشر',
    'منصة علم': 'منصة علم',
    'منصة مقيم': 'منصة مقيم',
    'منصة صحة': 'منصة صحة',
    'منصة شي': 'منصة شي',
    'مدد': 'مدد',
    'تكامل وزارة الموارد البشرية': 'تكامل وزارة الموارد البشرية',
    'دروب التقني': 'دروب التقني',
    'تقييم قياس': 'تقييم قياس',
    'اعتماد هيئة تقويم التعليم': 'اعتماد هيئة تقويم التعليم',
    'وزارة التعليم': 'وزارة التعليم',
    'طاقات صندوق تنمية الموارد البشرية': 'طاقات صندوق تنمية الموارد البشرية',
    'المركز الوطني للتوظيف': 'المركز الوطني للتوظيف',
    
    // Common UI Elements
    'Overview': 'نظرة عامة',
    'Settings': 'الإعدادات',
    'Reports': 'التقارير',
    'Export': 'تصدير',
    'Import': 'استيراد',
    'Save': 'حفظ',
    'Cancel': 'إلغاء',
    'Delete': 'حذف',
    'Edit': 'تعديل',
    'Add': 'إضافة',
    'Search': 'بحث',
    'Filter': 'تصفية',
    'Sort': 'ترتيب',
    'View': 'عرض',
    'Print': 'طباعة',
    'Download': 'تحميل',
    'Upload': 'رفع',
    'Submit': 'إرسال',
    'Approve': 'موافقة',
    'Reject': 'رفض',
    'Pending': 'معلق',
    'Active': 'نشط',
    'Inactive': 'غير نشط',
    'Completed': 'مكتمل',
    'In Progress': 'قيد التنفيذ',
    'Draft': 'مسودة',
    'Published': 'منشور',
    'Archived': 'مؤرشف'
  },
  en: {
    // Keep English as fallback
    'Dashboard': 'Dashboard',
    'Executive Intelligence Center': 'Executive Intelligence Center',
    'Core HR': 'Core HR',
    'LEO - Learning Experience Optimization': 'LEO - Learning Experience Optimization',
    'GEO - Generative Engagement Optimization': 'GEO - Generative Engagement Optimization',
    'Analytics': 'Analytics',
    'Skills Intelligence & Job Analysis': 'Skills Intelligence & Job Analysis',
    'AI Intelligence': 'AI Intelligence',
    'Smart Automation Engine': 'Smart Automation Engine',
    'Government Integrations': 'Government Integrations'
  }
};

interface LanguageContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const ComprehensiveLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const isRTL = language === 'ar';

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  // Apply RTL/LTR and language-specific styling
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    if (language === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      body.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
      body.style.textAlign = 'center';
      
      // Apply comprehensive RTL styling
      const style = document.createElement('style');
      style.textContent = `
        * {
          direction: rtl !important;
        }
        
        .sidebar {
          right: 0 !important;
          left: auto !important;
        }
        
        .main-content {
          margin-right: 280px !important;
          margin-left: 0 !important;
          text-align: center !important;
        }
        
        .nav-item {
          text-align: right !important;
          padding-right: 1rem !important;
          padding-left: 0.5rem !important;
        }
        
        .card, .panel, .dashboard-card {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .btn, .button {
          direction: rtl !important;
        }
        
        .form-control, .input {
          text-align: right !important;
          direction: rtl !important;
        }
        
        .table {
          direction: rtl !important;
        }
        
        .table th, .table td {
          text-align: center !important;
        }
        
        .dropdown-menu {
          right: 0 !important;
          left: auto !important;
        }
        
        .modal-content {
          direction: rtl !important;
          text-align: center !important;
        }
        
        .breadcrumb {
          direction: rtl !important;
        }
        
        .pagination {
          direction: rtl !important;
        }
        
        .alert {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .badge {
          direction: rtl !important;
        }
        
        .progress {
          direction: rtl !important;
        }
        
        .list-group-item {
          text-align: right !important;
          direction: rtl !important;
        }
        
        .nav-tabs .nav-link {
          text-align: center !important;
        }
        
        .tab-content {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .chart-container {
          direction: ltr !important;
        }
        
        .metric-card {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .dashboard-grid {
          direction: rtl !important;
        }
        
        .sidebar-nav {
          direction: rtl !important;
        }
        
        .content-wrapper {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .page-header {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .page-content {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .section-title {
          text-align: center !important;
        }
        
        .section-content {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .leo-module, .geo-module, .analytics-module {
          direction: rtl !important;
          text-align: center !important;
        }
        
        .leo-module h1, .leo-module h2, .leo-module h3,
        .geo-module h1, .geo-module h2, .geo-module h3,
        .analytics-module h1, .analytics-module h2, .analytics-module h3 {
          text-align: center !important;
        }
        
        .leo-tabs, .geo-tabs, .analytics-tabs {
          direction: rtl !important;
        }
        
        .leo-content, .geo-content, .analytics-content {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .recruitment-module {
          direction: rtl !important;
          text-align: center !important;
        }
        
        .recruitment-tabs {
          direction: rtl !important;
        }
        
        .recruitment-content {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .platform-card {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .agent-card {
          text-align: center !important;
          direction: rtl !important;
        }
        
        .communication-hub {
          direction: rtl !important;
          text-align: center !important;
        }
        
        .compliance-dashboard {
          direction: rtl !important;
          text-align: center !important;
        }
        
        .analytics-dashboard {
          direction: rtl !important;
          text-align: center !important;
        }
      `;
      document.head.appendChild(style);
      
      // Replace English text with Arabic translations
      setTimeout(() => {
        replaceTextContent();
      }, 100);
      
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      body.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
      body.style.textAlign = 'left';
      
      // Remove RTL styles
      const rtlStyles = document.querySelectorAll('style');
      rtlStyles.forEach(style => {
        if (style.textContent?.includes('direction: rtl')) {
          style.remove();
        }
      });
    }
  }, [language]);

  // Function to replace text content with translations
  const replaceTextContent = () => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent?.trim();
      if (text && translations[language][text]) {
        textNode.textContent = translations[language][text];
      }
    });

    // Replace specific elements by their content
    const elementsToTranslate = document.querySelectorAll('[data-translate], h1, h2, h3, h4, h5, h6, .nav-link, .btn, .card-title, .page-title, .section-title');
    elementsToTranslate.forEach(element => {
      const text = element.textContent?.trim();
      if (text && translations[language][text]) {
        element.textContent = translations[language][text];
      }
    });

    // Handle specific problematic elements
    const leoElements = document.querySelectorAll('[data-module="leo"], .leo-module');
    leoElements.forEach(element => {
      if (element.textContent?.includes('LEO - Learning Experience Optimization')) {
        element.textContent = element.textContent.replace('LEO - Learning Experience Optimization', 'تحسين تجربة التعلم - ليو');
      }
      if (element.textContent?.includes('LEO')) {
        element.textContent = element.textContent.replace(/\bLEO\b/g, 'ليو');
      }
    });

    const geoElements = document.querySelectorAll('[data-module="geo"], .geo-module');
    geoElements.forEach(element => {
      if (element.textContent?.includes('GEO - Generative Engagement Optimization')) {
        element.textContent = element.textContent.replace('GEO - Generative Engagement Optimization', 'تحسين المشاركة التوليدية - جيو');
      }
      if (element.textContent?.includes('GEO')) {
        element.textContent = element.textContent.replace(/\bGEO\b/g, 'جيو');
      }
    });

    // Fix analytics translation keys
    const analyticsElements = document.querySelectorAll('.analytics-module, [data-module="analytics"]');
    analyticsElements.forEach(element => {
      if (element.textContent?.includes('analytics.title')) {
        element.textContent = element.textContent.replace('analytics.title', 'التحليلات المتقدمة');
      }
      if (element.textContent?.includes('analytics.description')) {
        element.textContent = element.textContent.replace('analytics.description', 'تحليلات شاملة للموارد البشرية والأداء التنظيمي');
      }
    });
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a ComprehensiveLanguageProvider');
  }
  return context;
};

export default ComprehensiveLanguageProvider;

