/**
 * Arabic Localization Testing Utilities
 * Helper functions for Arabic-Indic numerals and RTL layout validation
 */

// Arabic-Indic numeral mapping
export const arabicIndicNumerals = {
  '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
  '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
};

// Western to Arabic-Indic conversion
export const convertToArabicIndic = (text: string): string => {
  return text.replace(/[0-9]/g, (digit) => arabicIndicNumerals[digit as keyof typeof arabicIndicNumerals]);
};

// Check if text contains Arabic-Indic numerals
export const hasArabicIndicNumerals = (text: string): boolean => {
  return /[٠-٩]/.test(text);
};

// Check if text contains Western numerals
export const hasWesternNumerals = (text: string): boolean => {
  return /[0-9]/.test(text);
};

// Validate Arabic-Indic numerals in element
export const validateArabicNumerals = (selector: string): Cypress.Chainable => {
  return cy.get(selector).each(($element) => {
    const text = $element.text();
    if (hasWesternNumerals(text)) {
      // Check if this is user-facing numeric content
      const exceptions = [
        'v1', 'v2', 'ID:', 'UUID:', 'http:', 'https:', 
        'data-testid', 'class=', 'id=', 'src=', 'href='
      ];
      const hasException = exceptions.some(exc => text.includes(exc));
      
      if (!hasException) {
        throw new Error(`Element contains Western numerals instead of Arabic-Indic: "${text}"`);
      }
    }
  });
};

// RTL layout validation helpers
export const validateRTLLayout = (selector: string): Cypress.Chainable => {
  return cy.get(selector).should(($element) => {
    const direction = $element.css('direction');
    const textAlign = $element.css('text-align');
    
    // Should have RTL direction or appropriate text alignment
    expect(direction === 'rtl' || textAlign.match(/(right|end|start)/)).to.be.true;
  });
};

// Arabic text validation
export const hasArabicText = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

// Common Arabic UI terms for validation
export const commonArabicTerms = {
  dashboard: 'لوحة التحكم',
  employees: 'الموظفين',
  payroll: 'كشف الراتب',
  attendance: 'الحضور',
  leave: 'الإجازات',
  reports: 'التقارير',
  settings: 'الإعدادات',
  profile: 'الملف الشخصي',
  management: 'الإدارة',
  system: 'النظام'
};

// Validate Arabic translations
export const validateArabicTranslations = (route: string): Cypress.Chainable => {
  return cy.get('body').then(($body) => {
    const bodyText = $body.text();
    
    // Should not contain common English terms
    const englishTerms = ['Dashboard', 'Employee', 'Management', 'System', 'Reports'];
    englishTerms.forEach(term => {
      if (bodyText.includes(term)) {
        throw new Error(`Found English term "${term}" on Arabic route ${route}`);
      }
    });
    
    // Should not contain raw translation keys
    const rawKeyPattern = /\w+\.\w+/g;
    const matches = bodyText.match(rawKeyPattern);
    if (matches) {
      const filteredMatches = matches.filter(match => 
        !match.includes('http') && 
        !match.includes('www') && 
        !match.includes('.com') &&
        !match.includes('.js') &&
        !match.includes('.css')
      );
      
      if (filteredMatches.length > 0) {
        throw new Error(`Found raw translation keys: ${filteredMatches.join(', ')}`);
      }
    }
  });
};

// Screenshot helper for Arabic pages
export const screenshotArabicPage = (name: string): Cypress.Chainable => {
  return cy.screenshot(`arabic-${name}`, {
    capture: 'viewport',
    overwrite: true
  });
};

// Performance measurement for Arabic pages
export const measureArabicPageLoad = (route: string): Cypress.Chainable => {
  const startTime = Date.now();
  
  return cy.visit(route).then(() => {
    const loadTime = Date.now() - startTime;
    cy.log(`Arabic page load time for ${route}: ${loadTime}ms`);
    
    // Log performance metrics
    cy.window().then((win) => {
      if (win.performance && win.performance.timing) {
        const timing = win.performance.timing;
        const totalLoad = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        cy.log(`Total load time: ${totalLoad}ms`);
        cy.log(`DOM ready time: ${domReady}ms`);
      }
    });
    
    return cy.wrap(loadTime);
  });
};

// Language switching helper
export const switchToArabic = (): Cypress.Chainable => {
  return cy.window().then((win) => {
    win.localStorage.setItem('aqlhr.locale', 'ar');
    win.localStorage.setItem('aqlhr-language', 'ar');
    win.document.documentElement.setAttribute('dir', 'rtl');
    win.document.documentElement.setAttribute('lang', 'ar');
  });
};

