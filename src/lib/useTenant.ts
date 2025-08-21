import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type TenantMode = 'auth' | 'demo' | 'impersonated';

export interface TenantInfo {
  tenantId: string;
  mode: TenantMode;
}

export async function resolveTenantId(supabaseClient: any): Promise<TenantInfo> {
  // Dev-only impersonation (Preview): if localStorage has devTenantId, use it.
  const devTenantId = typeof window !== 'undefined' ? localStorage.getItem('devTenantId') : null;
  if (devTenantId) return { tenantId: devTenantId, mode: 'impersonated' };

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (user) {
    // Check user_roles table for company_id (following the schema)
    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('company_id')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (userRole?.company_id) {
      return { tenantId: userRole.company_id, mode: 'auth' };
    }

    // Fallback to profiles table if exists
    const { data: prof } = await supabaseClient
      .from('profiles')
      .select('company_id')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (prof?.company_id) {
      return { tenantId: prof.company_id, mode: 'auth' };
    }
  }

  // No session → demo tenant
  const { data: demoTid, error } = await supabaseClient.rpc('get_demo_tenant_id');
  if (!error && demoTid) return { tenantId: demoTid as string, mode: 'demo' };

  throw new Error('NO_TENANT_AVAILABLE');
}

export function useTenant() {
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolveTenant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await resolveTenantId(supabase);
      setTenantInfo(info);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resolve tenant';
      setError(errorMessage);
      console.error('Tenant resolution error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const impersonateTenant = useCallback((tenantId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devTenantId', tenantId);
      setTenantInfo({ tenantId, mode: 'impersonated' });
    }
  }, []);

  const clearImpersonation = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devTenantId');
      resolveTenant(); // Re-resolve after clearing
    }
  }, [resolveTenant]);

  useEffect(() => {
    resolveTenant();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      resolveTenant();
    });

    // Listen for localStorage changes (impersonation from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'devTenantId') {
        resolveTenant();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      subscription.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [resolveTenant]);

  return {
    tenantInfo,
    loading,
    error,
    refetch: resolveTenant,
    impersonateTenant,
    clearImpersonation,
    // Convenience getters
    tenantId: tenantInfo?.tenantId || null,
    mode: tenantInfo?.mode || null,
    isDemo: tenantInfo?.mode === 'demo',
    isAuthenticated: tenantInfo?.mode === 'auth',
    isImpersonated: tenantInfo?.mode === 'impersonated'
  };
}