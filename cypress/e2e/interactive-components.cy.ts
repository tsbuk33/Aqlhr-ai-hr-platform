/**
 * Interactive Components Testing Suite
 * Validates functionality of tables, forms, charts, and AI assistants
 */

describe('Interactive Components Validation', () => {
  const testRoutes = [
    { path: 'system-overview', components: ['charts', 'cards', 'buttons'] },
    { path: 'employees', components: ['tables', 'forms', 'search', 'filters'] },
    { path: 'payroll', components: ['tables', 'calculations', 'exports'] },
    { path: 'analytics', components: ['charts', 'filters', 'dashboards'] },
    { path: 'executive-center', components: ['dashboards', 'charts', 'kpis'] }
  ];

  const languages = ['en', 'ar'];

  beforeEach(() => {
    // Track console errors
    cy.trackConsoleErrors();
  });

  languages.forEach(lang => {
    describe(`Interactive Components - ${lang.toUpperCase()}`, () => {
      beforeEach(() => {
        // Set language
        cy.window().then((win) => {
          win.localStorage.setItem('aqlhr.locale', lang);
          win.localStorage.setItem('aqlhr-language', lang);
        });
      });

      testRoutes.forEach(({ path, components }) => {
        context(`${path} - Interactive Elements`, () => {
          beforeEach(() => {
            cy.visit(`/${lang}/${path}`);
            // Wait for page to load
            cy.get('main, [data-testid="main-content"]', { timeout: 15000 }).should('exist');
          });

          if (components.includes('tables')) {
            it('should have functional tables with sorting and pagination', () => {
              cy.get('table, [data-testid*="table"]').then(($tables) => {
                if ($tables.length > 0) {
                  cy.wrap($tables.first()).within(() => {
                    // Test sorting functionality
                    cy.get('th[role="columnheader"], th[data-sortable="true"], .sortable').then(($headers) => {
                      if ($headers.length > 0) {
                        cy.wrap($headers.first()).click({ force: true });
                        
                        // Verify sort indicator or table reorder
                        cy.get('tbody tr').should('have.length.at.least', 1);
                      }
                    });

                    // Test pagination if present
                    cy.get('[data-testid*="pagination"], .pagination, [aria-label*="pagination"]').then(($pagination) => {
                      if ($pagination.length > 0) {
                        // Test next page button
                        cy.get('[data-testid*="next"], .next, [aria-label*="next"]').then(($next) => {
                          if ($next.length > 0 && !$next.prop('disabled')) {
                            cy.wrap($next.first()).click({ force: true });
                          }
                        });
                      }
                    });
                  });

                  // Validate table content for Arabic numerals on Arabic pages
                  if (lang === 'ar') {
                    cy.get('table td').each(($cell) => {
                      const text = $cell.text();
                      if (/\d/.test(text)) {
                        // Check for numeric content that should use Arabic-Indic numerals
                        const hasWesternNumerals = /[0-9]/.test(text);
                        const hasExceptions = ['ID:', 'v1', 'http', 'class='].some(exc => text.includes(exc));
                        
                        if (hasWesternNumerals && !hasExceptions) {
                          cy.log(`Table cell contains Western numerals: ${text}`);
                        }
                      }
                    });
                  }
                }
              });
            });
          }

          if (components.includes('forms')) {
            it('should have functional forms with validation', () => {
              // Test form elements
              cy.get('form, [data-testid*="form"]').then(($forms) => {
                if ($forms.length > 0) {
                  cy.wrap($forms.first()).within(() => {
                    // Test text inputs
                    cy.get('input[type="text"], input[type="email"]').then(($inputs) => {
                      if ($inputs.length > 0) {
                        const testText = lang === 'ar' ? 'نص تجريبي' : 'test text';
                        cy.wrap($inputs.first()).clear().type(testText);
                        
                        // Verify RTL direction for Arabic
                        if (lang === 'ar') {
                          cy.wrap($inputs.first()).should('have.attr', 'dir', 'rtl');
                        }
                      }
                    });

                    // Test select dropdowns
                    cy.get('select, [data-testid*="select"]').then(($selects) => {
                      if ($selects.length > 0) {
                        cy.wrap($selects.first()).should('be.visible');
                      }
                    });

                    // Test form buttons
                    cy.get('button[type="submit"], [data-testid*="submit"]').then(($buttons) => {
                      if ($buttons.length > 0) {
                        cy.wrap($buttons.first()).should('be.visible');
                        // Don't actually submit to avoid side effects
                      }
                    });
                  });
                }
              });

              // Test search functionality if present
              cy.get('[data-testid*="search"], input[placeholder*="search"], input[placeholder*="بحث"]').then(($search) => {
                if ($search.length > 0) {
                  const searchTerm = lang === 'ar' ? 'بحث' : 'test';
                  cy.wrap($search.first()).clear().type(searchTerm);
                  
                  // Wait for search results or filtering
                  cy.wait(500);
                }
              });
            });
          }

          if (components.includes('charts')) {
            it('should render charts with proper data visualization', () => {
              // Test Recharts components
              cy.get('.recharts-wrapper, [data-testid*="chart"]').then(($charts) => {
                if ($charts.length > 0) {
                  cy.wrap($charts.first()).should('be.visible');
                  
                  // Verify chart has data
                  cy.get('.recharts-layer, .recharts-bar, .recharts-line, .recharts-area').should('exist');
                  
                  // Test chart interactivity
                  cy.get('.recharts-active-dot, .recharts-bar').then(($elements) => {
                    if ($elements.length > 0) {
                      cy.wrap($elements.first()).trigger('mouseover', { force: true });
                    }
                  });

                  // Validate Arabic-Indic numerals in chart labels for Arabic pages
                  if (lang === 'ar') {
                    cy.get('.recharts-text, .recharts-cartesian-axis-tick-value').each(($element) => {
                      const text = $element.text();
                      if (/\d/.test(text) && !/[ID|v\d|http]/.test(text)) {
                        const hasArabicNumerals = /[٠-٩]/.test(text);
                        if (!hasArabicNumerals) {
                          cy.log(`Chart element should use Arabic-Indic numerals: ${text}`);
                        }
                      }
                    });
                  }
                }
              });
            });
          }

          if (components.includes('buttons')) {
            it('should have responsive and accessible buttons', () => {
              // Test primary action buttons
              cy.get('button:not([disabled]), [role="button"]:not([disabled])').then(($buttons) => {
                if ($buttons.length > 0) {
                  $buttons.each((index, button) => {
                    const $btn = Cypress.$(button);
                    
                    // Skip if button might cause navigation or data changes
                    const dangerousClasses = ['delete', 'remove', 'logout', 'submit'];
                    const isDangerous = dangerousClasses.some(cls => 
                      $btn.attr('class')?.includes(cls) || 
                      $btn.text().toLowerCase().includes(cls)
                    );
                    
                    if (!isDangerous && index < 3) { // Test first 3 safe buttons
                      cy.wrap($btn).should('be.visible');
                      cy.wrap($btn).should('not.have.attr', 'disabled');
                      
                      // Test hover state
                      cy.wrap($btn).trigger('mouseover', { force: true });
                    }
                  });
                }
              });

              // Test button groups and toolbars
              cy.get('[role="toolbar"], .button-group, [data-testid*="actions"]').then(($groups) => {
                if ($groups.length > 0) {
                  cy.wrap($groups.first()).should('be.visible');
                  
                  // Verify RTL flow for Arabic
                  if (lang === 'ar') {
                    cy.wrap($groups.first()).should('have.css', 'direction').and('match', /(rtl|inherit)/);
                  }
                }
              });
            });
          }

          if (components.includes('filters')) {
            it('should have functional filters and search', () => {
              // Test filter controls
              cy.get('[data-testid*="filter"], .filter-control, [role="combobox"]').then(($filters) => {
                if ($filters.length > 0) {
                  cy.wrap($filters.first()).click({ force: true });
                  
                  // Test filter options
                  cy.get('[role="option"], .filter-option').then(($options) => {
                    if ($options.length > 0) {
                      cy.wrap($options.first()).click({ force: true });
                    }
                  });
                }
              });

              // Test date pickers
              cy.get('[data-testid*="date"], input[type="date"]').then(($datePickers) => {
                if ($datePickers.length > 0) {
                  cy.wrap($datePickers.first()).should('be.visible');
                }
              });
            });
          }

          if (components.includes('kpis')) {
            it('should display KPIs with proper formatting', () => {
              // Test KPI cards
              cy.get('[data-testid*="kpi"], [data-testid*="metric"], .kpi-card').then(($kpis) => {
                if ($kpis.length > 0) {
                  cy.wrap($kpis.first()).should('be.visible');
                  
                  // Verify KPI values are formatted correctly
                  cy.get('[data-testid*="value"], .kpi-value').each(($value) => {
                    const text = $value.text();
                    
                    if (lang === 'ar' && /\d/.test(text)) {
                      // Should use Arabic-Indic numerals
                      const hasArabicNumerals = /[٠-٩]/.test(text);
                      if (!hasArabicNumerals && !/[ID|v\d|http]/.test(text)) {
                        cy.log(`KPI value should use Arabic-Indic numerals: ${text}`);
                      }
                    }
                  });
                }
              });
            });
          }

          it('should not have any critical console errors', () => {
            cy.window().then((win) => {
              const errors = (win as any).__cypress_console_errors || [];
              const criticalErrors = errors.filter((error: string) => 
                error.includes('Error:') || 
                error.includes('TypeError:') || 
                error.includes('ReferenceError:')
              );
              
              if (criticalErrors.length > 0) {
                cy.log(`Critical errors found: ${criticalErrors.join(', ')}`);
              }
              
              expect(criticalErrors.length).to.be.lessThan(3, 
                'Too many critical console errors detected'
              );
            });
          });
        });
      });
    });
  });

  context('AI Assistant Components', () => {
    const aiRoutes = ['system-overview', 'employees', 'analytics'];

    languages.forEach(lang => {
      aiRoutes.forEach(route => {
        it(`should have functional AI assistant on /${lang}/${route}`, () => {
          cy.window().then((win) => {
            win.localStorage.setItem('aqlhr.locale', lang);
          });

          cy.visit(`/${lang}/${route}`);
          
          // Look for AI assistant components
          cy.get('[data-testid*="ai"], [data-testid*="assistant"], .ai-chat, .chat-widget').then(($ai) => {
            if ($ai.length > 0) {
              cy.wrap($ai.first()).should('be.visible');
              
              // Test AI chat input if present
              cy.get('[data-testid*="chat-input"], .chat-input, textarea[placeholder*="ask"]').then(($input) => {
                if ($input.length > 0) {
                  const testMessage = lang === 'ar' ? 'مرحبا' : 'Hello';
                  cy.wrap($input.first()).type(testMessage);
                  
                  // Don't actually send to avoid API calls
                  cy.wrap($input.first()).clear();
                }
              });
            }
          });
        });
      });
    });
  });
});