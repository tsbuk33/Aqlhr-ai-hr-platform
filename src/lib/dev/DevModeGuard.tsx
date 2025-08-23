import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export async function ensureDevTenant() {
  const url = new URL(window.location.href);
  const dev = url.searchParams.get('dev') === '1' || import.meta.env.MODE === 'development';
  if (!dev) return;
  // Cache to avoid repeated RPC
  const cached = localStorage.getItem('aqlhr.demoTenant');
  if (cached) return;
  const { data, error } = await supabase.rpc('get_demo_tenant_id');
  if (!error && data) localStorage.setItem('aqlhr.demoTenant', data);
}