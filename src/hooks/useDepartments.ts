import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Department {
  department: string;
}

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('employees')
        .select('department')
        .not('department', 'is', null)
        .neq('department', '');

      if (error) throw error;

      // Get unique departments and filter out null/empty values
      const uniqueDepartments = [...new Set(
        data
          ?.map(item => item.department)
          .filter(dept => dept && dept.trim() !== '')
      )] as string[];

      // Sort departments alphabetically
      uniqueDepartments.sort();

      setDepartments(uniqueDepartments);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments
  };
};