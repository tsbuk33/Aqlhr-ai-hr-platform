import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AISyncEvent {
  id: string;
  company_id: string;
  event_type: string;
  source_table: string;
  source_record_id: string;
  sync_status: 'pending' | 'processing' | 'completed' | 'failed';
  affected_modules: string[];
  payload: any;
  processed_at?: string;
  error_message?: string;
  sync_latency_ms?: number;
  created_at: string;
}

export const useAISync = () => {
  const [syncEvents, setSyncEvents] = useState<AISyncEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSyncEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_sync_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSyncEvents((data || []) as AISyncEvent[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const processSyncEvent = async (eventId: string) => {
    try {
      const response = await supabase.functions.invoke('ai-sync-engine', {
        body: { event_id: eventId }
      });

      if (response.error) throw response.error;
      
      // Refresh events list
      await fetchSyncEvents();
      
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to process sync event');
    }
  };

  const triggerManualSync = async () => {
    try {
      const response = await supabase.functions.invoke('ai-sync-engine', {
        body: { manual_sync: true }
      });

      if (response.error) throw response.error;
      
      // Refresh events list
      await fetchSyncEvents();
      
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to trigger manual sync');
    }
  };

  const getSyncStats = () => {
    const stats = {
      total: syncEvents.length,
      pending: syncEvents.filter(e => e.sync_status === 'pending').length,
      completed: syncEvents.filter(e => e.sync_status === 'completed').length,
      failed: syncEvents.filter(e => e.sync_status === 'failed').length,
      avgLatency: 0
    };

    const completedEvents = syncEvents.filter(e => e.sync_latency_ms);
    if (completedEvents.length > 0) {
      stats.avgLatency = Math.round(
        completedEvents.reduce((sum, e) => sum + (e.sync_latency_ms || 0), 0) / completedEvents.length
      );
    }

    return stats;
  };

  useEffect(() => {
    fetchSyncEvents();
  }, []);

  return {
    syncEvents,
    loading,
    error,
    refetch: fetchSyncEvents,
    processSyncEvent,
    triggerManualSync,
    getSyncStats
  };
};