import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIRecommendation {
  id: string;
  company_id: string;
  employee_id: string;
  recommendation_type: 'promotion' | 'transfer' | 'warning' | 'retention' | 'training' | 'salary_adjustment';
  confidence_score: number;
  reasoning: string;
  recommended_action: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'implemented';
  reviewed_by?: string;
  reviewed_at?: string;
  implementation_deadline?: string;
  created_at: string;
  updated_at: string;
  employee?: {
    first_name: string;
    last_name: string;
    position: string;
    department: string;
  };
}

export const useAIRecommendations = (companyId?: string, employeeId?: string) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ai_recommendations')
        .select(`
          *,
          employee:employees(first_name, last_name, position, department)
        `)
        .order('created_at', { ascending: false });

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      } else if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecommendations((data as any) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendation = async (employeeId: string, forceRefresh = false) => {
    try {
      const response = await supabase.functions.invoke('ai-recommendation-engine', {
        body: { employee_id: employeeId, force_refresh: forceRefresh }
      });

      if (response.error) throw response.error;
      
      // Refresh recommendations list
      await fetchRecommendations();
      
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to generate recommendation');
    }
  };

  const updateRecommendationStatus = async (
    id: string, 
    status: AIRecommendation['status'],
    reviewerId?: string
  ) => {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (reviewerId) {
        updates.reviewed_by = reviewerId;
        updates.reviewed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('ai_recommendations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, ...updates } : rec)
      );

      return data as AIRecommendation;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update recommendation');
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [companyId, employeeId]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
    generateRecommendation,
    updateRecommendationStatus
  };
};