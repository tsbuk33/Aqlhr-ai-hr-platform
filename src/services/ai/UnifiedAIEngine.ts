import { UserRole } from '@/hooks/useUserRole';

export interface AIRequest {
  type: 'recommendation' | 'analysis' | 'automation' | 'prediction' | 'generation';
  context: string;
  userRole: UserRole;
  tenantId: string;
  data?: any;
  preferences?: Record<string, any>;
}

export interface AIResponse {
  type: string;
  confidence: number;
  result: any;
  metadata: {
    processingTime: number;
    model: string;
    userRole: UserRole;
    timestamp: string;
  };
  recommendations?: string[];
  nextActions?: string[];
}

/**
 * Unified AI Engine that serves all role-based interfaces
 * Provides context-aware AI capabilities for different user roles
 */
export class UnifiedAIEngine {
  private static instance: UnifiedAIEngine;
  private aiProviders: Map<string, any> = new Map();
  private roleContexts: Map<UserRole, any> = new Map();
  
  private constructor() {
    this.initializeAIProviders();
    this.initializeRoleContexts();
  }
  
  static getInstance(): UnifiedAIEngine {
    if (!UnifiedAIEngine.instance) {
      UnifiedAIEngine.instance = new UnifiedAIEngine();
    }
    return UnifiedAIEngine.instance;
  }

  /**
   * Initialize AI providers for different capabilities
   */
  private initializeAIProviders(): void {
    // Register different AI providers
    this.aiProviders.set('nlp', {
      name: 'Hugging Face NLP',
      endpoint: '/functions/v1/huggingface-nlp-processor',
      capabilities: ['sentiment', 'classification', 'entity_extraction']
    });

    this.aiProviders.set('workflow', {
      name: 'LangChain Workflow',
      endpoint: '/functions/v1/langchain-workflow-processor',
      capabilities: ['task_planning', 'decision_making', 'automation']
    });

    this.aiProviders.set('code_generation', {
      name: 'CodeT5 Generator',
      endpoint: '/functions/v1/code-generation-processor',
      capabilities: ['code_generation', 'automation_scripts', 'api_integration']
    });

    this.aiProviders.set('data_analysis', {
      name: 'PandasAI Analyzer',
      endpoint: '/functions/v1/data-analysis-processor',
      capabilities: ['data_insights', 'predictive_analysis', 'reporting']
    });
  }

  /**
   * Initialize role-specific AI contexts
   */
  private initializeRoleContexts(): void {
    this.roleContexts.set('super_admin', {
      priorities: ['system_optimization', 'tenant_management', 'security_monitoring'],
      dataAccess: 'full',
      aiCapabilities: ['all'],
      restrictions: []
    });

    this.roleContexts.set('admin', {
      priorities: ['company_management', 'user_administration', 'compliance_monitoring'],
      dataAccess: 'company_wide',
      aiCapabilities: ['workflow', 'data_analysis', 'nlp'],
      restrictions: ['system_level_operations']
    });

    this.roleContexts.set('hr_manager', {
      priorities: ['employee_management', 'performance_optimization', 'compliance_automation'],
      dataAccess: 'hr_domain',
      aiCapabilities: ['nlp', 'workflow', 'data_analysis'],
      restrictions: ['financial_projections', 'system_administration']
    });

    this.roleContexts.set('manager', {
      priorities: ['team_performance', 'task_management', 'goal_tracking'],
      dataAccess: 'team_scope',
      aiCapabilities: ['nlp', 'data_analysis'],
      restrictions: ['company_wide_operations', 'hr_functions']
    });

    this.roleContexts.set('employee', {
      priorities: ['personal_productivity', 'skill_development', 'task_assistance'],
      dataAccess: 'personal',
      aiCapabilities: ['nlp'],
      restrictions: ['management_functions', 'sensitive_data_access']
    });
  }

  /**
   * Process AI request with role-based context
   */
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Get role context
      const roleContext = this.roleContexts.get(request.userRole);
      if (!roleContext) {
        throw new Error(`Unsupported user role: ${request.userRole}`);
      }

      // Validate AI capability access
      this.validateAICapabilityAccess(request.type, roleContext);

      // Route to appropriate AI provider
      const provider = this.selectAIProvider(request.type, roleContext);
      
      // Process request with role-specific context
      const result = await this.executeAIRequest(request, provider, roleContext);
      
      // Post-process results for role
      const processedResult = this.postProcessForRole(result, request.userRole);

      const processingTime = Date.now() - startTime;

