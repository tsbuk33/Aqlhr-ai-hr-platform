// Centralized translation utilities for AqlHR platform
// This provides consistent Arabic translations across all modules

export interface TranslationKeys {
  // Common UI elements
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  search: string;
  filter: string;
  export: string;
  import: string;
  upload: string;
  download: string;
  view: string;
  details: string;
  overview: string;
  reports: string;
  analytics: string;
  settings: string;
  
  // Status messages
  loading: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Time and dates
  today: string;
  yesterday: string;
  tomorrow: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  
  // Common terms
  total: string;
  active: string;
  inactive: string;
  pending: string;
  approved: string;
  rejected: string;
  draft: string;
  
  // HR specific terms
  employee: string;
  employees: string;
  department: string;
  position: string;
  salary: string;
  benefits: string;
  performance: string;
  training: string;
  attendance: string;
  leave: string;
  recruitment: string;
  onboarding: string;
  
  // Numbers and formatting
  currency: string;
  percentage: string;
  count: string;
}

export const translations: Record<'ar' | 'en', TranslationKeys> = {
  ar: {
    // Common UI elements
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    import: 'استيراد',
    upload: 'رفع',
    download: 'تحميل',
    view: 'عرض',
    details: 'التفاصيل',
    overview: 'نظرة عامة',
    reports: 'التقارير',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    
    // Status messages
    loading: 'جاري التحميل...',
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    warning: 'تحذير',
    info: 'معلومات',
    
    // Time and dates
    today: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غداً',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    thisYear: 'هذا العام',
    
    // Common terms
    total: 'إجمالي',
    active: 'نشط',
    inactive: 'غير نشط',
    pending: 'معلق',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    draft: 'مسودة',
    
    // HR specific terms
    employee: 'موظف',
    employees: 'الموظفين',
    department: 'القسم',
    position: 'المنصب',
    salary: 'الراتب',
    benefits: 'المزايا',
    performance: 'الأداء',
    training: 'التدريب',
    attendance: 'الحضور',
    leave: 'الإجازة',
    recruitment: 'التوظيف',
    onboarding: 'التهيئة',
    
    // Numbers and formatting
    currency: 'ريال سعودي',
    percentage: 'نسبة مئوية',
    count: 'العدد'
  },
  en: {
    // Common UI elements
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    upload: 'Upload',
    download: 'Download',
    view: 'View',
    details: 'Details',
    overview: 'Overview',
    reports: 'Reports',
    analytics: 'Analytics',
    settings: 'Settings',
    
    // Status messages
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    
    // Time and dates
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    
    // Common terms
    total: 'Total',
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    draft: 'Draft',
    
    // HR specific terms
    employee: 'Employee',
    employees: 'Employees',
    department: 'Department',
    position: 'Position',
    salary: 'Salary',
    benefits: 'Benefits',
    performance: 'Performance',
    training: 'Training',
    attendance: 'Attendance',
    leave: 'Leave',
    recruitment: 'Recruitment',
    onboarding: 'Onboarding',
    
    // Numbers and formatting
    currency: 'SAR',
    percentage: 'Percentage',
    count: 'Count'
  }
};

// Utility function to get translations
export const getTranslations = (language: 'ar' | 'en'): TranslationKeys => {
  return translations[language];
};

