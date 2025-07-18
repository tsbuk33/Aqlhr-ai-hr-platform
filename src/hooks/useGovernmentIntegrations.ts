import { useState, useEffect } from 'react';
import { generateGovernmentIntegrations } from '@/utils/dummyData';

export const useGovernmentIntegrations = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIntegrations(generateGovernmentIntegrations());
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return {
    integrations,
    loading,
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setIntegrations(generateGovernmentIntegrations());
        setLoading(false);
      }, 300);
    }
  };
};