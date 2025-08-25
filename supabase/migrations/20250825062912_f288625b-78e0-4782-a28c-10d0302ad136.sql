-- Create a default department for demo company if not exists
INSERT INTO public.hr_departments (id, company_id, code, name_en, name_ar, created_at)
VALUES 
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'HR', 'Human Resources', 'الموارد البشرية', now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'IT', 'Information Technology', 'تكنولوجيا المعلومات', now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'FIN', 'Finance', 'المالية', now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'OPS', 'Operations', 'العمليات', now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'MKT', 'Marketing', 'التسويق', now())
ON CONFLICT (company_id, code) DO NOTHING;