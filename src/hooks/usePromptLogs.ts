import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PromptLog {
  id: string;
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
  user_id?: string;
  company_id?: string;
}

export interface PromptLogFilters {
  status?: string;
  category?: string;
  priority?: string;
}

export const usePromptLogs = () => {
  const [logs, setLogs] = useState<PromptLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (filters?: PromptLogFilters) => {
    try {
      setLoading(true);
      // Mock data for now since table doesn't exist yet
      const mockData: PromptLog[] = [
        {
          id: '1',
          user_prompt: 'Create a dashboard for HR analytics',
          ai_response: 'I will create a comprehensive HR analytics dashboard...',
          category: 'feature_request',
          priority: 'high',
          status: 'completed',
          summary: 'HR Analytics Dashboard',
          commit_hash: 'abc123',
          implementation_notes: 'Successfully implemented with charts and filters',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          user_prompt: 'Fix authentication bug in login flow',
          ai_response: 'Fixed the authentication issue by updating the auth provider...',
          category: 'bug_fix',
          priority: 'critical',
          status: 'completed',
          summary: 'Authentication Bug Fix',
          commit_hash: 'def456',
          implementation_notes: 'Bug resolved, testing completed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      let filteredData = mockData;
      if (filters?.status && filters.status !== 'all') {
        filteredData = filteredData.filter(log => log.status === filters.status);
      }
      if (filters?.category && filters.category !== 'all') {
        filteredData = filteredData.filter(log => log.category === filters.category);
      }
      if (filters?.priority && filters.priority !== 'all') {
        filteredData = filteredData.filter(log => log.priority === filters.priority);
      }
      
      setLogs(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (logData: Omit<PromptLog, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Mock creation for now
      const newLog: PromptLog = {
        ...logData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create log');
      throw err;
    }
  };

  const updateLog = async (id: string, updates: Partial<PromptLog>) => {
    try {
      // Mock update for now
      setLogs(prev => prev.map(log => 
        log.id === id 
          ? { ...log, ...updates, updated_at: new Date().toISOString() }
          : log
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update log');
      throw err;
    }
  };

  const exportLogs = async (format: 'json' | 'csv' = 'json') => {
    try {
      const { data, error } = await supabase.functions.invoke('prompt-log-export', {
        body: { format }
      });

      if (error) throw error;
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: format === 'json' ? 'application/json' : 'text/csv'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export logs');
      throw err;
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
    exportLogs
  };
};