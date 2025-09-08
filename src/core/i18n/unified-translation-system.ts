/**
 * Unified Translation System for AQLHR Platform
 * Comprehensive bilingual support with RTL/LTR layout management
 * 
 * @version 2.0.0
 * @author Expert Developer Team
 * @date 2025-09-08
 */

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

// Core translation interface
export interface TranslationKey {
  ar: string;
  en: string;
}

// Comprehensive translation database
export const translations: Record<string, TranslationKey> = {
  // Common UI Elements
  'common.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'common.save': { ar: 'حفظ', en: 'Save' },
  'common.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'common.edit': { ar: 'تعديل', en: 'Edit' },
  'common.delete': { ar: 'حذف', en: 'Delete' },
  'common.add': { ar: 'إضافة', en: 'Add' },
  'common.search': { ar: 'بحث', en: 'Search' },
  'common.filter': { ar: 'تصفية', en: 'Filter' },
  'common.export': { ar: 'تصدير', en: 'Export' },
  'common.import': { ar: 'استيراد', en: 'Import' },
  'common.loading': { ar: 'جاري التحميل...', en: 'Loading...' },
  'common.error': { ar: 'خطأ', en: 'Error' },
  'common.success': { ar: 'نجح', en: 'Success' },
  'common.warning': { ar: 'تحذير', en: 'Warning' },
  'common.info': { ar: 'معلومات', en: 'Information' },
  'common.confirm': { ar: 'تأكيد', en: 'Confirm' },
  'common.yes': { ar: 'نعم', en: 'Yes' },
  'common.no': { ar: 'لا', en: 'No' },
  'common.close': { ar: 'إغلاق', en: 'Close' },
  'common.back': { ar: 'رجوع', en: 'Back' },
  'common.next': { ar: 'التالي', en: 'Next' },
  'common.previous': { ar: 'السابق', en: 'Previous' },
  'common.continue': { ar: 'متابعة', en: 'Continue' },
  'common.finish': { ar: 'إنهاء', en: 'Finish' },
  'common.start': { ar: 'بدء', en: 'Start' },
  'common.stop': { ar: 'توقف', en: 'Stop' },
  'common.pause': { ar: 'إيقاف مؤقت', en: 'Pause' },
  'common.resume': { ar: 'استئناف', en: 'Resume' },
  'common.reset': { ar: 'إعادة تعيين', en: 'Reset' },
  'common.refresh': { ar: 'تحديث', en: 'Refresh' },
  'common.view': { ar: 'عرض', en: 'View' },
  'common.details': { ar: 'التفاصيل', en: 'Details' },
  'common.settings': { ar: 'الإعدادات', en: 'Settings' },
  'common.profile': { ar: 'الملف الشخصي', en: 'Profile' },
  'common.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'common.login': { ar: 'تسجيل الدخول', en: 'Login' },

  // Navigation
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.executive': { ar: 'مركز الذكاء التنفيذي', en: 'Executive Intelligence Center' },
  'nav.coreHR': { ar: 'الموارد البشرية الأساسية', en: 'Core HR' },
  'nav.recruitment': { ar: 'التوظيف والتعيين', en: 'Recruitment & Hiring' },
  'nav.performance': { ar: 'إدارة الأداء', en: 'Performance Management' },
  'nav.payroll': { ar: 'معالجة الرواتب', en: 'Payroll Processing' },
  'nav.benefits': { ar: 'إدارة المزايا', en: 'Benefits Management' },
  'nav.training': { ar: 'التدريب والتطوير', en: 'Training & Development' },
  'nav.timeAttendance': { ar: 'الوقت والحضور', en: 'Time & Attendance' },
  'nav.leave': { ar: 'إدارة الإجازات', en: 'Leave Management' },
  'nav.succession': { ar: 'تخطيط التعاقب', en: 'Succession Planning' },
  'nav.compensation': { ar: 'إدارة التعويضات', en: 'Compensation Management' },
  'nav.saudization': { ar: 'حاسبة السعودة والتأشيرات', en: 'Saudization & Visa Calculator' },
  'nav.selfService': { ar: 'الخدمة الذاتية للموظفين', en: 'Employee Self-Service' },
  'nav.managerDashboard': { ar: 'لوحة تحكم المدير', en: 'Manager Dashboard' },
  'nav.analytics': { ar: 'التحليلات والتقارير', en: 'Analytics & Reports' },
  'nav.compliance': { ar: 'الامتثال والحوكمة', en: 'Compliance & Governance' },
  'nav.aiAutomation': { ar: 'الذكاء الاصطناعي والأتمتة', en: 'AI & Automation' },

  // LEO Module
  'leo.title': { ar: 'تحسين تجربة التعلم - ليو', en: 'Learning Experience Optimization - LEO' },
  'leo.subtitle': { ar: 'التعلم المصغر المدعوم بالذكاء الاصطناعي، والمسارات التكيفية وتطوير المهارات الشخصية', en: 'AI-Powered Micro-Learning, Adaptive Pathways & Personalized Skill Development' },
  'leo.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'leo.myLearning': { ar: 'تعلمي', en: 'My Learning' },
  'leo.skillsProgress': { ar: 'تقدم المهارات', en: 'Skills Progress' },
  'leo.learningPaths': { ar: 'مسارات التعلم', en: 'Learning Paths' },
  'leo.smartAI': { ar: 'الذكاء الذكي', en: 'Smart AI' },
  'leo.analytics': { ar: 'التحليلات', en: 'Analytics' },
  'leo.engagementScore': { ar: 'نقاط المشاركة', en: 'Engagement Score' },
  'leo.learningHours': { ar: 'ساعات التعلم', en: 'Learning Hours' },
  'leo.dayStreak': { ar: 'أيام متتالية', en: 'Day Streak' },
  'leo.skillsAcquired': { ar: 'مهارات مكتسبة', en: 'Skills Acquired' },
  'leo.modulesCompleted': { ar: 'وحدات مكتملة', en: 'Modules Completed' },
  'leo.liveDemoActive': { ar: 'بيانات العرض التوضيحي المباشر نشطة', en: 'Live Demo Data Active' },
  'leo.continuelearning': { ar: 'متابعة التعلم', en: 'Continue Learning' },
  'leo.aiRecommendations': { ar: 'توصيات الذكاء الاصطناعي', en: 'AI Recommendations' },
  'leo.activeTrainingModules': { ar: 'وحدات التدريب النشطة', en: 'Active Training Modules' },
  'leo.individualProgress': { ar: 'التقدم الفردي', en: 'Individual Learning Progress' },
  'leo.learningAnalytics': { ar: 'تحليلات التعلم والأداء', en: 'Learning Analytics & Performance' },

  // GEO Module
  'geo.title': { ar: 'تحسين المشاركة التوليدية - جيو', en: 'Generative Engagement Optimization - GEO' },
  'geo.subtitle': { ar: 'منصة المشاركة الذكية المدعومة بالذكاء الاصطناعي لتعزيز مشاركة الموظفين وتحسين الأداء', en: 'AI-Powered Smart Engagement Platform for Enhanced Employee Engagement and Performance' },
  'geo.engagementMetrics': { ar: 'مقاييس المشاركة', en: 'Engagement Metrics' },
  'geo.teamCollaboration': { ar: 'التعاون الجماعي', en: 'Team Collaboration' },
  'geo.performanceInsights': { ar: 'رؤى الأداء', en: 'Performance Insights' },
  'geo.culturalAlignment': { ar: 'التوافق الثقافي', en: 'Cultural Alignment' },
  'geo.wellbeingIndex': { ar: 'مؤشر الرفاهية', en: 'Wellbeing Index' },
  'geo.feedbackAnalysis': { ar: 'تحليل التغذية الراجعة', en: 'Feedback Analysis' },
  'geo.recognitionPrograms': { ar: 'برامج التقدير', en: 'Recognition Programs' },
  'geo.careerDevelopment': { ar: 'التطوير المهني', en: 'Career Development' },

  // Analytics Module
  'analytics.title': { ar: 'التحليلات والتقارير', en: 'Analytics & Reports' },
  'analytics.description': { ar: 'تحليلات شاملة لأداء الموظفين والمؤسسة', en: 'Comprehensive analytics for employee and organizational performance' },
  'analytics.performanceMetrics': { ar: 'مقاييس الأداء', en: 'Performance Metrics' },
  'analytics.hrInsights': { ar: 'رؤى الموارد البشرية', en: 'HR Insights' },
  'analytics.predictiveAnalytics': { ar: 'التحليلات التنبؤية', en: 'Predictive Analytics' },
  'analytics.dataVisualization': { ar: 'تصور البيانات', en: 'Data Visualization' },
  'analytics.reportGeneration': { ar: 'إنشاء التقارير', en: 'Report Generation' },
  'analytics.kpiTracking': { ar: 'تتبع مؤشرات الأداء الرئيسية', en: 'KPI Tracking' },

  // Training & Development
  'training.title': { ar: 'التدريب والتطوير', en: 'Training & Development' },
  'training.description': { ar: 'برامج التدريب والتطوير المهني الشاملة', en: 'Comprehensive training and professional development programs' },
  'training.trainingPrograms': { ar: 'برامج التدريب', en: 'Training Programs' },
  'training.skillDevelopment': { ar: 'تطوير المهارات', en: 'Skill Development' },
  'training.certifications': { ar: 'الشهادات', en: 'Certifications' },
  'training.learningManagement': { ar: 'إدارة التعلم', en: 'Learning Management' },
  'training.competencyFramework': { ar: 'إطار الكفاءات', en: 'Competency Framework' },
  'training.performanceImprovement': { ar: 'تحسين الأداء', en: 'Performance Improvement' },

  // Recruitment & Hiring
  'recruitment.title': { ar: 'التوظيف والتعيين', en: 'Recruitment & Hiring' },
  'recruitment.description': { ar: 'نظام إدارة التوظيف الشامل مع منصات محلية ودولية', en: 'Comprehensive recruitment management system with local and international platforms' },
  'recruitment.localPlatforms': { ar: 'المنصات المحلية', en: 'Local Platforms' },
  'recruitment.internationalAgents': { ar: 'الوكلاء الدوليون', en: 'International Agents' },
  'recruitment.communicationHub': { ar: 'مركز التواصل', en: 'Communication Hub' },
  'recruitment.complianceMonitoring': { ar: 'مراقبة الامتثال', en: 'Compliance Monitoring' },
  'recruitment.candidateManagement': { ar: 'إدارة المرشحين', en: 'Candidate Management' },
  'recruitment.interviewScheduling': { ar: 'جدولة المقابلات', en: 'Interview Scheduling' },

  // Performance Management
  'performance.title': { ar: 'إدارة الأداء', en: 'Performance Management' },
  'performance.description': { ar: 'نظام إدارة الأداء المتكامل مع التقييمات والتطوير', en: 'Integrated performance management system with reviews and development' },
  'performance.goalSetting': { ar: 'وضع الأهداف', en: 'Goal Setting' },
  'performance.performanceReviews': { ar: 'مراجعات الأداء', en: 'Performance Reviews' },
  'performance.feedback360': { ar: 'التغذية الراجعة 360', en: '360 Feedback' },
  'performance.developmentPlans': { ar: 'خطط التطوير', en: 'Development Plans' },
  'performance.successorPlanning': { ar: 'تخطيط التعاقب', en: 'Successor Planning' },
  'performance.talentManagement': { ar: 'إدارة المواهب', en: 'Talent Management' },

  // Payroll Processing
  'payroll.title': { ar: 'معالجة الرواتب', en: 'Payroll Processing' },
  'payroll.description': { ar: 'نظام معالجة الرواتب المتكامل مع الامتثال السعودي', en: 'Integrated payroll processing system with Saudi compliance' },
  'payroll.salaryCalculation': { ar: 'حساب الراتب', en: 'Salary Calculation' },
  'payroll.benefitsManagement': { ar: 'إدارة المزايا', en: 'Benefits Management' },
  'payroll.taxCompliance': { ar: 'الامتثال الضريبي', en: 'Tax Compliance' },
  'payroll.payrollReports': { ar: 'تقارير الرواتب', en: 'Payroll Reports' },
  'payroll.endOfService': { ar: 'مكافأة نهاية الخدمة', en: 'End of Service Benefits' },
  'payroll.wpsIntegration': { ar: 'تكامل نظام حماية الأجور', en: 'WPS Integration' },

  // Time & Attendance
  'timeAttendance.title': { ar: 'الوقت والحضور', en: 'Time & Attendance' },
  'timeAttendance.description': { ar: 'نظام إدارة الوقت والحضور الذكي', en: 'Smart time and attendance management system' },
  'timeAttendance.clockInOut': { ar: 'تسجيل الدخول والخروج', en: 'Clock In/Out' },
  'timeAttendance.shiftManagement': { ar: 'إدارة الورديات', en: 'Shift Management' },
  'timeAttendance.overtimeTracking': { ar: 'تتبع الوقت الإضافي', en: 'Overtime Tracking' },
  'timeAttendance.leaveManagement': { ar: 'إدارة الإجازات', en: 'Leave Management' },
  'timeAttendance.attendanceReports': { ar: 'تقارير الحضور', en: 'Attendance Reports' },
  'timeAttendance.biometricIntegration': { ar: 'التكامل البيومتري', en: 'Biometric Integration' },

  // Employee Self-Service
  'selfService.title': { ar: 'الخدمة الذاتية للموظفين', en: 'Employee Self-Service' },
  'selfService.description': { ar: 'بوابة الخدمة الذاتية للموظفين', en: 'Employee self-service portal' },
  'selfService.personalInfo': { ar: 'المعلومات الشخصية', en: 'Personal Information' },
  'selfService.payslipAccess': { ar: 'الوصول لقسيمة الراتب', en: 'Payslip Access' },
  'selfService.leaveRequests': { ar: 'طلبات الإجازة', en: 'Leave Requests' },
  'selfService.documentAccess': { ar: 'الوصول للوثائق', en: 'Document Access' },
  'selfService.benefitsInfo': { ar: 'معلومات المزايا', en: 'Benefits Information' },
  'selfService.performanceView': { ar: 'عرض الأداء', en: 'Performance View' },

  // Compliance & Legal
  'compliance.title': { ar: 'الامتثال والحوكمة', en: 'Compliance & Governance' },
  'compliance.description': { ar: 'إدارة الامتثال والمتطلبات القانونية', en: 'Compliance and legal requirements management' },
  'compliance.laborLaw': { ar: 'قانون العمل', en: 'Labor Law' },
  'compliance.regulatoryCompliance': { ar: 'الامتثال التنظيمي', en: 'Regulatory Compliance' },
  'compliance.auditTrail': { ar: 'مسار التدقيق', en: 'Audit Trail' },
  'compliance.documentManagement': { ar: 'إدارة الوثائق', en: 'Document Management' },
  'compliance.riskAssessment': { ar: 'تقييم المخاطر', en: 'Risk Assessment' },
  'compliance.policyManagement': { ar: 'إدارة السياسات', en: 'Policy Management' },

  // AI & Automation
  'aiAutomation.title': { ar: 'الذكاء الاصطناعي والأتمتة', en: 'AI & Automation' },
  'aiAutomation.description': { ar: 'حلول الذكاء الاصطناعي والأتمتة للموارد البشرية', en: 'AI and automation solutions for human resources' },
  'aiAutomation.predictiveAnalytics': { ar: 'التحليلات التنبؤية', en: 'Predictive Analytics' },
  'aiAutomation.automatedWorkflows': { ar: 'سير العمل الآلي', en: 'Automated Workflows' },
  'aiAutomation.chatbotAssistant': { ar: 'مساعد الدردشة الآلي', en: 'Chatbot Assistant' },
  'aiAutomation.smartRecommendations': { ar: 'التوصيات الذكية', en: 'Smart Recommendations' },
  'aiAutomation.processOptimization': { ar: 'تحسين العمليات', en: 'Process Optimization' },
  'aiAutomation.decisionSupport': { ar: 'دعم اتخاذ القرار', en: 'Decision Support' },

  // Status and Priority
  'status.active': { ar: 'نشط', en: 'Active' },
  'status.inactive': { ar: 'غير نشط', en: 'Inactive' },
  'status.pending': { ar: 'معلق', en: 'Pending' },
  'status.approved': { ar: 'موافق عليه', en: 'Approved' },
  'status.rejected': { ar: 'مرفوض', en: 'Rejected' },
  'status.completed': { ar: 'مكتمل', en: 'Completed' },
  'status.inProgress': { ar: 'قيد التنفيذ', en: 'In Progress' },
  'status.draft': { ar: 'مسودة', en: 'Draft' },
  'status.published': { ar: 'منشور', en: 'Published' },
  'status.archived': { ar: 'مؤرشف', en: 'Archived' },

  'priority.high': { ar: 'عالي', en: 'High' },
  'priority.medium': { ar: 'متوسط', en: 'Medium' },
  'priority.low': { ar: 'منخفض', en: 'Low' },
  'priority.urgent': { ar: 'عاجل', en: 'Urgent' },
  'priority.normal': { ar: 'عادي', en: 'Normal' },

  // Time and Date
  'time.today': { ar: 'اليوم', en: 'Today' },
  'time.yesterday': { ar: 'أمس', en: 'Yesterday' },
  'time.tomorrow': { ar: 'غداً', en: 'Tomorrow' },
  'time.thisWeek': { ar: 'هذا الأسبوع', en: 'This Week' },
  'time.lastWeek': { ar: 'الأسبوع الماضي', en: 'Last Week' },
  'time.nextWeek': { ar: 'الأسبوع القادم', en: 'Next Week' },
  'time.thisMonth': { ar: 'هذا الشهر', en: 'This Month' },
  'time.lastMonth': { ar: 'الشهر الماضي', en: 'Last Month' },
  'time.nextMonth': { ar: 'الشهر القادم', en: 'Next Month' },
  'time.thisYear': { ar: 'هذا العام', en: 'This Year' },
  'time.lastYear': { ar: 'العام الماضي', en: 'Last Year' },
  'time.nextYear': { ar: 'العام القادم', en: 'Next Year' },

  // Units
  'units.minutes': { ar: 'دقائق', en: 'minutes' },
  'units.hours': { ar: 'ساعات', en: 'hours' },
  'units.days': { ar: 'أيام', en: 'days' },
  'units.weeks': { ar: 'أسابيع', en: 'weeks' },
  'units.months': { ar: 'أشهر', en: 'months' },
  'units.years': { ar: 'سنوات', en: 'years' },
  'units.percent': { ar: '%', en: '%' },
  'units.currency': { ar: 'ريال', en: 'SAR' },

  // Form Validation
  'validation.required': { ar: 'هذا الحقل مطلوب', en: 'This field is required' },
  'validation.email': { ar: 'يرجى إدخال بريد إلكتروني صحيح', en: 'Please enter a valid email address' },
  'validation.phone': { ar: 'يرجى إدخال رقم هاتف صحيح', en: 'Please enter a valid phone number' },
  'validation.minLength': { ar: 'يجب أن يكون الحد الأدنى {min} أحرف', en: 'Minimum {min} characters required' },
  'validation.maxLength': { ar: 'يجب أن يكون الحد الأقصى {max} حرف', en: 'Maximum {max} characters allowed' },
  'validation.numeric': { ar: 'يجب أن يكون رقماً', en: 'Must be a number' },
  'validation.positive': { ar: 'يجب أن يكون رقماً موجباً', en: 'Must be a positive number' },
  'validation.dateFormat': { ar: 'تنسيق التاريخ غير صحيح', en: 'Invalid date format' },
  'validation.passwordMatch': { ar: 'كلمات المرور غير متطابقة', en: 'Passwords do not match' },
  'validation.fileSize': { ar: 'حجم الملف كبير جداً', en: 'File size is too large' },
  'validation.fileType': { ar: 'نوع الملف غير مدعوم', en: 'File type not supported' },

  // Error Messages
  'error.networkError': { ar: 'خطأ في الشبكة، يرجى المحاولة مرة أخرى', en: 'Network error, please try again' },
  'error.serverError': { ar: 'خطأ في الخادم، يرجى المحاولة لاحقاً', en: 'Server error, please try again later' },
  'error.unauthorized': { ar: 'غير مخول للوصول', en: 'Unauthorized access' },
  'error.forbidden': { ar: 'ممنوع الوصول', en: 'Access forbidden' },
  'error.notFound': { ar: 'الصفحة غير موجودة', en: 'Page not found' },
  'error.sessionExpired': { ar: 'انتهت صلاحية الجلسة', en: 'Session expired' },
  'error.invalidCredentials': { ar: 'بيانات الاعتماد غير صحيحة', en: 'Invalid credentials' },
  'error.dataNotFound': { ar: 'البيانات غير موجودة', en: 'Data not found' },
  'error.operationFailed': { ar: 'فشلت العملية', en: 'Operation failed' },
  'error.permissionDenied': { ar: 'تم رفض الإذن', en: 'Permission denied' },

  // Success Messages
  'success.saved': { ar: 'تم الحفظ بنجاح', en: 'Saved successfully' },
  'success.updated': { ar: 'تم التحديث بنجاح', en: 'Updated successfully' },
  'success.deleted': { ar: 'تم الحذف بنجاح', en: 'Deleted successfully' },
  'success.created': { ar: 'تم الإنشاء بنجاح', en: 'Created successfully' },
  'success.uploaded': { ar: 'تم الرفع بنجاح', en: 'Uploaded successfully' },
  'success.sent': { ar: 'تم الإرسال بنجاح', en: 'Sent successfully' },
  'success.imported': { ar: 'تم الاستيراد بنجاح', en: 'Imported successfully' },
  'success.exported': { ar: 'تم التصدير بنجاح', en: 'Exported successfully' },
  'success.processed': { ar: 'تم المعالجة بنجاح', en: 'Processed successfully' },
  'success.completed': { ar: 'تم الإكمال بنجاح', en: 'Completed successfully' },

  // Confirmation Messages
  'confirm.delete': { ar: 'هل أنت متأكد من الحذف؟', en: 'Are you sure you want to delete?' },
  'confirm.save': { ar: 'هل تريد حفظ التغييرات؟', en: 'Do you want to save changes?' },
  'confirm.cancel': { ar: 'هل تريد إلغاء العملية؟', en: 'Do you want to cancel the operation?' },
  'confirm.logout': { ar: 'هل تريد تسجيل الخروج؟', en: 'Do you want to logout?' },
  'confirm.reset': { ar: 'هل تريد إعادة تعيين البيانات؟', en: 'Do you want to reset the data?' },
  'confirm.submit': { ar: 'هل تريد إرسال النموذج؟', en: 'Do you want to submit the form?' },
  'confirm.approve': { ar: 'هل تريد الموافقة؟', en: 'Do you want to approve?' },
  'confirm.reject': { ar: 'هل تريد الرفض؟', en: 'Do you want to reject?' },
  'confirm.publish': { ar: 'هل تريد النشر؟', en: 'Do you want to publish?' },
  'confirm.archive': { ar: 'هل تريد الأرشفة؟', en: 'Do you want to archive?' },
};