export const switchToEnglish = (): Cypress.Chainable => {
  return cy.window().then((win) => {
    win.localStorage.setItem('aqlhr.locale', 'en');
    win.localStorage.setItem('aqlhr-language', 'en');
    win.document.documentElement.setAttribute('dir', 'ltr');
    win.document.documentElement.setAttribute('lang', 'en');
  });
};

// Accessibility validation for Arabic content
export const validateArabicAccessibility = (selector: string = 'body'): Cypress.Chainable => {
  return cy.get(selector).should(($element) => {
    // Check for proper lang attributes
    const html = Cypress.$('html');
    expect(html.attr('lang')).to.equal('ar');
    expect(html.attr('dir')).to.equal('rtl');
    
    // Check for proper ARIA labels in Arabic (if present)
    const elementsWithAria = $element.find('[aria-label], [aria-labelledby]');
    elementsWithAria.each((index, el) => {
      const ariaLabel = Cypress.$(el).attr('aria-label');
      if (ariaLabel && hasWesternNumerals(ariaLabel)) {
        cy.log(`Warning: ARIA label contains Western numerals: ${ariaLabel}`);
      }
    });
  });
};

// Custom commands for Cypress
declare global {
  namespace Cypress {
    interface Chainable {
      validateArabicNumerals(selector: string): Chainable<void>;
      validateRTLLayout(selector: string): Chainable<void>;
      validateArabicTranslations(route: string): Chainable<void>;
      screenshotArabicPage(name: string): Chainable<void>;
      measureArabicPageLoad(route: string): Chainable<number>;
      switchToArabic(): Chainable<void>;
      switchToEnglish(): Chainable<void>;
      validateArabicAccessibility(selector?: string): Chainable<void>;
      validateExactArabicLabel(expectedArabic: string, context: string): Chainable<void>;
      checkNumeralCompliance(route: string): Chainable<number>;
    }
  }
}

// Additional utility functions
export const validateExactArabicLabel = (expectedArabic: string, context: string): Cypress.Chainable => {
  return cy.get('body').should('contain.text', expectedArabic).then(() => {
    cy.log(`✅ Found exact Arabic label: "${expectedArabic}" in ${context}`);
  });
};

export const checkNumeralCompliance = (route: string): Cypress.Chainable => {
  return cy.get('body').then(($body) => {
    let violations = 0;
    
    // Check all user-facing numeric content
    const contentSelectors = [
      '[data-testid*="value"]', '[data-testid*="count"]', '[data-testid*="amount"]',
      'h1, h2, h3', 'p', 'span', 'td', '.metric-value', '.kpi-value'
    ];
    
    contentSelectors.forEach(selector => {
      const elements = $body.find(selector);
      elements.each((index, element) => {
        const text = Cypress.$(element).text().trim();
        if (text && /\d/.test(text)) {
          const skipPatterns = [/ID:|v\d|http|class=|data-|aria-/];
          const shouldSkip = skipPatterns.some(pattern => pattern.test(text));
          
          if (!shouldSkip) {
            const hasWesternNumerals = /[0-9]/.test(text);
            const hasArabicNumerals = /[٠-٩]/.test(text);
            
            if (hasWesternNumerals && !hasArabicNumerals) {
              violations++;
              cy.log(`Numeral violation: "${text}" in ${selector}`);
            }
          }
        }
      });
    });
    
    cy.log(`Route ${route}: ${violations} numeral violations detected`);
    return cy.wrap(violations);
  });
};

// Register custom commands
Cypress.Commands.add('validateArabicNumerals', validateArabicNumerals);
Cypress.Commands.add('validateRTLLayout', validateRTLLayout);
Cypress.Commands.add('validateArabicTranslations', validateArabicTranslations);
Cypress.Commands.add('screenshotArabicPage', screenshotArabicPage);
Cypress.Commands.add('measureArabicPageLoad', measureArabicPageLoad);
Cypress.Commands.add('switchToArabic', switchToArabic);
Cypress.Commands.add('switchToEnglish', switchToEnglish);
Cypress.Commands.add('validateArabicAccessibility', validateArabicAccessibility);
Cypress.Commands.add('validateExactArabicLabel', validateExactArabicLabel);
Cypress.Commands.add('checkNumeralCompliance', checkNumeralCompliance);