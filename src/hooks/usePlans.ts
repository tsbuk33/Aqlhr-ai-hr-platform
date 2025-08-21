import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Plan {
  id: string;
  code: string;
  name: string;
  price_mo: number;
  features: string[];
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface TenantPlan {
  plan_code: string;
  plan_name: string;
  price_mo: number;
  features: string[];
  seats: number;
  is_trial: boolean;
  trial_ends_at: string | null;
}

export const usePlans = () => {
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<TenantPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAvailablePlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setAvailablePlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load available plans",
        variant: "destructive"
      });
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const { data, error } = await supabase.rpc('get_tenant_plan');
      
      if (error) throw error;
      setCurrentPlan(data?.[0] || null);
    } catch (error) {
      console.error('Error fetching current plan:', error);
      // Don't show error toast for missing plan - it's expected for new users
    }
  };

  const hasFeature = async (featureCode: string): Promise<boolean> => {
    try {
      // Get current user's company
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .single();

      if (!userRoles?.company_id) return false;

      const { data, error } = await supabase.rpc('has_feature', {
        p_tenant_id: userRoles.company_id,
        p_feature_code: featureCode
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking feature:', error);
      return false;
    }
  };

  const upgradePlan = async (planCode: string, seats: number = 1) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .single();

      if (!userRoles?.company_id) throw new Error('No company found');

      // End current plan
      await supabase
        .from('tenant_plans')
        .update({ active_to: new Date().toISOString() })
        .eq('tenant_id', userRoles.company_id)
        .is('active_to', null);

      // Insert new plan
      const { error } = await supabase
        .from('tenant_plans')
        .insert({
          tenant_id: userRoles.company_id,
          plan_code: planCode,
          seats
        });

      if (error) throw error;

      toast({
        title: "Plan Updated",
        description: "Your plan has been successfully updated",
      });

      // Refresh current plan
      await fetchCurrentPlan();
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAvailablePlans(), fetchCurrentPlan()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    availablePlans,
    currentPlan,
    loading,
    hasFeature,
    upgradePlan,
    refreshPlans: fetchCurrentPlan
  };
};