-- First, let's see what app_role enum values exist and extend them for HR platform
DO $$ 
BEGIN
    -- Check if we need to add HR-specific roles to the existing enum
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'owner' AND enumtypid = 'public.app_role'::regtype) THEN
        ALTER TYPE public.app_role ADD VALUE 'owner';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'hrbp' AND enumtypid = 'public.app_role'::regtype) THEN
        ALTER TYPE public.app_role ADD VALUE 'hrbp';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'director' AND enumtypid = 'public.app_role'::regtype) THEN
        ALTER TYPE public.app_role ADD VALUE 'director';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'vp' AND enumtypid = 'public.app_role'::regtype) THEN
        ALTER TYPE public.app_role ADD VALUE 'vp';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ceo' AND enumtypid = 'public.app_role'::regtype) THEN
        ALTER TYPE public.app_role ADD VALUE 'ceo';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'hr_manager' AND enumtypid = 'public.app_role'::regtype) THEN
        ALTER TYPE public.app_role ADD VALUE 'hr_manager';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'line_manager' AND enumtypid = 'public.app_role'::regtype) THEN
        ALTER TYPE public.app_role ADD VALUE 'line_manager';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'employee' AND enumtypid = 'public.app_role'::regtype) THEN
        ALTER TYPE public.app_role ADD VALUE 'employee';
    END IF;
END $$;

-- Create profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    company_id uuid,
    first_name text,
    last_name text,
    email text,
    phone text,
    avatar_url text,
    department text,
    job_title text,
    employee_id text,
    preferred_language text DEFAULT 'en',
    timezone text DEFAULT 'Asia/Riyadh',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view profiles from their company"
ON public.profiles FOR SELECT
USING (
    auth.uid() IS NOT NULL AND (
        user_id = auth.uid() OR 
        company_id = get_user_company_id()
    )
);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create function to get user profile with role information
CREATE OR REPLACE FUNCTION public.get_user_profile_with_roles(p_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
    user_id uuid,
    email text,
    first_name text,
    last_name text,
    company_id uuid,
    department text,
    job_title text,
    roles app_role[],
    primary_role app_role,
    avatar_url text,
    preferred_language text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.user_id,
        p.email,
        p.first_name,
        p.last_name,
        p.company_id,
        p.department,
        p.job_title,
        COALESCE(ARRAY_AGG(ur.role ORDER BY 
            CASE ur.role 
                WHEN 'owner' THEN 1
                WHEN 'ceo' THEN 2
                WHEN 'vp' THEN 3
                WHEN 'director' THEN 4
                WHEN 'hr_manager' THEN 5
                WHEN 'hrbp' THEN 6
                WHEN 'line_manager' THEN 7
                WHEN 'admin' THEN 8
                WHEN 'employee' THEN 9
                ELSE 10
            END
        ) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::app_role[]) as roles,
        CASE 
            WHEN 'owner' = ANY(ARRAY_AGG(ur.role)) THEN 'owner'::app_role
            WHEN 'ceo' = ANY(ARRAY_AGG(ur.role)) THEN 'ceo'::app_role
            WHEN 'vp' = ANY(ARRAY_AGG(ur.role)) THEN 'vp'::app_role
            WHEN 'director' = ANY(ARRAY_AGG(ur.role)) THEN 'director'::app_role
            WHEN 'hr_manager' = ANY(ARRAY_AGG(ur.role)) THEN 'hr_manager'::app_role
            WHEN 'hrbp' = ANY(ARRAY_AGG(ur.role)) THEN 'hrbp'::app_role
            WHEN 'line_manager' = ANY(ARRAY_AGG(ur.role)) THEN 'line_manager'::app_role
            WHEN 'admin' = ANY(ARRAY_AGG(ur.role)) THEN 'admin'::app_role
            ELSE 'employee'::app_role
        END as primary_role,
        p.avatar_url,
        p.preferred_language
    FROM public.profiles p
    LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
    WHERE p.user_id = p_user_id
    GROUP BY p.user_id, p.email, p.first_name, p.last_name, p.company_id, 
             p.department, p.job_title, p.avatar_url, p.preferred_language;
END;
$$;

-- Create function to assign role to user
CREATE OR REPLACE FUNCTION public.assign_user_role(
    p_user_id uuid,
    p_role app_role,
    p_company_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_assigner_company_id uuid;
    v_target_company_id uuid;
BEGIN
    -- Get assigner's company
    v_assigner_company_id := get_user_company_id();
    
    -- Use provided company_id or assigner's company
    v_target_company_id := COALESCE(p_company_id, v_assigner_company_id);
    
    -- Check if assigner has permission (admin, owner, or hr_manager)
    IF NOT (
        has_role(auth.uid(), 'admin') OR 
        has_role(auth.uid(), 'owner') OR 
        has_role(auth.uid(), 'hr_manager')
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions to assign roles';
    END IF;
    
    -- Insert role assignment
    INSERT INTO public.user_roles (user_id, role, company_id, assigned_by)
    VALUES (p_user_id, p_role, v_target_company_id, auth.uid())
    ON CONFLICT (user_id, role) DO UPDATE SET
        company_id = EXCLUDED.company_id,
        assigned_by = EXCLUDED.assigned_by,
        assigned_at = now();
    
    -- Update user's company_id in profiles if not set
    UPDATE public.profiles 
    SET company_id = v_target_company_id
    WHERE user_id = p_user_id AND company_id IS NULL;
    
    RETURN TRUE;
END;
$$;

-- Create trigger to auto-create profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (
        user_id, 
        email, 
        first_name, 
        last_name
    )
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
    
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update get_user_company_id function to use profiles table
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql 
SECURITY DEFINER
STABLE
AS $$
    SELECT company_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
    LIMIT 1;
$$;