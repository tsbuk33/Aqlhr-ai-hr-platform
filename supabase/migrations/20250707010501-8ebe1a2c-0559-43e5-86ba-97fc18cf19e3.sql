-- SanadHR Database Schema - Phase 1: Core HR Foundation

-- Create core company profile table
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cr_number TEXT UNIQUE,
  vat_number TEXT,
  industry TEXT,
  size_category TEXT CHECK (size_category IN ('small', 'medium', 'large', 'enterprise')),
  saudization_target DECIMAL(5,2),
  language_preference TEXT DEFAULT 'ar' CHECK (language_preference IN ('ar', 'en')),
  rtl_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employee profiles table
CREATE TABLE public.employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_number TEXT NOT NULL,
  national_id TEXT UNIQUE,
  iqama_number TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_name_ar TEXT,
  last_name_ar TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  nationality TEXT,
  is_saudi BOOLEAN DEFAULT false,
  hire_date DATE,
  department TEXT,
  position TEXT,
  position_ar TEXT,
  salary DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated', 'on_leave')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, employee_number)
);

-- Create payroll table
CREATE TABLE public.payroll (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  basic_salary DECIMAL(10,2) NOT NULL,
  allowances DECIMAL(10,2) DEFAULT 0,
  overtime DECIMAL(10,2) DEFAULT 0,
  deductions DECIMAL(10,2) DEFAULT 0,
  gosi_employee DECIMAL(10,2) DEFAULT 0,
  gosi_employer DECIMAL(10,2) DEFAULT 0,
  net_salary DECIMAL(10,2) NOT NULL,
  wps_status TEXT DEFAULT 'pending' CHECK (wps_status IN ('pending', 'processed', 'failed')),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  total_hours DECIMAL(4,2),
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'early_leave', 'holiday')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Create leave management table
CREATE TABLE public.leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('annual', 'sick', 'maternity', 'paternity', 'hajj', 'emergency')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES public.employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create performance management table
CREATE TABLE public.performance_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.employees(id),
  review_period TEXT NOT NULL,
  goals JSONB,
  achievements JSONB,
  kpis JSONB,
  overall_rating DECIMAL(3,2) CHECK (overall_rating BETWEEN 1.0 AND 5.0),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create training records table
CREATE TABLE public.training_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  course_name_ar TEXT,
  provider TEXT,
  start_date DATE,
  end_date DATE,
  hours DECIMAL(5,2),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'cancelled')),
  certificate_url TEXT,
  tvtc_integrated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create government integration status table
CREATE TABLE public.gov_integration_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('qiwa', 'gosi', 'mudad', 'muqeem', 'absher', 'hrsd', 'tvtc', 'health_insurance')),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'pending')),
  last_sync TIMESTAMP WITH TIME ZONE,
  api_key_encrypted TEXT,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, integration_type)
);

-- Create audit trail table
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gov_integration_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (company-based access)
CREATE POLICY "Companies can view their own data" ON public.companies FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view employees from their company" ON public.employees FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view payroll from their company" ON public.payroll FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view attendance from their company" ON public.attendance FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view leave requests from their company" ON public.leave_requests FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view performance reviews from their company" ON public.performance_reviews FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view training records from their company" ON public.training_records FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view gov integration status from their company" ON public.gov_integration_status FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view audit logs from their company" ON public.audit_logs FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_performance_reviews_updated_at BEFORE UPDATE ON public.performance_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gov_integration_status_updated_at BEFORE UPDATE ON public.gov_integration_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Saudi company data
INSERT INTO public.companies (name, cr_number, vat_number, industry, size_category, saudization_target) VALUES
('شركة سند للموارد البشرية', '1010123456', '300012345600003', 'HR Technology', 'enterprise', 70.00),
('مؤسسة الرياض التجارية', '1010234567', '300023456700003', 'Retail', 'large', 60.00),
('شركة النهضة للمقاولات', '1010345678', '300034567800003', 'Construction', 'medium', 50.00);

-- Insert sample employee data
INSERT INTO public.employees (company_id, employee_number, national_id, first_name, last_name, first_name_ar, last_name_ar, email, nationality, is_saudi, hire_date, department, position, position_ar, salary) 
SELECT 
  c.id,
  'EMP' || LPAD((ROW_NUMBER() OVER ())::text, 4, '0'),
  '1' || LPAD((ROW_NUMBER() OVER ())::text, 9, '0'),
  names.first_name,
  names.last_name,
  names.first_name_ar,
  names.last_name_ar,
  LOWER(names.first_name) || '.' || LOWER(names.last_name) || '@' || LOWER(REPLACE(c.name, ' ', '')) || '.com',
  CASE WHEN names.is_saudi THEN 'Saudi' ELSE 'Expat' END,
  names.is_saudi,
  CURRENT_DATE - INTERVAL '2 years' + (ROW_NUMBER() OVER ()) * INTERVAL '30 days',
  names.department,
  names.position,
  names.position_ar,
  names.salary
FROM public.companies c
CROSS JOIN (
  VALUES 
    ('Ahmed', 'Al-Rashid', 'أحمد', 'الراشد', true, 'HR', 'HR Manager', 'مدير الموارد البشرية', 15000),
    ('Fatima', 'Al-Zahra', 'فاطمة', 'الزهراء', true, 'Finance', 'Accountant', 'محاسب', 8000),
    ('Mohammed', 'Al-Otaibi', 'محمد', 'العتيبي', true, 'IT', 'Software Developer', 'مطور برمجيات', 12000),
    ('Sarah', 'Al-Mansouri', 'سارة', 'المنصوري', true, 'Marketing', 'Marketing Specialist', 'أخصائي تسويق', 9000),
    ('Omar', 'Al-Ghamdi', 'عمر', 'الغامدي', true, 'Operations', 'Operations Manager', 'مدير العمليات', 14000)
) AS names(first_name, last_name, first_name_ar, last_name_ar, is_saudi, department, position, position_ar, salary);