# 🚀 Local Validation Execution Guide

## Prerequisites & Setup

### 1. System Requirements
```bash
# Check Node.js version (minimum 16.x required)
node --version  # Should be v16+ or v18+

# Check npm version
npm --version   # Should be 8+ or 9+

# If you need to install Node.js:
# Visit: https://nodejs.org/ and download LTS version
```

### 2. Project Dependencies
```bash
# Ensure you're in your project root directory
pwd  # Should show your AqlHR project path

# Install all dependencies (including Cypress)
npm install

# Verify Cypress is installed
npx cypress version
# Should show: Cypress package version: 14.5.3
```

### 3. Development Server
```bash
# Start the development server (REQUIRED for tests)
npm run dev

# Verify server is running by visiting:
# http://localhost:5173/en/system-overview

# Keep this terminal open - you'll use a new terminal for testing
```

## Execution Directory & Commands

### 1. Run From Project Root
```bash
# Navigate to your project root (where package.json exists)
cd /path/to/your/aqlhr-project

# Verify you're in the right place
ls -la
# You should see: package.json, src/, cypress/, scripts/

# Make the script executable
chmod +x run-final-validation.sh
chmod +x scripts/run-strict-bilingual-tests.sh

# Execute the complete validation pipeline
bash run-final-validation.sh
```

## Generated Files & Locations

### 1. Test Reports (`cypress/reports/`)
```
cypress/reports/
├── final_validation_report_20241218_143022.html    # Main HTML report
├── final_validation_report_20241218_143022_summary.md  # Markdown summary
├── comprehensive_bilingual_report_20241218_143022.json  # Raw test data
├── retest_numerals_20241218_143022.json            # Numeral retest results
├── retest_rtl_20241218_143022.json                 # RTL retest results
└── retest_bilingual_20241218_143022.json           # Label retest results
```

### 2. Screenshots (`cypress/screenshots/`)
```
cypress/screenshots/
├── ar-system-overview-validation.png               # System overview cards
├── ar-payroll-numerals.png                        # Payroll with numerals
├── ar-leave-management.png                        # Leave management
├── ar-analytics-charts.png                        # Analytics charts
└── ar-executive-center-rtl.png                    # Executive center RTL
```

### 3. Videos (`cypress/videos/`)
```
cypress/videos/
├── bilingual-functional.cy.ts.mp4                 # Full test run recording
├── arabic-indic-numerals.cy.ts.mp4               # Numeral validation
└── enhanced-rtl-layout.cy.ts.mp4                 # RTL layout tests
```

### 4. How to Open Reports
```bash
# Open main HTML report in your default browser
open cypress/reports/final_validation_report_*.html

# Or on Linux:
xdg-open cypress/reports/final_validation_report_*.html

# Or on Windows:
start cypress/reports/final_validation_report_*.html

# Or manually: Copy the file path and paste in browser address bar
file:///absolute/path/to/your/project/cypress/reports/final_validation_report_20241218_143022.html
```

## Automated Screenshot Capture

### Method 1: Cypress Screenshot Commands
```bash
# Create screenshot capture script
cat > capture-screenshots.js << 'EOF'
// Automated screenshot capture for critical Arabic routes
describe('Critical Arabic Route Screenshots', () => {
  const routes = [
    { path: '/ar/system-overview', filename: 'ar-system-overview-validation' },
    { path: '/ar/payroll', filename: 'ar-payroll-numerals' },
    { path: '/ar/leave', filename: 'ar-leave-management' },
    { path: '/ar/analytics', filename: 'ar-analytics-charts' },
    { path: '/ar/executive-center', filename: 'ar-executive-center-rtl' }
  ];

  routes.forEach(route => {
    it(`captures screenshot for ${route.path}`, () => {
      // Set Arabic locale
      cy.window().then((win) => {
        win.localStorage.setItem('i18nextLng', 'ar');
        win.localStorage.setItem('aqlhr-locale', 'ar');
      });
      
      // Visit route and wait for load
      cy.visit(route.path);
      cy.wait(2000);  // Allow time for full render
      
      // Ensure Arabic direction is set
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('html').should('have.attr', 'lang', 'ar');
      
      // Take full-page screenshot
      cy.screenshot(route.filename, { 
        capture: 'fullPage',
        overwrite: true 
      });
      
      // Validate Arabic content exists
      cy.get('body').should('contain.text', 'ا'); // Contains Arabic character
    });
  });
});
EOF

# Save as Cypress test and run
mv capture-screenshots.js cypress/e2e/capture-screenshots.cy.js

# Execute screenshot capture
npx cypress run --spec "cypress/e2e/capture-screenshots.cy.js" --browser chrome
```

