describe('Prompt Logs E2E Tests', () => {
  beforeEach(() => {
    // Mock authentication
    cy.visit('/prompt-logs');
    
    // Wait for page to load
    cy.get('[data-testid="prompt-logs-page"]', { timeout: 10000 }).should('exist');
  });

  it('should load the prompt logs page', () => {
    cy.contains('Prompt Logs').should('be.visible');
    cy.contains('Track and manage AI prompt interactions').should('be.visible');
  });

  it('should create a new prompt log', () => {
    // Click create button
    cy.contains('New Prompt Log').click();
    
    // Fill in the form
    cy.get('[data-testid="user-prompt-input"]').type('Test user prompt for E2E testing');
    cy.get('[data-testid="ai-response-input"]').type('Test AI response for E2E testing');
    
    // Select category
    cy.get('[data-testid="category-select"]').click();
    cy.contains('Feature Request').click();
    
    // Select priority
    cy.get('[data-testid="priority-select"]').click();
    cy.contains('High').click();
    
    // Add implementation notes
    cy.get('[data-testid="implementation-notes"]').type('E2E test implementation notes');
    
    // Submit form
    cy.contains('Create Log').click();
    
    // Verify success message
    cy.contains('Prompt log created successfully').should('be.visible');
    
    // Verify log appears in list
    cy.contains('Test user prompt for E2E testing').should('be.visible');
  });

  it('should filter logs by status', () => {
    // Ensure there are logs to filter
    cy.get('[data-testid="log-item"]').should('have.length.at.least', 1);
    
    // Open status filter
    cy.get('[data-testid="status-filter"]').click();
    cy.contains('Completed').click();
    
    // Verify filtering worked
    cy.get('[data-testid="log-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'completed');
    });
  });

  it('should search logs', () => {
    // Type in search box
    cy.get('[data-testid="search-input"]').type('test');
    
    // Verify results are filtered
    cy.get('[data-testid="log-item"]').each(($el) => {
      cy.wrap($el).invoke('text').should('match', /test/i);
    });
  });

  it('should edit a log', () => {
    // Click edit on first log
    cy.get('[data-testid="log-item"]').first().within(() => {
      cy.contains('Edit').click();
    });
    
    // Change status
    cy.get('[data-testid="edit-status-select"]').click();
    cy.contains('In Progress').click();
    
    // Add implementation notes
    cy.get('[data-testid="edit-implementation-notes"]').clear().type('Updated via E2E test');
    
    // Save changes
    cy.contains('Save Changes').click();
    
    // Verify success message
    cy.contains('Log updated successfully').should('be.visible');
  });

  it('should delete a log', () => {
    // Get initial count
    cy.get('[data-testid="log-item"]').then(($logs) => {
      const initialCount = $logs.length;
      
      // Click delete on first log
      cy.get('[data-testid="log-item"]').first().within(() => {
        cy.contains('Delete').click();
      });
      
      // Confirm deletion
      cy.on('window:confirm', () => true);
      
      // Verify success message
      cy.contains('Log deleted successfully').should('be.visible');
      
      // Verify log count decreased
      cy.get('[data-testid="log-item"]').should('have.length', initialCount - 1);
    });
  });

  it('should export logs as JSON', () => {
    // Click export JSON button
    cy.contains('Export JSON').click();
    
    // Verify download was triggered (check for success message)
    cy.contains('Logs exported as JSON').should('be.visible');
  });

  it('should export logs as CSV', () => {
    // Click export CSV button
    cy.contains('Export CSV').click();
    
    // Verify download was triggered (check for success message)
    cy.contains('Logs exported as CSV').should('be.visible');
  });

  it('should show empty state when no logs match search', () => {
    // Search for something that won't exist
    cy.get('[data-testid="search-input"]').type('nonexistentlogentry12345');
    
    // Verify empty state
    cy.contains('No logs found matching your criteria').should('be.visible');
  });

  it('should display log details in view dialog', () => {
    // Click view on first log
    cy.get('[data-testid="log-item"]').first().within(() => {
      cy.contains('View').click();
    });
    
    // Verify dialog opened with details
    cy.contains('Prompt Log Details').should('be.visible');
    cy.contains('User Prompt').should('be.visible');
    cy.contains('AI Response').should('be.visible');
  });
});