import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from './useUserCompany';

export interface FeatureAccess {
  hasAccess: boolean;
  subscriptionTier: string;
  isLoading: boolean;
  error: Error | null;
  requiredPlan: string[];
}

export const useFeatureAccess = (featureKey: string): FeatureAccess => {
  const { companyId } = useUserCompany();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['feature-access', companyId, featureKey],
    queryFn: async () => {
      if (!companyId) {
        return { hasAccess: false, subscriptionTier: 'free', requiredPlan: [] };
      }

      // Get feature details and check access
      const [featureResponse, accessResponse, tierResponse] = await Promise.all([
        supabase
          .from('features')
          .select('plans')
          .eq('feature_key', featureKey)
          .single(),
        supabase.rpc('has_feature', {
          p_tenant_id: companyId,
          p_feature_code: featureKey
        }),
        supabase.rpc('get_user_subscription_tier')
      ]);

      if (featureResponse.error) {
        console.error('Error fetching feature:', featureResponse.error);
        return { hasAccess: false, subscriptionTier: 'free', requiredPlan: [] };
      }

      if (accessResponse.error) {
        console.error('Error checking feature access:', accessResponse.error);
        return { hasAccess: false, subscriptionTier: tierResponse.data || 'free', requiredPlan: featureResponse.data?.plans || [] };
      }

      return {
        hasAccess: accessResponse.data || false,
        subscriptionTier: tierResponse.data || 'free',
        requiredPlan: featureResponse.data?.plans || []
      };
    },
    enabled: !!companyId && !!featureKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    hasAccess: data?.hasAccess ?? false,
    subscriptionTier: data?.subscriptionTier ?? 'free',
    requiredPlan: data?.requiredPlan ?? [],
    isLoading,
    error: error as Error | null
  };
};

// Helper function to get subscription tier display name
export const getSubscriptionTierDisplayName = (tier: string): string => {
  const tierNames: Record<string, string> = {
    free: 'Free',
    basic: 'Basic',
    growth: 'Growth',
    enterprise: 'Enterprise'
  };
  return tierNames[tier?.toLowerCase()] || 'Free';
};

// Helper function to get required plan display names
export const getRequiredPlanNames = (plans: string[]): string => {
  return plans.map(plan => getSubscriptionTierDisplayName(plan)).join(' or ');
};