      return {
        type: request.type,
        confidence: result.confidence || 0.8,
        result: processedResult,
        metadata: {
          processingTime,
          model: provider.name,
          userRole: request.userRole,
          timestamp: new Date().toISOString()
        },
        recommendations: this.generateRoleSpecificRecommendations(request, result),
        nextActions: this.generateNextActions(request, result, roleContext)
      };
    } catch (error) {
      console.error('AI Engine Error:', error);
      throw error;
    }
  }

  /**
   * Validate if user role can access AI capability
   */
  private validateAICapabilityAccess(aiType: string, roleContext: any): void {
    const requiredCapability = this.getRequiredCapability(aiType);
    
    if (!roleContext.aiCapabilities.includes('all') && 
        !roleContext.aiCapabilities.includes(requiredCapability)) {
      throw new Error(`AI capability '${aiType}' not available for this role`);
    }
  }

  /**
   * Get required capability for AI type
   */
  private getRequiredCapability(aiType: string): string {
    const capabilityMap = {
      'recommendation': 'nlp',
      'analysis': 'data_analysis',
      'automation': 'workflow',
      'prediction': 'data_analysis',
      'generation': 'code_generation'
    };
    
    return capabilityMap[aiType] || 'nlp';
  }

  /**
   * Select appropriate AI provider for request
   */
  private selectAIProvider(aiType: string, roleContext: any): any {
    const capability = this.getRequiredCapability(aiType);
    
    for (const [key, provider] of this.aiProviders) {
      if (provider.capabilities.includes(capability)) {
        return provider;
      }
    }
    
    throw new Error(`No AI provider available for capability: ${capability}`);
  }

  /**
   * Execute AI request with selected provider
   */
  private async executeAIRequest(request: AIRequest, provider: any, roleContext: any): Promise<any> {
    const aiPayload = {
      query: request.context,
      data: request.data,
      role_context: roleContext,
      tenant_id: request.tenantId,
      preferences: request.preferences
    };

    // Make request to AI provider
    const response = await fetch(`${provider.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(aiPayload)
    });

    if (!response.ok) {
      throw new Error(`AI provider request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Post-process AI results for specific role
   */
  private postProcessForRole(result: any, userRole: UserRole): any {
    switch (userRole) {
      case 'super_admin':
        return this.enhanceForSuperAdmin(result);
        
      case 'admin':
        return this.enhanceForAdmin(result);
        
      case 'hr_manager':
        return this.enhanceForHRManager(result);
        
      case 'manager':
        return this.enhanceForManager(result);
        
      case 'employee':
        return this.enhanceForEmployee(result);
        
      default:
        return result;
    }
  }

  /**
   * Generate role-specific recommendations
   */
  private generateRoleSpecificRecommendations(request: AIRequest, result: any): string[] {
    const baseRecommendations = result.recommendations || [];
    
    switch (request.userRole) {
      case 'super_admin':
        return [
          ...baseRecommendations,
          'Review system-wide impact',
          'Consider tenant-specific variations',
          'Monitor security implications'
        ];
        
      case 'admin':
        return [
          ...baseRecommendations,
          'Verify company policy compliance',
          'Check user permission impacts',
          'Consider implementation timeline'
        ];
        
      case 'hr_manager':
        return [
          ...baseRecommendations,
          'Review employee impact',
          'Check regulatory compliance',
          'Consider change management needs'
        ];
        
      case 'manager':
        return [
          ...baseRecommendations,
          'Discuss with team members',
          'Plan implementation steps',
          'Monitor team performance impact'
        ];
        
      case 'employee':
        return [
          ...baseRecommendations,
          'Consult with your manager',
          'Review company guidelines',
          'Consider skill development needs'
        ];
        
      default:
        return baseRecommendations;
    }
  }

  /**
   * Generate next actions based on role
   */
  private generateNextActions(request: AIRequest, result: any, roleContext: any): string[] {
    const actions = [];
    
    if (roleContext.priorities.includes('automation') && result.automatable) {
      actions.push('Create automation workflow');
    }
    
    if (roleContext.priorities.includes('compliance_monitoring') && result.compliance_relevant) {
      actions.push('Review compliance requirements');
    }
    
    if (roleContext.priorities.includes('performance_optimization') && result.performance_impact) {
      actions.push('Analyze performance metrics');
    }
    
    return actions;
  }

  // Role-specific enhancement methods
  private enhanceForSuperAdmin(result: any): any {
    return {
      ...result,
      systemMetrics: {
        resourceUsage: 'Optimal',
        securityStatus: 'Secure',
        performanceIndex: 95
      },
      tenantInsights: {
        totalTenants: 50,
        activeUsers: 2500,
        systemHealth: 'Excellent'
      }
    };
  }

  private enhanceForAdmin(result: any): any {
    return {
      ...result,
      companyMetrics: {
        userEngagement: 'High',
        systemAdoption: '89%',
        complianceScore: 'A+'
      }
    };
  }

  private enhanceForHRManager(result: any): any {
    return {
      ...result,
      hrInsights: {
        employeeSatisfaction: '4.2/5',
        retentionRate: '92%',
        complianceStatus: 'Current'
      }
    };
  }

  private enhanceForManager(result: any): any {
    return {
      ...result,
      teamInsights: {
        teamPerformance: '87%',
        goalCompletion: '94%',
        teamMorale: 'High'
      }
    };
  }

  private enhanceForEmployee(result: any): any {
    // Remove sensitive information and enhance with personal insights
    const { systemData, adminData, ...safeResult } = result;
    
    return {
      ...safeResult,
      personalInsights: {
        skillProgress: '75%',
        goalStatus: 'On Track',
        learningRecommendations: 3
      }
    };
  }

  /**
   * Batch process multiple AI requests
   */
  async processBatchRequests(requests: AIRequest[]): Promise<AIResponse[]> {
    const responses = await Promise.allSettled(
      requests.map(request => this.processRequest(request))
    );

    return responses.map(response => {
      if (response.status === 'fulfilled') {
        return response.value;
      } else {
        return {
          type: 'error',
          confidence: 0,
          result: { error: response.reason?.message || 'Request failed' },
          metadata: {
            processingTime: 0,
            model: 'error',
            userRole: 'unknown' as UserRole,
            timestamp: new Date().toISOString()
          }
        };
      }
    });
  }

  /**
   * Get AI capabilities for a specific role
   */
  getCapabilitiesForRole(userRole: UserRole): string[] {
    const roleContext = this.roleContexts.get(userRole);
    return roleContext?.aiCapabilities || [];
  }

  /**
   * Check if role can access specific AI capability
   */
  canAccessCapability(userRole: UserRole, capability: string): boolean {
    const roleContext = this.roleContexts.get(userRole);
    return roleContext?.aiCapabilities.includes('all') || 
           roleContext?.aiCapabilities.includes(capability) || false;
  }
}

// Export singleton instance
export const unifiedAIEngine = UnifiedAIEngine.getInstance();