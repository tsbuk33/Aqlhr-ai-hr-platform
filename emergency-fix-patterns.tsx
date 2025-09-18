// Emergency Fix Patterns - Copy these into failing components
// Use when test reports show specific failure types

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { formatNumber } from '@/lib/i18n/format';
import { cn } from '@/lib/utils';

// PATTERN 1: Label Mismatch Fix
// Use when: ❌ Missing Arabic label: "الرواتب"
export const LabelMismatchFix = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* ❌ Before: <h1>Payroll Processing</h1> */}
      {/* ✅ After: */}
      <h1>{t('payroll.processing')}</h1>
      
      {/* ❌ Before: <span>Employee Management</span> */}
      {/* ✅ After: */}  
      <span>{t('employees.management')}</span>
      
      {/* ❌ Before: <CardTitle>System Overview</CardTitle> */}
      {/* ✅ After: */}
      <CardTitle>{t('system.overview')}</CardTitle>
    </div>
  );
};

// PATTERN 2: Western Numerals Fix  
// Use when: ⚠️ Western numerals found: 25,000 should be ٢٥,٠٠٠
export const NumeralsFix = ({ 
  employeeCount = 957, 
  salary = 25000, 
  percentage = 94.7 
}: { 
  employeeCount?: number;
  salary?: number; 
  percentage?: number;
}) => {
  const { lang } = useUnifiedLocale();
  
  return (
    <div>
      {/* ❌ Before: <span>{employeeCount}</span> */}
      {/* ✅ After: */}
      <span>
        {formatNumber(employeeCount, lang, { arabicIndic: lang === 'ar' })}
      </span>
      
      {/* ❌ Before: <div>SAR {salary.toLocaleString()}</div> */}
      {/* ✅ After: */}
      <div>
        {formatNumber(salary, lang, {
          style: 'currency',
          currency: 'SAR',
          arabicIndic: lang === 'ar'
        })}
      </div>
      
      {/* ❌ Before: <span>{percentage}%</span> */}
      {/* ✅ After: */}
      <span>
        {formatNumber(percentage, lang, { arabicIndic: lang === 'ar' })}%
      </span>
    </div>
  );
};

// PATTERN 3: RTL Alignment Fix
// Use when: ❌ Text aligning left on Arabic routes
export const RTLAlignmentFix = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useUnifiedLocale();
  const isRTL = lang === 'ar';
  
  return (
    <div>
      {/* ❌ Before: <div className="container mx-auto"> */}
      {/* ✅ After: */}
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          "container mx-auto p-6",
          isRTL ? "text-right" : "text-left"
        )}
      >
        {children}
      </div>
      
      {/* ❌ Before: <div className="grid grid-cols-3 gap-4"> */}
      {/* ✅ After: */}
      <div className={cn(
        "grid grid-cols-3 gap-4",
        isRTL && "direction-rtl"
      )}>
        {/* Grid content */}
      </div>
      
      {/* ❌ Before: <Card className="text-left"> */}
      {/* ✅ After: */}
      <Card className={cn(
        "transition-all",
        isRTL ? "text-right" : "text-left"
      )}>
        {/* Card content */}
      </Card>
    </div>
  );
};

// PATTERN 4: Complete Component Fix
// Use this when component has multiple failure types
export const CompleteComponentFix = ({
  title,
  count, 
  amount,
  description
}: {
  title: string;
  count: number;
  amount: number;
  description: string;
}) => {
  const { t } = useTranslation();
  const { lang } = useUnifiedLocale();
  const isRTL = lang === 'ar';
  
  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'} // ✅ RTL Fix
      className={cn(
        "p-6 rounded-lg border",
        isRTL ? "text-right" : "text-left" // ✅ RTL Fix
      )}
    >
      {/* ✅ Label Fix */}
      <h2 className="text-xl font-bold mb-4">
        {t(title)}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-muted-foreground">
            {t('common.count')}
          </span>
          <div className="text-2xl font-bold">
            {/* ✅ Numeral Fix */}
            {formatNumber(count, lang, { arabicIndic: isRTL })}
          </div>
        </div>
        
        <div>
          <span className="text-sm text-muted-foreground">
            {t('common.amount')}
          </span>
          <div className="text-2xl font-bold">
            {/* ✅ Numeral Fix */}
            {formatNumber(amount, lang, {
              style: 'currency',
              currency: 'SAR',
              arabicIndic: isRTL
            })}
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-muted-foreground">
        {/* ✅ Label Fix */}
        {t(description)}
      </p>
    </div>
  );
};

// PATTERN 5: Form RTL Fix
// Use when: ❌ Form inputs not RTL-aligned
export const FormRTLFix = () => {
  const { t } = useTranslation();
  const { lang } = useUnifiedLocale();
  const isRTL = lang === 'ar';
  
  return (
    <form dir={isRTL ? 'rtl' : 'ltr'} className="space-y-4">
      <div>
        {/* ✅ Label Fix + RTL Fix */}
        <label className={cn(
          "block text-sm font-medium mb-2",
          isRTL ? "text-right" : "text-left"
        )}>
          {t('form.name')}
        </label>
        
        {/* ✅ RTL Fix */}
        <input
          type="text"
          dir={isRTL ? 'rtl' : 'ltr'}
          placeholder={t('form.enterName')}
          className={cn(
            "w-full p-2 border rounded",
            isRTL ? "text-right pr-3" : "text-left pl-3"
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={cn(
            "block text-sm font-medium mb-2",
            isRTL ? "text-right" : "text-left"
          )}>
            {t('form.salary')}
          </label>
          <input
            type="number"
            dir={isRTL ? 'rtl' : 'ltr'}
            placeholder={t('form.enterSalary')}
            className={cn(
              "w-full p-2 border rounded",
              isRTL ? "text-right pr-3" : "text-left pl-3"
            )}
          />
        </div>
      </div>
    </form>
  );
};

// PATTERN 6: Navigation RTL Fix
// Use when: ❌ Navigation menu not RTL-aligned  
export const NavigationRTLFix = () => {
  const { t } = useTranslation();
  const { lang } = useUnifiedLocale();
  const isRTL = lang === 'ar';
  
  const menuItems = [
    { key: 'system.overview', path: '/system-overview' },
    { key: 'payroll.title', path: '/payroll' },
    { key: 'leave.management', path: '/leave' }
  ];
  
  return (
    <nav className={cn(
      "bg-background border-b",
      isRTL && "direction-rtl"
    )}>
      <ul className={cn(
        "flex space-x-6 p-4",
        isRTL && "flex-row-reverse space-x-reverse"
      )}>
        {menuItems.map((item) => (
          <li key={item.key}>
            <a 
              href={`/${lang}${item.path}`}
              className="hover:text-primary"
            >
              {/* ✅ Label Fix */}
              {t(item.key)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// EMERGENCY: One-liner fixes for specific elements

// ✅ Fix hardcoded title
// Before: <h1>System Overview</h1>
// After: <h1>{t('system.overview')}</h1>

// ✅ Fix number display  
// Before: <span>{value}</span>
// After: <span>{formatNumber(value, lang, { arabicIndic: lang === 'ar' })}</span>

// ✅ Fix text alignment
// Before: <div className="text-left">
// After: <div className={cn(lang === 'ar' ? "text-right" : "text-left")}>

// ✅ Fix container direction
// Before: <div className="container">
// After: <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="container">

export default {
  LabelMismatchFix,
  NumeralsFix, 
  RTLAlignmentFix,
  CompleteComponentFix,
  FormRTLFix,
  NavigationRTLFix
};