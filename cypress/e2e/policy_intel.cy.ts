describe('Policy Intelligence System', () => {
  let mockResponse: any;

  before(() => {
    cy.fixture('policy-risk-mock.json').then((data) => {
      mockResponse = data;
    });
  });

  beforeEach(() => {
    // Mock the Edge function response in demo mode
    cy.intercept('POST', '/supabase/functions/v1/policy-risk-analyze-v1', {
      statusCode: 200,
      body: mockResponse.policyRiskResult
    }).as('policyAnalysis');
  });

  describe('English Version', () => {
    it('should load Policy Intelligence page', () => {
      cy.visit('/en/compliance/policy-intelligence');
      cy.contains('Policy Intelligence').should('be.visible');
      cy.get('[data-testid="policy-intelligence-page"]').should('exist');
    });

    it('should display policy risk analysis panel', () => {
      cy.visit('/en/compliance/policy-intelligence');
      
      // Check for main sections
      cy.contains('Policy Risk Analysis').should('be.visible');
      cy.get('[data-testid="policy-risk-panel"]').should('exist');
    });

    it('should show source selection options', () => {
      cy.visit('/en/compliance/policy-intelligence');
      
      // Should show upload option by default
      cy.get('[data-testid="source-upload"]').should('be.visible');
      cy.contains('Use uploaded document').should('be.visible');
      
      // Should show paste text option
      cy.get('[data-testid="source-paste"]').should('be.visible');
      cy.contains('Paste policy text').should('be.visible');
    });

    it('should handle policy text analysis', () => {
      cy.visit('/en/compliance/policy-intelligence');
      
      // Switch to paste text mode
      cy.get('[data-testid="source-paste"]').click();
      
      // Enter sample policy text
      const sampleText = 'Employee working hours are from 9 AM to 5 PM with one hour lunch break.';
      cy.get('[data-testid="policy-text-input"]').type(sampleText);
      
      // Click analyze
      cy.get('[data-testid="analyze-button"]').click();
      
      // Should show analysis progress
      cy.contains('Analyzing Policy Risk...').should('be.visible');
      
      // Wait for mock response
      cy.wait('@policyAnalysis');
      
      // Should show results
      cy.contains('Policy Risk Analysis Results').should('be.visible');
      cy.get('[data-testid="overall-score"]').should('contain', '65');
    });

    it('should display risk matrix heatmap', () => {
      cy.visit('/en/compliance/policy-intelligence');
      
      // Trigger analysis with mock data
      cy.get('[data-testid="source-paste"]').click();
      cy.get('[data-testid="policy-text-input"]').type('Sample policy text');
      cy.get('[data-testid="analyze-button"]').click();
      cy.wait('@policyAnalysis');
      
      // Check risk matrix components
      cy.get('[data-testid="risk-matrix"]').should('be.visible');
      cy.contains('Compliance Risk').should('be.visible');
      cy.contains('Business Risk').should('be.visible');
      cy.contains('Implementation Risk').should('be.visible');
      
      // Check specific dimensions
      cy.contains('Saudi Labor Law').should('be.visible');
      cy.contains('Data Protection').should('be.visible');
    });

    it('should show mitigation strategies', () => {
      cy.visit('/en/compliance/policy-intelligence');
      
      // Trigger analysis
      cy.get('[data-testid="source-paste"]').click();
      cy.get('[data-testid="policy-text-input"]').type('Sample policy text');
      cy.get('[data-testid="analyze-button"]').click();
      cy.wait('@policyAnalysis');
      
      // Check mitigation strategies
      cy.contains('Mitigation Strategies').should('be.visible');
      cy.contains('Enhance Data Protection Compliance').should('be.visible');
      cy.contains('Priority: High').should('be.visible');
      cy.contains('ROI: 85%').should('be.visible');
    });

    it('should support task creation from mitigation strategies', () => {
      cy.visit('/en/compliance/policy-intelligence');
      
      // Trigger analysis
      cy.get('[data-testid="source-paste"]').click();
      cy.get('[data-testid="policy-text-input"]').type('Sample policy text');
      cy.get('[data-testid="analyze-button"]').click();
      cy.wait('@policyAnalysis');
      
      // Find and click create task button
      cy.get('[data-testid="create-task-button"]').first().should('be.visible');
      // Note: In a full test, we would click and verify task creation
      // For smoke test, just verify the button exists
    });

    it('should display citations with relevance scores', () => {
      cy.visit('/en/compliance/policy-intelligence');
      
      // Trigger analysis
      cy.get('[data-testid="source-paste"]').click();
      cy.get('[data-testid="policy-text-input"]').type('Sample policy text');
      cy.get('[data-testid="analyze-button"]').click();
      cy.wait('@policyAnalysis');
      
      // Check citations section
      cy.contains('Supporting Evidence').should('be.visible');
      cy.contains('Saudi Labor Law').should('be.visible');
      cy.contains('92%').should('be.visible'); // Relevance score
    });
  });

  describe('Arabic Version (RTL)', () => {
    it('should load Arabic Policy Intelligence page with RTL layout', () => {
      cy.visit('/ar/compliance/policy-intelligence');
      
      // Check RTL attributes
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('html').should('have.attr', 'lang', 'ar');
      
      // Check Arabic content
      cy.contains('ذكاء السياسات').should('be.visible');
      cy.get('[data-testid="policy-intelligence-page"]').should('exist');
    });

    it('should display Arabic interface with proper translations', () => {
      cy.visit('/ar/compliance/policy-intelligence');
      
      // Check Arabic translations
      cy.contains('تحليل مخاطر السياسة').should('be.visible');
      cy.contains('استخدم وثيقة مرفوعة').should('be.visible');
      cy.contains('ألصق نص السياسة').should('be.visible');
    });

    it('should handle Arabic policy text analysis', () => {
      cy.visit('/ar/compliance/policy-intelligence');
      
      // Switch to paste text mode
      cy.get('[data-testid="source-paste"]').click();
      
      // Enter Arabic sample text
      const arabicText = 'ساعات العمل من التاسعة صباحاً حتى الخامسة مساءً مع استراحة غداء لمدة ساعة واحدة.';
      cy.get('[data-testid="policy-text-input"]').type(arabicText);
      
      // Click analyze
      cy.get('[data-testid="analyze-button"]').click();
      
      // Should show Arabic progress text
      cy.contains('جاري تحليل مخاطر السياسة...').should('be.visible');
      
      // Wait for mock response
      cy.wait('@policyAnalysis');
      
      // Should show Arabic results
      cy.contains('نتائج تحليل مخاطر السياسة').should('be.visible');
      cy.get('[data-testid="overall-score"]').should('contain', '٦٥'); // Arabic-Indic numeral
    });

    it('should display Arabic risk matrix with proper translations', () => {
      cy.visit('/ar/compliance/policy-intelligence');
      
      // Trigger analysis
      cy.get('[data-testid="source-paste"]').click();
      cy.get('[data-testid="policy-text-input"]').type('نص سياسة عينة');
      cy.get('[data-testid="analyze-button"]').click();
      cy.wait('@policyAnalysis');
      
      // Check Arabic risk matrix
      cy.contains('مخاطر الامتثال').should('be.visible');
      cy.contains('مخاطر الأعمال').should('be.visible');
      cy.contains('مخاطر التنفيذ').should('be.visible');
      
      // Check Arabic dimension names
      cy.contains('قانون العمل السعودي').should('be.visible');
      cy.contains('حماية البيانات').should('be.visible');
    });

    it('should show Arabic mitigation strategies with proper formatting', () => {
      cy.visit('/ar/compliance/policy-intelligence');
      
      // Trigger analysis
      cy.get('[data-testid="source-paste"]').click();
      cy.get('[data-testid="policy-text-input"]').type('نص سياسة عينة');
      cy.get('[data-testid="analyze-button"]').click();
      cy.wait('@policyAnalysis');
      
      // Check Arabic mitigation content
      cy.contains('استراتيجيات التخفيف').should('be.visible');
      cy.contains('الأولوية: عالي').should('be.visible');
      cy.contains('عائد الاستثمار: ٨٥٪').should('be.visible'); // Arabic-Indic numerals
    });
  });

  describe('Cross-Language Functionality', () => {
    it('should maintain analysis state when switching languages', () => {
      // Start analysis in English
      cy.visit('/en/compliance/policy-intelligence');
      cy.get('[data-testid="source-paste"]').click();
      cy.get('[data-testid="policy-text-input"]').type('Sample policy');
      cy.get('[data-testid="analyze-button"]').click();
      cy.wait('@policyAnalysis');
      
      // Verify results are shown
      cy.contains('Policy Risk Analysis Results').should('be.visible');
      
      // Switch to Arabic (simulated by visiting AR page)
      cy.visit('/ar/compliance/policy-intelligence');
      
      // The state would be maintained in a real app through proper state management
      // For this smoke test, we just verify the Arabic page loads correctly
      cy.contains('ذكاء السياسات').should('be.visible');
    });

    it('should handle edge function errors gracefully', () => {
      // Mock an error response
      cy.intercept('POST', '/supabase/functions/v1/policy-risk-analyze-v1', {
        statusCode: 500,
        body: { error: 'Analysis failed' }
      }).as('policyAnalysisError');
      
      cy.visit('/en/compliance/policy-intelligence');
      cy.get('[data-testid="source-paste"]').click();
      cy.get('[data-testid="policy-text-input"]').type('Sample policy');
      cy.get('[data-testid="analyze-button"]').click();
      
      cy.wait('@policyAnalysisError');
      
      // Should show error message (implementation dependent)
      // In a real implementation, there should be error handling UI
      cy.get('[data-testid="error-message"]').should('be.visible');
    });
  });

  describe('Integration with Existing Components', () => {
    it('should work alongside AqlHRAIAssistant', () => {
      cy.visit('/en/compliance/policy-intelligence');
      
      // Both components should be present
      cy.get('[data-testid="policy-risk-panel"]').should('exist');
      cy.get('[data-testid="aql-assistant"]').should('exist');
      
      // Should be able to interact with both
      cy.get('[data-testid="source-paste"]').should('be.visible');
    });

    it('should maintain responsive design on different screen sizes', () => {
      // Test mobile viewport
      cy.viewport(375, 667);
      cy.visit('/en/compliance/policy-intelligence');
      
      cy.get('[data-testid="policy-risk-panel"]').should('be.visible');
      
      // Test tablet viewport
      cy.viewport(768, 1024);
      cy.get('[data-testid="policy-risk-panel"]').should('be.visible');
      
      // Test desktop viewport
      cy.viewport(1920, 1080);
      cy.get('[data-testid="policy-risk-panel"]').should('be.visible');
    });
  });
});