-- Create user profiles and roles system for AqlHR
-- This creates a comprehensive user management system with automatic profile creation

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('founder', 'admin', 'hr_manager', 'manager', 'employee', 'user');

-- 2. Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  department TEXT,
  job_title TEXT,
  phone TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Asia/Riyadh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (id)
);

-- 3. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE (user_id, role)
);

-- 4. Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 6. Create function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE role
      WHEN 'founder' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'hr_manager' THEN 3
      WHEN 'manager' THEN 4
      WHEN 'employee' THEN 5
      WHEN 'user' THEN 6
    END
  LIMIT 1;
$$;

-- 7. Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    full_name,
    language
  )
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(
      NEW.raw_user_meta_data ->> 'first_name' || ' ' || NEW.raw_user_meta_data ->> 'last_name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'en')
  );

  -- Check if this is the first user (founder)
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  -- Assign role based on user count
  IF user_count = 1 THEN
    -- First user becomes founder
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.id, 'founder', NEW.id);
  ELSE
    -- Subsequent users get user role by default
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.id, 'user', NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

-- 8. Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. Create function to update profile timestamps
CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 10. Create trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_updated_at();

-- 11. RLS Policies for profiles table
-- Users can view and edit their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Admins and above can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  public.has_role(auth.uid(), 'founder') OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'hr_manager')
);

-- 12. RLS Policies for user_roles table
-- Users can view their own roles
CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Founders and admins can manage roles
CREATE POLICY "Founders can manage all roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'founder'));

CREATE POLICY "Admins can manage non-founder roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') AND 
  role != 'founder'
);

-- HR Managers can view roles but not modify
CREATE POLICY "HR Managers can view roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'hr_manager'));

-- 13. Create helpful views
CREATE VIEW public.user_profiles_with_roles AS
SELECT 
  p.*,
  r.role as current_role,
  r.assigned_at as role_assigned_at
FROM public.profiles p
LEFT JOIN public.user_roles r ON p.id = r.user_id;

-- Grant access to the view
GRANT SELECT ON public.user_profiles_with_roles TO authenticated;