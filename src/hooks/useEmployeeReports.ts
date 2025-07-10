import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EmployeeReport {
  id: string;
  company_id: string;
  report_name: string;
  report_description?: string;
  filters: Record<string, any>;
  report_data: {
    summary_statistics: {
      total_employees: number;
      active_employees: number;
      saudi_nationals: number;
      non_saudi_nationals: number;
      by_gender: {
        male: number;
        female: number;
        not_specified: number;
      };
      average_experience: number;
      salary_ranges: {
        min_salary: number;
        max_salary: number;
        avg_salary: number;
      };
      benefits_summary: {
        company_housing: number;
        company_transportation: number;
        company_sim_card: number;
        medical_insurance_parents: number;
      };
      department_breakdown: Record<string, number>;
      job_level_breakdown: Record<string, number>;
    };
    employee_details: any[];
    report_metadata: {
      generated_at: string;
      filter_criteria: Record<string, any>;
      total_records: number;
    };
  };
  generated_by: string;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

export const useEmployeeReports = () => {
  const [reports, setReports] = useState<EmployeeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data || []) as EmployeeReport[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (
    companyId?: string,
    filters: Record<string, any> = {},
    reportName = 'Comprehensive Employee Report'
  ) => {
    try {
      const { data, error } = await supabase.rpc('generate_comprehensive_employee_report', {
        _company_id: companyId,
        _filters: filters,
        _report_name: reportName
      });

      if (error) throw error;
      
      // Refresh reports list
      await fetchReports();
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to generate report');
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('employee_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      
      setReports(prev => prev.filter(report => report.id !== reportId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete report');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports,
    generateReport,
    deleteReport
  };
};