import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GOSIConfiguration {
  id: string;
  employee_id: string;
  hire_date: string;
  gosi_system_type: 'OLD' | 'NEW';
  nationality: 'SAUDI' | 'NON_SAUDI';
  current_employee_rate: number;
  current_employer_rate: number;
  effective_from: string;
}

export interface GOSICalculation {
  employee_id: string;
  salary: number;
  system_type: string;
  rates: {
    employee_rate: number;
    employer_rate: number;
  };
  contributions: {
    employee: number;
    employer: number;
    total: number;
  };
}

export interface GOSIRateHistory {
  id: string;
  system_type: 'OLD' | 'NEW';
  nationality: 'SAUDI' | 'NON_SAUDI';
  employee_rate: number;
  employer_rate: number;
  effective_from: string;
  effective_to?: string;
}

export const useGOSI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateGOSIContribution = async (
    employeeId: string,
    salary: number,
    asOfDate?: string
  ): Promise<GOSICalculation | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('gosi-engine/calculate', {
        body: {
          employee_id: employeeId,
          salary,
          as_of_date: asOfDate
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate GOSI contribution';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeClassification = async (employeeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('gosi-engine/employee-classification', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) throw error;
      return data.employee;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get employee classification';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getGOSIPreview = async (companyId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('gosi-engine/preview', {
        body: { company_id: companyId }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get GOSI preview';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const runRateProgression = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('gosi-engine/rate-progression-job');

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to run rate progression';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployeeGOSIConfig = async (
    employeeId: string,
    config: Partial<GOSIConfiguration>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('employee_gosi_config')
        .update(config)
        .eq('employee_id', employeeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update GOSI configuration';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getGOSIRateHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('gosi_rate_history')
        .select('*')
        .order('effective_from', { ascending: false });

      if (error) throw error;
      return data as GOSIRateHistory[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get GOSI rate history';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const classifyEmployee = async (employeeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.rpc('auto_classify_employee_gosi', {
        p_employee_id: employeeId
      });

      if (error) throw error;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to classify employee';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if an employee should be on NEW system
  const shouldUseNewSystem = (hireDate: string): boolean => {
    return new Date(hireDate) >= new Date('2025-07-01');
  };

  // Helper function to get applicable GOSI rates for a given date and employee type
  const getApplicableRates = (
    systemType: 'OLD' | 'NEW',
    nationality: 'SAUDI' | 'NON_SAUDI',
    asOfDate: string = new Date().toISOString().split('T')[0]
  ) => {
    // This would typically query the database, but for demo purposes:
    if (systemType === 'OLD') {
      return nationality === 'SAUDI' 
        ? { employee: 9.0, employer: 9.0 }
        : { employee: 0.0, employer: 2.0 };
    }

    // NEW system progressive rates
    if (nationality === 'NON_SAUDI') {
      return { employee: 0.0, employer: 2.0 };
    }

    // NEW system Saudi progressive rates
    const date = new Date(asOfDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    // If before July, use previous year's rate
    const effectiveYear = month < 6 ? year : year;

    if (effectiveYear < 2026) return { employee: 9.0, employer: 9.0 };
    if (effectiveYear < 2027) return { employee: 9.5, employer: 9.5 };
    if (effectiveYear < 2028) return { employee: 10.0, employer: 10.0 };
    if (effectiveYear < 2029) return { employee: 10.5, employer: 10.5 };
    return { employee: 11.0, employer: 11.0 };
  };

  return {
    loading,
    error,
    calculateGOSIContribution,
    getEmployeeClassification,
    getGOSIPreview,
    runRateProgression,
    updateEmployeeGOSIConfig,
    getGOSIRateHistory,
    classifyEmployee,
    shouldUseNewSystem,
    getApplicableRates
  };
};