import { format, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export type SupportedLocale = 'ar' | 'en';
export type SupportedCurrency = 'SAR' | 'USD';

// Currency formatting
export const formatCurrency = (
  amount: number,
  currency: SupportedCurrency = 'SAR',
  locale: SupportedLocale = 'en'
): string => {
  const currencyMap = {
    SAR: 'SAR',
    USD: 'USD'
  };

  const localeMap = {
    ar: 'ar-SA',
    en: 'en-US'
  };

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: currencyMap[currency],
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Number formatting with Arabic numerals support
export const formatNumber = (
  number: number,
  locale: SupportedLocale = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  const localeMap = {
    ar: 'ar-SA',
    en: 'en-US'
  };

  return new Intl.NumberFormat(localeMap[locale], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(number);
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  locale: SupportedLocale = 'en',
  decimals: number = 1
): string => {
  const localeMap = {
    ar: 'ar-SA',
    en: 'en-US'
  };

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Date formatting with Arabic calendar support
export const formatDate = (
  date: string | Date,
  locale: SupportedLocale = 'en',
  formatPattern: string = 'PP'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'ar' ? ar : enUS;

  return format(dateObj, formatPattern, { locale: localeObj });
};

// Relative time formatting (e.g., "2 days ago")
export const formatRelativeTime = (
  date: string | Date,
  locale: SupportedLocale = 'en'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const localeMap = {
    ar: 'ar-SA',
    en: 'en-US'
  };

  const rtf = new Intl.RelativeTimeFormat(localeMap[locale], { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};

// Islamic/Hijri date support
export const formatHijriDate = (
  date: string | Date,
  locale: SupportedLocale = 'ar'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  try {
    // Use Intl.DateTimeFormat with Islamic calendar
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-US-u-ca-islamic', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'islamic'
    }).format(dateObj);
  } catch {
    // Fallback to Gregorian if Islamic calendar is not supported
    return formatDate(dateObj, locale);
  }
};

// Phone number formatting for Saudi numbers
export const formatPhoneNumber = (
  phoneNumber: string,
  locale: SupportedLocale = 'en'
): string => {
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle Saudi numbers (starting with 966 or 05)
  if (cleaned.startsWith('966')) {
    const number = cleaned.substring(3);
    if (locale === 'ar') {
      return `+٩٦٦ ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
    }
    return `+966 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
  } else if (cleaned.startsWith('05')) {
    if (locale === 'ar') {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  return phoneNumber;
};

// Text direction utilities
export const getTextDirection = (locale: SupportedLocale): 'ltr' | 'rtl' => {
  return locale === 'ar' ? 'rtl' : 'ltr';
};

export const getAlignmentClass = (locale: SupportedLocale): string => {
  return locale === 'ar' ? 'text-right' : 'text-left';
};

export const getFlexDirection = (locale: SupportedLocale): string => {
  return locale === 'ar' ? 'flex-row-reverse' : 'flex-row';
};

// Validation utilities
export const isArabicText = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

export const sanitizeText = (text: string, locale: SupportedLocale): string => {
  // Remove or replace characters that don't display well in the target locale
  if (locale === 'ar') {
    // Convert English numbers to Arabic numerals if needed
    return text.replace(/[0-9]/g, (match) => {
      const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
      return arabicNumerals[parseInt(match)];
    });
  }
  return text;
};