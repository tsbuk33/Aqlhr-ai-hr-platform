import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIQueryResponse {
  success: boolean;
  ai_response: string;
  confidence_score: number;
  execution_time_ms: number;
  model_used: string;
  module_context: string;
  language: string;
  recommendations?: any[];
  error?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  confidence_score: number;
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  recommendation_type: string;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  expected_impact?: {
    metric: string;
    value: number;
    timeline: string;
  };
  implementation_steps?: string[];
  created_at: string;
}

export const useAICore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryAI = useCallback(async (
    query: string,
    options: {
      language?: 'en' | 'ar';
      moduleContext?: string;
      companyId?: string;
      userId?: string;
    } = {}
  ): Promise<AIQueryResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke('ai-core-engine', {
        body: {
          query,
          language: options.language || 'en',
          module_context: options.moduleContext || 'general',
          company_id: options.companyId,
          user_id: options.userId
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'AI query failed');
      }

      return response.data as AIQueryResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI query failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getWorkforceAnalytics = useCallback(async (
    companyId: string,
    analysisType: 'comprehensive' | 'basic' = 'comprehensive'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke('ai-workforce-analytics', {
        body: {
          company_id: companyId,
          analysis_type: analysisType
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Workforce analytics failed');
      }

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Workforce analytics failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (
    companyId: string,
    filters: {
      status?: string;
      priority_level?: string;
      recommendation_type?: string;
      limit?: number;
    } = {}
  ): Promise<AIRecommendation[]> => {
    try {
      // Use existing ai_recommendations table or create mock data for demonstration
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          title: 'Optimize Saudization Strategy',
          title_ar: 'تحسين استراتيجية السعودة',
          description: 'Implement targeted hiring to improve Saudization rate by 15%',
          description_ar: 'تنفيذ توظيف مستهدف لتحسين معدل السعودة بنسبة 15%',
          confidence_score: 0.92,
          priority_level: 'high',
          recommendation_type: 'workforce_optimization',
          status: 'pending',
          expected_impact: {
            metric: 'Saudization Rate',
            value: 15,
            timeline: '6 months'
          },
          implementation_steps: [
            'Identify key positions for Saudi nationals',
            'Launch targeted recruitment campaign',
            'Implement training programs'
          ],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Performance Enhancement Program',
          title_ar: 'برنامج تحسين الأداء',
          description: 'Deploy AI-powered performance tracking to boost productivity by 25%',
          description_ar: 'نشر تتبع الأداء المدعوم بالذكاء الاصطناعي لزيادة الإنتاجية بنسبة 25%',
          confidence_score: 0.87,
          priority_level: 'medium',
          recommendation_type: 'performance_enhancement',
          status: 'pending',
          expected_impact: {
            metric: 'Productivity',
            value: 25,
            timeline: '3 months'
          },
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      // Filter mock data based on provided filters
      let filteredData = mockRecommendations;
      
      if (filters.status) {
        filteredData = filteredData.filter(rec => rec.status === filters.status);
      }
      if (filters.priority_level) {
        filteredData = filteredData.filter(rec => rec.priority_level === filters.priority_level);
      }
      if (filters.recommendation_type) {
        filteredData = filteredData.filter(rec => rec.recommendation_type === filters.recommendation_type);
      }

      return filteredData.slice(0, filters.limit || 10);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      return [];
    }
  }, []);

  const updateRecommendationStatus = useCallback(async (
    recommendationId: string,
    status: 'accepted' | 'rejected' | 'implemented',
    feedback?: string
  ) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({
          status,
          feedback: feedback ? { user_feedback: feedback, updated_at: new Date().toISOString() } : undefined
        })
        .eq('id', recommendationId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating recommendation:', err);
      return false;
    }
  }, []);

  const getQueryHistory = useCallback(async (
    companyId: string,
    limit: number = 20
  ) => {
    try {
      // Return mock query history data
      return [
        {
          id: '1',
          query_text: 'What is our current Saudization rate?',
          ai_response: { content: 'Current Saudization rate is 67%', confidence_score: 0.95 },
          created_at: new Date().toISOString()
        }
      ];
    } catch (err) {
      console.error('Error fetching query history:', err);
      return [];
    }
  }, []);

  const getPerformanceMetrics = useCallback(async (
    companyId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ) => {
    try {
      // Return mock performance metrics
      return [
        {
          id: '1',
          metric_name: 'ai_accuracy',
          metric_value: 94.5,
          measurement_date: new Date().toISOString()
        }
      ];
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      return [];
    }
  }, []);

  return {
    loading,
    error,
    queryAI,
    getWorkforceAnalytics,
    getRecommendations,
    updateRecommendationStatus,
    getQueryHistory,
    getPerformanceMetrics
  };
};