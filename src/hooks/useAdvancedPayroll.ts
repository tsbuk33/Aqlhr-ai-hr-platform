import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PayrollRun {
  id: string;
  company_id: string;
  run_name: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  is_ramadan_period: boolean;
  total_employees: number;
  total_gross_pay: number;
  total_deductions: number;
  total_net_pay: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid' | 'submitted_to_wps';
  created_at: string;
}

export interface PayrollItem {
  id: string;
  employee_id: string;
  basic_salary: number;
  total_allowances: number;
  overtime_amount: number;
  overtime_hours: number;
  gross_pay: number;
  gosi_employee: number;
  gosi_employer: number;
  loan_deductions: number;
  other_deductions: number;
  total_deductions: number;
  net_pay: number;
  working_days: number;
  working_hours: number;
  ramadan_adjustment: number;
  calculation_details: any;
}

export interface AllowanceDefinition {
  id: string;
  company_id: string;
  allowance_code: string;
  allowance_name_en: string;
  allowance_name_ar: string;
  calculation_type: 'fixed' | 'percentage' | 'formula' | 'conditional';
  calculation_formula: any;
  is_taxable: boolean;
  affects_eos: boolean;
  affects_gosi: boolean;
  is_active: boolean;
  created_at: string;
}

export interface EmployeeLoan {
  id: string;
  employee_id: string;
  loan_type: 'salary_advance' | 'personal_loan' | 'emergency_loan';
  loan_amount: number;
  remaining_amount: number;
  monthly_deduction: number;
  installments_total: number;
  installments_paid: number;
  status: 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
}

export interface LeaveBalance {
  id: string;
  employee_id: string;
  leave_type_id: string;
  year: number;
  total_entitlement: number;
  used_days: number;
  remaining_days: number;
  carried_forward: number;
}

