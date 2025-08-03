import { useState, useEffect, useCallback } from 'react';
import { analytics, trackEvent, trackUsage, trackPageView, trackAIInteraction, AnalyticsEvent, UsageMetrics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalPageViews: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  topModules: Array<{ module: string; views: number; engagement: number }>;
  errorRate: number;
  aiInteractions: number;
  realtimeUsers: number;
}

export interface ModuleUsageStats {
  moduleName: string;
  totalUsers: number;
  avgUsageTime: number;
  completionRate: number;
  errorCount: number;
  popularFeatures: Array<{ feature: string; usage: number }>;
  userSatisfaction: number;
}

export const useAnalytics = (moduleName?: string) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [moduleStats, setModuleStats] = useState<ModuleUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track page view when hook is initialized
  useEffect(() => {
    if (moduleName && typeof window !== 'undefined') {
      const pageName = window.location.pathname.split('/').pop() || 'index';
      trackPageView(pageName, moduleName);
    }
  }, [moduleName]);

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async (timeRange: string = '7d') => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date();
      switch (timeRange) {
        case '1d':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (eventsError) throw eventsError;

      // Process analytics data
      const processedData = processAnalyticsEvents(events || []);
      setAnalyticsData(processedData);

      // If specific module requested, get module stats
      if (moduleName) {
        const moduleEvents = events?.filter(e => e.module_name === moduleName) || [];
        const moduleStatsData = processModuleStats(moduleName, moduleEvents);
        setModuleStats(moduleStatsData);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [moduleName]);

  // Refetch function for manual refresh
  const refetch = useCallback((timeRange?: string) => {
    return fetchAnalyticsData(timeRange);
  }, [fetchAnalyticsData]);

  // Track feature usage with automatic timing
  const trackFeatureUsage = useCallback((featureName: string, startTime: number = Date.now()) => {
    return {
      success: () => {
        const metrics: UsageMetrics = {
          module_name: moduleName || 'unknown',
          feature_name: featureName,
          action_type: 'click',
          duration_ms: Date.now() - startTime,
          success: true
        };
        trackUsage(metrics);
      },
      error: (errorMessage?: string) => {
        const metrics: UsageMetrics = {
          module_name: moduleName || 'unknown',
          feature_name: featureName,
          action_type: 'click',
          duration_ms: Date.now() - startTime,
          success: false,
          metadata: { error: errorMessage }
        };
        trackUsage(metrics);
      }
    };
  }, [moduleName]);

  // Track AI interactions with response measurement
  const trackAI = useCallback((query: string, startTime: number = Date.now()) => {
    return {
      success: (confidence?: number) => {
        trackAIInteraction(
          moduleName || 'unknown',
          query,
          Date.now() - startTime,
          true,
          confidence
        );
      },
      error: () => {
        trackAIInteraction(
          moduleName || 'unknown',
          query,
          Date.now() - startTime,
          false
        );
      }
    };
  }, [moduleName]);

  // Track custom events with module context
  const track = useCallback((eventType: string, properties?: Record<string, any>) => {
    trackEvent(eventType, moduleName || 'unknown', properties);
  }, [moduleName]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    analyticsData,
    moduleStats,
    loading,
    error,
    refetch,
    trackFeatureUsage,
    trackAI,
    track
  };
};

// Helper function to process raw analytics events
function processAnalyticsEvents(events: AnalyticsEvent[]): AnalyticsData {
  const pageViews = events.filter(e => e.event_type === 'page_view');
  const uniqueUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;
  
  // Calculate session durations
  const sessions = events.reduce((acc, event) => {
    if (!acc[event.session_id]) {
      acc[event.session_id] = { start: Date.parse(event.timestamp), end: Date.parse(event.timestamp) };
    } else {
      acc[event.session_id].end = Math.max(acc[event.session_id].end, Date.parse(event.timestamp));
    }
    return acc;
  }, {} as Record<string, { start: number; end: number }>);

  const avgSessionDuration = Object.values(sessions).reduce((sum, session) => 
    sum + (session.end - session.start), 0) / Object.keys(sessions).length || 0;

  // Top modules by engagement
  const moduleStats = events.reduce((acc, event) => {
    if (!acc[event.module_name]) {
      acc[event.module_name] = { views: 0, engagement: 0 };
    }
    if (event.event_type === 'page_view') acc[event.module_name].views++;
    if (event.event_type === 'feature_usage') acc[event.module_name].engagement++;
    return acc;
  }, {} as Record<string, { views: number; engagement: number }>);

  const topModules = Object.entries(moduleStats)
    .map(([module, stats]) => ({ module, ...stats }))
    .sort((a, b) => (b.views + b.engagement) - (a.views + a.engagement))
    .slice(0, 5);

  const errorEvents = events.filter(e => e.event_type === 'error');
  const errorRate = events.length > 0 ? (errorEvents.length / events.length) * 100 : 0;

  const aiInteractions = events.filter(e => e.event_type === 'ai_interaction').length;

  // Estimate realtime users (active in last 5 minutes)
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  const realtimeUsers = new Set(
    events
      .filter(e => Date.parse(e.timestamp) > fiveMinutesAgo)
      .map(e => e.user_id)
      .filter(Boolean)
  ).size;

  return {
    totalPageViews: pageViews.length,
    uniqueUsers,
    avgSessionDuration: avgSessionDuration / 1000 / 60, // Convert to minutes
    topModules,
    errorRate,
    aiInteractions,
    realtimeUsers
  };
}

// Helper function to process module-specific stats
function processModuleStats(moduleName: string, events: AnalyticsEvent[]): ModuleUsageStats {
  const moduleUsers = new Set(events.map(e => e.user_id).filter(Boolean));
  
  const usageTimes = events
    .filter(e => e.event_type === 'feature_usage' && e.properties?.duration_ms)
    .map(e => e.properties.duration_ms);
  
  const avgUsageTime = usageTimes.length > 0 
    ? usageTimes.reduce((sum, time) => sum + time, 0) / usageTimes.length / 1000 / 60 // Convert to minutes
    : 0;

  const successfulActions = events.filter(e => 
    e.event_type === 'feature_usage' && e.properties?.success === true
  ).length;
  
  const totalActions = events.filter(e => e.event_type === 'feature_usage').length;
  const completionRate = totalActions > 0 ? (successfulActions / totalActions) * 100 : 0;

  const errorCount = events.filter(e => e.event_type === 'error').length;

  // Popular features
  const featureUsage = events
    .filter(e => e.event_type === 'feature_usage')
    .reduce((acc, event) => {
      const feature = event.properties?.feature_name || 'unknown';
      acc[feature] = (acc[feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const popularFeatures = Object.entries(featureUsage)
    .map(([feature, usage]) => ({ feature, usage }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  // Calculate user satisfaction based on completion rate and error rate
  const userSatisfaction = Math.max(0, Math.min(100, 
    completionRate - (errorCount / Math.max(totalActions, 1)) * 10
  ));

  return {
    moduleName,
    totalUsers: moduleUsers.size,
    avgUsageTime,
    completionRate,
    errorCount,
    popularFeatures,
    userSatisfaction
  };
}

export default useAnalytics;