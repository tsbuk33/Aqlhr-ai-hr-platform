// Cypress Component Testing support file

import './commands';
import { mount } from 'cypress/react18';

// Add mount command
Cypress.Commands.add('mount', mount);

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}