// Utility function for module-specific translations
export const getModuleTranslations = (language: 'ar' | 'en') => {
  const common = getTranslations(language);
  
  return {
    ...common,
    modules: {
      // Core HR
      employeeMasterData: language === 'ar' ? 'البيانات الأساسية للموظفين' : 'Employee Master Data',
      recruitment: language === 'ar' ? 'التوظيف والتعيين' : 'Recruitment & Hiring',
      payroll: language === 'ar' ? 'معالجة الرواتب' : 'Payroll Processing',
      benefits: language === 'ar' ? 'إدارة المزايا' : 'Benefits Administration',
      performanceManagement: language === 'ar' ? 'إدارة الأداء' : 'Performance Management',
      training: language === 'ar' ? 'التدريب والتطوير' : 'Training & Development',
      timeAttendance: language === 'ar' ? 'الوقت والحضور' : 'Time & Attendance',
      leaveManagement: language === 'ar' ? 'إدارة الإجازات' : 'Leave Management',
      
      // Government Integrations
      qiwa: language === 'ar' ? 'تكامل قوى' : 'Qiwa Integration',
      gosi: language === 'ar' ? 'تكامل التأمينات الاجتماعية' : 'GOSI Integration',
      absher: language === 'ar' ? 'منصة أبشر' : 'Absher Platform',
      mudad: language === 'ar' ? 'منصة مداد' : 'Mudad Platform',
      mol: language === 'ar' ? 'وزارة الموارد البشرية' : 'Ministry of Labor',
      
      // Strategic Planning
      workforcePlanning: language === 'ar' ? 'تخطيط القوى العاملة' : 'Workforce Planning',
      successionPlanning: language === 'ar' ? 'تخطيط التعاقب' : 'Succession Planning',
      diversityInclusion: language === 'ar' ? 'التنوع والشمول' : 'Diversity & Inclusion',
      employeeExperience: language === 'ar' ? 'تجربة الموظف' : 'Employee Experience',
      
      // AI & Analytics
      executiveIntelligence: language === 'ar' ? 'الذكاء التنفيذي' : 'Executive Intelligence',
      workforceAnalytics: language === 'ar' ? 'تحليلات القوى العاملة' : 'Workforce Analytics',
      predictiveAnalytics: language === 'ar' ? 'التحليلات التنبؤية' : 'Predictive Analytics',
      
      // Health & Safety
      healthSafety: language === 'ar' ? 'الصحة والسلامة' : 'Health & Safety',
      compliance: language === 'ar' ? 'الامتثال' : 'Compliance',
      riskAssessment: language === 'ar' ? 'تقييم المخاطر' : 'Risk Assessment'
    },
    
    // Common phrases and descriptions
    phrases: {
      comprehensiveManagement: language === 'ar' ? 'إدارة شاملة' : 'Comprehensive Management',
      aiPoweredInsights: language === 'ar' ? 'رؤى مدعومة بالذكاء الاصطناعي' : 'AI-Powered Insights',
      realTimeSync: language === 'ar' ? 'مزامنة فورية' : 'Real-time Sync',
      seamlessIntegration: language === 'ar' ? 'تكامل سلس' : 'Seamless Integration',
      advancedAnalytics: language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics',
      predictiveIntelligence: language === 'ar' ? 'ذكاء تنبؤي' : 'Predictive Intelligence',
      complianceMonitoring: language === 'ar' ? 'مراقبة الامتثال' : 'Compliance Monitoring',
      strategicPlanning: language === 'ar' ? 'التخطيط الاستراتيجي' : 'Strategic Planning'
    }
  };
};

// Date and number formatting utilities
export const formatters = {
  date: (date: Date, language: 'ar' | 'en') => {
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  number: (num: number, language: 'ar' | 'en') => {
    return num.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  },
  
  currency: (amount: number, language: 'ar' | 'en') => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  },
  
  percentage: (value: number, language: 'ar' | 'en') => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  }
};

// RTL/LTR utility classes
export const getDirectionClasses = (isRTL: boolean) => ({
  container: isRTL ? 'rtl-container' : 'ltr-container',
  text: isRTL ? 'text-right' : 'text-left',
  flex: isRTL ? 'flex-row-reverse' : 'flex-row',
  marginAuto: isRTL ? 'ml-auto' : 'mr-auto',
  paddingStart: isRTL ? 'pr-4' : 'pl-4',
  paddingEnd: isRTL ? 'pl-4' : 'pr-4',
  borderStart: isRTL ? 'border-r' : 'border-l',
  borderEnd: isRTL ? 'border-l' : 'border-r',
  roundedStart: isRTL ? 'rounded-r' : 'rounded-l',
  roundedEnd: isRTL ? 'rounded-l' : 'rounded-r',
  iconSpacing: isRTL ? 'ml-2' : 'mr-2'
});