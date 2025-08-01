-- Option C: Security Polish - Fix function search paths for security
-- Fix all function security issues by adding proper search_path settings

-- Update existing functions to be secure
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT company_id
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.enhanced_employee_ai_sync()
RETURNS TRIGGER AS $$
DECLARE
  v_affected_modules text[];
  v_comprehensive_payload jsonb;
BEGIN
  -- Determine affected modules based on changed fields
  v_affected_modules := ARRAY['core_hr', 'payroll', 'performance', 'compliance'];
  
  -- Add specific modules based on data changes
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.salary IS DISTINCT FROM NEW.salary) THEN
      v_affected_modules := v_affected_modules || ARRAY['payroll', 'gosi', 'benefits'];
    END IF;
    
    IF (OLD.department IS DISTINCT FROM NEW.department OR OLD.position IS DISTINCT FROM NEW.position) THEN
      v_affected_modules := v_affected_modules || ARRAY['org_chart', 'succession_planning'];
    END IF;
    
    IF (OLD.is_saudi IS DISTINCT FROM NEW.is_saudi OR OLD.nationality IS DISTINCT FROM NEW.nationality) THEN
      v_affected_modules := v_affected_modules || ARRAY['qiwa', 'nitaqat', 'government_compliance'];
    END IF;
    
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
      v_affected_modules := v_affected_modules || ARRAY['attendance', 'leave_management', 'performance'];
    END IF;
  END IF;
  
  -- Create comprehensive payload with all employee data
  v_comprehensive_payload := jsonb_build_object(
    'employee_data', to_jsonb(COALESCE(NEW, OLD)),
    'change_metadata', jsonb_build_object(
      'operation', TG_OP,
      'timestamp', now(),
      'table_name', TG_TABLE_NAME
    ),
    'data_categories', ARRAY[
      'personal_info',
      'employment_details', 
      'compensation',
      'benefits',
      'compliance',
      'performance',
      'documents'
    ]
  );
  
  -- Insert comprehensive sync event
  INSERT INTO public.ai_sync_events (
    company_id,
    event_type,
    source_table,
    source_record_id,
    affected_modules,
    payload,
    sync_status
  ) VALUES (
    COALESCE(NEW.company_id, OLD.company_id),
    TG_OP || '_employee_comprehensive',
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_affected_modules,
    v_comprehensive_payload,
    'pending'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Add more sample employees to reach 50 total
INSERT INTO public.employees (
  company_id, employee_number, national_id, iqama_number, 
  first_name, last_name, first_name_ar, last_name_ar,
  email, phone, nationality, is_saudi, hire_date, 
  department, position, position_ar, salary, status
) VALUES 
-- Additional Saudi Employees (20 more)
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ021', '3691470258', null, 'Huda', 'Al-Zahrani', 'هدى', 'الزهراني', 'huda.zahrani@almalz.com', '+966512345678', 'Saudi', true, '2022-03-08', 'Finance', 'Finance Assistant', 'مساعد مالي', 4200.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ022', '4820371695', null, 'Turki', 'Al-Shehri', 'تركي', 'الشهري', 'turki.shehri@almalz.com', '+966513456789', 'Saudi', true, '2019-07-11', 'Operations', 'Equipment Operator', 'مشغل معدات', 5200.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ023', '5937428160', null, 'Layla', 'Al-Mansouri', 'ليلى', 'المنصوري', 'layla.mansouri@almalz.com', '+966514567890', 'Saudi', true, '2021-12-15', 'Quality', 'Materials Tester', 'فاحص مواد', 4800.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ024', '6048572931', null, 'Faisal', 'Al-Dawsari', 'فيصل', 'الدوسري', 'faisal.dawsari@almalz.com', '+966515678901', 'Saudi', true, '2018-05-30', 'Construction', 'Electrician', 'كهربائي', 5800.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ025', '7159683472', null, 'Nada', 'Al-Rasheed', 'ندى', 'الرشيد', 'nada.rasheed@almalz.com', '+966516789012', 'Saudi', true, '2022-09-22', 'Administration', 'Receptionist', 'موظفة استقبال', 3500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ026', '8260794135', null, 'Mansour', 'Al-Thubaiti', 'منصور', 'الثبيتي', 'mansour.thubaiti@almalz.com', '+966517890123', 'Saudi', true, '2019-02-14', 'Engineering', 'Surveyor', 'مساح', 6500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ027', '9371840526', null, 'Amira', 'Al-Subai', 'أميرة', 'الصبي', 'amira.subai@almalz.com', '+966518901234', 'Saudi', true, '2021-08-07', 'Safety', 'Safety Coordinator', 'منسق أمان', 5500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ028', '0482951637', null, 'Lina', 'Al-Juhani', 'لينا', 'الجهني', 'lina.juhani@almalz.com', '+966520123456', 'Saudi', true, '2022-01-28', 'Finance', 'Payroll Specialist', 'أخصائي رواتب', 6000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ029', '1594062738', null, 'Saad', 'Al-Malki', 'سعد', 'المالكي', 'saad.malki@almalz.com', '+966521234567', 'Saudi', true, '2018-10-03', 'Construction', 'Plumber', 'سباك', 4700.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ030', '2605173849', null, 'Joud', 'Al-Enezi', 'جود', 'العنزي', 'joud.enezi@almalz.com', '+966522345678', 'Saudi', true, '2021-04-16', 'Quality', 'Quality Manager', 'مدير جودة', 9000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ031', '4827395061', null, 'Muna', 'Al-Shareef', 'منى', 'الشريف', 'muna.shareef@almalz.com', '+966524567890', 'Saudi', true, '2022-05-11', 'Administration', 'Document Controller', 'مراقب وثائق', 4500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ032', '5938406172', null, 'Fahad', 'Al-Nasser', 'فهد', 'الناصر', 'fahad.nasser@almalz.com', '+966525678901', 'Saudi', true, '2020-07-23', 'Operations', 'Logistics Coordinator', 'منسق لوجستي', 5800.00, 'active'),

