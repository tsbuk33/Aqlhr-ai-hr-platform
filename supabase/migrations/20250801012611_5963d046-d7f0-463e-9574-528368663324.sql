-- Add user_id column to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Create a sample company for testing
INSERT INTO public.companies (id, name, company_name_arabic, cr_number, vat_number, industry, business_type)
VALUES (
  'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
  'Test Company Inc',
  'شركة التجربة المحدودة',
  '1234567890',
  '987654321012345',
  'technology',
  'corporation'
) ON CONFLICT (id) DO NOTHING;

-- Create profile for the current user
INSERT INTO public.profiles (user_id, company_id, email, first_name, last_name, role, is_active)
VALUES (
  '63ae4d9a-0f5e-4fd3-8cc8-cab66528392b',
  'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
  'tsbuk33@gmail.com',
  'Test',
  'User',
  'admin',
  true
) ON CONFLICT (user_id) DO UPDATE SET
  company_id = 'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
  email = 'tsbuk33@gmail.com',
  role = 'admin',
  is_active = true;