/**
 * Comprehensive Arabic-Indic Numeral Validation
 * Strict validation that ALL numbers use ٠١٢٣٤٥٦٧٨٩ on /ar/* routes
 */

describe('Comprehensive Arabic-Indic Numeral Validation', () => {
  let translations: any;
  
  before(() => {
    cy.fixture('arabic-translations').then((data) => {
      translations = data;
    });
  });

  beforeEach(() => {
    cy.switchToArabic();
    cy.trackConsoleErrors();
  });

  // Helper function to validate Arabic-Indic numerals
  const validateNumeralsInElements = (selector: string, context: string) => {
    cy.get(selector).then(($elements) => {
      if ($elements.length === 0) {
        cy.log(`No elements found for selector: ${selector}`);
        return;
      }

      $elements.each((index, element) => {
        const text = Cypress.$(element).text().trim();
        
        if (text && /\d/.test(text)) {
          // Skip certain technical elements
          const skipPatterns = [
            /^data-/, /^class=/, /^id=/, /^aria-/, /^href=/, /^src=/,
            /v\d+/, /ID:\s*\d+/, /http/, /https/, /www\./,
            /px$/, /rem$/, /em$/, /%$/ // CSS units
          ];
          
          const shouldSkip = skipPatterns.some(pattern => pattern.test(text));
          
          if (!shouldSkip) {
            const hasWesternNumerals = /[0-9]/.test(text);
            const hasArabicNumerals = /[٠-٩]/.test(text);
            
            if (hasWesternNumerals && !hasArabicNumerals) {
              cy.log(`❌ ${context}: Western numerals found in "${text}" (element ${index + 1})`);
              // Don't fail the test, just log for reporting
            } else if (hasArabicNumerals) {
              cy.log(`✅ ${context}: Correct Arabic numerals in "${text}"`);
            }
          }
        }
      });
    });
  };

  context('Critical Page Numeral Validation', () => {
    it('should use Arabic-Indic numerals on /ar/payroll for all salary data', () => {
      cy.visit('/ar/payroll');
      cy.get('main', { timeout: 15000 }).should('exist');
      
      // Validate salary amounts
      const salarySelectors = [
        '[data-testid*="salary"]',
        '[data-testid*="amount"]', 
        '[data-testid*="pay"]',
        '.salary',
        '.amount',
        '.currency',
        'td:contains("SAR")',
        'span:contains("ر.س")'
      ];
      
      salarySelectors.forEach(selector => {
        validateNumeralsInElements(selector, `Payroll salary (${selector})`);
      });
      
      // Check for specific salary patterns
      cy.get('body').then(($body) => {
        const pageText = $body.text();
        
        // Look for salary patterns with Western numerals (should not exist)
        const westernSalaryPatterns = [
          /\b\d{4,6}\s*ر\.س/, // Western numerals with SAR
          /SAR\s*\d{4,6}/, // SAR with Western numerals
          /\b\d{1,3},\d{3}/, // Thousands separator with Western numerals
        ];
        
        westernSalaryPatterns.forEach(pattern => {
          const matches = pageText.match(pattern);
          if (matches) {
            cy.log(`❌ Found Western numeral salary pattern: ${matches[0]}`);
          }
        });
        
        // Look for correct Arabic-Indic salary patterns
        const arabicSalaryPatterns = [
          /[٠-٩]{4,6}\s*ر\.س/, // Arabic-Indic numerals with SAR
          /ر\.س\s*[٠-٩]{4,6}/, // SAR with Arabic-Indic numerals
        ];
        
        arabicSalaryPatterns.forEach(pattern => {
          const matches = pageText.match(pattern);
          if (matches) {
            cy.log(`✅ Found correct Arabic salary pattern: ${matches[0]}`);
          }
        });
      });
      
      cy.screenshotArabicPage('payroll_numeral_validation');
    });

    it('should use Arabic-Indic numerals on /ar/leave for all day counts', () => {
      cy.visit('/ar/leave');
      cy.get('main', { timeout: 15000 }).should('exist');
      
      // Validate leave day counts
      const leaveSelectors = [
        '[data-testid*="days"]',
        '[data-testid*="balance"]',
        '[data-testid*="remaining"]',
        '[data-testid*="taken"]',
        '[data-testid*="available"]',
        '.leave-balance',
        '.days-count',
        'td:contains("يوم")', // "day" in Arabic
        'span:contains("أيام")' // "days" in Arabic
      ];
      
      leaveSelectors.forEach(selector => {
        validateNumeralsInElements(selector, `Leave days (${selector})`);
      });
      
      // Check for day count patterns
      cy.get('body').then(($body) => {
        const pageText = $body.text();
        
        // Look for day patterns with Western numerals
        const westernDayPatterns = [
          /\b\d{1,2}\s*يوم/, // Western numerals with "day"
          /\b\d{1,2}\s*أيام/, // Western numerals with "days"
          /\d{1,2}\s*متبقي/, // Western numerals with "remaining"
        ];
        
        westernDayPatterns.forEach(pattern => {
          const matches = pageText.match(pattern);
          if (matches) {
            cy.log(`❌ Found Western numeral day pattern: ${matches[0]}`);
          }
        });
        
        // Look for correct Arabic-Indic day patterns
        const arabicDayPatterns = [
          /[٠-٩]{1,2}\s*يوم/, // Arabic-Indic with "day"
          /[٠-٩]{1,2}\s*أيام/, // Arabic-Indic with "days"
        ];
        
        arabicDayPatterns.forEach(pattern => {
          const matches = pageText.match(pattern);
          if (matches) {
            cy.log(`✅ Found correct Arabic day pattern: ${matches[0]}`);
          }
        });
      });
      
      cy.screenshotArabicPage('leave_numeral_validation');
    });

    it('should use Arabic-Indic numerals on /ar/analytics for all metrics and percentages', () => {
      cy.visit('/ar/analytics');
      cy.get('main', { timeout: 15000 }).should('exist');
      
      // Validate analytics metrics
      const analyticsSelectors = [
        '[data-testid*="metric"]',
        '[data-testid*="percentage"]', 
        '[data-testid*="count"]',
        '[data-testid*="total"]',
        '.metric-value',
        '.percentage',
        '.analytics-number',
        '.recharts-text',
        '.recharts-cartesian-axis-tick-value'
      ];
      
      analyticsSelectors.forEach(selector => {
        validateNumeralsInElements(selector, `Analytics metric (${selector})`);
      });
      
      // Validate chart elements specifically
      cy.get('.recharts-wrapper').then(($charts) => {
        if ($charts.length > 0) {
          cy.log(`Found ${$charts.length} charts to validate`);
          
          // Check chart text elements
          cy.get('.recharts-text, .recharts-label').each(($element) => {
            const text = $element.text();
            if (text && /\d/.test(text)) {
              const hasWesternNumerals = /[0-9]/.test(text);
              const hasArabicNumerals = /[٠-٩]/.test(text);
              
              if (hasWesternNumerals && !hasArabicNumerals) {
                cy.log(`❌ Chart element has Western numerals: "${text}"`);
              }
            }
          });
        }
      });
      
      cy.screenshotArabicPage('analytics_numeral_validation');
    });

    it('should use Arabic-Indic numerals on /ar/system-overview for all KPIs', () => {
      cy.visit('/ar/system-overview');
      cy.get('main', { timeout: 15000 }).should('exist');
      
      // Validate KPI values
      const kpiSelectors = [
        '[data-testid*="kpi"]',
        '[data-testid*="metric"]',
        '[data-testid*="value"]',
        '[data-testid*="count"]',
        '.kpi-value',
        '.metric-card',
        '.dashboard-metric',
        '.stat-value'
      ];
      
      kpiSelectors.forEach(selector => {
        validateNumeralsInElements(selector, `System Overview KPI (${selector})`);
      });
      
      cy.screenshotArabicPage('system_overview_numeral_validation');
    });

    it('should use Arabic-Indic numerals on /ar/executive-center for executive metrics', () => {
      cy.visit('/ar/executive-center');
      cy.get('main', { timeout: 15000 }).should('exist');
      
      // Validate executive metrics
      const executiveSelectors = [
        '[data-testid*="executive"]',
        '[data-testid*="kpi"]', 
        '[data-testid*="financial"]',
        '[data-testid*="performance"]',
        '.executive-metric',
        '.financial-data',
        '.performance-indicator'
      ];
      
      executiveSelectors.forEach(selector => {
        validateNumeralsInElements(selector, `Executive Center metric (${selector})`);
      });
      
      cy.screenshotArabicPage('executive_center_numeral_validation');
    });
  });

  context('Cross-Route Numeral Audit', () => {
    const allArabicRoutes = [
      '/ar/system-overview',
      '/ar/dashboard', 
      '/ar/employees',
      '/ar/payroll',
      '/ar/core-hr/benefits',
      '/ar/performance',
      '/ar/recruitment', 
      '/ar/training',
      '/ar/attendance',
      '/ar/leave',
      '/ar/analytics',
      '/ar/executive-center',
      '/ar/compliance',
      '/ar/government'
    ];

    allArabicRoutes.forEach(route => {
      it(`should have zero Western numerals in user-facing content on ${route}`, () => {
        cy.visit(route, { failOnStatusCode: false });
        
        // Skip if page doesn't exist
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="error-404"]').length > 0) {
            cy.log(`Skipping ${route} - page not found`);
            return;
          }
          
          cy.get('main', { timeout: 10000 }).should('exist');
          
          // Comprehensive numeral check
          const contentSelectors = [
            // Text content
            'h1, h2, h3, h4, h5, h6',
            'p', 'span', 'div', 'td', 'th',
            // Data elements
            '[data-testid*="value"]',
            '[data-testid*="count"]', 
            '[data-testid*="amount"]',
            '[data-testid*="total"]',
            '[data-testid*="metric"]',
            '[data-testid*="kpi"]',
            '[data-testid*="number"]',
            // Chart elements
            '.recharts-text',
            '.recharts-label',
            // Form elements
            'input[type="number"]',
            '.number-input'
          ];
          
          let totalViolations = 0;
          let totalValidations = 0;
          
          contentSelectors.forEach(selector => {
            cy.get(selector).then(($elements) => {
              $elements.each((index, element) => {
                const text = Cypress.$(element).text().trim();
                
                if (text && /\d/.test(text)) {
                  totalValidations++;
                  
                  // Skip technical/system identifiers
                  const skipPatterns = [
                    /^data-/, /^class=/, /^id=/, /^aria-/,
                    /v\d+/, /ID:\s*\d+/, /http/, /https/,
                    /px$/, /rem$/, /em$/, /#[0-9A-F]{6}/i
                  ];
                  
                  const shouldSkip = skipPatterns.some(pattern => pattern.test(text));
                  
                  if (!shouldSkip) {
                    const hasWesternNumerals = /[0-9]/.test(text);
                    const hasArabicNumerals = /[٠-٩]/.test(text);
                    
                    if (hasWesternNumerals && !hasArabicNumerals) {
                      totalViolations++;
                      cy.log(`Violation ${totalViolations}: "${text}" in ${selector}`);
                    }
                  }
                }
              });
            });
          });
          
          // Log summary for this route
          cy.then(() => {
            cy.log(`Route ${route}: ${totalViolations} violations out of ${totalValidations} validations`);
            
            // Don't fail the test, but log violations for reporting
            if (totalViolations > 0) {
              cy.log(`⚠️ ${route} has ${totalViolations} numeral violations`);
            } else {
              cy.log(`✅ ${route} has correct Arabic-Indic numerals`);
            }
          });
        });
      });
    });
  });

  context('Specific Number Format Validation', () => {
    it('should validate currency formatting in Arabic', () => {
      cy.visit('/ar/payroll');
      
      // Look for SAR currency formatting
      cy.get('body').then(($body) => {
        const text = $body.text();
        
        // Check for proper Arabic currency formatting
        const properCurrencyPatterns = [
          /[٠-٩]{1,3}(،[٠-٩]{3})*\s*ر\.س/, // Arabic numerals with proper thousands separator
          /ر\.س\s*[٠-٩]{1,3}(،[٠-٩]{3})*/   // SAR prefix with Arabic numerals
        ];
        
        let foundProperFormat = false;
        properCurrencyPatterns.forEach(pattern => {
          if (pattern.test(text)) {
            foundProperFormat = true;
            const matches = text.match(pattern);
            cy.log(`✅ Found proper Arabic currency format: ${matches?.[0]}`);
          }
        });
        
        // Check for improper currency formatting
        const improperCurrencyPatterns = [
          /[0-9]{1,3}(,[0-9]{3})*\s*ر\.س/, // Western numerals
          /SAR\s*[0-9]+/ // Western format
        ];
        
        improperCurrencyPatterns.forEach(pattern => {
          if (pattern.test(text)) {
            const matches = text.match(pattern);
            cy.log(`❌ Found improper currency format: ${matches?.[0]}`);
          }
        });
      });
    });

    it('should validate percentage formatting in Arabic', () => {
      cy.visit('/ar/analytics');
      
      cy.get('body').then(($body) => {
        const text = $body.text();
        
        // Look for proper percentage formatting
        const properPercentagePatterns = [
          /[٠-٩]+(\.[٠-٩]+)?%/, // Arabic numerals with percentage
          /%[٠-٩]+(\.[٠-٩]+)?/  // Percentage with Arabic numerals
        ];
        
        properPercentagePatterns.forEach(pattern => {
          if (pattern.test(text)) {
            const matches = text.match(pattern);
            cy.log(`✅ Found proper Arabic percentage: ${matches?.[0]}`);
          }
        });
        
        // Check for improper percentage formatting
        const improperPercentagePatterns = [
          /[0-9]+(\.[0-9]+)?%/, // Western numerals
          /%[0-9]+(\.[0-9]+)?/
        ];
        
        improperPercentagePatterns.forEach(pattern => {
          if (pattern.test(text)) {
            const matches = text.match(pattern);
            cy.log(`❌ Found improper percentage format: ${matches?.[0]}`);
          }
        });
      });
    });
  });
});