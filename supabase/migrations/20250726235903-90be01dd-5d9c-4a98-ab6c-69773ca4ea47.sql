-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the update_updated_at_column trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profiles table with all required columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  company_id uuid,
  role text,
  department text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample profiles
INSERT INTO public.profiles (id, first_name, last_name, email, company_id, role, department, is_active)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Ahmed',  'Al-Saudi',   'ahmed@techcompany.com',  '550e8400-e29b-41d4-a716-446655440001', 'hr_manager', 'Human Resources', true),
  ('44444444-4444-4444-4444-444444444444', 'Sarah',  'Johnson',    'sarah@advancedtech.com','550e8400-e29b-41d4-a716-446655440002', 'admin',      'IT',              true),
  ('55555555-5555-5555-5555-555555555555', 'Fatima', 'Al-Zahrani', 'fatima@consultingsa.com','550e8400-e29b-41d4-a716-446655440003', 'consultant', 'Management',      true)
ON CONFLICT (id) DO NOTHING;

-- Insert user_roles
INSERT INTO public.user_roles (user_id, role)
VALUES
  ('33333333-3333-3333-3333-333333333333','admin'),
  ('44444444-4444-4444-4444-444444444444','reviewer'),
  ('55555555-5555-5555-5555-555555555555','user')
ON CONFLICT (user_id,role) DO NOTHING;

-- Insert pilot_group_users
INSERT INTO public.pilot_group_users (user_id, pilot_features, access_level, is_active, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333333', ARRAY['i18n_review'], 'admin',    true, now() + interval '6 months'),
  ('44444444-4444-4444-4444-444444444444', ARRAY['i18n_review'], 'reviewer', true, now() + interval '1 year'),
  ('55555555-5555-5555-5555-555555555555', ARRAY['i18n_review'], 'user',     true, now() + interval '3 months')
ON CONFLICT (user_id) DO NOTHING;

-- Insert translation_feedback
INSERT INTO public.translation_feedback (
  translation_key,
  original_text,
  suggested_text,
  context_info,
  priority,
  feedback_type,
  status,
  user_id,
  company_id
)
VALUES
  ('dashboard.welcome',        'مرحباً',      'أهلاً وسهلاً',   '/dashboard', 'medium', 'correction',   'pending',   '33333333-3333-3333-3333-333333333333','550e8400-e29b-41d4-a716-446655440001'),
  ('employee.status.active',   'نشط',         'فعال',         '/employees', 'high',   'improvement', 'in_review','44444444-4444-4444-4444-444444444444','550e8400-e29b-41d4-a716-446655440001'),
  ('reports.generate',         'إنشاء تقرير', 'توليد تقرير',    '/reports',    'low',    'suggestion',  'pending',   '55555555-5555-5555-5555-555555555555','550e8400-e29b-41d4-a716-446655440001'),
  ('navigation.settings',      'الإعدادات',   'إعدادات النظام','/settings',   'medium', 'correction',   'pending',   '44444444-4444-4444-4444-444444444444','550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (translation_key, user_id, company_id) DO NOTHING;