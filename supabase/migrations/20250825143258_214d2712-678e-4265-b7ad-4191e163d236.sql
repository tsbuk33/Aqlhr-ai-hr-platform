-- Ensure demo seeding function works properly for 1000 employees
CREATE OR REPLACE FUNCTION dev_seed_employees_v1(p_tenant_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_tenant_id uuid;
  v_result jsonb;
  v_count integer := 0;
BEGIN
  -- Use provided tenant or get current user's company
  v_tenant_id := COALESCE(p_tenant_id, get_user_company_id());
  
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No tenant ID available');
  END IF;

  -- Check if employees already exist
  SELECT COUNT(*) INTO v_count 
  FROM hr_employees 
  WHERE company_id = v_tenant_id;

  -- If we already have 1000+ employees, return success
  IF v_count >= 1000 THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Employees already seeded',
      'count', v_count,
      'tenant_id', v_tenant_id
    );
  END IF;

  -- Seed 1000 employees with realistic data
  INSERT INTO hr_employees (
    company_id, employee_no, full_name_en, full_name_ar, 
    is_saudi, nationality, gender, employment_status,
    dept_id, position_en, position_ar, hire_date,
    basic_salary, housing_allowance, transportation_allowance,
    phone, email, iqama_expiry
  )
  SELECT 
    v_tenant_id,
    'EMP' || LPAD((generate_series(1, 1000))::text, 4, '0'),
    CASE 
      WHEN random() < 0.6 THEN 
        (ARRAY['Ahmed Al-Rashid', 'Mohammed Al-Ghamdi', 'Abdullah Al-Otaibi', 'Salem Al-Harbi', 'Khalid Al-Mutairi', 
               'Fahad Al-Dosari', 'Nasser Al-Qahtani', 'Turki Al-Shehri', 'Bandar Al-Subaie', 'Saud Al-Ruwaili'])[floor(random() * 10 + 1)]
      ELSE
        (ARRAY['John Smith', 'Michael Johnson', 'David Brown', 'Robert Davis', 'William Miller', 
               'James Wilson', 'Christopher Moore', 'Daniel Taylor', 'Matthew Anderson', 'Anthony Thomas'])[floor(random() * 10 + 1)]
    END,
    CASE 
      WHEN random() < 0.6 THEN 
        (ARRAY['أحمد الراشد', 'محمد الغامدي', 'عبدالله العتيبي', 'سالم الحربي', 'خالد المطيري',
               'فهد الدوسري', 'ناصر القحطاني', 'تركي الشهري', 'بندر السبيعي', 'سعود الرويلي'])[floor(random() * 10 + 1)]
      ELSE
        (ARRAY['جون سميث', 'مايكل جونسون', 'ديفيد براون', 'روبرت ديفيس', 'وليام ميلر',
               'جيمس ويلسون', 'كريستوفر مور', 'دانيال تايلور', 'ماثيو أندرسون', 'أنثوني توماس'])[floor(random() * 10 + 1)]
    END,
    random() < 0.6, -- 60% Saudi
    CASE WHEN random() < 0.6 THEN 'Saudi' ELSE (ARRAY['Egyptian', 'Indian', 'Pakistani', 'Filipino', 'Bangladeshi'])[floor(random() * 5 + 1)] END,
    CASE WHEN random() < 0.7 THEN 'male' ELSE 'female' END,
    'active',
    NULL, -- dept_id - will be set later if departments exist
    (ARRAY['Software Engineer', 'Data Analyst', 'Project Manager', 'HR Specialist', 'Accountant', 
           'Sales Representative', 'Marketing Coordinator', 'Operations Manager', 'Quality Assurance', 'Customer Service'])[floor(random() * 10 + 1)],
    (ARRAY['مهندس برمجيات', 'محلل بيانات', 'مدير مشروع', 'أخصائي موارد بشرية', 'محاسب',
           'مندوب مبيعات', 'منسق تسويق', 'مدير عمليات', 'ضمان الجودة', 'خدمة العملاء'])[floor(random() * 10 + 1)],
    CURRENT_DATE - (random() * 2000)::integer, -- Random hire date within last 5 years
    3000 + (random() * 12000)::integer, -- Salary between 3000-15000
    CASE WHEN random() < 0.3 THEN (random() * 2000)::integer ELSE 0 END, -- Housing allowance
    CASE WHEN random() < 0.8 THEN (random() * 500)::integer ELSE 0 END, -- Transportation allowance
    '+966' || (500000000 + (random() * 99999999)::bigint)::text,
    'employee' || generate_series(1, 1000) || '@company.com',
    CASE WHEN random() > 0.6 THEN CURRENT_DATE + (30 + random() * 335)::integer ELSE NULL END -- Iqama expiry for non-Saudis
  FROM generate_series(1, 1000);

  -- Get final count
  SELECT COUNT(*) INTO v_count 
  FROM hr_employees 
  WHERE company_id = v_tenant_id;

  -- Update KPI snapshots with the new data
  INSERT INTO kpi_snapshots (
    company_id, snap_date, total_employees, saudization_rate, 
    active_users, compliance_score, employee_experience_10
  ) VALUES (
    v_tenant_id,
    CURRENT_DATE,
    v_count,
    (SELECT ROUND((COUNT(*) FILTER (WHERE is_saudi)::numeric / COUNT(*) * 100), 1) 
     FROM hr_employees WHERE company_id = v_tenant_id),
    v_count,
    85.5,
    7.8
  )
  ON CONFLICT (company_id, snap_date) 
  DO UPDATE SET
    total_employees = EXCLUDED.total_employees,
    saudization_rate = EXCLUDED.saudization_rate,
    active_users = EXCLUDED.active_users;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Successfully seeded employees',
    'count', v_count,
    'tenant_id', v_tenant_id
  );
