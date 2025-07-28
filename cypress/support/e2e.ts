// Cypress E2E support file

// Add custom commands
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add('switchLanguage', (language: 'en' | 'ar') => {
  cy.get('[data-testid="language-switcher"]').click();
  cy.get(`[data-testid="language-${language}"]`).click();
});

Cypress.Commands.add('toggleTheme', () => {
  cy.get('[data-testid="theme-toggle"]').click();
});

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      switchLanguage(language: 'en' | 'ar'): Chainable<void>;
      toggleTheme(): Chainable<void>;
    }
  }
}