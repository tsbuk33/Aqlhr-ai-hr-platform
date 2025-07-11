import { useMemo, useCallback } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useLocalization } from '@/hooks/useLocalization';

// Performance-optimized version of localization hook
export const usePerformantLocalization = () => {
  const { isArabic } = useSimpleLanguage();
  const language = isArabic ? 'ar' : 'en';
  const isRTL = isArabic;
  const localization = useLocalization();

  // Memoize direction-based classes
  const directionClasses = useMemo(() => ({
    container: isRTL ? 'rtl-container' : 'ltr-container',
    text: isRTL ? 'text-right' : 'text-left',
    flex: isRTL ? 'flex-row-reverse' : 'flex-row',
    marginAuto: isRTL ? 'ml-auto' : 'mr-auto',
    paddingStart: isRTL ? 'pr-4' : 'pl-4',
    paddingEnd: isRTL ? 'pl-4' : 'pr-4',
    borderStart: isRTL ? 'border-r' : 'border-l',
    borderEnd: isRTL ? 'border-l' : 'border-r',
    roundedStart: isRTL ? 'rounded-r' : 'rounded-l',
    roundedEnd: isRTL ? 'rounded-l' : 'rounded-r',
  }), [isRTL]);

  // Memoize number formatters
  const formatters = useMemo(() => ({
    currency: (amount: number, currency: 'SAR' | 'USD' = 'SAR') => 
      localization.currency(amount, currency),
    number: (num: number) => localization.number(num),
    percentage: (val: number) => localization.percentage(val),
    salary: (amount: number) => localization.salary(amount),
    employeeCount: (count: number) => localization.employeeCount(count),
    days: (days: number) => localization.days(days),
    hours: (hours: number) => localization.hours(hours),
    kpi: (value: number, unit?: string) => localization.kpi(value, unit),
  }), [localization]);

  // Memoize date formatters
  const dateFormatters = useMemo(() => ({
    date: (date: string | Date, pattern?: string) => localization.date(date, pattern),
    relativeTime: (date: string | Date) => localization.relativeTime(date),
    hijriDate: (date: string | Date) => localization.hijriDate(date),
  }), [localization]);

  // Cached formatter function
  const cachedFormat = useCallback((type: string, value: any, options?: any) => {
    switch (type) {
      case 'currency':
        return formatters.currency(value, options);
      case 'number':
        return formatters.number(value);
      case 'percentage':
        return formatters.percentage(value);
      case 'salary':
        return formatters.salary(value);
      case 'employeeCount':
        return formatters.employeeCount(value);
      case 'days':
        return formatters.days(value);
      case 'hours':
        return formatters.hours(value);
      case 'kpi':
        return formatters.kpi(value, options);
      case 'date':
        return dateFormatters.date(value, options);
      case 'relativeTime':
        return dateFormatters.relativeTime(value);
      case 'hijriDate':
        return dateFormatters.hijriDate(value);
      default:
        return value.toString();
    }
  }, [formatters, dateFormatters]);

  return {
    language,
    isRTL,
    directionClasses,
    formatters,
    dateFormatters,
    cachedFormat,
    // Pass through other utilities
    direction: localization.direction,
    align: localization.align,
    flexDirection: localization.flexDirection,
    phone: localization.phone,
  };
};