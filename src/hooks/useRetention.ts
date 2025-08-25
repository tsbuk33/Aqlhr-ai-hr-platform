import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RetentionOverview {
  avg_risk: number;
  high_risk_percentage: number;
  target_turnover: number;
  low_risk_count: number;
  med_risk_count: number;
  high_risk_count: number;
  last_12m_exits: number;
  sparkline_data: Array<{ month: string; exits: number }>;
  // Legacy compatibility
  pct_high?: number;
  pct_med?: number;
  pct_low?: number;
  total_employees?: number;
}

export interface RetentionWatchlistItem {
  unit_name: string;
  unit_type: string;
  headcount: number;
  risk_score: number;
  recent_exits_12m: number;
  // Legacy compatibility - for watchlist view we'll show organizational units
  employee_id?: string;
  employee_name_en?: string;
  employee_name_ar?: string;
  dept_name_en?: string;
  dept_name_ar?: string;
  manager_name?: string;
  band?: string;
  top_factors?: any;
}

export interface RetentionDriver {
  driver_name: string;
  contribution_percentage: number;
  affected_count: number;
  // Legacy compatibility
  factor_name?: string;
  avg_impact?: number;
  frequency?: number;
}

// Legacy compatibility export for backward compatibility
export interface RetentionHotspot {
  department_id: string | null;
  dept_name_en: string;
  dept_name_ar: string;
  n: number;
  avg_risk: number;
  pct_high: number;
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
  const [drivers, setDrivers] = useState<RetentionDriver[]>([]);
  const [watchlist, setWatchlist] = useState<RetentionWatchlistItem[]>([]);
  const [actions, setActions] = useState<RetentionAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Legacy hotspots - derived from watchlist for backward compatibility
  const [hotspots, setHotspots] = useState<RetentionHotspot[]>([]);
  
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
        .rpc('retention_overview_v1', { p_tenant: tenantId });
      
      if (overviewError) throw overviewError;
      
      if (overviewData && overviewData.length > 0) {
        const overview = overviewData[0];
        const totalEmployees = overview.low_risk_count + overview.med_risk_count + overview.high_risk_count;
        
        setOverview({
          ...overview,
          sparkline_data: Array.isArray(overview.sparkline_data) 
            ? overview.sparkline_data.map((item: any) => ({
                month: item.month || '',
                exits: item.exits || 0
              }))
            : [],
          // Add legacy compatibility
          pct_high: overview.high_risk_percentage,
          pct_med: totalEmployees > 0 ? (overview.med_risk_count / totalEmployees) * 100 : 0,
          pct_low: totalEmployees > 0 ? (overview.low_risk_count / totalEmployees) * 100 : 0,
          total_employees: totalEmployees
        });
      } else {
        setOverview(null);
      }

      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .rpc('retention_drivers_v1', { p_tenant: tenantId });
      
      if (driversError) throw driversError;
      // Add legacy compatibility to drivers
      const mappedDrivers = (driversData || []).map((driver: any) => ({
        ...driver,
        factor_name: driver.driver_name,
        avg_impact: driver.contribution_percentage / 100,
        frequency: driver.affected_count
      }));
      setDrivers(mappedDrivers);

      // Fetch watchlist
      const { data: watchlistData, error: watchlistError } = await supabase
        .rpc('retention_watchlist_v1', { p_tenant: tenantId });
      
      if (watchlistError) throw watchlistError;
      // Map watchlist data for legacy compatibility - treating units as departments
      const mappedWatchlist = (watchlistData || []).map((item: any, index: number) => ({
        ...item,
        employee_id: `unit_${index}`,
        employee_name_en: item.unit_name,
        employee_name_ar: item.unit_name,
        dept_name_en: `${item.unit_type} - ${item.unit_name}`,
        dept_name_ar: `${item.unit_type} - ${item.unit_name}`,
        manager_name: 'Management',
        band: 'organizational_unit',
        top_factors: []
      }));
      setWatchlist(mappedWatchlist);

      // Create legacy hotspots from watchlist data
      const mappedHotspots = (watchlistData || [])
        .filter((item: any) => item.unit_type === 'Department')
        .map((item: any, index: number) => ({
          department_id: `dept_${index}`,
          dept_name_en: item.unit_name,
          dept_name_ar: item.unit_name,
          n: item.headcount,
          avg_risk: item.risk_score,
          pct_high: item.risk_score > 70 ? 80 : 20 // Mock percentage
        }));
      setHotspots(mappedHotspots);

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
      setDrivers([]);
      setWatchlist([]);
      setHotspots([]);
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
      // Use the new seeding function to regenerate data
      const { error } = await supabase
        .rpc('dev_seed_retention_v1', { p_tenant: tenantId });
      
      if (error) throw error;
      
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
      // Use the new retention seeding function
      const { error } = await supabase
        .rpc('dev_seed_retention_v1', { p_tenant: tenantId });
      
      if (error) throw error;
      
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