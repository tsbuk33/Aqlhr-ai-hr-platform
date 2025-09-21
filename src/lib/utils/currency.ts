/**
 * Currency utilities for AqlHR - Saudi Riyal (SAR) focused
 * All monetary values in AqlHR should use Saudi Riyal
 */

export type SupportedCurrency = 'SAR';

export interface CurrencyFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
  locale?: 'ar-SA' | 'en-US';
}

/**
 * Format currency amount in Saudi Riyal (SAR)
 * Supports both Arabic and English locales
 */
export const formatCurrency = (
  amount: number,
  options: CurrencyFormatOptions = {}
): string => {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true,
    locale = 'ar-SA'
  } = options;

  if (locale === 'ar-SA') {
    // Arabic format: "1,234.56 ريال"
    const formatted = amount.toLocaleString('ar-SA', {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    return showSymbol ? `${formatted} ريال` : formatted;
  } else {
    // English format: "SAR 1,234.56"
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    return showSymbol ? `SAR ${formatted}` : formatted;
  }
};

/**
 * Format salary specifically (common use case)
 */
export const formatSalary = (
  amount: number,
  locale: 'ar-SA' | 'en-US' = 'ar-SA'
): string => {
  return formatCurrency(amount, { locale, showSymbol: true });
};

/**
 * Format currency without symbol (for calculations display)
 */
export const formatCurrencyAmount = (
  amount: number,
  locale: 'ar-SA' | 'en-US' = 'ar-SA'
): string => {
  return formatCurrency(amount, { locale, showSymbol: false });
};

/**
 * Parse currency string back to number
 */
export const parseCurrency = (currencyString: string): number => {
  // Remove currency symbols and spaces, keep numbers and decimal point
  const cleanString = currencyString
    .replace(/[^\\d.-]/g, '')
    .replace(',', '');
  
  return parseFloat(cleanString) || 0;
};

/**
 * Get currency symbol for display
 */
export const getCurrencySymbol = (locale: 'ar-SA' | 'en-US' = 'ar-SA'): string => {
  return locale === 'ar-SA' ? 'ريال' : 'SAR';
};
