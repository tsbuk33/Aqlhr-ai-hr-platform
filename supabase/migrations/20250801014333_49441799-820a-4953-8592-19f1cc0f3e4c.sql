-- Update company information for Almalz
UPDATE public.companies 
SET 
  name = 'Almalz Contracting Company',
  company_name_arabic = 'شركة الملز للمقاولات',
  industry = 'construction',
  business_type = 'contracting',
  employee_count_range = '50-100',
  saudization_percentage = 65.0,
  nitaqat_status = 'green'
WHERE id = 'a0b1c2d3-e4f5-6789-abcd-ef0123456789';

-- Insert 20 key employees first to test
INSERT INTO public.employees (
  id, company_id, employee_number, national_id, iqama_number, 
  first_name, last_name, first_name_ar, last_name_ar,
  email, phone, nationality, is_saudi, hire_date, 
  department, position, position_ar, salary, status
) VALUES 
-- Key Saudi Management & Senior Staff
('emp-001', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ001', '1234567890', null, 'Ahmed', 'Al-Rashid', 'أحمد', 'الراشد', 'ahmed.rashid@almalz.com', '+966501234567', 'Saudi', true, '2020-03-15', 'Construction', 'Site Supervisor', 'مشرف موقع', 8500.00, 'active'),
('emp-002', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ002', '2345678901', null, 'Fatima', 'Al-Zahra', 'فاطمة', 'الزهراء', 'fatima.zahra@almalz.com', '+966502345678', 'Saudi', true, '2021-01-10', 'Administration', 'HR Coordinator', 'منسق الموارد البشرية', 6500.00, 'active'),
('emp-003', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ003', '3456789012', null, 'Mohammed', 'Al-Mutairi', 'محمد', 'المطيري', 'mohammed.mutairi@almalz.com', '+966503456789', 'Saudi', true, '2019-11-22', 'Engineering', 'Civil Engineer', 'مهندس مدني', 9500.00, 'active'),
('emp-004', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ004', '4567890123', null, 'Noura', 'Al-Harbi', 'نورا', 'الحربي', 'noura.harbi@almalz.com', '+966504567890', 'Saudi', true, '2022-02-14', 'Finance', 'Accountant', 'محاسب', 5500.00, 'active'),
('emp-005', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ005', '5678901234', null, 'Khalid', 'Al-Dosari', 'خالد', 'الدوسري', 'khalid.dosari@almalz.com', '+966505678901', 'Saudi', true, '2020-09-01', 'Operations', 'Project Manager', 'مدير مشروع', 12000.00, 'active'),
('emp-006', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ006', '6789012345', null, 'Sarah', 'Al-Qasimi', 'سارة', 'القاسمي', 'sarah.qasimi@almalz.com', '+966506789012', 'Saudi', true, '2021-06-30', 'Quality', 'QA Inspector', 'مفتش ضمان الجودة', 4500.00, 'active'),
('emp-007', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ007', '7890123456', null, 'Abdullah', 'Al-Fahad', 'عبدالله', 'الفهد', 'abdullah.fahad@almalz.com', '+966507890123', 'Saudi', true, '2018-12-05', 'Construction', 'Foreman', 'رئيس عمال', 6000.00, 'active'),
('emp-008', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ008', '8901234567', null, 'Omar', 'Al-Balawi', 'عمر', 'البلوي', 'omar.balawi@almalz.com', '+966509012345', 'Saudi', true, '2019-04-18', 'Safety', 'Safety Officer', 'ضابط أمان', 7000.00, 'active'),
('emp-009', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ009', '9012345678', null, 'Reem', 'Al-Ghamdi', 'ريم', 'الغامدي', 'reem.ghamdi@almalz.com', '+966510123456', 'Saudi', true, '2021-10-25', 'Engineering', 'Architect', 'مهندس معماري', 8000.00, 'active'),
('emp-010', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ010', '0123456789', null, 'Bandar', 'Al-Harthy', 'بندر', 'الحارثي', 'bandar.harthy@almalz.com', '+966519012345', 'Saudi', true, '2020-11-12', 'Operations', 'Warehouse Manager', 'مدير المستودع', 7500.00, 'active'),

-- Key Non-Saudi Skilled Workers  
('emp-011', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ011', null, '2123456789', 'Muhammad', 'Hassan', 'محمد', 'حسن', 'muhammad.hassan@almalz.com', '+966533456789', 'Pakistani', false, '2020-05-15', 'Construction', 'Steel Fixer', 'حداد تسليح', 3200.00, 'active'),
('emp-012', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ012', null, '2234567890', 'Ahmed', 'Mohamed', 'أحمد', 'محمد', 'ahmed.mohamed@almalz.com', '+966534567890', 'Egyptian', false, '2019-08-22', 'Construction', 'Tile Installer', 'عامل بلاط', 3000.00, 'active'),
('emp-013', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ013', null, '2345678901', 'Rajesh', 'Kumar', 'راجيش', 'كومار', 'rajesh.kumar@almalz.com', '+966535678901', 'Indian', false, '2021-01-18', 'Engineering', 'CAD Operator', 'مشغل الكاد', 4500.00, 'active'),
('emp-014', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ014', null, '2456789012', 'Ali', 'Mansour', 'علي', 'منصور', 'ali.mansour@almalz.com', '+966536789012', 'Syrian', false, '2020-09-30', 'Construction', 'Welder', 'لحام', 3800.00, 'active'),
('emp-015', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ015', null, '2567890123', 'Pradeep', 'Singh', 'براديب', 'سينغ', 'pradeep.singh@almalz.com', '+966537890123', 'Indian', false, '2019-12-05', 'Operations', 'Heavy Equipment Operator', 'مشغل معدات ثقيلة', 4200.00, 'active'),
('emp-016', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ016', null, '2678901234', 'Mahmoud', 'Abdel', 'محمود', 'عبدال', 'mahmoud.abdel@almalz.com', '+966538901234', 'Egyptian', false, '2021-06-12', 'Construction', 'Concrete Worker', 'عامل خرسانة', 2800.00, 'active'),
('emp-017', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ017', null, '2789012345', 'Sunil', 'Sharma', 'سونيل', 'شارما', 'sunil.sharma@almalz.com', '+966539012345', 'Indian', false, '2020-02-28', 'Quality', 'Quality Inspector', 'مفتش جودة', 3500.00, 'active'),
('emp-018', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ018', null, '2890123456', 'Hassan', 'Ali', 'حسن', 'علي', 'hassan.ali@almalz.com', '+966540123456', 'Bangladeshi', false, '2022-03-15', 'Construction', 'Helper', 'مساعد', 2500.00, 'active'),
('emp-019', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ019', null, '2901234567', 'Dinesh', 'Patel', 'دينيش', 'باتيل', 'dinesh.patel@almalz.com', '+966541234567', 'Indian', false, '2019-07-08', 'Operations', 'Crane Operator', 'مشغل كرين', 5500.00, 'active'),
('emp-020', 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', 'ALZ020', null, '3012345678', 'Tariq', 'Hussain', 'طارق', 'حسين', 'tariq.hussain@almalz.com', '+966542345678', 'Pakistani', false, '2021-10-22', 'Safety', 'Fire Safety Officer', 'ضابط إطفاء', 4800.00, 'active');