-- Essential authentication setup - no demo data to avoid constraint issues

-- Ensure we have the demo company (minimal data)
INSERT INTO public.companies (id, name, industry)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'Demo Company', 'Technology')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  updated_at = NOW();

-- Secure the key functions for authentication
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT company_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    (SELECT company_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1),
    '550e8400-e29b-41d4-a716-446655440000'::UUID
  );
$$;

-- Demo tenant function
CREATE OR REPLACE FUNCTION get_demo_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT '550e8400-e29b-41d4-a716-446655440000'::UUID;
$$;

-- Fix the profile creation trigger to be more robust
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
  -- Insert profile with error handling
  BEGIN
    INSERT INTO public.profiles (id, user_id, email, first_name, last_name)
    VALUES (
      NEW.id, 
      NEW.id, 
      NEW.email,
      NEW.raw_user_meta_data ->> 'first_name',
      NEW.raw_user_meta_data ->> 'last_name'
    );
  EXCEPTION WHEN unique_violation THEN
    -- Profile already exists, update it
    UPDATE public.profiles 
    SET 
      email = NEW.email,
      first_name = COALESCE(NEW.raw_user_meta_data ->> 'first_name', first_name),
      last_name = COALESCE(NEW.raw_user_meta_data ->> 'last_name', last_name),
      updated_at = NOW()
    WHERE user_id = NEW.id;
  END;
  
  -- Setup company if provided
  v_company_name := NEW.raw_user_meta_data ->> 'company_name';
  
  IF v_company_name IS NOT NULL AND LENGTH(v_company_name) > 0 THEN
    BEGIN
      -- Create company
      INSERT INTO public.companies (name, industry)
      VALUES (v_company_name, 'General')
      RETURNING id INTO v_company_id;
      
      -- Assign user to company as admin
      INSERT INTO public.user_roles (user_id, company_id, role)
      VALUES (NEW.id, v_company_id, 'admin');
      
      -- Update profile with company_id
      UPDATE public.profiles 
      SET company_id = v_company_id 
      WHERE user_id = NEW.id;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log error but continue
      RAISE NOTICE 'Error setting up company for user %: %', NEW.id, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;