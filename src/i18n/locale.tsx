import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';

export type Locale = 'en' | 'ar';
const STORAGE_KEY = 'aqlhr.locale';

type Dict = Record<string, string>;
type Bundle = { en: Dict; ar: Dict };

const bundles: Record<string, Bundle> = {
  common: {
    en: { language: 'English', arabic: 'Arabic', export: 'Export', overview: 'Overview' },
    ar: { language: 'الإنجليزية', arabic: 'العربية', export: 'تصدير', overview: 'نظرة عامة' },
  },
  osi: {
    en: {
      org_structure_intel: 'Organization Structure Intelligence',
      overview: 'Overview',
      layers: 'Layers',
      spans_layers: 'Spans & Layers',
      saudization_by_layer: 'Saudization by Layer',
      management_span: 'Management Span',
      cost_to_manage: 'Cost of Management',
      playbook: 'Playbook',
      export: 'Export',
      advanced_analysis: 'Advanced organizational design and effectiveness analysis',
      setting_up: 'Setting up OSI analysis...',
      health_score: 'Organizational Health Score',
      total_layers: 'Total Layers',
      highest_saudi_layer: 'Highest Saudi Layer',
      critical_layers_below_target: 'Critical Layers (below target)',
      span_outliers: 'Span Outliers',
      management_cost_monthly: 'Management Cost (monthly)',
      total_headcount: 'Total Headcount',
      organizational_layers: 'Organizational Layers',
      cost_manage_monthly: 'Cost to Manage (Monthly)',
      run_analysis: 'Run OSI Analysis',
      regenerate_analysis: 'Regenerate Analysis',
      recompute: 'Recompute',
      generate_report: 'Generate Report',
      cost_analysis: 'Cost Analysis',
      loading_data: 'Loading organizational data...',
      no_analysis_available: 'No analysis available',
      run_first_analysis: 'Run your first OSI analysis to get insights into your organizational structure',
      updating: 'Updating...',
      update: 'Update',
      active_employees: 'Active employees',
      avg_management_span: 'Average Management Span',
      target: 'Target',
      org_layers: 'Org Layers',
      cost_to_manage_pct: 'Cost to Manage',
      org_demographics: 'Organizational Demographics',
      saudization_rate: 'Saudization Rate',
      female_percentage: 'Female Percentage',
      total_managers: 'Total Managers',
      overloaded_managers: 'Overloaded Managers',
      structure_issues: 'Structure Issues',
      no_critical_issues: 'No critical issues detected',
      available_actions: 'Available Actions',
      create_report: 'Create Report',
      view_org_chart: 'View Org Chart',
      analyze_costs: 'Analyze Costs',
      excellent: 'Excellent',
      good: 'Good',
      needs_improvement: 'Needs Improvement',
      critical: 'Critical',
      low: 'Low',
      high: 'High',
      headcount: 'Headcount',
      saudi_headcount: 'Saudi Headcount',
      avg_salary: 'Average Salary',
      total_salary: 'Total Salary',
      direct_reports: 'Direct Reports',
      severity: 'Severity',
      layer: 'Layer',
      manager: 'Manager'
    },
    ar: {
      org_structure_intel: 'ذكاء الهيكل التنظيمي',
      overview: 'نظرة عامة',
      layers: 'الطبقات',
      spans_layers: 'النطاقات والطبقات',
      saudization_by_layer: 'السعودة بالطبقات',
      management_span: 'اتساع نطاق الإشراف',
      cost_to_manage: 'تكلفة الإدارة',
      playbook: 'دليل العمل',
      export: 'التصدير',
      advanced_analysis: 'تحليل متقدم للتصميم التنظيمي والفعالية',
      setting_up: 'جاري إعداد تحليل OSI...',
      health_score: 'نقاط الصحة التنظيمية',
      total_layers: 'إجمالي الطبقات',
      highest_saudi_layer: 'أعلى طبقة سعودية',
      critical_layers_below_target: 'الطبقات الحرجة (أقل من المستهدف)',
      span_outliers: 'انحرافات نطاق الإشراف',
      management_cost_monthly: 'تكلفة الإدارة شهريًا',
      total_headcount: 'إجمالي الموظفين',
      organizational_layers: 'طبقات التنظيم',
      cost_manage_monthly: 'تكلفة الإدارة',
      run_analysis: 'تشغيل تحليل OSI',
      regenerate_analysis: 'إعادة إنتاج التحليل',
      recompute: 'إعادة حساب',
      generate_report: 'إنشاء تقرير',
      cost_analysis: 'تحليل التكاليف',
      loading_data: 'جاري تحميل البيانات التنظيمية...',
      no_analysis_available: 'لا يوجد تحليل متاح',
      run_first_analysis: 'قم بتشغيل أول تحليل OSI للحصول على رؤى حول هيكلك التنظيمي',
      updating: 'جاري التحديث...',
      update: 'تحديث',
      active_employees: 'الموظفون النشطون',
      avg_management_span: 'متوسط نطاق الإدارة',
      target: 'الهدف',
      org_layers: 'طبقات التنظيم',
      cost_to_manage_pct: 'تكلفة الإدارة',
      org_demographics: 'الديموغرافيا التنظيمية',
      saudization_rate: 'نسبة السعودة',
      female_percentage: 'نسبة الإناث',
      total_managers: 'إجمالي المدراء',
      overloaded_managers: 'المدراء المُحمّلون بأعباء زائدة',
      structure_issues: 'مشاكل الهيكل',
      no_critical_issues: 'لم يتم اكتشاف مشاكل حرجة',
      available_actions: 'الإجراءات المتاحة',
      create_report: 'إنشاء تقرير',
      view_org_chart: 'عرض الهيكل التنظيمي',
      analyze_costs: 'تحليل التكاليف',
      excellent: 'ممتاز',
      good: 'جيد',
      needs_improvement: 'يحتاج تحسين',
      critical: 'حرج',
      low: 'منخفض',
      high: 'مرتفع',
      headcount: 'عدد الموظفين',
      saudi_headcount: 'عدد الموظفين السعوديين',
      avg_salary: 'متوسط الراتب',
      total_salary: 'إجمالي الراتب',
      direct_reports: 'المرؤوسون المباشرون',
      severity: 'الخطورة',
      layer: 'الطبقة',
      manager: 'المدير'
    },
  },
};

const Ctx = createContext<{
  locale: Locale; 
  setLocale: (l: Locale) => void; 
  t: (ns: string, k: string) => string;
} | null>(null);

function resolveLocale(): Locale {
  // Dev/demo override
  const qp = new URLSearchParams(window.location.search).get('lang');
  if (qp === 'en' || qp === 'ar') return qp;
  // Persisted choice
  const ls = localStorage.getItem(STORAGE_KEY);
  if (ls === 'en' || ls === 'ar') return ls as Locale;
  // Default
  return 'en';
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(resolveLocale());
  
  const setLocale = (l: Locale) => { 
    localStorage.setItem(STORAGE_KEY, l); 
    setLocaleState(l); 
  };

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('rtl', locale === 'ar');
    if (new URLSearchParams(window.location.search).has('lang')) {
      // visible hint for testers
      // eslint-disable-next-line no-console
      console.info(`🔧 Dev Mode: locale forced to ${locale.toUpperCase()} via ?lang=`);
    }
  }, [locale]);

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