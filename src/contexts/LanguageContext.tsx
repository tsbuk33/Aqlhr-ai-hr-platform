import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations = {
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.core_hr': 'الموارد البشرية الأساسية',
    'nav.employees': 'الموظفون',
    'nav.payroll': 'كشف الرواتب',
    'nav.analytics': 'التحليلات',
    'nav.compliance': 'الامتثال والحوكمة',
    'nav.government': 'التكامل الحكومي',
    'nav.ai_features': 'مميزات الذكاء الاصطناعي',
    
    // AI Sync Engine
    'ai_sync.title': 'محرك المزامنة الذكي',
    'ai_sync.subtitle': 'مزامنة البيانات الذكية في الوقت الفعلي التي تحافظ على محاذاة وتحديث جميع وحدات الموارد البشرية الـ 106 بشكل مثالي',
    'ai_sync.how_title': 'كيف يحافظ سند للموارد البشرية على مزامنة البيانات في الوقت الفعلي',
    'ai_sync.how_subtitle': 'البنية الموزعة المتقدمة تضمن اتساق البيانات الفوري عبر جميع الوحدات',
    'ai_sync.event_detection': 'اكتشاف الأحداث',
    'ai_sync.event_detection_desc': 'الذكاء الاصطناعي يراقب جميع تغييرات البيانات في الوقت الفعلي عبر كل وحدة ونظام',
    'ai_sync.smart_routing': 'التوجيه الذكي',
    'ai_sync.smart_routing_desc': 'التوجيه الذكي يحدد الوحدات التي تحتاج تحديثات ويعطي الأولوية للمسارات الحرجة',
    'ai_sync.atomic_updates': 'التحديثات الذرية',
    'ai_sync.atomic_updates_desc': 'جميع البيانات ذات الصلة يتم تحديثها في وقت واحد لضمان الاتساق المثالي',
    'ai_sync.microsecond_detection': 'اكتشاف الميكروثانية',
    'ai_sync.ai_prioritized': 'مُعطى الأولوية بالذكاء الاصطناعي',
    'ai_sync.success_rate': '99.97% نجاح',
    'ai_sync.daily_sync_events': 'أحداث المزامنة اليومية',
    'ai_sync.sync_success_rate': 'معدل نجاح المزامنة',
    'ai_sync.average_latency': 'متوسط زمن الاستجابة',
    'ai_sync.connected_modules': 'الوحدات المتصلة',
    'ai_sync.real_time_processing': 'معالجة في الوقت الفعلي',
    'ai_sync.monitoring_24_7': 'مراقبة 24/7',
    'ai_sync.lightning_fast': 'سريع كالبرق',
    'ai_sync.all_systems_online': 'جميع الأنظمة متصلة',
    'ai_sync.force_full_sync': 'فرض المزامنة الكاملة',
    'ai_sync.view_sync_logs': 'عرض سجلات المزامنة',
    'ai_sync.run_health_check': 'تشغيل فحص الحالة',
    
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'تم بنجاح',
    
    // Dashboard
    'dashboard.title': 'سند للموارد البشرية - لوحة التحكم',
    'dashboard.subtitle': 'النظام الأكثر تطوراً للموارد البشرية في المملكة العربية السعودية',
    'dashboard.total_employees': 'إجمالي الموظفين',
    'dashboard.active_employees': 'الموظفون النشطون',
    'dashboard.payroll_processed': 'الرواتب المعالجة',
    'dashboard.compliance_score': 'درجة الامتثال',
    
    // Employee Management
    'employees.title': 'إدارة الموظفين',
    'employees.add_employee': 'إضافة موظف جديد',
    'employees.employee_number': 'رقم الموظف',
    'employees.national_id': 'رقم الهوية الوطنية',
    'employees.first_name': 'الاسم الأول',
    'employees.last_name': 'اسم العائلة',
    'employees.email': 'البريد الإلكتروني',
    'employees.department': 'القسم',
    'employees.position': 'المنصب',
    'employees.salary': 'الراتب',
    'employees.hire_date': 'تاريخ التوظيف',
    'employees.status': 'الحالة',
    'employees.nationality': 'الجنسية',
    'employees.is_saudi': 'سعودي',
    
    // Compliance
    'compliance.title': 'الامتثال والحوكمة',
    'compliance.overall_score': 'الدرجة الإجمالية للامتثال',
    'compliance.saudi_labor_law': 'قانون العمل السعودي',
    'compliance.pdpl': 'قانون حماية البيانات الشخصية',
    'compliance.monitoring': 'المراقبة المستمرة',
    'compliance.alerts': 'التنبيهات',
    'compliance.audit_trails': 'سجل التدقيق',
    
    // Government Integration
    'gov.qiwa': 'منصة قوى',  
    'gov.gosi': 'التأمينات الاجتماعية',
    'gov.mudad': 'منصة مدد',
    'gov.absher': 'أبشر',
    'gov.status': 'الحالة',
    'gov.last_sync': 'آخر مزامنة',
    'gov.sync_now': 'مزامنة الآن',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.core_hr': 'Core HR',
    'nav.employees': 'Employees',
    'nav.payroll': 'Payroll',
    'nav.analytics': 'Analytics',
    'nav.compliance': 'Compliance & Governance',
    'nav.government': 'Government Integration',
    'nav.ai_features': 'AI Features',
    
    // AI Sync Engine
    'ai_sync.title': 'AI Sync Engine',
    'ai_sync.subtitle': 'Intelligent real-time data synchronization that keeps all 106 HR modules perfectly aligned and updated',
    'ai_sync.how_title': 'How SanadHR Maintains Real-Time Data Sync',
    'ai_sync.how_subtitle': 'Advanced distributed architecture ensures instant data consistency across all modules',
    'ai_sync.event_detection': 'Event Detection',
    'ai_sync.event_detection_desc': 'AI monitors all data changes in real-time across every module and system',
    'ai_sync.smart_routing': 'Smart Routing',
    'ai_sync.smart_routing_desc': 'Intelligent routing determines which modules need updates and prioritizes critical paths',
    'ai_sync.atomic_updates': 'Atomic Updates',
    'ai_sync.atomic_updates_desc': 'All related data is updated simultaneously ensuring perfect consistency',
    'ai_sync.microsecond_detection': 'Microsecond Detection',
    'ai_sync.ai_prioritized': 'AI-Prioritized',
    'ai_sync.success_rate': '99.97% Success',
    'ai_sync.daily_sync_events': 'Daily Sync Events',
    'ai_sync.sync_success_rate': 'Sync Success Rate',
    'ai_sync.average_latency': 'Average Latency',
    'ai_sync.connected_modules': 'Connected Modules',
    'ai_sync.real_time_processing': 'Real-time processing',
    'ai_sync.monitoring_24_7': '24/7 monitoring',
    'ai_sync.lightning_fast': 'Lightning fast',
    'ai_sync.all_systems_online': 'All systems online',
    'ai_sync.force_full_sync': 'Force Full Sync',
    'ai_sync.view_sync_logs': 'View Sync Logs',
    'ai_sync.run_health_check': 'Run Health Check',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Dashboard
    'dashboard.title': 'SanadHR - Dashboard',
    'dashboard.subtitle': 'Saudi Arabia\'s Most Advanced HR Management System',
    'dashboard.total_employees': 'Total Employees',
    'dashboard.active_employees': 'Active Employees',
    'dashboard.payroll_processed': 'Payroll Processed',
    'dashboard.compliance_score': 'Compliance Score',
    
    // Employee Management
    'employees.title': 'Employee Management',
    'employees.add_employee': 'Add New Employee',
    'employees.employee_number': 'Employee Number',
    'employees.national_id': 'National ID',
    'employees.first_name': 'First Name',
    'employees.last_name': 'Last Name',
    'employees.email': 'Email',
    'employees.department': 'Department',
    'employees.position': 'Position',
    'employees.salary': 'Salary',
    'employees.hire_date': 'Hire Date',
    'employees.status': 'Status',
    'employees.nationality': 'Nationality',
    'employees.is_saudi': 'Saudi',
    
    // Compliance
    'compliance.title': 'Compliance & Governance',
    'compliance.overall_score': 'Overall Compliance Score',
    'compliance.saudi_labor_law': 'Saudi Labor Law',
    'compliance.pdpl': 'Personal Data Protection Law',
    'compliance.monitoring': 'Continuous Monitoring',
    'compliance.alerts': 'Alerts',
    'compliance.audit_trails': 'Audit Trails',
    
    // Government Integration
    'gov.qiwa': 'Qiwa Platform',
    'gov.gosi': 'GOSI',
    'gov.mudad': 'Mudad Platform',
    'gov.absher': 'Absher',
    'gov.status': 'Status',
    'gov.last_sync': 'Last Sync',
    'gov.sync_now': 'Sync Now',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  useEffect(() => {
    // Apply direction to document
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Apply RTL-specific styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [direction, isRTL, language]);

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      direction,
      isRTL,
      toggleLanguage,
      setLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};