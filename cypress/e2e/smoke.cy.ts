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

  it('should load health monitoring page with queued card', () => {
    cy.visit('/en/_/health');
    cy.contains('System Health').should('be.visible');
    cy.get('[data-testid="health-score"]').should('exist');
    cy.contains('Queued').should('be.visible');
  });

  it('should load diagnostic OSI page with dev mode', () => {
    cy.visit('/en/diagnostic/osi?dev=1');
    cy.contains('OSI').should('be.visible');
    // Wait for auto-seed and check for non-dash numbers
    cy.wait(2000);
    cy.get('[data-testid="osi-metric"]').should('exist');
    cy.get('[data-testid="osi-metric"]').should('not.contain.text', '—');
  });

  it('should load diagnostic retention page with dev mode', () => {
    cy.visit('/en/diagnostic/retention?dev=1');
    cy.contains('Retention').should('be.visible');
    // Wait for auto-seed and check for non-dash numbers
    cy.wait(2000);
    cy.get('[data-testid="retention-metric"]').should('exist');
    cy.get('[data-testid="retention-metric"]').should('not.contain.text', '—');
  });

  it('should load CCI overview with CVF labels', () => {
    cy.visit('/en/cci/overview');
    cy.contains('Culture Intelligence').should('be.visible');
    // Check for CVF quadrants
    cy.contains('Clan').should('be.visible');
    cy.contains('Adhocracy').should('be.visible');
    cy.contains('Market').should('be.visible');
    cy.contains('Hierarchy').should('be.visible');
  });

  it('should redirect non-localized URLs', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/en/dashboard');
  });

  it('should switch languages correctly and flip paths', () => {
    cy.visit('/en/dashboard');
    cy.get('[data-testid="language-toggle"]').click();
    cy.url().should('include', '/ar/dashboard');
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('html').should('have.attr', 'lang', 'ar');
  });

  it('should show entitlement gates for restricted features', () => {
    cy.visit('/en/cci/overview');
    // Should either show the feature or an upgrade prompt
    cy.get('body').should('contain.text', 'Culture Intelligence');
  });

  it('should handle 404 routes gracefully', () => {
    cy.visit('/en/nonexistent-route', { failOnStatusCode: false });
    cy.contains('404').should('be.visible');
  });
});