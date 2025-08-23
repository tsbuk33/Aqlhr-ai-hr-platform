import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';

export interface EntitlementResult {
  allowed: boolean;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to check if current tenant has access to a specific feature
 * Uses the core_is_allowed RPC function for secure server-side validation
 */
export const useEntitlement = (feature: string): EntitlementResult => {
  const { companyId } = useUserCompany();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['entitlement', companyId, feature],
    queryFn: async () => {
      if (!companyId || !feature) {
        return { allowed: false };
      }

      // Use the secure RPC function to check entitlement
      const { data: allowed, error: rpcError } = await supabase
        .rpc('core_is_allowed', { p_feature: feature });

      if (rpcError) {
        console.error('Entitlement check error:', rpcError);
        throw rpcError;
      }

      return { allowed: allowed || false };
    },
    enabled: !!companyId && !!feature,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    // Default to false for security
    placeholderData: { allowed: false }
  });

  return {
    allowed: data?.allowed ?? false,
    loading: isLoading,
    error: error as Error | null
  };
};

/**
 * Hook to check multiple entitlements at once
 */
export const useMultipleEntitlements = (features: string[]) => {
  const { companyId } = useUserCompany();
  
  return useQuery({
    queryKey: ['multiple-entitlements', companyId, features],
    queryFn: async () => {
      if (!companyId || !features.length) {
        return {};
      }

      const results: Record<string, boolean> = {};
      
      // Check each feature
      for (const feature of features) {
        const { data: allowed } = await supabase
          .rpc('core_is_allowed', { p_feature: feature });
        
        results[feature] = allowed || false;
      }

      return results;
    },
    enabled: !!companyId && features.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};