-- Insert sample employee data for testing skills intelligence position dropdowns
INSERT INTO public.employees (
  employee_number,
  first_name,
  last_name,
  first_name_ar,
  last_name_ar,
  position,
  position_ar,
  actual_job_title,
  actual_job_title_ar,
  company_job_title,
  company_job_title_ar,
  department,
  status,
  is_saudi,
  salary,
  basic_salary
) VALUES 
-- Engineering Positions
('EMP001', 'Ahmed', 'Al-Rashid', 'أحمد', 'الراشد', 'Software Engineer', 'مهندس برمجيات', 'Senior Software Engineer', 'مهندس برمجيات أول', 'Software Developer', 'مطور برمجيات', 'Technology', 'active', true, 12000, 10000),
('EMP002', 'Sara', 'Al-Zahra', 'سارة', 'الزهراء', 'Software Engineer', 'مهندس برمجيات', 'Software Engineer II', 'مهندس برمجيات ثاني', 'Application Developer', 'مطور تطبيقات', 'Technology', 'active', true, 8000, 7000),
('EMP003', 'Mohammad', 'Al-Faisal', 'محمد', 'الفيصل', 'Systems Architect', 'مهندس أنظمة', 'Senior Systems Architect', 'مهندس أنظمة أول', 'Technical Architect', 'مهندس تقني', 'Technology', 'active', true, 18000, 15000),

-- HR Positions  
('EMP004', 'Fatima', 'Al-Noor', 'فاطمة', 'النور', 'HR Manager', 'مدير الموارد البشرية', 'Senior HR Manager', 'مدير الموارد البشرية الأول', 'People Manager', 'مدير الأشخاص', 'Human Resources', 'active', true, 15000, 12000),
('EMP005', 'Omar', 'Al-Mansouri', 'عمر', 'المنصوري', 'HR Specialist', 'أخصائي موارد بشرية', 'HR Business Partner', 'شريك أعمال الموارد البشرية', 'Talent Specialist', 'أخصائي مواهب', 'Human Resources', 'active', true, 9000, 8000),
('EMP006', 'Nora', 'Al-Qasimi', 'نورا', 'القاسمي', 'Recruiter', 'مسؤول توظيف', 'Senior Recruiter', 'مسؤول توظيف أول', 'Talent Acquisition', 'اكتساب المواهب', 'Human Resources', 'active', true, 7000, 6000),

-- Finance Positions
('EMP007', 'Khalid', 'Al-Otaibi', 'خالد', 'العتيبي', 'Financial Analyst', 'محلل مالي', 'Senior Financial Analyst', 'محلل مالي أول', 'Finance Specialist', 'أخصائي مالي', 'Finance', 'active', true, 11000, 9000),
('EMP008', 'Aisha', 'Al-Dosari', 'عائشة', 'الدوسري', 'Accountant', 'محاسب', 'Senior Accountant', 'محاسب أول', 'Financial Officer', 'مسؤول مالي', 'Finance', 'active', true, 8500, 7500),

-- Operations Positions
('EMP009', 'Saud', 'Al-Harbi', 'سعود', 'الحربي', 'Operations Manager', 'مدير العمليات', 'Senior Operations Manager', 'مدير العمليات الأول', 'Process Manager', 'مدير العمليات', 'Operations', 'active', true, 16000, 13000),
('EMP010', 'Maryam', 'Al-Shehri', 'مريم', 'الشهري', 'Quality Analyst', 'محلل جودة', 'Quality Assurance Specialist', 'أخصائي ضمان الجودة', 'QA Engineer', 'مهندس ضمان الجودة', 'Operations', 'active', true, 9500, 8500),

-- Sales & Marketing Positions
('EMP011', 'Abdulaziz', 'Al-Ghamdi', 'عبدالعزيز', 'الغامدي', 'Sales Manager', 'مدير مبيعات', 'Regional Sales Manager', 'مدير مبيعات إقليمي', 'Business Development Manager', 'مدير تطوير الأعمال', 'Sales', 'active', true, 14000, 11000),
('EMP012', 'Lina', 'Al-Mutairi', 'لينا', 'المطيري', 'Marketing Specialist', 'أخصائي تسويق', 'Digital Marketing Specialist', 'أخصائي تسويق رقمي', 'Brand Manager', 'مدير العلامة التجارية', 'Marketing', 'active', true, 8000, 7000),

-- Customer Service Positions
('EMP013', 'Turki', 'Al-Rasheed', 'تركي', 'الرشيد', 'Customer Service Manager', 'مدير خدمة العملاء', 'Customer Experience Manager', 'مدير تجربة العملاء', 'Support Manager', 'مدير الدعم', 'Customer Service', 'active', true, 10000, 8500),
('EMP014', 'Hala', 'Al-Farhan', 'هالة', 'الفرحان', 'Customer Support Specialist', 'أخصائي دعم العملاء', 'Customer Success Specialist', 'أخصائي نجاح العملاء', 'Client Relations', 'علاقات العملاء', 'Customer Service', 'active', true, 6500, 5500),

-- Administrative Positions
('EMP015', 'Faisal', 'Al-Ajmi', 'فيصل', 'العجمي', 'Administrative Manager', 'مدير إداري', 'Office Manager', 'مدير المكتب', 'Operations Coordinator', 'منسق العمليات', 'Administration', 'active', true, 9000, 7500),
('EMP016', 'Nouf', 'Al-Sulaiman', 'نوف', 'السليمان', 'Executive Assistant', 'مساعد تنفيذي', 'Senior Executive Assistant', 'مساعد تنفيذي أول', 'Administrative Specialist', 'أخصائي إداري', 'Administration', 'active', true, 7000, 6000),

-- Data & Analytics Positions
('EMP017', 'Hamad', 'Al-Thani', 'حمد', 'الثاني', 'Data Analyst', 'محلل البيانات', 'Senior Data Analyst', 'محلل بيانات أول', 'Business Intelligence Analyst', 'محلل ذكاء الأعمال', 'Analytics', 'active', true, 12000, 10000),
('EMP018', 'Reem', 'Al-Kaabi', 'ريم', 'الكعبي', 'Data Scientist', 'عالم البيانات', 'Machine Learning Engineer', 'مهندس التعلم الآلي', 'AI Specialist', 'أخصائي ذكاء اصطناعي', 'Analytics', 'active', true, 16000, 14000),

-- Project Management Positions
('EMP019', 'Bandar', 'Al-Saud', 'بندر', 'السعود', 'Project Manager', 'مدير مشروع', 'Senior Project Manager', 'مدير مشروع أول', 'Program Manager', 'مدير برنامج', 'Project Management', 'active', true, 13000, 11000),
('EMP020', 'Lama', 'Al-Johani', 'لمى', 'الجهني', 'Scrum Master', 'ماستر سكرم', 'Agile Coach', 'مدرب أجايل', 'Project Coordinator', 'منسق مشروع', 'Project Management', 'active', true, 10000, 8500);