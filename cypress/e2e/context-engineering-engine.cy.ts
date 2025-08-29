/**
 * Context Engineering Engine (CEE) E2E Tests
 * Tests the complete AI orchestrator functionality including:
 * - Intent classification and badge display
 * - Provider routing based on module context
 * - SSE streaming responses
 * - Database telemetry (ai_routing_stats)
 * - Bilingual support (EN/AR) with RTL layout
 * - Arabic-Indic numerals in /ar routes
 */

describe('Context Engineering Engine (CEE)', () => {
  beforeEach(() => {
    // Mock authentication state
    cy.window().then((win) => {
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          app_metadata: {
            role: 'user'
          }
        }
      }));
    });

    // Mock Supabase client and Context Engine responses
    cy.intercept('POST', '**/supabase/functions/intent-classifier-v1/**', {
      statusCode: 200,
      body: {
        intent: 'question',
        urgency: 0.6,
        complexity: 0.4,
        confidence: 0.8,
        moduleContext: 'gov.qiwa',
        explanation: 'User is asking a question about government procedures'
      }
    }).as('intentClassification');

    cy.intercept('POST', '**/supabase/functions/ai-config-v1/**', {
      statusCode: 200,
      body: {
        gensparkFirst: true,
        defaultCostTarget: 'balanced',
        allowStreaming: true,
        modules: {
          'gov.qiwa': {
            costTarget: 'balanced',
            enabledProviders: ['genspark', 'openai', 'gemini']
          },
          'employee': {
            costTarget: 'low',
            enabledProviders: ['genspark', 'manus', 'openai']
          }
        }
      }
    }).as('aiConfig');

    // Mock provider response for streaming
    cy.intercept('POST', '**/supabase/functions/ai-query-orchestrator-v1/**', {
      statusCode: 200,
      body: {
        success: true,
        provider: 'genspark',
        response: 'This is a mock response from the Genspark AI provider.',
        metadata: {
          tokensUsed: 150,
          responseTime: 1200,
          cost: 0.003
        }
      }
    }).as('aiOrchestrator');

    // Mock database telemetry insertion
    cy.intercept('POST', '**/rest/v1/ai_routing_stats', {
      statusCode: 201,
      body: {
        id: 'mock-stats-id',
        created_at: new Date().toISOString()
      }
    }).as('routingStats');
  });

  describe('English Government/Qiwa Route (/en/government/qiwa)', () => {
    beforeEach(() => {
      cy.visit('/en/government/qiwa');
      cy.wait(1000); // Allow page to load
    });

    it('should load the government/qiwa module with correct context detection', () => {
      // Verify we're on the correct page
      cy.url().should('include', '/en/government/qiwa');
      
      // Check for module-specific content or layout
      cy.get('[data-testid="module-context"]').should('contain', 'Government Services');
      
      // Verify page direction is LTR for English
      cy.get('html').should('have.attr', 'dir', 'ltr');
      cy.get('body').should('have.class', 'en');
    });

    it('should open AI Assistant and display intent badges correctly', () => {
      // Open the AI Assistant
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-assistant-modal"]').should('be.visible');
      
      // Type a question to trigger intent classification
      const testQuestion = 'How do I register my company with Qiwa?';
      cy.get('[data-testid="ai-input"]').type(testQuestion);
      cy.get('[data-testid="ai-submit"]').click();
      
      // Wait for intent classification
      cy.wait('@intentClassification');
      cy.wait('@aiConfig');
      
      // Verify intent badges are visible and contain correct information
      cy.get('[data-testid="intent-badges"]').should('be.visible');
      cy.get('[data-testid="intent-badge"]').should('contain', 'Question');
      cy.get('[data-testid="urgency-badge"]').should('contain', '0.6');
      cy.get('[data-testid="complexity-badge"]').should('contain', '0.4');
      cy.get('[data-testid="confidence-badge"]').should('contain', '0.8');
      
      // Verify module context is detected correctly
      cy.get('[data-testid="module-badge"]').should('contain', 'Government Services');
    });

    it('should execute query with streaming response and show provider routing', () => {
      // Open AI Assistant and submit query
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-input"]').type('What are the Qiwa registration requirements?');
      cy.get('[data-testid="ai-submit"]').click();
      
      // Wait for classification and routing
      cy.wait('@intentClassification');
      cy.wait('@aiConfig');
      cy.wait('@aiOrchestrator');
      
      // Verify routing plan is displayed
      cy.get('[data-testid="routing-plan"]').should('be.visible');
      cy.get('[data-testid="primary-provider"]').should('contain', 'Genspark');
      cy.get('[data-testid="cost-target"]').should('contain', 'Balanced');
      
      // Verify streaming response appears
      cy.get('[data-testid="ai-response"]').should('be.visible');
      cy.get('[data-testid="ai-response"]').should('contain', 'mock response');
      
      // Verify success indicator
      cy.get('[data-testid="response-status"]').should('contain', 'Success');
    });

    it('should create routing statistics entry in database', () => {
      // Submit a query
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-input"]').type('Test query for statistics');
      cy.get('[data-testid="ai-submit"]').click();
      
      // Wait for all API calls
      cy.wait('@intentClassification');
      cy.wait('@aiConfig');
      cy.wait('@aiOrchestrator');
      cy.wait('@routingStats');
      
      // Verify telemetry data was sent (check network request)
      cy.get('@routingStats').should((interception) => {
        expect(interception.request.body).to.have.property('provider', 'genspark');
        expect(interception.request.body).to.have.property('success', true);
        expect(interception.request.body).to.have.property('module_context', 'gov.qiwa');
      });
    });
  });

  describe('Arabic Employees Route (/ar/employees)', () => {
    beforeEach(() => {
      cy.visit('/ar/employees');
      cy.wait(1000); // Allow page to load
    });

    it('should load the employees module with RTL layout and Arabic context', () => {
      // Verify we're on the correct Arabic page
      cy.url().should('include', '/ar/employees');
      
      // Check RTL layout
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('body').should('have.class', 'ar');
      
      // Verify module context for employees
      cy.get('[data-testid="module-context"]').should('contain', 'الموظفين'); // Arabic for "Employees"
    });

    it('should display Arabic-Indic numerals in intent badges', () => {
      // Open AI Assistant
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-assistant-modal"]').should('be.visible');
      
      // Submit Arabic query
      const arabicQuery = 'كيف يمكنني تسجيل موظف جديد؟'; // "How can I register a new employee?"
      cy.get('[data-testid="ai-input"]').type(arabicQuery);
      cy.get('[data-testid="ai-submit"]').click();
      
      // Wait for processing
      cy.wait('@intentClassification');
      cy.wait('@aiConfig');
      
      // Verify Arabic-Indic numerals in badges
      // Arabic-Indic: ٠١٢٣٤٥٦٧٨٩ (0123456789)
      cy.get('[data-testid="urgency-badge"]').should('contain', '٠.٦'); // 0.6 in Arabic-Indic
      cy.get('[data-testid="complexity-badge"]').should('contain', '٠.٤'); // 0.4 in Arabic-Indic
      cy.get('[data-testid="confidence-badge"]').should('contain', '٠.٨'); // 0.8 in Arabic-Indic
      
      // Verify Arabic labels
      cy.get('[data-testid="intent-badge"]').should('contain', 'سؤال'); // Arabic for "Question"
      cy.get('[data-testid="module-badge"]').should('contain', 'الموظفين'); // Arabic for "Employees"
    });

    it('should route to employee-specific providers with cost optimization', () => {
      // Override config for employee module
      cy.intercept('POST', '**/supabase/functions/intent-classifier-v1/**', {
        statusCode: 200,
        body: {
          intent: 'task',
          urgency: 0.3,
          complexity: 0.2,
          confidence: 0.9,
          moduleContext: 'employee',
          explanation: 'Employee management task with low complexity'
        }
      }).as('employeeIntentClassification');

      cy.intercept('POST', '**/supabase/functions/ai-query-orchestrator-v1/**', {
        statusCode: 200,
        body: {
          success: true,
          provider: 'manus', // Employee module prefers manus for cost optimization
          response: 'إجابة تجريبية من موفر مانوس للذكاء الاصطناعي', // Arabic mock response
          metadata: {
            tokensUsed: 75,
            responseTime: 800,
            cost: 0.001
          }
        }
      }).as('employeeOrchestrator');

      // Submit employee-related query
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-input"]').type('إضافة موظف جديد إلى النظام'); // "Add new employee to system"
      cy.get('[data-testid="ai-submit"]').click();
      
      // Wait for routing
      cy.wait('@employeeIntentClassification');
      cy.wait('@aiConfig');
      cy.wait('@employeeOrchestrator');
      
      // Verify cost-optimized routing
      cy.get('[data-testid="primary-provider"]').should('contain', 'Manus');
      cy.get('[data-testid="cost-target"]').should('contain', 'منخفض'); // Arabic for "Low"
      
      // Verify Arabic response
      cy.get('[data-testid="ai-response"]').should('contain', 'إجابة تجريبية');
    });

    it('should maintain RTL layout throughout interaction flow', () => {
      // Open assistant
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      
      // Verify RTL layout is maintained in modal
      cy.get('[data-testid="ai-assistant-modal"]').should('have.css', 'direction', 'rtl');
      
      // Check input field alignment (should be right-aligned)
      cy.get('[data-testid="ai-input"]').should('have.css', 'text-align', 'right');
      
      // Submit query and verify response layout
      cy.get('[data-testid="ai-input"]').type('اختبار التخطيط من اليمين إلى اليسار');
      cy.get('[data-testid="ai-submit"]').click();
      
      cy.wait('@intentClassification');
      cy.wait('@aiOrchestrator');
      
      // Verify response container maintains RTL
      cy.get('[data-testid="ai-response"]').should('have.css', 'direction', 'rtl');
      cy.get('[data-testid="intent-badges"]').should('have.css', 'direction', 'rtl');
    });
  });

  describe('Cross-Module Feature Flag Testing', () => {
    it('should respect feature flags for provider availability', () => {
      // Mock config with limited providers
      cy.intercept('POST', '**/supabase/functions/ai-config-v1/**', {
        statusCode: 200,
        body: {
          gensparkFirst: false, // Disable Genspark-first routing
          defaultCostTarget: 'high',
          allowStreaming: false,
          modules: {
            'gov.qiwa': {
              costTarget: 'high',
              enabledProviders: ['openai'] // Only OpenAI available
            }
          }
        }
      }).as('limitedAiConfig');

      cy.visit('/en/government/qiwa');
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-input"]').type('Test with limited providers');
      cy.get('[data-testid="ai-submit"]').click();
      
      cy.wait('@intentClassification');
      cy.wait('@limitedAiConfig');
      
      // Verify routing plan shows only available providers
      cy.get('[data-testid="routing-plan"]').should('contain', 'OpenAI');
      cy.get('[data-testid="routing-plan"]').should('not.contain', 'Genspark');
      cy.get('[data-testid="cost-target"]').should('contain', 'High');
    });

    it('should handle streaming disabled gracefully', () => {
      // Mock config with streaming disabled
      cy.intercept('POST', '**/supabase/functions/ai-config-v1/**', {
        statusCode: 200,
        body: {
          gensparkFirst: true,
          defaultCostTarget: 'balanced',
          allowStreaming: false, // Streaming disabled
          modules: {}
        }
      }).as('noStreamingConfig');

      cy.visit('/en/government/qiwa');
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-input"]').type('Test without streaming');
      cy.get('[data-testid="ai-submit"]').click();
      
      cy.wait('@intentClassification');
      cy.wait('@noStreamingConfig');
      cy.wait('@aiOrchestrator');
      
      // Verify no streaming indicators
      cy.get('[data-testid="streaming-indicator"]').should('not.exist');
      cy.get('[data-testid="response-mode"]').should('contain', 'Batch');
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should handle intent classification failures gracefully', () => {
      // Mock classification failure
      cy.intercept('POST', '**/supabase/functions/intent-classifier-v1/**', {
        statusCode: 500,
        body: { error: 'Classification service unavailable' }
      }).as('classificationError');

      cy.visit('/en/government/qiwa');
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-input"]').type('Test query with classification error');
      cy.get('[data-testid="ai-submit"]').click();
      
      cy.wait('@classificationError');
      
      // Verify fallback behavior
      cy.get('[data-testid="intent-badges"]').should('contain', 'Unknown');
      cy.get('[data-testid="error-message"]').should('contain', 'Classification temporarily unavailable');
      
      // Should still attempt query with default routing
      cy.wait('@aiConfig');
    });

    it('should show provider fallback when primary provider fails', () => {
      // Mock primary provider failure, successful fallback
      cy.intercept('POST', '**/supabase/functions/ai-query-orchestrator-v1/**', {
        statusCode: 200,
        body: {
          success: true,
          provider: 'openai', // Fallback provider
          response: 'Response from fallback provider',
          metadata: {
            primaryProvider: 'genspark',
            fallbackReason: 'Primary provider timeout',
            tokensUsed: 200,
            responseTime: 2000,
            cost: 0.005
          }
        }
      }).as('fallbackResponse');

      cy.visit('/en/government/qiwa');
      cy.get('[data-testid="ai-assistant-trigger"]').click();
      cy.get('[data-testid="ai-input"]').type('Test fallback scenario');
      cy.get('[data-testid="ai-submit"]').click();
      
      cy.wait('@intentClassification');
      cy.wait('@aiConfig');
      cy.wait('@fallbackResponse');
      
      // Verify fallback information is displayed
      cy.get('[data-testid="fallback-notice"]').should('contain', 'fallback provider');
      cy.get('[data-testid="primary-provider"]').should('contain', 'OpenAI');
      cy.get('[data-testid="fallback-reason"]').should('contain', 'timeout');
    });
  });
});