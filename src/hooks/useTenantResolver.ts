import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TenantInfo {
  tenantId: string | null;
  isDemoMode: boolean;
  loading: boolean;
  error: string | null;
}

export function useTenantResolver(): TenantInfo {
  const { user } = useAuth();
  const [tenantInfo, setTenantInfo] = useState<TenantInfo>({
    tenantId: null,
    isDemoMode: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    async function resolveTenant() {
      try {
        setTenantInfo(prev => ({ ...prev, loading: true, error: null }));
        
        if (user) {
          // Try to get tenant from user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('user_id', user.id)
            .single();

          if (profile?.company_id) {
            setTenantInfo({
              tenantId: profile.company_id,
              isDemoMode: false,
              loading: false,
              error: null
            });
            return;
          }
        }

        // Fall back to demo tenant
        const { data: demoTenantId, error } = await supabase.rpc('get_demo_tenant_id');
        
        if (error) throw error;

        setTenantInfo({
          tenantId: demoTenantId,
          isDemoMode: true,
          loading: false,
          error: null
        });
      } catch (error: any) {
        setTenantInfo({
          tenantId: null,
          isDemoMode: false,
          loading: false,
          error: error.message
        });
      }
    }

    resolveTenant();
  }, [user]);

  return tenantInfo;
}