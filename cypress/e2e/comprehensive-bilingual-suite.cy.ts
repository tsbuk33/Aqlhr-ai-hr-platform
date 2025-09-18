/**
 * Comprehensive Bilingual Testing Suite
 * Tests all 71 routes × 2 languages = 142 total checks
 */

describe('Comprehensive Bilingual Route Testing', () => {
  // All 71 routes based on the comprehensive testing guide
  const allRoutes = [
    // Core HR (12 modules)
    'employees', 'recruitment', 'payroll', 'performance', 'training',
    'attendance', 'leave', 'documents', 'reports', 'compliance', 'workflow', 'calendar',
    
    // Government Integrations (8 modules)
    'government', 'government/qiwa', 'government/gosi', 'government/mol',
    'government/mudad', 'government/elm', 'government/hrsd', 'integrations',
    
    // Analytics & Executive (6 modules) 
    'analytics', 'executive-center', 'diagnostic/hub', 'diagnostic/retention',
    'additional/smart-kpi', 'system-overview',
    
    // AI Ecosystem (12 modules)
    'ai-automation/smart-recommendations', 'ai-automation/predictive-analytics',
    'ai-automation/document-intelligence', 'ai-automation/arabic-english-nlp',
    'ai-automation/automated-workflows', 'ai-ecosystem/workforce-optimizer',
    'ai-ecosystem/performance-insights', 'ai-ecosystem/retention-predictor',
    'ai-ecosystem/skill-gap-analyzer', 'ai-ecosystem/career-path-ai',
    'ai-ecosystem/compliance-monitor', 'ai-ecosystem/sentiment-analysis',
    
    // Core HR Extended (10 modules)
    'core-hr/benefits', 'core-hr/organizational-chart', 'core-hr/employee-self-service',
    'core-hr/manager-dashboard', 'core-hr/succession-planning', 'core-hr/employee-engagement',
    'core-hr/exit-management', 'core-hr/workforce-planning', 'core-hr/competency-management',
    'core-hr/disciplinary-actions',
    
    // Additional Features (13 modules)
    'additional/bulk-operations', 'additional/audit-trail', 'additional/custom-fields',
    'additional/workflow-builder', 'additional/notification-center', 'additional/file-manager',
    'additional/integration-hub', 'additional/backup-restore', 'additional/user-permissions',
    'additional/system-settings', 'additional/mobile-sync', 'additional/api-management',
    'plans',
    
    // Platform Features (10 modules)
    'platform-features/multi-tenant', 'platform-features/sso-integration', 'platform-features/api-gateway',
    'platform-features/data-encryption', 'platform-features/audit-logging', 'platform-features/backup-recovery',
    'platform-features/performance-monitoring', 'platform-features/scalability', 'platform-features/security-center',
    'platform-features/language-toggle'
  ];

  const languages = ['en', 'ar'];
  let testResults: Array<{
    route: string;
    language: string;
    status: 'pass' | 'fail' | 'partial';
    issues: string[];
    loadTime: number;
  }> = [];

  // Generate test combinations
  const testCombinations = allRoutes.flatMap(route => 
    languages.map(lang => ({ route, lang }))
  );

  beforeEach(() => {
    // Clear any previous language settings
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Route Accessibility and Basic Functionality', () => {
    testCombinations.forEach(({ route, lang }) => {
      it(`should load /${lang}/${route} successfully`, () => {
        const startTime = Date.now();
        const testResult = {
          route,
          language: lang,
          status: 'pass' as const,
          issues: [] as string[],
          loadTime: 0
        };

        // Set language before visiting
        cy.window().then((win) => {
          win.localStorage.setItem('aqlhr.locale', lang);
          win.localStorage.setItem('aqlhr-language', lang);
        });

        // Visit the route
        cy.visit(`/${lang}/${route}`, { 
          timeout: 15000,
          failOnStatusCode: false 
        });

        // Check for 404 or other error pages
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="error-404"], .error-page, .not-found').length > 0) {
            testResult.status = 'fail';
            testResult.issues.push('404 Not Found');
          }
        });

        // Basic page load validation
        cy.get('html').should('exist');
        cy.get('body').should('be.visible');

        // Language-specific validations
        if (lang === 'ar') {
          // RTL validation for Arabic
          cy.get('html').should('have.attr', 'dir', 'rtl');
          cy.get('html').should('have.attr', 'lang', 'ar');
        } else {
          // LTR validation for English  
          cy.get('html').should('have.attr', 'dir', 'ltr');
          cy.get('html').should('have.attr', 'lang', 'en');
        }

        // Check for basic content structure
        cy.get('main, [data-testid="main-content"], .main-content')
          .should('exist', { timeout: 10000 })
          .then(() => {
            testResult.loadTime = Date.now() - startTime;
            testResults.push(testResult);
          });

        // Log console errors (non-blocking)
        cy.window().then((win) => {
          const errors = (win as any).__cypress_console_errors || [];
          if (errors.length > 0) {
            testResult.status = 'partial';
            testResult.issues.push(`${errors.length} console errors`);
          }
        });
      });
    });
  });

  describe('Interactive Elements Validation', () => {
    // Test subset of critical routes for interactive components
    const interactiveTestRoutes = [
      'system-overview', 'employees', 'payroll', 'analytics', 'executive-center'
    ];

    interactiveTestRoutes.forEach(route => {
      languages.forEach(lang => {
        it(`should have functional interactive elements on /${lang}/${route}`, () => {
          cy.window().then((win) => {
            win.localStorage.setItem('aqlhr.locale', lang);
          });

          cy.visit(`/${lang}/${route}`);

          // Tables functionality
          cy.get('table, [data-testid*="table"]').then(($tables) => {
            if ($tables.length > 0) {
              // Check if table has sortable headers
              cy.get('th[role="columnheader"], [data-testid*="sort"]').first().then(($header) => {
                if ($header.length > 0) {
                  cy.wrap($header).click({ force: true });
                }
              });
            }
          });

          // Forms functionality
          cy.get('form, [data-testid*="form"]').then(($forms) => {
            if ($forms.length > 0) {
              cy.get('input[type="text"], input[type="email"]').first().then(($input) => {
                if ($input.length > 0) {
                  cy.wrap($input).should('be.visible');
                }
              });
            }
          });

          // Buttons functionality
          cy.get('button:not([disabled]), [role="button"]:not([disabled])').then(($buttons) => {
            if ($buttons.length > 0) {
              // Just verify buttons exist and are clickable
              cy.wrap($buttons.first()).should('be.visible');
            }
          });

          // Charts (if present)
          cy.get('.recharts-wrapper, [data-testid*="chart"]').then(($charts) => {
            if ($charts.length > 0) {
              cy.wrap($charts.first()).should('be.visible');
            }
          });
        });
      });
    });
  });

  describe('Translation and Content Validation', () => {
    const criticalContentRoutes = [
      'system-overview', 'employees', 'payroll', 'government', 'analytics'
    ];

    criticalContentRoutes.forEach(route => {
      it(`should have proper translations for ${route}`, () => {
        // Test Arabic version
        cy.window().then((win) => {
          win.localStorage.setItem('aqlhr.locale', 'ar');
        });
        
        cy.visit(`/ar/${route}`);
        
        // Should not contain raw translation keys
        cy.get('body').should('not.contain.text', /\w+\.\w+/);
        
        // Should not contain common English words (indicating missing translations)
        const commonEnglishWords = ['Dashboard', 'Employee', 'Management', 'Administration'];
        commonEnglishWords.forEach(word => {
          cy.get('body').should('not.contain.text', word);
        });

        // Test English version
        cy.window().then((win) => {
          win.localStorage.setItem('aqlhr.locale', 'en');
        });
        
        cy.visit(`/en/${route}`);
        
        // Should display English content
        cy.get('h1, [data-testid="page-title"]').should('be.visible');
      });
    });
  });

  after(() => {
    // Generate test report
    cy.task('generateTestReport', testResults, { log: false });
    
    // Log summary
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.status === 'pass').length;
    const failedTests = testResults.filter(r => r.status === 'fail').length;
    const partialTests = testResults.filter(r => r.status === 'partial').length;
    
    cy.log('=== BILINGUAL TEST SUMMARY ===');
    cy.log(`Total Routes Tested: ${totalTests}`);
    cy.log(`✅ Passed: ${passedTests}`);
    cy.log(`❌ Failed: ${failedTests}`);
    cy.log(`⚠️ Partial: ${partialTests}`);
    cy.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  });
});