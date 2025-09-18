# 🔧 Failure Remediation Guide

## Common Failure Types & Fixes

When your comprehensive bilingual test reports show **⚠️ Partial** or **❌ Fail** status, here's how to fix each type of issue:

---

## 1. 🏷️ Label Mismatch → Add/Correct Translations

### Problem
```
❌ Missing Arabic label: "الرواتب" (Payroll)
❌ English fallback text visible on Arabic routes
❌ Raw translation keys showing (e.g., "payroll.title")
```

### Solution: Update i18n Files

#### Add Missing Keys to Translation Files

**`src/i18n/locales/en.json`**
```json
{
  "system": {
    "overview": "System Overview",
    "title": "AqlHR System Overview"
  },
  "payroll": {
    "title": "Payroll",
    "salary": "Salary",
    "processing": "Payroll Processing",
    "employees": "Employees",
    "contributions": "Contributions"
  },
  "leave": {
    "title": "Leave Management", 
    "days": "Days",
    "balance": "Leave Balance",
    "requests": "Leave Requests"
  }
}
```

**`src/i18n/locales/ar.json`**
```json
{
  "system": {
    "overview": "نظرة عامة على النظام",
    "title": "نظرة عامة على نظام AqlHR"
  },
  "payroll": {
    "title": "الرواتب",
    "salary": "الراتب", 
    "processing": "معالجة الرواتب",
    "employees": "الموظفين",
    "contributions": "المساهمات"
  },
  "leave": {
    "title": "إدارة الإجازات",
    "days": "أيام",
    "balance": "رصيد الإجازات",
    "requests": "طلبات الإجازة"
  }
}
```

#### Fix Components Using Hardcoded Text

**❌ Before (Hardcoded):**
```tsx
const PayrollCard = () => {
  return (
    <Card>
      <CardTitle>Payroll Processing</CardTitle>
      <CardDescription>Process and manage payroll</CardDescription>
    </Card>
  );
};
```

**✅ After (i18n):**
```tsx
import { useTranslation } from 'react-i18next';

const PayrollCard = () => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardTitle>{t('payroll.processing')}</CardTitle>
      <CardDescription>{t('payroll.description')}</CardDescription>
    </Card>
  );
};
```

---

## 2. 🔢 Western Numerals Leak → Apply formatArabicNumber()

### Problem
```
⚠️ Western numerals found: "25,000" should be "٢٥,٠٠٠"
⚠️ Chart axes showing 123 instead of ١٢٣
⚠️ Salary figures in Western format on Arabic routes
```

### Solution: Use Arabic Number Formatting

#### Import the Formatting Utilities

```tsx
import { formatNumber } from '@/lib/i18n/format';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { formatArabicNumber } from '@/lib/utils';
```

#### Fix Salary/Currency Displays

**❌ Before (Western numerals):**
```tsx
const SalaryCard = ({ amount }: { amount: number }) => {
  return (
    <div className="text-2xl font-bold">
      SAR {amount.toLocaleString()}
    </div>
  );
};
```

**✅ After (Arabic-Indic numerals):**
```tsx
const SalaryCard = ({ amount }: { amount: number }) => {
  const { lang } = useUnifiedLocale();
  
  const formattedAmount = formatNumber(amount, lang, {
    style: 'currency',
    currency: 'SAR',
    arabicIndic: lang === 'ar'
  });
  
  return (
    <div className="text-2xl font-bold">
      {formattedAmount}
    </div>
  );
};
```

#### Fix Regular Number Displays

**❌ Before:**
```tsx
const EmployeeCount = ({ count }: { count: number }) => {
  return <span>{count} employees</span>;
};
```

**✅ After:**
```tsx
const EmployeeCount = ({ count }: { count: number }) => {
  const { lang } = useUnifiedLocale();
  const { t } = useTranslation();
  
  const formattedCount = lang === 'ar' 
    ? formatArabicNumber(count, lang)
    : count.toString();
  
  return <span>{formattedCount} {t('payroll.employees')}</span>;
};
```

#### Fix Chart/Analytics Numbers

**❌ Before (Chart with Western numerals):**
```tsx
const PayrollChart = ({ data }) => {
  return (
    <BarChart data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Bar dataKey="amount" />
    </BarChart>
  );
};
```

**✅ After (Arabic-Indic numerals on Arabic routes):**
```tsx
const PayrollChart = ({ data }) => {
  const { lang } = useUnifiedLocale();
  
  const formatAxisTick = (value: number) => {
    return lang === 'ar' ? formatArabicNumber(value, lang) : value.toString();
  };
  
  return (
    <BarChart data={data}>
      <XAxis dataKey="month" />
      <YAxis tickFormatter={formatAxisTick} />
      <Bar dataKey="amount" />
    </BarChart>
  );
};
```

---

## 3. ↔️ RTL Alignment Off → Add dir="rtl" or RTL Classes

### Problem
```
❌ Text aligning left on Arabic routes
❌ Cards not flowing right-to-left  
❌ Missing dir="rtl" on HTML element
❌ Form inputs not RTL-aligned
```

