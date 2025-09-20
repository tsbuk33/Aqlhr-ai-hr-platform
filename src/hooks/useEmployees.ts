import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interface for full employee data (for privileged users)
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
  gosi_system_type?: 'OLD' | 'NEW';
  gosi_employee_rate?: number;
  gosi_employer_rate?: number;
  // New comprehensive fields
  job_location?: string;
  actual_job_title?: string;
  actual_job_title_ar?: string;
  iqama_title?: string;
  iqama_title_ar?: string;
  national_address?: string;
  personal_email?: string;
  company_email?: string;
  family_status?: 'family' | 'non_family';
  recruitment_type?: 'local' | 'international';
  passport_number?: string;
  number_of_wives?: number;
  number_of_children?: number;
  position_hired_for?: string;
  position_hired_for_ar?: string;
  project_hired_for?: string;
  project_hired_for_ar?: string;
  hired_request_number?: string;
  gender?: 'male' | 'female';
  basic_salary?: number;
  housing_allowance_percentage?: number;
  transportation_allowance_percentage?: number;
  company_provides_transportation?: boolean;
  other_benefits?: string;
  other_benefits_ar?: string;
  agreed_annual_bonus?: number;
  annual_tickets_type?: 'single' | 'family';
  annual_tickets_count?: number;
  company_sim_card?: boolean;
  schooling_fees_coverage?: 'none' | 'one_child' | 'two_children' | 'all_children';
  parents_medical_insurance?: boolean;
  // Additional comprehensive fields
  line_manager_extension?: string;
  vacation_days_per_year?: number;
  company_phone?: string;
  iban_number?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  life_insurance_home_country?: boolean;
  visa_number?: string;
  job_description?: string;
  job_description_ar?: string;
  kpis?: string;
  kpis_ar?: string;
  work_location?: string;
  work_location_ar?: string;
  project_name?: string;
  project_name_ar?: string;
  project_number?: string;
  project_cost_number?: string;
  overtime_eligible?: boolean;
  joining_date?: string;
  contract_type?: string;
  shift_type?: 'day' | 'night';
  company_housing?: boolean;
  education_level?: string;
  certificates?: string;
  certificates_ar?: string;
  experience_years?: number;
  grade_level?: string;
  driver_license_number?: string;
  company_job_title?: string;
  company_job_title_ar?: string;
  job_level?: 'junior' | 'senior' | 'manager' | 'director' | 'cxo';
  salary_level?: string;
  gosi_cost_per_month?: number;
  passport_expiry_date?: string;
  qiwa_contract?: boolean;
  saudi_engineer_card_number?: string;
  medical_conditions?: string;
  medical_conditions_ar?: string;
}

// Interface for safe employee data (with masked PII)
export interface SafeEmployee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  first_name_ar?: string;
  last_name_ar?: string;
  // Masked sensitive fields
  national_id_masked?: string;
  iqama_number_masked?: string;
  phone_masked?: string;
  passport_number_masked?: string;
  personal_email_masked?: string;
  // Safe fields
  company_email?: string;
  department?: string;
  position?: string;
  position_ar?: string;
  hire_date?: string;
  status?: string;
  is_saudi?: boolean;
  nationality?: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
  // Conditional salary info (null for unauthorized users)
  salary_info?: number | null;
  basic_salary_info?: number | null;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<SafeEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      // Use the secure view that masks PII based on user role
      const { data, error } = await supabase
        .from('employees_safe')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If no real data, add some dummy data for demonstration with masked PII
      if (!data || data.length === 0) {
        const dummyData = [
          {
            id: '1',
            employee_number: 'EMP001',
            first_name: 'Ahmed',
            last_name: 'Al-Rashid',
            first_name_ar: 'أحمد',
            last_name_ar: 'الراشد',
            national_id_masked: '****7890', // Masked for demo
            iqama_number_masked: null,
            phone_masked: '****4567',
            company_email: 'ahmed.alrashid@company.com',
            personal_email_masked: '****@gmail.com',
            department: 'Human Resources',
            position: 'HR Manager',
            position_ar: 'مدير الموارد البشرية',
            salary_info: null, // Hidden for non-privileged users
            basic_salary_info: null,
            hire_date: '2022-01-15',
            is_saudi: true,
            nationality: 'Saudi',
            status: 'active' as const,
            company_id: 'demo',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          }
        ];
        setEmployees(dummyData as SafeEmployee[]);
      } else {
        setEmployees((data || []) as SafeEmployee[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Set dummy data on error with proper masking
      const dummyData = [{
        id: '1',
        employee_number: 'EMP001',
        first_name: 'Ahmed',
        last_name: 'Al-Rashid',
        first_name_ar: 'أحمد',
        last_name_ar: 'الراشد',
        national_id_masked: '****7890',
        phone_masked: '****4567',
        company_email: 'ahmed.alrashid@company.com',
        personal_email_masked: '****@gmail.com',
        department: 'Human Resources',
        position: 'HR Manager',
        position_ar: 'مدير الموارد البشرية',
        salary_info: null,
        basic_salary_info: null,
        hire_date: '2022-01-15',
        is_saudi: true,
        nationality: 'Saudi',
        status: 'active' as const,
        company_id: 'demo',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }];
      setEmployees(dummyData as SafeEmployee[]);
    } finally {
      setLoading(false);
    }
  };

  // For creating new employees - use main table (will be audited)
  const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the safe employee list after adding
      await fetchEmployees();
      return data as Employee;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add employee');
    }
  };

  // For updating employees - use main table (will be audited)
  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the safe employee list after updating
      await fetchEmployees();
      return data as Employee;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update employee');
    }
  };

  // For deleting employees - use main table (will be audited)
  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the safe employee list after deletion
      await fetchEmployees();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete employee');
    }
  };

  // Function to get full employee details for privileged users
  const getFullEmployeeDetails = async (id: string): Promise<Employee | null> => {
    try {
      const { data, error } = await supabase
        .from('employees_full_pii')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Employee | null;
    } catch (err) {
      console.warn('Failed to fetch full employee details - user may not have permission:', err);
      return null;
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
    deleteEmployee,
    getFullEmployeeDetails, // New function for privileged access
  };
};