import { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  formatHijriDate,
  formatPhoneNumber,
  getTextDirection,
  getAlignmentClass,
  getFlexDirection,
  type SupportedLocale,
  type SupportedCurrency
} from '@/utils/localization';

export const useLocalization = () => {
  const { language, isRTL } = useLanguage();
  const locale = language as SupportedLocale;

  const localizationUtils = useMemo(() => ({
    // Currency formatting
    currency: (amount: number, currency: SupportedCurrency = 'SAR') =>
      formatCurrency(amount, currency, locale),

    // Number formatting
    number: (number: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(number, locale, options),

    // Percentage formatting
    percentage: (value: number, decimals?: number) =>
      formatPercentage(value, locale, decimals),

    // Date formatting
    date: (date: string | Date, formatPattern?: string) =>
      formatDate(date, locale, formatPattern),

    // Relative time
    relativeTime: (date: string | Date) =>
      formatRelativeTime(date, locale),

    // Hijri date
    hijriDate: (date: string | Date) =>
      formatHijriDate(date, locale),

    // Phone number
    phone: (phoneNumber: string) =>
      formatPhoneNumber(phoneNumber, locale),

    // Layout utilities
    direction: getTextDirection(locale),
    align: getAlignmentClass(locale),
    flexDirection: getFlexDirection(locale),

    // Common formatters for HR data
    salary: (amount: number) => formatCurrency(amount, 'SAR', locale),
    employeeCount: (count: number) => formatNumber(count, locale, { maximumFractionDigits: 0 }),
    days: (days: number) => formatNumber(days, locale, { maximumFractionDigits: 0 }),
    hours: (hours: number) => formatNumber(hours, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    kpi: (value: number, unit?: string) => {
      const formatted = formatNumber(value, locale, { maximumFractionDigits: 1 });
      return unit ? `${formatted} ${unit}` : formatted;
    }
  }), [locale]);

  return {
    ...localizationUtils,
    locale,
    isRTL,
    language
  };
};