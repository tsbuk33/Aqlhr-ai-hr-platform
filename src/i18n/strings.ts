export type Lang = 'en' | 'ar';

export const STRINGS = {
  // Privacy and anonymity
  privacy_notice: { 
    en: 'Anonymous. No name/email/IP stored.', 
    ar: 'مجهول. لا نخزّن الاسم/البريد/الآي بي.' 
  },
  hidden_for_anonymity: { 
    en: 'Hidden to protect anonymity (n < 7)', 
    ar: 'مخفي لحماية السرية (n < 7)' 
  },
  
  // Actions
  compute_now: { en: 'Compute now', ar: 'احسب الآن' },
  export_now: { en: 'Export Now', ar: 'تصدير الآن' },
  refresh_analysis: { en: 'Refresh Analysis', ar: 'تحديث التحليل' },
  export_report: { en: 'Export Report', ar: 'تصدير التقرير' },
  generate_download: { en: 'Generate & Download', ar: 'توليد وتحميل' },
  run_test: { en: 'Run Test', ar: 'تشغيل الاختبار' },
  seed_data: { en: 'Seed Data', ar: 'إنشاء البيانات' },
  seeding: { en: 'Seeding...', ar: 'جاري الإنشاء...' },
  
  // Navigation and sections
  templates: { en: 'Templates', ar: 'القوالب' },
  custom_export: { en: 'Custom Export', ar: 'تصدير مخصص' },
  export_history: { en: 'Export History', ar: 'سجل التصدير' },
  export_reports: { en: 'Export Reports', ar: 'تصدير التقارير' },
  cultural_diagnostics: { en: 'Cultural Diagnostics', ar: 'التشخيصات الثقافية' },
  demo_data: { en: 'Demo Data', ar: 'البيانات التجريبية' },
  
  // CCI Framework terms
  balance_score: { en: 'Balance Score', ar: 'درجة التوازن' },
  risk_index: { en: 'Risk Index', ar: 'مؤشر المخاطر' },
  psych_safety: { en: 'Psychological Safety', ar: 'الأمان النفسي' },
  values_alignment: { en: 'Values Alignment', ar: 'محاذاة القيم' },
  culture_balance_score: { en: 'Culture Balance Score', ar: 'درجة التوازن الثقافي' },
  psychological_safety_index: { en: 'Psychological Safety Index', ar: 'مؤشر الأمان النفسي' },
  
  // Hofstede dimensions
  power_distance: { en: 'Power Distance', ar: 'مسافة السلطة' },
  individualism: { en: 'Individualism', ar: 'الفردية' },
  masculinity: { en: 'Masculinity', ar: 'الذكورة' },
  uncertainty_avoidance: { en: 'Uncertainty Avoidance', ar: 'تجنب عدم اليقين' },
  long_term_orientation: { en: 'Long-term Orientation', ar: 'التوجه طويل المدى' },
  indulgence: { en: 'Indulgence', ar: 'التساهل' },
  
  // Cultural frameworks
  cultural_web: { en: 'Cultural Web', ar: 'الشبكة الثقافية' },
  barrett: { en: 'Barrett', ar: 'باريت' },
  schein: { en: 'Schein', ar: 'شاين' },
  hofstede: { en: 'Hofstede', ar: 'هوفستيد' },
  
  // CVF dimensions
  clan: { en: 'Clan', ar: 'العشيرة' },
  adhocracy: { en: 'Adhocracy', ar: 'الإبداع' },
  market: { en: 'Market', ar: 'السوق' },
  hierarchy: { en: 'Hierarchy', ar: 'التسلسل الهرمي' },
  
  // Status and levels
  current: { en: 'Current', ar: 'حالي' },
  desired: { en: 'Desired', ar: 'مرغوب' },
  optimal: { en: 'Optimal', ar: 'الأمثل' },
  high: { en: 'High', ar: 'عالي' },
  medium: { en: 'Medium', ar: 'متوسط' },
  low: { en: 'Low', ar: 'منخفض' },
  critical: { en: 'Critical', ar: 'حرج' },
  good: { en: 'Good', ar: 'جيد' },
  
  // Time periods
  last_30_days: { en: 'Last 30 days', ar: 'آخر 30 يوم' },
  last_60_days: { en: 'Last 60 days', ar: 'آخر 60 يوم' },
  last_90_days: { en: 'Last 90 days', ar: 'آخر 90 يوم' },
  custom_period: { en: 'Custom period', ar: 'فترة مخصصة' },
  
  // File formats
  format: { en: 'Format', ar: 'التنسيق' },
  pages: { en: 'Pages', ar: 'الصفحات' },
  target_audience: { en: 'Target Audience', ar: 'الجمهور المستهدف' },
  included_sections: { en: 'Included Sections', ar: 'الأقسام المضمنة' },
  
  // Export configuration
  export_configuration: { en: 'Export Configuration', ar: 'إعدادات التصدير' },
  customize_content: { en: 'Customize content and format', ar: 'تخصيص المحتوى والتنسيق' },
  file_format: { en: 'File Format', ar: 'تنسيق الملف' },
  time_period: { en: 'Time Period', ar: 'الفترة الزمنية' },
  export_options: { en: 'Export Options', ar: 'خيارات التصدير' },
  
  // Export options
  include_charts: { en: 'Include Charts', ar: 'تضمين الرسوم البيانية' },
  include_recommendations: { en: 'Include Recommendations', ar: 'تضمين التوصيات' },
  include_raw_data: { en: 'Include Raw Data', ar: 'تضمين البيانات الخام' },
  anonymize_data: { en: 'Anonymize Data', ar: 'إخفاء هوية البيانات' },
  add_watermark: { en: 'Add Watermark', ar: 'إضافة العلامة المائية' },
  
  // National context
  national_cultural_context: { en: 'National Cultural Context', ar: 'السياق الثقافي الوطني' },
  national_mix_context: { en: 'National mix context (not organizational culture)', ar: 'مزيج التنوع الثقافي (وليس الثقافة التنظيمية)' },
  total_employees: { en: 'Total Employees', ar: 'إجمالي الموظفين' },
  weighted_hofstede_dimensions: { en: 'Weighted Hofstede Dimensions', ar: 'أبعاد هوفستيد المرجحة' },
  
  // Messages and notifications
  success: { en: 'Success', ar: 'تم بنجاح' },
  error: { en: 'Error', ar: 'خطأ' },
  warning: { en: 'Warning', ar: 'تحذير' },
  
  // Disclaimers
  hofstede_disclaimer: { 
    en: '⚠️ This national reference context is for guidance only. Hofstede figures provide national context only. Results are directional, not clinical psychometrics.', 
    ar: '⚠️ هذا السياق المرجعي الوطني للتوجه فقط. أرقام هوفستيد تقدم سياقاً وطنياً فقط. النتائج توجيهية وليست قياسات نفسية إكلينيكية.' 
  },
  
  // Cultural Web terms
  stories: { en: 'Stories', ar: 'القصص' },
  symbols: { en: 'Symbols', ar: 'الرموز' },
  power_structures: { en: 'Power Structures', ar: 'هياكل السلطة' },
  organisational_structures: { en: 'Organisational Structures', ar: 'الهياكل التنظيمية' },
  control_systems: { en: 'Control Systems', ar: 'أنظمة التحكم' },
  rituals_routines: { en: 'Rituals & Routines', ar: 'الطقوس والروتين' },
  cultural_web_analysis: { en: 'Cultural Web Analysis', ar: 'تحليل الشبكة الثقافية' },
  six_elements_assessment: { en: 'Assessment of six cultural web elements and risk levels', ar: 'تقييم العناصر الستة للشبكة الثقافية ومستوى المخاطر' },
  
  // Barrett Values
  survival: { en: 'Survival', ar: 'البقاء' },
  relationship: { en: 'Relationship', ar: 'العلاقات' },
  self_esteem: { en: 'Self-esteem', ar: 'الاحترام الذاتي' },
  transformation: { en: 'Transformation', ar: 'التحول' },
  internal_cohesion: { en: 'Internal Cohesion', ar: 'التماسك الداخلي' },
  making_difference: { en: 'Making a Difference', ar: 'إحداث فرق' },
  barrett_seven_levels: { en: 'Barrett Seven Levels of Values', ar: 'نموذج باريت للقيم السبع' },
  current_vs_optimal: { en: 'Current vs optimal values distribution', ar: 'توزيع القيم الحالي مقابل التوزيع الأمثل' },
  
  // CVF terms
  cvf_framework: { en: 'Competing Values Framework (CVF)', ar: 'إطار القيم المتنافسة (CVF)' },
  current_vs_desired_analysis: { en: 'Current vs desired culture analysis across four dimensions', ar: 'تحليل الثقافة الحالية مقابل المرغوبة عبر أربعة أبعاد' },
  current_vs_desired_distribution: { en: 'Current vs Desired Distribution', ar: 'التوزيع الحالي مقابل المرغوب' },
  gap_analysis: { en: 'Gap Analysis', ar: 'تحليل الفجوات' },
  difference: { en: 'Difference', ar: 'الفرق' },
  
  // Schein terms
  scheins_model: { en: "Schein's Organizational Culture Model", ar: 'نموذج شاين للثقافة التنظيمية' },
  three_levels_analysis: { en: 'Analysis of three levels of organizational culture', ar: 'تحليل المستويات الثلاثة للثقافة التنظيمية' },
  artifacts: { en: 'Artifacts', ar: 'الأدلة المرئية' },
  espoused_values: { en: 'Espoused Values', ar: 'القيم المعلنة' },
  basic_assumptions: { en: 'Basic Assumptions', ar: 'الافتراضات الأساسية' },
  maturity_level: { en: 'Maturity Level', ar: 'مستوى النضج' },
  
  // General analysis
  multi_framework_analysis: { en: 'AqlHR — Multi-Framework Analysis', ar: 'عقل للموارد البشرية - تحليل متعدد الأطر' },
  org: { en: 'Org', ar: 'المنظمة' },
  benchmark: { en: 'Benchmark', ar: 'المعيار' },
  
  // Hofstede comparison
  hofstede_cultural_dimensions: { en: "Hofstede's Cultural Dimensions", ar: 'أبعاد هوفستيد الثقافية' },
  org_vs_regional: { en: 'Organizational culture vs regional benchmarks', ar: 'مقارنة الثقافة التنظيمية مع المعايير الإقليمية' },
  
  // Admin and logs
  admin_logs: { en: 'Admin Logs', ar: 'سجلات الإدارة' },
  error_loading_logs: { en: 'Error loading logs', ar: 'خطأ في تحميل السجلات' },
  please_try_again: { en: 'Please try again', ar: 'يرجى المحاولة مرة أخرى' },
  auto_refreshing: { en: 'Auto-refreshing', ar: 'تحديث تلقائي' },
  recent_actions: { en: 'Recent Actions', ar: 'الإجراءات الأخيرة' },
  no_recent_actions: { en: 'No recent actions found', ar: 'لم يتم العثور على إجراءات حديثة' },
  view_metadata: { en: 'View metadata', ar: 'عرض البيانات الوصفية' },
  rate_limit_exceeded: { en: 'Rate limit exceeded', ar: 'تم تجاوز الحد المسموح' },

  // Common words
  more: { en: 'more', ar: 'أخرى' },
  seconds: { en: 'seconds', ar: 'ثانية' },
  downloads: { en: 'downloads', ar: 'تحميل' },
  
} as const;

export const t = (key: keyof typeof STRINGS, lang: Lang): string => {
  return STRINGS[key][lang];
};

// Helper function to get opposite language
export const getOppositeLang = (lang: Lang): Lang => {
  return lang === 'en' ? 'ar' : 'en';
};

// Helper function to check if language is RTL
export const isRTL = (lang: Lang): boolean => {
  return lang === 'ar';
};