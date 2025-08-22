import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from './useUserCompany';

export interface EntitlementData {
  hasEntitlement: boolean;
  isLoading: boolean;
  error: Error | null;
  entitlementDetails?: {
    sku_code: string;
    seats: number;
    started_at: string;
    ends_at?: string;
    active: boolean;
  };
}

export const useEntitlement = (skuCode: string): EntitlementData => {
  const { companyId } = useUserCompany();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['entitlement', companyId, skuCode],
    queryFn: async () => {
      if (!companyId || !skuCode) {
        return { hasEntitlement: false };
      }

      // Check if tenant has the entitlement using the server function
      const { data: hasEntitlementData, error: hasEntitlementError } = await supabase
        .rpc('has_entitlement', {
          p_tenant: companyId,
          p_sku: skuCode
        });

      if (hasEntitlementError) {
        console.error('Error checking entitlement:', hasEntitlementError);
        return { hasEntitlement: false };
      }

      // Get entitlement details if it exists
      if (hasEntitlementData) {
        const { data: entitlementDetails, error: detailsError } = await supabase
          .from('tenant_entitlements')
          .select('*')
          .eq('tenant_id', companyId)
          .eq('sku_code', skuCode)
          .eq('active', true)
          .single();

        if (detailsError) {
          console.error('Error fetching entitlement details:', detailsError);
        }

        return {
          hasEntitlement: true,
          entitlementDetails: entitlementDetails || undefined
        };
      }

      return { hasEntitlement: false };
    },
    enabled: !!companyId && !!skuCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    hasEntitlement: data?.hasEntitlement ?? false,
    entitlementDetails: data?.entitlementDetails,
    isLoading,
    error: error as Error | null
  };
};

// Helper hook to check multiple entitlements at once
export const useMultipleEntitlements = (skuCodes: string[]) => {
  const { companyId } = useUserCompany();
  
  return useQuery({
    queryKey: ['multiple-entitlements', companyId, skuCodes],
    queryFn: async () => {
      if (!companyId || !skuCodes.length) {
        return {};
      }

      const results: Record<string, boolean> = {};
      
      // Check each entitlement
      for (const sku of skuCodes) {
        const { data: hasEntitlement } = await supabase
          .rpc('has_entitlement', {
            p_tenant: companyId,
            p_sku: sku
          });
        
        results[sku] = hasEntitlement || false;
      }

      return results;
    },
    enabled: !!companyId && skuCodes.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};