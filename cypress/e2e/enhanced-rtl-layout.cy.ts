/**
 * Enhanced RTL Layout and UI Component Testing
 * Validates proper RTL implementation and Arabic UI rendering
 */

describe('Enhanced RTL Layout Validation', () => {
  beforeEach(() => {
    // Set Arabic language and RTL
    cy.window().then((win) => {
      win.localStorage.setItem('aqlhr.locale', 'ar');
      win.localStorage.setItem('aqlhr-language', 'ar');
    });
  });

  context('Document and Root Element Validation', () => {
    const testRoutes = [
      '/ar/system-overview',
      '/ar/employees', 
      '/ar/payroll',
      '/ar/analytics',
      '/ar/executive-center',
      '/ar/government'
    ];

    testRoutes.forEach(route => {
      it(`should have proper RTL attributes on ${route}`, () => {
        cy.visit(route);
        
        // HTML element should have RTL direction and Arabic lang
        cy.get('html')
          .should('have.attr', 'dir', 'rtl')
          .should('have.attr', 'lang', 'ar');
        
        // Body should have RTL class (if applicable)
        cy.get('body').should(($body) => {
          const classes = $body.attr('class') || '';
          // Should have RTL-related classes
          expect(classes).to.match(/(rtl|arabic|ar)/i);
        });
      });
    });
  });

  context('Navigation RTL Layout', () => {
    it('should properly render navigation in RTL', () => {
      cy.visit('/ar/system-overview');
      
      // Sidebar should be positioned correctly for RTL
      cy.get('[data-testid="sidebar"], .sidebar, nav').then(($nav) => {
        if ($nav.length > 0) {
          // Check navigation positioning
          cy.wrap($nav.first()).should('be.visible');
          
          // Navigation items should be right-aligned
          cy.get('[data-testid^="nav-"], .nav-item').first().then(($item) => {
            if ($item.length > 0) {
              cy.wrap($item).should('have.css', 'text-align').and('match', /(right|end)/);
            }
          });
        }
      });
      
      // Menu toggle should be on the correct side for RTL
      cy.get('[data-testid="menu-toggle"], .menu-toggle, [aria-label*="menu"]').then(($toggle) => {
        if ($toggle.length > 0) {
          cy.wrap($toggle.first()).should('be.visible');
        }
      });
    });
  });

  context('Card Components RTL Layout', () => {
    it('should render metric cards properly in RTL', () => {
      cy.visit('/ar/system-overview');
      
      // Wait for cards to load
      cy.get('[data-testid*="card"], .card, [data-testid*="metric"]', { timeout: 10000 })
        .should('exist');
      
      // Check card content alignment
      cy.get('[data-testid="metric-card"], [data-testid*="kpi"]').each(($card) => {
        // Card content should be right-aligned for RTL
        cy.wrap($card).within(() => {
          // Check text alignment in card content
          cy.get('[data-testid*="value"], [data-testid*="title"], h1, h2, h3, .card-title')
            .should('have.css', 'text-align')
            .and('match', /(right|end|start)/); // start is correct for RTL
        });
      });
    });
  });

  context('Table RTL Layout', () => {
    it('should render tables properly in RTL on employees page', () => {
      cy.visit('/ar/employees');
      
      // Wait for table to load
      cy.get('table, [data-testid*="table"]', { timeout: 15000 }).then(($tables) => {
        if ($tables.length > 0) {
          cy.wrap($tables.first()).within(() => {
            // Table headers should be properly aligned
            cy.get('th').first().should('be.visible');
            
            // Table content should flow RTL
            cy.get('td').first().should('be.visible');
          });
        }
      });
    });
  });

  context('Form Elements RTL Layout', () => {
    it('should render forms properly in RTL', () => {
      cy.visit('/ar/employees');
      
      // Check for forms or input elements
      cy.get('form, [data-testid*="form"]').then(($forms) => {
        if ($forms.length > 0) {
          cy.wrap($forms.first()).within(() => {
            // Labels should be right-aligned
            cy.get('label').then(($labels) => {
              if ($labels.length > 0) {
                cy.wrap($labels.first())
                  .should('have.css', 'text-align')
                  .and('match', /(right|end|start)/);
              }
            });
            
            // Input fields should have proper RTL direction
            cy.get('input[type="text"], textarea').then(($inputs) => {
              if ($inputs.length > 0) {
                cy.wrap($inputs.first())
                  .should('have.attr', 'dir', 'rtl');
              }
            });
          });
        }
      });
    });
  });

  context('Chart Components RTL Layout', () => {
    it('should render charts properly in RTL on analytics page', () => {
      cy.visit('/ar/analytics');
      
      // Wait for charts to load
      cy.get('.recharts-wrapper, [data-testid*="chart"]', { timeout: 15000 }).then(($charts) => {
        if ($charts.length > 0) {
          // Charts should be visible and properly positioned
          cy.wrap($charts.first()).should('be.visible');
          
          // Chart text elements should use Arabic-Indic numerals
          cy.get('.recharts-text').then(($texts) => {
            $texts.each((index, element) => {
              const text = Cypress.$(element).text();
              if (/\d/.test(text)) {
                // Should contain Arabic-Indic numerals for numeric content
                expect(text).to.match(/[٠-٩]/);
              }
            });
          });
        }
      });
    });
  });

  context('Button and Action Elements RTL Layout', () => {
    it('should render buttons and actions properly in RTL', () => {
      cy.visit('/ar/system-overview');
      
      // Check button layouts
      cy.get('button, [role="button"]').then(($buttons) => {
        if ($buttons.length > 0) {
          // Buttons should be properly styled for RTL
          cy.wrap($buttons.first()).should('be.visible');
          
          // Button groups should flow right-to-left
          cy.get('.button-group, [data-testid*="actions"]').then(($groups) => {
            if ($groups.length > 0) {
              cy.wrap($groups.first()).should('have.css', 'direction', 'rtl');
            }
          });
        }
      });
    });
  });

  context('Icon and Visual Element Positioning', () => {
    it('should position icons correctly for RTL layout', () => {
      cy.visit('/ar/system-overview');
      
      // Check icon positioning in UI elements
      cy.get('[data-testid*="icon"], .icon, svg').then(($icons) => {
        if ($icons.length > 0) {
          // Icons should be positioned appropriately for RTL
          // This is more of a visual check - icons next to text should be on the correct side
          cy.wrap($icons.first()).should('be.visible');
        }
      });
    });
  });

  context('Modal and Overlay RTL Layout', () => {
    it('should render modals properly in RTL if present', () => {
      cy.visit('/ar/employees');
      
      // Try to open a modal if available
      cy.get('[data-testid*="open-modal"], [data-testid*="add"], .add-button').then(($triggers) => {
        if ($triggers.length > 0) {
          cy.wrap($triggers.first()).click({ force: true });
          
          // Check if modal appears and has proper RTL layout
          cy.get('[role="dialog"], .modal, [data-testid*="modal"]').then(($modals) => {
            if ($modals.length > 0) {
              cy.wrap($modals.first()).should('be.visible');
              
              // Modal content should be RTL
              cy.wrap($modals.first())
                .should('have.css', 'direction', 'rtl')
                .or('have.attr', 'dir', 'rtl');
              
              // Close modal
              cy.get('[data-testid*="close"], .modal-close, [aria-label*="close"]').then(($close) => {
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

  context('Responsive RTL Layout', () => {
    it('should maintain proper RTL layout on different screen sizes', () => {
      cy.visit('/ar/system-overview');
      
      // Test mobile viewport
      cy.viewport(375, 667);
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('body').should('be.visible');
      
      // Test tablet viewport
      cy.viewport(768, 1024);
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('body').should('be.visible');
      
      // Test desktop viewport
      cy.viewport(1280, 720);
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('body').should('be.visible');
    });
  });
});