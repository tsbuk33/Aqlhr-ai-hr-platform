-- TASK 3A: SIMPLE EMPLOYEE DATA POPULATION

DO $$ 
DECLARE 
    company_uuid uuid;
BEGIN
    -- Get or create company
    SELECT id INTO company_uuid FROM public.companies LIMIT 1;
    
    IF company_uuid IS NULL THEN
        INSERT INTO public.companies (name, cr_number, industry, size_category, saudization_target) 
        VALUES ('AqlHR Demo Corporation', 'CR700123456789', 'Human Resources Technology', 'Large Enterprise', 75.0)
        RETURNING id INTO company_uuid;
    END IF;

    -- INSERT COMPREHENSIVE EMPLOYEE DATA - only if not exists
    INSERT INTO public.employees (
        company_id, employee_number, first_name, last_name, first_name_ar, last_name_ar,
        email, phone, nationality, is_saudi, department, position, position_ar,
        basic_salary, hire_date, status, gender
    ) 
    SELECT * FROM (VALUES 
        -- Saudi Leadership Team
        (company_uuid, 'AQL001', 'Ahmed', 'Al-Rashid', 'أحمد', 'الراشد',
         'ahmed.alrashid@aqlhr.com', '+966501234567', 'Saudi', true, 'Executive', 'Chief Executive Officer', 'الرئيس التنفيذي',
         50000, '2020-01-15', 'active', 'male'),
         
        (company_uuid, 'AQL002', 'Fatima', 'Al-Zahra', 'فاطمة', 'الزهراء',
         'fatima.alzahra@aqlhr.com', '+966501234568', 'Saudi', true, 'Human Resources', 'Chief Human Resources Officer', 'مدير الموارد البشرية التنفيذي',
         35000, '2020-03-20', 'active', 'female'),

        -- Tech Team
        (company_uuid, 'AQL003', 'Mohammed', 'Al-Otaibi', 'محمد', 'العتيبي',
         'mohammed.alotaibi@aqlhr.com', '+966501234569', 'Saudi', true, 'Information Technology', 'Chief Technology Officer', 'مدير التكنولوجيا التنفيذي',
         45000, '2019-09-10', 'active', 'male'),

        -- Middle Management
        (company_uuid, 'AQL004', 'Sarah', 'Al-Mansouri', 'سارة', 'المنصوري',
         'sarah.almansouri@aqlhr.com', '+966501234570', 'Saudi', true, 'Marketing', 'Marketing Director', 'مدير التسويق',
         25000, '2021-02-01', 'active', 'female'),

        (company_uuid, 'AQL005', 'Omar', 'Al-Ghamdi', 'عمر', 'الغامدي',
         'omar.alghamdi@aqlhr.com', '+966501234571', 'Saudi', true, 'Operations', 'Operations Director', 'مدير العمليات',
         28000, '2020-09-15', 'active', 'male'),

        -- International Team
        (company_uuid, 'AQL006', 'Aisha', 'Khan', 'عائشة', 'خان',
         'aisha.khan@aqlhr.com', '+966501234572', 'Pakistani', false, 'Human Resources', 'Senior HR Specialist', 'أخصائي موارد بشرية أول',
         15000, '2022-08-01', 'active', 'female'),

        (company_uuid, 'AQL007', 'Ravi', 'Sharma', 'رافي', 'شارما',
         'ravi.sharma@aqlhr.com', '+966501234573', 'Indian', false, 'Information Technology', 'Senior Software Engineer', 'مهندس برمجيات أول',
         22000, '2021-11-15', 'active', 'male'),

        -- Junior Team
        (company_uuid, 'AQL008', 'Noor', 'Al-Harbi', 'نور', 'الحربي',
         'noor.alharbi@aqlhr.com', '+966501234574', 'Saudi', true, 'Finance', 'Financial Analyst', 'محلل مالي',
         12000, '2023-01-10', 'active', 'female'),

        (company_uuid, 'AQL009', 'Khalid', 'Al-Dosari', 'خالد', 'الدوسري',
         'khalid.aldosari@aqlhr.com', '+966501234575', 'Saudi', true, 'Sales', 'Sales Representative', 'مندوب مبيعات',
         10000, '2023-06-01', 'active', 'male'),

        (company_uuid, 'AQL010', 'Layla', 'Al-Najjar', 'ليلى', 'النجار',
         'layla.alnajjar@aqlhr.com', '+966501234576', 'Saudi', true, 'Customer Service', 'Customer Success Specialist', 'أخصائي نجاح العملاء',
         9000, '2023-09-01', 'active', 'female')
    ) AS t(company_id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, nationality, is_saudi, department, position, position_ar, basic_salary, hire_date, status, gender)
    WHERE NOT EXISTS (
        SELECT 1 FROM public.employees WHERE employee_number = t.employee_number
    );

END $$;