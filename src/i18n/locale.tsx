// Update existing i18n system to subscribe to locale driver
import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { getCurrentLang, localeDriver, type Lang } from '@/lib/i18n/localeDriver';

export type Locale = Lang; // For compatibility

const STORAGE_KEY = 'aqlhr.locale';

type Dict = Record<string, string>;
type Bundle = { en: Dict; ar: Dict };

const bundles: Record<string, Bundle> = {
  common: {
    en: { language: 'English', arabic: 'Arabic', export: 'Export', overview: 'Overview' },
    ar: { language: 'الإنجليزية', arabic: 'العربية', export: 'تصدير', overview: 'نظرة عامة' },
  },
  navigation: {
    en: {
      // Main navigation
      dashboard: 'Dashboard',
      employees: 'Employees',
      attendance: 'Attendance',
      leave: 'Leave',
      performance: 'Performance',
      hse: 'HSE',
      payroll: 'Payroll & GOSI',
      recruitment: 'Recruitment',
      analytics: 'Analytics',
      ai_intelligence: 'AI Intelligence',
      company: 'Company',
      settings: 'Settings',
      
      // Groups
      core_modules: 'Core Modules',
      management: 'Management',
      administration: 'Administration',
      team_management: 'Team Management',
      hr_management: 'HR Management',
      employee_portal: 'Employee Portal',
      
      // Employee sidebar
      main_dashboard: 'Main Dashboard',
      my_dashboard: 'My Dashboard',
      my_profile: 'My Profile',
      time_attendance: 'Time & Attendance',
      leave_requests: 'Leave Requests',
      my_goals: 'My Goals',
      training_courses: 'Training Courses',
      pay_slips: 'Pay Slips',
      feedback: 'Feedback',
      
      // Manager sidebar
      manager_dashboard: 'Manager Dashboard',
      my_team: 'My Team',
      team_attendance: 'Team Attendance',
      performance_reviews: 'Performance Reviews',
      team_goals: 'Team Goals',
      approve_requests: 'Approve Requests',
      team_analytics: 'Team Analytics',
      team_feedback: 'Team Feedback',
      
      // HR Manager sidebar
      hr_dashboard: 'HR Dashboard',
      employee_directory: 'Employee Directory',
      performance_management: 'Performance Management',
      training_development: 'Training & Development',
      leave_management: 'Leave Management',
      onboarding: 'Onboarding',
      goal_setting: 'Goal Setting',
      hr_reports: 'HR Reports',
      
      // Admin sidebar
      admin_dashboard: 'Admin Dashboard',
      employee_management: 'Employee Management',
      attendance_time: 'Attendance & Time',
      payroll_management: 'Payroll Management',
      hr_analytics: 'HR Analytics',
      compliance: 'Compliance',
      reports: 'Reports',
      user_roles: 'User Roles',
      company_settings: 'Company Settings',
      system_health: 'System Health'
    },
    ar: {
      // Main navigation
      dashboard: 'لوحة التحكم',
      employees: 'الموظفون',
      attendance: 'الحضور والانصراف',
      leave: 'الإجازات',
      performance: 'الأداء',
      hse: 'السلامة والصحة المهنية',
      payroll: 'الرواتب والتأمينات',
      recruitment: 'التوظيف',
      analytics: 'التحليلات المتقدمة',
      ai_intelligence: 'الذكاء الاصطناعي والتحليلات',
      company: 'الشركة',
      settings: 'الإعدادات',
      
      // Groups
      core_modules: 'الوحدات الأساسية',
      management: 'الإدارة',
      administration: 'الإدارة العامة',
      team_management: 'إدارة الفريق',
      hr_management: 'إدارة الموارد البشرية',
      employee_portal: 'بوابة الموظفين',
      
      // Employee sidebar
      main_dashboard: 'لوحة التحكم الرئيسية',
      my_dashboard: 'لوحة تحكمي',
      my_profile: 'ملفي الشخصي',
      time_attendance: 'الوقت والحضور',
      leave_requests: 'طلبات الإجازة',
      my_goals: 'أهدافي',
      training_courses: 'الدورات التدريبية',
      pay_slips: 'قسائم الراتب',
      feedback: 'التغذية الراجعة',
      
      // Manager sidebar
      manager_dashboard: 'لوحة تحكم المدير',
      my_team: 'فريقي',
      team_attendance: 'حضور الفريق',
      performance_reviews: 'مراجعات الأداء',
      team_goals: 'أهداف الفريق',
      approve_requests: 'الموافقة على الطلبات',
      team_analytics: 'تحليلات الفريق',
      team_feedback: 'تغذية راجعة للفريق',
      
      // HR Manager sidebar
      hr_dashboard: 'لوحة تحكم الموارد البشرية',
      employee_directory: 'دليل الموظفين',
      performance_management: 'إدارة الأداء',
      training_development: 'التدريب والتطوير',
      leave_management: 'إدارة الإجازات',
      onboarding: 'التأهيل',
      goal_setting: 'وضع الأهداف',
      hr_reports: 'تقارير الموارد البشرية',
      
      // Admin sidebar
      admin_dashboard: 'لوحة تحكم المشرف',
      employee_management: 'إدارة الموظفين',
      attendance_time: 'الحضور والوقت',
      payroll_management: 'إدارة الرواتب',
      hr_analytics: 'تحليلات الموارد البشرية',
      compliance: 'الامتثال',
      reports: 'التقارير',
      user_roles: 'أدوار المستخدمين',
      company_settings: 'إعدادات الشركة',
      system_health: 'صحة النظام'
    }
  },
  osi: {
    en: {
      // Page titles and navigation
      org_structure_intel: 'Organization Structure Intelligence',
      overview: 'Overview',
      layers: 'Layers',
      saudization_by_layers: 'Saudization by Layers',
      management_span: 'Management Span',
      cost_of_management: 'Cost of Management',
      export: 'Export',
      advanced_analysis: 'Advanced organizational design and effectiveness analysis',
      
      // KPIs and metrics
      total_layers: 'Total Layers',
      highest_saudi_layer: 'Highest Saudi Layer',
      critical_layers: 'Critical Layers',
      layers_meeting_target: 'Layers Meeting Target',
      span_outliers_low: 'Low Span Outliers',
      span_outliers_high: 'High Span Outliers',
      management_cost: 'Management Cost',
      total_headcount: 'Total Headcount',
      saudi_headcount: 'Saudi HC',
      saudization_rate: 'Saudization %',
      avg_salary: 'Avg Salary',
      total_salary: 'Total Salary',
      direct_reports: 'Direct Reports',
      severity: 'Severity',
      layer: 'Layer',
      manager: 'Manager',
      
      // UI elements
      target: 'Target',
      critical: 'Critical',
      recompute: 'Recompute',
      recompute_osi: 'Recompute OSI',
      view_org_chart: 'View Org Chart',
      organizational_chart: 'Organizational Chart',
      employees: 'employees',
      saudi: 'Saudi',
      no_org_data: 'No organization data available',
      no_data: 'No data yet',
      dev_mode: 'Developer Mode',
      currency: 'SAR',
      employees_across_layers: 'employees across layers',
      of_total: 'of total',
      across_all_layers: 'across all layers',
      headcount_distribution: 'Headcount Distribution',
      layer_details: 'Layer Details',
      total_employees: 'Total Employees',
      saudi_employees: 'Saudi Employees',
      
      // Additional missing keys
      
      // Export
      export_title: 'OSI Export',
      export_disclaimer: 'Aggregated metrics only. PDPL-compliant; no personal identifiers.',
      
      // Error states
      data_error: 'Data Error',
      no_org_structure: 'No organizational structure data available',
      initialization_error: 'Initialization Error',
      access_required: 'Access Required',
      access_description: 'Please ensure you have the necessary permissions to access OSI data.',
      error: 'Error',
      retry: 'Retry'
    },
    ar: {
      // Page titles and navigation
      org_structure_intel: 'ذكاء الهيكل التنظيمي',
      overview: 'نظرة عامة',
      layers: 'الطبقات',
      saudization_by_layers: 'السعودة بالطبقات',
      management_span: 'نطاق الإشراف',
      cost_of_management: 'تكلفة الإدارة',
      export: 'التصدير',
      advanced_analysis: 'تحليل متقدم للتصميم التنظيمي والفعالية',
      
      // KPIs and metrics
      total_layers: 'إجمالي الطبقات',
      highest_saudi_layer: 'أعلى طبقة سعودية',
      critical_layers: 'طبقات حرجة',
      layers_meeting_target: 'طبقات محققة للهدف',
      span_outliers_low: 'انحرافات نطاق منخفض',
      span_outliers_high: 'انحرافات نطاق مرتفع',
      management_cost: 'تكلفة الإدارة',
      total_headcount: 'إجمالي الموظفين',
      saudi_headcount: 'عدد السعوديين',
      saudization_rate: 'نسبة السعودة',
      avg_salary: 'متوسط الراتب',
      total_salary: 'إجمالي الرواتب',
      direct_reports: 'عدد المرؤوسين',
      severity: 'الخطورة',
      layer: 'طبقة',
      manager: 'المدير',
      
      // UI elements
      target: 'الهدف',
      critical: 'حرج',
      recompute: 'إعادة احتساب',
      recompute_osi: 'إعادة احتساب مؤشر الهيكل',
      view_org_chart: 'عرض الهيكل التنظيمي',
      organizational_chart: 'الهيكل التنظيمي',
      employees: 'موظفون',
      saudi: 'سعوديون',
      no_org_data: 'لا توجد بيانات هيكل متاحة',
      no_data: 'لا توجد بيانات حتى الآن',
      dev_mode: 'وضع المطور',
      currency: 'ريال',
      employees_across_layers: 'موظف عبر الطبقات',
      of_total: 'من المجموع',
      across_all_layers: 'عبر جميع الطبقات',
      headcount_distribution: 'توزيع الموظفين',
      layer_details: 'تفاصيل الطبقات',
      total_employees: 'إجمالي الموظفين',
      saudi_employees: 'الموظفون السعوديون',
      
      // Additional missing keys
      no_layers_data: 'لا توجد بيانات طبقات',
      
      // Export
      export_title: 'تصدير ذكاء الهيكل',
      export_disclaimer: 'مؤشرات مجمعة فقط. متوافق مع نظام حماية البيانات الشخصية؛ دون أي بيانات تعريفية.',
      
      // Error states
      data_error: 'خطأ في البيانات',
      no_org_structure: 'لا توجد بيانات هيكل تنظيمي متاحة',
      initialization_error: 'خطأ في التهيئة',
      access_required: 'مطلوب الوصول',
      access_description: 'يرجى التأكد من أن لديك الأذونات اللازمة للوصول إلى بيانات OSI.',
      error: 'خطأ',
      retry: 'إعادة المحاولة'
    },
  },
  employees: {
    en: {
      title: 'Employee Master Data',
      subtitle: 'Comprehensive employee information management and analytics',
      add_employee: 'Add Employee',
      search_placeholder: 'Search employees...',
      iqama_30d: 'Iqama ≤30d',
      iqama_60d: 'Iqama ≤60d', 
      iqama_90d: 'Iqama ≤90d',
      filters: 'Filters',
      total_employees: 'Total Employees',
      active_workforce: 'Active workforce',
      active_contracts: 'Active Contracts',
      currently_employed: 'Currently employed',
      saudization_rate: 'Saudization Rate',
      saudi_nationals: 'Saudi nationals',
      compliance_score: 'Compliance Score',
      pdpl_compliant: 'PDPL compliant',
      employee_directory: 'Employee Directory',
      saudi: 'Saudi',
      non_saudi: 'Non-Saudi',
      pdpl_notice: 'This data is protected under Saudi Personal Data Protection Law (PDPL).',
      privacy_notice: ' Personal information has been masked for privacy compliance.'
    },
    ar: {
      title: 'بيانات الموظفين الرئيسية',
      subtitle: 'إدارة وتحليل شامل لمعلومات الموظفين',
      add_employee: 'إضافة موظف',
      search_placeholder: 'البحث عن الموظفين...',
      iqama_30d: 'إقامة ≤30 يوم',
      iqama_60d: 'إقامة ≤60 يوم',
      iqama_90d: 'إقامة ≤90 يوم', 
      filters: 'المرشحات',
      total_employees: 'إجمالي الموظفين',
      active_workforce: 'القوى العاملة النشطة',
      active_contracts: 'العقود النشطة',
      currently_employed: 'الموظفون الحاليون',
      saudization_rate: 'معدل السعودة',
      saudi_nationals: 'المواطنون السعوديون',
      compliance_score: 'نقاط الامتثال',
      pdpl_compliant: 'متوافق مع قانون حماية البيانات',
      employee_directory: 'دليل الموظفين',
      saudi: 'سعودي',
      non_saudi: 'غير سعودي',
      pdpl_notice: 'هذه البيانات محمية بموجب قانون حماية البيانات الشخصية السعودي (PDPL).',
      privacy_notice: ' تم إخفاء المعلومات الشخصية للامتثال لقوانين الخصوصية.'
    }
  },
  dashboard: {
    en: {
      // Trends
      'trends.title': '12-Month KPI Trends',
      'trends.subtitle': 'Saudization, Safety, Compliance, Experience',
      'trends.saudization_rate': 'Saudization Rate',
      'trends.hse_safety': 'HSE Safety Score',
      'trends.compliance': 'Compliance Score',
      'trends.employee_experience': 'Employee Experience',
      
      // Main dashboard
      title: 'Executive Dashboard',
      subtitle: 'Real-time organizational performance insights',
      total_employees: 'Total Employees',
      saudization_rate: 'Saudization Rate',
      saudi_nationals: 'Saudi nationals',
      compliance_score: 'Compliance Score',
      hse_safety_score: 'HSE Safety Score',
      employee_experience: 'Employee Experience',  
      predictive_risk: 'Predictive Risk',
      high_risk: 'High Risk',
      talent_pipeline: 'Talent Pipeline',
      strength: 'Strength',
      docs_processed: 'Documents Processed',
      training_hours: 'Training Hours',
      workforce_forecast: 'Workforce Forecast',
      accuracy: 'Accuracy',
      share_dashboard: 'Share Dashboard',
      error_loading: 'Error Loading Dashboard',
      retry: 'Retry',
      loading: 'Loading dashboard data...',
      vision_2030_alignment: 'aligns with Vision 2030 goals',
      safety_excellence: 'demonstrates safety excellence',
      employee_satisfaction: 'employee satisfaction score',
      high_performing: 'high-performing employees',
      strong_pipeline: 'strong talent pipeline',
      
      // Streaming labels
      'cci.playbook.generate': 'Generate New Initiatives',
      'cci.playbook.stop': 'Stop',
      'cci.playbook.live': 'Live',
      'cci.playbook.provider': 'Provider',
      'cci.playbook.phase.planning': 'Planning',
      'cci.playbook.phase.generating': 'Generating',
      'cci.playbook.phase.saving': 'Saving', 
      'cci.playbook.phase.ready': 'Ready',
      'cci.playbook.streaming': 'Streaming live...',
      'cci.playbook.canceled': 'Canceled',
      'retention.plan.generate': 'Generate Retention Plan',
      'retention.plan.stop': 'Stop',
      'retention.plan.live': 'Live',
      'retention.plan.phase.planning': 'Planning',
      'retention.plan.phase.generating': 'Generating', 
      'retention.plan.phase.saving': 'Saving',
      'retention.plan.phase.ready': 'Ready',
      'retention.plan.streaming': 'Streaming live...',
      'retention.plan.canceled': 'Canceled',
      
      // System status
      all_systems_operational: 'All systems operational',
      system_issues_detected: 'System issues detected',
      demo_mode: 'Demo Mode',
      dashboard_error: 'Dashboard Error',
      retry_loading: 'Retry Loading',
      
      // Trends component
      error_loading_trends: 'Error loading trends',
      no_trend_data_available: 'No trend data available',
      
      // Alerts panel
      issues_alerts: 'Issues & Alerts',
      no_issues_detected: 'No issues detected',
      all_metrics_acceptable: 'All metrics within acceptable ranges',
      task_created: 'Task Created',
      task_created_success: 'Task created successfully from alert',
      error: 'Error',
      failed_to_create_task: 'Failed to create task',
      create_task: 'Create Task',
      
      // Upsell modal
      unlock_growth_features: 'Unlock Growth Features',
      growth_features_description: 'Get advanced analytics, ROI tracking, and executive reporting capabilities.',
      show_roi_automatically: 'Show ROI automatically',
      weekly_exec_pdfs: 'Weekly exec pdfs',
      readonly_snapshot_links: 'Read-only snapshot links (PDPL-safe)',
      
      // Misc
      unable_to_determine_company: 'Unable to determine company',
      dashboard_share_link_copied: 'Dashboard share link copied to clipboard!',
      failed_to_create_share_link: 'Failed to create share link'
    },
    ar: {
      // Trends
      'trends.title': 'اتجاهات مؤشرات الأداء خلال 12 شهرًا',
      'trends.subtitle': 'السعودة، السلامة، الالتزام، تجربة الموظف',
      'trends.saudization_rate': 'نسبة السعودة',
      'trends.hse_safety': 'درجة السلامة',
      'trends.compliance': 'درجة الامتثال',
      'trends.employee_experience': 'تجربة الموظف',
      
      // Main dashboard
      title: 'لوحة التحكم التنفيذية',
      subtitle: 'رؤى الأداء التنظيمي في الوقت الفعلي',
      total_employees: 'إجمالي الموظفين',
      saudization_rate: 'معدل السعودة',
      saudi_nationals: 'المواطنون السعوديون',
      compliance_score: 'نقاط الامتثال',
      hse_safety_score: 'نقاط السلامة والصحة المهنية',
      employee_experience: 'تجربة الموظف',
      predictive_risk: 'المخاطر التنبؤية',
      high_risk: 'مخاطر عالية',
      talent_pipeline: 'خط المواهب',
      strength: 'القوة',
      docs_processed: 'المستندات المعالجة',
      training_hours: 'ساعات التدريب',
      workforce_forecast: 'توقعات القوى العاملة',
      accuracy: 'الدقة',
      share_dashboard: 'مشاركة لوحة التحكم',
      error_loading: 'خطأ في تحميل لوحة التحكم',
      retry: 'إعادة المحاولة',
      loading: 'جاري تحميل بيانات لوحة التحكم...',
      vision_2030_alignment: 'يتماشى مع أهداف رؤية 2030',
      safety_excellence: 'يُظهر تميزاً في السلامة',
      employee_satisfaction: 'نقاط رضا الموظفين',
      high_performing: 'موظفون متميزون',
      strong_pipeline: 'خط مواهب قوي',
      
      // System status
      all_systems_operational: 'جميع الأنظمة تعمل',
      system_issues_detected: 'مشاكل في الأنظمة',
      demo_mode: 'وضع تجريبي',
      dashboard_error: 'خطأ في لوحة التحكم',
      retry_loading: 'إعادة التحميل',
      
      // Trends component
      error_loading_trends: 'خطأ في تحميل التوجهات',
      no_trend_data_available: 'لا توجد بيانات توجهات متاحة',
      
      // Alerts panel
      issues_alerts: 'التنبيهات والقضايا',
      no_issues_detected: 'لا توجد قضايا مكتشفة',
      all_metrics_acceptable: 'جميع المؤشرات ضمن النطاقات المقبولة',
      task_created: 'تم إنشاء المهمة',
      task_created_success: 'تم إنشاء مهمة جديدة من التنبيه بنجاح',
      error: 'خطأ',
      failed_to_create_task: 'فشل في إنشاء المهمة',
      create_task: 'إنشاء مهمة',
      
      // Upsell modal
      unlock_growth_features: 'فتح ميزات النمو',
      growth_features_description: 'احصل على تحليلات متقدمة وتتبع العائد على الاستثمار وإمكانيات التقارير التنفيذية.',
      show_roi_automatically: 'إظهار العائد على الاستثمار تلقائياً',
      weekly_exec_pdfs: 'تقارير تنفيذية أسبوعية',
      readonly_snapshot_links: 'روابط لقطات للقراءة فقط (متوافقة مع حماية البيانات)',
      
      // Misc
      unable_to_determine_company: 'غير قادر على تحديد الشركة',
      dashboard_share_link_copied: 'تم نسخ رابط مشاركة لوحة التحكم!',
      failed_to_create_share_link: 'فشل في إنشاء رابط المشاركة'
    }
  },
  ai_streaming: {
    en: {
      stop: 'Stop',
      live: 'Live',
      provider: 'Provider',
      retry: 'Retry',
      canceled: 'Canceled',
      streaming: 'Streaming...',
      connecting: 'Connecting...',
      error_fallback: 'Streaming failed, using fallback response'
    },
    ar: {
      stop: 'إيقاف',
      live: 'مباشر',
      provider: 'المزوّد',
      retry: 'إعادة المحاولة',
      canceled: 'أُلغيت',
      streaming: 'بث مباشر...',
      connecting: 'جاري الاتصال...',
      error_fallback: 'فشل البث المباشر، استخدام الاستجابة البديلة'
    }
  },
  analytics: {
    en: {
      title: 'Advanced Analytics',
      description: 'Data-driven insights for strategic decision making',
      overview: 'Overview',
      workforce: 'Workforce', 
      compensation: 'Compensation',
      trends: 'Trends',
      totalWorkforce: 'Total Workforce',
      saudizationRate: 'Saudization Rate',
      averageSalary: 'Average Salary',
      departments: 'Departments'
    },
    ar: {
      title: 'التحليلات المتقدمة',
      description: 'رؤى مدفوعة بالبيانات لاتخاذ قرارات استراتيجية',
      overview: 'نظرة عامة',
      workforce: 'القوى العاملة',
      compensation: 'المكافآت', 
      trends: 'الاتجاهات',
      totalWorkforce: 'إجمالي القوى العاملة',
      saudizationRate: 'نسبة السعودة',
      averageSalary: 'متوسط الراتب',
      departments: 'الأقسام'
    }
  },
  knowledge_search: {
    en: {
      title: 'Knowledge Search',
      subtitle: 'Search across your uploaded government and HR documents using semantic understanding.',
      placeholder: 'Search e.g., "expiring iqama policy" or "Saudi labor contract terms"…',
      search: 'Search',
      searching: 'Searching...',
      recent: 'Recent Documents',
      no_results: 'No results found. Try different keywords or filters.',
      relevance: 'Relevance',
      open_document: 'Open Document',
      all_portals: 'All Portals',
      all_sources: 'All Sources',
      gov_source: 'Government',
      hr_source: 'HR Documents',
      import_source: 'Imported Data',
      manual_source: 'Manual Uploads'
    },
    ar: {
      title: 'بحث المعرفة',
      subtitle: 'ابحث عبر مستنداتك الحكومية والموارد البشرية باستخدام الفهم الدلالي.',
      placeholder: 'ابحث مثلًا: "سياسة الإقامات المنتهية" أو "بنود عقد العمل السعودي"...',
      search: 'بحث',
      searching: 'جاري البحث...',
      recent: 'المستندات الحديثة',
      no_results: 'لم يتم العثور على نتائج. جرب كلمات مفتاحية أو مرشحات مختلفة.',
      relevance: 'الملاءمة',
      open_document: 'فتح المستند',
      all_portals: 'جميع المنصات',
      all_sources: 'جميع المصادر',
      gov_source: 'المستندات الحكومية',
      hr_source: 'مستندات الموارد البشرية',
      import_source: 'البيانات المستوردة',
      manual_source: 'الرفع اليدوي'
    }
  }
};

