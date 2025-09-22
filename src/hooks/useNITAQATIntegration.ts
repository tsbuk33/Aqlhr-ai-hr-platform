import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NITAQATData {
  totalEmployees: number;
  saudiEmployees: number;
  saudizationRate: number;
  complianceScore: number;
  complianceLevel: 'GREEN' | 'YELLOW' | 'RED';
  minimumRequired: number;
}

export const useNITAQATIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NITAQATData | null>(null);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      
      // Check NITAQAT adapter status
      const { data: adapter, error: adapterError } = await supabase
        .from('gov_adapters')
        .select('*')
        .eq('system', 'nitaqat')
        .maybeSingle();

      if (adapterError && adapterError.code !== 'PGRST116') {
        throw adapterError;
      }

      if (!adapter) {
        // Create demo adapter if it doesn't exist
        const { error: insertError } = await supabase
          .from('gov_adapters')
          .insert({
            system: 'nitaqat',
            status: 'demo',
            config: {
              establishment_id: 'DEMO-NITAQAT-123',
              sector: 'FINANCIAL_SERVICES',
              company_size: 'LARGE'
            },
            tenant_id: 'demo-tenant'
          });

        if (insertError) {
          console.warn('Could not create demo adapter:', insertError);
        }
        
        setIsConnected(true);
        setLastSync(new Date().toISOString());
      } else {
        setIsConnected(adapter.status === 'active' || adapter.status === 'demo');
        setLastSync(adapter.last_sync);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const syncData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate NITAQAT sync - in production this would call NITAQAT API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update adapter last sync
      const { error: updateError } = await supabase
        .from('gov_adapters')
        .update({ 
          last_sync: new Date().toISOString(),
          last_error: null 
        })
        .eq('system', 'nitaqat');

      if (updateError) {
        console.warn('Could not update sync status:', updateError);
      }

      await checkConnection();
      await fetchDashboardData();
      
      return { success: true, timestamp: new Date().toISOString() };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        endpoint: 'https://nitaqat.mol.gov.sa/api/v2',
        responseTime: 145,
        status: 'Connected'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompliance = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate compliance calculation
      const mockData = {
        totalEmployees: 247,
        saudiEmployees: 187,
        saudizationRate: 75.7,
        minimumRequired: 65.0,
        complianceScore: 95.2,
        complianceLevel: 'GREEN' as const
      };

      return mockData;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Compliance calculation failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSaudizationStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate workforce analysis
      return {
        currentRate: 75.7,
        targetRate: 65.0,
        gap: 10.7,
        status: 'COMPLIANT',
        recommendations: [
          'Maintain current hiring practices',
          'Monitor quarterly compliance reports',
          'Consider Saudi talent development programs'
        ],
        riskLevel: 'LOW'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Status check failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate report generation
      return {
        reportId: 'NITAQAT-RPT-' + Date.now(),
        generatedAt: new Date().toISOString(),
        reportType: 'COMPLIANCE_SUMMARY',
        status: 'success',
        downloadUrl: '/reports/nitaqat-compliance-2024.pdf'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Report generation failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Simulate dashboard metrics for demo
      setData({
        totalEmployees: 247,
        saudiEmployees: 187,
        saudizationRate: 75.7,
        complianceScore: 95.2,
        complianceLevel: 'GREEN',
        minimumRequired: 65.0
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  useEffect(() => {
    checkConnection();
    fetchDashboardData();
  }, []);

  return {
    isConnected,
    lastSync,
    isLoading,
    error,
    data,
    syncData,
    testConnection,
    calculateCompliance,
    checkSaudizationStatus,
    generateReport,
    refetch: checkConnection
  };
};