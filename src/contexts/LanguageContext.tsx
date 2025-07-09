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
    // Navigation Main Categories
    'nav.dashboard': 'لوحة التحكم',
    'nav.core_hr': 'وحدات الموارد البشرية الأساسية',
    'nav.ai_automation': 'الذكاء الاصطناعي والأتمتة',
    'nav.government': 'التكامل الحكومي',
    'nav.welfare_safety': 'رفاهية الموظفين والسلامة',
    'nav.diagnostic': 'إطار التشخيص',
    'nav.local_content': 'امتثال المحتوى المحلي',
    'nav.payroll': 'كشف الرواتب والشؤون المالية',
    'nav.strategic': 'الموارد البشرية الاستراتيجية',
    'nav.consulting': 'الاستشارات المتميزة',
    'nav.compliance': 'الامتثال والحوكمة',
    'nav.analytics': 'التحليلات المتقدمة',
    'nav.platform': 'مميزات المنصة',
    'nav.tools': 'أدوات إضافية',

    // Navigation Sub-items - Core HR
    'nav.employee_master_data': 'البيانات الأساسية للموظفين',
    'nav.payroll_processing': 'معالجة كشف الرواتب',
    'nav.benefits_administration': 'إدارة المزايا',
    'nav.performance_management': 'إدارة الأداء',
    'nav.recruitment_hiring': 'التوظيف والتعيين',
    'nav.training_development': 'التدريب والتطوير',
    'nav.time_attendance': 'الوقت والحضور',
    'nav.leave_management': 'إدارة الإجازات',
    'nav.succession_planning': 'تخطيط التعاقب',
    'nav.compensation_management': 'إدارة التعويضات',
    'nav.employee_self_service': 'الخدمة الذاتية للموظفين',
    'nav.manager_dashboard': 'لوحة تحكم المدير',

    // Navigation Sub-items - AI & Automation
    'nav.smart_recommendations': 'التوصيات الذكية',
    'nav.predictive_analytics': 'التحليلات التنبؤية',
    'nav.document_intelligence': 'ذكاء المستندات',
    'nav.arabic_english_nlp': 'معالجة اللغة الطبيعية',
    'nav.automated_workflows': 'سير العمل الآلي',
    'nav.ai_sync_engine': 'محرك المزامنة الذكي',
    
    // Navigation Sub-items - Government
    'nav.qiwa_integration': 'تكامل قوى',
    'nav.gosi_integration': 'تكامل التأمينات الاجتماعية',
    
    // Core HR - Benefits Administration
    'core_hr.benefits_administration': 'إدارة المزايا',
    'nav.mudad_platform': 'منصة مدد',
    'nav.elm_platform': 'منصة مقيم/إلم',
    'nav.absher_platform': 'منصة أبشر',
    'nav.hrsd_integration': 'تكامل وزارة الموارد البشرية',
    'nav.tvtc_doroob': 'المؤسسة العامة للتدريب/دروب',
    'nav.health_insurance': 'التأمين الصحي',

    // Navigation Sub-items - Employee Welfare & Safety
    'nav.welfare_compliance_dashboard': 'لوحة تحكم امتثال الرفاهية',
    'nav.grievance_reporting': 'الإبلاغ عن المظالم والتحرش',
    'nav.food_housing_transport': 'الطعام والسكن والنقل',
    'nav.wellbeing_tracker': 'متتبع الرفاهية',
    'nav.ethics_score': 'نقاط الأخلاق',
    'nav.ai_diagnosis': 'التشخيص والتوصيات بالذكاء الاصطناعي',
    'nav.compliance_framework': 'إطار الامتثال',
    'nav.multi_view_dashboards': 'لوحات التحكم متعددة العرض',

    // Navigation Sub-items - Strategic HR
    'nav.workforce_planning': 'تخطيط القوى العاملة',
    'nav.succession_planning_strategic': 'تخطيط التعاقب',
    'nav.talent_acquisition': 'اكتساب المواهب',
    'nav.org_development': 'التطوير التنظيمي',
    'nav.performance_strategy': 'استراتيجية الأداء',
    'nav.compensation_strategy': 'استراتيجية التعويضات',
    'nav.diversity_inclusion': 'التنوع والشمول',
    'nav.leadership_development': 'تطوير القيادة',
    'nav.employee_experience': 'تجربة الموظف',
    'nav.hr_transformation': 'تحول الموارد البشرية',

    // Sidebar UI
    'sidebar.platform_modules': 'وحدات المنصة',
    'sidebar.complete_hr_platform': 'منصة إدارة الموارد البشرية الشاملة',
    'sidebar.all_systems_operational': 'جميع الأنظمة تعمل',
    'sidebar.language_toggle': '🌐 العربية / English',
    
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
    'dashboard.title': 'مرحباً بكم في سند للموارد البشرية',
    'dashboard.subtitle': 'منصة إدارة الموارد البشرية الشاملة - مصممة للتميز في المملكة العربية السعودية',
    'dashboard.all_systems_operational': 'جميع الأنظمة تعمل',
    'dashboard.modules_active': 'وحدة نشطة',
    'dashboard.government_integrations_live': 'التكامل الحكومي مباشر',
    'dashboard.total_employees': 'إجمالي الموظفين',
    'dashboard.complete_profile_management': 'إدارة الملفات الشخصية الكاملة',
    'dashboard.ai_processes': 'عمليات الذكاء الاصطناعي',
    'dashboard.automated_workflows_active': 'سير العمل الآلي النشط',
    'dashboard.gov_integrations': 'التكامل الحكومي',
    'dashboard.connected_platforms': 'المنصات المتصلة',
    'dashboard.compliance_score': 'درجة الامتثال',
    'dashboard.regulatory_compliance': 'الامتثال التنظيمي',
    'dashboard.saudization_rate': 'معدل السعودة',
    'dashboard.green_nitaqat_target': 'الهدف: 70% (نطاقات أخضر)',
    'dashboard.active_users': 'المستخدمون النشطون',
    'dashboard.employee_self_service': 'الخدمة الذاتية للموظفين',
    'dashboard.documents_processed': 'الوثائق المعالجة',
    'dashboard.ai_powered_verification': 'التحقق بالذكاء الاصطناعي',
    'dashboard.training_hours': 'ساعات التدريب',
    'dashboard.skills_development_completed': 'تطوير المهارات المكتمل',
    'dashboard.monthly_payroll': 'كشف الرواتب الشهري',
    'dashboard.december_2024_processed': 'ديسمبر 2024 معالج',
    'dashboard.attendance_rate': 'معدل الحضور',
    'dashboard.real_time_tracking': 'التتبع في الوقت الفعلي',
    'dashboard.platform_status_overview': 'نظرة عامة على حالة المنصة',
    'dashboard.core_hr_modules': 'وحدات الموارد البشرية الأساسية',
    'dashboard.payroll_modules': 'وحدات كشف الرواتب',
    'dashboard.ai_features': 'مميزات الذكاء الاصطناعي',
    'dashboard.active_workflows': 'سير العمل النشط',
    
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
    
    // Missing Government Keys
    'government.health_insurance': 'التأمين الصحي',
    'government.health_insurance_desc': 'إدارة وتتبع بوالص التأمين الصحي للموظفين',
    'government.coverage_rate': 'معدل التغطية',
    'government.active_policies': 'البوالص النشطة',
    'government.monthly_premium': 'القسط الشهري',
    'government.claims_processed': 'المطالبات المعالجة',
    'government.mol_compliance': 'الامتثال لوزارة العمل',
    'government.mol_compliance_desc': 'مراقبة الامتثال لقوانين وزارة العمل والتنمية الاجتماعية',
    'government.compliance_score': 'درجة الامتثال',
    'government.active_violations': 'المخالفات النشطة',
    'government.resolved_issues': 'القضايا المحلولة',
    'government.inspection_ready': 'جاهز للتفتيش',
    'government.mudad_title_ar': 'منصة مدد للتأشيرات',
    'government.elm_desc_ar': 'منصة إلم للتدريب التقني والمهني',
    'government.zatca_desc_ar': 'هيئة الزكاة والضريبة والجمارك',
    
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
    
    // Footer (additional keys)
    'footer.sanadhr_desc': 'منصة إدارة الموارد البشرية الكاملة - مصممة للتميز في المملكة العربية السعودية',
    'footer.all_rights': '© 2025 سند للموارد البشرية. جميع الحقوق محفوظة.',
    'footer.quick_links': 'روابط سريعة',
    'footer.riyadh': 'الرياض، المملكة العربية السعودية',
    'footer.national_initiatives': 'المبادرات الوطنية',
    'footer.vision_support': 'دعم رؤية المملكة العربية السعودية للمستقبل',
    'footer.contact': 'اتصل بنا',

    // Core HR Module Titles and Descriptions
    'core_hr.benefits_desc': 'إدارة شاملة لمزايا الموظفين',
    'core_hr.compensation_benefits': 'التعويضات والمزايا',
    'core_hr.compensation_benefits_desc': 'إدارة شاملة للرواتب والمزايا',
    'core_hr.compensation_management': 'إدارة التعويضات',
    'core_hr.compensation_management_desc': 'نظام متقدم لإدارة التعويضات',
    'core_hr.employee_master_data': 'إدارة البيانات الأساسية للموظفين',
    'core_hr.employee_master_data_desc': 'نظام إدارة البيانات المركزي للموظفين',
    'core_hr.leave_management': 'إدارة الإجازات',
    'core_hr.leave_management_desc': 'نظام شامل لإدارة الإجازات والغياب',
    'core_hr.mobile_hr': 'الموارد البشرية المحمولة',
    'core_hr.mobile_hr_desc': 'تطبيق محمول للموارد البشرية',
    'core_hr.performance_management': 'إدارة الأداء',
    'core_hr.performance_management_desc': 'نظام شامل لتقييم ومتابعة الأداء',
    'core_hr.recruitment_onboarding': 'التوظيف والتأهيل',
    'core_hr.recruitment_onboarding_desc': 'نظام متكامل للتوظيف وتأهيل الموظفين الجدد',
    'core_hr.succession_planning': 'تخطيط التعاقب',
    'core_hr.succession_planning_desc': 'تخطيط استراتيجي لتطوير المواهب والقيادات',
    'core_hr.time_attendance': 'الوقت والحضور',
    'core_hr.time_attendance_desc': 'تتبع الوقت المتكامل مع منصة أبشر',
    'core_hr.training_development': 'التدريب والتطوير',
    'core_hr.training_development_desc': 'برامج شاملة لتطوير مهارات الموظفين',
    'core_hr.workflow_automation': 'أتمتة سير العمل',
    'core_hr.workflow_automation_desc': 'أتمتة العمليات والمهام الروتينية',

    // Core HR Metrics
    'core_hr.enrolled_employees': 'الموظفون المسجلون',
    'core_hr.active_benefits': 'المزايا النشطة',
    'core_hr.claims_processed': 'المطالبات المعالجة',
    'core_hr.satisfaction_rate': 'معدل الرضا',
    'core_hr.total_employees': 'إجمالي الموظفين',
    'core_hr.active_records': 'السجلات النشطة',
    'core_hr.data_accuracy': 'دقة البيانات',
    'core_hr.recent_updates': 'التحديثات الأخيرة',
    'core_hr.todays_attendance': 'حضور اليوم',
    'core_hr.absher_integration': 'تكامل أبشر',
    'core_hr.mobile_checkins': 'تسجيل الدخول المحمول',
    'core_hr.overtime_hours': 'ساعات إضافية',
    'core_hr.active': 'نشط',

    // Page titles and descriptions
    'pages.about': 'حول سند للموارد البشرية',
    'pages.analytics': 'التحليلات المتقدمة',
    'pages.consulting': 'أدوات الاستشارات المميزة',
    'pages.core_hr': 'وحدات الموارد البشرية الأساسية',
    'pages.employees': 'إدارة الموظفين',
    'pages.government': 'التكاملات الحكومية',
    'pages.organization': 'الهيكل التنظيمي',
    'pages.payroll': 'الرواتب والمالية',
    'pages.self_service': 'الخدمة الذاتية للموظفين',
    'pages.strategic': 'الموارد البشرية الاستراتيجية والتحليلات',
    'pages.documents': 'إدارة الوثائق',

    // UI Components
    'ui.loading': 'جاري التحميل...',
    'ui.no_data': 'لا توجد بيانات',
    'ui.error_occurred': 'حدث خطأ',
    'ui.try_again': 'حاول مرة أخرى',
    'ui.refresh': 'تحديث',
    'ui.load_more': 'تحميل المزيد',
    'ui.see_all': 'عرض الكل',
    'ui.show_less': 'عرض أقل',
    'ui.expand': 'توسيع',
    'ui.collapse': 'طي',
    'ui.toggle': 'تبديل',

    // Company & Business
    'company.about_sanadhr': 'حول سند للموارد البشرية',
    'company.mission': 'مهمتنا',
    'company.vision': 'رؤيتنا',
    'company.values': 'قيمنا',
    'company.team': 'فريقنا',
    'company.headquarters': 'المقر الرئيسي',
    'company.contact_info': 'معلومات الاتصال',
    'company.get_in_touch': 'تواصل معنا',
    'company.partners_alignment': 'الشركاء والمواءمة',
    'company.what_makes_different': 'ما يجعلنا مختلفين',
    'company.integrated_modules': 'الوحدات المتكاملة',
    'company.government_integrations': 'التكاملات الحكومية',
    'company.uptime_guarantee': 'ضمان وقت التشغيل',
    'company.supporting_initiatives': 'دعم المبادرات الوطنية',

    // AI Features
    'ai.features': 'مميزات الذكاء الاصطناعي',
    'ai.automation': 'الأتمتة الذكية',
    'ai.recommendations': 'التوصيات الذكية',
    'ai.smart_recommendations': 'التوصيات الذكية',
    'ai.predictive_models': 'النماذج التنبؤية',
    'ai.document_intelligence': 'ذكاء الوثائق',
    'ai.arabic_english_nlp': 'معالجة اللغة العربية والإنجليزية',
    'ai.bilingual_processing': 'المعالجة ثنائية اللغة',
    'ai.processing_accuracy': 'دقة المعالجة',
    'ai.average_accuracy': 'متوسط الدقة',
    'ai.documents_processed': 'الوثائق المعالجة',
    'ai.active_models': 'النماذج النشطة',
    'ai.no_recommendations': 'لا توجد توصيات بعد',
    'ai.recommendations_will_appear': 'ستظهر التوصيات بالذكاء الاصطناعي عند تحليل البيانات',
    'ai.employee_development': 'تطوير الموظفين بالذكاء الاصطناعي',
    'ai.intelligent_automation': 'الأتمتة الذكية للموارد البشرية المدعومة بالذكاء الاصطناعي المتقدم',
     'ai.engines_active': 'محركات الذكاء الاصطناعي نشطة',
     'ai.predictive_analytics_engine': 'محرك التحليلات التنبؤية',
     'ai.predictive_analytics_desc': 'تحليلات متقدمة لتوقع الاستنزاف والمخاطر والأداء',
     'ai.ml_models': 'نماذج التعلم الآلي',
     'ai.prediction_accuracy': 'دقة التنبؤ',
     'ai.at_risk_employees': 'الموظفون المعرضون للمخاطر',
     'ai.high_performers': 'أصحاب الأداء العالي',
     'ai.smart_recommendations_desc': 'توصيات ذكية مدعومة بالذكاء الاصطناعي لتطوير الموظفين',
     'ai.how_sanadhr_creates': 'كيف ينشئ سند للموارد البشرية التوصيات الذكية',
     'ai.advanced_ml_desc': 'خوارزميات التعلم الآلي المتقدمة تحلل أنماط الموظفين لتوليد رؤى قابلة للتنفيذ',
     'ai.data_collection': 'جمع البيانات',
     'ai.data_collection_desc': 'يحلل الذكاء الاصطناعي مقاييس الأداء والمهارات والخبرة والأنماط السلوكية',
     'ai.data_points': 'نقاط البيانات',
     'ai.ai_matching': 'المطابقة الذكية',
     'ai.ai_matching_desc': 'نماذج التعلم الآلي تحسب درجات التوافق عبر أبعاد متعددة',
     'ai.neural_networks': 'الشبكات العصبية',
     'ai.current_recommendations': 'التوصيات الحالية',
     'ai.ai_analysis': 'التحليل الذكي',
     'ai.decision_factors': 'عوامل القرار',
     'ai.success_tracking': 'تتبع النجاح',
     'ai.document_intelligence_desc': 'معالجة التعرف على النص المحسّن ومعالجة اللغة الطبيعية لأتمتة الوثائق',
     'ai.accuracy_rate': 'معدل الدقة',
     'ai.processing_time': 'وقت المعالجة',
     'ai.languages_supported': 'اللغات المدعومة',
     'ai.automated_workflow_engine': 'محرك سير العمل الآلي',
     'ai.automated_workflow_desc': 'حوّل عمليات الموارد البشرية بالأتمتة الذكية التي تتعلم وتتكيف وتحسن سير العمل في الوقت الفعلي',
     'ai.how_sanadhr_automates': 'كيف يؤتمت سند للموارد البشرية سير العمل',
     'ai.realtime_process_intelligence': 'ذكاء العمليات في الوقت الفعلي وأنبوب الأتمتة',

     // Analytics
    'analytics.advanced': 'التحليلات المتقدمة',
    'analytics.data_driven': 'رؤى مدفوعة بالبيانات وتحليلات القوى العاملة',
    'analytics.total_reports': 'إجمالي التقارير',
    'analytics.active_dashboards': 'لوحات التحكم النشطة',
    'analytics.data_accuracy': 'دقة البيانات',
    'analytics.roi_tracking': 'تتبع العائد على الاستثمار',
    'analytics.workforce_analytics': 'تحليلات القوى العاملة',
    'analytics.comprehensive_metrics': 'مقاييس شاملة للموارد البشرية',
    'analytics.custom_reports': 'تقارير مخصصة',
    'analytics.predictive_modeling': 'النمذجة التنبؤية',
    'analytics.turnover_forecasting': 'توقع معدل الدوران والأداء',
    'analytics.accuracy_rate': 'معدل الدقة',
    'analytics.realtime_dashboards': 'لوحات التحكم في الوقت الفعلي',
    'analytics.live_kpi': 'مراقبة مؤشرات الأداء المباشرة',
    'analytics.cost_analytics': 'تحليلات التكلفة',
    'analytics.cost_per_hire': 'تكلفة التوظيف والكفاءة',
    'analytics.compliance_reporting': 'تقارير الامتثال',
    'analytics.regulatory_tracking': 'تتبع الامتثال التنظيمي',
    'analytics.compliance_score': 'نقاط الامتثال',
    'analytics.performance_analytics': 'تحليلات الأداء',
    'analytics.individual_team_metrics': 'مقاييس الأفراد والفرق',
    'analytics.evaluations_completed': 'التقييمات المكتملة',

    // Consulting
    'consulting.premium_tools': 'أدوات الاستشارات المميزة',
    'consulting.executive_level': 'استشارات وتحول الموارد البشرية على المستوى التنفيذي',
    'consulting.market_percentile': 'النسبة المئوية للسوق',
    'consulting.pay_equity': 'نقاط عدالة الأجور',
    'consulting.annual_savings': 'التوفير السنوي',
    'consulting.culture_score': 'نقاط الثقافة',
    'consulting.executive_compensation': 'تعويضات المديرين التنفيذيين',
    'consulting.design_benchmarking': 'التصميم والمقارنة المرجعية',
    'consulting.organizational_restructuring': 'إعادة الهيكلة التنظيمية',
    'consulting.efficiency_optimization': 'تحسين الكفاءة وتحسين التكلفة',
    'consulting.efficiency_gain': 'كسب الكفاءة',
    'consulting.culture_transformation': 'تحول الثقافة',
    'consulting.culture_assessment': 'تقييم الثقافة والتغيير',
    'consulting.transformation_roi': 'عائد الاستثمار للتحول',

    // Core HR
    'core_hr.modules': 'وحدات الموارد البشرية الأساسية',
    'core_hr.manage_operations': 'إدارة عمليات الموارد البشرية بكفاءة',
    'core_hr.employee_master': 'البيانات الرئيسية للموظفين',
    'core_hr.complete_profile': 'إدارة الملف الشخصي الكامل مع الامتثال السعودي',
    'core_hr.employees_managed': 'الموظفون المدارون',
    'core_hr.organizational_structure': 'الهيكل التنظيمي',
    'core_hr.dynamic_org_chart': 'مخطط تنظيمي ديناميكي مع تتبع السعودة',
    'core_hr.saudization_rate': 'معدل السعودة',
    'core_hr.employee_self_service': 'الخدمة الذاتية للموظفين',
    'core_hr.personal_portal': 'بوابة شخصية مع الوصول عبر الجوال',
    'core_hr.active_users': 'المستخدمون النشطون',
    'core_hr.document_management': 'إدارة الوثائق',
    'core_hr.automated_collection': 'الجمع والتحقق التلقائي',
    'core_hr.absher_integration_desc': 'التكامل مع أبشر مع الجوال',
    'core_hr.reviews_completed': 'المراجعات المكتملة',
    'core_hr.goal_tracking': 'تتبع الأهداف والمعالم',

    // Leave Management (additional translations)
    'core_hr.pending_requests': 'الطلبات المعلقة',
    'core_hr.approved_this_month': 'الموافق عليها هذا الشهر',
    'core_hr.annual_leave_balance': 'رصيد الإجازة السنوية',
    'core_hr.emergency_leaves': 'الإجازات الطارئة',

    // Mobile HR (additional translations)
    'core_hr.app_downloads': 'تحميلات التطبيق',
    'core_hr.daily_active_users': 'المستخدمون النشطون يومياً',
    'core_hr.app_rating': 'تقييم التطبيق',
    'core_hr.mobile_requests': 'الطلبات المحمولة',

    // Recruitment & Onboarding (additional translations)
    'core_hr.open_positions': 'المناصب المفتوحة',
    'core_hr.new_hires_this_month': 'التوظيفات الجديدة هذا الشهر',
    'core_hr.onboarding_progress': 'تقدم التأهيل',
    'core_hr.time_to_hire': 'وقت التوظيف',

    // Training & Development (additional translations)
    'core_hr.active_programs': 'البرامج النشطة',
    'core_hr.tvtc_certified': 'معتمدون من التقني والمهني',
    'core_hr.training_hours': 'ساعات التدريب',
    'core_hr.completion_rate': 'معدل الإنجاز',

    // Workflow Automation (additional translations)
    'core_hr.automated_tasks': 'المهام الآلية',
    'core_hr.time_saved': 'الوقت المُوفّر',
    'core_hr.success_rate': 'معدل النجاح',

    // Compensation & Benefits (additional translations)
    'core_hr.average_salary': 'متوسط الراتب',
    'core_hr.benefits_enrolled': 'المسجلون في المزايا',
    'core_hr.bonus_distributed': 'المكافآت الموزعة',
    'core_hr.eosb_liability': 'التزام مكافأة نهاية الخدمة',

    // Compensation Management Core (additional translations)
    'core_hr.compensation_bands': 'نطاقات التعويض',
    'core_hr.merit_increase': 'زيادة الاستحقاق',
    'core_hr.market_alignment': 'التوافق مع السوق',
    'core_hr.budget_variance': 'انحراف الميزانية',

    // Succession Planning (additional translations)
    'core_hr.key_positions': 'المناصب الرئيسية',
    'core_hr.ready_successors': 'الخلفاء الجاهزون',
    'core_hr.succession_coverage': 'تغطية التعاقب',
    'core_hr.risk_score': 'درجة المخاطر',

    // Core HR Overview Page
    'core_hr.core_hr_modules': 'وحدات الموارد البشرية الأساسية',
    'core_hr.core_hr_modules_desc': 'إدارة عمليات الموارد البشرية بكفاءة',
    'core_hr.organizational_structure_desc': 'مخطط تنظيمي ديناميكي مع تتبع السعودة',
    'core_hr.employee_self_service_desc': 'بوابة شخصية مع وصول محمول',
    'core_hr.document_management_desc': 'الجمع والتحقق الآلي',

    // Employee Self-Service
    'core_hr.mobile_usage': 'استخدام الهاتف المحمول',
    'core_hr.requests_processed': 'الطلبات المعالجة',
    'core_hr.leave_management_service': 'إدارة الإجازات',
    'core_hr.leave_management_service_desc': 'طلب وتتبع أرصدة الإجازات',
    'core_hr.payslip_access': 'الوصول إلى قسيمة الراتب',
    'core_hr.payslip_access_desc': 'تحميل وعرض قسائم الرواتب',
    'core_hr.digital_access': 'وصول رقمي',
    'core_hr.realtime_updates': 'تحديثات فورية',

    // Employees
    'employees.master_data': 'البيانات الرئيسية للموظفين',
    'employees.complete_profile_mgmt': 'إدارة الملف الشخصي الكامل مع الامتثال السعودي',
    'employees.add_employee_short': 'إضافة موظف',
    'employees.total_employees': 'إجمالي الموظفين',
    'employees.active_contracts': 'العقود النشطة',
    'employees.compliance_score': 'نقاط الامتثال',
    'employees.employee_directory': 'دليل الموظفين',
    'employees.manage_profiles': 'إدارة الملفات الشخصية والمعلومات',
    'employees.table_implemented': 'سيتم تنفيذ جدول الموظفين هنا',

    // Organization
    'organization.structure': 'الهيكل التنظيمي',
    'organization.dynamic_chart': 'مخطط تنظيمي ديناميكي مع تتبع السعودة',
    'organization.total_departments': 'إجمالي الأقسام',
    'organization.management_levels': 'مستويات الإدارة',
    'organization.open_positions': 'المناصب الشاغرة',
    'organization.org_chart': 'المخطط التنظيمي',
    'organization.visual_representation': 'التمثيل المرئي لهيكل الشركة',
    'organization.interactive_chart': 'سيتم عرض المخطط التنظيمي التفاعلي هنا',

    // Documents
    'documents.management': 'إدارة الوثائق',
    'documents.automated_collection': 'الجمع والتحقق التلقائي',
    'documents.processed': 'الوثائق المعالجة',
    'documents.ai_accuracy': 'دقة الذكاء الاصطناعي',
    'documents.pending_review': 'في انتظار المراجعة',
    'documents.storage_used': 'التخزين المستخدم',
    'documents.id_verification': 'التحقق من الهوية',
    'documents.automatic_processing': 'معالجة وثائق الهوية التلقائية',
    'documents.accuracy_rate': 'معدل الدقة',
    'documents.contract_management': 'إدارة العقود',
    'documents.digital_storage': 'التخزين الرقمي للعقود',
    'documents.contracts_active': 'العقود النشطة',
    'documents.compliance_tracking': 'تتبع الامتثال',
    'documents.expiry_monitoring': 'مراقبة انتهاء صلاحية الوثائق',
    'documents.auto_notifications': 'الإشعارات التلقائية مفعلة',

    // Government
    'government.integrations': 'التكاملات الحكومية',
    'government.seamless_integration': 'التكامل السلس مع المنصات الحكومية السعودية',
    'government.qiwa_integration': 'تكامل قوى',
    'government.employment_contracts': 'عقود العمل والتحويلات',
    'government.health_status': 'حالة الصحة',
    'government.gosi_integration': 'تكامل التأمينات الاجتماعية',
    'government.insurance_payroll': 'مساهمات التأمين وكشف الرواتب',
    'government.absher_platform': 'منصة أبشر',
    'government.identity_verification': 'التحقق من الهوية والتحقق',
     'government.mudad_platform': 'منصة مدد',
     'government.wage_protection': 'نظام حماية الأجور',
     'government.compliance_status': 'امتثال بنسبة 100%',
     
     // Government specific translations
     'government.mudad_desc': 'نظام حماية الأجور وإدارة البيانات المالية',
     'government.elm_platform': 'منصة إلم',
     'government.elm_desc': 'نظام إلكتروني لإدارة العمالة والتأشيرات',
     'government.tvtc_integration': 'تكامل التدريب التقني',
     'government.tvtc_desc': 'نظام التدريب التقني والمهني',
     'government.absher_desc': 'منصة الخدمات الحكومية الإلكترونية',
     'government.medical_insurance': 'التأمين الطبي',
     'government.medical_insurance_desc': 'نظام إدارة التأمين الطبي للموظفين',
     
      // GOSI Integration (detailed keys)
     'government.gosi_desc': 'المرسوم الملكي رقم م/273 - نظام المساهمات التصاعدية',
     'government.monthly_contributions': 'المساهمات الشهرية',
     'government.total_monthly_gosi': 'إجمالي التأمينات الشهرية',
     'government.employee_share': 'حصة الموظف',
     'government.payroll_deductions': 'خصومات كشف المرتبات',
     'government.employer_share': 'حصة صاحب العمل',
     'government.company_contributions': 'مساهمات الشركة',
     'government.system_distribution': 'توزيع النظام',
     'government.old_system': 'النظام القديم',
     'government.new_system': 'النظام الجديد',
     'government.employee_breakdown': 'تفصيل الموظفين',
     'government.rate_schedule': 'جدول المعدلات',
     'government.compliance': 'الامتثال',
     'government.employee_gosi_contributions': 'مساهمات التأمينات للموظفين',
     'government.individual_contribution_breakdown': 'تفصيل المساهمات الفردية حسب نوع النظام',
     'government.employee': 'الموظف',
     'government.hire_date': 'تاريخ التوظيف',
     'government.system': 'النظام',
     'government.nationality': 'الجنسية',
     'government.salary': 'الراتب',
     'government.employee_rate': 'معدل الموظف',
     'government.employer_rate': 'معدل صاحب العمل',
     'government.employee_contrib': 'مساهمة الموظف',
     'government.employer_contrib': 'مساهمة صاحب العمل',
     'government.showing_first_10': 'عرض أول 10 من',
     'government.employees': 'الموظفين',
     'government.progressive_rate_schedule': 'جدول المعدلات التصاعدية (المرسوم الملكي م/273)',
     'government.automatic_rate_progression': 'التطور التلقائي للمعدلات للموظفين في النظام الجديد فقط',
     'government.period': 'الفترة',
     'government.saudi_nationals_rates': 'المواطنون السعوديون (موظف + صاحب العمل)',
     'government.non_saudi_nationals_rates': 'غير السعوديين (موظف + صاحب العمل)',
     'government.important_notes': 'ملاحظات مهمة',
     'government.progressive_rates_note_1': 'تطبق المعدلات التصاعدية فقط على الموظفين المعينين في أو بعد 1 يوليو 2025',
     'government.progressive_rates_note_2': 'الموظفون الحاليون (المعينون قبل 1 يوليو 2025) يبقون على معدلات ثابتة 9%+9% (سعودي) أو 0%+2% (وافد)',
     'government.progressive_rates_note_3': 'يحدث تطور المعدلات تلقائياً في 1 يوليو من كل عام',
     'government.progressive_rates_note_4': 'يحتفظ النظام بسجل مراجعة كامل لجميع تغييرات المعدلات',
     'government.gosi_compliance_status': 'حالة امتثال التأمينات الاجتماعية',
     'government.royal_decree_compliance_monitoring': 'مراقبة امتثال المرسوم الملكي م/273',
     'government.employee_classification': 'تصنيف الموظفين',
     'government.all_employees_classified': 'جميع الموظفين مصنفون بشكل صحيح حسب تاريخ التوظيف',
     'government.rate_application': 'تطبيق المعدلات',
     'government.progressive_rates_applied': 'تطبق المعدلات التصاعدية وفقاً للمرسوم الملكي',
     'government.audit_trail': 'سجل المراجعة',
     'government.full_change_history': 'يتم الاحتفاظ بتاريخ كامل للتغييرات',
     'government.compliance_summary': 'ملخص الامتثال',
     'government.employees_processed': 'موظف تمت معالجتهم',
     'government.on_legacy_system': 'على النظام القديم (معدلات ثابتة)',
     'government.on_new_progressive_system': 'على النظام التصاعدي الجديد',
     'government.compliance_with_royal_decree': 'امتثال للمرسوم الملكي م/273',
     'government.ready_for_gosi_submission': 'جاهز لإنشاء ملف تقديم التأمينات الاجتماعية',
     'government.run_rate_progression': 'تشغيل تطور المعدلات',

    // Payroll
    'payroll.financial': 'الرواتب والمالية',
    'payroll.wps_processing': 'معالجة رواتب نظام حماية الأجور وإدارة التأمينات الاجتماعية (المرسوم الملكي م/273)',
    'payroll.gosi_system': 'نظام مساهمات التأمينات الاجتماعية (المرسوم الملكي م/273)',
    'payroll.effective_date': 'ساري المفعول 1 يوليو 2025',
    'payroll.system_distribution': 'توزيع النظام',
    'payroll.old_system': 'النظام القديم',
    'payroll.new_system': 'النظام الجديد',
    'payroll.employee_contributions': 'مساهمات الموظفين',
    'payroll.monthly_deductions': 'الخصومات الشهرية',
    'payroll.employer_contributions': 'مساهمات صاحب العمل',
    'payroll.company_obligations': 'التزامات الشركة',
    'payroll.total_gosi': 'إجمالي التأمينات الاجتماعية',
    'payroll.combined_monthly': 'مجتمعة شهرياً',
    'payroll.december_2024': 'كشف رواتب ديسمبر 2024',
    'payroll.employees_processed': 'الموظفون المعالجون',
    'payroll.saudi_employees': 'سعودي',
    'payroll.expat_employees': 'وافد',
    'payroll.gosi_contributions': 'مساهمات التأمينات الاجتماعية',
    'payroll.royal_decree_compliant': 'متوافق مع المرسوم الملكي م/273',
    'payroll.average_salary': 'متوسط الراتب',
    'payroll.wps_processing_desc': 'حسابات الراتب التلقائية وتوليد ملف البنك',
    'payroll.compliance_status': 'حالة الامتثال 100%',
    'payroll.eosb_calculations': 'حسابات نهاية الخدمة',
    'payroll.eosb_management': 'حسابات نهاية الخدمة وإدارة المسؤولية',
    'payroll.total_liability': 'إجمالي المسؤولية: 2,340,000 ريال سعودي',
    'payroll.refresh_gosi': 'تحديث بيانات التأمينات الاجتماعية',
    'payroll.on_old_system': 'على النظام القديم',

    // Self Service
    'self_service.title': 'الخدمة الذاتية للموظفين',
    'self_service.personal_portal': 'بوابة شخصية مع الوصول عبر الجوال',
    'self_service.mobile_usage': 'استخدام الجوال',
    'self_service.requests_processed': 'الطلبات المعالجة',
    'self_service.satisfaction_score': 'نقاط الرضا',
    'self_service.leave_management': 'إدارة الإجازات',
    'self_service.request_track': 'طلب وتتبع أرصدة الإجازات',
    'self_service.pending_requests': 'الطلبات المعلقة',
    'self_service.payslip_access': 'الوصول إلى كشف الراتب',
    'self_service.download_payslips': 'تنزيل وعرض كشوف الرواتب',
    'self_service.digital_access': 'الوصول الرقمي 100%',
    'self_service.profile_management': 'إدارة الملف الشخصي',
    'self_service.update_information': 'تحديث المعلومات الشخصية',
    'self_service.realtime_updates': 'التحديثات في الوقت الفعلي',

    // Strategic
    'strategic.hr_analytics': 'الموارد البشرية الاستراتيجية والتحليلات',
    'strategic.workforce_planning': 'تخطيط القوى العاملة وإدارة الموارد البشرية الاستراتيجية',
    'strategic.current_headcount': 'العدد الحالي للموظفين',
    'strategic.planned_growth': 'النمو المخطط',
    'strategic.skills_gaps': 'فجوات المهارات',
    'strategic.succession_coverage': 'تغطية التخطيط للخلافة',
    'strategic.strategic_workforce': 'التخطيط الاستراتيجي للقوى العاملة',
    'strategic.scenario_modeling': 'نمذجة السيناريو والتخطيط',
    'strategic.identified_gaps': 'فجوات المهارات المحددة',
    'strategic.leadership_development': 'تطوير القيادة',
    'strategic.pipeline_succession': 'خط الأنابيب وتخطيط التعاقب',
    'strategic.key_positions': 'المناصب الرئيسية المتتبعة',
    'strategic.saudization_tracking': 'تتبع السعودة',
    'strategic.nitaqat_compliance': 'مراقبة امتثال نطاقات',
    'strategic.current_rate': 'المعدل الحالي',

    // Status and states
    'status.online': 'متصل',
    'status.offline': 'غير متصل',
    'status.connected': 'متصل',
    'status.disconnected': 'منقطع',
    'status.pending': 'قيد الانتظار',
    'status.completed': 'مكتمل',
    'status.approved': 'موافق عليه',
    'status.rejected': 'مرفوض',
    'status.draft': 'مسودة',
    'status.published': 'منشور',

    // Actions
    'action.view': 'عرض',
    'action.edit': 'تعديل',
    'action.add': 'إضافة',
    'action.delete': 'حذف',
    'action.create': 'إنشاء',
    'action.update': 'تحديث',
    'action.save': 'حفظ',
    'action.cancel': 'إلغاء',
    'action.search': 'بحث',
    'action.filter': 'تصفية',
    'action.export': 'تصدير',
    'action.import': 'استيراد',
    'action.download': 'تنزيل',
    'action.upload': 'رفع',
    'action.print': 'طباعة',
    'action.share': 'مشاركة',
    'action.copy': 'نسخ',

    // Time and dates
    'time.today': 'اليوم',
    'time.yesterday': 'أمس',
    'time.tomorrow': 'غداً',
    'time.this_month': 'هذا الشهر',
    'time.last_month': 'الشهر الماضي',
    'time.this_year': 'هذا العام',
    'time.last_year': 'العام الماضي',
    'time.daily': 'يومي',
    'time.weekly': 'أسبوعي',
    'time.monthly': 'شهري',
    'time.quarterly': 'ربع سنوي',
    'time.yearly': 'سنوي',

    // Numbers and quantities
    'qty.all': 'الكل',
    'qty.none': 'لا شيء',
    'qty.total': 'إجمالي',
    'qty.count': 'العدد',
    'qty.number': 'الرقم',
    'qty.amount': 'المبلغ',
    'qty.percentage': 'النسبة المئوية',

    // Welcome messages
    'welcome.to_sanadhr': 'مرحباً بك في سند للموارد البشرية',
    'welcome.complete_platform': 'منصة إدارة الموارد البشرية الكاملة - مصممة للتميز في المملكة العربية السعودية',
    'welcome.all_systems': 'جميع الأنظمة تعمل',
    'welcome.modules_active': 'وحدة نشطة',
    'welcome.integrations_live': 'التكاملات الحكومية مباشرة',

    // Platform status
    'platform.status_overview': 'نظرة عامة على حالة المنصة',
    'platform.core_modules': 'وحدات الموارد البشرية الأساسية',
    'platform.payroll_modules': 'وحدات كشف الرواتب',
    'platform.ai_features': 'مميزات الذكاء الاصطناعي',
    'platform.active_workflows': 'سير العمل النشط',
    
    // Common terms for government pages
    'common.online': 'متصل',
    'common.active': 'نشط',
    'common.overview': 'نظرة عامة',
    'common.today': 'اليوم',
    'common.this_month': 'هذا الشهر',
    'common.excellent': 'ممتاز',
    'common.peak': 'الذروة',
    'common.last_week': 'الأسبوع الماضي',
     'common.sar': 'ريال',
     'common.status': 'الحالة',
     'common.current': 'الحالي',
     'common.future': 'المستقبل',
     'common.total': 'الإجمالي',
     'common.refresh_data': 'تحديث البيانات',
     'analytics.workforce_analytics_desc': 'مقاييس ورؤى شاملة للقوى العاملة',
     'consulting.executive_compensation_desc': 'تصميم ومقارنة تعويضات المستوى التنفيذي',

  },
  en: {
     // Navigation
     'nav.dashboard': 'Dashboard',
     'nav.core_hr': 'Core HR',
     'nav.ai_automation': 'AI & Automation',
     'nav.government': 'Government Integration',
     'nav.employees': 'Employees',
     'nav.payroll': 'Payroll',
     'nav.analytics': 'Analytics',
     'nav.compliance': 'Compliance & Governance',
     'nav.ai_features': 'AI Features',
     
     // Navigation Sub-items - Core HR
     'nav.employee_master_data': 'Employee Master Data',
     'nav.payroll_processing': 'Payroll Processing',
     'nav.benefits_administration': 'Benefits Administration',
     'nav.performance_management': 'Performance Management',
     'nav.recruitment_hiring': 'Recruitment & Hiring',
     'nav.training_development': 'Training & Development',
     'nav.time_attendance': 'Time & Attendance',
     'nav.leave_management': 'Leave Management',
     'nav.succession_planning': 'Succession Planning',
     'nav.compensation_management': 'Compensation Management',
     'nav.employee_self_service': 'Employee Self Service',
     'nav.manager_dashboard': 'Manager Dashboard',
     
     // Navigation Sub-items - AI & Automation
     'nav.ai_sync_engine': 'AI Sync Engine',
     'nav.smart_recommendations': 'Smart Recommendations',
     'nav.predictive_analytics': 'Predictive Analytics',
     'nav.document_intelligence': 'Document Intelligence',
     'nav.arabic_english_nlp': 'Arabic-English NLP',
     'nav.automated_workflows': 'Automated Workflows',
     
     // Navigation Sub-items - Government
     'nav.qiwa_integration': 'Qiwa Integration',
     'nav.gosi_integration': 'GOSI Integration',
     'nav.mudad_platform': 'Mudad Platform',
     'nav.elm_platform': 'ELM Platform',
     'nav.absher_platform': 'Absher Platform',
     'nav.hrsd_integration': 'HRSD Integration',
     'nav.tvtc_doroob': 'TVTC/Doroob Platform',
     'nav.health_insurance': 'Health Insurance',
     
     // Sidebar UI
     'sidebar.platform_modules': 'Platform Modules',
     'sidebar.complete_hr_platform': 'Complete HR Platform',
     'sidebar.all_systems_operational': 'All Systems Operational',
     'sidebar.language_toggle': '🌐 العربية / English',
    
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

    // AI Automation & Smart Recommendations
    'ai.smart_recommendations': 'Smart Recommendations Engine',
    'ai.smart_recommendations_desc': 'AI-powered talent intelligence that identifies the perfect matches for transfers, promotions, and role assignments',
    'ai.how_sanadhr_creates': 'How SanadHR Creates Smart Recommendations',
    'ai.advanced_ml_desc': 'Advanced machine learning analyzes multiple data points for optimal talent decisions',
    'ai.data_collection': 'Data Collection',
    'ai.data_collection_desc': 'AI analyzes performance metrics, skills, experience, and behavioral patterns',
    'ai.data_points': '50+ Data Points',
    'ai.ai_matching': 'AI Matching',
    'ai.ai_matching_desc': 'Machine learning models calculate compatibility scores across multiple dimensions',
    'ai.neural_networks': 'Neural Networks',
    'ai.smart_ranking': 'Smart Ranking',
    'ai.smart_ranking_desc': 'Recommendations are ranked by success probability and strategic alignment',
    'ai.accuracy_rate': '87.6% Accuracy',
    'ai.total_recommendations': 'Total Recommendations',
    'ai.prediction_accuracy': 'Prediction Accuracy',
    'ai.implemented_actions': 'Implemented Actions',
    'ai.success_rate': 'Success Rate',
    'ai.this_month': 'this month',
    'ai.across_departments': 'Across 12 departments',
    'ai.based_historical': 'Based on historical outcomes',
    'ai.acceptance_rate': 'acceptance rate',
    'ai.post_implementation': 'Post-implementation performance',
    'ai.current_recommendations': 'Current Recommendations',
    'ai.ai_analysis': 'AI Analysis',
    'ai.decision_factors': 'Decision Factors',
    'ai.success_tracking': 'Success Tracking',
    'ai.active_talent_recommendations': 'Active Talent Recommendations',
    'ai.ai_generated_suggestions': 'AI-generated suggestions based on real-time analysis',
    'ai.match_score': 'Match Score',
    'ai.ai_analysis_framework': 'AI Analysis Framework',
    'ai.ml_models_desc': 'How our machine learning models evaluate talent potential',
    'ai.performance_metrics_analysis': 'Performance Metrics Analysis',
    'ai.historical_performance': 'Historical Performance',
    'ai.skill_assessments': 'Skill Assessments',
    'ai.growth_trajectory': 'Growth Trajectory',
    'ai.peer_feedback': 'Peer Feedback',
    'ai.behavioral_analysis': 'Behavioral Analysis',
    'ai.leadership_indicators': 'Leadership Indicators',
    'ai.adaptability_score': 'Adaptability Score',
    'ai.cultural_fit': 'Cultural Fit',
    'ai.career_aspirations': 'Career Aspirations',
    'ai.weight': 'weight',
    'ai.key_decision_factors': 'Key Decision Factors',
    'ai.critical_elements_desc': 'Critical elements that influence recommendation accuracy',
    'ai.role_requirements_matching': 'Role Requirements Matching',
    'ai.role_requirements_desc': 'AI compares candidate skills against detailed job requirements and success profiles',
    'ai.performance_trajectory_analysis': 'Performance Trajectory Analysis',
    'ai.performance_trajectory_desc': 'Historical performance trends predict future success probability in new roles',
    'ai.team_dynamics_culture': 'Team Dynamics & Cultural Fit',
    'ai.team_dynamics_desc': 'Social network analysis ensures recommendations consider team chemistry and culture',
    'ai.success_tracking_outcomes': 'Success Tracking & Outcomes',
    'ai.measure_improve_desc': 'How we measure and improve recommendation effectiveness',
    'ai.six_month_success': '6-month success rate',
    'ai.performance_improvement': 'Performance improvement',
    'ai.successful_placements': 'Successful placements',
    'ai.recent_success_stories': 'Recent Success Stories',
    'ai.promoted_analyst': 'Promoted analyst achieved 34% better performance in new role within 3 months',
    'ai.cross_department': 'Cross-department transfer resulted in 28% productivity increase for receiving team',
    'ai.recommendation_management': 'Recommendation Management',
    'ai.review_act_desc': 'Review and act on AI-generated talent recommendations',
    'ai.review_new_recommendations': 'Review New Recommendations',
    'ai.set_recommendation_criteria': 'Set Recommendation Criteria',
    'ai.view_success_analytics': 'View Success Analytics',

    // Analytics
    'analytics.advanced_analytics': 'Advanced Analytics',
    'analytics.data_driven_insights': 'Data-driven insights and workforce analytics',

    // Consulting
    'consulting.premium_consulting': 'Premium Consulting Tools',
    'consulting.executive_hr_consulting': 'Executive-level HR consulting and transformation',

    // Government
    'government.government_integrations': 'Government Integrations',
    'government.seamless_integration': 'Seamless integration with Saudi government platforms',

    // Strategic
    'strategic.strategic_hr': 'Strategic HR',
    'strategic.strategic_hr_desc': 'Strategic workforce planning and talent management'
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