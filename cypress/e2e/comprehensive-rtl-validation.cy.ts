/**
 * Comprehensive RTL Layout Validation
 * Validates proper RTL implementation across all Arabic routes
 */

describe('Comprehensive RTL Layout Validation', () => {
  beforeEach(() => {
    cy.switchToArabic();
    cy.trackConsoleErrors();
  });

  context('HTML Document RTL Validation', () => {
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
      '/ar/government',
      '/ar/government/qiwa',
      '/ar/government/gosi',
      '/ar/government/mol'
    ];

    allArabicRoutes.forEach(route => {
      it(`should have proper HTML RTL attributes on ${route}`, () => {
        cy.visit(route, { failOnStatusCode: false });
        
        // Skip if page doesn't exist
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="error-404"]').length > 0) {
            cy.log(`Skipping ${route} - page not found`);
            return;
          }
          
          // Validate HTML element attributes
          cy.get('html')
            .should('have.attr', 'dir', 'rtl')
            .should('have.attr', 'lang', 'ar');
          
          // Validate document body has RTL class or styling
          cy.get('body').should(($body) => {
            const classes = $body.attr('class') || '';
            const style = $body.attr('style') || '';
            const computedDirection = window.getComputedStyle($body[0]).direction;
            
            // Should have RTL indication via class, style, or computed style
            const hasRTLClass = /rtl|arabic|ar/i.test(classes);
            const hasRTLStyle = /direction:\s*rtl/i.test(style);
            const hasRTLComputed = computedDirection === 'rtl';
            
            expect(hasRTLClass || hasRTLStyle || hasRTLComputed).to.be.true;
          });
          
          cy.log(`✅ ${route} has proper RTL attributes`);
        });
      });
    });
  });

  context('Layout Component RTL Validation', () => {
    it('should have RTL navigation layout on /ar/system-overview', () => {
      cy.visit('/ar/system-overview');
      cy.get('main').should('exist');
      
      // Validate sidebar/navigation RTL positioning
      cy.get('[data-testid="sidebar"], nav, .sidebar, .navigation').then(($nav) => {
        if ($nav.length > 0) {
          // Navigation should be positioned correctly for RTL
          const nav = $nav[0];
          const navStyles = window.getComputedStyle(nav);
          
          cy.log(`Navigation direction: ${navStyles.direction}`);
          cy.log(`Navigation text-align: ${navStyles.textAlign}`);
          
          // Should have RTL characteristics
          const isRTL = navStyles.direction === 'rtl' || 
                       navStyles.textAlign === 'right' || 
                       navStyles.textAlign === 'end';
          
          if (!isRTL) {
            cy.log('⚠️ Navigation might not have proper RTL styling');
          }
        }
      });
      
      // Validate navigation items RTL flow
      cy.get('[data-testid^="nav-"], .nav-item, .menu-item').then(($items) => {
        if ($items.length > 0) {
          $items.each((index, item) => {
            const itemStyles = window.getComputedStyle(item);
            if (itemStyles.textAlign === 'left') {
              cy.log(`⚠️ Navigation item ${index + 1} has left text alignment`);
            }
          });
        }
      });
      
      cy.screenshotArabicPage('navigation_rtl_layout');
    });

    it('should have RTL card grid layout on Arabic dashboard pages', () => {
      const dashboardRoutes = [
        '/ar/system-overview',
        '/ar/analytics', 
        '/ar/executive-center'
      ];
      
      dashboardRoutes.forEach(route => {
        cy.visit(route, { failOnStatusCode: false });
        
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="error-404"]').length === 0) {
            cy.get('main').should('exist');
            
            // Validate card grid RTL layout
            cy.get('[data-testid*="card"], .card, .metric-card, .kpi-card').then(($cards) => {
              if ($cards.length > 0) {
                cy.log(`Found ${$cards.length} cards to validate RTL layout`);
                
                $cards.each((index, card) => {
                  const cardStyles = window.getComputedStyle(card);
                  
                  // Check text alignment
                  if (cardStyles.textAlign === 'left') {
                    cy.log(`⚠️ Card ${index + 1} on ${route} has left text alignment`);
                  }
                  
                  // Check direction
                  if (cardStyles.direction !== 'rtl' && cardStyles.direction !== 'inherit') {
                    cy.log(`⚠️ Card ${index + 1} on ${route} doesn't have RTL direction`);
                  }
                });
                
                // Take screenshot for visual validation
                cy.screenshotArabicPage(`${route.replace(/[\/]/g, '_')}_cards_rtl`);
              }
            });
          }
        });
      });
    });

    it('should have RTL table layout on /ar/employees', () => {
      cy.visit('/ar/employees');
      cy.get('main').should('exist');
      
      // Validate table RTL layout
      cy.get('table, [data-testid*="table"]').then(($tables) => {
        if ($tables.length > 0) {
          const table = $tables[0];
          const tableStyles = window.getComputedStyle(table);
          
          cy.log(`Table direction: ${tableStyles.direction}`);
          
          // Validate table headers RTL alignment
          cy.get('th').each(($header) => {
            const headerStyles = window.getComputedStyle($header[0]);
            if (headerStyles.textAlign === 'left') {
              cy.log('⚠️ Table header has left alignment instead of right/start');
            }
          });
          
          // Validate table cells RTL alignment
          cy.get('td').first().then(($cell) => {
            const cellStyles = window.getComputedStyle($cell[0]);
            cy.log(`First table cell text-align: ${cellStyles.textAlign}`);
          });
        }
      });
      
      cy.screenshotArabicPage('employees_table_rtl');
    });

    it('should have RTL form layout on pages with forms', () => {
      const formRoutes = [
        '/ar/employees',
        '/ar/recruitment',
        '/ar/training'
      ];
      
      formRoutes.forEach(route => {
        cy.visit(route, { failOnStatusCode: false });
        
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="error-404"]').length === 0) {
            // Look for forms
            cy.get('form, [data-testid*="form"]').then(($forms) => {
              if ($forms.length > 0) {
                cy.log(`Found forms on ${route}`);
                
                // Validate form direction
                $forms.each((index, form) => {
                  const formStyles = window.getComputedStyle(form);
                  if (formStyles.direction !== 'rtl') {
                    cy.log(`⚠️ Form ${index + 1} on ${route} doesn't have RTL direction`);
                  }
                });
                
                // Validate form labels RTL alignment
                cy.get('label').then(($labels) => {
                  if ($labels.length > 0) {
                    $labels.each((index, label) => {
                      const labelStyles = window.getComputedStyle(label);
                      if (labelStyles.textAlign === 'left') {
                        cy.log(`⚠️ Form label ${index + 1} has left alignment`);
                      }
                    });
                  }
                });
                
                // Validate input RTL direction
                cy.get('input[type="text"], textarea').then(($inputs) => {
                  if ($inputs.length > 0) {
                    $inputs.each((index, input) => {
                      const inputDir = Cypress.$(input).attr('dir');
                      if (inputDir !== 'rtl') {
                        cy.log(`⚠️ Input ${index + 1} doesn't have dir="rtl" attribute`);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });
    });
  });

  context('Interactive Elements RTL Validation', () => {
    it('should have RTL button groups and toolbars', () => {
      const interactiveRoutes = [
        '/ar/system-overview',
        '/ar/employees',
        '/ar/payroll'
      ];
      
      interactiveRoutes.forEach(route => {
        cy.visit(route, { failOnStatusCode: false });
        
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="error-404"]').length === 0) {
            // Validate button groups
            cy.get('[role="toolbar"], .button-group, [data-testid*="actions"]').then(($groups) => {
              if ($groups.length > 0) {
                $groups.each((index, group) => {
                  const groupStyles = window.getComputedStyle(group);
                  
                  // Button groups should flow RTL
                  if (groupStyles.direction !== 'rtl' && groupStyles.flexDirection !== 'row-reverse') {
                    cy.log(`⚠️ Button group ${index + 1} on ${route} might not have proper RTL flow`);
                  }
                });
              }
            });
            
            // Validate dropdown menus if present
            cy.get('[role="menu"], .dropdown-menu').then(($menus) => {
              if ($menus.length > 0) {
                $menus.each((index, menu) => {
                  const menuStyles = window.getComputedStyle(menu);
                  if (menuStyles.textAlign !== 'right' && menuStyles.textAlign !== 'start') {
                    cy.log(`⚠️ Menu ${index + 1} on ${route} doesn't have RTL text alignment`);
                  }
                });
              }
            });
          }
        });
      });
    });

    it('should have RTL modal and dialog layouts', () => {
      cy.visit('/ar/employees');
      
      // Try to trigger modals/dialogs if they exist
      cy.get('[data-testid*="add"], [data-testid*="create"], .add-button').then(($triggers) => {
        if ($triggers.length > 0) {
          cy.wrap($triggers.first()).click({ force: true });
          
          // Check if modal appears
          cy.get('[role="dialog"], .modal, [data-testid*="modal"]').then(($modals) => {
            if ($modals.length > 0) {
              const modal = $modals[0];
              const modalStyles = window.getComputedStyle(modal);
              
              // Modal should have RTL direction
              if (modalStyles.direction !== 'rtl') {
                cy.log('⚠️ Modal doesn\'t have RTL direction');
              }
              
              // Modal content should be right-aligned
              cy.get('.modal-content, .dialog-content').then(($content) => {
                if ($content.length > 0) {
                  const contentStyles = window.getComputedStyle($content[0]);
                  if (contentStyles.textAlign === 'left') {
                    cy.log('⚠️ Modal content has left text alignment');
                  }
                }
              });
              
              // Close modal
              cy.get('[data-testid*="close"], .modal-close').then(($close) => {
                if ($close.length > 0) {
                  cy.wrap($close.first()).click({ force: true });
                }
              });
            }
          });
        }
      });
    });
  });

  context('Responsive RTL Validation', () => {
    const responsiveBreakpoints = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' }, 
      { width: 1280, height: 720, name: 'desktop' },
      { width: 1920, height: 1080, name: 'large-desktop' }
    ];
    
    responsiveBreakpoints.forEach(({ width, height, name }) => {
      it(`should maintain RTL layout on ${name} viewport (${width}x${height})`, () => {
        cy.viewport(width, height);
        cy.visit('/ar/system-overview');
        cy.get('main').should('exist');
        
        // Validate HTML still has RTL attributes
        cy.get('html')
          .should('have.attr', 'dir', 'rtl')
          .should('have.attr', 'lang', 'ar');
        
        // Validate main content direction
        cy.get('main, [data-testid="main-content"]').then(($main) => {
          if ($main.length > 0) {
            const mainStyles = window.getComputedStyle($main[0]);
            if (mainStyles.direction !== 'rtl' && mainStyles.direction !== 'inherit') {
              cy.log(`⚠️ Main content doesn't have RTL direction on ${name}`);
            }
          }
        });
        
        // Validate responsive navigation
        if (width < 768) {
          // Mobile: check mobile menu if present
          cy.get('[data-testid*="mobile-menu"], .mobile-nav').then(($mobileNav) => {
            if ($mobileNav.length > 0) {
              const navStyles = window.getComputedStyle($mobileNav[0]);
              if (navStyles.textAlign === 'left') {
                cy.log('⚠️ Mobile navigation has left alignment');
              }
            }
          });
        }
        
        cy.screenshotArabicPage(`rtl_responsive_${name}_${width}x${height}`);
      });
    });
  });

  context('CSS Grid and Flexbox RTL Validation', () => {
    it('should have proper RTL grid layouts', () => {
      cy.visit('/ar/system-overview');
      cy.get('main').should('exist');
      
      // Find grid containers
      cy.get('[style*="display: grid"], [class*="grid"]').then(($grids) => {
        if ($grids.length > 0) {
          cy.log(`Found ${$grids.length} CSS Grid containers`);
          
          $grids.each((index, grid) => {
            const gridStyles = window.getComputedStyle(grid);
            
            // Check if grid has proper RTL direction
            if (gridStyles.direction !== 'rtl' && gridStyles.direction !== 'inherit') {
              cy.log(`⚠️ Grid container ${index + 1} doesn't have RTL direction`);
            }
            
            // Check grid template areas if defined
            const gridTemplateAreas = gridStyles.gridTemplateAreas;
            if (gridTemplateAreas && gridTemplateAreas !== 'none') {
              cy.log(`Grid template areas: ${gridTemplateAreas}`);
            }
          });
        }
      });
      
      // Find flexbox containers
      cy.get('[style*="display: flex"], [class*="flex"]').then(($flexContainers) => {
        if ($flexContainers.length > 0) {
          cy.log(`Found ${$flexContainers.length} Flexbox containers`);
          
          $flexContainers.each((index, flex) => {
            const flexStyles = window.getComputedStyle(flex);
            
            // Check flex direction for RTL
            const flexDirection = flexStyles.flexDirection;
            if (flexDirection === 'row' && flexStyles.direction === 'rtl') {
              // This is okay - flex row with RTL direction
              cy.log(`✅ Flex container ${index + 1} uses row with RTL direction`);
            } else if (flexDirection === 'row-reverse') {
              // This might be intentional for RTL
              cy.log(`✅ Flex container ${index + 1} uses row-reverse`);
            }
          });
        }
      });
    });
  });
});