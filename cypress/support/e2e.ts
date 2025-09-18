// Cypress E2E support file

// Import Arabic utilities
import './arabic-utils';

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

// Console error tracking
Cypress.Commands.add('trackConsoleErrors', () => {
  cy.window().then((win) => {
    (win as any).__cypress_console_errors = [];
    
    const originalError = win.console.error;
    win.console.error = (...args: any[]) => {
      (win as any).__cypress_console_errors.push(args.join(' '));
      originalError.apply(win.console, args);
    };
  });
});

// Performance measurement
Cypress.Commands.add('measurePerformance', (name: string) => {
  cy.window().then((win) => {
    if (win.performance && win.performance.timing) {
      const timing = win.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      cy.log(`${name} load time: ${loadTime}ms`);
      return cy.wrap(loadTime);
    }
    return cy.wrap(0);
  });
});

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      switchLanguage(language: 'en' | 'ar'): Chainable<void>;
      toggleTheme(): Chainable<void>;
      trackConsoleErrors(): Chainable<void>;
      measurePerformance(name: string): Chainable<number>;
    }
  }
}