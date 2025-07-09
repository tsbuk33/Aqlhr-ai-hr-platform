-- Add comprehensive employee fields to employees table
ALTER TABLE public.employees 
ADD COLUMN job_location TEXT,
ADD COLUMN actual_job_title TEXT,
ADD COLUMN actual_job_title_ar TEXT,
ADD COLUMN iqama_title TEXT,
ADD COLUMN iqama_title_ar TEXT,
ADD COLUMN national_address TEXT,
ADD COLUMN personal_email TEXT,
ADD COLUMN company_email TEXT,
ADD COLUMN family_status TEXT CHECK (family_status IN ('family', 'non_family')),
ADD COLUMN recruitment_type TEXT CHECK (recruitment_type IN ('local', 'international')),
ADD COLUMN passport_number TEXT,
ADD COLUMN number_of_wives INTEGER DEFAULT 0,
ADD COLUMN number_of_children INTEGER DEFAULT 0,
ADD COLUMN position_hired_for TEXT,
ADD COLUMN position_hired_for_ar TEXT,
ADD COLUMN project_hired_for TEXT,
ADD COLUMN project_hired_for_ar TEXT,
ADD COLUMN hired_request_number TEXT,
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female')),
ADD COLUMN basic_salary NUMERIC,
ADD COLUMN housing_allowance_percentage NUMERIC DEFAULT 25,
ADD COLUMN transportation_allowance_percentage NUMERIC DEFAULT 10,
ADD COLUMN company_provides_transportation BOOLEAN DEFAULT false,
ADD COLUMN other_benefits TEXT,
ADD COLUMN other_benefits_ar TEXT,
ADD COLUMN agreed_annual_bonus NUMERIC,
ADD COLUMN annual_tickets_type TEXT CHECK (annual_tickets_type IN ('single', 'family')),
ADD COLUMN annual_tickets_count INTEGER DEFAULT 0,
ADD COLUMN company_sim_card BOOLEAN DEFAULT false,
ADD COLUMN schooling_fees_coverage TEXT CHECK (schooling_fees_coverage IN ('none', 'one_child', 'two_children', 'all_children')),
ADD COLUMN parents_medical_insurance BOOLEAN DEFAULT false;

-- Create trigger to automatically set transportation allowance to 0 when company provides transportation
CREATE OR REPLACE FUNCTION update_transportation_allowance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.company_provides_transportation = true THEN
    NEW.transportation_allowance_percentage = 0;
  ELSIF NEW.company_provides_transportation = false AND NEW.transportation_allowance_percentage = 0 THEN
    NEW.transportation_allowance_percentage = 10;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transportation_allowance_trigger
  BEFORE INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION update_transportation_allowance();