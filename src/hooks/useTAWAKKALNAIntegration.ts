import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TAWAKKALNAHealthRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  national_id: string;
  health_status: 'green' | 'yellow' | 'red' | 'unknown';
  vaccination_status: 'fully_vaccinated' | 'partially_vaccinated' | 'not_vaccinated' | 'boosted' | 'exempt';
  vaccination_date?: string;
  vaccine_type?: string;
  booster_date?: string;
  last_test_date?: string;
  test_result: 'negative' | 'positive' | 'pending' | 'none';
  test_type?: string;
  clearance_expiry: string;
  qr_code: string;
  last_updated: string;
  immunity_status: 'immune' | 'at_risk' | 'unknown';
}

interface TAWAKKALNAVisitor {
  id: string;
  visitor_name: string;
  national_id: string;
  phone_number?: string;
  health_status: 'green' | 'yellow' | 'red';
  vaccination_status: 'fully_vaccinated' | 'partially_vaccinated' | 'not_vaccinated' | 'boosted' | 'exempt';
  visit_date: string;
  visit_time: string;
  visit_purpose: string;
  host_employee_id: string;
  host_employee_name: string;
  clearance_code: string;
  entry_approved: boolean;
  temperature_check?: number;
  screening_questions_passed: boolean;
  visit_duration_hours?: number;
  exit_time?: string;
}

interface TAWAKKALNACompliance {
  id: string;
  compliance_type: 'health_screening' | 'vaccination_proof' | 'test_results' | 'visitor_registration' | 'contact_tracing';
  company_id: string;
  status: 'compliant' | 'non_compliant' | 'pending' | 'expired' | 'warning';
  compliance_date: string;
  expiry_date: string;
  requirements_met: number;
  total_requirements: number;
  compliance_score: number;
  violations: string[];
  recommendations: string[];
  next_review_date: string;
}

interface TAWAKKALNANotification {
  id: string;
  notification_type: 'exposure_alert' | 'vaccination_reminder' | 'test_reminder' | 'clearance_expiry' | 'compliance_warning';
  recipient_id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sent_at: string;
  read_at?: string;
  action_required: boolean;
  action_url?: string;
}

interface TAWAKKALNAApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  tracking_id?: string;
  tawakkalna_reference?: string;
  qr_code?: string;
}

