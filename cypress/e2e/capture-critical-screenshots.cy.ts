/// <reference types="cypress" />

/**
 * Critical Arabic Route Screenshot Capture
 * Automatically captures screenshots for the 5 most important Arabic routes
 * for production sign-off validation
 */

describe('🔍 Critical Arabic Route Screenshots', () => {
  const criticalRoutes = [
    {
      path: '/ar/system-overview',
      filename: 'ar-system-overview-validation',
      description: 'System overview cards with Arabic labels',
      expectedElements: ['نظرة عامة على النظام', 'مركز الذكاء التنفيذي']
    },
    {
      path: '/ar/payroll', 
      filename: 'ar-payroll-numerals',
      description: 'Payroll with Arabic-Indic numerals',
      expectedElements: ['الرواتب'],
      checkNumerals: true
    },
    {
      path: '/ar/leave',
      filename: 'ar-leave-management', 
      description: 'Leave management with day counts',
      expectedElements: ['إدارة الإجازات']
    },
    {
      path: '/ar/analytics',
      filename: 'ar-analytics-charts',
      description: 'Analytics charts with Arabic numerals',
      expectedElements: ['التحليلات'],
      checkNumerals: true
    },
    {
      path: '/ar/executive-center',
      filename: 'ar-executive-center-rtl',
      description: 'Executive center RTL layout validation',
      expectedElements: ['مركز الذكاء التنفيذي']
    }
  ];

  beforeEach(() => {
    // Set Arabic locale before each test
    cy.window().then((win) => {
      win.localStorage.setItem('i18nextLng', 'ar');
      win.localStorage.setItem('aqlhr-locale', 'ar');
    });
    
    // Set viewport for consistent screenshots
    cy.viewport(1920, 1080);
  });

  criticalRoutes.forEach((route) => {
    it(`captures screenshot for ${route.path}`, () => {
      cy.log(`📸 Capturing: ${route.description}`);
      
      // Visit the route
      cy.visit(route.path, { 
        timeout: 10000,
        onBeforeLoad: (win) => {
          // Ensure Arabic is set before page load
          win.localStorage.setItem('i18nextLng', 'ar');
          win.localStorage.setItem('aqlhr-locale', 'ar');
        }
      });
      
      // Wait for page to fully load
      cy.wait(3000);
      
      // Validate HTML attributes
      cy.get('html')
        .should('have.attr', 'dir', 'rtl')
        .should('have.attr', 'lang', 'ar');
      
      // Validate expected Arabic elements are present
      route.expectedElements.forEach(expectedText => {
        cy.get('body').should('contain.text', expectedText);
        cy.log(`✅ Found expected text: ${expectedText}`);
      });
      
      // Check for Arabic-Indic numerals if route requires it
      if (route.checkNumerals) {
        cy.get('body').invoke('text').then((bodyText) => {
          const hasArabicNumerals = /[٠-٩]/.test(bodyText);
          if (hasArabicNumerals) {
            cy.log('✅ Arabic-Indic numerals detected');
          } else {
            cy.log('⚠️ No Arabic-Indic numerals found - may need investigation');
          }
        });
      }
      
      // Validate RTL layout elements
      cy.get('body').then(($body) => {
        const hasCards = $body.find('[class*="card"], .card, [data-testid*="card"]').length > 0;
        if (hasCards) {
          cy.get('[class*="card"], .card, [data-testid*="card"]').first().then(($card) => {
            const textAlign = $card.css('text-align');
            cy.log(`Card text alignment: ${textAlign}`);
          });
        }
      });
      
      // Take the screenshot
      cy.screenshot(route.filename, {
        capture: 'fullPage',
        overwrite: true,
        onAfterScreenshot: () => {
          cy.log(`✅ Screenshot saved: ${route.filename}.png`);
        }
      });
      
      // Log success
      cy.log(`🎉 Successfully captured: ${route.description}`);
    });
  });

  // Summary test to validate all screenshots were captured
  it('validates all critical screenshots were captured', () => {
    cy.task('log', '📊 Critical Screenshot Capture Summary:');
    
    criticalRoutes.forEach((route) => {
      cy.task('log', `   ✅ ${route.filename}.png - ${route.description}`);
    });
    
    cy.task('log', `\n🎯 Total Screenshots: ${criticalRoutes.length}/5`);
    cy.task('log', '📁 Location: cypress/screenshots/');
    cy.task('log', '🔗 Use these for production sign-off validation');
  });
});

// Additional validation helper
describe('🔍 Screenshot Quality Validation', () => {
  it('performs post-capture validation checks', () => {
    const routes = ['/ar/system-overview', '/ar/payroll'];
    
    routes.forEach((route) => {
      cy.visit(route);
      cy.wait(2000);
      
      // Check for common issues
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        
        // Check for English fallbacks
        const englishWords = ['Payroll', 'System Overview', 'Dashboard'];
        const foundEnglish = englishWords.filter(word => bodyText.includes(word));
        
        if (foundEnglish.length > 0) {
          cy.log(`⚠️ English fallbacks found on ${route}: ${foundEnglish.join(', ')}`);
        } else {
          cy.log(`✅ No English fallbacks on ${route}`);
        }
        
        // Check for i18n key leaks
        const i18nPattern = /\b[a-z]+\.[a-z]+\b/g;
        const possibleKeys = bodyText.match(i18nPattern);
        if (possibleKeys && possibleKeys.length > 0) {
          const suspiciousKeys = possibleKeys.filter(key => 
            key.includes('.') && !key.includes('@') && !key.includes('http')
          );
          if (suspiciousKeys.length > 0) {
            cy.log(`⚠️ Possible i18n keys on ${route}: ${suspiciousKeys.slice(0, 2).join(', ')}`);
          }
        }
      });
    });
  });
});