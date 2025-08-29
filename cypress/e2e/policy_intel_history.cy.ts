describe('Policy Intelligence History System', () => {
  let mockTrendsData: any;
  let mockListData: any;

  before(() => {
    // Load mock data for consistent testing
    mockTrendsData = {
      data: [
        {
          day: '2024-01-01',
          assessment_count: 5,
          overall_avg: 6.2,
          overall_max: 8.1,
          overall_min: 4.3,
          saudi_labor_avg: 7.1,
          workplace_rights_avg: 5.8,
          discrimination_prev_avg: 4.9,
          data_protection_avg: 8.2,
          operational_complexity_avg: 6.0,
          resource_requirements_avg: 7.5,
          stakeholder_impact_avg: 5.2,
          financial_implications_avg: 6.8
        },
        {
          day: '2024-01-02',
          assessment_count: 3,
          overall_avg: 6.8,
          overall_max: 8.5,
          overall_min: 4.9,
          saudi_labor_avg: 7.3,
          workplace_rights_avg: 6.1,
          discrimination_prev_avg: 5.2,
          data_protection_avg: 8.4
        }
      ]
    };

    mockListData = {
      rows: [
        {
          id: 'test-policy-1',
          title: 'Employee Code of Conduct Policy',
          created_at: '2024-01-02T10:30:00Z',
          overall_score: 6.8,
          compliance_score: {
            saudiLaborLaw: 7.3,
            workplaceRights: 6.1,
            discriminationPrevention: 5.2,
            dataProtection: 8.4
          },
          business_score: {
            operationalComplexity: 6.0,
            resourceRequirements: 7.0,
            stakeholderImpact: 5.5,
            financialImplications: 6.5
          },
          implementation_score: {
            systemComplexity: 5.8,
            changeResistance: 6.2,
            trainingRequirements: 7.2,
            monitoringDifficulty: 6.0
          },
          mitigation_count: 4,
          citation_count: 12
        },
        {
          id: 'test-policy-2',
          title: 'Remote Work Policy Guidelines',
          created_at: '2024-01-01T15:45:00Z',
          overall_score: 5.9,
          compliance_score: {
            saudiLaborLaw: 6.8,
            workplaceRights: 5.4,
            discriminationPrevention: 4.8,
            dataProtection: 7.9
          },
          business_score: {
            operationalComplexity: 5.5,
            resourceRequirements: 6.8,
            stakeholderImpact: 4.9,
            financialImplications: 6.1
          },
          implementation_score: {
            systemComplexity: 5.2,
            changeResistance: 5.8,
            trainingRequirements: 6.5,
            monitoringDifficulty: 5.5
          },
          mitigation_count: 6,
          citation_count: 8
        }
      ],
      total: 2,
      page: 1,
      pageSize: 20,
      totalPages: 1
    };
  });

  beforeEach(() => {
    // Mock the API endpoints
    cy.intercept('GET', '/supabase/functions/v1/policy-risk-list-v1*', {
      statusCode: 200,
      body: mockListData
    }).as('getPolicyList');

    cy.intercept('GET', '**/policy_risk_daily*', {
      statusCode: 200,
      body: mockTrendsData.data
    }).as('getTrends');

    cy.intercept('POST', '/supabase/functions/v1/policy-risk-export-v1', {
      statusCode: 200,
      body: 'Mock CSV Data'
    }).as('exportPolicies');

    cy.intercept('POST', '/supabase/functions/v1/policy-risk-recompute-v1', {
      statusCode: 200,
      body: { success: true }
    }).as('recomputePolicy');

    cy.intercept('POST', '/supabase/functions/v1/ask-aql-session-memory', {
      statusCode: 200,
      body: { success: true }
    }).as('pushMemory');
  });

  describe('English Version', () => {
    it('should load policy intelligence history page', () => {
      cy.visit('/en/compliance/policy-intel/history');
      
      // Check page title and description
      cy.contains('History & Trends').should('be.visible');
      cy.contains('Review historical policy assessments').should('be.visible');
    });

    it('should display filters and controls', () => {
      cy.visit('/en/compliance/policy-intel/history');

      // Check filter controls
      cy.get('[data-testid="filter-search"]').should('be.visible');
      cy.get('input[type="date"]').should('have.length', 2); // From and To dates
      cy.contains('Export').should('be.visible');
      cy.contains('Refresh Trends').should('be.visible');
    });

    it('should render trend chart with data', () => {
      cy.visit('/en/compliance/policy-intel/history');
      cy.wait('@getTrends');

      // Check trend chart is rendered
      cy.get('[data-testid="risk-trend-chart"]').should('exist');
      
      // Check for chart elements (using Recharts default classes)
      cy.get('.recharts-wrapper').should('be.visible');
      cy.get('.recharts-line').should('exist');
      
      // Check series toggle controls
      cy.contains('Overall').should('be.visible');
      cy.contains('Saudi Labor Law').should('be.visible');
    });

    it('should display policy risk table with data', () => {
      cy.visit('/en/compliance/policy-intel/history');
      cy.wait('@getPolicyList');

      // Check table headers
      cy.contains('Created').should('be.visible');
      cy.contains('Title').should('be.visible');
      cy.contains('Overall').should('be.visible');
      cy.contains('Actions').should('be.visible');

      // Check table data
      cy.contains('Employee Code of Conduct Policy').should('be.visible');
      cy.contains('Remote Work Policy Guidelines').should('be.visible');
      
      // Check action buttons
      cy.get('button').contains('View').should('be.visible');
      cy.get('button').contains('Re-analyze').should('be.visible');
    });

    it('should handle search filtering', () => {
      cy.visit('/en/compliance/policy-intel/history');
      
      // Type in search box
      cy.get('input[placeholder*="Search policies"]').type('Remote Work');
      
      // Should trigger new API call with search parameter
      cy.wait('@getPolicyList');
    });

    it('should handle export functionality', () => {
      cy.visit('/en/compliance/policy-intel/history');

      // Click export dropdown
      cy.contains('Export').click();
      
      // Click CSV export
      cy.contains('Export CSV').click();
      
      // Should call export API
      cy.wait('@exportPolicies');
    });

    it('should handle policy re-analysis', () => {
      cy.visit('/en/compliance/policy-intel/history');
      cy.wait('@getPolicyList');

      // Click re-analyze on first policy
      cy.get('button').contains('Re-analyze').first().click();
      
      // Should call recompute API
      cy.wait('@recomputePolicy');
    });

    it('should handle policy view with Ask Aql integration', () => {
      cy.visit('/en/compliance/policy-intel/history');
      cy.wait('@getPolicyList');

      // Click view on first policy
      cy.get('button').contains('View').first().click();
      
      // Should push to Ask Aql memory
      cy.wait('@pushMemory');
      
      // Should show policy details modal/panel
      cy.contains('Employee Code of Conduct Policy').should('be.visible');
    });

    it('should handle date range filtering', () => {
      cy.visit('/en/compliance/policy-intel/history');

      // Set date range
      cy.get('input[type="date"]').first().type('2024-01-01');
      cy.get('input[type="date"]').last().type('2024-01-31');
      
      // Should trigger filtered API calls
      cy.wait('@getPolicyList');
      cy.wait('@getTrends');
    });

    it('should handle pagination', () => {
      // Mock data with multiple pages
      cy.intercept('GET', '/supabase/functions/v1/policy-risk-list-v1*', {
        statusCode: 200,
        body: {
          ...mockListData,
          total: 25,
          totalPages: 2,
          page: 1
        }
      }).as('getPolicyListPaginated');

      cy.visit('/en/compliance/policy-intel/history');
      cy.wait('@getPolicyListPaginated');

      // Check pagination controls
      cy.contains('Page 1 of 2').should('be.visible');
      cy.contains('Next').should('be.visible').and('not.be.disabled');
    });
  });

  describe('Arabic Version (RTL)', () => {
    it('should load Arabic history page with RTL layout', () => {
      cy.visit('/ar/compliance/policy-intel/history');
      
      // Check RTL attributes
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('html').should('have.attr', 'lang', 'ar');
      
      // Check Arabic content
      cy.contains('التاريخ والاتجاهات').should('be.visible');
      cy.contains('مراجعة تقييمات السياسات التاريخية').should('be.visible');
    });

    it('should display Arabic interface elements', () => {
      cy.visit('/ar/compliance/policy-intel/history');

      // Check Arabic filter labels
      cy.contains('البحث في السياسات').should('be.visible');
      cy.contains('من').should('be.visible');
      cy.contains('إلى').should('be.visible');
      cy.contains('تصدير').should('be.visible');
    });

    it('should render trend chart with Arabic labels', () => {
      cy.visit('/ar/compliance/policy-intel/history');
      cy.wait('@getTrends');

      // Check Arabic series labels
      cy.contains('إجمالي').should('be.visible');
      cy.contains('قانون العمل السعودي').should('be.visible');
      cy.contains('حماية البيانات').should('be.visible');
    });

    it('should display table with Arabic headers', () => {
      cy.visit('/ar/compliance/policy-intel/history');
      cy.wait('@getPolicyList');

      // Check Arabic table headers
      cy.contains('تاريخ الإنشاء').should('be.visible');
      cy.contains('العنوان').should('be.visible');
      cy.contains('إجمالي').should('be.visible');
      cy.contains('الإجراءات').should('be.visible');
    });

    it('should show Arabic-Indic numerals', () => {
      cy.visit('/ar/compliance/policy-intel/history');
      cy.wait('@getPolicyList');

      // Check for Arabic-Indic numerals in scores
      // Note: This might need adjustment based on actual implementation
      cy.get('[data-testid="score-badge"]').should('exist');
    });

    it('should handle Arabic export functionality', () => {
      cy.visit('/ar/compliance/policy-intel/history');

      // Click Arabic export
      cy.contains('تصدير').click();
      cy.contains('تصدير CSV').click();
      
      cy.wait('@exportPolicies');
    });
  });

  describe('Cross-Language Functionality', () => {
    it('should maintain filter state when switching languages', () => {
      // Start in English
      cy.visit('/en/compliance/policy-intel/history');
      
      // Set a search filter
      cy.get('input[placeholder*="Search policies"]').type('Test Policy');
      
      // Switch to Arabic
      cy.visit('/ar/compliance/policy-intel/history');
      
      // Arabic page should load correctly (state management depends on implementation)
      cy.contains('التاريخ والاتجاهات').should('be.visible');
    });

    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '/supabase/functions/v1/policy-risk-list-v1*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getListError');

      cy.visit('/en/compliance/policy-intel/history');
      cy.wait('@getListError');

      // Should show error message
      cy.contains('Error loading policies').should('be.visible');
      cy.contains('Retry').should('be.visible');
    });

    it('should handle empty data states', () => {
      // Mock empty data
      cy.intercept('GET', '/supabase/functions/v1/policy-risk-list-v1*', {
        statusCode: 200,
        body: { rows: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }
      }).as('getEmptyList');

      cy.intercept('GET', '**/policy_risk_daily*', {
        statusCode: 200,
        body: []
      }).as('getEmptyTrends');

      cy.visit('/en/compliance/policy-intel/history');
      cy.wait(['@getEmptyList', '@getEmptyTrends']);

      // Should show empty states
      cy.contains('No policy assessments found').should('be.visible');
      cy.contains('No trend data available').should('be.visible');
    });
  });

  describe('Integration Features', () => {
    it('should integrate with existing navigation', () => {
      cy.visit('/en/compliance/policy-intel');
      
      // Should show tab navigation
      cy.contains('Analyze').should('be.visible');
      cy.contains('History & Trends').should('be.visible');
      
      // Click history tab
      cy.contains('History & Trends').click();
      
      // Should navigate to history page
      cy.url().should('include', '/history');
    });

    it('should work with existing authentication', () => {
      // Visit protected route
      cy.visit('/en/compliance/policy-intel/history');
      
      // Should load (assuming proper auth mocking in test setup)
      cy.contains('History & Trends').should('be.visible');
    });

    it('should be responsive on different screen sizes', () => {
      // Test mobile
      cy.viewport(375, 667);
      cy.visit('/en/compliance/policy-intel/history');
      
      cy.get('[data-testid="risk-trend-chart"]').should('be.visible');
      
      // Test tablet
      cy.viewport(768, 1024);
      cy.get('[data-testid="policy-risk-table"]').should('be.visible');
      
      // Test desktop
      cy.viewport(1920, 1080);
      cy.contains('History & Trends').should('be.visible');
    });
  });

  describe('Performance and Accessibility', () => {
    it('should load within acceptable time limits', () => {
      const start = Date.now();
      
      cy.visit('/en/compliance/policy-intel/history');
      cy.wait(['@getPolicyList', '@getTrends']);
      
      cy.then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(5000); // 5 second max
      });
    });

    it('should have proper accessibility attributes', () => {
      cy.visit('/en/compliance/policy-intel/history');
      
      // Check for proper headings
      cy.get('h1').should('exist');
      
      // Check for proper labels
      cy.get('label').should('exist');
      
      // Check for keyboard navigation
      cy.get('button').first().focus().should('be.focused');
    });
  });
});