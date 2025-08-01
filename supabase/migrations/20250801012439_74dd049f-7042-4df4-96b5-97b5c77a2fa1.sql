-- Create a sample company for testing
INSERT INTO public.companies (id, name_en, name_ar, commercial_registration, tax_number, sector, status)
VALUES (
  'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
  'Test Company Inc',
  'شركة التجربة المحدودة',
  '1234567890',
  '987654321012345',
  'technology',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Create profile for the current user
INSERT INTO public.profiles (user_id, company_id, email, first_name, last_name)
VALUES (
  '63ae4d9a-0f5e-4fd3-8cc8-cab66528392b',
  'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
  'tsbuk33@gmail.com',
  'Test',
  'User'
) ON CONFLICT (user_id) DO UPDATE SET
  company_id = 'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
  email = 'tsbuk33@gmail.com';