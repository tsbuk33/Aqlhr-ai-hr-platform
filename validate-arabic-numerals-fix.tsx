// Quick fix for Arabic numeral formatting in Payroll component
// This shows how to properly format numbers with Arabic-Indic numerals

import { formatNumber } from '@/lib/i18n/format';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

// Example usage in Payroll component
const PayrollNumberDisplay = ({ value, label }: { value: number; label: string }) => {
  const { lang } = useUnifiedLocale();
  
  // Format with Arabic-Indic numerals when language is Arabic
  const formattedValue = formatNumber(value, lang, { 
    arabicIndic: lang === 'ar' 
  });
  
  return (
    <div className="text-center p-4 rounded-lg bg-background/50">
      <div className="text-2xl font-bold text-primary">
        {formattedValue}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
};

// Example for currency formatting
const PayrollCurrencyDisplay = ({ amount, currency = 'SAR' }: { amount: number; currency?: string }) => {
  const { lang } = useUnifiedLocale();
  
  const formattedAmount = new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA-u-nu-arab' : 'en-SA', 
    {
      style: 'currency',
      currency: currency
    }
  ).format(amount);
  
  return <span className="font-semibold">{formattedAmount}</span>;
};

export { PayrollNumberDisplay, PayrollCurrencyDisplay };