// Language detection and management
export class LanguageManager {
  private static instance: LanguageManager;
  private currentLanguage: Language = 'ar';
  private listeners: Array<(lang: Language) => void> = [];

  private constructor() {
    this.initializeLanguage();
  }

  public static getInstance(): LanguageManager {
    if (!LanguageManager.instance) {
      LanguageManager.instance = new LanguageManager();
    }
    return LanguageManager.instance;
  }

  private initializeLanguage(): void {
    // Check localStorage first
    const stored = localStorage.getItem('aqlhr-language') as Language;
    if (stored && (stored === 'ar' || stored === 'en')) {
      this.currentLanguage = stored;
    } else {
      // Default to Arabic
      this.currentLanguage = 'ar';
    }
    
    this.applyLanguageSettings();
  }

  private applyLanguageSettings(): void {
    const direction: Direction = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    // Apply to document
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = direction;
    
    // Apply CSS classes
    document.body.className = `${this.currentLanguage}-language ${direction}-layout`;
    
    // Store in localStorage
    localStorage.setItem('aqlhr-language', this.currentLanguage);
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  public setLanguage(language: Language): void {
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
      this.applyLanguageSettings();
      this.notifyListeners();
    }
  }

  public getDirection(): Direction {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }

  public isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }

  public translate(key: string, params?: Record<string, string | number>): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    let text = translation[this.currentLanguage];
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), String(value));
      });
    }

    return text;
  }

  public addLanguageChangeListener(listener: (lang: Language) => void): void {
    this.listeners.push(listener);
  }

  public removeLanguageChangeListener(listener: (lang: Language) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  // Utility methods for common operations
  public formatNumber(num: number): string {
    return new Intl.NumberFormat(this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US').format(num);
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  }

  public formatDate(date: Date): string {
    return new Intl.DateTimeFormat(this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US').format(date);
  }

  public formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat(this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}

// Export singleton instance
export const languageManager = LanguageManager.getInstance();

// Convenience function for translations
export const t = (key: string, params?: Record<string, string | number>): string => {
  return languageManager.translate(key, params);
};

// React hook for language management
export const useLanguage = () => {
  const [language, setLanguageState] = React.useState<Language>(languageManager.getCurrentLanguage());

  React.useEffect(() => {
    const handleLanguageChange = (newLang: Language) => {
      setLanguageState(newLang);
    };

    languageManager.addLanguageChangeListener(handleLanguageChange);

    return () => {
      languageManager.removeLanguageChangeListener(handleLanguageChange);
    };
  }, []);

  const setLanguage = (newLang: Language) => {
    languageManager.setLanguage(newLang);
  };

  return {
    language,
    setLanguage,
    t: languageManager.translate.bind(languageManager),
    isRTL: languageManager.isRTL(),
    direction: languageManager.getDirection(),
    formatNumber: languageManager.formatNumber.bind(languageManager),
    formatCurrency: languageManager.formatCurrency.bind(languageManager),
    formatDate: languageManager.formatDate.bind(languageManager),
    formatDateTime: languageManager.formatDateTime.bind(languageManager)
  };
};

// Export types
export type { TranslationKey };

// Import React for the hook
import React from 'react';

