-- Fix UUID format and complete authentication setup
-- Update get_user_company_id function with proper UUID format
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT company_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    (SELECT company_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1),
    '00000000-0000-0000-0000-000000000000'::UUID  -- Demo fallback with proper UUID
  );
$$;

-- Fix the setup_new_user_company function with proper error handling
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
  
  IF v_company_name IS NOT NULL AND LENGTH(v_company_name) > 0 THEN
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
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the user creation
  RAISE NOTICE 'Error setting up user company: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Update the profile creation trigger to handle company setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_company_name TEXT;
BEGIN
  -- Insert profile first
  INSERT INTO public.profiles (id, user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Setup company if provided in metadata
  v_company_name := NEW.raw_user_meta_data ->> 'company_name';
  
  IF v_company_name IS NOT NULL AND LENGTH(v_company_name) > 0 THEN
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
EXCEPTION WHEN OTHERS THEN
  -- Ensure profile creation doesn't fail
  RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create demo data function with proper UUID
CREATE OR REPLACE FUNCTION create_demo_data(p_company_id UUID DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_demo_uuid UUID := '550e8400-e29b-41d4-a716-446655440000'::UUID; -- Fixed demo UUID
BEGIN
  -- Use provided company_id or create demo company with fixed UUID
  v_company_id := COALESCE(p_company_id, v_demo_uuid);
  
  -- Insert demo company
  INSERT INTO public.companies (id, name, industry, size)
  VALUES (v_company_id, 'Demo Company', 'Technology', 'Medium')
  ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    updated_at = NOW();
  
  -- Insert demo departments
  INSERT INTO public.departments (company_id, name, description)
  VALUES 
    (v_company_id, 'Human Resources', 'Manages employee relations and policies'),
    (v_company_id, 'Information Technology', 'Manages technology infrastructure'),
    (v_company_id, 'Finance', 'Manages financial operations')
  ON CONFLICT DO NOTHING;
  
  -- Insert demo employees
  INSERT INTO public.hr_employees (company_id, employee_number, first_name, last_name, email, department, position, employment_status, is_saudi, nationality, salary)
  VALUES 
    (v_company_id, 'EMP001', 'Ahmed', 'Al-Rashid', 'ahmed@democompany.com', 'Human Resources', 'HR Manager', 'active', true, 'Saudi', 15000),
    (v_company_id, 'EMP002', 'Fatima', 'Al-Zahra', 'fatima@democompany.com', 'Human Resources', 'HR Specialist', 'active', true, 'Saudi', 12000),
    (v_company_id, 'EMP003', 'Mohammad', 'Khan', 'mohammad@democompany.com', 'Information Technology', 'Software Engineer', 'active', false, 'Pakistani', 10000),
    (v_company_id, 'EMP004', 'Sarah', 'Al-Mahmoud', 'sarah@democompany.com', 'Finance', 'Financial Analyst', 'active', true, 'Saudi', 11000)
  ON CONFLICT DO NOTHING;
  
  RETURN v_company_id;
END;
$$;

-- Initialize demo data
SELECT create_demo_data();