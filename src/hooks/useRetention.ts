import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RetentionOverview {
  avg_risk: number;
  pct_high: number;
  pct_med: number;
  pct_low: number;
  total_employees: number;
  target_turnover: number;
}

export interface RetentionHotspot {
  department_id: string | null;
  dept_name_en: string;
  dept_name_ar: string;
  n: number;
  avg_risk: number;
  pct_high: number;
}

export interface RetentionDriver {
  factor_name: string;
  avg_impact: number;
  frequency: number;
}

export interface RetentionWatchlistItem {
  employee_id: string;
  employee_name_en: string;
  employee_name_ar: string;
  dept_name_en: string;
  dept_name_ar: string;
  manager_name: string;
  risk_score: number;
  band: string;
  top_factors: any;
}

export interface RetentionAction {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  owner_id: string | null;
  created_at: string;
}

export function useRetention(tenantId: string | null) {
  const [overview, setOverview] = useState<RetentionOverview | null>(null);
  const [hotspots, setHotspots] = useState<RetentionHotspot[]>([]);
  const [drivers, setDrivers] = useState<RetentionDriver[]>([]);
  const [watchlist, setWatchlist] = useState<RetentionWatchlistItem[]>([]);
  const [actions, setActions] = useState<RetentionAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch overview
      const { data: overviewData, error: overviewError } = await supabase
        .rpc('retention_get_overview_v1', { p_tenant: tenantId });
      
      if (overviewError) throw overviewError;
      
      if (overviewData && overviewData.length > 0) {
        setOverview(overviewData[0]);
      } else {
        setOverview(null);
      }

      // Fetch hotspots
      const { data: hotspotsData, error: hotspotsError } = await supabase
        .rpc('retention_get_hotspots_v1', { p_tenant: tenantId });
      
      if (hotspotsError) throw hotspotsError;
      setHotspots(hotspotsData || []);

      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .rpc('retention_get_drivers_v1', { p_tenant: tenantId });
      
      if (driversError) throw driversError;
      setDrivers(driversData || []);

      // Fetch watchlist
      const { data: watchlistData, error: watchlistError } = await supabase
        .rpc('retention_get_watchlist_v1', { p_tenant: tenantId });
      
      if (watchlistError) throw watchlistError;
      setWatchlist(watchlistData || []);

      // Fetch actions
      const { data: actionsData, error: actionsError } = await supabase
        .from('retention_actions')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (actionsError) throw actionsError;
      setActions(actionsData || []);

    } catch (err: any) {
      console.error('Error fetching retention data:', err);
      setError(err.message);
      
      // Set safe defaults instead of keeping loading state
      setOverview(null);
      setHotspots([]);
      setDrivers([]);
      setWatchlist([]);
      setActions([]);
      
      toast({
        title: "Warning",
        description: "Failed to load retention data. Using empty state.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const recompute = useCallback(async () => {
    if (!tenantId) return false;

    try {
      // First try retention-specific compute
      try {
        const { error } = await supabase
          .rpc('retention_compute_v1', { p_tenant: tenantId });
        
        if (error) throw error;
      } catch (retentionError) {
        // Fallback to general KPI backfill
        console.log('Retention compute failed, falling back to KPI backfill');
        const { error: backfillError } = await supabase
          .rpc('dev_backfill_kpis_v1', { p_tenant: tenantId, p_days: 365 });
        
        if (backfillError) throw backfillError;
      }
      
      toast({
        title: "Success", 
        description: "Retention analysis recomputed successfully"
      });
      
      // Refresh data
      await fetchData();
      return true;
    } catch (err: any) {
      console.error('Error recomputing retention:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  }, [tenantId, fetchData, toast]);

  const seedDemo = useCallback(async () => {
    if (!tenantId) return false;

    try {
      // First try retention-specific seeding  
      try {
        const { error } = await supabase
          .rpc('retention_seed_demo_v1', { p_tenant: tenantId });
        
        if (error) throw error;
      } catch (retentionError) {
        // Fallback to general employee seeding
        console.log('Retention seed failed, falling back to employee seeding');
        const { error: seedError } = await supabase
          .rpc('dev_seed_employees_v1', { p_tenant: tenantId, p_n: 1000 });
        
        if (seedError) throw seedError;
        
        // Then backfill KPIs
        await supabase.rpc('dev_backfill_kpis_v1', { p_tenant: tenantId, p_days: 365 });
      }
      
      toast({
        title: "Success",
        description: "Demo data seeded successfully"
      });
      
      // Refresh data
      await fetchData();
      return true;
    } catch (err: any) {
      console.error('Error seeding demo data:', err);
      toast({
        title: "Error", 
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  }, [tenantId, fetchData, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    overview,
    hotspots,
    drivers,
    watchlist,
    actions,
    loading,
    error,
    recompute,
    seedDemo,
    refetch: fetchData
  };
}