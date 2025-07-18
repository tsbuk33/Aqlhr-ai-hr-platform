import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDummyPositions, type DummyPosition } from '@/utils/dummyData';

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

      // First try to get real data from database
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

      let processedPositions: UniquePosition[] = [];

      if (data && data.length > 0) {
        // Process real data if available
        const positionMap = new Map<string, UniquePosition>();

        data.forEach(emp => {
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

        processedPositions = Array.from(positionMap.values())
          .sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return a.title.localeCompare(b.title);
          });
      }

      // If no real data, use dummy data
      if (processedPositions.length === 0) {
        const dummyPositions = generateDummyPositions();
        processedPositions = dummyPositions.map(pos => ({
          title: pos.title,
          titleAr: pos.titleAr,
          department: pos.department,
          count: pos.count
        }));
      }

      setPositions(processedPositions);
    } catch (err) {
      console.error('Error fetching positions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
      
      // Fallback to dummy data on error
      const dummyPositions = generateDummyPositions();
      setPositions(dummyPositions.map(pos => ({
        title: pos.title,
        titleAr: pos.titleAr,
        department: pos.department,
        count: pos.count
      })));
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