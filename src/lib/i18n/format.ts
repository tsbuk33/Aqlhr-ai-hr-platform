import { Lang } from './localeDriver';

export interface NumberFormatOptions {
  arabicIndic?: boolean;
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface DateFormatOptions {
  calendar?: 'greg' | 'ummalqura';
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  weekday?: 'long' | 'short' | 'narrow';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
}

export function formatNumber(
  n: number, 
  lang: Lang, 
  options: NumberFormatOptions = {}
): string {
  const { arabicIndic = false, ...intlOptions } = options;
  
  // Use Arabic-Indic numerals if requested and language is Arabic
  const locale = lang === 'ar' && arabicIndic 
    ? 'ar-SA-u-nu-arab' 
    : lang === 'ar' 
    ? 'ar-SA' 
    : 'en-SA';

  return new Intl.NumberFormat(locale, intlOptions).format(n);
}

export function formatCurrency(
  amount: number,
  lang: Lang,
  currency: string = 'SAR',
  options: Omit<NumberFormatOptions, 'style' | 'currency'> = {}
): string {
  return formatNumber(amount, lang, {
    ...options,
    style: 'currency',
    currency
  });
}

export function formatPercent(
  value: number,
  lang: Lang,
  options: Omit<NumberFormatOptions, 'style'> = {}
): string {
  return formatNumber(value, lang, {
    ...options,
    style: 'percent'
  });
}

export function formatDate(
  date: Date | string | number,
  lang: Lang,
  options: DateFormatOptions = {}
): string {
  const { calendar = 'greg', ...intlOptions } = options;
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  // Build locale with calendar
  const baseLocale = lang === 'ar' ? 'ar-SA' : 'en-SA';
  const calendarType = calendar === 'ummalqura' ? 'islamic-umalqura' : 'gregory';
  const locale = `${baseLocale}-u-ca-${calendarType}`;

  return new Intl.DateTimeFormat(locale, intlOptions).format(dateObj);
}

// Specialized formatters for common use cases
export function formatDateShort(date: Date | string | number, lang: Lang, useHijri = false): string {
  return formatDate(date, lang, {
    calendar: useHijri ? 'ummalqura' : 'greg',
    dateStyle: 'short'
  });
}

export function formatDateLong(date: Date | string | number, lang: Lang, useHijri = false): string {
  return formatDate(date, lang, {
    calendar: useHijri ? 'ummalqura' : 'greg',
    dateStyle: 'long'
  });
}

export function formatDatetime(date: Date | string | number, lang: Lang, useHijri = false): string {
  return formatDate(date, lang, {
    calendar: useHijri ? 'ummalqura' : 'greg',
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

// Relative time formatter
export function formatRelativeTime(
  date: Date | string | number,
  lang: Lang,
  options: { numeric?: 'always' | 'auto' } = {}
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const locale = lang === 'ar' ? 'ar-SA' : 'en-SA';
  const rtf = new Intl.RelativeTimeFormat(locale, options);
  
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
  } else if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
  } else if (Math.abs(diffInSeconds) < 2592000) {
    return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
  } else if (Math.abs(diffInSeconds) < 31536000) {
    return rtf.format(Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(Math.floor(diffInSeconds / 31536000), 'year');
  }
}