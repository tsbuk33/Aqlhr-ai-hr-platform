import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { unifiedAPI, APIRequest, APIResponse } from '@/services/api/UnifiedAPILayer';
import { useUserRole } from './useUserRole';
import { useTenant } from '@/lib/useTenant';

export interface UseUnifiedAPIOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: boolean | number;
}

/**
 * Unified API Hook for all role-based interfaces
 * Provides consistent data fetching and state management
 */
export const useUnifiedAPI = () => {
  const { userRole } = useUserRole();
  const { tenantInfo } = useTenant();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute API request with role-based access control
   */
  const executeRequest = useCallback(async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any,
    params?: Record<string, any>
  ): Promise<APIResponse> => {
    if (!tenantInfo?.tenantId) {
      throw new Error('Tenant information not available');
    }

    const request: APIRequest = {
      endpoint,
      method,
      data,
      params,
      userRole,
      tenantId: tenantInfo.tenantId
    };

    return unifiedAPI.execute(request);
  }, [userRole, tenantInfo?.tenantId]);

  /**
   * React Query hook for GET requests
   */
  const useUnifiedQuery = (
    queryKey: string[],
    endpoint: string,
    params?: Record<string, any>,
    options?: UseUnifiedAPIOptions
  ) => {
    return useQuery({
      queryKey: [...queryKey, userRole, tenantInfo?.tenantId],
      queryFn: () => executeRequest(endpoint, 'GET', undefined, params),
      enabled: options?.enabled !== false && !!tenantInfo?.tenantId,
      staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
      retry: options?.retry !== false,
      select: (response) => response.data,
    });
  };

  /**
   * React Query mutation hook for write operations
   */
  const useUnifiedMutation = (
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
      invalidateQueries?: string[];
    }
  ) => {
    return useMutation({
      mutationFn: (variables: { data?: any; params?: Record<string, any> }) =>
        executeRequest(endpoint, method, variables.data, variables.params),
      onSuccess: (response) => {
        if (response.success && options?.onSuccess) {
          options.onSuccess(response.data);
        }
        
        // Invalidate related queries
        if (options?.invalidateQueries) {
          options.invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });
        }
      },
      onError: (error: Error) => {
        setError(error.message);
        if (options?.onError) {
          options.onError(error);
        }
      }
    });
  };

  /**
   * Bulk operations for multiple endpoints
   */
  const executeBulkRequests = useCallback(async (requests: Array<{
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: Record<string, any>;
  }>) => {
    setIsLoading(true);
    setError(null);

    try {
      const responses = await Promise.allSettled(
        requests.map(req => executeRequest(
          req.endpoint,
          req.method || 'GET',
          req.data,
          req.params
        ))
      );

      const results = responses.map(response => {
        if (response.status === 'fulfilled') {
          return response.value;
        } else {
          return {
            data: null,
            success: false,
            message: response.reason?.message || 'Request failed'
          };
        }
      });

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bulk request failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [executeRequest]);

  /**
   * Real-time data subscription
   */
  const useRealtimeSubscription = useCallback((
    table: string,
    filters?: Record<string, any>,
    callback?: (payload: any) => void
  ) => {
    if (!tenantInfo?.tenantId) return;

    const channel = supabase
      .channel(`realtime_${table}_${userRole}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `company_id=eq.${tenantInfo.tenantId}`
        },
        (payload) => {
          // Apply role-based filtering to real-time updates
          if (callback) {
            callback(payload);
          }
          
          // Auto-invalidate related queries
          queryClient.invalidateQueries({ 
            queryKey: [table, userRole, tenantInfo.tenantId] 
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userRole, tenantInfo?.tenantId, queryClient]);

  return {
    executeRequest,
    useUnifiedQuery,
    useUnifiedMutation,
    executeBulkRequests,
    useRealtimeSubscription,
    isLoading,
    error,
    userRole,
    tenantId: tenantInfo?.tenantId
  };
};

/**
 * Specialized hooks for different data types
 */

// Employee data hook
export const useEmployeeData = (employeeId?: string, options?: UseUnifiedAPIOptions) => {
  const { useUnifiedQuery } = useUnifiedAPI();
  
  return useUnifiedQuery(
    ['employees', employeeId || 'list'],
    employeeId ? `/employees/${employeeId}` : '/employees',
    undefined,
    options
  );
};

// Dashboard metrics hook
export const useDashboardMetrics = (options?: UseUnifiedAPIOptions) => {
  const { useUnifiedQuery } = useUnifiedAPI();
  
  return useUnifiedQuery(
    ['dashboard', 'metrics'],
    '/analytics/dashboard-metrics',
    undefined,
    options
  );
};

// AI recommendations hook
export const useAIRecommendations = (context: string, options?: UseUnifiedAPIOptions) => {
  const { useUnifiedQuery } = useUnifiedAPI();
  
  return useUnifiedQuery(
    ['ai', 'recommendations', context],
    '/ai/recommendations',
    { context },
    options
  );
};

// Government sync status hook
export const useGovernmentSyncStatus = (options?: UseUnifiedAPIOptions) => {
  const { useUnifiedQuery } = useUnifiedAPI();
  
  return useUnifiedQuery(
    ['government', 'sync', 'status'],
    '/government/sync-status',
    undefined,
    options
  );
};