-- Additional Non-Saudi Employees (15 more)
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ033', null, '3123456789', 'Ravi', 'Krishnan', 'رافي', 'كريشنان', 'ravi.krishnan@almalz.com', '+966543456789', 'Indian', false, '2020-11-14', 'Engineering', 'Mechanical Technician', 'فني ميكانيكي', 4000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ034', null, '3234567890', 'Youssef', 'Ibrahim', 'يوسف', 'إبراهيم', 'youssef.ibrahim@almalz.com', '+966544567890', 'Egyptian', false, '2019-04-03', 'Construction', 'Block Mason', 'بناء طوب', 3300.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ035', null, '3345678901', 'Venkat', 'Reddy', 'فينكات', 'ريدي', 'venkat.reddy@almalz.com', '+966545678901', 'Indian', false, '2022-01-07', 'Quality', 'Testing Technician', 'فني اختبار', 3800.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ036', null, '3456789012', 'Omar', 'Farouk', 'عمر', 'فاروق', 'omar.farouk@almalz.com', '+966546789012', 'Egyptian', false, '2020-08-19', 'Operations', 'Forklift Operator', 'مشغل رافعة شوكية', 3600.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ037', null, '3567890123', 'Anil', 'Gupta', 'أنيل', 'غوبتا', 'anil.gupta@almalz.com', '+966547890123', 'Indian', false, '2021-05-26', 'Engineering', 'Electrical Technician', 'فني كهربائي', 4300.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ038', null, '3678901234', 'Karim', 'Rashid', 'كريم', 'راشد', 'karim.rashid@almalz.com', '+966548901234', 'Bangladeshi', false, '2019-11-10', 'Construction', 'Scaffolder', 'عامل سقالات', 3100.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ039', null, '3789012345', 'Deepak', 'Joshi', 'ديباك', 'جوشي', 'deepak.joshi@almalz.com', '+966549012345', 'Indian', false, '2022-07-13', 'Safety', 'HSE Assistant', 'مساعد صحة وسلامة', 3700.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ040', null, '3890123456', 'Ibrahim', 'Ahmed', 'إبراهيم', 'أحمد', 'ibrahim.ahmed@almalz.com', '+966550123456', 'Sudanese', false, '2020-12-28', 'Operations', 'Store Keeper', 'أمين مخزن', 3400.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ041', null, '4001234567', 'Khalil', 'Mahmoud', 'خليل', 'محمود', 'khalil.mahmoud@almalz.com', '+966551234567', 'Jordanian', false, '2021-03-15', 'Engineering', 'Draftsman', 'رسام فني', 4000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ042', null, '4112345678', 'Manish', 'Sharma', 'مانيش', 'شارما', 'manish.sharma@almalz.com', '+966552345678', 'Indian', false, '2019-08-20', 'Construction', 'Rigger', 'عامل رفع', 3500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ043', null, '4223456789', 'Ashraf', 'Ali', 'أشرف', 'علي', 'ashraf.ali@almalz.com', '+966553456789', 'Pakistani', false, '2020-06-10', 'Construction', 'Painter', 'رسام', 3200.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ044', null, '4334567890', 'Sanjay', 'Patel', 'سانجاي', 'باتيل', 'sanjay.patel@almalz.com', '+966554567890', 'Indian', false, '2021-09-05', 'Operations', 'Loader Operator', 'مشغل لودر', 4100.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ045', null, '4445678901', 'Ahmed', 'Hassan', 'أحمد', 'حسن', 'ahmed.hassan@almalz.com', '+966555678901', 'Egyptian', false, '2018-12-12', 'Construction', 'Finishing Worker', 'عامل تشطيب', 3000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ046', null, '4556789012', 'Naveen', 'Kumar', 'نافين', 'كومار', 'naveen.kumar@almalz.com', '+966556789012', 'Indian', false, '2022-04-18', 'Engineering', 'Planning Engineer', 'مهندس تخطيط', 7000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ047', null, '4667890123', 'Mohammad', 'Khalil', 'محمد', 'خليل', 'mohammad.khalil@almalz.com', '+966557890123', 'Lebanese', false, '2020-01-25', 'Safety', 'First Aid Officer', 'ضابط إسعافات أولية', 4500.00, 'active');