const Ctx = createContext<{
  locale: Locale; 
  setLocale: (l: Locale) => void; 
  t: (ns: string, k: string) => string;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getCurrentLang());
  
  // Subscribe to locale driver changes
  useLayoutEffect(() => {
    const cleanup = localeDriver.onLangChange((lang) => {
      setLocaleState(lang);
    });
    return cleanup;
  }, []);
  
  const setLocale = (l: Locale) => { 
    localStorage.setItem(STORAGE_KEY, l); 
    localeDriver.setLang(l);
  };

  const t = (ns: string, key: string) => {
    const b = bundles[ns]; 
    if (!b) return key;
    return (b as Bundle)[locale][key] ?? b.en[key] ?? key;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);
  
  // key={locale} forces clean re-render on language switch
  return (
    <Ctx.Provider value={value} key={locale}>
      {children}
    </Ctx.Provider>
  );
}

export const useLocale = () => {
  const ctx = useContext(Ctx);
  if (ctx) return ctx;
  
  // Safe fallback to prevent crashes when used outside provider
  const fallbackLocale: Locale = 'en';
  return {
    locale: fallbackLocale,
    setLocale: () => {},
    t: (_ns: string, key: string) => key, // Return key as fallback
  };
};

export const formatNumber = (n: number, l: Locale) => 
  new Intl.NumberFormat(l === 'ar' ? 'ar-SA' : 'en-US', { maximumFractionDigits: 2 }).format(n);

export const formatDate = (d: Date, l: Locale) => 
  new Intl.DateTimeFormat(l === 'ar' ? 'ar-SA' : 'en-US').format(d);