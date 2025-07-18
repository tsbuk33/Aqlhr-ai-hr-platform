import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Position {
  position: string;
  position_ar?: string;
  actual_job_title?: string;
  actual_job_title_ar?: string;
  company_job_title?: string;
  company_job_title_ar?: string;
}

export interface UniquePosition {
  title: string;
  titleAr?: string;
  department?: string;
  count: number;
}

export const usePositions = () => {
  const [positions, setPositions] = useState<UniquePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('employees')
        .select(`
          position,
          position_ar,
          actual_job_title,
          actual_job_title_ar,
          company_job_title,
          company_job_title_ar,
          department
        `)
        .not('position', 'is', null)
        .not('position', 'eq', '');

      if (error) throw error;

      // Process and consolidate positions
      const positionMap = new Map<string, UniquePosition>();

      data?.forEach(emp => {
        const mainTitle = emp.position || emp.actual_job_title || emp.company_job_title;
        const mainTitleAr = emp.position_ar || emp.actual_job_title_ar || emp.company_job_title_ar;
        
        if (mainTitle && mainTitle.trim() !== '') {
          const key = mainTitle.toLowerCase().trim();
          
          if (positionMap.has(key)) {
            const existing = positionMap.get(key)!;
            existing.count += 1;
          } else {
            positionMap.set(key, {
              title: mainTitle.trim(),
              titleAr: mainTitleAr?.trim(),
              department: emp.department,
              count: 1
            });
          }
        }
      });

      // Convert to array and sort by count (most common first), then alphabetically
      const uniquePositions = Array.from(positionMap.values())
        .sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return a.title.localeCompare(b.title);
        });

      setPositions(uniquePositions);
    } catch (err) {
      console.error('Error fetching positions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  };

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions
  };
};