export const useAdvancedPayroll = () => {
  const queryClient = useQueryClient();

  // Fetch payroll runs
  const {
    data: payrollRuns,
    isLoading: payrollRunsLoading,
    error: payrollRunsError
  } = useQuery({
    queryKey: ['advanced-payroll-runs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advanced_payroll_runs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PayrollRun[];
    }
  });

  // Fetch allowance definitions
  const {
    data: allowanceDefinitions,
    isLoading: allowancesLoading
  } = useQuery({
    queryKey: ['allowance-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allowance_definitions')
        .select('*')
        .eq('is_active', true)
        .order('allowance_name_en');
      
      if (error) throw error;
      return data as AllowanceDefinition[];
    }
  });

  // Calculate payroll mutation
  const calculatePayrollMutation = useMutation({
    mutationFn: async (payrollData: {
      company_id: string;
      pay_period_start: string;
      pay_period_end: string;
      pay_date: string;
      is_ramadan_period?: boolean;
      employee_ids?: string[];
    }) => {
      const { data, error } = await supabase.functions.invoke('advanced-payroll-engine/calculate-payroll', {
        body: payrollData
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advanced-payroll-runs'] });
      toast.success('Payroll calculated successfully');
    },
    onError: (error: any) => {
      toast.error(`Payroll calculation failed: ${error.message}`);
    }
  });

  // Calculate overtime mutation
  const calculateOvertimeMutation = useMutation({
    mutationFn: async (data: {
      employee_id: string;
      start_date: string;
      end_date: string;
    }) => {
      const { data: result, error } = await supabase.functions.invoke('advanced-payroll-engine/calculate-overtime', {
        body: data
      });
      
      if (error) throw error;
      return result;
    }
  });

  // Calculate leaves mutation
  const calculateLeavesMutation = useMutation({
    mutationFn: async (data: {
      employee_id: string;
      year?: number;
    }) => {
      const { data: result, error } = await supabase.functions.invoke('advanced-payroll-engine/calculate-leaves', {
        body: data
      });
      
      if (error) throw error;
      return result;
    }
  });

  // Calculate end of service mutation
  const calculateEOSMutation = useMutation({
    mutationFn: async (data: {
      employee_id: string;
      calculation_date: string;
      reason: 'resignation' | 'termination' | 'retirement' | 'death';
    }) => {
      const { data: result, error } = await supabase.functions.invoke('advanced-payroll-engine/calculate-eos', {
        body: data
      });
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast.success('End of service calculated successfully');
    }
  });

  // Sync with GOSI mutation
  const syncGOSIMutation = useMutation({
    mutationFn: async (data: {
      company_id: string;
      sync_type: 'employee_data' | 'salary_data' | 'contribution_data';
    }) => {
      const { data: result, error } = await supabase.functions.invoke('advanced-payroll-engine/sync-gosi', {
        body: data
      });
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast.success('GOSI sync completed successfully');
    }
  });

  // Generate WPS file mutation
  const generateWPSMutation = useMutation({
    mutationFn: async (payrollRunId: string) => {
      const { data, error } = await supabase.functions.invoke('advanced-payroll-engine/generate-wps-file', {
        body: { payroll_run_id: payrollRunId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('WPS file generated successfully');
    }
  });

  // Ramadan adjustments mutation
  const calculateRamadanMutation = useMutation({
    mutationFn: async (data: {
      company_id: string;
      ramadan_start_date: string;
      ramadan_end_date: string;
    }) => {
      const { data: result, error } = await supabase.functions.invoke('advanced-payroll-engine/ramadan-adjustments', {
        body: data
      });
      
      if (error) throw error;
      return result;
    }
  });

  // CRUD operations for allowances
  const createAllowanceMutation = useMutation({
    mutationFn: async (allowance: Omit<AllowanceDefinition, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('allowance_definitions')
        .insert(allowance)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowance-definitions'] });
      toast.success('Allowance created successfully');
    }
  });

  const updateAllowanceMutation = useMutation({
    mutationFn: async ({ id, ...allowance }: Partial<AllowanceDefinition> & { id: string }) => {
      const { data, error } = await supabase
        .from('allowance_definitions')
        .update(allowance)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowance-definitions'] });
      toast.success('Allowance updated successfully');
    }
  });

  // CRUD operations for employee loans
  const createLoanMutation = useMutation({
    mutationFn: async (loan: Omit<EmployeeLoan, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('employee_loans')
        .insert(loan)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Employee loan created successfully');
    }
  });

  const updateLoanMutation = useMutation({
    mutationFn: async ({ id, ...loan }: Partial<EmployeeLoan> & { id: string }) => {
      const { data, error } = await supabase
        .from('employee_loans')
        .update(loan)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Employee loan updated successfully');
    }
  });

  // Get payroll items for a specific run
  const getPayrollItems = async (payrollRunId: string): Promise<PayrollItem[]> => {
    const { data, error } = await supabase
      .from('advanced_payroll_items')
      .select(`
        *,
        employees (
          employee_number,
          first_name,
          last_name
        )
      `)
      .eq('payroll_run_id', payrollRunId);
    
    if (error) throw error;
    return data as PayrollItem[];
  };

  // Get employee loans
  const getEmployeeLoans = async (employeeId?: string): Promise<EmployeeLoan[]> => {
    let query = supabase
      .from('employee_loans')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as EmployeeLoan[];
  };

  // Get leave balances
  const getLeaveBalances = async (employeeId: string, year?: number): Promise<LeaveBalance[]> => {
    let query = supabase
      .from('employee_leave_balances')
      .select(`
        *,
        leave_types (
          leave_name_en,
          leave_name_ar
        )
      `)
      .eq('employee_id', employeeId);
    
    if (year) {
      query = query.eq('year', year);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as LeaveBalance[];
  };

  return {
    // Data
    payrollRuns,
    allowanceDefinitions,
    
    // Loading states
    payrollRunsLoading,
    allowancesLoading,
    
    // Errors
    payrollRunsError,
    
    // Mutations
    calculatePayroll: calculatePayrollMutation.mutate,
    calculateOvertime: calculateOvertimeMutation.mutate,
    calculateLeaves: calculateLeavesMutation.mutate,
    calculateEOS: calculateEOSMutation.mutate,
    syncGOSI: syncGOSIMutation.mutate,
    generateWPS: generateWPSMutation.mutate,
    calculateRamadan: calculateRamadanMutation.mutate,
    createAllowance: createAllowanceMutation.mutate,
    updateAllowance: updateAllowanceMutation.mutate,
    createLoan: createLoanMutation.mutate,
    updateLoan: updateLoanMutation.mutate,
    
    // Loading states for mutations
    isCalculatingPayroll: calculatePayrollMutation.isPending,
    isCalculatingEOS: calculateEOSMutation.isPending,
    isSyncingGOSI: syncGOSIMutation.isPending,
    isGeneratingWPS: generateWPSMutation.isPending,
    
    // Helper functions
    getPayrollItems,
    getEmployeeLoans,
    getLeaveBalances
  };
};