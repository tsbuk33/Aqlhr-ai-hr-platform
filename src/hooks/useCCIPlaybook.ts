import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Initiative {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  duration_weeks: number;
  expected_impact: string;
  kpis: Array<{
    metric: string;
    target: string;
    baseline?: number;
  }>;
  milestones: Array<{
    week: number;
    title: string;
    description: string;
  }>;
  // Additional properties for display compatibility
  status?: string;
  impact?: string;
  effort?: string;
  aiConfidence?: number;
  frameworks?: string[];
  duration?: number; // For backwards compatibility
}

interface Playbook {
  id: string;
  tenant_id: string;
  survey_id: string;
  wave_id: string;
  title: string;
  description?: string;
  status: string;
  initiatives: Initiative[];
  schedule: any;
  ai_summary?: string;
  comms_en?: string;
  comms_ar?: string;
  manager_brief?: string;
  created_at: string;
  updated_at: string;
}

interface GeneratePlaybookParams {
  tenantId: string;
  surveyId: string;
  waveId: string;
}

export const useCCIPlaybook = (tenantId?: string, surveyId?: string, waveId?: string) => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [currentPlaybook, setCurrentPlaybook] = useState<Playbook | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPlaybooks = async () => {
    if (!tenantId) return;
    
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('cci_playbooks')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (surveyId) {
        query = query.eq('survey_id', surveyId);
      }

      if (waveId) {
        query = query.eq('wave_id', waveId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching playbooks:', error);
        setError(error.message);
        toast({
          title: "Error fetching playbooks",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Cast the data to proper types
      const typedPlaybooks = (data || []).map(item => ({
        ...item,
        initiatives: Array.isArray(item.initiatives) ? (item.initiatives as unknown) as Initiative[] : []
      })) as Playbook[];

      setPlaybooks(typedPlaybooks);
      
      // Set current playbook to the most recent one for the specified wave
      if (typedPlaybooks && typedPlaybooks.length > 0 && surveyId && waveId) {
        const currentWavePlaybook = typedPlaybooks.find(p => p.survey_id === surveyId && p.wave_id === waveId);
        setCurrentPlaybook(currentWavePlaybook || typedPlaybooks[0]);
      }

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "Failed to load playbooks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePlaybook = async ({ tenantId, surveyId, waveId }: GeneratePlaybookParams) => {
    try {
      setGenerating(true);
      setError(null);

      console.log('Generating playbook for:', { tenantId, surveyId, waveId });

      const { data, error } = await supabase.functions.invoke('agent-cci-change-plan-v1', {
        body: {
          tenantId,
          surveyId,
          waveId
        }
      });

      if (error) {
        console.error('Error generating playbook:', error);
        setError(error.message);
        toast({
          title: "Error generating playbook",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      if (data?.error) {
        console.error('Agent error:', data.error);
        setError(data.error);
        toast({
          title: "AI Agent Error",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Playbook Generated Successfully",
        description: `Created ${data.initiatives_count || 0} initiatives in ${data.execution_time_ms || 0}ms`,
      });

      // Refresh playbooks to get the newly created one
      await fetchPlaybooks();
      
      return data;

    } catch (err) {
      console.error('Unexpected error generating playbook:', err);
      setError('An unexpected error occurred while generating the playbook');
      toast({
        title: "Error",
        description: "Failed to generate playbook",
        variant: "destructive"
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const updatePlaybookStatus = async (playbookId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('cci_playbooks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', playbookId);

      if (error) {
        console.error('Error updating playbook status:', error);
        toast({
          title: "Error updating status",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Refresh playbooks
      await fetchPlaybooks();

      toast({
        title: "Status Updated",
        description: `Playbook status changed to ${status}`,
      });

    } catch (err) {
      console.error('Unexpected error updating status:', err);
      toast({
        title: "Error",
        description: "Failed to update playbook status",
        variant: "destructive"
      });
    }
  };

  const deletePlaybook = async (playbookId: string) => {
    try {
      const { error } = await supabase
        .from('cci_playbooks')
        .delete()
        .eq('id', playbookId);

      if (error) {
        console.error('Error deleting playbook:', error);
        toast({
          title: "Error deleting playbook",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Refresh playbooks
      await fetchPlaybooks();

      toast({
        title: "Playbook Deleted",
        description: "Playbook has been successfully deleted",
      });

    } catch (err) {
      console.error('Unexpected error deleting playbook:', err);
      toast({
        title: "Error",
        description: "Failed to delete playbook",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchPlaybooks();
    }
  }, [tenantId, surveyId, waveId]);

  return {
    playbooks,
    currentPlaybook,
    loading,
    generating,
    error,
    generatePlaybook,
    updatePlaybookStatus,
    deletePlaybook,
    refetch: fetchPlaybooks
  };
};