import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MOLComplianceData {
  overall_score: number;
  contracts_submitted: number;
  contracts_approved: number;
  contracts_pending: number;
  contracts_rejected: number;
  violations: number;
  violation_details: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    due_date: string;
  }>;
  total_employees: number;
  saudi_employees: number;
  saudization_rate: number;
  last_audit_date: string;
  next_audit_date: string;
}

export const useMOLIntegration = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  const [complianceData, setComplianceData] = useState<MOLComplianceData | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Simulate MOL API connection
  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setConnectionStatus('connected');
      toast({
        title: "Connection Successful",
        description: "Successfully connected to MOL API services",
      });
      
      // Load initial data
      await loadComplianceData();
    } catch (error) {
      setConnectionStatus('disconnected');
      setError('Failed to connect to MOL services');
      toast({
        title: "Connection Failed",
        description: "Unable to connect to MOL API services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadComplianceData = async () => {
    try {
      // Simulate MOL compliance data
      const mockData: MOLComplianceData = {
        overall_score: 92,
        contracts_submitted: 156,
        contracts_approved: 142,
        contracts_pending: 8,
        contracts_rejected: 6,
        violations: 2,
        violation_details: [
          {
            type: 'Work Hours Violation',
            description: 'Exceeded maximum weekly working hours for employee ID: EMP001',
            severity: 'medium',
            due_date: '2024-02-15'
          },
          {
            type: 'Contract Amendment Required',
            description: 'Employee contract terms need update for new labor regulations',
            severity: 'low',
            due_date: '2024-02-28'
          }
        ],
        total_employees: 156,
        saudi_employees: 94,
        saudization_rate: 60.3,
        last_audit_date: '2023-12-15',
        next_audit_date: '2024-06-15'
      };

      setComplianceData(mockData);
      setLastSync(new Date().toISOString());
    } catch (error) {
      setError('Failed to load compliance data');
      toast({
        title: "Data Load Failed",
        description: "Unable to load MOL compliance data",
        variant: "destructive",
      });
    }
  };

  const syncData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await loadComplianceData();
      
      toast({
        title: "Sync Complete",
        description: "Successfully synchronized with MOL database",
      });
    } catch (error) {
      setError('Failed to sync data with MOL');
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize with MOL services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitCompliance = async (type: 'contracts' | 'reports' | 'violations') => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Submission Successful",
        description: `${type} successfully submitted to MOL`,
      });

      // Refresh data after submission
      await loadComplianceData();
    } catch (error) {
      setError(`Failed to submit ${type} to MOL`);
      toast({
        title: "Submission Failed",
        description: `Unable to submit ${type} to MOL`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (type: 'monthly' | 'quarterly' | 'annual' | 'saudization') => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      toast({
        title: "Report Generated",
        description: `${type} report generated and submitted to MOL`,
      });
    } catch (error) {
      setError(`Failed to generate ${type} report`);
      toast({
        title: "Report Generation Failed",
        description: `Unable to generate ${type} report`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const savedStatus = localStorage.getItem('mol_connection_status');
    if (savedStatus === 'connected') {
      testConnection();
    }
  }, []);

  // Save connection status
  useEffect(() => {
    localStorage.setItem('mol_connection_status', connectionStatus);
  }, [connectionStatus]);

  return {
    connectionStatus,
    complianceData,
    lastSync,
    isLoading,
    error,
    testConnection,
    syncData,
    submitCompliance,
    generateReport,
    loadComplianceData
  };
};