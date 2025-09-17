import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FeatureGatingResult {
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
  showUpsell: () => void;
  hideUpsell: () => void;
  upsellOpen: boolean;
}

export function useFeatureGating(featureCode: string): FeatureGatingResult {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upsellOpen, setUpsellOpen] = useState(false);

  useEffect(() => {
    checkFeatureAccess();
  }, [featureCode]);

  const checkFeatureAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHasAccess(false);
        return;
      }

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!userRole) {
        setHasAccess(false);
        return;
      }

      // Check if company has access to the feature
      const { data: hasFeature, error: featureError } = await supabase
        .rpc('has_feature' as any, { 
          p_tenant_id: userRole.company_id, 
          p_feature_code: featureCode 
        });

      if (featureError) {
        console.warn('Feature check failed, assuming no access:', featureError);
        setHasAccess(false);
      } else {
        setHasAccess(Boolean(hasFeature));
      }

    } catch (err) {
      console.error('Feature gating error:', err);
      setError(err instanceof Error ? err.message : 'Failed to check feature access');
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const showUpsell = () => setUpsellOpen(true);
  const hideUpsell = () => setUpsellOpen(false);

  return {
    hasAccess,
    loading,
    error,
    showUpsell,
    hideUpsell,
    upsellOpen
  };
}