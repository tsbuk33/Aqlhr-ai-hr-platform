import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  isArabic: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load translations based on selected language
    loadTranslations(language);
    
    // Set document direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Save language preference
    localStorage.setItem('aqlhr_language', language);
  }, [language]);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('aqlhr_language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const loadTranslations = async (lang: 'ar' | 'en') => {
    try {
      const response = await fetch(`/api/translations/${lang}`);
      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to default translations
      setTranslations(getDefaultTranslations(lang));
    }
  };

  const getDefaultTranslations = (lang: 'ar' | 'en') => {
    const defaultTranslations = {
      ar: {
        // Dashboard
        dashboard: {
          title: 'نظام عقل للموارد البشرية',
          subtitle: 'منصة ذكية ومتطورة لإدارة الموارد البشرية في المملكة العربية السعودية',
          all_systems_operational: 'جميع الأنظمة تعمل بشكل طبيعي',
          modules_active: 'وحدة نشطة',
          government_integrations_live: 'التكاملات الحكومية مفعلة',
          total_employees: 'إجمالي الموظفين',
          complete_profile_management: 'إدارة ملفات شخصية كاملة',
          ai_processes: 'عمليات الذكاء الاصطناعي',
          gov_integrations: 'التكاملات الحكومية',
          compliance_score: 'نقاط الامتثال',
          regulatory_compliance: 'الامتثال التنظيمي',
          saudization_rate: 'معدل السعودة',
          green_nitaqat_target: 'هدف النطاق الأخضر',
          active_users: 'المستخدمون النشطون',
          employee_self_service: 'الخدمة الذاتية للموظفين',
          documents_processed: 'المستندات المعالجة',
          ai_powered_verification: 'التحقق بالذكاء الاصطناعي',
          training_hours: 'ساعات التدريب',
          skills_development_completed: 'تطوير المهارات مكتمل',
          monthly_payroll: 'الراتب الشهري',
          december_2024_processed: 'ديسمبر 2024 تم معالجته',
          attendance_rate: 'معدل الحضور',
          real_time_tracking: 'تتبع في الوقت الفعلي',
          platform_status_overview: 'نظرة عامة على حالة المنصة',
          core_hr_modules: 'وحدات الموارد البشرية الأساسية',
          payroll_modules: 'وحدات الرواتب',
          ai_features: 'ميزات الذكاء الاصطناعي',
          active_workflows: 'سير العمل النشط',
          system_engineer: 'مهندس النظام الذكي',
          system_engineer_description: 'نظام ذكي متطور للتشخيص الذاتي والإصلاح التلقائي وتحسين الأداء',
          auto_adaptive: 'تكيف تلقائي',
          future_proof: 'مقاوم للمستقبل',
          continuous_monitoring: 'مراقبة مستمرة',
          open_dashboard: 'فتح لوحة التحكم'
        },
        
        // Upload
        upload: {
          company_data_integration: 'تكامل بيانات الشركة',
          company_data_integration_desc: 'رفع ملفات بيانات الشركة للتكامل التلقائي مع جميع وحدات عقل والأنظمة الذكية',
          integration_complete: 'اكتمال التكامل',
          integration_complete_desc: 'تم معالجة وتكامل بيانات الشركة من {filename} في أنظمة عقل. جميع الوحدات وأدوات الذكاء الاصطناعي محدثة الآن.',
          processing_data: 'معالجة بيانات الشركة...',
          integrating_systems: 'التكامل مع وحدات الموارد البشرية والأنظمة الذكية',
          complete: 'مكتمل',
          drag_drop_files: 'اسحب وأفلت ملفات شركتك هنا',
          supported_formats: 'يدعم: Excel، PDF، Word، PowerPoint، الصور، الأرشيف، ملفات التصميم والمزيد',
          browse_files: 'تصفح الملفات',
          ai_powered_integration: 'التكامل بالذكاء الاصطناعي',
          ai_powered_integration_desc: 'البيانات المرفوعة تتزامن تلقائياً مع الرواتب، تحليلات الموارد البشرية، وحدات الامتثال، وأنظمة الذكاء الاصطناعي التنبؤية. يدعم أكثر من 50 تنسيق ملف مع استخراج ومعالجة ذكية للبيانات.'
        },

        // System Engineer translations
        system_engineer: {
          autonomous_brain: 'العقل المستقل',
          autonomous_brain_desc: 'نظام ذكي للتشخيص الذاتي والإصلاح التلقائي',
          predictive_analytics: 'التحليلات التنبؤية',
          predictive_analytics_desc: 'تحليلات ذكية لتوقع الاتجاهات والمخاطر',
          compliance_automation: 'أتمتة الامتثال',
          compliance_automation_desc: 'مراقبة وتصحيح الامتثال التلقائي',
          translation_integrity: 'سلامة الترجمة',
          translation_integrity_desc: 'محرك ذكي لضمان جودة الترجمة',
          system_status: 'حالة النظام',
          autonomous_operations: 'العمليات المستقلة',
          performance_metrics: 'مقاييس الأداء',
          learning_algorithms: 'خوارزميات التعلم',
          system_health: 'صحة النظام',
          optimal: 'مثلى',
          active_learning: 'التعلم النشط',
          continuous: 'مستمر',
          auto_healing: 'الشفاء التلقائي',
          self_optimization: 'التحسين الذاتي',
          quantum_security: 'الأمان الكمي',
          predictive_accuracy: 'دقة التنبؤ',
          real_time_adaptation: 'التكيف في الوقت الفعلي',
          intelligence_score: 'نقاط الذكاء',
          system_reliability: 'موثوقية النظام',
          autonomous_decision_making: 'صنع القرار المستقل',
          performance_optimization: 'تحسين الأداء',
          issue_prediction: 'توقع المشاكل',
          auto_resolution: 'الحل التلقائي',
          learning_efficiency: 'كفاءة التعلم',
          trend_analysis: 'تحليل الاتجاهات',
          saudization_forecasting: 'توقع السعودة',
          workforce_insights: 'رؤى القوى العاملة',
          business_intelligence: 'ذكاء الأعمال',
          compliance_monitoring: 'مراقبة الامتثال',
          government_sync: 'مزامنة حكومية',
          auto_reporting: 'التقارير التلقائية',
          violation_detection: 'كشف المخالفات',
          auto_correction: 'التصحيح التلقائي',
          regulatory_updates: 'التحديثات التنظيمية',
          translation_healing: 'شفاء الترجمة',
          missing_keys: 'مفاتيح مفقودة',
          inconsistencies: 'التناقضات',
          quality_assurance: 'ضمان الجودة',
          auto_translation: 'الترجمة التلقائية',
          context_verification: 'التحقق من السياق',
          healing_complete: 'اكتمال الشفاء',
          translations_updated: 'تم تحديث الترجمات',
          performance_stats: 'إحصائيات الأداء',
          system_metrics: 'مقاييس النظام',
          intelligence_matrix: 'مصفوفة الذكاء',
          autonomous_actions: 'الإجراءات المستقلة'
        },

        // Employees
        employees: {
          master_data: 'البيانات الأساسية للموظفين',
          complete_profile_mgmt: 'إدارة الملفات الشخصية الكاملة',
          add_employee_short: 'إضافة موظف',
          total_employees: 'إجمالي الموظفين',
          active_contracts: 'العقود النشطة',
          compliance_score: 'نقاط الامتثال',
          employee_directory: 'دليل الموظفين',
          manage_profiles: 'إدارة الملفات الشخصية',
          table_implemented: 'جدول تفصيلي للموظفين مع البحث والتصفية - سيتم تنفيذه'
        },

        // Core HR
        core_hr: {
          saudization_rate: 'معدل السعودة'
        },

        // Consulting
        consulting: {
          premium_consulting: 'الاستشارات المتميزة',
          executive_hr_consulting: 'استشارات الموارد البشرية التنفيذية'
        },

        // Organization
        organization: {
          structure: 'الهيكل التنظيمي',
          dynamic_chart: 'مخطط تنظيمي ديناميكي تفاعلي',
          total_departments: 'إجمالي الأقسام',
          management_levels: 'مستويات الإدارة',
          open_positions: 'المناصب الشاغرة',
          org_chart: 'المخطط التنظيمي',
          visual_representation: 'تمثيل بصري للهيكل التنظيمي',
          interactive_chart: 'مخطط تنظيمي تفاعلي - سيتم تنفيذه'
        },

        // Common
        common: {
          search: 'بحث',
          filter: 'تصفية',
          add: 'إضافة',
          edit: 'تعديل',
          delete: 'حذف',
          save: 'حفظ',
          cancel: 'إلغاء',
          loading: 'جاري التحميل...',
          error: 'خطأ',
          success: 'نجح',
          warning: 'تحذير',
          info: 'معلومات'
        }
      },
      en: {
        // Dashboard
        dashboard: {
          title: 'AqlHR System',
          subtitle: 'Advanced Intelligent Platform for Human Resources Management in Saudi Arabia',
          all_systems_operational: 'All systems operational',
          modules_active: 'modules active',
          government_integrations_live: 'Government integrations live',
          total_employees: 'Total Employees',
          complete_profile_management: 'Complete profile management',
          ai_processes: 'AI Processes',
          gov_integrations: 'Gov Integrations',
          compliance_score: 'Compliance Score',
          regulatory_compliance: 'Regulatory compliance',
          saudization_rate: 'Saudization Rate',
          green_nitaqat_target: 'Green Nitaqat target',
          active_users: 'Active Users',
          employee_self_service: 'Employee self-service',
          documents_processed: 'Documents Processed',
          ai_powered_verification: 'AI-powered verification',
          training_hours: 'Training Hours',
          skills_development_completed: 'Skills development completed',
          monthly_payroll: 'Monthly Payroll',
          december_2024_processed: 'December 2024 processed',
          attendance_rate: 'Attendance Rate',
          real_time_tracking: 'Real-time tracking',
          platform_status_overview: 'Platform Status Overview',
          core_hr_modules: 'Core HR Modules',
          payroll_modules: 'Payroll Modules',
          ai_features: 'AI Features',
          active_workflows: 'Active Workflows',
          system_engineer: 'System Engineer AI',
          system_engineer_description: 'Advanced intelligent system for self-diagnosis, auto-healing, and performance optimization',
          auto_adaptive: 'Auto-Adaptive',
          future_proof: 'Future-Proof',
          continuous_monitoring: 'Continuous Monitoring',
          open_dashboard: 'Open Dashboard'
        },
        
        // Upload
        upload: {
          company_data_integration: 'Company Data Integration',
          company_data_integration_desc: 'Upload company data files to automatically integrate with all AqlHR modules and AI systems',
          integration_complete: 'Data Integration Complete',
          integration_complete_desc: 'Company data from {filename} has been processed and integrated into SanadHR systems. All modules and AI tools are now updated.',
          processing_data: 'Processing Company Data...',
          integrating_systems: 'Integrating with HR modules and AI systems',
          complete: 'Complete',
          drag_drop_files: 'Drag & drop your company files here',
          supported_formats: 'Supports: Excel, PDF, Word, PowerPoint, Images, Archives, Design files and more',
          browse_files: 'Browse Files',
          ai_powered_integration: 'AI-Powered Integration',
          ai_powered_integration_desc: 'Uploaded data automatically syncs with payroll, HR analytics, compliance modules, and predictive AI systems. Supports 50+ file formats with intelligent data extraction and processing.'
        },

        // System Engineer translations
        system_engineer: {
          autonomous_brain: 'Autonomous Brain',
          autonomous_brain_desc: 'Intelligent system for self-diagnosis and auto-healing',
          predictive_analytics: 'Predictive Analytics',
          predictive_analytics_desc: 'Smart analytics for forecasting trends and risks',
          compliance_automation: 'Compliance Automation',
          compliance_automation_desc: 'Automated compliance monitoring and correction',
          translation_integrity: 'Translation Integrity',
          translation_integrity_desc: 'Intelligent engine ensuring translation quality',
          system_status: 'System Status',
          autonomous_operations: 'Autonomous Operations',
          performance_metrics: 'Performance Metrics',
          learning_algorithms: 'Learning Algorithms',
          system_health: 'System Health',
          optimal: 'Optimal',
          active_learning: 'Active Learning',
          continuous: 'Continuous',
          auto_healing: 'Auto Healing',
          self_optimization: 'Self Optimization',
          quantum_security: 'Quantum Security',
          predictive_accuracy: 'Predictive Accuracy',
          real_time_adaptation: 'Real-time Adaptation',
          intelligence_score: 'Intelligence Score',
          system_reliability: 'System Reliability',
          autonomous_decision_making: 'Autonomous Decision Making',
          performance_optimization: 'Performance Optimization',
          issue_prediction: 'Issue Prediction',
          auto_resolution: 'Auto Resolution',
          learning_efficiency: 'Learning Efficiency',
          trend_analysis: 'Trend Analysis',
          saudization_forecasting: 'Saudization Forecasting',
          workforce_insights: 'Workforce Insights',
          business_intelligence: 'Business Intelligence',
          compliance_monitoring: 'Compliance Monitoring',
          government_sync: 'Government Sync',
          auto_reporting: 'Auto Reporting',
          violation_detection: 'Violation Detection',
          auto_correction: 'Auto Correction',
          regulatory_updates: 'Regulatory Updates',
          translation_healing: 'Translation Healing',
          missing_keys: 'Missing Keys',
          inconsistencies: 'Inconsistencies',
          quality_assurance: 'Quality Assurance',
          auto_translation: 'Auto Translation',
          context_verification: 'Context Verification',
          healing_complete: 'Healing Complete',
          translations_updated: 'Translations Updated',
          performance_stats: 'Performance Stats',
          system_metrics: 'System Metrics',
          intelligence_matrix: 'Intelligence Matrix',
          autonomous_actions: 'Autonomous Actions'
        },

        // Employees
        employees: {
          master_data: 'Employee Master Data',
          complete_profile_mgmt: 'Complete profile management',
          add_employee_short: 'Add Employee',
          total_employees: 'Total Employees',
          active_contracts: 'Active Contracts',
          compliance_score: 'Compliance Score',
          employee_directory: 'Employee Directory',
          manage_profiles: 'Manage employee profiles',
          table_implemented: 'Employee table with search and filtering - to be implemented'
        },

        // Core HR
        core_hr: {
          saudization_rate: 'Saudization Rate'
        },

        // Consulting
        consulting: {
          premium_consulting: 'Premium Consulting',
          executive_hr_consulting: 'Executive HR consulting services'
        },

        // Organization
        organization: {
          structure: 'Organization Structure',
          dynamic_chart: 'Interactive dynamic organizational chart',
          total_departments: 'Total Departments',
          management_levels: 'Management Levels',
          open_positions: 'Open Positions',
          org_chart: 'Organization Chart',
          visual_representation: 'Visual representation of organizational structure',
          interactive_chart: 'Interactive organizational chart - to be implemented'
        },

        // Common
        common: {
          search: 'Search',
          filter: 'Filter',
          add: 'Add',
          edit: 'Edit',
          delete: 'Delete',
          save: 'Save',
          cancel: 'Cancel',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          warning: 'Warning',
          info: 'Info'
        }
      }
    };
    return defaultTranslations[lang] || {};
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return (typeof value === 'string' ? value : key);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        toggleLanguage,
        t, 
        isRTL: language === 'ar' 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};