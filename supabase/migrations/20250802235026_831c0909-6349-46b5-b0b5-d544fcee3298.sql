-- Fix RLS policies for tables that have RLS enabled but no policies

-- 1. Create company access function if not exists
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS uuid AS $$
BEGIN
  RETURN (auth.jwt() ->> 'company_id')::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add RLS policies for tables missing policies

-- employees table policies
CREATE POLICY "Company employees access" ON public.employees
  FOR ALL USING (company_id = get_user_company_id());

-- user_roles table policies  
CREATE POLICY "Company user roles access" ON public.user_roles
  FOR ALL USING (company_id = get_user_company_id());

-- company_settings table policies
CREATE POLICY "Company settings access" ON public.company_settings
  FOR ALL USING (company_id = get_user_company_id());

-- departments table policies
CREATE POLICY "Company departments access" ON public.departments
  FOR ALL USING (company_id = get_user_company_id());

-- employee_benefits table policies
CREATE POLICY "Company employee benefits access" ON public.employee_benefits
  FOR ALL USING (company_id = get_user_company_id());

-- payroll table policies
CREATE POLICY "Company payroll access" ON public.payroll
  FOR ALL USING (company_id = get_user_company_id());

-- goals table policies
CREATE POLICY "Company goals access" ON public.goals
  FOR ALL USING (company_id = get_user_company_id());

-- training_courses table policies
CREATE POLICY "Company training courses access" ON public.training_courses
  FOR ALL USING (company_id = get_user_company_id());

-- employee_training table policies
CREATE POLICY "Company employee training access" ON public.employee_training
  FOR ALL USING (company_id = get_user_company_id());

-- government_integration_log table policies
CREATE POLICY "Company government integration log access" ON public.government_integration_log
  FOR ALL USING (company_id = get_user_company_id());

-- job_postings table policies
CREATE POLICY "Company job postings access" ON public.job_postings
  FOR ALL USING (company_id = get_user_company_id());

-- recruitment_pipeline table policies  
CREATE POLICY "Company recruitment pipeline access" ON public.recruitment_pipeline
  FOR ALL USING (company_id = get_user_company_id());

-- employee_surveys table policies
CREATE POLICY "Company employee surveys access" ON public.employee_surveys
  FOR ALL USING (company_id = get_user_company_id());

-- survey_responses table policies
CREATE POLICY "Company survey responses access" ON public.survey_responses
  FOR ALL USING (company_id = get_user_company_id());

-- payroll_items table policies
CREATE POLICY "Company payroll items access" ON public.payroll_items
  FOR ALL USING (company_id = get_user_company_id());

-- gosi_contribution_rates table policies (public reference data)
CREATE POLICY "GOSI rates public access" ON public.gosi_contribution_rates
  FOR SELECT USING (true);

-- employee_modules table policies
CREATE POLICY "Company employee modules access" ON public.employee_modules
  FOR ALL USING (company_id = get_user_company_id());

-- document_types table policies (public reference data)
CREATE POLICY "Document types public access" ON public.document_types
  FOR SELECT USING (true);

-- nationalities table policies (public reference data)
CREATE POLICY "Nationalities public access" ON public.nationalities
  FOR SELECT USING (true);

-- saudi_departments table policies (public reference data)
CREATE POLICY "Saudi departments public access" ON public.saudi_departments
  FOR SELECT USING (true);

-- Add any missing tables identified by the linter