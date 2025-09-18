# 🎯 Specific Test Suite Commands

## Quick Reference

### Arabic Numerals Only
```bash
# Option 1: Direct Cypress
npx cypress run --spec 'cypress/e2e/arabic-indic-numerals.cy.ts'

# Option 2: Custom script  
bash run-specific-test-suites.sh arabic

# Option 3: NPM script (if added to package.json)
npm run test:arabic
```

**What it tests:** Numbers display as ٠١٢٣٤٥٦٧٨٩ instead of 0123456789 on Arabic routes

**Focus pages:** `/ar/payroll`, `/ar/analytics`, `/ar/leave`

---

### Bilingual Labels Only
```bash
# Option 1: Direct Cypress
npx cypress run --spec 'cypress/e2e/bilingual-functional.cy.ts'

# Option 2: Custom script
bash run-specific-test-suites.sh bilingual

# Option 3: NPM script (if added to package.json)  
npm run test:bilingual
```

**What it tests:** Exact Arabic labels match requirements (no English fallbacks)

**Key validations:**
- System Overview → "نظرة عامة على النظام"
- Payroll → "الرواتب"
- Executive Center → "مركز الذكاء التنفيذي"

---

### RTL Layout Only
```bash
# Option 1: Direct Cypress
npx cypress run --spec 'cypress/e2e/enhanced-rtl-layout.cy.ts'

# Option 2: Custom script
bash run-specific-test-suites.sh rtl

# Option 3: NPM script (if added to package.json)
npm run test:rtl
```

**What it tests:** Right-to-left layout implementation

**Key checks:**
- HTML has `dir="rtl"` attribute
- Cards align to the right
- Text flows right-to-left
- Form inputs are RTL-aware

---

### Critical Pages Only
```bash
# Option 1: Direct Cypress  
npx cypress run --spec 'cypress/e2e/comprehensive-route-testing.cy.ts'

# Option 2: Custom script
bash run-specific-test-suites.sh critical

# Focus: 5 most important routes
# /ar/system-overview, /ar/payroll, /ar/leave, /ar/analytics, /ar/executive-center
```

---

### Interactive Elements Only
```bash
# Option 1: Direct Cypress
npx cypress run --spec 'cypress/e2e/interactive-components.cy.ts'

# Option 2: Custom script  
bash run-specific-test-suites.sh interactive

# Tests: Tables, forms, charts, AI assistant functionality
```

---

## 🎮 Interactive Menu

```bash
bash run-specific-test-suites.sh
```

This launches an interactive menu where you can choose:
1. Arabic Numerals Only
2. Bilingual Labels Only  
3. RTL Layout Only
4. Critical Pages Only
5. Interactive Elements Only

---

## 🔄 When to Use Each Suite

### 🔢 Arabic Numerals (`test:arabic`)
**Use when:** You've fixed number formatting issues
- After updating `formatArabicNumber()` functions
- When salary/currency displays were wrong  
- Before validating payroll or analytics pages

### 🌐 Bilingual Labels (`test:bilingual`) 
**Use when:** You've updated translation files
- After adding keys to `ar.json`/`en.json`
- When fixing hardcoded English text
- Before validating system navigation

### ↔️ RTL Layout (`test:rtl`)
**Use when:** You've fixed alignment issues  
- After adding `dir="rtl"` attributes
- When fixing card/form alignment
- Before validating visual layout

### 🎯 Critical Pages (`test:critical`)
**Use when:** You want focused validation
- Testing core functionality quickly
- Before production deployment
- Validating most important user flows

### 🖱️ Interactive Elements (`test:interactive`)
**Use when:** Testing functionality
- After updating forms or charts
- When AI assistant changes made
- Before validating user interactions

---

## 📊 Expected Output

Each test suite generates:

### ✅ Pass Example
```
🧪 Running: Arabic Numerals
📋 Description: Arabic-Indic numeral validation (٠١٢٣٤٥٦٧٨٩)
✅ /ar/payroll - Salary figures show ٢٥٠,٠٠٠
✅ /ar/analytics - Chart axes use ١٢٣٤
✅ /ar/leave - Day counts in Arabic numerals
```

### ⚠️ Partial Example  
```
🧪 Running: Bilingual Labels
⚠️ /ar/system-overview - Missing "مركز الذكاء التنفيذي"
✅ /ar/payroll - Label "الرواتب" found
❌ /ar/compliance - English fallback detected
```

### 📊 Results Location
- **Reports:** `cypress/reports/arabic_numerals_20241218_143022.json`
- **Screenshots:** `cypress/screenshots/` (for failures)
- **Videos:** `cypress/videos/` (full test recordings)

---

## 💡 Pro Tips

### 🚀 Speed Up Testing
```bash
# Test just one problematic route
npx cypress run --spec 'cypress/e2e/bilingual-functional.cy.ts' --env route="payroll"

# Run in headed mode to see live
npx cypress open
```

### 🔍 Debug Failures
```bash
# Run with debug output
npx cypress run --spec 'cypress/e2e/arabic-indic-numerals.cy.ts' --config video=true

# Check browser console for errors
# Browser Dev Tools → Console → look for validation errors
```

### ⚡ Quick Validation Loop
1. **Run specific suite** → Identify exact issues
2. **Apply targeted fixes** → Use failure remediation patterns  
3. **Test same suite again** → Verify improvements
4. **Move to next suite** → Until all pass

This focused approach is much faster than running the full 142-test comprehensive suite every time you make a small fix.