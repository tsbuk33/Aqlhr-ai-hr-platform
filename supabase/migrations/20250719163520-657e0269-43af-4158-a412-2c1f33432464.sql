-- TASK 3A: COMPREHENSIVE EMPLOYEE DATA POPULATION (Fixed)

DO $$ 
DECLARE 
    company_uuid uuid;
    emp_id_1 uuid := gen_random_uuid();
    emp_id_2 uuid := gen_random_uuid();
    emp_id_3 uuid := gen_random_uuid();
    emp_id_4 uuid := gen_random_uuid();
    emp_id_5 uuid := gen_random_uuid();
    emp_id_6 uuid := gen_random_uuid();
    emp_id_7 uuid := gen_random_uuid();
    emp_id_8 uuid := gen_random_uuid();
    emp_id_9 uuid := gen_random_uuid();
    emp_id_10 uuid := gen_random_uuid();
BEGIN
    -- Get or create company
    SELECT id INTO company_uuid FROM public.companies LIMIT 1;
    
    IF company_uuid IS NULL THEN
        INSERT INTO public.companies (name, cr_number, industry, size_category, saudization_target) 
        VALUES ('AqlHR Demo Corporation', 'CR700123456789', 'Human Resources Technology', 'Large Enterprise', 75.0)
        RETURNING id INTO company_uuid;
    END IF;

    -- Clear existing employees to avoid duplicates
    DELETE FROM public.employees WHERE company_id = company_uuid;

    -- INSERT COMPREHENSIVE EMPLOYEE DATA with correct column names
    INSERT INTO public.employees (
        id, company_id, employee_number, first_name, last_name, first_name_ar, last_name_ar,
        email, phone, nationality, is_saudi, department, position, position_ar,
        basic_salary, housing_allowance_percentage, transportation_allowance_percentage,
        hire_date, status, gender, job_level, experience_years,
        company_housing, company_provides_transportation, company_sim_card,
        parents_medical_insurance, vacation_days_per_year, overtime_eligible,
        national_id, iqama_number, passport_number, education_level, certificates,
        actual_job_title, actual_job_title_ar, company_job_title, company_job_title_ar,
        work_location, work_location_ar, project_name, project_name_ar
    ) VALUES 
        -- Saudi Leadership Team
        (emp_id_1, company_uuid, 'AQL001', 'Ahmed', 'Al-Rashid', 'أحمد', 'الراشد',
         'ahmed.alrashid@aqlhr.com', '+966501234567', 'Saudi', true, 'Executive', 'Chief Executive Officer', 'الرئيس التنفيذي',
         50000, 0, 0, '2020-01-15', 'active', 'male', 'Executive', 12,
         true, true, true, true, 30, false,
         '1234567890', null, 'G12345678', 'MBA', 'Executive Leadership, Strategic Management',
         'Chief Executive Officer', 'الرئيس التنفيذي', 'CEO', 'الرئيس التنفيذي',
         'Riyadh HQ', 'الرياض - المكتب الرئيسي', 'Strategic Leadership', 'القيادة الاستراتيجية'),
         
        (emp_id_2, company_uuid, 'AQL002', 'Fatima', 'Al-Zahra', 'فاطمة', 'الزهراء',
         'fatima.alzahra@aqlhr.com', '+966501234568', 'Saudi', true, 'Human Resources', 'Chief Human Resources Officer', 'مدير الموارد البشرية التنفيذي',
         35000, 25, 10, '2020-03-20', 'active', 'female', 'Executive', 10,
         false, false, true, true, 30, false,
         '1234567891', null, 'G12345679', 'Masters in HR', 'SHRM-SCP, CIPD Fellow',
         'Chief Human Resources Officer', 'مدير الموارد البشرية التنفيذي', 'CHRO', 'مدير الموارد البشرية التنفيذي',
         'Riyadh HQ', 'الرياض - المكتب الرئيسي', 'HR Transformation', 'تحول الموارد البشرية'),

        -- Tech Team
        (emp_id_3, company_uuid, 'AQL003', 'Mohammed', 'Al-Otaibi', 'محمد', 'العتيبي',
         'mohammed.alotaibi@aqlhr.com', '+966501234569', 'Saudi', true, 'Information Technology', 'Chief Technology Officer', 'مدير التكنولوجيا التنفيذي',
         45000, 20, 8, '2019-09-10', 'active', 'male', 'Executive', 15,
         false, false, true, false, 25, true,
         '1234567892', null, 'G12345680', 'PhD Computer Science', 'AWS Solutions Architect, Google Cloud Professional',
         'Chief Technology Officer', 'مدير التكنولوجيا التنفيذي', 'CTO', 'مدير التكنولوجيا التنفيذي',
         'Riyadh Tech Hub', 'الرياض - مركز التكنولوجيا', 'AI Platform Development', 'تطوير منصة الذكاء الاصطناعي'),

        -- Middle Management
        (emp_id_4, company_uuid, 'AQL004', 'Sarah', 'Al-Mansouri', 'سارة', 'المنصوري',
         'sarah.almansouri@aqlhr.com', '+966501234570', 'Saudi', true, 'Marketing', 'Marketing Director', 'مدير التسويق',
         25000, 25, 10, '2021-02-01', 'active', 'female', 'Senior', 8,
         false, false, true, true, 25, false,
         '1234567893', null, 'G12345681', 'Masters in Marketing', 'Google Ads Certified, HubSpot Certified',
         'Marketing Director', 'مدير التسويق', 'Marketing Director', 'مدير التسويق',
         'Jeddah Office', 'جدة - المكتب', 'Brand Development', 'تطوير العلامة التجارية'),

        (emp_id_5, company_uuid, 'AQL005', 'Omar', 'Al-Ghamdi', 'عمر', 'الغامدي',
         'omar.alghamdi@aqlhr.com', '+966501234571', 'Saudi', true, 'Operations', 'Operations Director', 'مدير العمليات',
         28000, 20, 10, '2020-09-15', 'active', 'male', 'Senior', 9,
         false, false, true, false, 25, true,
         '1234567894', null, 'G12345682', 'MBA Operations', 'PMP, Lean Six Sigma Black Belt',
         'Operations Director', 'مدير العمليات', 'Operations Director', 'مدير العمليات',
         'Dammam Office', 'الدمام - المكتب', 'Process Excellence', 'التميز في العمليات'),

        -- International Team
        (emp_id_6, company_uuid, 'AQL006', 'Aisha', 'Khan', 'عائشة', 'خان',
         'aisha.khan@aqlhr.com', '+966501234572', 'Pakistani', false, 'Human Resources', 'Senior HR Specialist', 'أخصائي موارد بشرية أول',
         15000, 25, 10, '2022-08-01', 'active', 'female', 'Senior', 6,
         false, false, true, true, 25, false,
         null, '2345678901', 'AB1234567', 'Masters in Psychology', 'CIPD Level 7, PHR',
         'Senior HR Specialist', 'أخصائي موارد بشرية أول', 'Senior HR Specialist', 'أخصائي موارد بشرية أول',
         'Riyadh HQ', 'الرياض - المكتب الرئيسي', 'Talent Management', 'إدارة المواهب'),

        (emp_id_7, company_uuid, 'AQL007', 'Ravi', 'Sharma', 'رافي', 'شارما',
         'ravi.sharma@aqlhr.com', '+966501234573', 'Indian', false, 'Information Technology', 'Senior Software Engineer', 'مهندس برمجيات أول',
         22000, 25, 10, '2021-11-15', 'active', 'male', 'Senior', 7,
         false, false, true, false, 25, true,
         null, '2345678902', 'CD1234568', 'B.Tech Computer Science', 'AWS Developer, React Certified',
         'Senior Software Engineer', 'مهندس برمجيات أول', 'Senior Software Engineer', 'مهندس برمجيات أول',
         'Riyadh Tech Hub', 'الرياض - مركز التكنولوجيا', 'Mobile Application Development', 'تطوير التطبيقات المحمولة'),

        -- Junior Team
        (emp_id_8, company_uuid, 'AQL008', 'Noor', 'Al-Harbi', 'نور', 'الحربي',
         'noor.alharbi@aqlhr.com', '+966501234574', 'Saudi', true, 'Finance', 'Financial Analyst', 'محلل مالي',
         12000, 25, 10, '2023-01-10', 'active', 'female', 'Mid-Level', 3,
         false, false, true, true, 21, false,
         '1234567895', null, 'G12345683', 'Bachelor Finance', 'CFA Level 1, Excel Advanced',
         'Financial Analyst', 'محلل مالي', 'Financial Analyst', 'محلل مالي',
         'Riyadh HQ', 'الرياض - المكتب الرئيسي', 'Financial Planning', 'التخطيط المالي'),

        (emp_id_9, company_uuid, 'AQL009', 'Khalid', 'Al-Dosari', 'خالد', 'الدوسري',
         'khalid.aldosari@aqlhr.com', '+966501234575', 'Saudi', true, 'Sales', 'Sales Representative', 'مندوب مبيعات',
         10000, 25, 10, '2023-06-01', 'active', 'male', 'Entry', 2,
         false, false, true, false, 21, false,
         '1234567896', null, 'G12345684', 'Bachelor Business', 'Salesforce Certified',
         'Sales Representative', 'مندوب مبيعات', 'Sales Representative', 'مندوب مبيعات',
         'Jeddah Office', 'جدة - المكتب', 'Client Acquisition', 'اكتساب العملاء'),

        (emp_id_10, company_uuid, 'AQL010', 'Layla', 'Al-Najjar', 'ليلى', 'النجار',
         'layla.alnajjar@aqlhr.com', '+966501234576', 'Saudi', true, 'Customer Service', 'Customer Success Specialist', 'أخصائي نجاح العملاء',
         9000, 25, 10, '2023-09-01', 'active', 'female', 'Entry', 1,
         false, false, true, true, 21, false,
         '1234567897', null, 'G12345685', 'Bachelor Communications', 'Customer Service Excellence',
         'Customer Success Specialist', 'أخصائي نجاح العملاء', 'Customer Success Specialist', 'أخصائي نجاح العملاء',
         'Riyadh HQ', 'الرياض - المكتب الرئيسي', 'Customer Experience', 'تجربة العملاء');

END $$;