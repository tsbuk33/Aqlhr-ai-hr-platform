-- Create the dev_seed_employees_v1 function for demo data seeding  
CREATE OR REPLACE FUNCTION public.dev_seed_employees_v1(p_tenant uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_seeded_count integer := 0;
BEGIN
  -- Check if employees already exist for this tenant
  SELECT COUNT(*) INTO v_seeded_count 
  FROM public.hr_employees 
  WHERE company_id = p_tenant;
  
  -- If already has employees, skip seeding
  IF v_seeded_count > 0 THEN
    RETURN jsonb_build_object(
      'message', 'Demo employees already exist',
      'seeded_count', v_seeded_count,
      'tenant_id', p_tenant
    );
  END IF;
  
  -- Seed demo employees
  INSERT INTO public.hr_employees (
    company_id, employee_no, full_name_en, full_name_ar, 
    email, phone, iqama_number, "position", department, 
    employment_status, hire_date, basic_salary, is_saudi
  ) VALUES 
  (p_tenant, 'EMP001', 'Ahmed Al-Rashid', 'أحمد الراشد', 'ahmed.rashid@company.com', '+966501234567', '1234567890', 'Senior Developer', 'IT', 'active', '2022-01-15', 12000, true),
  (p_tenant, 'EMP002', 'Sarah Johnson', 'سارة جونسون', 'sarah.johnson@company.com', '+966512345678', '2345678901', 'HR Manager', 'Human Resources', 'active', '2021-06-01', 15000, false),
  (p_tenant, 'EMP003', 'Mohammed Al-Otaibi', 'محمد العتيبي', 'mohammed.otaibi@company.com', '+966523456789', '3456789012', 'Accountant', 'Finance', 'active', '2023-03-10', 8000, true),
  (p_tenant, 'EMP004', 'Fatima Al-Zahra', 'فاطمة الزهراء', 'fatima.zahra@company.com', '+966534567890', '4567890123', 'Marketing Specialist', 'Marketing', 'active', '2022-08-20', 9500, true),
  (p_tenant, 'EMP005', 'John Smith', 'جون سميث', 'john.smith@company.com', '+966545678901', '5678901234', 'Project Manager', 'IT', 'active', '2021-12-01', 18000, false),
  (p_tenant, 'EMP006', 'Noura Al-Mansouri', 'نورا المنصوري', 'noura.mansouri@company.com', '+966556789012', '6789012345', 'Legal Advisor', 'Legal', 'active', '2023-02-15', 16000, true),
  (p_tenant, 'EMP007', 'David Wilson', 'ديفيد ويلسون', 'david.wilson@company.com', '+966567890123', '7890123456', 'Operations Manager', 'Operations', 'active', '2022-05-10', 14000, false),
  (p_tenant, 'EMP008', 'Khalid Al-Fahd', 'خالد الفهد', 'khalid.fahd@company.com', '+966578901234', '8901234567', 'Sales Representative', 'Sales', 'active', '2023-01-25', 7500, true);
  
  GET DIAGNOSTICS v_seeded_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'message', 'Demo employees seeded successfully',
    'seeded_count', v_seeded_count,
    'tenant_id', p_tenant
  );
END;
$function$;

-- Create the hr_employees_count_v1 function for pagination
CREATE OR REPLACE FUNCTION public.hr_employees_count_v1(p_tenant uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COUNT(*)::integer
  FROM public.hr_employees
  WHERE company_id = p_tenant;
$function$;

-- Create the hr_employees_list_v1 function for data fetching
CREATE OR REPLACE FUNCTION public.hr_employees_list_v1(
  p_tenant uuid,
  p_page integer DEFAULT 1,
  p_limit integer DEFAULT 50,
  p_search text DEFAULT NULL,
  p_department text DEFAULT NULL,
  p_status text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  employee_number text,
  full_name text,
  email text,
  phone text,
  iqama_number text,
  "position" text,  
  department text,
  status text,
  hire_date date,
  salary numeric,
  is_saudi boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    e.id,
    e.employee_no as employee_number,
    e.full_name_en as full_name,
    e.email,
    e.phone,
    e.iqama_number,
    e."position",
    e.department,
    e.employment_status as status,
    e.hire_date,
    e.basic_salary as salary,
    e.is_saudi
  FROM public.hr_employees e
  WHERE e.company_id = p_tenant
    AND (p_search IS NULL OR (
      e.full_name_en ILIKE '%' || p_search || '%' OR
      e.employee_no ILIKE '%' || p_search || '%' OR
      e.department ILIKE '%' || p_search || '%'
    ))
    AND (p_department IS NULL OR e.department = p_department)
    AND (p_status IS NULL OR e.employment_status = p_status)
  ORDER BY e.created_at DESC
  LIMIT p_limit
  OFFSET ((p_page - 1) * p_limit);
$function$;