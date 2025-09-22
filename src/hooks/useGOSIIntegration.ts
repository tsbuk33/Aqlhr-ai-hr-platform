import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GOSIIntegrationData {
  registeredEmployees: number;
  monthlyContributions: number;
  complianceRate: number;
  pendingActions: number;
}

export const useGOSIIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GOSIIntegrationData | null>(null);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      
      // Check GOSI adapter status
      const { data: adapter, error: adapterError } = await supabase
        .from('gov_adapters')
        .select('*')
        .eq('system', 'gosi')
        .single();

      if (adapterError) {
        throw new Error('GOSI adapter not configured');
      }

      setIsConnected(adapter.status === 'active' || adapter.status === 'demo');
      setLastSync(adapter.last_sync);
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

      // Call GOSI sync function
      const { data: result, error: syncError } = await supabase.functions.invoke('gosi_contrib_sync_v1', {
        body: { 
          tenantId: 'demo-tenant',
          testMode: true 
        }
      });

      if (syncError) {
        throw syncError;
      }

      // Update local state
      await checkConnection();
      
      return result;
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

      // Test GOSI API connection
      const { data: result, error: testError } = await supabase.functions.invoke('gosi_contrib_sync_v1', {
        body: { 
          tenantId: 'demo-tenant',
          testMode: true,
          connectionTest: true
        }
      });

      if (testError) {
        throw testError;
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateContributions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate GOSI contribution calculation for demo
      return {
        totalEmployees: 247,
        totalContributions: 158750,
        calculatedAt: new Date().toISOString()
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Calculation failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeStatus = async (employeeId?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get employee GOSI status
      const query = supabase
        .from('employee_gosi_config')
        .select('*');

      if (employeeId) {
        query.eq('employee_id', employeeId);
      } else {
        query.limit(10);
      }

      const { data: configs, error: configError } = await query;

      if (configError) {
        throw configError;
      }

      return configs || [];
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

      // Generate GOSI compliance report - simplified implementation
      return {
        reportId: 'GOSI-RPT-' + Date.now(),
        generatedAt: new Date().toISOString(),
        status: 'success'
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
        registeredEmployees: 247,
        monthlyContributions: 158750,
        complianceRate: 98.7,
        pendingActions: 3
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
    calculateContributions,
    getEmployeeStatus,
    generateReport,
    refetch: checkConnection
  };
};