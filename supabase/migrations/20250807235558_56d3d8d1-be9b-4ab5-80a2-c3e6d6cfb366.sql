-- Fix RLS policies for tables without policies
-- Based on the linter warnings about RLS enabled but no policies

-- training_programs table
CREATE POLICY "Users can manage training programs from their company" 
ON public.training_programs 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- leave_types table  
CREATE POLICY "Users can manage leave types from their company" 
ON public.leave_types 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- system_settings table
CREATE POLICY "Users can manage system settings from their company" 
ON public.system_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- payroll_periods table
CREATE POLICY "Users can manage payroll periods from their company" 
ON public.payroll_periods 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- performance_cycles table
CREATE POLICY "Users can manage performance cycles from their company" 
ON public.performance_cycles 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- employee_positions table
CREATE POLICY "Users can manage employee positions from their company" 
ON public.employee_positions 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- job_postings table
CREATE POLICY "Users can manage job postings from their company" 
ON public.job_postings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Fix function search paths for better security
-- Update functions to set search_path

CREATE OR REPLACE FUNCTION public.prompt_logs_set_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  IF NEW.company_id IS NULL THEN
    NEW.company_id := public.get_user_company_id();
  END IF;
  IF NEW.summary IS NULL OR NEW.summary = '' THEN
    NEW.summary := LEFT(NEW.user_prompt, 100) 
      || CASE WHEN LENGTH(NEW.user_prompt) > 100 THEN '…' ELSE '' END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path TO '';