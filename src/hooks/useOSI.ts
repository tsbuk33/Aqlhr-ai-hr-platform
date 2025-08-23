import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { useToast } from '@/hooks/use-toast';

export interface OSIOverview {
  total_layers: number;
  highest_saudi_layer: number;
  critical_layers: number;
  layers_meeting_target: number;
  span_outliers_low: number;
  span_outliers_high: number;
  management_cost: number;
}

export interface OSILayer {
  layer: number;
  headcount: number;
  saudi_headcount: number;
  saudization_rate: number;
  avg_salary: number;
  total_salary: number;
}

export interface OSISpanOutlier {
  manager_id: string;
  layer: number;
  direct_reports: number;
  severity: 'low' | 'high' | 'ok';
  full_name_en?: string;
  full_name_ar?: string;
}

export interface OSISettings {
  saudi_target: number;
  span_min: number;
  span_max: number;
}

export const useOSI = (tenantId?: string) => {
  const [overview, setOverview] = useState<OSIOverview | null>(null);
  const [layers, setLayers] = useState<OSILayer[]>([]);
  const [spanOutliers, setSpanOutliers] = useState<OSISpanOutlier[]>([]);
  const [settings, setSettings] = useState<OSISettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resolvedTenantId = tenantId || await getTenantIdOrDemo();
      
      if (!resolvedTenantId) {
        throw new Error('No tenant ID available');
      }

      // Seed demo data if needed (dev mode)
      const url = new URL(window.location.href);
      const isDev = url.searchParams.get('dev') === '1' || import.meta.env.MODE === 'development';
      
      if (isDev) {
        await supabase.rpc('osi_seed_demo_data_v1', { p_tenant: resolvedTenantId });
      }

      // Fetch all OSI data in parallel
      const [overviewResult, layersResult, outliersResult, settingsResult] = await Promise.all([
        supabase.rpc('osi_get_overview_v1', { p_tenant: resolvedTenantId }),
        supabase.rpc('osi_get_layers_v1', { p_tenant: resolvedTenantId }),
        supabase.rpc('osi_get_span_outliers_v1', { p_tenant: resolvedTenantId }),
        supabase.rpc('osi_get_settings_v1', { p_tenant: resolvedTenantId })
      ]);

      if (overviewResult.error) throw overviewResult.error;
      if (layersResult.error) throw layersResult.error;
      if (outliersResult.error) throw outliersResult.error;
      if (settingsResult.error) throw settingsResult.error;

      setOverview(overviewResult.data?.[0] || null);
      setLayers(layersResult.data || []);
      setSpanOutliers((outliersResult.data || []).map(outlier => ({
        ...outlier,
        severity: outlier.severity as 'low' | 'high' | 'ok'
      })));
      setSettings(settingsResult.data?.[0] || null);

    } catch (err: any) {
      setError(err.message || 'Failed to load OSI data');
      console.error('OSI data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const refresh = useCallback(async () => {
    try {
      const resolvedTenantId = tenantId || await getTenantIdOrDemo();
      if (!resolvedTenantId) throw new Error('No tenant ID available');

      await supabase.rpc('osi_refresh_v1', { p_tenant: resolvedTenantId });
      
      toast({
        title: 'OSI Data Refreshed',
        description: 'Organizational structure analysis has been updated.',
      });

      // Refresh the data after recompute
      await fetchData();
    } catch (err: any) {
      toast({
        title: 'Refresh Failed',
        description: err.message || 'Failed to refresh OSI data',
        variant: 'destructive'
      });
    }
  }, [tenantId, toast, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    overview,
    layers,
    spanOutliers,
    settings,
    loading,
    error,
    refresh,
    refetch: fetchData
  };
};