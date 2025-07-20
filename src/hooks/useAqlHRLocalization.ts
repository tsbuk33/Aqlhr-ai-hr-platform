import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

// Comprehensive localization hook for AqlHR platform with correct Arabic branding
export const useAqlHRLocalization = () => {
  const { isArabic, language, toggleLanguage } = useSimpleLanguage();

  // Core platform branding with correct Arabic name
  const platformBranding = {
    name: isArabic ? 'عقل HR' : 'AqlHR',
    fullName: isArabic ? 'منصة عقل HR' : 'AqlHR Platform',
    tagline: isArabic ? 'ذكاء الموارد البشرية المتقدم' : 'Advanced HR Intelligence',
    description: isArabic ? 'نظام تشغيل الموارد البشرية المتقدم' : 'The Ultimate HR Operating System'
  };

  // Executive branding
  const executiveBranding = {
    centerName: isArabic ? 'مركز الذكاء التنفيذي عقل HR' : 'AqlHR Executive Intelligence Center',
    mobileApp: isArabic ? 'تطبيق عقل HR التنفيذي المحمول' : 'AqlHR Executive Mobile App',
    aiAssistant: isArabic ? 'مساعد عقل HR الذكي' : 'AqlHR AI Assistant'
  };

  // System messages with correct branding
  const systemMessages = {
    success: {
      save: isArabic ? 'تم الحفظ بنجاح في نظام عقل HR' : 'Successfully saved to AqlHR system',
      update: isArabic ? 'تم التحديث بنجاح في منصة عقل HR' : 'Successfully updated in AqlHR platform',
      sync: isArabic ? 'تم المزامنة بنجاح مع عقل HR' : 'Successfully synced with AqlHR',
      delete: isArabic ? 'تم الحذف بنجاح من عقل HR' : 'Successfully deleted from AqlHR'
    },
    error: {
      general: isArabic ? 'حدث خطأ في نظام عقل HR، يرجى المحاولة مرة أخرى' : 'An error occurred in AqlHR system, please try again',
      network: isArabic ? 'خطأ في الاتصال بخوادم عقل HR، تحقق من الإنترنت' : 'Connection error to AqlHR servers, check your internet',
      validation: isArabic ? 'يرجى التحقق من البيانات المدخلة في نظام عقل HR' : 'Please check the data entered in AqlHR system',
      unauthorized: isArabic ? 'ليس لديك صلاحية للوصول إلى هذا الجزء من عقل HR' : 'You don\'t have permission to access this part of AqlHR'
    },
    loading: {
      general: isArabic ? 'جاري التحميل من عقل HR...' : 'Loading from AqlHR...',
      saving: isArabic ? 'جاري الحفظ في عقل HR...' : 'Saving to AqlHR...',
      processing: isArabic ? 'جاري المعالجة في نظام عقل HR...' : 'Processing in AqlHR system...',
      analyzing: isArabic ? 'جاري التحليل بواسطة ذكاء عقل HR...' : 'Analyzing with AqlHR AI intelligence...'
    },
    confirmation: {
      delete: isArabic ? 'هل أنت متأكد من حذف هذا العنصر من عقل HR؟' : 'Are you sure you want to delete this item from AqlHR?',
      logout: isArabic ? 'هل تريد تسجيل الخروج من منصة عقل HR؟' : 'Do you want to log out from AqlHR platform?',
      reset: isArabic ? 'هل تريد إعادة تعيين البيانات في عقل HR؟' : 'Do you want to reset the data in AqlHR?'
    }
  };

  // Navigation items with proper Arabic branding
  const navigationItems = [
    {
      title: isArabic ? 'لوحة تحكم عقل HR' : 'AqlHR Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      description: isArabic ? 'النظرة الشاملة لمنصة عقل HR' : 'Complete overview of AqlHR platform'
    },
    {
      title: isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center',
      href: '/executive-center',
      icon: 'crown',
      description: isArabic ? 'مركز اتخاذ القرارات الاستراتيجية في عقل HR' : 'Strategic decision-making center in AqlHR',
      isPremium: true
    },
    {
      title: isArabic ? 'الموارد البشرية الأساسية' : 'Core HR',
      href: '/core-hr',
      icon: 'users',
      description: isArabic ? 'إدارة شاملة للموارد البشرية في عقل HR' : 'Comprehensive HR management in AqlHR',
      subItems: [
        { title: isArabic ? 'بيانات الموظف الرئيسية' : 'Employee Master Data', href: '/core-hr/employees' },
        { title: isArabic ? 'التوظيف والتعيين' : 'Recruitment & Hiring', href: '/core-hr/recruitment' },
        { title: isArabic ? 'معالجة الرواتب' : 'Payroll Processing', href: '/payroll' },
        { title: isArabic ? 'إدارة المزايا' : 'Benefits Administration', href: '/core-hr/benefits' },
        { title: isArabic ? 'إدارة الأداء' : 'Performance Management', href: '/core-hr/performance' },
        { title: isArabic ? 'التدريب والتطوير' : 'Training & Development', href: '/core-hr/training' }
      ]
    },
    {
      title: isArabic ? 'الذكاء الاصطناعي والتحليلات' : 'AI & Analytics',
      href: '/ai-analytics',
      icon: 'brain',
      description: isArabic ? 'قوة الذكاء الاصطناعي في عقل HR' : 'AI intelligence power in AqlHR',
      subItems: [
        { title: isArabic ? 'التحليلات التنفيذية' : 'Executive Analytics', href: '/analytics' },
        { title: isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics', href: '/analytics/workforce' },
        { title: isArabic ? 'ميزات الذكاء الاصطناعي' : 'AI Features', href: '/ai-features' },
        { title: isArabic ? 'التحليلات التنبؤية' : 'Predictive Analytics', href: '/ai-automation/predictive-analytics' },
        { title: isArabic ? 'مساعد عقل HR المحمول' : 'AqlHR Mobile AI Assistant', href: '/mobile-ai-assistant' }
      ]
    },
    {
      title: isArabic ? 'التكامل الحكومي' : 'Government Integrations',
      href: '/government',
      icon: 'government',
      description: isArabic ? 'التكامل مع الأنظمة الحكومية عبر عقل HR' : 'Integration with government systems via AqlHR',
      subItems: [
        { title: isArabic ? 'تكامل قوى' : 'Qiwa Integration', href: '/government/qiwa' },
        { title: isArabic ? 'تكامل التأمينات الاجتماعية' : 'GOSI Integration', href: '/government/gosi' },
        { title: isArabic ? 'تكامل وزارة الموارد البشرية' : 'HRSD Integration', href: '/government/hrsd' },
        { title: isArabic ? 'منصة أبشر' : 'Absher Platform', href: '/government/absher' }
      ]
    }
  ];

  // Form field labels with correct branding
  const formLabels = {
    employee: {
      name: isArabic ? 'اسم الموظف' : 'Employee Name',
      id: isArabic ? 'رقم الموظف في عقل HR' : 'Employee ID in AqlHR',
      department: isArabic ? 'القسم' : 'Department',
      position: isArabic ? 'المنصب' : 'Position',
      hireDate: isArabic ? 'تاريخ التوظيف' : 'Hire Date',
      salary: isArabic ? 'الراتب' : 'Salary',
      status: isArabic ? 'الحالة في عقل HR' : 'Status in AqlHR',
      email: isArabic ? 'البريد الإلكتروني' : 'Email',
      phone: isArabic ? 'رقم الهاتف' : 'Phone Number'
    },
    system: {
      save: isArabic ? 'حفظ في عقل HR' : 'Save to AqlHR',
      cancel: isArabic ? 'إلغاء' : 'Cancel',
      edit: isArabic ? 'تعديل' : 'Edit',
      delete: isArabic ? 'حذف' : 'Delete',
      search: isArabic ? 'البحث في عقل HR' : 'Search in AqlHR',
      filter: isArabic ? 'تصفية' : 'Filter',
      export: isArabic ? 'تصدير من عقل HR' : 'Export from AqlHR',
      import: isArabic ? 'استيراد إلى عقل HR' : 'Import to AqlHR'
    }
  };

  // Status labels with proper localization
  const statusLabels = {
    active: isArabic ? 'نشط' : 'Active',
    inactive: isArabic ? 'غير نشط' : 'Inactive',
    pending: isArabic ? 'في الانتظار' : 'Pending',
    approved: isArabic ? 'معتمد' : 'Approved',
    rejected: isArabic ? 'مرفوض' : 'Rejected',
    draft: isArabic ? 'مسودة' : 'Draft',
    published: isArabic ? 'منشور' : 'Published',
    archived: isArabic ? 'مؤرشف' : 'Archived',
    onboarding: isArabic ? 'تحت التدريب' : 'Onboarding',
    offboarding: isArabic ? 'في طور المغادرة' : 'Offboarding'
  };

  // Dashboard metrics with correct branding
  const dashboardMetrics = [
    {
      title: isArabic ? 'الوصول المحمول التنفيذي' : 'Executive Mobile Access',
      subtitle: isArabic ? 'تطبيق عقل HR التنفيذي' : 'AqlHR Executive App',
      value: isArabic ? 'الوصول المحمول' : 'Mobile Access'
    },
    {
      title: isArabic ? 'جاهز للمؤسسات العالمية' : 'Ready for Global Institutions',
      subtitle: isArabic ? 'منصة عقل HR العالمية' : 'Global AqlHR Platform',
      value: isArabic ? 'مؤسسة عالمية' : 'Global Institution'
    },
    {
      title: isArabic ? 'قدرة ذكاء اصطناعي نشطة' : 'Active AI Intelligence',
      subtitle: isArabic ? 'ذكاء عقل HR' : 'AqlHR Intelligence',
      value: isArabic ? 'ذكاء نشط' : 'Active AI'
    },
    {
      title: isArabic ? 'معالجة فورية للبيانات' : 'Instant Data Processing',
      subtitle: isArabic ? 'معالجة عقل HR' : 'AqlHR Processing',
      value: isArabic ? 'معالجة فورية' : 'Instant Processing'
    },
    {
      title: isArabic ? 'وقت تشغيل النظام' : 'System Uptime',
      subtitle: isArabic ? 'استقرار عقل HR' : 'AqlHR Stability',
      value: '99.9%'
    },
    {
      title: isArabic ? 'الوحدات المتكاملة' : 'Integrated Modules',
      subtitle: isArabic ? 'وحدات عقل HR' : 'AqlHR Modules',
      value: isArabic ? '+105 وحدة متكاملة' : '+105 Integrated Modules'
    }
  ];

  // Date and number formatting
  const formatters = {
    date: (date: Date) => {
      return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    shortDate: (date: Date) => {
      return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US');
    },
    time: (date: Date) => {
      return date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    currency: (amount: number) => {
      return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: 'SAR'
      }).format(amount);
    },
    number: (num: number) => {
      return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US').format(num);
    }
  };

  // CSS classes for RTL support
  const directionClasses = {
    text: isArabic ? 'text-right' : 'text-left',
    margin: {
      left: isArabic ? 'ml-0 mr-auto' : 'mr-0 ml-auto',
      right: isArabic ? 'mr-0 ml-auto' : 'ml-0 mr-auto'
    },
    padding: {
      left: isArabic ? 'pl-0 pr-4' : 'pr-0 pl-4',
      right: isArabic ? 'pr-0 pl-4' : 'pl-0 pr-4'
    },
    float: {
      left: isArabic ? 'float-right' : 'float-left',
      right: isArabic ? 'float-left' : 'float-right'
    }
  };

  return {
    // Language state
    isArabic,
    language,
    toggleLanguage,
    
    // Branding
    platformBranding,
    executiveBranding,
    
    // Localized content
    systemMessages,
    navigationItems,
    formLabels,
    statusLabels,
    dashboardMetrics,
    
    // Utilities
    formatters,
    directionClasses,
    
    // Direction attributes for components
    dir: isArabic ? 'rtl' : 'ltr',
    textAlign: isArabic ? 'right' : 'left'
  };
};

export default useAqlHRLocalization;