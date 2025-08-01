-- Fix the ambiguous key reference in the existing trigger function
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
  
  -- Create comprehensive payload with all employee data (simplified)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now insert the employees data
INSERT INTO public.employees (
  company_id, employee_number, national_id, iqama_number, 
  first_name, last_name, first_name_ar, last_name_ar,
  email, phone, nationality, is_saudi, hire_date, 
  department, position, position_ar, salary, status
) VALUES 
-- Key Saudi Management & Senior Staff
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ001', '1234567890', null, 'Ahmed', 'Al-Rashid', 'أحمد', 'الراشد', 'ahmed.rashid@almalz.com', '+966501234567', 'Saudi', true, '2020-03-15', 'Construction', 'Site Supervisor', 'مشرف موقع', 8500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ002', '2345678901', null, 'Fatima', 'Al-Zahra', 'فاطمة', 'الزهراء', 'fatima.zahra@almalz.com', '+966502345678', 'Saudi', true, '2021-01-10', 'Administration', 'HR Coordinator', 'منسق الموارد البشرية', 6500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ003', '3456789012', null, 'Mohammed', 'Al-Mutairi', 'محمد', 'المطيري', 'mohammed.mutairi@almalz.com', '+966503456789', 'Saudi', true, '2019-11-22', 'Engineering', 'Civil Engineer', 'مهندس مدني', 9500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ004', '4567890123', null, 'Noura', 'Al-Harbi', 'نورا', 'الحربي', 'noura.harbi@almalz.com', '+966504567890', 'Saudi', true, '2022-02-14', 'Finance', 'Accountant', 'محاسب', 5500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ005', '5678901234', null, 'Khalid', 'Al-Dosari', 'خالد', 'الدوسري', 'khalid.dosari@almalz.com', '+966505678901', 'Saudi', true, '2020-09-01', 'Operations', 'Project Manager', 'مدير مشروع', 12000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ006', '6789012345', null, 'Sarah', 'Al-Qasimi', 'سارة', 'القاسمي', 'sarah.qasimi@almalz.com', '+966506789012', 'Saudi', true, '2021-06-30', 'Quality', 'QA Inspector', 'مفتش ضمان الجودة', 4500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ007', '7890123456', null, 'Abdullah', 'Al-Fahad', 'عبدالله', 'الفهد', 'abdullah.fahad@almalz.com', '+966507890123', 'Saudi', true, '2018-12-05', 'Construction', 'Foreman', 'رئيس عمال', 6000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ008', '8901234567', null, 'Omar', 'Al-Balawi', 'عمر', 'البلوي', 'omar.balawi@almalz.com', '+966509012345', 'Saudi', true, '2019-04-18', 'Safety', 'Safety Officer', 'ضابط أمان', 7000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ009', '9012345678', null, 'Reem', 'Al-Ghamdi', 'ريم', 'الغامدي', 'reem.ghamdi@almalz.com', '+966510123456', 'Saudi', true, '2021-10-25', 'Engineering', 'Architect', 'مهندس معماري', 8000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ010', '0123456789', null, 'Bandar', 'Al-Harthy', 'بندر', 'الحارثي', 'bandar.harthy@almalz.com', '+966519012345', 'Saudi', true, '2020-11-12', 'Operations', 'Warehouse Manager', 'مدير المستودع', 7500.00, 'active'),

-- Non-Saudi Skilled Workers  
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ011', null, '2123456789', 'Muhammad', 'Hassan', 'محمد', 'حسن', 'muhammad.hassan@almalz.com', '+966533456789', 'Pakistani', false, '2020-05-15', 'Construction', 'Steel Fixer', 'حداد تسليح', 3200.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ012', null, '2234567890', 'Ahmed', 'Mohamed', 'أحمد', 'محمد', 'ahmed.mohamed@almalz.com', '+966534567890', 'Egyptian', false, '2019-08-22', 'Construction', 'Tile Installer', 'عامل بلاط', 3000.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ013', null, '2345678901', 'Rajesh', 'Kumar', 'راجيش', 'كومار', 'rajesh.kumar@almalz.com', '+966535678901', 'Indian', false, '2021-01-18', 'Engineering', 'CAD Operator', 'مشغل الكاد', 4500.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ014', null, '2456789012', 'Ali', 'Mansour', 'علي', 'منصور', 'ali.mansour@almalz.com', '+966536789012', 'Syrian', false, '2020-09-30', 'Construction', 'Welder', 'لحام', 3800.00, 'active'),
('a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ015', null, '2567890123', 'Pradeep', 'Singh', 'براديب', 'سينغ', 'pradeep.singh@almalz.com', '+966537890123', 'Indian', false, '2019-12-05', 'Operations', 'Heavy Equipment Operator', 'مشغل معدات ثقيلة', 4200.00, 'active');