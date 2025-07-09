describe('RTL i18n Validation', () => {
  beforeEach(() => {
    // Set language to Arabic before each test
    cy.window().then((win) => {
      win.localStorage.setItem('language', 'ar');
    });
  });

  it('should not contain raw i18n keys in Arabic mode', () => {
    cy.visit('/');
    
    // Wait for the page to fully load
    cy.get('[data-testid="main-content"]').should('exist');
    
    // Check that no elements contain dotted keys (indicating missing translations)
    cy.get('body').should('not.contain.text', /\w+\.\w+/);
    
    // Test navigation sidebar
    cy.get('[data-testid="sidebar"]').should('exist');
    cy.get('[data-testid="sidebar"]').should('not.contain.text', /nav\./);
    cy.get('[data-testid="sidebar"]').should('not.contain.text', /core_hr\./);
    cy.get('[data-testid="sidebar"]').should('not.contain.text', /ai\./);
  });

  it('should properly translate key pages in Arabic', () => {
    const testRoutes = [
      '/core-hr/benefits',
      '/ai-automation/smart-recommendations', 
      '/ai-automation/predictive-analytics',
      '/ai-automation/document-intelligence',
      '/government/qiwa',
      '/government/gosi',
      '/government/mol'
    ];
    
    testRoutes.forEach(route => {
      cy.visit(route);
      
      // Wait for page to load
      cy.get('h1').should('exist');
      
      // Check no raw translation keys are visible
      cy.get('body').should('not.contain.text', /\w+\.\w+/);
      
      // Check that metric cards don't have raw keys
      cy.get('[data-testid="metric-card"]').each(($card) => {
        cy.wrap($card).should('not.contain.text', /\w+\.\w+/);
      });
    });
  });

  it('should handle RTL layout correctly', () => {
    cy.visit('/');
    
    // Check that document has RTL direction
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('html').should('have.attr', 'lang', 'ar');
    
    // Check that metric cards handle Arabic text properly
    cy.get('[data-testid="metric-card"]').should('exist');
    cy.get('[data-testid="metric-card"]').first().should('have.css', 'text-align', 'right');
  });

  it('should not show English fallbacks when Arabic translations exist', () => {
    cy.visit('/core-hr/benefits');
    
    // These should be in Arabic, not English
    cy.get('body').should('not.contain.text', 'Benefits Administration');
    cy.get('body').should('not.contain.text', 'Enrolled Employees');
    cy.get('body').should('not.contain.text', 'Active Benefits');
    
    // Should contain Arabic text instead
    cy.get('body').should('contain.text', 'إدارة المزايا');
  });

  it('should properly handle navigation in Arabic', () => {
    cy.visit('/');
    
    // Open navigation if collapsed
    cy.get('[data-testid="sidebar-trigger"]').click();
    
    // Check main navigation items are in Arabic
    cy.get('[data-testid="nav-core-hr"]').should('contain.text', 'وحدات الموارد البشرية الأساسية');
    cy.get('[data-testid="nav-ai-automation"]').should('contain.text', 'الذكاء الاصطناعي والأتمتة');
    cy.get('[data-testid="nav-government"]').should('contain.text', 'التكامل الحكومي');
  });
});