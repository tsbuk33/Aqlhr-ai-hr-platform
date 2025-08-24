import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { useToast } from '@/hooks/use-toast';

export interface OSIOverview {
  total_layers: number;
  highest_saudized_layer: number;
  critical_layers_below_target: number;
  layers: OSILayerData[];
  management_cost?: number; // Temporary for backward compatibility
}

export interface OSILayerData {
  layer_code: string;
  layer_order: number;
  name_en: string;
  name_ar: string;
  headcount: number;
  saudi_hc: number;
  non_saudi_hc: number;
  saudization_rate: number;
  target_rate: number;
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
        await supabase.rpc('dev_seed_osi_v1', { p_tenant: resolvedTenantId });
      }

      // Fetch OSI overview data
      const overviewResult = await supabase.rpc('osi_overview_v1', { p_tenant: resolvedTenantId });

      if (overviewResult.error) throw overviewResult.error;

      const overviewData = overviewResult.data?.[0];
      if (overviewData) {
        const layersData = (overviewData.layers as any[])?.map((layer: any) => ({
          layer_code: layer.layer_code,
          layer_order: layer.layer_order,
          name_en: layer.name_en,
          name_ar: layer.name_ar,
          headcount: layer.headcount,
          saudi_hc: layer.saudi_hc,
          non_saudi_hc: layer.non_saudi_hc,
          saudization_rate: layer.saudization_rate,
          target_rate: layer.target_rate
        })) || [];
        
        setOverview({
          total_layers: overviewData.total_layers,
          highest_saudized_layer: overviewData.highest_saudized_layer,
          critical_layers_below_target: overviewData.critical_layers_below_target,
          layers: layersData,
          management_cost: 0 // Temporary placeholder
        });
        // Convert layer data to legacy format for compatibility
        setLayers(layersData.map((layer: any) => ({
          layer: layer.layer_order,
          headcount: layer.headcount,
          saudi_headcount: layer.saudi_hc,
          saudization_rate: layer.saudization_rate,
          avg_salary: 0,
          total_salary: 0
        })));
      } else {
        setOverview(null);
        setLayers([]);
      }

      // Set default settings and empty outliers for now
      setSpanOutliers([]);
      setSettings({ saudi_target: 60, span_min: 3, span_max: 10 });

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

      // Run OSI seeding to ensure all employees have grades
      await supabase.rpc('dev_seed_osi_v1', { p_tenant: resolvedTenantId });
      
      toast({
        title: 'OSI Data Recomputed',
        description: 'Organizational structure analysis has been updated.',
      });

      // Refresh the data after recompute
      await fetchData();
    } catch (err: any) {
      toast({
        title: 'Recompute Failed',
        description: err.message || 'Failed to recompute OSI data',
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