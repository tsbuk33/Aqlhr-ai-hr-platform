import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyStats {
  totalEmployees: number;
  activeEmployees: number;
  saudiEmployees: number;
  saudizationRate: number;
  avgSalary: number;
  totalPayrollThisMonth: number;
  pendingLeaveRequests: number;
  complianceScore: number;
  recentHires: number;
  departments: Array<{
    name: string;
    count: number;
  }>;
}

export const useCompanyStats = () => {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch employee statistics
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('*');
      
      if (empError) throw empError;

      // Fetch payroll data for current month
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const { data: payroll, error: payrollError } = await supabase
        .from('payroll')
        .select('net_salary')
        .eq('month', currentMonth)
        .eq('year', currentYear);

      if (payrollError) throw payrollError;

      // Fetch pending leave requests
      const { data: leaveRequests, error: leaveError } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('status', 'pending');

      if (leaveError) throw leaveError;

      // Calculate statistics
      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(emp => emp.status === 'active').length || 0;
      const saudiEmployees = employees?.filter(emp => emp.is_saudi).length || 0;
      const saudizationRate = totalEmployees > 0 ? (saudiEmployees / totalEmployees) * 100 : 0;
      
      const salaries = employees?.filter(emp => emp.salary).map(emp => emp.salary) || [];
      const avgSalary = salaries.length > 0 ? salaries.reduce((sum, salary) => sum + (salary || 0), 0) / salaries.length : 0;
      
      const totalPayrollThisMonth = payroll?.reduce((sum, pay) => sum + (pay.net_salary || 0), 0) || 0;
      const pendingLeaveRequests = leaveRequests?.length || 0;
      
      // Calculate recent hires (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentHires = employees?.filter(emp => 
        emp.hire_date && new Date(emp.hire_date) >= thirtyDaysAgo
      ).length || 0;

      // Department statistics
      const departmentCounts = employees?.reduce((acc, emp) => {
        if (emp.department) {
          acc[emp.department] = (acc[emp.department] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const departments = Object.entries(departmentCounts).map(([name, count]) => ({
        name,
        count
      }));

      // Mock compliance score (would be calculated from various compliance metrics)
      const complianceScore = 96.8;

      setStats({
        totalEmployees,
        activeEmployees,
        saudiEmployees,
        saudizationRate,
        avgSalary,
        totalPayrollThisMonth,
        pendingLeaveRequests,
        complianceScore,
        recentHires,
        departments
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};