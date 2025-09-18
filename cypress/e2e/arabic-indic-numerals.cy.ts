/**
 * Arabic-Indic Numerals Validation Suite
 * Tests for proper Arabic-Indic numeral rendering on /ar/* routes
 */

describe('Arabic-Indic Numerals Validation', () => {
  // Arabic-Indic numerals: ٠١٢٣٤٥٦٧٨٩
  const arabicIndicRegex = /[٠-٩]/;
  const westernNumeralsRegex = /[0-9]/;
  
  beforeEach(() => {
    // Set language to Arabic and proper locale
    cy.window().then((win) => {
      win.localStorage.setItem('aqlhr.locale', 'ar');
      win.localStorage.setItem('aqlhr-language', 'ar');
    });
  });

  context('Payroll Module (/ar/payroll)', () => {
    it('should display salaries in Arabic-Indic numerals', () => {
      cy.visit('/ar/payroll');
      
      // Wait for salary data to load
      cy.get('[data-testid="salary-amount"]', { timeout: 10000 }).should('exist');
      
      // Check salary amounts use Arabic-Indic numerals
      cy.get('[data-testid="salary-amount"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) { // If contains numbers
          expect(text).to.match(arabicIndicRegex, 'Salary should use Arabic-Indic numerals');
        }
      });
      
      // Check deduction values
      cy.get('[data-testid="deduction-amount"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Deductions should use Arabic-Indic numerals');
        }
      });
      
      // Check percentage values (tax calculations)
      cy.get('[data-testid="tax-percentage"]').each(($element) => {
        const text = $element.text();
        if (text.includes('%')) {
          expect(text).to.match(arabicIndicRegex, 'Tax percentages should use Arabic-Indic numerals');
        }
      });
    });
  });

  context('Leave Module (/ar/leave)', () => {
    it('should display leave days in Arabic-Indic numerals', () => {
      cy.visit('/ar/leave');
      
      // Wait for leave data to load
      cy.get('[data-testid="leave-balance"]', { timeout: 10000 }).should('exist');
      
      // Check balance days
      cy.get('[data-testid="leave-balance"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Leave balance should use Arabic-Indic numerals');
        }
      });
      
      // Check remaining days
      cy.get('[data-testid="remaining-days"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Remaining days should use Arabic-Indic numerals');
        }
      });
      
      // Check duration counts
      cy.get('[data-testid="leave-duration"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Leave duration should use Arabic-Indic numerals');
        }
      });
    });
  });

  context('Attendance Module (/ar/attendance)', () => {
    it('should display attendance data in Arabic-Indic numerals', () => {
      cy.visit('/ar/attendance');
      
      // Wait for attendance data to load
      cy.get('[data-testid="hours-worked"]', { timeout: 10000 }).should('exist');
      
      // Check hours worked
      cy.get('[data-testid="hours-worked"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Hours worked should use Arabic-Indic numerals');
        }
      });
      
      // Check late minutes
      cy.get('[data-testid="late-minutes"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Late minutes should use Arabic-Indic numerals');
        }
      });
      
      // Check overtime hours
      cy.get('[data-testid="overtime-hours"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Overtime hours should use Arabic-Indic numerals');
        }
      });
    });
  });

  context('Analytics Dashboard (/ar/analytics)', () => {
    it('should display metrics in Arabic-Indic numerals', () => {
      cy.visit('/ar/analytics');
      
      // Wait for charts and metrics to load
      cy.get('[data-testid="metric-value"]', { timeout: 15000 }).should('exist');
      
      // Check employee counts
      cy.get('[data-testid="employee-count"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Employee count should use Arabic-Indic numerals');
        }
      });
      
      // Check percentages
      cy.get('[data-testid="percentage-value"]').each(($element) => {
        const text = $element.text();
        if (text.includes('%')) {
          expect(text).to.match(arabicIndicRegex, 'Percentages should use Arabic-Indic numerals');
        }
      });
      
      // Check chart axes (if charts are present)
      cy.get('.recharts-text, .recharts-cartesian-axis-tick-value').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Chart values should use Arabic-Indic numerals');
        }
      });
    });
  });

  context('System Overview (/ar/system-overview)', () => {
    it('should display KPI cards with Arabic-Indic numerals', () => {
      cy.visit('/ar/system-overview');
      
      // Wait for KPI cards to load
      cy.get('[data-testid="kpi-card"]', { timeout: 10000 }).should('exist');
      
      // Check all KPI values
      cy.get('[data-testid="kpi-value"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'KPI values should use Arabic-Indic numerals');
        }
      });
      
      // Check metric cards
      cy.get('[data-testid="metric-card"] [data-testid="metric-value"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Metric card values should use Arabic-Indic numerals');
        }
      });
    });
  });

  context('Executive Center (/ar/executive-center)', () => {
    it('should display executive metrics in Arabic-Indic numerals', () => {
      cy.visit('/ar/executive-center');
      
      // Wait for executive dashboard to load
      cy.get('[data-testid="executive-metric"]', { timeout: 15000 }).should('exist');
      
      // Check executive KPIs
      cy.get('[data-testid="executive-kpi"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Executive KPIs should use Arabic-Indic numerals');
        }
      });
      
      // Check financial metrics
      cy.get('[data-testid="financial-metric"]').each(($element) => {
        const text = $element.text();
        if (/\d/.test(text)) {
          expect(text).to.match(arabicIndicRegex, 'Financial metrics should use Arabic-Indic numerals');
        }
      });
    });
  });

  context('Cross-Route Validation', () => {
    const criticalRoutes = [
      '/ar/system-overview',
      '/ar/employees',
      '/ar/payroll', 
      '/ar/leave',
      '/ar/attendance',
      '/ar/analytics',
      '/ar/executive-center',
      '/ar/government',
      '/ar/compliance'
    ];

    criticalRoutes.forEach((route) => {
      it(`should not contain Western numerals on ${route}`, () => {
        cy.visit(route);
        
        // Wait for content to load
        cy.get('main, [data-testid="main-content"]', { timeout: 10000 }).should('exist');
        
        // Check that visible numeric content uses Arabic-Indic numerals
        // We'll be more specific to avoid false positives from IDs, classes, etc.
        cy.get('[data-testid*="value"], [data-testid*="count"], [data-testid*="metric"], [data-testid*="amount"]')
          .each(($element) => {
            const text = $element.text();
            // Only check if element contains numbers and is likely user-facing content
            if (/\d/.test(text) && text.trim().length > 0) {
              // Allow specific exceptions (version numbers, IDs, etc.)
              const exceptions = ['v1', 'v2', 'ID:', 'UUID:', 'http:', 'https:'];
              const hasException = exceptions.some(exc => text.includes(exc));
              
              if (!hasException) {
                expect(text).to.match(arabicIndicRegex, 
                  `Numeric content "${text}" should use Arabic-Indic numerals on ${route}`);
              }
            }
          });
      });
    });
  });

  context('Format Validation Helper', () => {
    it('should provide Arabic-Indic numeral conversion reference', () => {
      // Reference mapping for debugging
      const numeralMapping = {
        '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
        '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
      };
      
      cy.log('Arabic-Indic Numeral Mapping:');
      Object.entries(numeralMapping).forEach(([western, arabic]) => {
        cy.log(`${western} → ${arabic}`);
      });
    });
  });
});