-- 1) Add missing columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_id uuid,
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 2) Insert sample profiles (now using first_name/last_name + new columns)
INSERT INTO public.profiles (id, first_name, last_name, email, company_id, role, department, is_active)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Ahmed',  'Al-Saudi',   'ahmed@techcompany.com',  '550e8400-e29b-41d4-a716-446655440001', 'hr_manager', 'Human Resources', true),
  ('44444444-4444-4444-4444-444444444444', 'Sarah',  'Johnson',    'sarah@advancedtech.com','550e8400-e29b-41d4-a716-446655440002', 'admin',      'IT',              true),
  ('55555555-5555-5555-5555-555555555555', 'Fatima', 'Al-Zahrani', 'fatima@consultingsa.com','550e8400-e29b-41d4-a716-446655440003', 'consultant', 'Management',      true)
ON CONFLICT (id) DO NOTHING;

-- 3) Insert user_roles (unchanged)
INSERT INTO public.user_roles (user_id, role)
VALUES
  ('33333333-3333-3333-3333-333333333333','admin'),
  ('44444444-4444-4444-4444-444444444444','reviewer'),
  ('55555555-5555-5555-5555-555555555555','user')
ON CONFLICT (user_id,role) DO NOTHING;

-- 4) Fix pilot_group_users INSERT to use access_level
INSERT INTO public.pilot_group_users (user_id, pilot_features, access_level, is_active, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333333', ARRAY['i18n_review'], 'admin',    true, now() + interval '6 months'),
  ('44444444-4444-4444-4444-444444444444', ARRAY['i18n_review'], 'reviewer', true, now() + interval '1 year'),
  ('55555555-5555-5555-5555-555555555555', ARRAY['i18n_review'], 'user',     true, now() + interval '3 months')
ON CONFLICT (user_id) DO NOTHING;

-- 5) Correct translation_feedback INSERT to match your DDL
INSERT INTO public.translation_feedback (
  translation_key,
  original_text,
  suggested_text,
  context_info,   -- was context_url
  priority,       -- was priority_level
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