### Solution: Implement RTL Layout

#### Ensure HTML Direction Attribute

**Check `src/lib/i18n/unifiedLocaleSystem.ts`:**
```tsx
export const setLanguage = (lang: 'ar' | 'en') => {
  // Store language preference
  localStorage.setItem('i18nextLng', lang);
  localStorage.setItem('aqlhr-locale', lang);
  
  // Update HTML attributes
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', lang);
  htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  
  // Update body class for CSS targeting
  document.body.classList.toggle('rtl', lang === 'ar');
};
```

#### Fix Card Grid Alignment

**❌ Before (Always LTR):**
```tsx
const PayrollCards = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card className="text-left">
        <CardContent>Employee Count: 957</CardContent>
      </Card>
    </div>
  );
};
```

**✅ After (RTL-aware):**
```tsx
const PayrollCards = () => {
  const { lang } = useUnifiedLocale();
  const isRTL = lang === 'ar';
  
  return (
    <div className={cn(
      "grid grid-cols-3 gap-6",
      isRTL && "direction-rtl"
    )}>
      <Card className={cn(
        "transition-all",
        isRTL ? "text-right" : "text-left"
      )}>
        <CardContent>
          {formatNumber(957, lang, { arabicIndic: isRTL })}{' '}
          {t('payroll.employees')}
        </CardContent>
      </Card>
    </div>
  );
};
```

#### Fix Form Input Direction

**❌ Before:**
```tsx
const PayrollForm = () => {
  return (
    <form>
      <input 
        type="text" 
        placeholder="Enter employee name"
        className="w-full p-2 border rounded"
      />
    </form>
  );
};
```

**✅ After:**
```tsx
const PayrollForm = () => {
  const { lang } = useUnifiedLocale();
  const { t } = useTranslation();
  const isRTL = lang === 'ar';
  
  return (
    <form dir={isRTL ? 'rtl' : 'ltr'}>
      <input 
        type="text" 
        placeholder={t('form.employeeName')}
        className={cn(
          "w-full p-2 border rounded transition-all",
          isRTL ? "text-right" : "text-left"
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </form>
  );
};
```

#### Add RTL Utility Classes to Tailwind

**`tailwind.config.ts`:**
```ts
module.exports = {
  // ... existing config
  plugins: [
    // ... existing plugins
    function({ addUtilities }) {
      addUtilities({
        '.direction-rtl': {
          direction: 'rtl'
        },
        '.direction-ltr': {
          direction: 'ltr'
        }
      })
    }
  ]
}
```

---

## 🔍 Testing Your Fixes

### 1. Run Targeted Tests
```bash
# Test specific routes after fixes
npx cypress run --spec 'cypress/e2e/bilingual-functional.cy.ts'

# Test numeral formatting
npx cypress run --spec 'cypress/e2e/arabic-indic-numerals.cy.ts'

# Test RTL layout
npx cypress run --spec 'cypress/e2e/enhanced-rtl-layout.cy.ts'
```

### 2. Manual Browser Testing
```bash
# Use the browser console validator
validateArabicRoute()  # On any /ar/* route
```

### 3. Check Reports
```bash
bash check-test-reports.sh
```

---

## 🎯 Success Criteria

After applying fixes, your reports should show:

### ✅ Target Metrics
- **Success Rate**: 95%+ (up from previous failures)
- **Arabic Numeral Compliance**: 100% on `/ar/*` routes
- **RTL Layout**: All components properly aligned
- **Translation Coverage**: Zero English fallbacks on Arabic routes

### 🔄 Iterative Process
1. **Run tests** → Identify failures
2. **Apply fixes** → Target specific failure types  
3. **Test again** → Verify improvements
4. **Repeat** → Until 95%+ success rate

---

## 💡 Pro Tips

### Quick Fixes for Common Routes

#### System Overview Page
```tsx
// Ensure all module titles use i18n
{modules.map(module => (
  <Card key={module.id}>
    <CardTitle>{t(`modules.${module.id}.title`)}</CardTitle>
  </Card>
))}
```

#### Payroll Dashboard
```tsx
// Format all financial figures
const salaryDisplay = formatNumber(salary, lang, {
  style: 'currency',
  currency: 'SAR', 
  arabicIndic: lang === 'ar'
});
```

#### Analytics Charts
```tsx
// Arabic-aware chart formatting
const chartConfig = {
  yAxis: {
    tickFormatter: (value) => 
      lang === 'ar' ? formatArabicNumber(value, lang) : value
  }
};
```

### CSS for RTL Support
```css
/* Add to index.css for RTL utilities */
[dir="rtl"] .rtl-flip {
  transform: scaleX(-1);
}

[dir="rtl"] .text-align-start {
  text-align: right;
}

[dir="ltr"] .text-align-start {
  text-align: left;
}
```

This systematic approach ensures your Arabic routes pass all validation tests with proper translations, Arabic-Indic numerals, and RTL layout.
