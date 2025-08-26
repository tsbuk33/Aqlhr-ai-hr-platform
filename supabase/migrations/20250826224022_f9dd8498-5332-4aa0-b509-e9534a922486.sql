-- Create user profiles system for AqlHR (avoiding existing types)
-- Check and create only what doesn't exist

-- 1. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- 2. Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (using existing app_role type)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::TEXT = _role
  );
$$;

-- 4. Create function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role::TEXT
  FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE role::TEXT
      WHEN 'founder' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'hr_manager' THEN 3
      WHEN 'manager' THEN 4
      WHEN 'employee' THEN 5
      WHEN 'user' THEN 6
    END
  LIMIT 1;
$$;

-- 5. Create function to handle new user registration
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
    VALUES (NEW.id, 'founder'::app_role, NEW.id);
  ELSE
    -- Subsequent users get user role by default
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.id, 'user'::app_role, NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

-- 6. Create trigger for new users (drop existing first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Create function to update profile timestamps
CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 8. Create trigger for profile updates
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_updated_at();

-- 9. RLS Policies for profiles table
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

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

-- 10. Create helpful view
DROP VIEW IF EXISTS public.user_profiles_with_roles;
CREATE VIEW public.user_profiles_with_roles AS
SELECT 
  p.*,
  r.role::TEXT as current_role,
  r.assigned_at as role_assigned_at
FROM public.profiles p
LEFT JOIN public.user_roles r ON p.id = r.user_id;

-- Grant access to the view
GRANT SELECT ON public.user_profiles_with_roles TO authenticated;