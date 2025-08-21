import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GovIntegration {
  id: string;
  system: string;
  is_connected: boolean;
  is_enabled: boolean;
  last_sync_at: string | null;
  last_sync_status: string | null;
  sync_frequency: string;
  last_error_message: string | null;
}

export const useGovIntegrations = () => {
  const [integrations, setIntegrations] = useState<GovIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('gov_integrations')
        .select('*')
        .order('system');

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load government integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (system: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(`sync-${system}-v1`, {
        body: { 
          testMode: true,
          dryRun: true 
        }
      });

      if (error) throw error;

      toast({
        title: "Integration Test",
        description: `${system.toUpperCase()} integration test completed successfully`,
      });

      // Refresh integrations to show updated status
      await fetchIntegrations();
    } catch (error) {
      console.error(`Error testing ${system} integration:`, error);
      toast({
        title: "Integration Test Failed",
        description: `Failed to test ${system.toUpperCase()} integration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    integrations,
    loading,
    testIntegration,
    refetch: fetchIntegrations
  };
};