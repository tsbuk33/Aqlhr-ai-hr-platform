-- Create companies table for proper tenant management
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    name_ar text,
    industry text,
    size_category text DEFAULT 'small',
    country text DEFAULT 'SA',
    city text,
    founded_year integer,
    logo_url text,
    website text,
    description text,
    description_ar text,
    settings jsonb DEFAULT '{}',
    is_demo boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for companies
CREATE POLICY "Users can view their company"
ON public.companies FOR SELECT
USING (id = get_user_company_id());

CREATE POLICY "Owners can manage their company"
ON public.companies FOR ALL
USING (
    id = get_user_company_id() AND 
    has_role(auth.uid(), 'owner')
)
WITH CHECK (
    id = get_user_company_id() AND 
    has_role(auth.uid(), 'owner')
);

-- Update profiles to reference companies table properly
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_company 
FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- Create demo company setup function
CREATE OR REPLACE FUNCTION public.setup_demo_company(
    p_company_name text DEFAULT 'Demo Company',
    p_user_id uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id uuid;
    v_demo_employees integer;
BEGIN
    -- Create demo company
    INSERT INTO public.companies (
        name,
        name_ar,
        industry,
        size_category,
        country,
        city,
        description,
        description_ar,
        is_demo,
        settings
    ) VALUES (
        p_company_name,
        'شركة تجريبية',
        'technology',
        'medium',
        'SA',
        'Riyadh',
        'Demo company for testing AqlHR platform features',
        'شركة تجريبية لاختبار ميزات منصة عقل للموارد البشرية',
        true,
        jsonb_build_object(
            'demo_mode', true,
            'auto_seed', true,
            'sample_data_version', '1.0'
        )
    ) RETURNING id INTO v_company_id;

    -- Update user profile with company
    UPDATE public.profiles 
    SET 
        company_id = v_company_id,
        role = 'owner',
        department = 'Executive',
        is_active = true
    WHERE user_id = p_user_id;

    -- Create demo departments
    INSERT INTO public.hr_departments (company_id, name_en, name_ar, is_active) VALUES
    (v_company_id, 'Human Resources', 'الموارد البشرية', true),
    (v_company_id, 'Engineering', 'الهندسة', true),
    (v_company_id, 'Sales & Marketing', 'المبيعات والتسويق', true),
    (v_company_id, 'Finance & Accounting', 'المالية والمحاسبة', true),
    (v_company_id, 'Operations', 'العمليات', true)
    ON CONFLICT DO NOTHING;

    -- Create sample employees
    WITH demo_employees AS (
        SELECT 
            v_company_id as company_id,
            'EMP' || LPAD((ROW_NUMBER() OVER())::text, 4, '0') as employee_no,
            names.name_en,
            names.name_ar,
            names.email,
            names.dept,
            names.position,
            names.is_saudi,
            names.salary
        FROM (VALUES
            ('Ahmed Al-Rashid', 'أحمد الراشد', 'ahmed.rashid@demo.com', 'Engineering', 'Senior Software Engineer', true, 12000),
            ('Sarah Johnson', 'سارة جونسون', 'sarah.johnson@demo.com', 'Human Resources', 'HR Manager', false, 15000),
            ('Omar Al-Mahmoud', 'عمر المحمود', 'omar.mahmoud@demo.com', 'Sales & Marketing', 'Sales Director', true, 18000),
            ('Fatima Al-Zahra', 'فاطمة الزهراء', 'fatima.zahra@demo.com', 'Finance & Accounting', 'Financial Analyst', true, 10000),
            ('Mohammed Al-Harbi', 'محمد الحربي', 'mohammed.harbi@demo.com', 'Operations', 'Operations Manager', true, 14000),
            ('Lisa Chen', 'ليزا تشين', 'lisa.chen@demo.com', 'Engineering', 'Product Manager', false, 16000),
            ('Khalid Al-Otaibi', 'خالد العتيبي', 'khalid.otaibi@demo.com', 'Engineering', 'DevOps Engineer', true, 11000),
            ('Aisha Al-Mansouri', 'عائشة المنصوري', 'aisha.mansouri@demo.com', 'Human Resources', 'HR Specialist', true, 8000)
        ) AS names(name_en, name_ar, email, dept, position, is_saudi, salary)
    )
    INSERT INTO public.hr_employees (
        company_id, 
        employee_no, 
        full_name_en, 
        full_name_ar,
        email,
        dept_id,
        position_en,
        position_ar,
        is_saudi,
        basic_salary,
        employment_status,
        hire_date,
        nationality,
        nationality_group
    )
    SELECT 
        de.company_id,
        de.employee_no,
        de.name_en,
        de.name_ar,
        de.email,
        d.id,
        de.position,
        de.position,
        de.is_saudi,
        de.salary,
        'active',
        CURRENT_DATE - (random() * 730)::int,
        CASE WHEN de.is_saudi THEN 'Saudi' ELSE 'Other' END,
        CASE WHEN de.is_saudi THEN 'saudi' ELSE 'non_saudi' END
    FROM demo_employees de
    LEFT JOIN public.hr_departments d ON d.company_id = de.company_id AND d.name_en = de.dept;

    -- Generate sample KPI snapshots for the last 30 days
    INSERT INTO public.kpi_snapshots (
        company_id,
        snap_date,
        total_employees,
        saudization_rate,
        active_users,
        compliance_score,
        employee_experience_10
    )
    SELECT 
        v_company_id,
        CURRENT_DATE - s.days,
        8 + (random() * 2)::int,
        65.0 + (random() * 10),
        6 + (random() * 3)::int,
        85.0 + (random() * 10),
        7.5 + (random() * 1.5)
    FROM generate_series(0, 29) s(days);

    RETURN v_company_id;
END;
$$;

-- Create company onboarding function
CREATE OR REPLACE FUNCTION public.create_company_onboarding(
    p_company_name text,
    p_industry text DEFAULT 'other',
    p_size_category text DEFAULT 'small',
    p_user_id uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id uuid;
BEGIN
    -- Create company
    INSERT INTO public.companies (
        name,
        industry,
        size_category,
        country,
        is_demo,
        settings
    ) VALUES (
        p_company_name,
        p_industry,
        p_size_category,
        'SA',
        false,
        jsonb_build_object(
            'onboarding_completed', false,
            'setup_step', 'company_info'
        )
    ) RETURNING id INTO v_company_id;

    -- Update user profile with company and owner role
    UPDATE public.profiles 
    SET 
        company_id = v_company_id,
        role = 'owner',
        is_active = true
    WHERE user_id = p_user_id;

    -- Create initial departments
    INSERT INTO public.hr_departments (company_id, name_en, name_ar, is_active) VALUES
    (v_company_id, 'Management', 'الإدارة', true),
    (v_company_id, 'Human Resources', 'الموارد البشرية', true)
    ON CONFLICT DO NOTHING;

    RETURN v_company_id;
END;
$$;

-- Create function to get company setup status
CREATE OR REPLACE FUNCTION public.get_company_setup_status(p_company_id uuid DEFAULT NULL)
RETURNS TABLE(
    company_id uuid,
    company_name text,
    is_demo boolean,
    setup_completed boolean,
    current_step text,
    employees_count bigint,
    departments_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id uuid;
BEGIN
    v_company_id := COALESCE(p_company_id, get_user_company_id());
    
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.is_demo,
        COALESCE((c.settings->>'onboarding_completed')::boolean, c.is_demo),
        COALESCE(c.settings->>'setup_step', 'completed'),
        COALESCE(emp_count.count, 0),
        COALESCE(dept_count.count, 0)
    FROM public.companies c
    LEFT JOIN (
        SELECT company_id, COUNT(*) as count 
        FROM public.hr_employees 
        WHERE company_id = v_company_id
        GROUP BY company_id
    ) emp_count ON emp_count.company_id = c.id
    LEFT JOIN (
        SELECT company_id, COUNT(*) as count 
        FROM public.hr_departments 
        WHERE company_id = v_company_id
        GROUP BY company_id
    ) dept_count ON dept_count.company_id = c.id
    WHERE c.id = v_company_id;
END;
$$;