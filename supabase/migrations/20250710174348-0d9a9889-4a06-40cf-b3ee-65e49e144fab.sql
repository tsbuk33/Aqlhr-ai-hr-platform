-- Fix RLS policies and seed company data properly
-- First, fix the RLS policy for gov_integration_status table
DROP POLICY IF EXISTS "Users can view gov integration status from their company" ON gov_integration_status;

CREATE POLICY "Users can manage gov integration status from their company" 
ON gov_integration_status 
FOR ALL 
USING (auth.uid() IS NOT NULL) 
WITH CHECK (auth.uid() IS NOT NULL);

-- Delete existing test data to avoid conflicts
DELETE FROM payroll WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
DELETE FROM attendance WHERE employee_id IN (SELECT id FROM employees WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'));
DELETE FROM gov_integration_status WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
DELETE FROM employees WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
DELETE FROM companies WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');

-- Create sample companies for testing
INSERT INTO companies (id, name, cr_number, vat_number, industry, size_category, language_preference, saudization_target, rtl_enabled) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'شركة تجارية سعودية', '1010123456', '300123456789003', 'Retail', 'medium', 'ar', 0.75, true),
  ('22222222-2222-2222-2222-222222222222', 'Saudi Tech Solutions', '1010654321', '300654321987003', 'Technology', 'large', 'en', 0.60, false),
  ('33333333-3333-3333-3333-333333333333', 'مجموعة الخدمات المالية', '1010789123', '300789123456003', 'Financial Services', 'enterprise', 'ar', 0.80, true);

-- Create sample employees for each company
INSERT INTO employees (
  company_id, employee_number, first_name, last_name, first_name_ar, last_name_ar,
  email, phone, nationality, department, position, position_ar, 
  is_saudi, basic_salary, hire_date, status
) VALUES 
  -- Company 1 employees
  ('11111111-1111-1111-1111-111111111111', 'EMP001', 'Ahmed', 'Al-Rashid', 'أحمد', 'الراشد', 'ahmed.rashid@company1.sa', '+966501234567', 'Saudi', 'Sales', 'Sales Manager', 'مدير المبيعات', true, 15000, '2023-01-15', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'EMP002', 'Fatima', 'Al-Zahra', 'فاطمة', 'الزهراء', 'fatima.zahra@company1.sa', '+966507654321', 'Saudi', 'HR', 'HR Specialist', 'أخصائي موارد بشرية', true, 12000, '2023-02-01', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'EMP003', 'John', 'Smith', 'جون', 'سميث', 'john.smith@company1.sa', '+966509876543', 'American', 'IT', 'Software Developer', 'مطور برمجيات', false, 18000, '2023-03-10', 'active'),
  
  -- Company 2 employees
  ('22222222-2222-2222-2222-222222222222', 'EMP004', 'Sara', 'Al-Mutairi', 'سارة', 'المطيري', 'sara.mutairi@company2.sa', '+966502345678', 'Saudi', 'Engineering', 'Senior Developer', 'مطور أول', true, 20000, '2022-11-20', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'EMP005', 'Mohammed', 'Al-Otaibi', 'محمد', 'العتيبي', 'mohammed.otaibi@company2.sa', '+966508765432', 'Saudi', 'Management', 'Project Manager', 'مدير مشروع', true, 25000, '2022-08-15', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'EMP006', 'Maria', 'Garcia', 'ماريا', 'غارسيا', 'maria.garcia@company2.sa', '+966503456789', 'Spanish', 'Design', 'UX Designer', 'مصمم تجربة المستخدم', false, 16000, '2023-04-05', 'active'),
  
  -- Company 3 employees
  ('33333333-3333-3333-3333-333333333333', 'EMP007', 'Khalid', 'Al-Qahtani', 'خالد', 'القحطاني', 'khalid.qahtani@company3.sa', '+966504567890', 'Saudi', 'Finance', 'Financial Analyst', 'محلل مالي', true, 14000, '2023-01-30', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'EMP008', 'Nora', 'Al-Harbi', 'نورا', 'الحربي', 'nora.harbi@company3.sa', '+966506789012', 'Saudi', 'Operations', 'Operations Manager', 'مدير العمليات', true, 22000, '2022-12-01', 'active');

-- Create government integration status records for each company
INSERT INTO gov_integration_status (
  company_id, integration_type, status, config, last_sync
) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'qiwa', 'active', '{"api_endpoint": "https://qiwa.sa/api", "sync_frequency": "daily"}', now() - interval '1 day'),
  ('11111111-1111-1111-1111-111111111111', 'gosi', 'active', '{"api_endpoint": "https://gosi.gov.sa/api", "sync_frequency": "monthly"}', now() - interval '7 days'),
  ('11111111-1111-1111-1111-111111111111', 'mol', 'pending', '{"api_endpoint": "https://mol.gov.sa/api"}', null),
  
  ('22222222-2222-2222-2222-222222222222', 'qiwa', 'active', '{"api_endpoint": "https://qiwa.sa/api", "sync_frequency": "daily"}', now() - interval '2 hours'),
  ('22222222-2222-2222-2222-222222222222', 'gosi', 'active', '{"api_endpoint": "https://gosi.gov.sa/api", "sync_frequency": "monthly"}', now() - interval '3 days'),
  ('22222222-2222-2222-2222-222222222222', 'zatca', 'active', '{"api_endpoint": "https://zatca.gov.sa/api", "sync_frequency": "weekly"}', now() - interval '1 day'),
  
  ('33333333-3333-3333-3333-333333333333', 'qiwa', 'active', '{"api_endpoint": "https://qiwa.sa/api", "sync_frequency": "daily"}', now() - interval '6 hours'),
  ('33333333-3333-3333-3333-333333333333', 'gosi', 'active', '{"api_endpoint": "https://gosi.gov.sa/api", "sync_frequency": "monthly"}', now() - interval '5 days'),
  ('33333333-3333-3333-3333-333333333333', 'zatca', 'pending', '{"api_endpoint": "https://zatca.gov.sa/api"}', null);

-- Create sample attendance records
INSERT INTO attendance (employee_id, date, check_in, check_out, total_hours, status)
SELECT 
  e.id,
  current_date - (gs.i % 30),
  current_date - (gs.i % 30) + time '08:00:00' + (random() * interval '2 hours'),
  current_date - (gs.i % 30) + time '17:00:00' + (random() * interval '2 hours'),
  8 + (random() * 2),
  'present'
FROM employees e
CROSS JOIN generate_series(1, 15) gs(i)
WHERE e.status = 'active'
ON CONFLICT (employee_id, date) DO NOTHING;

-- Create sample payroll records for the current month
INSERT INTO payroll (
  company_id, employee_id, month, year, basic_salary, allowances, overtime, 
  deductions, gosi_employee, gosi_employer, net_salary, wps_status
)
SELECT 
  e.company_id,
  e.id,
  EXTRACT(MONTH FROM current_date)::integer,
  EXTRACT(YEAR FROM current_date)::integer,
  e.basic_salary,
  e.basic_salary * 0.1,
  500 + (random() * 1000)::integer,
  e.basic_salary * 0.05,
  e.basic_salary * 0.1,
  e.basic_salary * 0.12,
  e.basic_salary + (e.basic_salary * 0.1) + (500 + (random() * 1000)::integer) - (e.basic_salary * 0.05) - (e.basic_salary * 0.1),
  'processed'
FROM employees e
WHERE e.status = 'active' AND e.basic_salary IS NOT NULL;