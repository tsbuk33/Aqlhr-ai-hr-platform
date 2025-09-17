import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GovAdapter {
  id: string;
  tenant_id: string;
  system: string;
  status: string;
  mode?: string;
  config: any;
  last_sync: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface GovJob {
  id: string;
  tenant_id: string;
  system: string;
  job_type: string;
  status: string;
  payload: any;
  result: any;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  error: string | null;
}

export interface GovEvent {
  id: string;
  tenant_id: string;
  system: string;
  event_at: string;
  kind: string;
  severity: string;
  message: string;
  data: any;
}

export const useGovHub = () => {
  const [adapters, setAdapters] = useState<GovAdapter[]>([]);
  const [jobs, setJobs] = useState<GovJob[]>([]);
  const [events, setEvents] = useState<GovEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch adapters
  const fetchAdapters = async () => {
    try {
      const { data, error } = await supabase
        .from('gov_adapters')
        .select('*')
        .order('system');
      
      if (error) throw error;
      setAdapters(data || []);
    } catch (error) {
      console.error('Error fetching adapters:', error);
      toast.error('Failed to fetch government adapters');
    }
  };

  // Fetch jobs
  const fetchJobs = async (limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('gov_sync_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch sync jobs');
    }
  };

  // Fetch events
  const fetchEvents = async (limit = 100) => {
    try {
      const { data, error } = await supabase
        .from('gov_events')
        .select('*')
        .order('event_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch government events');
    }
  };

  // Queue a sync job
  const queueJob = async (system: string, jobType: string, payload = {}) => {
    try {
      const { data, error } = await supabase.rpc('gov_queue_job_v1' as any, {
        p_tenant: (await supabase.auth.getUser()).data.user?.id,
        p_system: system,
        p_job: jobType,
        p_payload: payload
      });
      
      if (error) throw error;
      
      toast.success(`${system.toUpperCase()} sync job queued`);
      await fetchJobs();
      return data;
    } catch (error) {
      console.error('Error queueing job:', error);
      toast.error(`Failed to queue ${system} sync job`);
      throw error;
    }
  };

  // Update adapter configuration
  const updateAdapterConfig = async (system: string, config: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('gov_adapters')
        .update({ config })
        .eq('system', system);
      
      if (error) throw error;
      
      toast.success(`${system.toUpperCase()} configuration updated`);
      await fetchAdapters();
    } catch (error) {
      console.error('Error updating adapter config:', error);
      toast.error(`Failed to update ${system} configuration`);
      throw error;
    }
  };

  // Switch adapter mode (demo/live)
  const switchMode = async (system: string, status: 'demo' | 'connected') => {
    try {
      const { error } = await supabase
        .from('gov_adapters')
        .update({ status })
        .eq('system', system);
      
      if (error) throw error;
      
      toast.success(`${system.toUpperCase()} switched to ${status} mode`);
      await fetchAdapters();
    } catch (error) {
      console.error('Error switching adapter mode:', error);
      toast.error(`Failed to switch ${system} mode`);
      throw error;
    }
  };

  // Test connection
  const testConnection = async (system: string) => {
    try {
      // Queue a status check job
      await queueJob(system, 'status_check');
      toast.info(`Testing ${system.toUpperCase()} connection...`);
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error(`Failed to test ${system} connection`);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAdapters(),
        fetchJobs(),
        fetchEvents()
      ]);
      setLoading(false);
    };

    initializeData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const jobsSubscription = supabase
      .channel('gov_sync_jobs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'gov_sync_jobs' },
        () => fetchJobs()
      )
      .subscribe();

    const eventsSubscription = supabase
      .channel('gov_events')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'gov_events' },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      jobsSubscription.unsubscribe();
      eventsSubscription.unsubscribe();
    };
  }, []);

  return {
    adapters,
    jobs,
    events,
    loading,
    fetchAdapters,
    fetchJobs,
    fetchEvents,
    queueJob,
    updateAdapterConfig,
    switchMode,
    testConnection,
    refetch: () => Promise.all([fetchAdapters(), fetchJobs(), fetchEvents()])
  };
};