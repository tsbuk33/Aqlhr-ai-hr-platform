import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface LearningEngagementInsight {
  id: string;
  company_id: string;
  employee_id: string;
  learning_engagement_score: number;
  skills_completion_rate: number;
  engagement_impact_on_learning: number;
  learning_impact_on_engagement: number;
  recommended_learning_actions: Json;
  recommended_engagement_actions: Json;
}

interface CrossSystemRecommendation {
  id: string;
  company_id: string;
  employee_id: string;
  source_system: string;
  target_system: string;
  recommendation_type: string;
  recommendation_data: Json;
  priority_score: number;
  is_active: boolean;
}

interface LearningProgress {
  id: string;
  company_id: string;
  employee_id: string;
  skill_name: string;
  skill_category: string;
  current_level: number;
  target_level: number;
  completion_percentage: number;
  learning_streak_days: number;
  last_activity_date: string;
  engagement_correlation: number;
}

interface EngagementMetrics {
  id: string;
  company_id: string;
  employee_id: string;
  engagement_score: number;
  pulse_response_rate: number;
  recognition_given: number;
  recognition_received: number;
  connections_made: number;
  collaboration_score: number;
  learning_correlation: number;
  measurement_date: string;
}

export const useLeoGeoIntegration = () => {
  const [learningEngagementInsights, setLearningEngagementInsights] = useState<LearningEngagementInsight[]>([]);
  const [crossSystemRecommendations, setCrossSystemRecommendations] = useState<CrossSystemRecommendation[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch learning engagement insights
  const fetchLearningEngagementInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_engagement_insights')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setLearningEngagementInsights(data || []);
    } catch (err) {
      console.error('Error fetching learning engagement insights:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Fetch cross-system recommendations
  const fetchCrossSystemRecommendations = async (sourceSystem?: 'leo' | 'geo') => {
    try {
      let query = supabase
        .from('cross_system_recommendations')
        .select('*')
        .eq('is_active', true);

      if (sourceSystem) {
        query = query.eq('source_system', sourceSystem);
      }

      const { data, error } = await query
        .order('priority_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCrossSystemRecommendations(data || []);
    } catch (err) {
      console.error('Error fetching cross-system recommendations:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Fetch learning progress
  const fetchLearningProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_progress_tracking')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setLearningProgress(data || []);
    } catch (err) {
      console.error('Error fetching learning progress:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Fetch engagement metrics
  const fetchEngagementMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('engagement_metrics_tracking')
        .select('*')
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      setEngagementMetrics(data || []);
    } catch (err) {
      console.error('Error fetching engagement metrics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Create learning progress entry
  const createLearningProgress = async (progressData: Omit<LearningProgress, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('learning_progress_tracking')
        .insert([progressData])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh data
      await fetchLearningProgress();
      await fetchLearningEngagementInsights();
      
      return data;
    } catch (err) {
      console.error('Error creating learning progress:', err);
      throw err;
    }
  };

  // Create engagement metrics entry
  const createEngagementMetrics = async (metricsData: Omit<EngagementMetrics, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('engagement_metrics_tracking')
        .insert([metricsData])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh data
      await fetchEngagementMetrics();
      await fetchLearningEngagementInsights();
      
      return data;
    } catch (err) {
      console.error('Error creating engagement metrics:', err);
      throw err;
    }
  };

  // Create cross-system recommendation
  const createCrossSystemRecommendation = async (recommendationData: Omit<CrossSystemRecommendation, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('cross_system_recommendations')
        .insert([recommendationData])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh recommendations
      await fetchCrossSystemRecommendations();
      
      return data;
    } catch (err) {
      console.error('Error creating cross-system recommendation:', err);
      throw err;
    }
  };

  // Get engagement insights for learning system
  const getEngagementInsightsForLeo = () => {
    return crossSystemRecommendations
      .filter(rec => rec.target_system === 'leo')
      .map(rec => {
        const data = typeof rec.recommendation_data === 'object' && rec.recommendation_data !== null 
          ? rec.recommendation_data as any 
          : {};
        return {
          title: data.title || 'Engagement-Based Learning Suggestion',
          description: data.description || 'Suggested based on engagement patterns',
          priority: rec.priority_score,
          actionType: rec.recommendation_type,
          data: rec.recommendation_data
        };
      });
  };

  // Get learning insights for engagement system
  const getLearningInsightsForGeo = () => {
    return crossSystemRecommendations
      .filter(rec => rec.target_system === 'geo')
      .map(rec => {
        const data = typeof rec.recommendation_data === 'object' && rec.recommendation_data !== null 
          ? rec.recommendation_data as any 
          : {};
        return {
          title: data.title || 'Learning-Based Engagement Suggestion',
          description: data.description || 'Suggested based on learning progress',
          priority: rec.priority_score,
          actionType: rec.recommendation_type,
          data: rec.recommendation_data
        };
      });
  };

  // Get aggregated insights
  const getAggregatedInsights = () => {
    const avgLearningEngagement = learningEngagementInsights.reduce((sum, insight) => 
      sum + insight.learning_engagement_score, 0) / (learningEngagementInsights.length || 1);
    
    const avgSkillsCompletion = learningEngagementInsights.reduce((sum, insight) => 
      sum + insight.skills_completion_rate, 0) / (learningEngagementInsights.length || 1);
    
    const avgEngagementScore = engagementMetrics.reduce((sum, metric) => 
      sum + metric.engagement_score, 0) / (engagementMetrics.length || 1);

    return {
      overallLearningEngagement: Math.round(avgLearningEngagement),
      skillsCompletionRate: Math.round(avgSkillsCompletion),
      engagementScore: Math.round(avgEngagementScore),
      totalRecommendations: crossSystemRecommendations.length,
      activeLearningStreaks: learningProgress.filter(lp => lp.learning_streak_days > 0).length,
      highPerformers: learningEngagementInsights.filter(li => li.learning_engagement_score > 80).length
    };
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchLearningEngagementInsights(),
          fetchCrossSystemRecommendations(),
          fetchLearningProgress(),
          fetchEngagementMetrics()
        ]);
      } catch (err) {
        console.error('Error initializing LEO-GEO integration data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  return {
    // Data
    learningEngagementInsights,
    crossSystemRecommendations,
    learningProgress,
    engagementMetrics,
    
    // Loading states
    loading,
    error,
    
    // Actions
    createLearningProgress,
    createEngagementMetrics,
    createCrossSystemRecommendation,
    fetchCrossSystemRecommendations,
    
    // Computed data
    getEngagementInsightsForLeo,
    getLearningInsightsForGeo,
    getAggregatedInsights
  };
};