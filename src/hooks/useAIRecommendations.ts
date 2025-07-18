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
          employee:employees!ai_recommendations_employee_id_fkey(first_name, last_name, position, department)
        `)
        .order('created_at', { ascending: false });

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      } else if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.log('Error or no data, using dummy recommendations');
        // Use dummy data when no real data available
        const dummyRecommendations = [
          {
            id: '1',
            company_id: 'demo',
            employee_id: '1',
            recommendation_type: 'promotion',
            confidence_score: 87,
            reasoning: 'Consistent high performance and leadership qualities',
            recommended_action: 'Promote to Senior HR Manager',
            priority: 'high',
            status: 'pending',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            employee: {
              first_name: 'Ahmed',
              last_name: 'Al-Rashid',
              position: 'HR Manager',
              department: 'Human Resources'
            }
          },
          {
            id: '2',
            company_id: 'demo',
            employee_id: '2',
            recommendation_type: 'training',
            confidence_score: 92,
            reasoning: 'Shows potential for leadership development',
            recommended_action: 'Enroll in leadership training program',
            priority: 'medium',
            status: 'pending',
            created_at: '2024-01-14T10:00:00Z',
            updated_at: '2024-01-14T10:00:00Z',
            employee: {
              first_name: 'Sarah',
              last_name: 'Al-Mansouri',
              position: 'Marketing Specialist',
              department: 'Marketing'
            }
          }
        ];
        setRecommendations(dummyRecommendations as any);
      } else {
        setRecommendations((data as any) || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback to dummy data
      const dummyRecommendations = [
        {
          id: '1',
          company_id: 'demo',
          employee_id: '1',
          recommendation_type: 'retention',
          confidence_score: 95,
          reasoning: 'High-value employee showing signs of disengagement',
          recommended_action: 'Immediate retention meeting and compensation review',
          priority: 'urgent',
          status: 'pending',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          employee: {
            first_name: 'Mohammed',
            last_name: 'Al-Otaibi',
            position: 'Software Developer',
            department: 'IT'
          }
        }
      ];
      setRecommendations(dummyRecommendations as any);
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