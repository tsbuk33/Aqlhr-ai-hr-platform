import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HofstedeContextData {
  total_employees: number;
  dimensions: {
    power_distance: number;
    individualism: number;
    masculinity: number;
    uncertainty_avoidance: number;
    long_term_orientation: number;
    indulgence: number;
  };
  nationality_mix: Array<{
    nationality: string;
    percentage: number;
    count: number;
    has_hofstede_data: boolean;
  }>;
  computed_at: string;
}

export const useHofstedeContext = (tenantId?: string) => {
  const [data, setData] = useState<HofstedeContextData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHofstedeContext = async () => {
    if (!tenantId) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: contextData, error: contextError } = await supabase
        .rpc('cci_get_hofstede_context_v1', {
          p_tenant_id: tenantId
        });

      if (contextError) {
        throw contextError;
      }

      setData(contextData as unknown as HofstedeContextData | null);
    } catch (err: any) {
      console.error('Error fetching Hofstede context:', err);
      setError(err.message || 'Failed to fetch Hofstede context');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHofstedeContext();
  }, [tenantId]);

  return {
    data,
    loading,
    error,
    refetch: fetchHofstedeContext
  };
};