### Method 2: Playwright Screenshot (Alternative)
```bash
# Install Playwright (if preferred over Cypress)
npm install -D @playwright/test

# Create Playwright screenshot script
cat > screenshot-playwright.js << 'EOF'
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set Arabic locale
  await page.addInitScript(() => {
    localStorage.setItem('i18nextLng', 'ar');
    localStorage.setItem('aqlhr-locale', 'ar');
  });
  
  const routes = [
    { path: '/ar/system-overview', filename: 'ar-system-overview-validation.png' },
    { path: '/ar/payroll', filename: 'ar-payroll-numerals.png' },
    { path: '/ar/leave', filename: 'ar-leave-management.png' },
    { path: '/ar/analytics', filename: 'ar-analytics-charts.png' },
    { path: '/ar/executive-center', filename: 'ar-executive-center-rtl.png' }
  ];
  
  for (const route of routes) {
    console.log(`📸 Capturing ${route.path}...`);
    
    await page.goto(`http://localhost:5173${route.path}`);
    await page.waitForTimeout(3000);  // Wait for full load
    
    // Verify RTL
    const dir = await page.getAttribute('html', 'dir');
    console.log(`   Direction: ${dir}`);
    
    // Take screenshot
    await page.screenshot({ 
      path: `cypress/screenshots/${route.filename}`,
      fullPage: true 
    });
    
    console.log(`   ✅ Saved: cypress/screenshots/${route.filename}`);
  }
  
  await browser.close();
  console.log('\n🎉 All screenshots captured successfully!');
})();
EOF

# Run Playwright screenshots
node screenshot-playwright.js
```

## Browser Console Validation Script

### Ready-to-Paste Console Script
```javascript
// 🔍 Copy and paste this entire script into browser console on any /ar/* route
function validateArabicRoute() {
  console.clear();
  console.log('🔍 AqlHR Arabic Route Validation');
  console.log('================================');
  
  const results = {
    currentPath: window.location.pathname,
    issues: [],
    passes: [],
    arabicNumeralCount: 0,
    westernNumeralCount: 0
  };
  
  // 1. Check HTML attributes
  const html = document.documentElement;
  const htmlDir = html.getAttribute('dir');
  const htmlLang = html.getAttribute('lang');
  
  if (htmlDir === 'rtl') {
    results.passes.push('✅ HTML dir="rtl" is set correctly');
  } else {
    results.issues.push(`❌ HTML dir should be "rtl", found: "${htmlDir}"`);
  }
  
  if (htmlLang === 'ar') {
    results.passes.push('✅ HTML lang="ar" is set correctly');
  } else {
    results.issues.push(`❌ HTML lang should be "ar", found: "${htmlLang}"`);
  }
  
  // 2. Check for Arabic text and numerals
  const bodyText = document.body.innerText;
  const arabicNumerals = bodyText.match(/[٠-٩]/g);
  const westernNumerals = bodyText.match(/\b\d+\b/g);
  
  results.arabicNumeralCount = arabicNumerals ? arabicNumerals.length : 0;
  results.westernNumeralCount = westernNumerals ? westernNumerals.length : 0;
  
  // 3. Expected Arabic labels by route
  const expectedLabels = {
    'system-overview': ['نظرة عامة على النظام', 'مركز الذكاء التنفيذي'],
    'payroll': ['الرواتب'],
    'leave': ['إدارة الإجازات'],
    'analytics': ['التحليلات'],
    'executive-center': ['مركز الذكاء التنفيذي'],
    'core-hr': ['الموارد البشرية الأساسية'],
    'compliance': ['الامتثال والحوكمة'],
    'government': ['التكاملات الحكومية']
  };
  
  // Detect route from path
  const routeMatch = window.location.pathname.match(/\/ar\/([^\/]+)/);
  const currentRoute = routeMatch ? routeMatch[1] : null;
  
  if (currentRoute && expectedLabels[currentRoute]) {
    expectedLabels[currentRoute].forEach(label => {
      if (bodyText.includes(label)) {
        results.passes.push(`✅ Arabic label found: "${label}"`);
      } else {
        results.issues.push(`❌ Missing Arabic label: "${label}"`);
      }
    });
  }
  
  // 4. Check for English fallbacks
  const commonEnglishWords = ['Payroll', 'Dashboard', 'System Overview', 'Analytics', 'Leave Management'];
  commonEnglishWords.forEach(word => {
    if (bodyText.includes(word)) {
      results.issues.push(`❌ English fallback detected: "${word}"`);
    }
  });
  
  // 5. Check RTL layout
  const cards = document.querySelectorAll('[class*="card"], .card, [data-testid*="card"]');
  let rtlAlignmentIssues = 0;
  
  cards.forEach(card => {
    const style = getComputedStyle(card);
    if (style.textAlign === 'left' && !style.textAlign.includes('start')) {
      rtlAlignmentIssues++;
    }
  });
  
  if (rtlAlignmentIssues === 0) {
    results.passes.push('✅ Card RTL alignment is correct');
  } else {
    results.issues.push(`❌ ${rtlAlignmentIssues} cards have incorrect RTL alignment`);
  }
  
  // 6. Check for raw i18n keys
  const i18nKeyPattern = /\b[a-zA-Z]+\.[a-zA-Z]+\b/g;
  const possibleKeys = bodyText.match(i18nKeyPattern);
  if (possibleKeys) {
    const suspiciousKeys = possibleKeys.filter(key => 
      !key.includes('@') && !key.includes('http') && key.includes('.')
    );
    if (suspiciousKeys.length > 0) {
      results.issues.push(`❌ Possible raw i18n keys: ${suspiciousKeys.slice(0, 3).join(', ')}`);
    }
  }
  
  // Generate report
  console.log(`📍 Route: ${results.currentPath}`);
  console.log(`🔢 Numerals: ${results.arabicNumeralCount} Arabic-Indic, ${results.westernNumeralCount} Western`);
  
  if (results.westernNumeralCount > 0 && results.currentPath.includes('/ar/')) {
    results.issues.push(`⚠️ ${results.westernNumeralCount} Western numerals found - should be Arabic-Indic`);
  } else if (results.currentPath.includes('/ar/')) {
    results.passes.push('✅ No Western numerals detected on Arabic route');
  }
  
  console.log('\n✅ PASSING VALIDATIONS:');
  results.passes.forEach(pass => console.log(`   ${pass}`));
  
  if (results.issues.length > 0) {
    console.log('\n❌ ISSUES FOUND:');
    results.issues.forEach(issue => console.log(`   ${issue}`));
  } else {
    console.log('\n🎉 ALL VALIDATIONS PASSED!');
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`   Passes: ${results.passes.length}`);
  console.log(`   Issues: ${results.issues.length}`);
  console.log(`   Status: ${results.issues.length === 0 ? '✅ PASS' : '⚠️ NEEDS FIXES'}`);
  
  return results;
}