END;
$$;

-- Create comprehensive translation bundles for all modules
INSERT INTO translation_registry (translation_key, english_text, arabic_text, needs_review) VALUES
-- Core navigation and common terms
('app.title', 'AqlHR Platform', 'منصة عقل للموارد البشرية', false),
('common.loading', 'Loading...', 'جاري التحميل...', false),
('common.error', 'Error', 'خطأ', false),
('common.success', 'Success', 'نجح', false),
('common.save', 'Save', 'حفظ', false),
('common.cancel', 'Cancel', 'إلغاء', false),
('common.delete', 'Delete', 'حذف', false),
('common.edit', 'Edit', 'تعديل', false),
('common.view', 'View', 'عرض', false),
('common.search', 'Search', 'بحث', false),
('common.filter', 'Filter', 'تصفية', false),
('common.export', 'Export', 'تصدير', false),
('common.print', 'Print', 'طباعة', false),
('common.refresh', 'Refresh', 'تحديث', false),
('common.add', 'Add', 'إضافة', false),
('common.update', 'Update', 'تحديث', false),
('common.create', 'Create', 'إنشاء', false),

-- Employee module
('employees.title', 'Employee Management', 'إدارة الموظفين', false),
('employees.subtitle', 'Manage your workforce effectively', 'إدارة القوى العاملة بفعالية', false),
('employees.add_employee', 'Add Employee', 'إضافة موظف', false),
('employees.employee_details', 'Employee Details', 'تفاصيل الموظف', false),
('employees.employee_list', 'Employee List', 'قائمة الموظفين', false),
('employees.total_employees', 'Total Employees', 'إجمالي الموظفين', false),
('employees.active_employees', 'Active Employees', 'الموظفون النشطون', false),
('employees.employee_number', 'Employee Number', 'رقم الموظف', false),
('employees.full_name', 'Full Name', 'الاسم الكامل', false),
('employees.position', 'Position', 'المنصب', false),
('employees.department', 'Department', 'القسم', false),
('employees.hire_date', 'Hire Date', 'تاريخ التوظيف', false),
('employees.salary', 'Salary', 'الراتب', false),
('employees.status', 'Status', 'الحالة', false),
('employees.nationality', 'Nationality', 'الجنسية', false),
('employees.saudi', 'Saudi', 'سعودي', false),
('employees.non_saudi', 'Non-Saudi', 'غير سعودي', false),

