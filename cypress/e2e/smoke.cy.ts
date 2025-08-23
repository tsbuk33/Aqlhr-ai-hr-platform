describe('AqlHR Kernel Smoke Tests', () => {
  it('should load English dashboard', () => {
    cy.visit('/en/dashboard');
    cy.contains('Dashboard').should('be.visible');
    cy.get('[data-testid="dashboard-content"]').should('exist');
  });

  it('should load Arabic dashboard with RTL', () => {
    cy.visit('/ar/dashboard');
    cy.contains('لوحة التحكم').should('be.visible');
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('html').should('have.attr', 'lang', 'ar');
  });

  it('should load health monitoring page', () => {
    cy.visit('/en/_/health');
    cy.contains('System Health').should('be.visible');
    cy.get('[data-testid="health-score"]').should('exist');
  });

  it('should redirect non-localized URLs', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/en/dashboard');
  });

  it('should switch languages correctly', () => {
    cy.visit('/en/dashboard');
    cy.get('[data-testid="language-toggle"]').click();
    cy.url().should('include', '/ar/dashboard');
    cy.get('html').should('have.attr', 'dir', 'rtl');
  });

  it('should show entitlement gates for restricted features', () => {
    cy.visit('/en/cci/overview');
    // Should either show the feature or an upgrade prompt
    cy.get('body').should('contain.text', 'Culture Intelligence');
  });
});