// Auto-run validation
console.log('🚀 Running Arabic route validation...');
validateArabicRoute();
console.log('\n💡 To run again: validateArabicRoute()');
```

## Execution Checklist

### Before Running:
- [ ] ✅ Node.js 16+ installed
- [ ] ✅ Dependencies installed (`npm install`)
- [ ] ✅ Dev server running (`npm run dev`)
- [ ] ✅ Can access http://localhost:5173/en/system-overview

### Execute Validation:
```bash
# 1. Run full validation pipeline
bash run-final-validation.sh

# 2. Capture screenshots (choose one method)
npx cypress run --spec "cypress/e2e/capture-screenshots.cy.js"
# OR
node screenshot-playwright.js

# 3. Manual validation (paste script in browser console on each /ar/* route)
validateArabicRoute()
```

### After Execution - Expected Artifacts:
- [ ] ✅ `final_validation_report_[timestamp].html` - Main report
- [ ] ✅ 5 screenshot files in `cypress/screenshots/`
- [ ] ✅ JSON test data in `cypress/reports/`
- [ ] ✅ Console validation results from browser

### Final File Locations:
```
📁 Project Root/
├── cypress/
│   ├── reports/
│   │   ├── final_validation_report_20241218_143022.html  ⭐ MAIN REPORT
│   │   └── *.json                                        📊 Test data
│   ├── screenshots/
│   │   ├── ar-system-overview-validation.png             📸 Screenshots
│   │   ├── ar-payroll-numerals.png
│   │   ├── ar-leave-management.png
│   │   ├── ar-analytics-charts.png
│   │   └── ar-executive-center-rtl.png
│   └── videos/                                          🎬 Test recordings
```

## Troubleshooting

### Common Issues:
```bash
# Issue: "Command not found: cypress"
npm install cypress --save-dev

# Issue: "Port 5173 not accessible"  
npm run dev  # Make sure dev server is running

# Issue: "Permission denied"
chmod +x run-final-validation.sh

# Issue: Screenshots not generated
# Check cypress/screenshots/ directory exists:
mkdir -p cypress/screenshots
```

**🎯 Goal Achievement**: After following this guide, you'll have a complete production sign-off package with validated Arabic functionality across all 71 modules.