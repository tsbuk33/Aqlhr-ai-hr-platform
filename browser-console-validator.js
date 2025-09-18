// 🔍 Complete Arabic Route Validator
// Copy and paste this ENTIRE script into browser console on any /ar/* route

// Enhanced validation with detailed reporting
function validateArabicRoute() {
  console.clear();
  console.log(`
🔍 AqlHR Arabic Route Validation Tool
=====================================
Route: ${window.location.pathname}
Time: ${new Date().toLocaleString()}
  `);

  const results = {
    currentPath: window.location.pathname,
    timestamp: new Date().toISOString(),
    passes: [],
    warnings: [],
    failures: [],
    arabicNumeralCount: 0,
    westernNumeralCount: 0,
    arabicTextFound: false,
    expectedLabels: {},
    actualLabels: []
  };

  // ==========================================
  // 1. HTML ATTRIBUTES VALIDATION
  // ==========================================
  console.log('1️⃣ Validating HTML attributes...');
  
  const html = document.documentElement;
  const htmlDir = html.getAttribute('dir');
  const htmlLang = html.getAttribute('lang');
  
  if (htmlDir === 'rtl') {
    results.passes.push('HTML dir="rtl" correctly set');
    console.log('   ✅ dir="rtl" ✓');
  } else {
    results.failures.push(`HTML dir should be "rtl", found: "${htmlDir || 'none'}"`);
    console.log(`   ❌ dir="${htmlDir || 'none'}" ✗`);
  }
  
  if (htmlLang === 'ar') {
    results.passes.push('HTML lang="ar" correctly set');
    console.log('   ✅ lang="ar" ✓');
  } else {
    results.failures.push(`HTML lang should be "ar", found: "${htmlLang || 'none'}"`);
    console.log(`   ❌ lang="${htmlLang || 'none'}" ✗`);
  }

  // ==========================================
  // 2. ARABIC TEXT & NUMERALS DETECTION
  // ==========================================
  console.log('\n2️⃣ Analyzing text content...');
  
  const bodyText = document.body.innerText;
  
  // Check for Arabic characters
  results.arabicTextFound = /[\u0600-\u06FF]/.test(bodyText);
  if (results.arabicTextFound) {
    results.passes.push('Arabic text detected in content');
    console.log('   ✅ Arabic text found ✓');
  } else {
    results.failures.push('No Arabic text detected on Arabic route');
    console.log('   ❌ No Arabic text found ✗');
  }
  
  // Count numerals
  const arabicNumerals = bodyText.match(/[٠-٩]/g);
  const westernNumerals = bodyText.match(/\b\d+\b/g);
  
  results.arabicNumeralCount = arabicNumerals ? arabicNumerals.length : 0;
  results.westernNumeralCount = westernNumerals ? westernNumerals.length : 0;
  
  console.log(`   📊 Arabic-Indic numerals: ${results.arabicNumeralCount}`);
  console.log(`   📊 Western numerals: ${results.westernNumeralCount}`);
  
  // Numeral validation for Arabic routes
  if (window.location.pathname.includes('/ar/')) {
    if (results.westernNumeralCount > results.arabicNumeralCount && results.westernNumeralCount > 3) {
      results.warnings.push(`${results.westernNumeralCount} Western numerals found - should be Arabic-Indic (٠١٢٣٤٥٦٧٨٩)`);
      console.log('   ⚠️ Too many Western numerals detected');
    } else if (results.arabicNumeralCount > 0) {
      results.passes.push(`${results.arabicNumeralCount} Arabic-Indic numerals correctly used`);
      console.log('   ✅ Arabic-Indic numerals in use ✓');
    }
  }

  // ==========================================
  // 3. EXPECTED ARABIC LABELS VALIDATION
  // ==========================================
  console.log('\n3️⃣ Validating expected Arabic labels...');
  
  // Route-specific expected labels
  const routeLabels = {
    'system-overview': {
      required: ['نظرة عامة على النظام'],
      optional: ['مركز الذكاء التنفيذي', 'الموارد البشرية الأساسية', 'الامتثال والحوكمة']
    },
    'payroll': {
      required: ['الرواتب'],
      optional: ['معالجة الرواتب', 'الراتب', 'الموظفين']
    },
    'leave': {
      required: ['إدارة الإجازات'],
      optional: ['الإجازات', 'أيام', 'رصيد']
    },
    'analytics': {
      required: ['التحليلات'],
      optional: ['تحليل', 'إحصائيات', 'تقارير']
    },
    'executive-center': {
      required: ['مركز الذكاء التنفيذي'],
      optional: ['المؤشرات', 'الذكاء', 'التنفيذي']
    },
    'core-hr': {
      required: ['الموارد البشرية الأساسية'],
      optional: ['الموارد البشرية', 'إدارة الموظفين']
    },
    'compliance': {
      required: ['الامتثال والحوكمة'],
      optional: ['الامتثال', 'الحوكمة', 'اللوائح']
    },
    'government': {
      required: ['التكاملات الحكومية'],
      optional: ['الحكومية', 'التكاملات', 'قوى']
    }
  };
  
  // Detect current route
  const routeMatch = window.location.pathname.match(/\/ar\/([^\/]+)/);
  const currentRoute = routeMatch ? routeMatch[1] : null;
  
  if (currentRoute && routeLabels[currentRoute]) {
    const labels = routeLabels[currentRoute];
    results.expectedLabels = labels;
    
    console.log(`   🎯 Route detected: ${currentRoute}`);
    
    // Check required labels
    labels.required.forEach(label => {
      if (bodyText.includes(label)) {
        results.passes.push(`Required Arabic label found: "${label}"`);
        results.actualLabels.push(label);
        console.log(`   ✅ Required: "${label}" ✓`);
      } else {
        results.failures.push(`Missing required Arabic label: "${label}"`);
        console.log(`   ❌ Missing: "${label}" ✗`);
      }
    });
    
    // Check optional labels
    let optionalFound = 0;
    labels.optional.forEach(label => {
      if (bodyText.includes(label)) {
        results.passes.push(`Optional Arabic label found: "${label}"`);
        results.actualLabels.push(label);
        optionalFound++;
        console.log(`   ✅ Optional: "${label}" ✓`);
      }
    });
    
    if (optionalFound > 0) {
      console.log(`   📊 ${optionalFound}/${labels.optional.length} optional labels found`);
    }
  } else {
    console.log('   ℹ️ Route not in predefined list - skipping specific label validation');
  }

  // ==========================================
  // 4. ENGLISH FALLBACK DETECTION
  // ==========================================
  console.log('\n4️⃣ Checking for English fallbacks...');
  
  const commonEnglishWords = [
    'Payroll', 'Dashboard', 'System Overview', 'Analytics', 'Leave Management',
    'Executive Center', 'Core HR', 'Compliance', 'Government', 'Employee',
    'Management', 'Processing', 'Administration'
  ];
  
  let englishFallbacksFound = [];
  commonEnglishWords.forEach(word => {
    if (bodyText.includes(word)) {
      englishFallbacksFound.push(word);
    }
  });
  
  if (englishFallbacksFound.length > 0) {
    results.warnings.push(`English fallbacks detected: ${englishFallbacksFound.join(', ')}`);
    console.log(`   ⚠️ English words found: ${englishFallbacksFound.join(', ')}`);
  } else {
    results.passes.push('No English fallbacks detected');
    console.log('   ✅ No English fallbacks ✓');
  }

  // ==========================================
  // 5. I18N KEY LEAKS DETECTION
  // ==========================================
  console.log('\n5️⃣ Checking for i18n key leaks...');
  
  const i18nKeyPattern = /\b[a-zA-Z]+\.[a-zA-Z]+\b/g;
  const possibleKeys = bodyText.match(i18nKeyPattern) || [];
  
  // Filter out false positives
  const suspiciousKeys = possibleKeys.filter(key => 
    key.includes('.') && 
    !key.includes('@') && 
    !key.includes('http') && 
    !key.includes('www') &&
    !key.includes('.com') &&
    !key.includes('.org') &&
    key.length < 30
  );
  
  if (suspiciousKeys.length > 0) {
    results.warnings.push(`Possible i18n key leaks: ${suspiciousKeys.slice(0, 3).join(', ')}`);
    console.log(`   ⚠️ Possible keys: ${suspiciousKeys.slice(0, 3).join(', ')}`);
  } else {
    results.passes.push('No i18n key leaks detected');
    console.log('   ✅ No i18n key leaks ✓');
  }

  // ==========================================
  // 6. RTL LAYOUT VALIDATION
  // ==========================================
  console.log('\n6️⃣ Validating RTL layout...');
  
  // Check cards alignment
  const cards = document.querySelectorAll('[class*="card"], .card, [data-testid*="card"], .metric, .summary-card');
  let rtlAlignmentIssues = 0;
  let totalCards = cards.length;
  
  cards.forEach((card, index) => {
    const style = getComputedStyle(card);
    const textAlign = style.textAlign;
    const direction = style.direction;
    
    // Check if card has explicit left alignment (bad for RTL)
    if (textAlign === 'left' && direction !== 'ltr') {
      rtlAlignmentIssues++;
    }
  });
  
  if (totalCards > 0) {
    console.log(`   📊 Cards analyzed: ${totalCards}`);
    if (rtlAlignmentIssues === 0) {
      results.passes.push(`All ${totalCards} cards have correct RTL alignment`);
      console.log('   ✅ Card RTL alignment correct ✓');
    } else {
      results.warnings.push(`${rtlAlignmentIssues}/${totalCards} cards have RTL alignment issues`);
      console.log(`   ⚠️ ${rtlAlignmentIssues} cards with alignment issues`);
    }
  } else {
    console.log('   ℹ️ No cards found to analyze');
  }
  
  // Check grid layout
  const grids = document.querySelectorAll('[class*="grid"]');
  if (grids.length > 0) {
    console.log(`   📊 Grid layouts found: ${grids.length}`);
    results.passes.push(`${grids.length} grid layouts detected`);
  }

  // ==========================================
  // 7. GENERATE FINAL REPORT
  // ==========================================
  console.log('\n' + '='.repeat(50));
  console.log('📊 VALIDATION SUMMARY REPORT');
  console.log('='.repeat(50));
  
  // Calculate score
  const totalChecks = results.passes.length + results.warnings.length + results.failures.length;
  const score = Math.round((results.passes.length / totalChecks) * 100) || 0;
  
  console.log(`\n🎯 Overall Score: ${score}% (${results.passes.length}/${totalChecks} checks passed)`);
  
  // Status determination
  let status = '❌ FAIL';
  let statusColor = 'color: red; font-weight: bold;';
  
  if (results.failures.length === 0 && results.warnings.length <= 1) {
    status = '✅ PASS';
    statusColor = 'color: green; font-weight: bold;';
  } else if (results.failures.length <= 1) {
    status = '⚠️ PARTIAL';
    statusColor = 'color: orange; font-weight: bold;';
  }
  
  console.log(`%c${status}`, statusColor);
  
  // Detailed breakdown
  if (results.passes.length > 0) {
    console.log(`\n✅ PASSES (${results.passes.length}):`);
    results.passes.forEach(pass => console.log(`   • ${pass}`));
  }
  
  if (results.warnings.length > 0) {
    console.log(`\n⚠️ WARNINGS (${results.warnings.length}):`);
    results.warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  if (results.failures.length > 0) {
    console.log(`\n❌ FAILURES (${results.failures.length}):`);
    results.failures.forEach(failure => console.log(`   • ${failure}`));
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (results.failures.length > 0) {
    console.log('   1. Fix critical failures first (missing Arabic labels, HTML attributes)');
  }
  if (results.warnings.length > 0) {
    console.log('   2. Address warnings for better compliance (numerals, English fallbacks)');
  }
  if (results.failures.length === 0 && results.warnings.length === 0) {
    console.log('   🎉 Perfect! This route is ready for production.');
  }
  
  console.log('\n🔄 To run again: validateArabicRoute()');
  console.log('📋 Test other routes: navigate to /ar/payroll, /ar/analytics, etc.');
  
  return results;
}

// Auto-run on load
if (window.location.pathname.includes('/ar/')) {
  console.log('🚀 Auto-running Arabic validation...');
  setTimeout(() => {
    validateArabicRoute();
  }, 1000);
} else {
  console.log('ℹ️ Navigate to an Arabic route (/ar/*) to run validation');
  console.log('💡 Available: validateArabicRoute()');
}

// Make function globally available
window.validateArabicRoute = validateArabicRoute;

// Export for programmatic use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateArabicRoute };
}