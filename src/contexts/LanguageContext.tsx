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
    
    // Tab labels
    'tabs.sync_status': 'حالة المزامنة',
    'tabs.architecture': 'البنية التحتية',
    'tabs.monitoring': 'المراقبة المباشرة',
    'tabs.performance': 'الأداء',
    
    // Status page content
    'status.module_sync_title': 'حالة مزامنة الوحدات',
    'status.module_sync_desc': 'الحالة المباشرة لجميع وحدات الموارد البشرية المتصلة',
    'status.core_hr_modules': 'وحدات الموارد البشرية الأساسية',
    'status.government_integrations': 'التكاملات الحكومية',
    'status.employee_data': 'بيانات الموظفين',
    'status.payroll_processing': 'معالجة كشف الرواتب',
    'status.performance_management': 'إدارة الأداء',
    'status.time_attendance': 'الوقت والحضور',
    'status.gosi_integration': 'تكامل التأمينات الاجتماعية',
    'status.qiwa_platform': 'منصة قوى',
    'status.mudad_integration': 'تكامل مدد',
    'status.zatca_compliance': 'امتثال الزكاة والضريبة',
    'status.synced': 'متزامن',
    'status.events_day': 'أحداث/يوم',
    
    // Architecture page
    'arch.title': 'بنية محرك المزامنة',
    'arch.desc': 'كيف يحافظ نظامنا الموزع على اتساق البيانات',
    'arch.event_driven': 'البنية القائمة على الأحداث',
    'arch.event_driven_desc': 'كل تغيير في البيانات يؤدي إلى أحداث يتم نشرها فوراً إلى الوحدات ذات الصلة',
    'arch.distributed_db': 'مزامنة قاعدة البيانات الموزعة',
    'arch.distributed_db_desc': 'النسخ المتقدم يضمن اتساق البيانات عبر عدة مثيلات من قواعد البيانات',
    'arch.fault_tolerance': 'تحمل الأخطاء والاستعادة',
    'arch.fault_tolerance_desc': 'آليات إعادة المحاولة التلقائية وإجراءات التراجع تضمن سلامة البيانات',
    
    // Monitoring page
    'monitor.title': 'لوحة مراقبة المزامنة المباشرة',
    'monitor.desc': 'مقاييس أداء المزامنة المباشرة ومراقبة الصحة',
    'monitor.system_uptime': 'وقت تشغيل النظام (30 يوم)',
    'monitor.avg_sync_latency': 'متوسط زمن استجابة المزامنة',
    'monitor.failed_syncs_today': 'المزامنات الفاشلة (اليوم)',
    'monitor.recent_activity': 'النشاط الأخير',
    'monitor.employee_master': 'البيانات الرئيسية للموظفين',
    'monitor.payroll_system': 'نظام كشف الرواتب',
    'monitor.time_attendance': 'الوقت والحضور',
    'monitor.profile_update': 'تحديث الملف الشخصي',
    'monitor.salary_adjustment': 'تعديل الراتب',
    'monitor.clock_in_out': 'تسجيل الدخول/الخروج',
    'monitor.contribution_update': 'تحديث المساهمات',
    'monitor.success': 'نجح',
    'monitor.retry': 'إعادة المحاولة',
    
    // Performance page
    'perf.title': 'تحليلات الأداء',
    'perf.desc': 'اتجاهات أداء محرك المزامنة ورؤى التحسين',
    'perf.trends': 'اتجاهات الأداء',
    'perf.optimization': 'رؤى التحسين',
    'perf.avg_latency': 'متوسط زمن الاستجابة',
    'perf.success_rate': 'معدل النجاح',
    'perf.throughput': 'الإنتاجية',
    'perf.this_month': 'هذا الشهر',
    'perf.improvement': 'تحسن',
    'perf.increase': 'زيادة',
    'perf.db_pooling': 'تجميع اتصالات قاعدة البيانات قلل زمن الاستجابة بنسبة 18%',
    'perf.ai_load_balancing': 'توزيع الأحمال بالذكاء الاصطناعي حسن الإنتاجية بنسبة 31%',
    
    // Control Center
    'control.title': 'مركز التحكم في محرك المزامنة',
    'control.desc': 'مراقبة وإدارة مزامنة البيانات في الوقت الفعلي',
    
    // Footer
    'footer.sanadhr_desc': 'منصة إدارة الموارد البشرية الكاملة - مصممة للتميز في المملكة العربية السعودية',
    'footer.all_rights': '© 2025 سند للموارد البشرية. جميع الحقوق محفوظة.',
    'footer.quick_links': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.riyadh': 'الرياض، المملكة العربية السعودية',
    'footer.national_initiatives': 'المبادرات الوطنية',
    'footer.vision_support': 'دعم رؤية المملكة العربية السعودية للمستقبل',
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
    
    // Tab labels
    'tabs.sync_status': 'Sync Status',
    'tabs.architecture': 'Architecture',
    'tabs.monitoring': 'Real-time Monitoring',
    'tabs.performance': 'Performance',
    
    // Status page content
    'status.module_sync_title': 'Module Synchronization Status',
    'status.module_sync_desc': 'Real-time status of all connected HR modules',
    'status.core_hr_modules': 'Core HR Modules',
    'status.government_integrations': 'Government Integrations',
    'status.employee_data': 'Employee Data',
    'status.payroll_processing': 'Payroll Processing',
    'status.performance_management': 'Performance Management',
    'status.time_attendance': 'Time & Attendance',
    'status.gosi_integration': 'GOSI Integration',
    'status.qiwa_platform': 'Qiwa Platform',
    'status.mudad_integration': 'Mudad Integration',
    'status.zatca_compliance': 'ZATCA Compliance',
    'status.synced': 'Synced',
    'status.events_day': 'events/day',
    
    // Architecture page
    'arch.title': 'Sync Engine Architecture',
    'arch.desc': 'How our distributed system maintains data consistency',
    'arch.event_driven': 'Event-Driven Architecture',
    'arch.event_driven_desc': 'Every data change triggers events that are instantly propagated to relevant modules',
    'arch.distributed_db': 'Distributed Database Sync',
    'arch.distributed_db_desc': 'Advanced replication ensures data consistency across multiple database instances',
    'arch.fault_tolerance': 'Fault Tolerance & Recovery',
    'arch.fault_tolerance_desc': 'Automatic retry mechanisms and rollback procedures ensure data integrity',
    
    // Monitoring page
    'monitor.title': 'Real-time Monitoring Dashboard',
    'monitor.desc': 'Live sync performance metrics and health monitoring',
    'monitor.system_uptime': 'System Uptime (30 days)',
    'monitor.avg_sync_latency': 'Average Sync Latency',
    'monitor.failed_syncs_today': 'Failed Syncs (Today)',
    'monitor.recent_activity': 'Recent Sync Activity',
    'monitor.employee_master': 'Employee Master Data',
    'monitor.payroll_system': 'Payroll System',
    'monitor.time_attendance': 'Time Attendance',
    'monitor.profile_update': 'Profile Update',
    'monitor.salary_adjustment': 'Salary Adjustment',
    'monitor.clock_in_out': 'Clock In/Out',
    'monitor.contribution_update': 'Contribution Update',
    'monitor.success': 'Success',
    'monitor.retry': 'Retry',
    
    // Performance page
    'perf.title': 'Performance Analytics',
    'perf.desc': 'Sync engine performance trends and optimization insights',
    'perf.trends': 'Performance Trends',
    'perf.optimization': 'Optimization Insights',
    'perf.avg_latency': 'Average Latency',
    'perf.success_rate': 'Success Rate',
    'perf.throughput': 'Throughput',
    'perf.this_month': 'this month',
    'perf.improvement': 'improvement',
    'perf.increase': 'increase',
    'perf.db_pooling': 'Database connection pooling reduced latency by 18%',
    'perf.ai_load_balancing': 'AI-powered load balancing improved throughput by 31%',
    
    // Control Center
    'control.title': 'Sync Engine Control Center',
    'control.desc': 'Monitor and manage real-time data synchronization',
    
    // Footer
    'footer.sanadhr_desc': 'Complete HR Management Platform - Designed for Excellence in Saudi Arabia',
    'footer.all_rights': 'SanadHR. All rights reserved 2025 ©',
    'footer.quick_links': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.riyadh': 'Riyadh, Saudi Arabia',
    'footer.national_initiatives': 'National Initiatives',
    'footer.vision_support': 'Supporting Saudi Arabia\'s Vision for the Future',
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