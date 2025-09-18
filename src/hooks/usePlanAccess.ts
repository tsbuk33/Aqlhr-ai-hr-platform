import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from './useUserCompany';
import { useState } from 'react';

export interface PlanAccessData {
  hasAccess: boolean;
  isTrialAccess: boolean;
  trialExpiresAt?: string;
  planName?: string;
  isLoading: boolean;
  error: Error | null;
  requestTrial: (planCode: string) => Promise<void>;
  showUpsell: () => void;
  hideUpsell: () => void;
  upsellOpen: boolean;
}

export const usePlanAccess = (skuCode: string): PlanAccessData => {
  const { companyId } = useUserCompany();
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['plan-access', companyId, skuCode],
    queryFn: async () => {
      if (!companyId) {
        return { hasAccess: false, isTrialAccess: false };
      }

      // Check SKU access including trials
      const { data: hasAccess, error: accessError } = await supabase.rpc('has_sku_access' as any, {
        p_tenant_id: companyId,
        p_sku_code: skuCode
      });

      if (accessError) {
        console.error('Error checking SKU access:', accessError);
        return { hasAccess: false, isTrialAccess: false };
      }

      if (!hasAccess) {
        return { hasAccess: false, isTrialAccess: false };
      }

      // Check if this is trial access
      const { data: trials, error: trialsError } = await supabase
        .from('tenant_trials')
        .select('*, plan_code')
        .eq('tenant_id', companyId)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString());

      if (trialsError) {
        console.error('Error checking trials:', trialsError);
      }

      // Get plan bundle info for active trials
      let activeTrial = null;
      if (trials && trials.length > 0) {
        for (const trial of trials) {
          const { data: planBundle } = await supabase
            .from('plan_bundles')
            .select('plan_name, included_skus')
            .eq('plan_code', trial.plan_code)
            .single();

          if (planBundle?.included_skus?.includes(skuCode)) {
            activeTrial = {
              ...trial,
              plan_name: planBundle.plan_name
            };
            break;
          }
        }
      }

      if (activeTrial) {
        return {
          hasAccess: true,
          isTrialAccess: true,
          trialExpiresAt: activeTrial.expires_at,
          planName: activeTrial.plan_name
        };
      }

      return { hasAccess: true, isTrialAccess: false };
    },
    enabled: !!companyId && !!skuCode,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false
  });

  const requestTrial = async (planCode: string) => {
    if (!companyId || requesting) return;

    setRequesting(true);
    try {
      // Start trial
      const { error: trialError } = await supabase.rpc('start_trial' as any, {
        p_tenant_id: companyId,
        p_plan_code: planCode,
        p_requested_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (trialError) {
        console.error('Error starting trial:', trialError);
        throw trialError;
      }

      // Create sales lead
      const { error: leadError } = await supabase
        .from('sales_leads')
        .insert({
          tenant_id: companyId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          lead_type: 'trial_request',
          requested_plan: planCode,
          status: 'trial_activated'
        });

      if (leadError) {
        console.error('Error creating sales lead:', leadError);
      }

      // Refetch access data
      await refetch();
      setUpsellOpen(false);
    } finally {
      setRequesting(false);
    }
  };

  const showUpsell = () => setUpsellOpen(true);
  const hideUpsell = () => setUpsellOpen(false);

  return {
    hasAccess: data?.hasAccess ?? false,
    isTrialAccess: data?.isTrialAccess ?? false,
    trialExpiresAt: data?.trialExpiresAt,
    planName: data?.planName,
    isLoading,
    error: error as Error | null,
    requestTrial,
    showUpsell,
    hideUpsell,
    upsellOpen
  };
};