import { useState, useEffect } from 'react';
import { generateAnalyticsData, generateDummyKPIs } from '@/utils/dummyData';

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [kpis, setKPIs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setAnalyticsData(generateAnalyticsData());
      setKPIs(generateDummyKPIs());
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    analyticsData,
    kpis,
    loading,
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setAnalyticsData(generateAnalyticsData());
        setKPIs(generateDummyKPIs());
        setLoading(false);
      }, 500);
    }
  };
};