export const useTAWAKKALNAIntegration = () => {
  const [healthRecords, setHealthRecords] = useState<TAWAKKALNAHealthRecord[]>([]);
  const [visitors, setVisitors] = useState<TAWAKKALNAVisitor[]>([]);
  const [complianceRecords, setComplianceRecords] = useState<TAWAKKALNACompliance[]>([]);
  const [notifications, setNotifications] = useState<TAWAKKALNANotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const { toast } = useToast();

  // Initialize with dummy data for testing
  useEffect(() => {
    initializeDummyData();
  }, []);

  const initializeDummyData = () => {
    // Dummy health records data
    setHealthRecords([
      {
        id: '1',
        employee_id: 'emp_001',
        employee_name: 'Ahmed Mohammed Al-Ahmed',
        national_id: '1*********',
        health_status: 'green',
        vaccination_status: 'boosted' as const,
        vaccination_date: '2024-03-15',
        vaccine_type: 'Pfizer-BioNTech',
        booster_date: '2024-09-15',
        last_test_date: '2025-01-20',
        test_result: 'negative',
        test_type: 'PCR',
        clearance_expiry: '2025-01-27T23:59:59Z',
        qr_code: 'TAW_QR_001_2025',
        last_updated: '2025-01-20T09:30:00Z',
        immunity_status: 'immune'
      },
      {
        id: '2',
        employee_id: 'emp_002',
        employee_name: 'Fatima Ali Al-Saad',
        national_id: '2*********',
        health_status: 'green',
        vaccination_status: 'fully_vaccinated',
        vaccination_date: '2024-05-10',
        vaccine_type: 'AstraZeneca',
        last_test_date: '2025-01-19',
        test_result: 'negative',
        test_type: 'Antigen',
        clearance_expiry: '2025-01-26T23:59:59Z',
        qr_code: 'TAW_QR_002_2025',
        last_updated: '2025-01-19T14:15:00Z',
        immunity_status: 'immune'
      },
      {
        id: '3',
        employee_id: 'emp_003',
        employee_name: 'Mohammed Saad Al-Ghamdi',
        national_id: '3*********',
        health_status: 'yellow',
        vaccination_status: 'partially_vaccinated',
        vaccination_date: '2024-08-20',
        vaccine_type: 'Moderna',
        last_test_date: '2025-01-18',
        test_result: 'pending',
        test_type: 'PCR',
        clearance_expiry: '2025-01-23T23:59:59Z',
        qr_code: 'TAW_QR_003_2025',
        last_updated: '2025-01-18T11:30:00Z',
        immunity_status: 'at_risk'
      }
    ]);

    // Dummy visitors data
    setVisitors([
      {
        id: '1',
        visitor_name: 'Khalid Ahmed Al-Barrak',
        national_id: '1*********',
        phone_number: '+966501234567',
        health_status: 'green',
        vaccination_status: 'fully_vaccinated',
        visit_date: '2025-01-22',
        visit_time: '10:00',
        visit_purpose: 'Business Meeting',
        host_employee_id: 'emp_001',
        host_employee_name: 'Ahmed Mohammed Al-Ahmed',
        clearance_code: 'TAW-VIS-001-2025',
        entry_approved: true,
        temperature_check: 36.5,
        screening_questions_passed: true,
        visit_duration_hours: 2
      },
      {
        id: '2',
        visitor_name: 'Nora Saad Al-Mutairi',
        national_id: '2*********',
        phone_number: '+966507654321',
        health_status: 'green',
        vaccination_status: 'boosted' as const,
        visit_date: '2025-01-22',
        visit_time: '14:00',
        visit_purpose: 'Job Interview',
        host_employee_id: 'emp_002',
        host_employee_name: 'Fatima Ali Al-Saad',
        clearance_code: 'TAW-VIS-002-2025',
        entry_approved: true,
        temperature_check: 36.8,
        screening_questions_passed: true,
        visit_duration_hours: 1
      }
    ]);

    // Dummy compliance records
    setComplianceRecords([
      {
        id: '1',
        compliance_type: 'health_screening',
        company_id: 'demo-company',
        status: 'compliant',
        compliance_date: '2025-01-22T08:00:00Z',
        expiry_date: '2025-01-29T23:59:59Z',
        requirements_met: 5,
        total_requirements: 5,
        compliance_score: 100,
        violations: [],
        recommendations: ['Continue regular screening'],
        next_review_date: '2025-01-29'
      },
      {
        id: '2',
        compliance_type: 'vaccination_proof',
        company_id: 'demo-company',
        status: 'compliant',
        compliance_date: '2025-01-20T10:00:00Z',
        expiry_date: '2025-07-20T23:59:59Z',
        requirements_met: 3,
        total_requirements: 3,
        compliance_score: 96.8,
        violations: [],
        recommendations: ['Monitor booster schedules'],
        next_review_date: '2025-02-20'
      }
    ]);

    // Dummy notifications
    setNotifications([
      {
        id: '1',
        notification_type: 'clearance_expiry',
        recipient_id: 'emp_003',
        title: 'Health Clearance Expiring Soon',
        message: 'Your health clearance will expire in 2 days. Please renew your health status.',
        severity: 'medium',
        sent_at: '2025-01-21T09:00:00Z',
        action_required: true,
        action_url: '/health/renew-clearance'
      },
      {
        id: '2',
        notification_type: 'vaccination_reminder',
        recipient_id: 'emp_004',
        title: 'Booster Shot Due',
        message: 'You are eligible for a COVID-19 booster shot. Schedule your appointment.',
        severity: 'low',
        sent_at: '2025-01-20T14:00:00Z',
        action_required: true,
        action_url: '/vaccination/schedule'
      }
    ]);
  };

  const testConnection = async (): Promise<boolean> => {
    setLoading(true);
    setConnectionStatus('testing');

    try {
      // Simulate API call to TAWAKKALNA platform
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      const mockResponse: TAWAKKALNAApiResponse = {
        success: true,
        data: { 
          status: 'connected', 
          timestamp: new Date().toISOString(),
          tawakkalna_reference: 'TAW_CONN_' + Date.now(),
          api_version: '2.1'
        }
      };

      if (mockResponse.success) {
        setConnectionStatus('connected');
        toast({
          title: "Connection Successful",
          description: "Successfully connected to TAWAKKALNA platform",
        });
        return true;
      } else {
        throw new Error(mockResponse.error || 'Connection failed');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Failed",
        description: `Failed to connect to TAWAKKALNA: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const syncHealthData = async (): Promise<TAWAKKALNAApiResponse> => {
    setLoading(true);

    try {
      // Simulate API call to sync health data
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockHealthData: TAWAKKALNAHealthRecord[] = [
        {
          id: '4',
          employee_id: 'emp_004',
          employee_name: 'Sarah Abdullah Al-Rashid',
          national_id: '4*********',
          health_status: 'green',
          vaccination_status: 'fully_vaccinated',
          vaccination_date: '2024-06-01',
          vaccine_type: 'Johnson & Johnson',
          last_test_date: '2025-01-21',
          test_result: 'negative',
          test_type: 'Rapid Test',
          clearance_expiry: '2025-01-28T23:59:59Z',
          qr_code: 'TAW_QR_004_2025',
          last_updated: new Date().toISOString(),
          immunity_status: 'immune'
        }
      ];

      setHealthRecords(prev => [...prev, ...mockHealthData]);

      toast({
        title: "Health Data Synced",
        description: `Synchronized ${mockHealthData.length} health records from TAWAKKALNA`,
      });

      return {
        success: true,
        data: mockHealthData,
        tracking_id: 'SYNC_HEALTH_' + Date.now(),
        tawakkalna_reference: 'TAW_SYNC_' + Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health data sync failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const registerVisitor = async (visitorData: Partial<TAWAKKALNAVisitor>): Promise<TAWAKKALNAApiResponse> => {
    setLoading(true);

    try {
      // Simulate visitor registration process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newVisitor: TAWAKKALNAVisitor = {
        id: Date.now().toString(),
        visitor_name: visitorData.visitor_name || 'Unknown Visitor',
        national_id: visitorData.national_id || '',
        phone_number: visitorData.phone_number,
        health_status: visitorData.health_status || 'unknown' as any,
        vaccination_status: visitorData.vaccination_status || 'not_vaccinated',
        visit_date: visitorData.visit_date || new Date().toISOString().split('T')[0],
        visit_time: visitorData.visit_time || new Date().toTimeString().substring(0, 5),
        visit_purpose: visitorData.visit_purpose || 'General Visit',
        host_employee_id: visitorData.host_employee_id || '',
        host_employee_name: visitorData.host_employee_name || '',
        clearance_code: 'TAW-VIS-' + Date.now(),
        entry_approved: visitorData.health_status === 'green',
        screening_questions_passed: true,
        visit_duration_hours: visitorData.visit_duration_hours || 2
      };

      setVisitors(prev => [...prev, newVisitor]);

      toast({
        title: "Visitor Registered",
        description: `Visitor ${newVisitor.visitor_name} registered successfully`,
      });

      return {
        success: true,
        data: newVisitor,
        tracking_id: newVisitor.id,
        tawakkalna_reference: newVisitor.clearance_code,
        qr_code: `QR_${newVisitor.clearance_code}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Visitor registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (recordId: string): Promise<TAWAKKALNAApiResponse> => {
    setLoading(true);

    try {
      // Simulate QR code generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const qrCode = `TAW_QR_${recordId}_${Date.now()}`;
      
      // Update health record with new QR code
      setHealthRecords(prev => prev.map(record => 
        record.id === recordId ? { ...record, qr_code: qrCode, last_updated: new Date().toISOString() } : record
      ));

      toast({
        title: "QR Code Generated",
        description: `New QR code generated for health record`,
      });

      return {
        success: true,
        data: { qr_code: qrCode },
        qr_code: qrCode,
        tawakkalna_reference: 'TAW_QR_GEN_' + Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'QR code generation failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const checkHealthStatus = async (nationalId: string): Promise<TAWAKKALNAApiResponse> => {
    try {
      // Simulate health status check
      await new Promise(resolve => setTimeout(resolve, 1000));

      const healthRecord = healthRecords.find(record => record.national_id === nationalId);
      
      if (!healthRecord) {
        return {
          success: false,
          error: 'Health record not found'
        };
      }

      // Check if clearance is expired
      const isExpired = new Date(healthRecord.clearance_expiry) < new Date();
      const currentStatus = isExpired ? 'red' : healthRecord.health_status;

      return {
        success: true,
        data: {
          ...healthRecord,
          health_status: currentStatus,
          clearance_valid: !isExpired,
          checked_at: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health status check failed'
      };
    }
  };

  const updateVaccinationStatus = async (employeeId: string, vaccinationData: {
    vaccination_status: TAWAKKALNAHealthRecord['vaccination_status'];
    vaccination_date?: string;
    vaccine_type?: string;
    booster_date?: string;
  }): Promise<TAWAKKALNAApiResponse> => {
    setLoading(true);

    try {
      // Simulate vaccination status update
      await new Promise(resolve => setTimeout(resolve, 1500));

      setHealthRecords(prev => prev.map(record => 
        record.employee_id === employeeId ? {
          ...record,
          ...vaccinationData,
          last_updated: new Date().toISOString(),
          health_status: vaccinationData.vaccination_status === 'fully_vaccinated' || 
                        vaccinationData.vaccination_status === 'boosted' ? 'green' : 
                        vaccinationData.vaccination_status === 'partially_vaccinated' ? 'yellow' : 'red'
        } : record
      ));

      toast({
        title: "Vaccination Status Updated",
        description: `Vaccination status updated for employee ${employeeId}`,
      });

      return {
        success: true,
        data: vaccinationData,
        tracking_id: 'VAC_UPDATE_' + Date.now(),
        tawakkalna_reference: 'TAW_VAC_' + Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Vaccination status update failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const getComplianceReport = async (complianceType?: string): Promise<TAWAKKALNAApiResponse> => {
    try {
      // Simulate compliance report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const filteredCompliance = complianceType ? 
        complianceRecords.filter(record => record.compliance_type === complianceType) : 
        complianceRecords;

      const report = {
        total_records: filteredCompliance.length,
        compliant_records: filteredCompliance.filter(r => r.status === 'compliant').length,
        non_compliant_records: filteredCompliance.filter(r => r.status === 'non_compliant').length,
        pending_records: filteredCompliance.filter(r => r.status === 'pending').length,
        overall_compliance_rate: filteredCompliance.length > 0 ? 
          (filteredCompliance.filter(r => r.status === 'compliant').length / filteredCompliance.length) * 100 : 0,
        generated_at: new Date().toISOString(),
        compliance_records: filteredCompliance
      };

      return {
        success: true,
        data: report
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Compliance report generation failed'
      };
    }
  };

  return {
    // Data
    healthRecords,
    visitors,
    complianceRecords,
    notifications,
    loading,
    connectionStatus,

    // Actions
    testConnection,
    syncHealthData,
    registerVisitor,
    generateQRCode,
    checkHealthStatus,
    updateVaccinationStatus,
    getComplianceReport,

    // Utilities
    initializeDummyData
  };
};