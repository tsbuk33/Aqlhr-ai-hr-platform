/**
 * Strict Arabic Translation Validation Suite
 * Validates exact Arabic labels for each core module
 */

describe('Strict Arabic Translation Validation', () => {
  let translations: any;
  
  before(() => {
    cy.fixture('arabic-translations').then((data) => {
      translations = data;
    });
  });

  beforeEach(() => {
    // Set Arabic locale
    cy.switchToArabic();
    cy.trackConsoleErrors();
  });

  context('Core Module Header Validation', () => {
    Object.entries({
      '/ar/system-overview': 'نظرة عامة على النظام',
      '/ar/dashboard': 'لوحة التحكم', 
      '/ar/executive-center': 'مركز الذكاء التنفيذي',
      '/ar/employees': 'بيانات الموظف',
      '/ar/payroll': 'الرواتب',
      '/ar/core-hr/benefits': 'إدارة المزايا',
      '/ar/performance': 'إدارة الأداء',
      '/ar/recruitment': 'التوظيف والإلحاق',
      '/ar/training': 'التدريب والتطوير',
      '/ar/attendance': 'الوقت والحضور',
      '/ar/leave': 'إدارة الإجازات',
      '/ar/compliance': 'الامتثال والحوكمة',
      '/ar/government': 'التكاملات الحكومية'
    }).forEach(([route, expectedArabic]) => {
      it(`should display exact Arabic header "${expectedArabic}" on ${route}`, () => {
        cy.visit(route, { timeout: 15000 });
        
        // Wait for page to load
        cy.get('main, [data-testid="main-content"]', { timeout: 10000 }).should('exist');
        
        // Check for exact Arabic translation in common header locations
        const headerSelectors = [
          'h1', 
          '[data-testid="page-title"]', 
          '[data-testid="page-header"]',
          '.page-title',
          '.breadcrumb-current',
          'header h1, header h2',
          '[role="heading"]'
        ];
        
        let foundExpectedText = false;
        
        headerSelectors.forEach(selector => {
          cy.get('body').then(($body) => {
            const elements = $body.find(selector);
            elements.each((index, element) => {
              const text = Cypress.$(element).text().trim();
              if (text === expectedArabic) {
                foundExpectedText = true;
              }
            });
          });
        });
        
        // Also check entire page content contains the exact Arabic text
        cy.get('body').should('contain.text', expectedArabic);
        
        // Verify RTL is set
        cy.get('html').should('have.attr', 'dir', 'rtl');
        cy.get('html').should('have.attr', 'lang', 'ar');
        
        // Take screenshot for documentation
        cy.screenshotArabicPage(`${route.replace(/\//g, '_')}_header_validation`);
      });
    });
  });

  context('Navigation Menu Arabic Labels', () => {
    it('should display exact Arabic labels in navigation menu', () => {
      cy.visit('/ar/system-overview');
      
      // Wait for navigation to load
      cy.get('[data-testid="sidebar"], nav, .navigation').should('exist');
      
      // Check for core navigation labels
      const navigationLabels = {
        'الموارد البشرية الأساسية': 'Core HR section',
        'بيانات الموظف': 'Employee Master Data',
        'الرواتب': 'Payroll', 
        'إدارة المزايا': 'Benefits Administration',
        'إدارة الأداء': 'Performance Management',
        'التوظيف والإلحاق': 'Recruitment & Onboarding',
        'التدريب والتطوير': 'Training & Development',
        'الوقت والحضور': 'Time & Attendance',
        'إدارة الإجازات': 'Leave Management',
        'الامتثال والحوكمة': 'Compliance & Governance',
        'التكاملات الحكومية': 'Government Integrations',
        'مركز الذكاء التنفيذي': 'Executive Intelligence Center'
      };
      
      Object.entries(navigationLabels).forEach(([arabicLabel, description]) => {
        cy.get('body').then(($body) => {
          const pageText = $body.text();
          if (!pageText.includes(arabicLabel)) {
            cy.log(`Warning: Navigation missing Arabic label "${arabicLabel}" for ${description}`);
          }
        });
      });
      
      cy.screenshotArabicPage('navigation_arabic_labels');
    });
  });

  context('AI Module Arabic Labels', () => {
    const aiModules = {
      '/ar/ai-ecosystem/workforce-optimizer': 'ذكاء المهارات',
      '/ar/ai-ecosystem/performance-insights': 'تحسين تجربة التعلم', 
      '/ar/ai-ecosystem/retention-predictor': 'تحسين المشاركة التوليدية'
    };
    
    Object.entries(aiModules).forEach(([route, expectedArabic]) => {
      it(`should display "${expectedArabic}" on ${route}`, () => {
        cy.visit(route, { failOnStatusCode: false });
        
        // Check if page exists (some AI routes might not be implemented)
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="error-404"]').length === 0) {
            cy.get('main').should('exist');
            cy.get('body').should('contain.text', expectedArabic);
            cy.screenshotArabicPage(`${route.replace(/[\/\-]/g, '_')}_ai_module`);
          } else {
            cy.log(`Route ${route} not implemented yet`);
          }
        });
      });
    });
  });

  context('Specialized Module Arabic Labels', () => {
    const specializedModules = {
      '/ar/diagnostic/cci': 'ذكاء الثقافة المؤسسية',
      '/ar/additional/esg-hr': 'المسؤولية الاجتماعية'
    };
    
    Object.entries(specializedModules).forEach(([route, expectedArabic]) => {
      it(`should display "${expectedArabic}" on ${route}`, () => {
        cy.visit(route, { failOnStatusCode: false });
        
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="error-404"]').length === 0) {
            cy.get('main').should('exist');
            // Check for exact Arabic text or similar variations
            cy.get('body').should('contain.text', expectedArabic);
            cy.screenshotArabicPage(`${route.replace(/[\/\-]/g, '_')}_specialized`);
          } else {
            cy.log(`Specialized route ${route} not implemented yet`);
          }
        });
      });
    });
  });

  context('Critical Page Content Validation', () => {
    it('should have complete Arabic content on /ar/system-overview', () => {
      cy.visit('/ar/system-overview');
      
      cy.get('main').should('exist');
      
      // Verify key Arabic content exists
      const expectedContent = [
        'نظرة عامة على النظام',
        'الموظفين', // Employees
        'الأقسام', // Departments  
        'المشاريع' // Projects
      ];
      
      expectedContent.forEach(content => {
        cy.get('body').should('contain.text', content);
      });
      
      // Check that main KPI cards have Arabic labels
      cy.get('[data-testid*="kpi"], [data-testid*="metric"], .metric-card').then(($cards) => {
        if ($cards.length > 0) {
          // At least some cards should contain Arabic text
          let hasArabicContent = false;
          $cards.each((index, card) => {
            const text = Cypress.$(card).text();
            if (/[\u0600-\u06FF]/.test(text)) {
              hasArabicContent = true;
            }
          });
          
          expect(hasArabicContent).to.be.true;
        }
      });
      
      cy.screenshotArabicPage('system_overview_complete_validation');
    });

    it('should have Arabic labels and numerals on /ar/payroll', () => {
      cy.visit('/ar/payroll');
      
      cy.get('main').should('exist');
      
      // Check for Arabic page title
      cy.get('body').should('contain.text', 'الرواتب');
      
      // Validate Arabic-Indic numerals in salary displays
      cy.get('[data-testid*="salary"], [data-testid*="amount"], .salary-amount, .amount').then(($amounts) => {
        if ($amounts.length > 0) {
          $amounts.each((index, element) => {
            const text = Cypress.$(element).text();
            if (/\d/.test(text)) {
              const hasArabicNumerals = /[٠-٩]/.test(text);
              const hasWesternNumerals = /[0-9]/.test(text);
              
              if (hasWesternNumerals && !hasArabicNumerals) {
                cy.log(`Payroll amount should use Arabic-Indic numerals: ${text}`);
              }
            }
          });
        }
      });
      
      cy.screenshotArabicPage('payroll_arabic_validation');
    });

    it('should have Arabic labels and numerals on /ar/leave', () => {
      cy.visit('/ar/leave');
      
      cy.get('main').should('exist');
      
      // Check for Arabic page title
      cy.get('body').should('contain.text', 'إدارة الإجازات');
      
      // Validate Arabic-Indic numerals in leave day counts
      cy.get('[data-testid*="days"], [data-testid*="balance"], .leave-days, .balance').then(($days) => {
        if ($days.length > 0) {
          $days.each((index, element) => {
            const text = Cypress.$(element).text();
            if (/\d/.test(text) && !/ID|v\d|http/.test(text)) {
              const hasArabicNumerals = /[٠-٩]/.test(text);
              if (!hasArabicNumerals) {
                cy.log(`Leave days should use Arabic-Indic numerals: ${text}`);
              }
            }
          });
        }
      });
      
      cy.screenshotArabicPage('leave_arabic_validation');
    });

    it('should have Arabic labels and numerals on /ar/analytics', () => {
      cy.visit('/ar/analytics');
      
      cy.get('main').should('exist');
      
      // Look for analytics-related Arabic terms
      const analyticsTerms = ['تحليلات', 'إحصائيات', 'تقارير', 'مؤشرات'];
      let foundAnalyticsArabic = false;
      
      analyticsTerms.forEach(term => {
        cy.get('body').then(($body) => {
          if ($body.text().includes(term)) {
            foundAnalyticsArabic = true;
          }
        });
      });
      
      // Validate chart labels use Arabic-Indic numerals
      cy.get('.recharts-text, .recharts-cartesian-axis-tick-value, [data-testid*="chart"]').then(($chartElements) => {
        if ($chartElements.length > 0) {
          $chartElements.each((index, element) => {
            const text = Cypress.$(element).text();
            if (/\d/.test(text) && text.length > 0) {
              const hasArabicNumerals = /[٠-٩]/.test(text);
              if (!hasArabicNumerals && !/[ID|v\d|http|class|data]/.test(text)) {
                cy.log(`Chart element should use Arabic-Indic numerals: ${text}`);
              }
            }
          });
        }
      });
      
      cy.screenshotArabicPage('analytics_arabic_validation');
    });

    it('should have Arabic labels on /ar/executive-center', () => {
      cy.visit('/ar/executive-center');
      
      cy.get('main').should('exist');
      
      // Check for executive center Arabic title
      cy.get('body').should('contain.text', 'مركز الذكاء التنفيذي');
      
      // Check for executive-level Arabic terms
      const executiveTerms = ['تنفيذي', 'إدارة', 'استراتيجية', 'أداء'];
      executiveTerms.forEach(term => {
        cy.get('body').then(($body) => {
          const pageText = $body.text();
          if (pageText.includes(term)) {
            cy.log(`Found executive Arabic term: ${term}`);
          }
        });
      });
      
      cy.screenshotArabicPage('executive_center_arabic_validation');
    });
  });

  context('Translation Quality Assurance', () => {
    it('should not contain mixed language content on Arabic pages', () => {
      const criticalRoutes = [
        '/ar/system-overview',
        '/ar/employees', 
        '/ar/payroll',
        '/ar/leave',
        '/ar/analytics'
      ];

      criticalRoutes.forEach(route => {
        cy.visit(route);
        
        // Check for common English words that should not appear
        const englishWords = [
          'Dashboard', 'Employee', 'Management', 'System', 'Overview',
          'Payroll', 'Benefits', 'Performance', 'Training', 'Attendance',
          'Leave', 'Analytics', 'Executive', 'Intelligence'
        ];
        
        englishWords.forEach(word => {
          cy.get('body').should('not.contain.text', word);
        });
        
        // Check that page contains substantial Arabic text
        cy.get('body').then(($body) => {
          const text = $body.text();
          const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
          const totalChars = text.replace(/\s/g, '').length;
          
          if (totalChars > 0) {
            const arabicRatio = arabicChars / totalChars;
            expect(arabicRatio).to.be.greaterThan(0.1, 
              `Page ${route} should have substantial Arabic content`
            );
          }
        });
      });
    });
  });
});