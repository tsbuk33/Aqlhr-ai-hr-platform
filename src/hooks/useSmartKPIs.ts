import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JobTitle {
  id: string;
  title: string;
  department: string;
  level: string;
  description?: string;
}

export interface SmartKPI {
  id: string;
  kpi_name: string;
  kpi_description: string;
  measurement_unit: string;
  target_value: number;
  frequency: string;
  weight_percentage: number;
  category: string;
  formula?: string;
  data_source?: string;
  is_active: boolean;
}

export interface JobTitleKPI {
  id: string;
  job_title_id: string;
  kpi_id: string;
  is_mandatory: boolean;
  custom_target?: number;
  weight_override?: number;
  job_title: JobTitle;
  smart_kpi: SmartKPI;
}

export interface EmployeeKPIAssignment {
  id: string;
  employee_id: string;
  job_title_kpi_id: string;
  target_value: number;
  current_value: number;
  achievement_percentage: number;
  status: string;
  review_period: string;
}

export const useSmartKPIs = (companyId?: string) => {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [smartKPIs, setSmartKPIs] = useState<SmartKPI[]>([]);
  const [jobTitleKPIs, setJobTitleKPIs] = useState<JobTitleKPI[]>([]);
  const [employeeAssignments, setEmployeeAssignments] = useState<EmployeeKPIAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobTitles = async () => {
    try {
      const { data, error } = await supabase
        .from('job_titles')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setJobTitles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job titles');
    }
  };

  const fetchSmartKPIs = async () => {
    try {
      const { data, error } = await supabase
        .from('smart_kpis')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('kpi_name');

      if (error) throw error;
      setSmartKPIs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch KPIs');
    }
  };

  const fetchJobTitleKPIs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_title_kpis')
        .select(`
          *,
          job_title:job_titles(*),
          smart_kpi:smart_kpis(*)
        `)
        .eq('job_titles.company_id', companyId)
        .eq('is_active', true);

      if (error) throw error;
      setJobTitleKPIs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job title KPIs');
    }
  };

  const fetchEmployeeAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_kpi_assignments')
        .select(`
          *,
          job_title_kpi:job_title_kpis(
            *,
            job_title:job_titles(*),
            smart_kpi:smart_kpis(*)
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      setEmployeeAssignments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee assignments');
    }
  };

  const createJobTitle = async (jobTitle: Omit<JobTitle, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('job_titles')
        .insert([{ ...jobTitle, company_id: companyId }])
        .select()
        .single();

      if (error) throw error;
      await fetchJobTitles();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create job title');
    }
  };

  const createSmartKPI = async (kpi: Omit<SmartKPI, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('smart_kpis')
        .insert([{ ...kpi, company_id: companyId }])
        .select()
        .single();

      if (error) throw error;
      await fetchSmartKPIs();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create KPI');
    }
  };

  const assignKPIToJobTitle = async (jobTitleId: string, kpiId: string, options?: { isMandatory?: boolean; customTarget?: number; weightOverride?: number }) => {
    try {
      const { data, error } = await supabase
        .from('job_title_kpis')
        .insert([{
          job_title_id: jobTitleId,
          kpi_id: kpiId,
          is_mandatory: options?.isMandatory || false,
          custom_target: options?.customTarget,
          weight_override: options?.weightOverride
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchJobTitleKPIs();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to assign KPI to job title');
    }
  };

  const assignKPIToEmployee = async (employeeId: string, jobTitleKpiId: string, targetValue: number) => {
    try {
      const { data, error } = await supabase
        .from('employee_kpi_assignments')
        .insert([{
          employee_id: employeeId,
          job_title_kpi_id: jobTitleKpiId,
          target_value: targetValue,
          current_value: 0,
          achievement_percentage: 0,
          status: 'active',
          review_period: new Date().getFullYear().toString()
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchEmployeeAssignments();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to assign KPI to employee');
    }
  };

  const updateKPIProgress = async (assignmentId: string, currentValue: number) => {
    try {
      const assignment = employeeAssignments.find(a => a.id === assignmentId);
      if (!assignment) throw new Error('Assignment not found');

      const achievementPercentage = (currentValue / assignment.target_value) * 100;

      const { data, error } = await supabase
        .from('employee_kpi_assignments')
        .update({
          current_value: currentValue,
          achievement_percentage: achievementPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;
      await fetchEmployeeAssignments();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update KPI progress');
    }
  };

  const getKPIStats = () => {
    const totalJobTitles = jobTitles.length;
    const totalKPIs = smartKPIs.length;
    const totalAssignments = employeeAssignments.length;
    const activeAssignments = employeeAssignments.filter(a => a.status === 'active').length;
    const avgAchievement = employeeAssignments.length > 0 
      ? employeeAssignments.reduce((sum, a) => sum + a.achievement_percentage, 0) / employeeAssignments.length
      : 0;

    return {
      totalJobTitles,
      totalKPIs,
      totalAssignments,
      activeAssignments,
      avgAchievement: Math.round(avgAchievement * 10) / 10
    };
  };

  useEffect(() => {
    if (companyId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          await Promise.all([
            fetchJobTitles(),
            fetchSmartKPIs(),
            fetchJobTitleKPIs(),
            fetchEmployeeAssignments()
          ]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [companyId]);

  return {
    jobTitles,
    smartKPIs,
    jobTitleKPIs,
    employeeAssignments,
    loading,
    error,
    refetch: {
      jobTitles: fetchJobTitles,
      smartKPIs: fetchSmartKPIs,
      jobTitleKPIs: fetchJobTitleKPIs,
      employeeAssignments: fetchEmployeeAssignments
    },
    actions: {
      createJobTitle,
      createSmartKPI,
      assignKPIToJobTitle,
      assignKPIToEmployee,
      updateKPIProgress
    },
    stats: getKPIStats()
  };
};