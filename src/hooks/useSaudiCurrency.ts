import { useCallback } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { formatCurrency, formatSalary, getCurrencySymbol } from '@/lib/utils/currency';

/**
 * Custom hook for Saudi Riyal currency formatting and display
 * Ensures consistent SAR currency handling across AqlHR
 */
export const useSaudiCurrency = () => {
  const { isArabic } = useSimpleLanguage();
  const locale = isArabic ? 'ar-SA' : 'en-US';

  const formatAmount = useCallback((amount: number, options?: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }) => {
    return formatCurrency(amount, { 
      locale, 
      showSymbol: options?.showSymbol ?? true,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    });
  }, [locale]);

  const formatSalaryAmount = useCallback((amount: number) => {
    return formatSalary(amount, locale);
  }, [locale]);

  const getSymbol = useCallback(() => {
    return getCurrencySymbol(locale);
  }, [locale]);

  const formatCompact = useCallback((amount: number) => {
    // Format large numbers in compact notation (e.g., 1.2K, 1.5M)
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      const formatted = millions.toFixed(1);
      return isArabic ? `${formatted} مليون ريال` : `SAR ${formatted}M`;
    } else if (amount >= 1000) {
      const thousands = amount / 1000;
      const formatted = thousands.toFixed(1);
      return isArabic ? `${formatted} ألف ريال` : `SAR ${formatted}K`;
    }
    return formatAmount(amount);
  }, [isArabic, formatAmount]);

  return {
    format: formatAmount,
    formatSalary: formatSalaryAmount,
    formatCompact,
    getSymbol,
    currency: 'SAR' as const,
    locale,
    isArabic,
  };
};