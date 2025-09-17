import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

interface EmployeeData {
  totalActive: number;
  saudiActive: number;
  nonSaudiActive: number;
  saudizationPct: number;
  list: any[];
  loading: boolean;
  error: string | null;
}

const EMPLOYMENT_STATUS_MAP = {
  'active': 'active',
  'probation': 'probation', 
  'terminated': 'terminated',
  'resigned': 'resigned'
} as const;

export const useEmployeesData = () => {
  const [data, setData] = useState<EmployeeData>({
    totalActive: 0,
    saudiActive: 0,
    nonSaudiActive: 0,
    saudizationPct: 0,
    list: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        const tenantId = await getTenantIdOrDemo();
        if (!tenantId) {
          throw new Error('Unable to determine tenant ID');
        }

        // Try headcount RPC first (we know ask_headcount_v1 exists)
        let headcountData = null;
        try {
          const { data: result, error } = await supabase.rpc('ask_headcount_v1' as any, { 
            p_tenant: tenantId 
          });
          if (!error && result) {
            headcountData = Array.isArray(result) ? result[0] : result;
          }
        } catch (e) {
          console.warn('RPC ask_headcount_v1 failed, falling back to client query:', e);
        }

        // Fallback to client query if RPC not found
        if (!headcountData) {
          const { data: employees, error } = await supabase
            .from('hr_employees')
            .select('id, is_saudi, employment_status')
            .eq('company_id', tenantId);

          if (error) throw error;

          const activeEmployees = employees?.filter(emp => 
            emp.employment_status === 'active'
          ) || [];

          const saudiCount = activeEmployees.filter(emp => emp.is_saudi).length;
          const nonSaudiCount = activeEmployees.length - saudiCount;
          
          headcountData = {
            total: activeEmployees.length,
            saudi: saudiCount,
            non_saudi: nonSaudiCount,
            saudization_rate: activeEmployees.length > 0 
              ? Math.round((saudiCount / activeEmployees.length) * 1000) / 10 
              : 0
          };
        }

        // Get employee list for directory (limited for performance)
        const { data: employeeList, error: listError } = await supabase
          .from('hr_employees')
          .select(`
            id, 
            employee_no, 
            full_name_en, 
            full_name_ar, 
            is_saudi, 
            employment_status,
            dept_id,
            hr_departments!inner(name_en, name_ar)
          `)
          .eq('company_id', tenantId)
          .eq('employment_status', 'active')
          .order('employee_no')
          .limit(100);

        if (listError) {
          console.warn('Employee list query failed:', listError);
        }

        if (!isMounted) return;

        setData({
          totalActive: headcountData.total || 0,
          saudiActive: headcountData.saudi || 0,
          nonSaudiActive: headcountData.non_saudi || 0,
          saudizationPct: headcountData.saudization_rate || 0,
          list: employeeList || [],
          loading: false,
          error: null
        });

      } catch (error: any) {
        if (!isMounted) return;
        console.error('Failed to fetch employee data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to load employee data'
        }));
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};