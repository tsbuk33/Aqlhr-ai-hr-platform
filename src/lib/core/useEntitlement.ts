import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useEntitlement(feature: string) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error } = await supabase.rpc('core_is_allowed' as any, { p_feature: feature });
        if (!alive) return;
        if (error) setError(error.message);
        else setAllowed(Boolean(data));
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => { alive = false; };
  }, [feature]);

  return { allowed, loading: allowed === null, error };
}