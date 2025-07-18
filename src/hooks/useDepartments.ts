import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDummyDepartments } from '@/utils/dummyData';

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

      // First try to get real data
      const { data, error } = await supabase
        .from('employees')
        .select('department')
        .not('department', 'is', null)
        .neq('department', '');

      if (error) throw error;

      let uniqueDepartments: string[] = [];

      if (data && data.length > 0) {
        // Process real data
        uniqueDepartments = [...new Set(
          data
            ?.map(item => item.department)
            .filter(dept => dept && dept.trim() !== '')
        )] as string[];

        // Sort departments alphabetically
        uniqueDepartments.sort();
      }

      // If no real data, use dummy data
      if (uniqueDepartments.length === 0) {
        const dummyDepartments = generateDummyDepartments();
        uniqueDepartments = dummyDepartments.map(dept => dept.name).sort();
      }

      setDepartments(uniqueDepartments);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch departments');
      
      // Fallback to dummy data
      const dummyDepartments = generateDummyDepartments();
      setDepartments(dummyDepartments.map(dept => dept.name).sort());
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