// Manual Arabic Route Validation Script
// Open browser console and run this script on Arabic pages

function validateArabicRoute() {
  const results = {
    currentPath: window.location.pathname,
    htmlDir: document.documentElement.getAttribute('dir'),
    htmlLang: document.documentElement.getAttribute('lang'),
    arabicNumeralCount: 0,
    westernNumeralCount: 0,
    arabicTextFound: false,
    issues: []
  };

  // Check RTL setup
  if (results.htmlDir !== 'rtl') {
    results.issues.push('❌ HTML dir attribute should be "rtl"');
  }
  if (results.htmlLang !== 'ar') {
    results.issues.push('❌ HTML lang attribute should be "ar"');
  }

  // Check numerals
  const bodyText = document.body.innerText;
  const arabicNumerals = bodyText.match(/[٠-٩]/g);
  const westernNumerals = bodyText.match(/[0-9]/g);
  
  results.arabicNumeralCount = arabicNumerals ? arabicNumerals.length : 0;
  results.westernNumeralCount = westernNumerals ? westernNumerals.length : 0;
  
  // Check for Arabic text
  results.arabicTextFound = /[\u0600-\u06FF]/.test(bodyText);

  // Route-specific validations
  const route = window.location.pathname;
  
  if (route.includes('/ar/system-overview')) {
    const expectedLabels = [
      'نظرة عامة على النظام',
      'مركز الذكاء التنفيذي',
      'الموارد البشرية الأساسية',
      'الامتثال والحوكمة'
    ];
    expectedLabels.forEach(label => {
      if (!bodyText.includes(label)) {
        results.issues.push(`❌ Missing Arabic label: "${label}"`);
      }
    });
  }
  
  if (route.includes('/ar/payroll')) {
    if (!bodyText.includes('الرواتب')) {
      results.issues.push('❌ Missing "الرواتب" (Payroll) in Arabic');
    }
    // Check for salary figures in Arabic numerals
    if (results.westernNumeralCount > results.arabicNumeralCount) {
      results.issues.push('⚠️ More Western numerals than Arabic-Indic numerals found');
    }
  }
  
  if (route.includes('/ar/leave')) {
    if (!bodyText.includes('الإجازات')) {
      results.issues.push('❌ Missing "الإجازات" (Leave) in Arabic');
    }
  }

  // Visual validation
  const cards = document.querySelectorAll('[data-testid*="card"], .card, [class*="card"]');
  let rtlAlignmentIssues = 0;
  cards.forEach(card => {
    const style = getComputedStyle(card);
    if (style.textAlign === 'left' && !style.textAlign.includes('start')) {
      rtlAlignmentIssues++;
    }
  });
  
  if (rtlAlignmentIssues > 0) {
    results.issues.push(`⚠️ ${rtlAlignmentIssues} cards may have incorrect RTL alignment`);
  }

  // Generate report
  console.group('🔍 Arabic Route Validation Report');
  console.log('📍 Route:', results.currentPath);
  console.log('🌐 Language Setup:', {
    dir: results.htmlDir,
    lang: results.htmlLang
  });
  console.log('🔢 Numerals Found:', {
    arabicIndic: results.arabicNumeralCount,
    western: results.westernNumeralCount
  });
  console.log('📝 Arabic Text Present:', results.arabicTextFound ? '✅' : '❌');
  
  if (results.issues.length === 0) {
    console.log('🎉 All validations passed!');
  } else {
    console.log('⚠️ Issues found:');
    results.issues.forEach(issue => console.log('  ', issue));
  }
  console.groupEnd();

  return results;
}

// Auto-run validation
if (window.location.pathname.startsWith('/ar/')) {
  console.log('🧪 Running Arabic route validation...');
  validateArabicRoute();
} else {
  console.log('ℹ️ Navigate to an Arabic route (/ar/*) to run validation');
  console.log('Available commands:');
  console.log('- validateArabicRoute() - Run manual validation');
}

// Make function available globally
window.validateArabicRoute = validateArabicRoute;