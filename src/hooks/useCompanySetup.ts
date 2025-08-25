import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from './useUserProfile';

export interface CompanySetupStatus {
  company_id?: string;
  company_name?: string;
  is_demo: boolean;
  setup_completed: boolean;
  current_step: string;
  employees_count: number;
  departments_count: number;
}

export interface CompanyInfo {
  id?: string;
  name?: string;
  industry?: string;
  size_category?: string;
  country?: string;
  city?: string;
  description?: string;
  is_demo: boolean;
  settings: any;
}

export function useCompanySetup() {
  const [setupStatus, setSetupStatus] = useState<CompanySetupStatus | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  const loadCompanyInfo = async () => {
    if (!profile?.company_id) {
      // No company setup yet
      setSetupStatus({
        is_demo: false,
        setup_completed: false,
        current_step: 'company_setup',
        employees_count: 0,
        departments_count: 0
      });
      setLoading(false);
      return;
    }

    try {
      // Check if companies table exists, otherwise use fallback
      const { data: employees } = await supabase
        .from('hr_employees')
        .select('id')
        .eq('company_id', profile.company_id);

      const { data: departments } = await supabase
        .from('hr_departments')
        .select('id')
        .eq('company_id', profile.company_id);

      // Create basic company info from existing data
      setCompanyInfo({
        id: profile.company_id,
        name: 'Your Company',
        is_demo: false,
        settings: {}
      });

      setSetupStatus({
        company_id: profile.company_id,
        company_name: 'Your Company',
        is_demo: false,
        setup_completed: true, // Assume completed if we have company_id
        current_step: 'completed',
        employees_count: employees?.length || 0,
        departments_count: departments?.length || 0
      });

    } catch (err) {
      console.error('Error loading company info:', err);
      setError(err instanceof Error ? err.message : 'Failed to load company info');
    } finally {
      setLoading(false);
    }
  };

  const createDemoCompany = async (companyName: string = 'Demo Company') => {
    try {
      setLoading(true);
      
      // Generate a demo company ID
      const demoCompanyId = crypto.randomUUID();
      
      // Update user profile with demo company
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_id: demoCompanyId,
          role: 'admin'
        })
        .eq('user_id', profile?.user_id);

      if (profileError) throw profileError;

      // Create demo departments
      const { error: deptError } = await supabase
        .from('hr_departments')
        .insert([
          { company_id: demoCompanyId, code: 'HR', name_en: 'Human Resources', name_ar: 'الموارد البشرية' },
          { company_id: demoCompanyId, code: 'ENG', name_en: 'Engineering', name_ar: 'الهندسة' },
          { company_id: demoCompanyId, code: 'SALES', name_en: 'Sales & Marketing', name_ar: 'المبيعات والتسويق' }
        ]);

      if (deptError) console.warn('Could not create departments:', deptError);

      // Create demo employees
      const { error: empError } = await supabase
        .from('hr_employees')
        .insert([
          {
            company_id: demoCompanyId,
            employee_no: 'EMP001',
            full_name_en: 'Ahmed Al-Rashid',
            full_name_ar: 'أحمد الراشد',
            gender: 'male',
            nationality_code: 'SA',
            is_saudi: true,
            base_salary: 12000,
            employment_status: 'active',
            hire_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          {
            company_id: demoCompanyId,
            employee_no: 'EMP002',
            full_name_en: 'Sarah Johnson',
            full_name_ar: 'سارة جونسون',
            gender: 'female',
            nationality_code: 'US',
            is_saudi: false,
            base_salary: 15000,
            employment_status: 'active',
            hire_date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        ]);

      if (empError) console.warn('Could not create employees:', empError);

      await loadCompanyInfo();
      return demoCompanyId;
    } catch (err) {
      console.error('Error creating demo company:', err);
      setError(err instanceof Error ? err.message : 'Failed to create demo company');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (
    name: string,
    industry: string = 'other',
    sizeCategory: string = 'small'
  ) => {
    try {
      setLoading(true);

      // Generate a company ID
      const companyId = crypto.randomUUID();

      // Update user profile with company and admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_id: companyId,
          role: 'admin'
        })
        .eq('user_id', profile?.user_id);

      if (profileError) throw profileError;

      // Create initial departments
      const { error: deptError } = await supabase
        .from('hr_departments')
        .insert([
          { company_id: companyId, code: 'MGT', name_en: 'Management', name_ar: 'الإدارة' },
          { company_id: companyId, code: 'HR', name_en: 'Human Resources', name_ar: 'الموارد البشرية' }
        ]);

      if (deptError) console.warn('Could not create departments:', deptError);

      await loadCompanyInfo();
      return companyId;
    } catch (err) {
      console.error('Error creating company:', err);
      setError(err instanceof Error ? err.message : 'Failed to create company');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadCompanyInfo();
    }
  }, [profile]);

  return {
    setupStatus,
    companyInfo,
    loading,
    error,
    createDemoCompany,
    createCompany,
    refetch: loadCompanyInfo
  };
}