import { supabase } from '@/integrations/supabase/client';

export async function getTenantIdOrDemo(): Promise<string | null> {
  try {
    // 1) try real session
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.company_id) {
      return user.user_metadata.company_id as string;
    }
    
    // 2) dev fallback
    const cached = localStorage.getItem('aqlhr.demoTenant');
    if (cached) return cached;
    
    // 3) get demo tenant from RPC
    const { data, error } = await supabase.rpc('get_demo_tenant_id' as any);
    if (error) {
      console.warn('Failed to get demo tenant ID:', error);
      return null;
    }
    
    return (data as string) ?? null;
  } catch (error) {
    console.warn('Error getting tenant ID:', error);
    return null;
  }
}