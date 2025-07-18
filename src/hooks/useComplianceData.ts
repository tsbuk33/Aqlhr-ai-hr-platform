import { useState, useEffect } from 'react';
import { generateComplianceData } from '@/utils/dummyData';

export const useComplianceData = () => {
  const [complianceData, setComplianceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setComplianceData(generateComplianceData());
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return {
    complianceData,
    loading,
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setComplianceData(generateComplianceData());
        setLoading(false);
      }, 600);
    }
  };
};