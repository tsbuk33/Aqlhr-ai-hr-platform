import { supabase } from '@/integrations/supabase/client';

export async function getTenantIdOrDemo() {
  // 1) try real session
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.company_id) return user.user_metadata.company_id as string;
  // 2) dev fallback
  const cached = localStorage.getItem('aqlhr.demoTenant');
  if (cached) return cached;
  const { data } = await supabase.rpc('get_demo_tenant_id');
  return data ?? null;
}