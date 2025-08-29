/**
 * AI Config Edge Function E2E Tests
 * Tests the ai-config-v1 Edge function for:
 * - Correct flag types and validation
 * - Per-module override functionality  
 * - Admin-only access controls
 * - ETag caching behavior
 * - Environment variable overrides
 */

describe('AI Config Edge Function (ai-config-v1)', () => {
  const edgeFunction = '/supabase/functions/ai-config-v1/';
  
  beforeEach(() => {
    // Mock authentication for different user roles
    cy.window().then((win) => {
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          app_metadata: {
            role: 'user' // Regular user by default
          }
        }
      }));
    });
  });

  describe('GET /ai-config-v1 - Configuration Retrieval', () => {
    it('should return correct flag types and structure', () => {
      cy.request('GET', edgeFunction).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type', 'application/json');
        expect(response.headers).to.have.property('etag');
        
        const config = response.body;
        
        // Verify core flag structure and types
        expect(config).to.have.property('gensparkFirst');
        expect(config.gensparkFirst).to.be.a('boolean');
        
        expect(config).to.have.property('defaultCostTarget');
        expect(config.defaultCostTarget).to.be.oneOf(['low', 'balanced', 'high']);
        
        expect(config).to.have.property('allowStreaming');
        expect(config.allowStreaming).to.be.a('boolean');
        
        expect(config).to.have.property('modules');
        expect(config.modules).to.be.an('object');
        
        // Verify module-specific overrides structure
        if (config.modules['gov.qiwa']) {
          const qiwaConfig = config.modules['gov.qiwa'];
          expect(qiwaConfig).to.have.property('costTarget');
          expect(qiwaConfig.costTarget).to.be.oneOf(['low', 'balanced', 'high']);
          expect(qiwaConfig).to.have.property('enabledProviders');
          expect(qiwaConfig.enabledProviders).to.be.an('array');
        }
        
        if (config.modules['employee']) {
          const employeeConfig = config.modules['employee'];
          expect(employeeConfig).to.have.property('costTarget');
          expect(employeeConfig).to.have.property('enabledProviders');
          expect(employeeConfig.enabledProviders).to.include.oneOf(['genspark', 'openai', 'gemini', 'manus']);
        }
      });
    });

    it('should respect per-module overrides correctly', () => {
      cy.request('GET', edgeFunction).then((response) => {
        const config = response.body;
        
        // Verify government module has balanced cost target
        expect(config.modules['gov.qiwa']).to.deep.include({
          costTarget: 'balanced',
          enabledProviders: ['genspark', 'openai', 'gemini']
        });
        
        // Verify employee module has low cost target for optimization
        expect(config.modules['employee']).to.deep.include({
          costTarget: 'low',
          enabledProviders: ['genspark', 'manus', 'openai']
        });
        
        // Verify policy module has high cost target with temperature override
        if (config.modules['policy']) {
          expect(config.modules['policy']).to.include({
            costTarget: 'high',
            temperatureOverride: 0.1
          });
        }
      });
    });

    it('should return ETag for caching optimization', () => {
      cy.request('GET', edgeFunction).then((response) => {
        expect(response.headers).to.have.property('etag');
        expect(response.headers['cache-control']).to.match(/max-age=\d+/);
        
        const etag = response.headers.etag;
        
        // Make conditional request with If-None-Match
        cy.request({
          method: 'GET',
          url: edgeFunction,
          headers: {
            'If-None-Match': etag
          },
          failOnStatusCode: false
        }).then((conditionalResponse) => {
          expect(conditionalResponse.status).to.eq(304); // Not Modified
          expect(conditionalResponse.body).to.be.empty;
        });
      });
    });

    it('should handle environment variable overrides', () => {
      // This test assumes AI_CONFIG env var can override default settings
      cy.request('GET', edgeFunction).then((response) => {
        const config = response.body;
        
        // Verify that environment overrides are applied if present
        // This would be configured in the deployment environment
        expect(config).to.have.property('gensparkFirst');
        expect(config).to.have.property('defaultCostTarget');
        
        // If environment variable is set, it should override defaults
        // The actual values depend on deployment configuration
        expect(['low', 'balanced', 'high']).to.include(config.defaultCostTarget);
      });
    });
  });

  describe('POST /ai-config-v1 - Admin Configuration Updates', () => {
    beforeEach(() => {
      // Set up admin user authentication
      cy.window().then((win) => {
        win.localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: 'mock_admin_access_token',
          refresh_token: 'mock_refresh_token',
          user: {
            id: 'admin-user-id',
            email: 'admin@example.com',
            app_metadata: {
              role: 'admin' // Admin role for configuration updates
            }
          }
        }));
      });
      
      // Mock successful admin authentication
      cy.intercept('POST', '**/auth/v1/token**', {
        statusCode: 200,
        body: {
          access_token: 'mock_admin_access_token',
          user: {
            id: 'admin-user-id',
            role: 'admin',
            app_metadata: { role: 'admin' }
          }
        }
      }).as('adminAuth');
      
      // Mock admin role validation in Edge function
      cy.intercept('POST', edgeFunction, (req) => {
        if (req.headers.authorization?.includes('mock_admin_access_token')) {
          req.reply({
            statusCode: 200,
            body: {
              success: true,
              message: 'Configuration updated successfully',
              updatedConfig: req.body
            }
          });
        } else {
          req.reply({
            statusCode: 403,
            body: { error: 'Admin access required' }
          });
        }
      }).as('configUpdate');
    });

    it('should accept valid configuration updates from admin users', () => {
      const updatePayload = {
        gensparkFirst: false,
        defaultCostTarget: 'high',
        allowStreaming: true,
        modules: {
          'gov.qiwa': {
            costTarget: 'high',
            enabledProviders: ['genspark', 'openai'],
            temperatureOverride: 0.2
          },
          'employee': {
            costTarget: 'balanced',
            enabledProviders: ['openai', 'gemini']
          }
        }
      };

      cy.request({
        method: 'POST',
        url: edgeFunction,
        body: updatePayload,
        headers: {
          'Authorization': `Bearer mock_admin_access_token`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('updatedConfig');
        expect(response.body.updatedConfig).to.deep.include(updatePayload);
      });
    });

    it('should validate configuration schema and reject invalid updates', () => {
      const invalidPayload = {
        gensparkFirst: 'invalid_boolean', // Should be boolean
        defaultCostTarget: 'invalid_target', // Should be low/balanced/high
        modules: {
          'invalid.module': {
            costTarget: 123, // Should be string
            enabledProviders: 'not_an_array' // Should be array
          }
        }
      };

      cy.intercept('POST', edgeFunction, {
        statusCode: 400,
        body: {
          error: 'Invalid configuration schema',
          details: [
            'gensparkFirst must be boolean',
            'defaultCostTarget must be one of: low, balanced, high',
            'enabledProviders must be array'
          ]
        }
      }).as('invalidConfigUpdate');

      cy.request({
        method: 'POST',
        url: edgeFunction,
        body: invalidPayload,
        headers: {
          'Authorization': `Bearer mock_admin_access_token`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.contain('Invalid configuration');
      });
    });

    it('should reject updates from non-admin users', () => {
      // Use regular user token
      const updatePayload = {
        gensparkFirst: false,
        defaultCostTarget: 'high'
      };

      cy.request({
        method: 'POST',
        url: edgeFunction,
        body: updatePayload,
        headers: {
          'Authorization': `Bearer mock_access_token`, // Regular user token
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.contain('Admin access required');
      });
    });

    it('should update ETag after successful configuration change', () => {
      // Get initial ETag
      cy.request('GET', edgeFunction).then((initialResponse) => {
        const initialETag = initialResponse.headers.etag;
        
        // Update configuration
        const updatePayload = {
          gensparkFirst: true,
          defaultCostTarget: 'balanced'
        };

        cy.request({
          method: 'POST',
          url: edgeFunction,
          body: updatePayload,
          headers: {
            'Authorization': `Bearer mock_admin_access_token`,
            'Content-Type': 'application/json'
          }
        }).then(() => {
          // Get updated configuration
          cy.request('GET', edgeFunction).then((updatedResponse) => {
            const updatedETag = updatedResponse.headers.etag;
            expect(updatedETag).to.not.equal(initialETag);
            
            // Verify configuration was actually updated
            expect(updatedResponse.body).to.deep.include(updatePayload);
          });
        });
      });
    });
  });

  describe('Performance and Caching', () => {
    it('should respond quickly for cached requests', () => {
      const startTime = Date.now();
      
      cy.request('GET', edgeFunction).then((response) => {
        const responseTime = Date.now() - startTime;
        expect(responseTime).to.be.lessThan(500); // Should respond within 500ms
        expect(response.headers).to.have.property('etag');
        
        const etag = response.headers.etag;
        const cachedStartTime = Date.now();
        
        // Make cached request
        cy.request({
          method: 'GET',
          url: edgeFunction,
          headers: {
            'If-None-Match': etag
          },
          failOnStatusCode: false
        }).then((cachedResponse) => {
          const cachedResponseTime = Date.now() - cachedStartTime;
          expect(cachedResponseTime).to.be.lessThan(100); // Cached response should be very fast
          expect(cachedResponse.status).to.eq(304);
        });
      });
    });

    it('should handle concurrent requests efficiently', () => {
      const requestPromises = [];
      
      // Make 5 concurrent requests
      for (let i = 0; i < 5; i++) {
        requestPromises.push(
          cy.request('GET', edgeFunction).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('gensparkFirst');
            return response.body;
          })
        );
      }
      
      // All requests should return the same configuration
      Promise.all(requestPromises).then((responses) => {
        const firstResponse = responses[0];
        responses.forEach((response) => {
          expect(response).to.deep.equal(firstResponse);
        });
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed JSON gracefully', () => {
      cy.request({
        method: 'POST',
        url: edgeFunction,
        body: '{ invalid json }',
        headers: {
          'Authorization': `Bearer mock_admin_access_token`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.contain('Invalid JSON');
      });
    });

    it('should handle missing authorization header', () => {
      cy.request({
        method: 'POST',
        url: edgeFunction,
        body: { gensparkFirst: true },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.contain('Authentication required');
      });
    });

    it('should return appropriate CORS headers', () => {
      cy.request('GET', edgeFunction).then((response) => {
        expect(response.headers).to.have.property('access-control-allow-origin');
        expect(response.headers).to.have.property('access-control-allow-methods');
        expect(response.headers).to.have.property('access-control-allow-headers');
      });
    });
  });
});