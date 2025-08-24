-- Fix dev_seed_employees_v1 to use correct column names and drop conflicting wrapper
drop function if exists public.dev_seed_retention_v1();

-- Update employees function with correct column references
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

  -- Insert departments
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

  -- Insert jobs using title_en, title_ar (not name_en, name_ar)
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

  -- Insert grades
  insert into public.hr_grades (company_id, code, min_salary, max_salary)
  values 
    (p_tenant, 'L1', 3000, 5000),
    (p_tenant, 'L2', 5000, 8000),
    (p_tenant, 'L3', 8000, 12000),
    (p_tenant, 'L4', 12000, 18000),
    (p_tenant, 'L5', 18000, 25000)
  on conflict (company_id, code) do nothing;

  select array_agg(id) into v_grade_ids from public.hr_grades where company_id = p_tenant;

  -- Generate employees
  for v_i in 1..p_n loop
    insert into public.hr_employees (
      company_id, employee_no, full_name_en, full_name_ar,
      dept_id, job_id, grade_id, hire_date, employment_status,
      is_saudi, nationality_code, gender, base_salary, allowances, iqama_expiry
    ) values (
      p_tenant,
      'EMP' || lpad(v_i::text, 6, '0'),
      (array['Ahmed','Mohammed','Abdullah','Omar','Ali','Khalid','Hassan','Yousef','Ibrahim','Fahad',
            'Sarah','Fatima','Aisha','Maryam','Noura','Hala','Reem','Layla','Nadia','Jana',
            'John','Michael','David','James','Robert','William','Richard','Thomas','Christopher','Daniel'])[1 + (v_i % 30)] ||
      ' ' ||
      (array['Al-Rashid','Al-Mahmoud','Al-Hassan','Al-Ahmed','Al-Omar','Al-Ali','Al-Khalid',
            'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez',
            'Kumar','Singh','Patel','Shah','Gupta','Sharma','Yadav','Das','Roy','Amin'])[1 + (v_i % 26)],
      case when random() < 0.7 then 
        (array['أحمد محمد','عبدالله عمر','علي خالد','حسن يوسف','سارة فاطمة','عائشة مريم','نورا هالة'])[1 + (v_i % 7)]
      else 'اسم عربي' end,
      v_dept_ids[1 + (v_i % coalesce(array_length(v_dept_ids, 1), 1))],
      v_job_ids[1 + (v_i % coalesce(array_length(v_job_ids, 1), 1))],
      v_grade_ids[1 + (v_i % coalesce(array_length(v_grade_ids, 1), 1))],
      current_date - (random() * 365 * 5)::integer,
      case when random() < 0.95 then 'active' else 'inactive' end,
      random() < 0.65,
      (array['SA','IN','PK','BD','EG','JO','LB','SY','YE','SD','PH','NP','LK','US','GB'])[1 + (v_i % 15)],
      case when random() < 0.7 then 'male' else 'female' end,
      3000 + (random() * 22000)::integer,
      (random() * 3000)::integer,
      case when random() < 0.35 then current_date + (random() * 365 * 2)::integer else null end
    );
    v_inserted_count := v_inserted_count + 1;
  end loop;

  return jsonb_build_object(
    'status','success', 'message','Demo employees seeded successfully',
    'inserted_count', v_inserted_count,
    'departments', coalesce(array_length(v_dept_ids, 1),0),
    'jobs', coalesce(array_length(v_job_ids, 1),0),
    'grades', coalesce(array_length(v_grade_ids, 1),0)
  );
end;
$$;