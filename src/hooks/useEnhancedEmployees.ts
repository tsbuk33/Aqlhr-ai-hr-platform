import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/hooks/useEmployees';

export const useEnhancedEmployees = () => {
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

  const addEmployeeWithSync = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Prepare comprehensive employee data including additional_attributes
      const { additional_attributes, ...standardFields } = employeeData as any;
      
      const employeeToInsert = {
        ...standardFields,
        additional_attributes: additional_attributes || {},
        company_id: employeeData.company_id || null
      };

      const { data, error } = await supabase
        .from('employees')
        .insert([employeeToInsert])
        .select()
        .single();

      if (error) throw error;

      // The trigger will automatically create AI sync events
      setEmployees(prev => [data as Employee, ...prev]);
      return data as Employee;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add employee');
    }
  };

  const updateEmployeeWithSync = async (id: string, updates: Partial<Employee>) => {
    try {
      // Separate additional_attributes from standard fields
      const { additional_attributes, ...standardUpdates } = updates as any;
      
      const updateData = {
        ...standardUpdates,
        ...(additional_attributes && { additional_attributes })
      };

      const { data, error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // The trigger will automatically create AI sync events
      setEmployees(prev => prev.map(emp => emp.id === id ? data as Employee : emp));
      return data as Employee;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update employee');
    }
  };

  const deleteEmployeeWithSync = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // The trigger will automatically create AI sync events
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete employee');
    }
  };

  // Get comprehensive employee data including all fields
  const getEmployeeComplete = async (id: string): Promise<Employee | null> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Employee;
    } catch (err) {
      console.error('Failed to fetch complete employee data:', err);
      return null;
    }
  };

  // Batch operation for multiple employees
  const batchUpdateEmployees = async (updates: Array<{ id: string; data: Partial<Employee> }>) => {
    try {
      const promises = updates.map(({ id, data }) => updateEmployeeWithSync(id, data));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return { successful, failed };
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to batch update employees');
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
    addEmployee: addEmployeeWithSync,
    updateEmployee: updateEmployeeWithSync,
    deleteEmployee: deleteEmployeeWithSync,
    getEmployeeComplete,
    batchUpdateEmployees
  };
};