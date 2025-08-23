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