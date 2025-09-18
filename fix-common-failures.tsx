// Quick fixes for the most common bilingual test failures
// Copy these patterns into your components

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { formatNumber } from '@/lib/i18n/format';
import { formatArabicNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 1. FIX: Label Mismatch - Proper i18n Usage
export const SystemOverviewFixed = () => {
  const { t } = useTranslation();
  const { lang } = useUnifiedLocale();
  
  return (
    <div className="space-y-6">
      {/* ✅ Correct: Using translation keys */}
      <h1 className="text-3xl font-bold">
        {t('system.title')} {/* "نظرة عامة على نظام AqlHR" */}
      </h1>
      
      <Card>
        <CardTitle>{t('modules.payroll.title')}</CardTitle> {/* "الرواتب" */}
        <CardContent>
          <p>{t('modules.payroll.description')}</p> {/* "معالجة الرواتب" */}
        </CardContent>
      </Card>
    </div>
  );
};

// 2. FIX: Western Numerals Leak - Arabic-Indic Formatting
export const PayrollNumbersFixed = ({ 
  employeeCount, 
  totalSalary, 
  gosiContributions 
}: { 
  employeeCount: number;
  totalSalary: number;
  gosiContributions: number;
}) => {
  const { lang } = useUnifiedLocale();
  const { t } = useTranslation();
  
  // ✅ Correct: Format numbers based on language
  const formatDisplayNumber = (value: number) => {
    return formatNumber(value, lang, { 
      arabicIndic: lang === 'ar' 
    });
  };
  
  const formatCurrency = (amount: number) => {
    return formatNumber(amount, lang, {
      style: 'currency',
      currency: 'SAR',
      arabicIndic: lang === 'ar'
    });
  };
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('payroll.employees')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDisplayNumber(employeeCount)} {/* ٩٥٧ not 957 */}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('payroll.totalSalary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalSalary)} {/* ٢٥٠,٠٠٠ ر.س not SAR 250,000 */}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('payroll.gosiContributions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(gosiContributions)} {/* ٧١٣,١٣٠ ر.س */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 3. FIX: RTL Alignment Off - Proper Direction Handling
export const RTLLayoutFixed = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useUnifiedLocale();
  const isRTL = lang === 'ar';
  
  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        "container mx-auto p-6 space-y-8",
        // ✅ Correct: RTL-aware alignment
        isRTL ? "text-right" : "text-left"
      )}
    >
      {/* ✅ Correct: Grid flows right-to-left in Arabic */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        isRTL && "direction-rtl"
      )}>
        {children}
      </div>
    </div>
  );
};

// 4. FIX: Form Input RTL Issues
export const RTLFormFixed = () => {
  const { lang } = useUnifiedLocale();
  const { t } = useTranslation();
  const isRTL = lang === 'ar';
  
  return (
    <form dir={isRTL ? 'rtl' : 'ltr'} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={cn(
            "block text-sm font-medium mb-2",
            isRTL ? "text-right" : "text-left"
          )}>
            {t('form.employeeName')} {/* "اسم الموظف" */}
          </label>
          <input
            type="text"
            dir={isRTL ? 'rtl' : 'ltr'}
            placeholder={t('form.enterName')}
            className={cn(
              "w-full p-2 border rounded-md",
              isRTL ? "text-right pr-3" : "text-left pl-3"
            )}
          />
        </div>
        
        <div>
          <label className={cn(
            "block text-sm font-medium mb-2",
            isRTL ? "text-right" : "text-left"
          )}>
            {t('form.salary')} {/* "الراتب" */}
          </label>
          <input
            type="number"
            dir={isRTL ? 'rtl' : 'ltr'}
            placeholder={t('form.enterSalary')}
            className={cn(
              "w-full p-2 border rounded-md",
              isRTL ? "text-right pr-3" : "text-left pl-3"
            )}
          />
        </div>
      </div>
    </form>
  );
};

// 5. FIX: Chart with Arabic Numerals
export const ChartWithArabicNumerals = ({ data }: { data: any[] }) => {
  const { lang } = useUnifiedLocale();
  
  // ✅ Correct: Format chart tick labels for Arabic
  const formatTickLabel = (value: number) => {
    return lang === 'ar' ? formatArabicNumber(value, lang) : value.toString();
  };
  
  // Note: This is pseudocode - adapt to your chart library
  const chartConfig = {
    xAxis: {
      tickFormatter: formatTickLabel
    },
    yAxis: {
      tickFormatter: formatTickLabel
    },
    tooltip: {
      formatter: (value: number) => {
        const formatted = formatNumber(value, lang, {
          style: 'currency',
          currency: 'SAR',
          arabicIndic: lang === 'ar'
        });
        return formatted;
      }
    }
  };
  
  return (
    <div className="w-full h-96">
      {/* Your chart component with Arabic-aware formatting */}
      <p className="text-center text-muted-foreground">
        Chart with {lang === 'ar' ? 'Arabic-Indic' : 'Western'} numerals
      </p>
    </div>
  );
};

// 6. FIX: Navigation with RTL Support
export const RTLNavigationFixed = () => {
  const { lang } = useUnifiedLocale();
  const { t } = useTranslation();
  const isRTL = lang === 'ar';
  
  const navigationItems = [
    { key: 'system-overview', icon: '🏠' },
    { key: 'payroll', icon: '💰' },
    { key: 'leave', icon: '📅' },
    { key: 'analytics', icon: '📊' }
  ];
  
  return (
    <nav className={cn(
      "bg-background border-b",
      isRTL && "direction-rtl"
    )}>
      <div className="container mx-auto px-4">
        <ul className={cn(
          "flex space-x-6 py-4",
          isRTL && "flex-row-reverse space-x-reverse"
        )}>
          {navigationItems.map((item) => (
            <li key={item.key}>
              <a 
                href={`/${lang}/${item.key}`}
                className={cn(
                  "flex items-center space-x-2 hover:text-primary",
                  isRTL && "flex-row-reverse space-x-reverse"
                )}
              >
                <span>{item.icon}</span>
                <span>{t(`navigation.${item.key}`)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Usage Example: Complete Page Fix
export const PayrollPageFixed = () => {
  const { lang } = useUnifiedLocale();
  const { t } = useTranslation();
  
  // Sample data
  const payrollData = {
    employeeCount: 957,
    totalSalary: 2850000,
    gosiContributions: 713130
  };
  
  return (
    <RTLLayoutFixed>
      {/* Fixed: Proper translation */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {t('payroll.title')} {/* "الرواتب" */}
        </h1>
        <p className="text-muted-foreground">
          {t('payroll.description')} {/* "معالجة وإدارة الرواتب الشهرية" */}
        </p>
      </div>
      
      {/* Fixed: Arabic numerals */}
      <PayrollNumbersFixed {...payrollData} />
      
      {/* Fixed: RTL form */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          {t('payroll.addEmployee')} {/* "إضافة موظف جديد" */}
        </h2>
        <RTLFormFixed />
      </div>
    </RTLLayoutFixed>
  );
};

export default PayrollPageFixed;