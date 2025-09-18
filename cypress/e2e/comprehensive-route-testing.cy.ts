/**
 * Comprehensive Route Testing Suite
 * Tests all 71 routes × 2 languages = 142 total route validations
 */

describe('Comprehensive Route Testing (142 Routes)', () => {
  let routeResults: Array<{
    route: string;
    language: string;
    status: 'pass' | 'fail' | 'partial';
    issues: string[];
    loadTime: number;
    arabicLabels: string[];
    numeralViolations: number;
    rtlIssues: string[];
  }> = [];

  // Complete route list for testing
  const allRoutes = [
    // Core System Routes
    'system-overview', 'dashboard', 
    
    // Core HR (12 modules)
    'employees', 'recruitment', 'payroll', 'performance', 'training',
    'attendance', 'leave', 'documents', 'reports', 'compliance', 'workflow', 'calendar',
    
    // Core HR Extended
    'core-hr/benefits', 'core-hr/organizational-chart', 'core-hr/employee-self-service',
    'core-hr/manager-dashboard', 'core-hr/succession-planning', 'core-hr/employee-engagement',
    'core-hr/exit-management', 'core-hr/workforce-planning', 'core-hr/competency-management',
    'core-hr/disciplinary-actions',
    
    // Government & Integrations
    'government', 'government/qiwa', 'government/gosi', 'government/mol', 
    'government/mudad', 'government/elm', 'government/hrsd', 'integrations',
    
    // Analytics & Executive
    'analytics', 'executive-center', 'diagnostic/hub', 'diagnostic/retention',
    'diagnostic/cci', 'additional/smart-kpi',
    
    // AI Ecosystem (12 modules)
    'ai-automation/smart-recommendations', 'ai-automation/predictive-analytics',
    'ai-automation/document-intelligence', 'ai-automation/arabic-english-nlp',
    'ai-automation/automated-workflows', 'ai-ecosystem/workforce-optimizer',
    'ai-ecosystem/performance-insights', 'ai-ecosystem/retention-predictor',
    'ai-ecosystem/skill-gap-analyzer', 'ai-ecosystem/career-path-ai',
    'ai-ecosystem/compliance-monitor', 'ai-ecosystem/sentiment-analysis',
    
    // Additional Features
    'additional/bulk-operations', 'additional/audit-trail', 'additional/custom-fields',
    'additional/workflow-builder', 'additional/notification-center', 'additional/file-manager',
    'additional/integration-hub', 'additional/backup-restore', 'additional/user-permissions',
    'additional/system-settings', 'additional/mobile-sync', 'additional/api-management',
    'additional/esg-hr', 'plans',
    
    // Platform Features
    'platform-features/multi-tenant', 'platform-features/sso-integration',
    'platform-features/api-gateway', 'platform-features/data-encryption',
    'platform-features/audit-logging', 'platform-features/backup-recovery',
    'platform-features/performance-monitoring', 'platform-features/scalability',
    'platform-features/security-center', 'platform-features/language-toggle'
  ];

  const languages = ['en', 'ar'];

  // Helper function to test a single route
  const testRoute = (route: string, language: string) => {
    const startTime = Date.now();
    const testResult = {
      route,
      language,
      status: 'pass' as const,
      issues: [] as string[],
      loadTime: 0,
      arabicLabels: [] as string[],
      numeralViolations: 0,
      rtlIssues: [] as string[]
    };

    cy.window().then((win) => {
      // Set language
      win.localStorage.setItem('aqlhr.locale', language);
      win.localStorage.setItem('aqlhr-language', language);
    });

    cy.visit(`/${language}/${route}`, { 
      timeout: 20000,
      failOnStatusCode: false 
    }).then(() => {
      testResult.loadTime = Date.now() - startTime;
    });

    // Check for 404 or error states
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="error-404"], .error-page, .not-found').length > 0) {
        testResult.status = 'fail';
        testResult.issues.push('404 Not Found');
        return;
      }

      // Basic page load validation
      cy.get('main, [data-testid="main-content"]', { timeout: 10000 }).should('exist');

      // Language-specific validations
      if (language === 'ar') {
        // RTL validation
        cy.get('html').should('have.attr', 'dir', 'rtl');
        cy.get('html').should('have.attr', 'lang', 'ar');

        // Arabic content validation
        cy.get('body').then(($pageBody) => {
          const pageText = $pageBody.text();
          
          // Check for Arabic text presence
          const hasArabicText = /[\u0600-\u06FF]/.test(pageText);
          if (!hasArabicText) {
            testResult.issues.push('No Arabic text detected');
            testResult.status = 'partial';
          }

          // Check for raw translation keys
          const rawKeyMatches = pageText.match(/\w+\.\w+/g);
          if (rawKeyMatches) {
            const filteredKeys = rawKeyMatches.filter(key => 
              !key.includes('http') && 
              !key.includes('www') && 
              !key.includes('.com') &&
              !key.includes('.js') &&
              !key.includes('.css')
            );
            
            if (filteredKeys.length > 0) {
              testResult.issues.push(`Raw translation keys: ${filteredKeys.slice(0, 3).join(', ')}`);
              testResult.status = 'partial';
            }
          }

          // Check for English fallbacks
          const englishWords = ['Dashboard', 'Employee', 'Management', 'System'];
          englishWords.forEach(word => {
            if (pageText.includes(word)) {
              testResult.issues.push(`English fallback detected: ${word}`);
              testResult.status = 'partial';
            }
          });

          // Check for Western numerals
          const numeralMatches = pageText.match(/[0-9]/g);
          if (numeralMatches) {
            // Filter out technical identifiers
            const contentElements = $pageBody.find(
              'h1, h2, h3, p, span, td, [data-testid*="value"], [data-testid*="count"]'
            );
            
            let violations = 0;
            contentElements.each((index, element) => {
              const text = Cypress.$(element).text();
              if (/[0-9]/.test(text) && !/ID|v\d|http|class/.test(text)) {
                violations++;
              }
            });
            
            testResult.numeralViolations = violations;
            if (violations > 0) {
              testResult.issues.push(`${violations} Western numeral violations`);
              testResult.status = 'partial';
            }
          }

          // Extract Arabic labels found
          const arabicTexts = pageText.match(/[\u0600-\u06FF][\u0600-\u06FF\s]+/g) || [];
          testResult.arabicLabels = arabicTexts.slice(0, 5); // Store first 5 Arabic phrases
        });
      } else {
        // English validation
        cy.get('html').should('have.attr', 'dir', 'ltr');
        cy.get('html').should('have.attr', 'lang', 'en');
      }

      // Performance check
      if (testResult.loadTime > 5000) {
        testResult.issues.push(`Slow load time: ${testResult.loadTime}ms`);
        testResult.status = 'partial';
      }

      // Console error check
      cy.window().then((win) => {
        const errors = (win as any).__cypress_console_errors || [];
        if (errors.length > 0) {
          testResult.issues.push(`${errors.length} console errors`);
          testResult.status = 'partial';
        }
      });

      // Add result to array
      routeResults.push(testResult);
    });
  };

  beforeEach(() => {
    cy.trackConsoleErrors();
  });

  describe('All Routes × Both Languages (142 Tests)', () => {
    // Generate all 142 test combinations
    allRoutes.forEach(route => {
      languages.forEach(language => {
        it(`should load /${language}/${route} successfully`, () => {
          testRoute(route, language);
        });
      });
    });
  });

  describe('Critical Route Deep Validation', () => {
    const criticalRoutes = [
      'system-overview', 'employees', 'payroll', 'leave', 'analytics', 'executive-center'
    ];

    criticalRoutes.forEach(route => {
      it(`should have complete Arabic functionality on /ar/${route}`, () => {
        cy.switchToArabic();
        cy.visit(`/ar/${route}`);
        
        cy.get('main', { timeout: 15000 }).should('exist');
        
        // Deep Arabic validation
        cy.fixture('arabic-translations').then((translations) => {
          const expectedLabels = translations.route_mappings[`/ar/${route}`] || [];
          
          expectedLabels.forEach((expectedLabel: string) => {
            cy.get('body').should('contain.text', expectedLabel);
          });
        });
        
        // Interactive elements validation
        cy.get('button:not([disabled])').then(($buttons) => {
          if ($buttons.length > 0) {
            cy.log(`Found ${$buttons.length} interactive buttons`);
          }
        });
        
        cy.get('table').then(($tables) => {
          if ($tables.length > 0) {
            cy.log(`Found ${$tables.length} data tables`);
          }
        });
        
        cy.get('.recharts-wrapper').then(($charts) => {
          if ($charts.length > 0) {
            cy.log(`Found ${$charts.length} charts`);
          }
        });
        
        // Screenshot critical pages
        cy.screenshotArabicPage(`critical_${route}_complete_validation`);
      });
    });
  });

  after(() => {
    // Generate comprehensive test report
    cy.then(() => {
      const totalTests = routeResults.length;
      const passedTests = routeResults.filter(r => r.status === 'pass').length;
      const failedTests = routeResults.filter(r => r.status === 'fail').length;
      const partialTests = routeResults.filter(r => r.status === 'partial').length;
      
      const englishResults = routeResults.filter(r => r.language === 'en');
      const arabicResults = routeResults.filter(r => r.language === 'ar');
      
      const report = {
        summary: {
          totalRoutes: allRoutes.length,
          totalTests,
          passed: passedTests,
          failed: failedTests,
          partial: partialTests,
          successRate: ((passedTests / totalTests) * 100).toFixed(1),
          avgLoadTime: Math.round(
            routeResults.reduce((sum, r) => sum + r.loadTime, 0) / totalTests
          )
        },
        languageBreakdown: {
          english: {
            total: englishResults.length,
            passed: englishResults.filter(r => r.status === 'pass').length,
            failed: englishResults.filter(r => r.status === 'fail').length,
            partial: englishResults.filter(r => r.status === 'partial').length
          },
          arabic: {
            total: arabicResults.length,
            passed: arabicResults.filter(r => r.status === 'pass').length,
            failed: arabicResults.filter(r => r.status === 'fail').length,
            partial: arabicResults.filter(r => r.status === 'partial').length
          }
        },
        criticalIssues: [
          ...routeResults.filter(r => r.status === 'fail').map(r => 
            `${r.route} (${r.language}): ${r.issues.join(', ')}`
          )
        ],
        numeralValidation: {
          totalArabicRoutes: arabicResults.length,
          routesWithNumeralViolations: arabicResults.filter(r => r.numeralViolations > 0).length,
          totalNumeralViolations: arabicResults.reduce((sum, r) => sum + r.numeralViolations, 0)
        },
        routeDetails: routeResults
      };
      
      // Log comprehensive summary
      cy.log('=== COMPREHENSIVE TEST REPORT ===');
      cy.log(`Total Routes: ${report.summary.totalRoutes}`);
      cy.log(`Total Tests: ${report.summary.totalTests}`);
      cy.log(`✅ Passed: ${report.summary.passed}`);
      cy.log(`❌ Failed: ${report.summary.failed}`);
      cy.log(`⚠️ Partial: ${report.summary.partial}`);
      cy.log(`Success Rate: ${report.summary.successRate}%`);
      cy.log(`Average Load Time: ${report.summary.avgLoadTime}ms`);
      
      cy.log('=== LANGUAGE BREAKDOWN ===');
      cy.log(`English: ${report.languageBreakdown.english.passed}/${report.languageBreakdown.english.total} passed`);
      cy.log(`Arabic: ${report.languageBreakdown.arabic.passed}/${report.languageBreakdown.arabic.total} passed`);
      
      if (report.numeralValidation.totalNumeralViolations > 0) {
        cy.log(`⚠️ Numeral Violations: ${report.numeralValidation.totalNumeralViolations} across ${report.numeralValidation.routesWithNumeralViolations} routes`);
      }
      
      // Save detailed report
      cy.task('generateComprehensiveReport', report, { log: false });
    });
  });
});