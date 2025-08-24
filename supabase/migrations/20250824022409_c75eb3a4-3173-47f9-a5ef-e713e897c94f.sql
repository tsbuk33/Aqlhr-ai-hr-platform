-- Fix syntax error in dev_seed_retention_v1
create or replace function public.dev_seed_retention_v1(p_tenant uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid := coalesce(p_tenant, public.get_demo_tenant_id());
  v_exit_count int := 0;
  v_month date;
  v_i int;
  v_per_month int;
begin
  -- Check for employees
  if not exists(select 1 from public.hr_employees where company_id = v_tenant and employment_status = 'active') then
    return jsonb_build_object('status','no_employees','message','No active employees found');
  end if;

  -- Spread exits over last 12 months using CTE
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