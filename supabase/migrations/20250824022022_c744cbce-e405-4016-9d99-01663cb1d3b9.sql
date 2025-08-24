-- Drop existing functions first
drop function if exists public.dev_seed_employees_v1(uuid, integer);
drop function if exists public.dev_seed_retention_v1(uuid);

-- Recreate dev_seed_employees_v1 with department codes
create or replace function public.dev_seed_employees_v1(p_tenant uuid, p_n integer default 1000)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dept_ids uuid[];
  v_job_ids uuid[];
  v_grade_ids uuid[];
  v_inserted_count integer := 0;
  v_names text[];
  v_surnames text[];
  v_nationalities text[];
  v_i integer;
begin
  -- Check if already seeded
  if (select count(*) from public.hr_employees where company_id = p_tenant) >= p_n then
    return jsonb_build_object(
      'status', 'already_seeded',
      'message', 'Demo data already exists',
      'employee_count', (select count(*) from public.hr_employees where company_id = p_tenant)
    );
  end if;

  -- Insert departments with codes
  insert into public.hr_departments (company_id, code, name_en, name_ar)
  values 
    (p_tenant, 'HR', 'Human Resources', 'الموارد البشرية'),
    (p_tenant, 'IT', 'Information Technology', 'تقنية المعلومات'),
    (p_tenant, 'FIN', 'Finance', 'المالية'),
    (p_tenant, 'OPS', 'Operations', 'العمليات'),
    (p_tenant, 'MKT', 'Marketing', 'التسويق'),
    (p_tenant, 'ADM', 'Administration', 'الإدارة')
  on conflict (company_id, code) do nothing
  returning id into v_dept_ids;

  -- Get department IDs if they already existed
  if v_dept_ids is null then
    select array_agg(id) into v_dept_ids 
    from public.hr_departments 
    where company_id = p_tenant;
  end if;

  -- Insert jobs with codes
  insert into public.hr_jobs (company_id, code, name_en, name_ar)
  values 
    (p_tenant, 'MGR', 'Manager', 'مدير'),
    (p_tenant, 'SPEC', 'Specialist', 'أخصائي'),
    (p_tenant, 'COORD', 'Coordinator', 'منسق'),
    (p_tenant, 'ASST', 'Assistant', 'مساعد'),
    (p_tenant, 'ANLST', 'Analyst', 'محلل'),
    (p_tenant, 'LEAD', 'Team Lead', 'قائد فريق'),
    (p_tenant, 'EXEC', 'Executive', 'تنفيذي'),
    (p_tenant, 'DIR', 'Director', 'مدير عام'),
    (p_tenant, 'SUPV', 'Supervisor', 'مشرف'),
    (p_tenant, 'CONS', 'Consultant', 'مستشار')
  on conflict (company_id, code) do nothing
  returning id into v_job_ids;

  -- Get job IDs if they already existed
  if v_job_ids is null then
    select array_agg(id) into v_job_ids 
    from public.hr_jobs 
    where company_id = p_tenant;
  end if;

  -- Insert grades with codes
  insert into public.hr_grades (company_id, code, name_en, name_ar, salary_min, salary_max)
  values 
    (p_tenant, 'L1', 'Level 1', 'المستوى 1', 3000, 5000),
    (p_tenant, 'L2', 'Level 2', 'المستوى 2', 5000, 8000),
    (p_tenant, 'L3', 'Level 3', 'المستوى 3', 8000, 12000),
    (p_tenant, 'L4', 'Level 4', 'المستوى 4', 12000, 18000),
    (p_tenant, 'L5', 'Level 5', 'المستوى 5', 18000, 25000)
  on conflict (company_id, code) do nothing
  returning id into v_grade_ids;

  -- Get grade IDs if they already existed
  if v_grade_ids is null then
    select array_agg(id) into v_grade_ids 
    from public.hr_grades 
    where company_id = p_tenant;
  end if;

  -- Sample names and data
  v_names := array['Ahmed', 'Mohammed', 'Abdullah', 'Omar', 'Ali', 'Khalid', 'Hassan', 'Yousef', 'Ibrahim', 'Fahad',
                   'Sarah', 'Fatima', 'Aisha', 'Maryam', 'Noura', 'Hala', 'Reem', 'Layla', 'Nadia', 'Jana',
                   'John', 'Michael', 'David', 'James', 'Robert', 'William', 'Richard', 'Thomas', 'Christopher', 'Daniel',
                   'Mary', 'Jennifer', 'Linda', 'Patricia', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Betty'];
                   
  v_surnames := array['Al-Rashid', 'Al-Mahmoud', 'Al-Hassan', 'Al-Ahmed', 'Al-Omar', 'Al-Ali', 'Al-Khalid',
                      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
                      'Kumar', 'Singh', 'Patel', 'Shah', 'Gupta', 'Sharma', 'Yadav', 'Das', 'Roy', 'Amin'];
                      
  v_nationalities := array['SA', 'IN', 'PK', 'BD', 'EG', 'JO', 'LB', 'SY', 'YE', 'SD', 'PH', 'NP', 'LK', 'US', 'GB'];

  -- Generate employees
  for v_i in 1..p_n loop
    insert into public.hr_employees (
      company_id, employee_no, 
      full_name_en, full_name_ar,
      dept_id, job_id, grade_id,
      hire_date, employment_status,
      is_saudi, nationality, gender,
      basic_salary, housing_allowance, transportation_allowance,
      iqama_expiry, passport_expiry
    ) values (
      p_tenant,
      'EMP' || lpad(v_i::text, 6, '0'),
      v_names[1 + (v_i % array_length(v_names, 1))] || ' ' || v_surnames[1 + (v_i % array_length(v_surnames, 1))],
      case when random() < 0.7 then 
        (array['أحمد محمد', 'عبدالله عمر', 'علي خالد', 'حسن يوسف', 'سارة فاطمة', 'عائشة مريم', 'نورا هالة'])[1 + (v_i % 7)]
      else v_names[1 + (v_i % array_length(v_names, 1))] || ' ' || v_surnames[1 + (v_i % array_length(v_surnames, 1))]
      end,
      v_dept_ids[1 + (v_i % array_length(v_dept_ids, 1))],
      v_job_ids[1 + (v_i % array_length(v_job_ids, 1))],
      v_grade_ids[1 + (v_i % array_length(v_grade_ids, 1))],
      current_date - (random() * 365 * 5)::integer,
      case when random() < 0.95 then 'active' else 'inactive' end,
      random() < 0.65, -- 65% Saudi
      v_nationalities[1 + (v_i % array_length(v_nationalities, 1))],
      case when random() < 0.7 then 'male' else 'female' end,
      3000 + (random() * 22000)::integer,
      (random() * 2000)::integer,
      (random() * 1500)::integer,
      case when random() < 0.35 then current_date + (random() * 365 * 2)::integer else null end,
      case when random() < 0.8 then current_date + (random() * 365 * 3)::integer else null end
    );
    
    v_inserted_count := v_inserted_count + 1;
  end loop;

  return jsonb_build_object(
    'status', 'success',
    'message', 'Demo employees seeded successfully',
    'inserted_count', v_inserted_count,
    'departments', array_length(v_dept_ids, 1),
    'jobs', array_length(v_job_ids, 1),
    'grades', array_length(v_grade_ids, 1)
  );
end;
$$;

-- Recreate dev_seed_retention_v1 
create or replace function public.dev_seed_retention_v1(p_tenant uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_employee_ids uuid[];
  v_exit_count integer := 0;
  v_month_date date;
  v_exit_reasons text[];
  v_i integer;
begin
  -- Use provided tenant or get demo tenant
  v_tenant := coalesce(p_tenant, public.get_demo_tenant_id());
  
  -- Get employee IDs
  select array_agg(id) into v_employee_ids 
  from public.hr_employees 
  where company_id = v_tenant 
  limit 120; -- Limit for exits over 12 months
  
  if v_employee_ids is null or array_length(v_employee_ids, 1) = 0 then
    return jsonb_build_object(
      'status', 'no_employees',
      'message', 'No employees found to create exits for'
    );
  end if;
  
  v_exit_reasons := array['resignation', 'termination', 'end_of_contract', 'retirement', 'transfer'];
  
  -- Create exits for past 12 months
  for v_i in 1..12 loop
    v_month_date := date_trunc('month', current_date) - (v_i || ' months')::interval;
    
    -- Insert 5-15 exits per month
    for j in 1..(5 + (random() * 10)::integer) loop
      if v_exit_count < array_length(v_employee_ids, 1) then
        insert into public.hr_employee_exits (
          company_id, employee_id, exit_date, exit_reason, 
          notice_period_days, final_settlement_amount,
          exit_interview_completed, rehire_eligible
        ) values (
          v_tenant,
          v_employee_ids[v_exit_count + 1],
          v_month_date + (random() * 28)::integer,
          v_exit_reasons[1 + (random() * array_length(v_exit_reasons, 1))::integer],
          case when random() < 0.6 then (15 + random() * 45)::integer else null end,
          (random() * 15000)::numeric(10,2),
          random() < 0.8,
          random() < 0.7
        ) on conflict (employee_id) do nothing;
        
        v_exit_count := v_exit_count + 1;
      end if;
    end loop;
  end loop;
  
  return jsonb_build_object(
    'status', 'success',
    'message', 'Retention/exit data seeded successfully',
    'exits_created', v_exit_count,
    'months_covered', 12
  );
end;
$$;