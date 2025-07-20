// Enhanced translation hook with centralized translations
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  getTranslations, 
  getModuleTranslations, 
  formatters, 
  getDirectionClasses,
  TranslationKeys 
} from '@/utils/translations';

export const useTranslations = () => {
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';
  
  // Get all translations
  const t = getTranslations(language as 'ar' | 'en');
  const moduleTranslations = getModuleTranslations(language as 'ar' | 'en');
  const directionClasses = getDirectionClasses(isRTL);
  
  // Formatting functions
  const format = {
    date: (date: Date) => formatters.date(date, language as 'ar' | 'en'),
    number: (num: number) => formatters.number(num, language as 'ar' | 'en'),
    currency: (amount: number) => formatters.currency(amount, language as 'ar' | 'en'),
    percentage: (value: number) => formatters.percentage(value, language as 'ar' | 'en'),
  };
  
  // Status translations
  const getStatusText = (status: string) => {
    const statusMap: Record<string, Record<'ar' | 'en', string>> = {
      active: { ar: 'نشط', en: 'Active' },
      inactive: { ar: 'غير نشط', en: 'Inactive' },
      pending: { ar: 'معلق', en: 'Pending' },
      approved: { ar: 'موافق عليه', en: 'Approved' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
      completed: { ar: 'مكتمل', en: 'Completed' },
      inProgress: { ar: 'قيد التنفيذ', en: 'In Progress' },
      draft: { ar: 'مسودة', en: 'Draft' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' },
      expired: { ar: 'منتهي الصلاحية', en: 'Expired' }
    };
    
    return statusMap[status]?.[language as 'ar' | 'en'] || status;
  };
  
  // Priority translations
  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, Record<'ar' | 'en', string>> = {
      high: { ar: 'عالي', en: 'High' },
      medium: { ar: 'متوسط', en: 'Medium' },
      low: { ar: 'منخفض', en: 'Low' },
      urgent: { ar: 'عاجل', en: 'Urgent' },
      critical: { ar: 'حرج', en: 'Critical' }
    };
    
    return priorityMap[priority]?.[language as 'ar' | 'en'] || priority;
  };
  
  // Time-related translations
  const getTimeText = (timeKey: string) => {
    const timeMap: Record<string, Record<'ar' | 'en', string>> = {
      now: { ar: 'الآن', en: 'Now' },
      today: { ar: 'اليوم', en: 'Today' },
      yesterday: { ar: 'أمس', en: 'Yesterday' },
      tomorrow: { ar: 'غداً', en: 'Tomorrow' },
      thisWeek: { ar: 'هذا الأسبوع', en: 'This Week' },
      thisMonth: { ar: 'هذا الشهر', en: 'This Month' },
      thisYear: { ar: 'هذا العام', en: 'This Year' },
      lastWeek: { ar: 'الأسبوع الماضي', en: 'Last Week' },
      lastMonth: { ar: 'الشهر الماضي', en: 'Last Month' },
      lastYear: { ar: 'العام الماضي', en: 'Last Year' },
      nextWeek: { ar: 'الأسبوع القادم', en: 'Next Week' },
      nextMonth: { ar: 'الشهر القادم', en: 'Next Month' },
      nextYear: { ar: 'العام القادم', en: 'Next Year' }
    };
    
    return timeMap[timeKey]?.[language as 'ar' | 'en'] || timeKey;
  };
  
  // Action translations for buttons
  const getActionText = (action: string) => {
    const actionMap: Record<string, Record<'ar' | 'en', string>> = {
      create: { ar: 'إنشاء', en: 'Create' },
      edit: { ar: 'تعديل', en: 'Edit' },
      update: { ar: 'تحديث', en: 'Update' },
      delete: { ar: 'حذف', en: 'Delete' },
      save: { ar: 'حفظ', en: 'Save' },
      cancel: { ar: 'إلغاء', en: 'Cancel' },
      submit: { ar: 'إرسال', en: 'Submit' },
      confirm: { ar: 'تأكيد', en: 'Confirm' },
      approve: { ar: 'موافقة', en: 'Approve' },
      reject: { ar: 'رفض', en: 'Reject' },
      download: { ar: 'تحميل', en: 'Download' },
      upload: { ar: 'رفع', en: 'Upload' },
      export: { ar: 'تصدير', en: 'Export' },
      import: { ar: 'استيراد', en: 'Import' },
      print: { ar: 'طباعة', en: 'Print' },
      share: { ar: 'مشاركة', en: 'Share' },
      copy: { ar: 'نسخ', en: 'Copy' },
      paste: { ar: 'لصق', en: 'Paste' },
      refresh: { ar: 'تحديث', en: 'Refresh' },
      reset: { ar: 'إعادة تعيين', en: 'Reset' },
      clear: { ar: 'مسح', en: 'Clear' },
      search: { ar: 'بحث', en: 'Search' },
      filter: { ar: 'تصفية', en: 'Filter' },
      sort: { ar: 'ترتيب', en: 'Sort' },
      view: { ar: 'عرض', en: 'View' },
      details: { ar: 'التفاصيل', en: 'Details' },
      preview: { ar: 'معاينة', en: 'Preview' },
      close: { ar: 'إغلاق', en: 'Close' },
      next: { ar: 'التالي', en: 'Next' },
      previous: { ar: 'السابق', en: 'Previous' },
      finish: { ar: 'إنهاء', en: 'Finish' },
      complete: { ar: 'إكمال', en: 'Complete' }
    };
    
    return actionMap[action]?.[language as 'ar' | 'en'] || action;
  };
  
  // Validation error messages
  const getValidationText = (errorKey: string, field?: string) => {
    const validationMap: Record<string, Record<'ar' | 'en', string>> = {
      required: { 
        ar: field ? `${field} مطلوب` : 'هذا الحقل مطلوب', 
        en: field ? `${field} is required` : 'This field is required' 
      },
      invalid: { 
        ar: field ? `${field} غير صحيح` : 'قيمة غير صحيحة', 
        en: field ? `${field} is invalid` : 'Invalid value' 
      },
      tooShort: { 
        ar: field ? `${field} قصير جداً` : 'قصير جداً', 
        en: field ? `${field} is too short` : 'Too short' 
      },
      tooLong: { 
        ar: field ? `${field} طويل جداً` : 'طويل جداً', 
        en: field ? `${field} is too long` : 'Too long' 
      },
      email: { ar: 'عنوان بريد إلكتروني غير صحيح', en: 'Invalid email address' },
      password: { ar: 'كلمة مرور ضعيفة', en: 'Weak password' },
      phone: { ar: 'رقم هاتف غير صحيح', en: 'Invalid phone number' },
      date: { ar: 'تاريخ غير صحيح', en: 'Invalid date' },
      number: { ar: 'رقم غير صحيح', en: 'Invalid number' },
      url: { ar: 'رابط غير صحيح', en: 'Invalid URL' }
    };
    
    return validationMap[errorKey]?.[language as 'ar' | 'en'] || errorKey;
  };
  
  return {
    // Core translations
    t,
    moduleTranslations,
    
    // Utility functions
    format,
    getStatusText,
    getPriorityText,
    getTimeText,
    getActionText,
    getValidationText,
    
    // Direction and styling
    directionClasses,
    isArabic,
    isRTL,
    language,
    
    // Common directional properties
    dir: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'text-right' : 'text-left',
    flexDirection: isRTL ? 'flex-row-reverse' : 'flex-row',
    marginStart: isRTL ? 'ml-' : 'mr-',
    marginEnd: isRTL ? 'mr-' : 'ml-',
    paddingStart: isRTL ? 'pl-' : 'pr-',
    paddingEnd: isRTL ? 'pr-' : 'pl-',
    borderStart: isRTL ? 'border-l' : 'border-r',
    borderEnd: isRTL ? 'border-r' : 'border-l',
    roundedStart: isRTL ? 'rounded-l' : 'rounded-r',
    roundedEnd: isRTL ? 'rounded-r' : 'rounded-l'
  };
};