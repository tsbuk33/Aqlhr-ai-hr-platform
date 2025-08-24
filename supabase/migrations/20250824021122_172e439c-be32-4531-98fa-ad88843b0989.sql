-- Set search path for the functions to avoid "relation not found" errors
alter function public.dev_seed_employees_v1(uuid,integer) set search_path = public;
alter function public.dev_backfill_kpis_v1(uuid,integer) set search_path = public;  
alter function public.dev_seed_retention_v1(uuid) set search_path = public;

-- Grant execute permissions to anon and authenticated users
grant execute on function public.dev_seed_employees_v1(uuid,integer) to anon, authenticated;
grant execute on function public.dev_backfill_kpis_v1(uuid,integer) to anon, authenticated;
grant execute on function public.dev_seed_retention_v1(uuid) to anon, authenticated;

-- Create zero-arg wrapper functions for UI consistency
create or replace function public.dev_seed_employees_v1()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select public.dev_seed_employees_v1(public.get_demo_tenant_id(), 1000);
$$;

create or replace function public.dev_backfill_kpis_v1()
returns jsonb  
language sql
stable
security definer
set search_path = public
as $$
  select public.dev_backfill_kpis_v1(public.get_demo_tenant_id(), 365);
$$;

create or replace function public.dev_seed_retention_v1()
returns void
language sql
stable
security definer  
set search_path = public
as $$
  select public.dev_seed_retention_v1(public.get_demo_tenant_id());
$$;

-- Grant execute on the wrapper functions
grant execute on function public.dev_seed_employees_v1() to anon, authenticated;
grant execute on function public.dev_backfill_kpis_v1() to anon, authenticated; 
grant execute on function public.dev_seed_retention_v1() to anon, authenticated;