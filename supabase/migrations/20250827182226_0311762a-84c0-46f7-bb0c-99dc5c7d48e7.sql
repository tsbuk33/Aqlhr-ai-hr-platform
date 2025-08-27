-- Working authentication setup with correct table structure

-- Add missing columns to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS size TEXT;

-- Create demo company with correct structure
INSERT INTO public.companies (id, name, size_category, industry)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'Demo Company', 'medium', 'Technology')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  size_category = EXCLUDED.size_category,
  industry = EXCLUDED.industry,
  updated_at = NOW();

-- Create demo employees with correct column names
INSERT INTO public.hr_employees (company_id, employee_no, full_name_en, full_name_ar, first_name, last_name, employment_status, is_saudi, nationality, base_salary, hire_date)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'EMP001', 'Ahmed Al-Rashid', 'أحمد الراشد', 'Ahmed', 'Al-Rashid', 'active', true, 'Saudi', 15000, CURRENT_DATE - INTERVAL '2 years'),
  ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'EMP002', 'Fatima Al-Zahra', 'فاطمة الزهراء', 'Fatima', 'Al-Zahra', 'active', true, 'Saudi', 12000, CURRENT_DATE - INTERVAL '1 year'),
  ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'EMP003', 'Mohammad Khan', 'محمد خان', 'Mohammad', 'Khan', 'active', false, 'Pakistani', 10000, CURRENT_DATE - INTERVAL '6 months')
ON CONFLICT DO NOTHING;

-- Update the get_user_company_id function to handle demo fallback
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT company_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    (SELECT company_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1),
    '550e8400-e29b-41d4-a716-446655440000'::UUID  -- Demo company UUID
  );
$$;

-- Create a function to get demo tenant for development
CREATE OR REPLACE FUNCTION get_demo_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT '550e8400-e29b-41d4-a716-446655440000'::UUID;
$$;