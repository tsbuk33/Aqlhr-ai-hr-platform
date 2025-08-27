-- Simple fix for authentication setup - focus on core functionality

-- Update companies table structure to match what we need
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS size TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Create simple demo company data
INSERT INTO public.companies (id, name, industry, size)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'Demo Company', 'Technology', 'Medium')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  industry = EXCLUDED.industry,
  size = EXCLUDED.size,
  updated_at = NOW();

-- Create demo user role for testing
INSERT INTO public.user_roles (user_id, company_id, role)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::UUID, '550e8400-e29b-41d4-a716-446655440000'::UUID, 'admin')
ON CONFLICT DO NOTHING;

-- Add some basic demo employees
INSERT INTO public.hr_employees (company_id, employee_number, first_name, last_name, email, department, position, employment_status, is_saudi, nationality, salary)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'EMP001', 'Ahmed', 'Al-Rashid', 'ahmed@democompany.com', 'Human Resources', 'HR Manager', 'active', true, 'Saudi', 15000),
  ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'EMP002', 'Fatima', 'Al-Zahra', 'fatima@democompany.com', 'Human Resources', 'HR Specialist', 'active', true, 'Saudi', 12000)
ON CONFLICT DO NOTHING;