# ⚡ Quick Failure Fixes

When your test reports show failures, use these immediate fixes:

## 🏷️ Label Mismatch → Fix i18n Files

**When you see:** `❌ Missing Arabic label: "الرواتب"`

### 1. Add Missing Translation Keys

```json
// src/i18n/locales/ar.json
{
  "system": {
    "overview": "نظرة عامة على النظام"
  },
  "payroll": {
    "title": "الرواتب",
    "processing": "معالجة الرواتب"
  },
  "executive": {
    "center": "مركز الذكاء التنفيذي"
  },
  "leave": {
    "management": "إدارة الإجازات"
  }
}
```

### 2. Replace Hardcoded Text

```tsx
// ❌ Before
<CardTitle>Payroll Processing</CardTitle>

// ✅ After  
const { t } = useTranslation();
<CardTitle>{t('payroll.processing')}</CardTitle>
```

---

## 🔢 Western Numerals Leak → Apply formatArabicNumber()

**When you see:** `⚠️ Western numerals found: 25,000 should be ٢٥,٠٠٠`

### 1. Import Format Functions

```tsx
import { formatNumber } from '@/lib/i18n/format';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
```

### 2. Fix Number Displays

```tsx
// ❌ Before
<div>{salary.toLocaleString()}</div>

// ✅ After
const { lang } = useUnifiedLocale();
<div>
  {formatNumber(salary, lang, { arabicIndic: lang === 'ar' })}
</div>
```

### 3. Fix Currency Amounts

```tsx
// ❌ Before  
<span>SAR {amount}</span>

// ✅ After
const formattedAmount = formatNumber(amount, lang, {
  style: 'currency',
  currency: 'SAR', 
  arabicIndic: lang === 'ar'
});
<span>{formattedAmount}</span>
```

---

## ↔️ RTL Alignment Off → Add dir="rtl" Classes

**When you see:** `❌ Text aligning left on Arabic routes`

### 1. Fix Container Direction

```tsx
// ❌ Before
<div className="container mx-auto p-6">

// ✅ After
const { lang } = useUnifiedLocale();
const isRTL = lang === 'ar';

<div 
  dir={isRTL ? 'rtl' : 'ltr'}
  className={cn(
    "container mx-auto p-6",
    isRTL ? "text-right" : "text-left"
  )}
>
```

### 2. Fix Card Alignment

```tsx
// ❌ Before
<Card className="text-left">

// ✅ After  
<Card className={cn(
  isRTL ? "text-right" : "text-left"
)}>
```

### 3. Fix Form Inputs

```tsx
// ❌ Before
<input type="text" className="w-full p-2" />

// ✅ After
<input 
  type="text" 
  dir={isRTL ? 'rtl' : 'ltr'}
  className={cn(
    "w-full p-2",
    isRTL ? "text-right" : "text-left" 
  )}
/>
```

---

## 🎯 Test Your Fix Immediately

### 1. Browser Console Check
```javascript
// On any /ar/* route, run:
validateArabicRoute()
```

### 2. Quick Cypress Test
```bash
# Test specific route after fix
npx cypress run --spec 'cypress/e2e/bilingual-functional.cy.ts' --env route="payroll"
```

### 3. Visual Verification
- Visit `/ar/payroll` → Check salary figures show ٢٥٠,٠٠٠ not 250,000
- Visit `/ar/system-overview` → Check cards show Arabic labels
- Check all text flows right-to-left

---

## 📋 Common Fix Locations

### System Overview Page (`src/pages/SystemOverview.tsx`)
```tsx
// Fix module titles
titleAr: "مركز الذكاء التنفيذي",  // Executive Intelligence Center
titleAr: "الموارد البشرية الأساسية", // Core HR
titleAr: "الامتثال والحوكمة",     // Compliance & Governance
```

### Payroll Page (`src/pages/Payroll.tsx`)  
```tsx
// Fix salary displays around line 300-400
const formattedSalary = formatNumber(salary, lang, { 
  arabicIndic: lang === 'ar' 
});
```

### Navigation (`src/components/AppSidebar.tsx`)
```tsx
// Fix menu labels
{isArabic ? 'الرواتب' : 'Payroll'}
{isArabic ? 'الإجازات' : 'Leave'}
```

---

## ⚡ Emergency Fix Pattern

**Copy-paste this pattern into any failing component:**

```tsx
import { useTranslation } from 'react-i18next';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { formatNumber } from '@/lib/i18n/format';
import { cn } from '@/lib/utils';

const FixedComponent = ({ value, label }: { value: number; label: string }) => {
  const { t } = useTranslation();
  const { lang } = useUnifiedLocale();
  const isRTL = lang === 'ar';
  
  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(isRTL ? "text-right" : "text-left")}
    >
      <h3>{t(label)}</h3> {/* ✅ i18n label */}
      <div className="text-2xl font-bold">
        {formatNumber(value, lang, { arabicIndic: isRTL })} {/* ✅ Arabic numerals */}
      </div>
    </div>
  );
};
```

---

## 🔄 Fix → Test → Repeat

1. **Apply fix** to failing component
2. **Refresh** browser on `/ar/*` route  
3. **Run** `validateArabicRoute()` in console
4. **Check** for remaining issues
5. **Move** to next failure
6. **Repeat** until 95%+ pass rate