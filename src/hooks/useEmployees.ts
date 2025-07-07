import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  company_id: string;
  employee_number: string;
  national_id: string;
  iqama_number?: string;
  first_name: string;
  last_name: string;
  first_name_ar?: string;
  last_name_ar?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  is_saudi: boolean;
  hire_date?: string;
  department?: string;
  position?: string;
  position_ar?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  created_at: string;
  updated_at: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees((data || []) as Employee[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();

      if (error) throw error;
      setEmployees(prev => [data as Employee, ...prev]);
      return data as Employee;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add employee');
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setEmployees(prev => prev.map(emp => emp.id === id ? data as Employee : emp));
      return data as Employee;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update employee');
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete employee');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};