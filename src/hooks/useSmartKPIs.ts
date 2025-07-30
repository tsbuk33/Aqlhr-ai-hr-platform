import { useState, useEffect } from 'react';

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

// Demo data for Smart KPI system
const demoJobTitles: JobTitle[] = [
  { id: '1', title: 'Software Engineer', department: 'Engineering', level: 'Senior', description: 'Senior software developer' },
  { id: '2', title: 'Product Manager', department: 'Product', level: 'Manager', description: 'Product strategy and management' },
  { id: '3', title: 'Sales Representative', department: 'Sales', level: 'Junior', description: 'Customer acquisition specialist' },
  { id: '4', title: 'HR Specialist', department: 'Human Resources', level: 'Mid', description: 'HR operations and compliance' },
  { id: '5', title: 'Finance Analyst', department: 'Finance', level: 'Senior', description: 'Financial analysis and reporting' }
];

const demoSmartKPIs: SmartKPI[] = [
  { id: '1', kpi_name: 'Code Quality Score', kpi_description: 'Code review quality rating', measurement_unit: 'Score (1-10)', target_value: 8.5, frequency: 'Monthly', weight_percentage: 25, category: 'Technical', is_active: true },
  { id: '2', kpi_name: 'Customer Satisfaction', kpi_description: 'Customer satisfaction rating', measurement_unit: 'Score (1-5)', target_value: 4.2, frequency: 'Quarterly', weight_percentage: 30, category: 'Customer', is_active: true },
  { id: '3', kpi_name: 'Sales Target Achievement', kpi_description: 'Monthly sales target completion', measurement_unit: 'Percentage', target_value: 100, frequency: 'Monthly', weight_percentage: 40, category: 'Revenue', is_active: true },
  { id: '4', kpi_name: 'Employee Engagement', kpi_description: 'Team engagement score', measurement_unit: 'Score (1-10)', target_value: 8.0, frequency: 'Quarterly', weight_percentage: 20, category: 'People', is_active: true },
  { id: '5', kpi_name: 'Process Efficiency', kpi_description: 'Process improvement metrics', measurement_unit: 'Percentage', target_value: 95, frequency: 'Monthly', weight_percentage: 15, category: 'Operations', is_active: true }
];

const demoEmployeeAssignments: EmployeeKPIAssignment[] = [
  { id: '1', employee_id: 'emp1', job_title_kpi_id: '1', target_value: 8.5, current_value: 8.2, achievement_percentage: 96.5, status: 'active', review_period: '2024' },
  { id: '2', employee_id: 'emp2', job_title_kpi_id: '2', target_value: 4.2, current_value: 4.4, achievement_percentage: 104.8, status: 'active', review_period: '2024' },
  { id: '3', employee_id: 'emp3', job_title_kpi_id: '3', target_value: 100, current_value: 87, achievement_percentage: 87.0, status: 'active', review_period: '2024' },
  { id: '4', employee_id: 'emp4', job_title_kpi_id: '4', target_value: 8.0, current_value: 8.3, achievement_percentage: 103.8, status: 'active', review_period: '2024' },
  { id: '5', employee_id: 'emp5', job_title_kpi_id: '5', target_value: 95, current_value: 92, achievement_percentage: 96.8, status: 'active', review_period: '2024' }
];

export const useSmartKPIs = (companyId?: string) => {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [smartKPIs, setSmartKPIs] = useState<SmartKPI[]>([]);
  const [jobTitleKPIs, setJobTitleKPIs] = useState<JobTitleKPI[]>([]);
  const [employeeAssignments, setEmployeeAssignments] = useState<EmployeeKPIAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Simulate loading with demo data
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setJobTitles(demoJobTitles);
      setSmartKPIs(demoSmartKPIs);
      setEmployeeAssignments(demoEmployeeAssignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
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
    fetchData();
  }, [companyId]);

  return {
    jobTitles,
    smartKPIs,
    jobTitleKPIs,
    employeeAssignments,
    loading,
    error,
    refetch: {
      jobTitles: fetchData,
      smartKPIs: fetchData,
      jobTitleKPIs: fetchData,
      employeeAssignments: fetchData
    },
    actions: {
      createJobTitle: async () => ({ id: 'new' }),
      createSmartKPI: async () => ({ id: 'new' }),
      assignKPIToJobTitle: async () => ({ id: 'new' }),
      assignKPIToEmployee: async () => ({ id: 'new' }),
      updateKPIProgress: async () => ({ id: 'updated' })
    },
    stats: getKPIStats()
  };
};