# 🔍 Arabic Route Validation Checklist

## Critical Routes to Validate

### 1. `/ar/system-overview` - System Overview
**Expected Result:** Cards and labels fully in Arabic
- [ ] Page title shows: "نظرة عامة على نظام AqlHR"
- [ ] HTML has `dir="rtl"` and `lang="ar"`
- [ ] Module cards show Arabic labels:
  - [ ] "مركز الذكاء التنفيذي" (Executive Intelligence Center)
  - [ ] "الموارد البشرية الأساسية" (Core HR)
  - [ ] "الامتثال والحوكمة" (Compliance & Governance)
- [ ] Cards flow right-to-left
- [ ] No English fallback text visible

### 2. `/ar/payroll` - Payroll
**Expected Result:** Salaries in Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩)
- [ ] Page title shows: "الرواتب" (Payroll)
- [ ] HTML has `dir="rtl"` and `lang="ar"`
- [ ] Salary figures display as Arabic-Indic:
  - [ ] ٩٥٧ employees (not 957)
  - [ ] ٢٨٧,٤٥٠ employee contributions (not 287,450)
  - [ ] ٤٢٥,٦٨٠ employer contributions (not 425,680)
- [ ] Percentage values use Arabic numerals: ٩٤.٧%
- [ ] Currency amounts: ٦٧,٠٠٠ ريال (not SAR 67,000)

### 3. `/ar/leave` - Leave Management  
**Expected Result:** Day counts in Arabic numerals
- [ ] Page title shows: "إدارة الإجازات"
- [ ] HTML has `dir="rtl"` and `lang="ar"`
- [ ] Leave day counts in Arabic-Indic numerals
- [ ] Leave balances show Arabic numerals
- [ ] Date displays follow Arabic format

### 4. `/ar/analytics` - Analytics
**Expected Result:** Charts/axes in Arabic numerals
- [ ] Page title shows Arabic analytics title
- [ ] HTML has `dir="rtl"` and `lang="ar"`
- [ ] Chart axes use Arabic-Indic numerals
- [ ] Percentage values: ٨٩.٣% format
- [ ] Data labels in Arabic numerals
- [ ] Legend text in Arabic

### 5. `/ar/executive-center` - Executive Center
**Expected Result:** RTL layout, all text Arabic
- [ ] Page title shows: "مركز الذكاء التنفيذي"
- [ ] HTML has `dir="rtl"` and `lang="ar"`
- [ ] Complete RTL layout (navigation, cards, text)
- [ ] All UI text in Arabic (no English visible)
- [ ] Metrics and KPIs in Arabic-Indic numerals
- [ ] Proper text alignment (right-aligned)

## Manual Browser Testing

### Step 1: Open Browser Console
1. Navigate to any `/ar/*` route
2. Open Developer Tools (F12)
3. Go to Console tab
4. Paste and run: `validateArabicRoute()`

### Step 2: Visual Inspection
For each route, check:
- [ ] RTL text flow (Arabic text flows right-to-left)
- [ ] Proper card alignment (content aligns to right edge)
- [ ] No mixed numerals (should be all Arabic-Indic: ٠١٢٣٤٥٦٧٨٩)
- [ ] No English text fallbacks
- [ ] Proper Arabic typography and spacing

## Automated Testing Commands

### Run All Tests
```bash
bash scripts/run-strict-bilingual-tests.sh
```

### Individual Test Suites
```bash
# Bilingual functional tests (22 modules × 2 languages)
npx cypress run --spec 'cypress/e2e/bilingual-functional.cy.ts'

# Arabic-Indic numeral validation
npx cypress run --spec 'cypress/e2e/arabic-indic-numerals.cy.ts'

# Comprehensive route testing (142 total tests)
npx cypress run --spec 'cypress/e2e/comprehensive-bilingual-suite.cy.ts'

# RTL layout validation
npx cypress run --spec 'cypress/e2e/enhanced-rtl-layout.cy.ts'
```

## Expected Test Results

### ✅ Pass Criteria
- **142/142** route tests pass (71 routes × 2 languages)
- **0** English text on Arabic routes
- **100%** Arabic-Indic numeral compliance on `/ar/*` routes
- **RTL layout** properly implemented across all components
- **Exact Arabic labels** match translation requirements

### ⚠️ Common Issues to Watch For
- Numbers showing as `25000` instead of `٢٥,٠٠٠`
- HTML missing `dir="rtl"` attribute
- Cards aligning left instead of right
- English fallback text visible
- Mixed Western/Arabic numerals on same page

### 📊 Test Report Format
Each test suite generates reports in `cypress/reports/`:
- JSON detailed results
- HTML summary reports
- Screenshot evidence for failures

## Quick Validation Script

Save this snippet for browser console testing:
```javascript
// Paste this in browser console on any /ar/* route
validateArabicRoute();
```

This checks:
- HTML dir/lang attributes
- Arabic vs Western numeral counts  
- Route-specific Arabic label requirements
- Basic RTL layout validation

## Success Metrics

**🎯 Goal:** 100% functionality of all modules in both EN and AR
- Exact Arabic labels (not approximations)
- Arabic-Indic numerals enforced (٠١٢٣٤٥٦٧٨٩)
- RTL layout properly implemented
- Zero English text leakage on Arabic routes