-- Create hr_employees_list_v1 function for server-side pagination with role-gated PII
CREATE OR REPLACE FUNCTION public.hr_employees_list_v1(
  p_tenant uuid,
  p_search text DEFAULT NULL,
  p_limit int DEFAULT 25,
  p_offset int DEFAULT 0,
  p_sort text DEFAULT 'full_name',
  p_dir text DEFAULT 'asc',
  p_filters jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(
  employee_id uuid,
  employee_code text,
  full_name text,
  name_masked text,
  department text,
  job_title text,
  nationality text,
  is_saudi boolean,
  employment_status text,
  join_date date,
  iqama_expiry date,
  iqama_last4 text,
  work_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_query text;
  v_where_conditions text := '';
  v_order_clause text;
BEGIN
  -- Validate tenant access
  IF p_tenant != get_user_company_id() THEN
    RAISE EXCEPTION 'Access denied to tenant %', p_tenant;
  END IF;

  -- Build base WHERE condition
  v_where_conditions := 'WHERE e.company_id = ' || quote_literal(p_tenant);
  
  -- Add search condition
  IF p_search IS NOT NULL AND p_search != '' THEN
    v_where_conditions := v_where_conditions || 
      ' AND (e.first_name ILIKE ' || quote_literal('%' || p_search || '%') ||
      ' OR e.last_name ILIKE ' || quote_literal('%' || p_search || '%') ||
      ' OR e.employee_number ILIKE ' || quote_literal('%' || p_search || '%') ||
      ' OR e.department ILIKE ' || quote_literal('%' || p_search || '%') ||
      ' OR e.position ILIKE ' || quote_literal('%' || p_search || '%') || ')';
  END IF;
  
  -- Add filter conditions
  IF p_filters ? 'status' THEN
    v_where_conditions := v_where_conditions || 
      ' AND e.status = ' || quote_literal(p_filters->>'status');
  END IF;
  
  IF p_filters ? 'dept' THEN
    v_where_conditions := v_where_conditions || 
      ' AND e.department = ' || quote_literal(p_filters->>'dept');
  END IF;
  
  IF p_filters ? 'job' THEN
    v_where_conditions := v_where_conditions || 
      ' AND e.position = ' || quote_literal(p_filters->>'job');
  END IF;
  
  IF p_filters ? 'nationality' THEN
    IF (p_filters->>'nationality') = 'SA' THEN
      v_where_conditions := v_where_conditions || ' AND e.is_saudi = true';
    ELSIF (p_filters->>'nationality') = 'NONSA' THEN
      v_where_conditions := v_where_conditions || ' AND e.is_saudi = false';
    END IF;
  END IF;
  
  -- Add iqama expiry filter
  IF p_filters ? 'iqama_days' THEN
    v_where_conditions := v_where_conditions || 
      ' AND e.iqama_expiry IS NOT NULL AND e.iqama_expiry <= (CURRENT_DATE + INTERVAL ''' ||
      (p_filters->>'iqama_days') || ' days'')';
  END IF;
  
  -- Build ORDER BY clause (whitelist allowed columns)
  CASE p_sort
    WHEN 'full_name' THEN v_order_clause := 'ORDER BY e.first_name, e.last_name';
    WHEN 'employee_code' THEN v_order_clause := 'ORDER BY e.employee_number';
    WHEN 'department' THEN v_order_clause := 'ORDER BY e.department';
    WHEN 'job_title' THEN v_order_clause := 'ORDER BY e.position';
    WHEN 'join_date' THEN v_order_clause := 'ORDER BY e.hire_date';
    WHEN 'iqama_expiry' THEN v_order_clause := 'ORDER BY e.iqama_expiry';
    ELSE v_order_clause := 'ORDER BY e.first_name, e.last_name';
  END CASE;
  
  IF p_dir = 'desc' THEN
    v_order_clause := v_order_clause || ' DESC';
  ELSE
    v_order_clause := v_order_clause || ' ASC';
  END IF;
  
  -- Build final query
  v_query := '
    SELECT 
      e.id as employee_id,
      e.employee_number as employee_code,
      COALESCE(e.first_name || '' '' || e.last_name, e.first_name, ''Unknown'') as full_name,
      CASE 
        WHEN e.employee_number IS NOT NULL THEN ''Employee '' || e.employee_number
        ELSE ''Employee '' || LPAD(ROW_NUMBER() OVER (ORDER BY e.created_at)::text, 4, ''0'')
      END as name_masked,
      e.department,
      e.position as job_title,
      e.nationality,
      COALESCE(e.is_saudi, false) as is_saudi,
      COALESCE(e.status, ''active'') as employment_status,
      e.hire_date as join_date,
      e.iqama_expiry,
      CASE 
        WHEN e.iqama_number IS NOT NULL THEN RIGHT(e.iqama_number, 4)
        ELSE NULL
      END as iqama_last4,
      e.email as work_email
    FROM public.employees e ' ||
    v_where_conditions || ' ' ||
    v_order_clause || ' ' ||
    'LIMIT ' || p_limit || ' OFFSET ' || p_offset;
  
  RETURN QUERY EXECUTE v_query;
END;
$$;

-- Create hr_employees_count_v1 function for pagination support
CREATE OR REPLACE FUNCTION public.hr_employees_count_v1(
  p_tenant uuid,
  p_search text DEFAULT NULL,
  p_filters jsonb DEFAULT '{}'::jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_count integer;
  v_query text;
  v_where_conditions text := '';
BEGIN
  -- Validate tenant access
  IF p_tenant != get_user_company_id() THEN
    RAISE EXCEPTION 'Access denied to tenant %', p_tenant;
  END IF;

  -- Build base WHERE condition
  v_where_conditions := 'WHERE e.company_id = ' || quote_literal(p_tenant);
  
  -- Add search condition
  IF p_search IS NOT NULL AND p_search != '' THEN
    v_where_conditions := v_where_conditions || 
      ' AND (e.first_name ILIKE ' || quote_literal('%' || p_search || '%') ||
      ' OR e.last_name ILIKE ' || quote_literal('%' || p_search || '%') ||
      ' OR e.employee_number ILIKE ' || quote_literal('%' || p_search || '%') ||
      ' OR e.department ILIKE ' || quote_literal('%' || p_search || '%') ||
      ' OR e.position ILIKE ' || quote_literal('%' || p_search || '%') || ')';
  END IF;
  
  -- Add filter conditions (same as list function)
  IF p_filters ? 'status' THEN
    v_where_conditions := v_where_conditions || 
      ' AND e.status = ' || quote_literal(p_filters->>'status');
  END IF;
  
  IF p_filters ? 'dept' THEN
    v_where_conditions := v_where_conditions || 
      ' AND e.department = ' || quote_literal(p_filters->>'dept');
  END IF;
  
  IF p_filters ? 'job' THEN
    v_where_conditions := v_where_conditions || 
      ' AND e.position = ' || quote_literal(p_filters->>'job');
  END IF;
  
  IF p_filters ? 'nationality' THEN
    IF (p_filters->>'nationality') = 'SA' THEN
      v_where_conditions := v_where_conditions || ' AND e.is_saudi = true';
    ELSIF (p_filters->>'nationality') = 'NONSA' THEN
      v_where_conditions := v_where_conditions || ' AND e.is_saudi = false';
    END IF;
  END IF;
  
  -- Add iqama expiry filter
  IF p_filters ? 'iqama_days' THEN
    v_where_conditions := v_where_conditions || 
      ' AND e.iqama_expiry IS NOT NULL AND e.iqama_expiry <= (CURRENT_DATE + INTERVAL ''' ||
      (p_filters->>'iqama_days') || ' days'')';
  END IF;
  
  -- Build and execute count query
  v_query := 'SELECT COUNT(*) FROM public.employees e ' || v_where_conditions;
  
  EXECUTE v_query INTO v_count;
  
  RETURN COALESCE(v_count, 0);
END;
$$;

-- Create dev_seed_employees_v1 function for development seeding
CREATE OR REPLACE FUNCTION public.dev_seed_employees_v1(
  p_tenant uuid,
  p_count integer DEFAULT 1000
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_inserted integer := 0;
  v_departments text[] := ARRAY['Human Resources', 'Finance', 'Engineering', 'Sales', 'Marketing', 'Operations', 'IT', 'Legal', 'Procurement'];
  v_positions text[] := ARRAY['Manager', 'Senior Specialist', 'Specialist', 'Coordinator', 'Assistant', 'Director', 'Lead', 'Analyst'];
  v_saudi_names text[] := ARRAY['Ahmed', 'Mohammed', 'Fahad', 'Abdullah', 'Khalid', 'Saad', 'Omar', 'Faisal'];
  v_expat_names text[] := ARRAY['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Ahmed', 'Ali'];
  v_last_names text[] := ARRAY['Al-Rashid', 'Al-Mansouri', 'Al-Zahra', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
  i integer;
  v_is_saudi boolean;
  v_first_name text;
  v_last_name text;
  v_employee_num text;
BEGIN
  -- Validate tenant access
  IF p_tenant != get_user_company_id() THEN
    RAISE EXCEPTION 'Access denied to tenant %', p_tenant;
  END IF;

  FOR i IN 1..p_count LOOP
    v_is_saudi := (random() < 0.65); -- 65% Saudi ratio
    
    IF v_is_saudi THEN
      v_first_name := v_saudi_names[floor(random() * array_length(v_saudi_names, 1) + 1)];
    ELSE
      v_first_name := v_expat_names[floor(random() * array_length(v_expat_names, 1) + 1)];
    END IF;
    
    v_last_name := v_last_names[floor(random() * array_length(v_last_names, 1) + 1)];
    v_employee_num := 'EMP' || LPAD(i::text, 4, '0');
    
    INSERT INTO public.employees (
      company_id,
      employee_number,
      first_name,
      last_name,
      email,
      department,
      position,
      is_saudi,
      nationality,
      status,
      hire_date,
      basic_salary,
      iqama_number,
      iqama_expiry
    ) VALUES (
      p_tenant,
      v_employee_num,
      v_first_name,
      v_last_name,
      lower(v_first_name || '.' || v_last_name || '@company.com'),
      v_departments[floor(random() * array_length(v_departments, 1) + 1)],
      v_positions[floor(random() * array_length(v_positions, 1) + 1)],
      v_is_saudi,
      CASE WHEN v_is_saudi THEN 'Saudi Arabian' ELSE 'Indian' END,
      CASE WHEN random() < 0.95 THEN 'active' ELSE 'inactive' END,
      CURRENT_DATE - (random() * 365 * 3)::integer, -- Hired within last 3 years
      (random() * 15000 + 5000)::numeric(10,2), -- Salary between 5K-20K
      CASE WHEN NOT v_is_saudi THEN '2' || LPAD(floor(random() * 999999999)::text, 9, '0') ELSE NULL END,
      CASE WHEN NOT v_is_saudi THEN CURRENT_DATE + (random() * 730 + 30)::integer ELSE NULL END -- Iqama expires 1-2 years from now
    )
    ON CONFLICT (employee_number, company_id) DO NOTHING;
    
    v_inserted := v_inserted + 1;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'inserted', v_inserted,
    'message', 'Successfully seeded ' || v_inserted || ' employees'
  );
END;
$$;