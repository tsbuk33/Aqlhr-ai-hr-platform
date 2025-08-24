-- Update dev_seed_employees_v1 to match actual schema
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

  -- Insert departments (company_id, code, name_en, name_ar)
  insert into public.hr_departments (company_id, code, name_en, name_ar)
  values 
    (p_tenant, 'HR', 'Human Resources', 'الموارد البشرية'),
    (p_tenant, 'IT', 'Information Technology', 'تقنية المعلومات'),
    (p_tenant, 'FIN', 'Finance', 'المالية'),
    (p_tenant, 'OPS', 'Operations', 'العمليات'),
    (p_tenant, 'MKT', 'Marketing', 'التسويق'),
    (p_tenant, 'ADM', 'Administration', 'الإدارة')
  on conflict (company_id, code) do nothing;

  select array_agg(id) into v_dept_ids from public.hr_departments where company_id = p_tenant;

  -- Insert jobs (company_id, code, title_en, title_ar)
  insert into public.hr_jobs (company_id, code, title_en, title_ar)
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
  on conflict (company_id, code) do nothing;

  select array_agg(id) into v_job_ids from public.hr_jobs where company_id = p_tenant;

  -- Insert grades (company_id, code, min_salary, max_salary)
  insert into public.hr_grades (company_id, code, min_salary, max_salary)
  values 
    (p_tenant, 'L1', 3000, 5000),
    (p_tenant, 'L2', 5000, 8000),
    (p_tenant, 'L3', 8000, 12000),
    (p_tenant, 'L4', 12000, 18000),
    (p_tenant, 'L5', 18000, 25000)
  on conflict (company_id, code) do nothing;

  select array_agg(id) into v_grade_ids from public.hr_grades where company_id = p_tenant;

  -- Sample names and data
  v_names := array['Ahmed','Mohammed','Abdullah','Omar','Ali','Khalid','Hassan','Yousef','Ibrahim','Fahad',
                   'Sarah','Fatima','Aisha','Maryam','Noura','Hala','Reem','Layla','Nadia','Jana',
                   'John','Michael','David','James','Robert','William','Richard','Thomas','Christopher','Daniel',
                   'Mary','Jennifer','Linda','Patricia','Susan','Jessica','Karen','Nancy','Betty','Angela'];
  v_surnames := array['Al-Rashid','Al-Mahmoud','Al-Hassan','Al-Ahmed','Al-Omar','Al-Ali','Al-Khalid',
                      'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez',
                      'Kumar','Singh','Patel','Shah','Gupta','Sharma','Yadav','Das','Roy','Amin'];
  v_nationalities := array['SA','IN','PK','BD','EG','JO','LB','SY','YE','SD','PH','NP','LK','US','GB'];

  -- Generate employees
  for v_i in 1..p_n loop
    insert into public.hr_employees (
      company_id, employee_no,
      full_name_en, full_name_ar,
      dept_id, job_id, grade_id,
      hire_date, employment_status,
      is_saudi, nationality_code, gender,
      base_salary, allowances,
      iqama_expiry
    ) values (
      p_tenant,
      'EMP' || lpad(v_i::text, 6, '0'),
      v_names[1 + (v_i % array_length(v_names, 1))] || ' ' || v_surnames[1 + (v_i % array_length(v_surnames, 1))],
      case when random() < 0.7 then (array['أحمد محمد','عبدالله عمر','علي خالد','حسن يوسف','سارة فاطمة','عائشة مريم','نورا هالة'])[1 + (v_i % 7)]
           else v_names[1 + (v_i % array_length(v_names, 1))] || ' ' || v_surnames[1 + (v_i % array_length(v_surnames, 1))] end,
      v_dept_ids[1 + (v_i % array_length(v_dept_ids, 1))],
      v_job_ids[1 + (v_i % array_length(v_job_ids, 1))],
      v_grade_ids[1 + (v_i % array_length(v_grade_ids, 1))],
      current_date - (random() * 365 * 5)::integer,
      case when random() < 0.95 then 'active' else 'inactive' end,
      random() < 0.65,
      v_nationalities[1 + (v_i % array_length(v_nationalities, 1))],
      case when random() < 0.7 then 'male' else 'female' end,
      3000 + (random() * 22000)::integer,
      (random() * 3000)::integer,
      case when random() < 0.35 then current_date + (random() * 365 * 2)::integer else null end
    );
    v_inserted_count := v_inserted_count + 1;
  end loop;

  return jsonb_build_object(
    'status','success',
    'message','Demo employees seeded successfully',
    'inserted_count', v_inserted_count,
    'departments', coalesce(array_length(v_dept_ids, 1),0),
    'jobs', coalesce(array_length(v_job_ids, 1),0),
    'grades', coalesce(array_length(v_grade_ids, 1),0)
  );
end;
$$;

-- Update dev_seed_retention_v1 to mark exits in hr_employees (no separate exits table)
create or replace function public.dev_seed_retention_v1(p_tenant uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid := coalesce(p_tenant, public.get_demo_tenant_id());
  v_emp_ids uuid[];
  v_exit_count int := 0;
  v_month date;
  v_i int;
  v_per_month int;
begin
  select array_agg(id) into v_emp_ids from public.hr_employees where company_id = v_tenant and employment_status = 'active';
  if v_emp_ids is null or array_length(v_emp_ids,1) = 0 then
    return jsonb_build_object('status','no_employees','message','No active employees found');
  end if;

  -- Spread exits over last 12 months, 3-10 per month
  for v_i in 1..12 loop
    v_month := date_trunc('month', current_date) - (v_i || ' months')::interval;
    v_per_month := 3 + (random() * 7)::int;

    update public.hr_employees e set 
      employment_status = 'inactive',
      termination_date = v_month + (random() * 27)::int
    where e.company_id = v_tenant
      and e.id = any(v_emp_ids)
      and e.employment_status <> 'inactive'
    limit v_per_month; -- Postgres doesn't allow LIMIT in UPDATE directly; see below
  end loop;

  -- Since LIMIT isn't supported in UPDATE, perform using CTE per month
  v_exit_count := 0;
  for v_i in 1..12 loop
    v_month := date_trunc('month', current_date) - (v_i || ' months')::interval;
    v_per_month := 3 + (random() * 7)::int;

    with picked as (
      select id from public.hr_employees
      where company_id = v_tenant and employment_status = 'active'
      order by random()
      limit v_per_month
    )
    update public.hr_employees e
    set employment_status = 'inactive', termination_date = v_month + (random() * 27)::int
    from picked p
    where e.id = p.id;

    v_exit_count := v_exit_count + v_per_month;
  end loop;

  return jsonb_build_object('status','success','exits_created', v_exit_count, 'months_covered', 12);
end;
$$;