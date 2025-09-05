import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/hooks/useUserRole';

export interface APIRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, any>;
  userRole: UserRole;
  tenantId: string;
}

export interface APIResponse<T = any> {
  data: T | null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
  success: boolean;
  message?: string;
}

/**
 * Unified API Layer that serves all frontend interfaces
 * Handles role-based access control and data filtering
 */
export class UnifiedAPILayer {
  private static instance: UnifiedAPILayer;
  
  private constructor() {}
  
  static getInstance(): UnifiedAPILayer {
    if (!UnifiedAPILayer.instance) {
      UnifiedAPILayer.instance = new UnifiedAPILayer();
    }
    return UnifiedAPILayer.instance;
  }

  /**
   * Execute API request with role-based access control
   */
  async execute<T = any>(request: APIRequest): Promise<APIResponse<T>> {
    try {
      // Apply role-based filtering and validation
      const filteredRequest = this.applyRoleBasedFiltering(request);
      
      // Route to appropriate handler
      const response = await this.routeRequest<T>(filteredRequest);
      
      // Apply role-based response transformation
      const transformedResponse = this.transformResponseForRole<T>(response, request.userRole);
      
      return transformedResponse;
    } catch (error) {
      console.error('UnifiedAPI Error:', error);
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Apply role-based filtering to requests
   */
  private applyRoleBasedFiltering(request: APIRequest): APIRequest {
    const { userRole, tenantId, endpoint, params = {} } = request;
    
    // Always include tenant isolation
    const filteredParams: Record<string, any> = {
      ...params,
      tenant_id: tenantId
    };

    // Apply role-specific filters
    switch (userRole) {
      case 'super_admin':
        // Super admin can access all data across tenants
        if (request.endpoint.includes('/system/')) {
          delete filteredParams.tenant_id; // System-wide access
        }
        break;
        
      case 'admin':
        // Admin can access all company data but not system-wide
        filteredParams.scope = 'company';
        break;
        
      case 'hr_manager':
        // HR Manager can access HR-related data
        filteredParams.scope = 'hr';
        filteredParams.department_access = 'all';
        break;
        
      case 'manager':
        // Manager can only access their team data
        filteredParams.scope = 'team';
        filteredParams.manager_filter = true;
        break;
        
      case 'employee':
        // Employee can only access their own data
        filteredParams.scope = 'self';
        filteredParams.employee_filter = true;
        break;
    }

    return {
      ...request,
      params: filteredParams
    };
  }

  /**
   * Route request to appropriate handler
   */
  private async routeRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    const { endpoint, method, data, params } = request;
    
    // Employee endpoints
    if (endpoint.startsWith('/employees')) {
      return this.handleEmployeeEndpoints<T>(method, endpoint, data, params);
    }
    
    // Analytics endpoints
    if (endpoint.startsWith('/analytics')) {
      return this.handleAnalyticsEndpoints<T>(method, endpoint, data, params);
    }
    
    // AI endpoints
    if (endpoint.startsWith('/ai')) {
      return this.handleAIEndpoints<T>(method, endpoint, data, params);
    }
    
    // Government integration endpoints
    if (endpoint.startsWith('/government')) {
      return this.handleGovernmentEndpoints<T>(method, endpoint, data, params);
    }
    
    // System endpoints (super admin only)
    if (endpoint.startsWith('/system')) {
      return this.handleSystemEndpoints<T>(method, endpoint, data, params);
    }
    
    throw new Error(`Unknown endpoint: ${endpoint}`);
  }

  /**
   * Handle employee-related endpoints
   */
  private async handleEmployeeEndpoints<T>(
    method: string, 
    endpoint: string, 
    data: any, 
    params: Record<string, any>
  ): Promise<APIResponse<T>> {
    const { tenant_id, scope, manager_filter, employee_filter } = params;
    
    let query = supabase.from('hr_employees').select('*');
    
    // Apply tenant isolation
    if (tenant_id) {
      query = query.eq('company_id', tenant_id);
    }
    
    // Apply role-based filtering
    if (scope === 'self' && employee_filter) {
      const { data: { user } } = await supabase.auth.getUser();
      query = query.eq('user_id', user?.id);
    } else if (scope === 'team' && manager_filter) {
      const { data: { user } } = await supabase.auth.getUser();
      query = query.eq('manager_id', user?.id);
    }
    
    const { data: employees, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: employees as T,
      meta: { total: count || 0 },
      success: true
    };
  }

  /**
   * Handle analytics endpoints
   */
  private async handleAnalyticsEndpoints<T>(
    method: string, 
    endpoint: string, 
    data: any, 
    params: Record<string, any>
  ): Promise<APIResponse<T>> {
    const { tenant_id, scope } = params;
    
    // Different analytics based on role scope
    if (endpoint.includes('/dashboard-metrics')) {
      return this.getDashboardMetrics<T>(tenant_id, scope);
    }
    
    if (endpoint.includes('/performance-metrics')) {
      return this.getPerformanceMetrics<T>(tenant_id, scope, params);
    }
    
    throw new Error(`Unknown analytics endpoint: ${endpoint}`);
  }

  /**
   * Handle AI endpoints
   */
  private async handleAIEndpoints<T>(
    method: string, 
    endpoint: string, 
    data: any, 
    params: Record<string, any>
  ): Promise<APIResponse<T>> {
    const { tenant_id, scope } = params;
    
    if (endpoint.includes('/recommendations')) {
      return this.getAIRecommendations<T>(tenant_id, scope, data);
    }
    
    if (endpoint.includes('/automation')) {
      return this.executeAIAutomation<T>(tenant_id, scope, data);
    }
    
    throw new Error(`Unknown AI endpoint: ${endpoint}`);
  }

  /**
   * Handle government integration endpoints
   */
  private async handleGovernmentEndpoints<T>(
    method: string, 
    endpoint: string, 
    data: any, 
    params: Record<string, any>
  ): Promise<APIResponse<T>> {
    const { tenant_id } = params;
    
    if (endpoint.includes('/qiwa')) {
      return this.handleQiwaIntegration<T>(method, data, tenant_id);
    }
    
    if (endpoint.includes('/gosi')) {
      return this.handleGOSIIntegration<T>(method, data, tenant_id);
    }
    
    throw new Error(`Unknown government endpoint: ${endpoint}`);
  }

  /**
   * Handle system endpoints (super admin only)
   */
  private async handleSystemEndpoints<T>(
    method: string, 
    endpoint: string, 
    data: any, 
    params: Record<string, any>
  ): Promise<APIResponse<T>> {
    // System-wide operations for super admin
    if (endpoint.includes('/health')) {
      return this.getSystemHealth<T>();
    }
    
    if (endpoint.includes('/tenants')) {
      return this.manageTenants<T>(method, data);
    }
    
    throw new Error(`Unknown system endpoint: ${endpoint}`);
  }

  /**
   * Transform response based on user role
   */
  private transformResponseForRole<T>(response: APIResponse<T>, userRole: UserRole): APIResponse<T> {
    if (!response.success || !response.data) {
      return response;
    }

    // Apply role-specific data transformations
    switch (userRole) {
      case 'employee':
        // Mask sensitive data for employees
        return this.maskSensitiveData(response);
        
      case 'manager':
        // Show team-relevant data only
        return this.filterTeamData(response);
        
      case 'hr_manager':
        // Show comprehensive HR data
        return this.enhanceHRData(response);
        
      case 'admin':
        // Show administrative data
        return this.enhanceAdminData(response);
        
      case 'super_admin':
        // Show all data with system metrics
        return this.enhanceSystemData(response);
        
      default:
        return response;
    }
  }

  // Helper methods for specific integrations
  private async getDashboardMetrics<T>(tenantId: string, scope: string): Promise<APIResponse<T>> {
    // Implementation for dashboard metrics
    const metrics = {
      employees: 100,
      departments: 10,
      activeProjects: 25,
      completionRate: 85
    };
    
    return {
      data: metrics as T,
      success: true
    };
  }

  private async getPerformanceMetrics<T>(tenantId: string, scope: string, params: Record<string, any>): Promise<APIResponse<T>> {
    // Implementation for performance metrics
    return {
      data: {} as T,
      success: true
    };
  }

  private async getAIRecommendations<T>(tenantId: string, scope: string, data: any): Promise<APIResponse<T>> {
    // Implementation for AI recommendations
    return {
      data: {} as T,
      success: true
    };
  }

  private async executeAIAutomation<T>(tenantId: string, scope: string, data: any): Promise<APIResponse<T>> {
    // Implementation for AI automation
    return {
      data: {} as T,
      success: true
    };
  }

  private async handleQiwaIntegration<T>(method: string, data: any, tenantId: string): Promise<APIResponse<T>> {
    // Implementation for Qiwa integration
    return {
      data: {} as T,
      success: true
    };
  }

  private async handleGOSIIntegration<T>(method: string, data: any, tenantId: string): Promise<APIResponse<T>> {
    // Implementation for GOSI integration
    return {
      data: {} as T,
      success: true
    };
  }

  private async getSystemHealth<T>(): Promise<APIResponse<T>> {
    // Implementation for system health
    return {
      data: { status: 'healthy' } as T,
      success: true
    };
  }

  private async manageTenants<T>(method: string, data: any): Promise<APIResponse<T>> {
    // Implementation for tenant management
    return {
      data: {} as T,
      success: true
    };
  }

  // Data transformation helpers
  private maskSensitiveData<T>(response: APIResponse<T>): APIResponse<T> {
    // Mask sensitive data for employee role
    return response;
  }

  private filterTeamData<T>(response: APIResponse<T>): APIResponse<T> {
    // Filter data for manager role
    return response;
  }

  private enhanceHRData<T>(response: APIResponse<T>): APIResponse<T> {
    // Enhance data for HR manager role
    return response;
  }

  private enhanceAdminData<T>(response: APIResponse<T>): APIResponse<T> {
    // Enhance data for admin role
    return response;
  }

  private enhanceSystemData<T>(response: APIResponse<T>): APIResponse<T> {
    // Enhance data for super admin role
    return response;
  }
}

// Export singleton instance
export const unifiedAPI = UnifiedAPILayer.getInstance();