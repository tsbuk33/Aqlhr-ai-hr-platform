import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PromptLog {
  id: string;
  user_id: string;
  company_id: string;
  user_prompt: string;
  ai_response: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  summary?: string;
  commit_hash?: string;
  implementation_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PromptLogFilters {
  status?: string;
  category?: string;
  priority?: string;
}

export function usePromptLogs() {
  const [logs, setLogs] = useState<PromptLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (filters?: PromptLogFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('prompt_logs')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters if provided
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }
      
      setLogs((data as PromptLog[]) || []);
    } catch (err) {
      setError('Failed to fetch prompt logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (logData: Omit<PromptLog, 'id' | 'user_id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('prompt_logs')
        .insert(logData)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }
      
      setLogs(prev => [data as PromptLog, ...prev]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create log';
      return { data: null, error: errorMessage };
    }
  };

  const updateLog = async (id: string, updates: Partial<PromptLog>) => {
    try {
      // Remove fields that shouldn't be updated directly
      const { id: _, user_id, company_id, created_at, ...allowedUpdates } = updates;

      const { data, error: updateError } = await supabase
        .from('prompt_logs')
        .update(allowedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }
      
      setLogs(prev => prev.map(log => 
        log.id === id ? (data as PromptLog) : log
      ));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update log';
      return { error: errorMessage };
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('prompt_logs')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }
      
      setLogs(prev => prev.filter(log => log.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete log';
      return { error: errorMessage };
    }
  };

  const exportLogs = async (format: 'json' | 'csv' = 'json') => {
    try {
      // Fetch all logs for export
      const { data, error: fetchError } = await supabase
        .from('prompt_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (format === 'csv') {
        // Convert to CSV
        const headers = ['ID', 'User Prompt', 'AI Response', 'Category', 'Priority', 'Status', 'Summary', 'Commit Hash', 'Implementation Notes', 'Created At', 'Updated At'];
        const csvRows = [
          headers.join(','),
          ...(data || []).map(log => [
            log.id,
            `"${log.user_prompt.replace(/"/g, '""')}"`,
            `"${log.ai_response.replace(/"/g, '""')}"`,
            log.category,
            log.priority,
            log.status,
            log.summary ? `"${log.summary.replace(/"/g, '""')}"` : '',
            log.commit_hash || '',
            log.implementation_notes ? `"${log.implementation_notes.replace(/"/g, '""')}"` : '',
            log.created_at,
            log.updated_at
          ].join(','))
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-logs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Default to JSON
        const exportData = {
          exported_at: new Date().toISOString(),
          total_logs: (data || []).length,
          logs: data
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export logs';
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    createLog,
    updateLog,
    deleteLog,
    exportLogs
  };
}