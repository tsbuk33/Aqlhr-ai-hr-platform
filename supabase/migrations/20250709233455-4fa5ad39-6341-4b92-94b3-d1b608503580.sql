-- Add comprehensive employee fields for advanced HR management
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS line_manager_extension text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS vacation_days_per_year integer DEFAULT 21; -- Saudi Labor Law standard
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS company_phone text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS iban_number text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS emergency_contact_name text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS emergency_contact_number text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS life_insurance_home_country boolean DEFAULT false;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS visa_number text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS job_description text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS job_description_ar text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS kpis text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS kpis_ar text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS work_location text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS work_location_ar text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS project_name text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS project_name_ar text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS project_number text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS project_cost_number text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS overtime_eligible boolean DEFAULT true;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS joining_date date;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS contract_type text; -- HRSD approved types
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS shift_type text DEFAULT 'day'; -- day/night
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS company_housing boolean DEFAULT false;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS education_level text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS certificates text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS certificates_ar text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS experience_years integer DEFAULT 0;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS grade_level text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS driver_license_number text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS company_job_title text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS company_job_title_ar text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS job_level text; -- junior/senior/manager/director/cxo
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS salary_level text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS gosi_cost_per_month numeric;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS passport_expiry_date date;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS qiwa_contract boolean DEFAULT false;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS saudi_engineer_card_number text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS medical_conditions text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS medical_conditions_ar text;

-- Update transportation allowance trigger to handle company housing
CREATE OR REPLACE FUNCTION public.update_housing_transportation_allowance()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- If company provides housing, set housing allowance to 0
  IF NEW.company_housing = true THEN
    NEW.housing_allowance_percentage = 0;
  ELSIF NEW.company_housing = false AND NEW.housing_allowance_percentage = 0 THEN
    NEW.housing_allowance_percentage = 25; -- Default 25%
  END IF;
  
  -- If company provides transportation, set transportation allowance to 0
  IF NEW.company_provides_transportation = true THEN
    NEW.transportation_allowance_percentage = 0;
  ELSIF NEW.company_provides_transportation = false AND NEW.transportation_allowance_percentage = 0 THEN
    NEW.transportation_allowance_percentage = 10; -- Default 10%
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for housing and transportation allowance updates
DROP TRIGGER IF EXISTS update_housing_transportation_allowance_trigger ON public.employees;
CREATE TRIGGER update_housing_transportation_allowance_trigger
  BEFORE INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_housing_transportation_allowance();