-- Attendance module
('attendance.title', 'Attendance & Time Tracking', 'الحضور وتتبع الوقت', false),
('attendance.subtitle', 'Track employee attendance and working hours', 'تتبع حضور الموظفين وساعات العمل', false),
('attendance.check_in', 'Check In', 'تسجيل الدخول', false),
('attendance.check_out', 'Check Out', 'تسجيل الخروج', false),
('attendance.working_hours', 'Working Hours', 'ساعات العمل', false),
('attendance.overtime', 'Overtime', 'العمل الإضافي', false),
('attendance.absent', 'Absent', 'غائب', false),
('attendance.present', 'Present', 'حاضر', false),
('attendance.late', 'Late', 'متأخر', false),

-- Leave management
('leave.title', 'Leave Management', 'إدارة الإجازات', false),
('leave.subtitle', 'Manage employee leave requests and balances', 'إدارة طلبات الإجازات وأرصدة الموظفين', false),
('leave.request_leave', 'Request Leave', 'طلب إجازة', false),
('leave.leave_balance', 'Leave Balance', 'رصيد الإجازة', false),
('leave.annual_leave', 'Annual Leave', 'الإجازة السنوية', false),
('leave.sick_leave', 'Sick Leave', 'الإجازة المرضية', false),
('leave.approved', 'Approved', 'موافق عليها', false),
('leave.pending', 'Pending', 'في الانتظار', false),
('leave.rejected', 'Rejected', 'مرفوضة', false),

-- Performance module
('performance.title', 'Performance Management', 'إدارة الأداء', false),
('performance.subtitle', 'Track and evaluate employee performance', 'تتبع وتقييم أداء الموظفين', false),
('performance.performance_review', 'Performance Review', 'مراجعة الأداء', false),
('performance.goals', 'Goals', 'الأهداف', false),
('performance.achievements', 'Achievements', 'الإنجازات', false),
('performance.rating', 'Rating', 'التقييم', false),

-- Payroll module
('payroll.title', 'Payroll & GOSI Management', 'إدارة الرواتب والتأمينات', false),
('payroll.subtitle', 'Manage payroll, benefits, and GOSI compliance', 'إدارة الرواتب والمزايا والامتثال للتأمينات', false),
('payroll.basic_salary', 'Basic Salary', 'الراتب الأساسي', false),
('payroll.allowances', 'Allowances', 'البدلات', false),
('payroll.deductions', 'Deductions', 'الاستقطاعات', false),
('payroll.net_salary', 'Net Salary', 'صافي الراتب', false),
('payroll.gosi_contribution', 'GOSI Contribution', 'اشتراك التأمينات', false),

-- Recruitment module
('recruitment.title', 'Recruitment & Hiring', 'التوظيف والتعيين', false),
('recruitment.subtitle', 'Manage job postings and candidate applications', 'إدارة الوظائف الشاغرة وطلبات المتقدمين', false),
('recruitment.job_posting', 'Job Posting', 'الوظيفة الشاغرة', false),
('recruitment.candidates', 'Candidates', 'المرشحون', false),
('recruitment.applications', 'Applications', 'الطلبات', false),
('recruitment.interview', 'Interview', 'المقابلة', false),

-- Analytics module
('analytics.title', 'HR Analytics & Reports', 'تحليلات الموارد البشرية والتقارير', false),
('analytics.subtitle', 'Gain insights from your HR data', 'احصل على رؤى من بيانات الموارد البشرية', false),
('analytics.reports', 'Reports', 'التقارير', false),
('analytics.insights', 'Insights', 'الرؤى', false),
('analytics.trends', 'Trends', 'الاتجاهات', false),

-- Settings module
('settings.title', 'System Settings', 'إعدادات النظام', false),
('settings.subtitle', 'Configure system preferences and settings', 'تكوين تفضيلات وإعدادات النظام', false),
('settings.user_preferences', 'User Preferences', 'تفضيلات المستخدم', false),
('settings.company_settings', 'Company Settings', 'إعدادات الشركة', false),
('settings.language', 'Language', 'اللغة', false),
('settings.timezone', 'Timezone', 'المنطقة الزمنية', false)

ON CONFLICT (translation_key) DO UPDATE SET
  english_text = EXCLUDED.english_text,
  arabic_text = EXCLUDED.arabic_text,
  needs_review = EXCLUDED.needs_review,
  updated_at = now();