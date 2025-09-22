import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TVTCData {
  activePrograms: number;
  enrolledEmployees: number;
  certificationsEarned: number;
  completionRate: number;
  popularPrograms: Array<{
    name: string;
    enrolled: number;
    completionRate: number;
  }>;
}

export const useTVTCIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TVTCData | null>(null);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      
      // Check TVTC adapter status
      const { data: adapter, error: adapterError } = await supabase
        .from('gov_adapters')
        .select('*')
        .eq('system', 'tvtc')
        .maybeSingle();

      if (adapterError && adapterError.code !== 'PGRST116') {
        throw adapterError;
      }

      if (!adapter) {
        // Create demo adapter if it doesn't exist
        const { error: insertError } = await supabase
          .from('gov_adapters')
          .insert({
            system: 'tvtc',
            status: 'demo',
            config: {
              institution_id: 'DEMO-TVTC-456',
              region: 'RIYADH',
              authorized_programs: ['digital_skills', 'leadership', 'technical_cert']
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

      // Simulate TVTC sync - in production this would call TVTC API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update adapter last sync
      const { error: updateError } = await supabase
        .from('gov_adapters')
        .update({ 
          last_sync: new Date().toISOString(),
          last_error: null 
        })
        .eq('system', 'tvtc');

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
        endpoint: 'https://api.tvtc.gov.sa/v3',
        responseTime: 120,
        status: 'Connected',
        services: ['enrollment', 'certification', 'assessment', 'tracking']
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrainingPrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate getting training programs
      return [
        {
          id: 'TVTC-PROG-001',
          name: 'Digital Skills Development',
          category: 'TECHNOLOGY',
          duration: '8 weeks',
          level: 'INTERMEDIATE',
          capacity: 30,
          enrolled: 25,
          startDate: '2024-02-15',
          status: 'ACTIVE'
        },
        {
          id: 'TVTC-PROG-002',
          name: 'Leadership & Management',
          category: 'MANAGEMENT',
          duration: '12 weeks',
          level: 'ADVANCED',
          capacity: 25,
          enrolled: 18,
          startDate: '2024-02-01',
          status: 'ACTIVE'
        },
        {
          id: 'TVTC-PROG-003',
          name: 'Technical Certifications',
          category: 'TECHNICAL',
          duration: '16 weeks',
          level: 'PROFESSIONAL',
          capacity: 40,
          enrolled: 32,
          startDate: '2024-01-15',
          status: 'ACTIVE'
        }
      ];
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch training programs';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getCertifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate getting certifications
      return [
        {
          id: 'CERT-001',
          employeeName: 'Ahmed Al-Rashid',
          certificationType: 'Project Management',
          issueDate: '2024-01-20',
          expiryDate: '2027-01-20',
          certificateNumber: 'TVTC-PM-2024-001',
          status: 'ACTIVE'
        },
        {
          id: 'CERT-002',
          employeeName: 'Sara Al-Zahrani',
          certificationType: 'Digital Marketing',
          issueDate: '2024-01-15',
          expiryDate: '2026-01-15',
          certificateNumber: 'TVTC-DM-2024-002',
          status: 'ACTIVE'
        }
      ];
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch certifications';
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
        reportId: 'TVTC-RPT-' + Date.now(),
        generatedAt: new Date().toISOString(),
        reportType: 'TRAINING_SUMMARY',
        status: 'success',
        data: {
          totalPrograms: 15,
          totalEnrollments: 89,
          completionRate: 87.3,
          certificationsIssued: 142
        }
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
        activePrograms: 15,
        enrolledEmployees: 89,
        certificationsEarned: 142,
        completionRate: 87.3,
        popularPrograms: [
          { name: 'Digital Skills Development', enrolled: 25, completionRate: 65 },
          { name: 'Leadership & Management', enrolled: 18, completionRate: 78 },
          { name: 'Technical Certifications', enrolled: 32, completionRate: 82 }
        ]
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
    getTrainingPrograms,
    getCertifications,
    generateReport,
    refetch: checkConnection
  };
};