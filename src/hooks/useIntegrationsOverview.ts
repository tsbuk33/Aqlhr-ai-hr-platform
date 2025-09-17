import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface IntegrationOverview {
  integration_group: string;
  connected: number;
  total: number;
}

export const useIntegrationsOverview = () => {
  const [overview, setOverview] = useState<IntegrationOverview[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current company ID from user roles
  const getCurrentCompanyId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userRole } = await supabase
      .from('user_roles')
      .select('company_id')
      .eq('user_id', user.id)
      .single();

    return userRole?.company_id;
  };

  const fetchOverview = async () => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const { data, error } = await supabase.rpc('integrations_overview_v2' as any, {
        p_tenant: companyId
      });

      if (error) throw error;
      setOverview(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching integrations overview:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const getStatus = () => {
    const govGroup = overview.find(o => o.integration_group === 'gov');
    const toolsGroup = overview.find(o => o.integration_group === 'tools');
    
    const govStatus = {
      connected: govGroup?.connected || 0,
      total: govGroup?.total || 0,
      isAllConnected: govGroup ? govGroup.connected === govGroup.total && govGroup.total > 0 : false
    };
    
    const toolsStatus = {
      connected: toolsGroup?.connected || 0,
      total: toolsGroup?.total || 0,
      isAllConnected: toolsGroup ? toolsGroup.connected === toolsGroup.total && toolsGroup.total > 0 : false
    };

    const allSystemsOperational = govStatus.isAllConnected && toolsStatus.isAllConnected;

    return {
      gov: govStatus,
      tools: toolsStatus,
      allSystemsOperational,
      refresh: fetchOverview
    };
  };

  return {
    ...getStatus(),
    loading
  };
};