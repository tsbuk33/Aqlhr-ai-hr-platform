-- Fix remaining critical RLS policies and create missing tables
-- Handle existing policy conflicts by dropping and recreating

-- Fix profiles policies (handle existing ones)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "profiles_user_select" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "profiles_user_update" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "profiles_user_insert" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  country TEXT DEFAULT 'SA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_user_access" 
ON public.companies FOR ALL
USING (
  id IN (
    SELECT company_id FROM public.user_roles WHERE user_id = auth.uid()
    UNION
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create HR employees table if missing
CREATE TABLE IF NOT EXISTS public.hr_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id),
  employee_number TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  position TEXT,
  manager_id UUID REFERENCES public.hr_employees(id),
  hire_date DATE,
  employment_status TEXT DEFAULT 'active',
  is_saudi BOOLEAN DEFAULT false,
  nationality TEXT,
  salary NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.hr_employees ENABLE ROW LEVEL SECURITY;

-- Fix existing hr_employees policy if it exists
DROP POLICY IF EXISTS "hr_employees_company_access" ON public.hr_employees;
CREATE POLICY "hr_employees_company_access" 
ON public.hr_employees FOR ALL
USING (company_id = get_user_company_id() OR get_user_company_id() IS NULL);

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id),
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID,
  budget NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "departments_company_access" 
ON public.departments FOR ALL
USING (company_id = get_user_company_id() OR get_user_company_id() IS NULL);

-- Update get_user_company_id function to be more robust
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT company_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    (SELECT company_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1),
    'demo-tenant-id'::UUID  -- Demo fallback
  );
$$;

-- Create admin seed function
CREATE OR REPLACE FUNCTION create_demo_data(p_company_id UUID DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_department_id UUID;
BEGIN
  -- Use provided company_id or create demo company
  v_company_id := COALESCE(p_company_id, 'demo-tenant-id'::UUID);
  
  -- Insert demo company
  INSERT INTO public.companies (id, name, industry, size)
  VALUES (v_company_id, 'Demo Company', 'Technology', 'Medium')
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert demo department
  INSERT INTO public.departments (id, company_id, name, description)
  VALUES (gen_random_uuid(), v_company_id, 'Human Resources', 'Manages employee relations and policies')
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_department_id;
  
  -- Insert demo employees
  INSERT INTO public.hr_employees (company_id, employee_number, first_name, last_name, email, department, position, employment_status, is_saudi, nationality, salary)
  VALUES 
    (v_company_id, 'EMP001', 'Ahmed', 'Al-Rashid', 'ahmed@democompany.com', 'Human Resources', 'HR Manager', 'active', true, 'Saudi', 15000),
    (v_company_id, 'EMP002', 'Fatima', 'Al-Zahra', 'fatima@democompany.com', 'Human Resources', 'HR Specialist', 'active', true, 'Saudi', 12000),
    (v_company_id, 'EMP003', 'Mohammad', 'Khan', 'mohammad@democompany.com', 'IT', 'Software Engineer', 'active', false, 'Pakistani', 10000)
  ON CONFLICT DO NOTHING;
  
  RETURN v_company_id;
END;
$$;

-- Create automatic demo data seeding for new users
CREATE OR REPLACE FUNCTION setup_new_user_company()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_company_name TEXT;
BEGIN
  -- Get company name from metadata
  v_company_name := NEW.raw_user_meta_data ->> 'company_name';
  
  IF v_company_name IS NOT NULL THEN
    -- Create company
    INSERT INTO public.companies (name, industry, size)
    VALUES (v_company_name, 'General', 'Small')
    RETURNING id INTO v_company_id;
    
    -- Assign user to company as admin
    INSERT INTO public.user_roles (user_id, company_id, role)
    VALUES (NEW.id, v_company_id, 'admin');
    
    -- Update profile with company_id
    UPDATE public.profiles 
    SET company_id = v_company_id 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update the profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Setup company if provided
  PERFORM setup_new_user_company();
  
  RETURN NEW;
END;
$$;