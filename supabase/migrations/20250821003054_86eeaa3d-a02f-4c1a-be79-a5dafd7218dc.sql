-- Add unique constraint to kpi_snapshots
create unique index if not exists uq_kpi_tenant_date on public.kpi_snapshots(tenant_id, snap_date);

-- Standard tenant read/write policies
do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hr_departments') then
    create policy "tenant_rw_hr_departments" on public.hr_departments
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hr_locations') then
    create policy "tenant_rw_hr_locations" on public.hr_locations
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hr_grades') then
    create policy "tenant_rw_hr_grades" on public.hr_grades
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hr_jobs') then
    create policy "tenant_rw_hr_jobs" on public.hr_jobs
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hr_employees') then
    create policy "tenant_rw_hr_employees" on public.hr_employees
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hr_att') then
    create policy "tenant_rw_hr_att" on public.hr_attendance
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hr_leaves') then
    create policy "tenant_rw_hr_leaves" on public.hr_leaves
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hr_training') then
    create policy "tenant_rw_hr_training" on public.hr_training
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_hse') then
    create policy "tenant_rw_hse" on public.hse_incidents
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_docs') then
    create policy "tenant_rw_docs" on public.docs_events
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_integrations') then
    create policy "tenant_rw_integrations" on public.integrations
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'tenant_rw_kpis') then
    create policy "tenant_rw_kpis" on public.kpi_snapshots
      for all using (tenant_id = public.get_user_company_id()) with check (tenant_id = public.get_user_company_id());
  end if;
end $$;