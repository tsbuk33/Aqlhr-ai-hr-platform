import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export type AdapterState = 'ok' | 'degraded' | 'down' | 'unknown';

export function useGovAdapterStatus(portal: string) {
  const [status, setStatus] = useState<AdapterState>('unknown');
  const supabase = createClientComponentClient();

  useEffect(() => {
    let active = true;
    
    async function fetchStatus() {
      try {
        const { data, error } = await supabase
          .from('gov_adapter_status')
          .select('status')
          .eq('portal', portal)
          .maybeSingle();
          
        if (!active) return;
        
        if (error || !data?.status) {
          setStatus('unknown');
        } else {
          setStatus(data.status as AdapterState);
        }
      } catch (err) {
        console.warn('Failed to fetch adapter status:', err);
        if (active) setStatus('unknown');
      }
    }

    fetchStatus();

    // Set up real-time subscription for status changes
    const subscription = supabase
      .channel('gov_adapter_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gov_adapter_status',
          filter: `portal=eq.${portal}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setStatus((payload.new as any)?.status || 'unknown');
          } else if (payload.eventType === 'DELETE') {
            setStatus('unknown');
          }
        }
      )
      .subscribe();

    return () => { 
      active = false; 
      subscription.unsubscribe();
    };
  }, [portal, supabase]);

  return status;
}