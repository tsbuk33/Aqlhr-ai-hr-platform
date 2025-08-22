import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ROISummary {
  tasks: number;
  letters: number;
  docs: number;
  autopilot_runs: number;
  exports: number;
  hours_saved: number;
}

interface ROITrend {
  d: string;
  tasks: number;
  letters: number;
  docs: number;
  autopilot_runs: number;
  exports: number;
  hours_saved: number;
}

export const useROI = () => {
  const [summary, setSummary] = useState<ROISummary | null>(null);
  const [trend, setTrend] = useState<ROITrend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchROISummary = async (tenantId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('roi_get_last30_v1', {
        p_tenant: tenantId
      });

      if (error) throw error;
      setSummary(data ? data as unknown as ROISummary : null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch ROI summary';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchROITrend = async (tenantId: string, days = 30) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('roi_get_trend_v1', {
        p_tenant: tenantId,
        p_days: days
      });

      if (error) throw error;
      setTrend(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch ROI trend';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const backfillSnapshots = async (tenantId: string, days = 30) => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc('roi_backfill_snapshots_v1', {
        p_tenant: tenantId,
        p_days: days
      });

      if (error) throw error;
      toast.success(`ROI snapshots backfilled for ${days} days`);
      
      // Refresh data
      await Promise.all([
        fetchROISummary(tenantId),
        fetchROITrend(tenantId, days)
      ]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to backfill ROI snapshots';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const createShareLink = async (tenantId: string, kind: 'dashboard_snapshot' | 'cci_export', payload: any, hoursValid = 24) => {
    try {
      setLoading(true);
      const token = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + hoursValid);

      const { data, error } = await supabase
        .from('share_links')
        .insert({
          tenant_id: tenantId,
          kind,
          token,
          expires_at: expiresAt.toISOString(),
          payload
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Share link created successfully');
      return token;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create share link';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    summary,
    trend,
    loading,
    error,
    fetchROISummary,
    fetchROITrend,
    backfillSnapshots,
    createShareLink
  };
};