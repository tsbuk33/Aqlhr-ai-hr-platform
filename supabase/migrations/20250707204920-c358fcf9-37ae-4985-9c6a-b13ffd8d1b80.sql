-- GOSI Contribution Update Implementation (Royal Decree M/273)
-- Effective July 1, 2025 - Progressive rates for new employees only

-- Employee GOSI Configuration Table
CREATE TABLE public.employee_gosi_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  hire_date DATE NOT NULL,
  gosi_system_type TEXT NOT NULL CHECK (gosi_system_type IN ('OLD', 'NEW')),
  nationality TEXT NOT NULL CHECK (nationality IN ('SAUDI', 'NON_SAUDI')),
  current_employee_rate DECIMAL(5,2) NOT NULL,
  current_employer_rate DECIMAL(5,2) NOT NULL,
  effective_from DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id)
);

-- GOSI Rate History Table
CREATE TABLE public.gosi_rate_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_type TEXT NOT NULL CHECK (system_type IN ('OLD', 'NEW')),
  nationality TEXT NOT NULL CHECK (nationality IN ('SAUDI', 'NON_SAUDI')),
  employee_rate DECIMAL(5,2) NOT NULL,
  employer_rate DECIMAL(5,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_gosi_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gosi_rate_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage GOSI config for their company employees" 
ON public.employee_gosi_config 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view GOSI rate history" 
ON public.gosi_rate_history 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Indexes for performance
CREATE INDEX idx_employee_gosi_config_employee_id ON public.employee_gosi_config(employee_id);
CREATE INDEX idx_employee_gosi_config_effective_from ON public.employee_gosi_config(effective_from);
CREATE INDEX idx_gosi_rate_history_system_nationality ON public.gosi_rate_history(system_type, nationality);
CREATE INDEX idx_gosi_rate_history_effective_dates ON public.gosi_rate_history(effective_from, effective_to);

-- Trigger for timestamps
CREATE TRIGGER update_employee_gosi_config_updated_at 
BEFORE UPDATE ON public.employee_gosi_config 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial rate history data
INSERT INTO public.gosi_rate_history (system_type, nationality, employee_rate, employer_rate, effective_from) VALUES
-- OLD System (static rates)
('OLD', 'SAUDI', 9.00, 9.00, '2024-01-01'),
('OLD', 'NON_SAUDI', 0.00, 2.00, '2024-01-01'),

-- NEW System progressive rates for Saudis
('NEW', 'SAUDI', 9.00, 9.00, '2025-07-01'),
('NEW', 'SAUDI', 9.50, 9.50, '2026-07-01'),
('NEW', 'SAUDI', 10.00, 10.00, '2027-07-01'),
('NEW', 'SAUDI', 10.50, 10.50, '2028-07-01'),
('NEW', 'SAUDI', 11.00, 11.00, '2029-07-01'),

-- NEW System for Non-Saudis (unchanged)
('NEW', 'NON_SAUDI', 0.00, 2.00, '2025-07-01');

-- Function to calculate GOSI rates for an employee
CREATE OR REPLACE FUNCTION public.calculate_gosi_rates(
  p_employee_id UUID,
  p_as_of_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  employee_rate DECIMAL(5,2),
  employer_rate DECIMAL(5,2),
  system_type TEXT
) 
LANGUAGE plpgsql
AS $$
DECLARE
  v_config RECORD;
  v_rate RECORD;
BEGIN
  -- Get employee GOSI configuration
  SELECT * INTO v_config 
  FROM public.employee_gosi_config 
  WHERE employee_id = p_employee_id;
  
  IF NOT FOUND THEN
    -- If no config exists, determine system type based on hire date
    SELECT 
      e.hire_date,
      CASE 
        WHEN e.hire_date >= '2025-07-01' THEN 'NEW'
        ELSE 'OLD'
      END as system_type,
      CASE 
        WHEN e.is_saudi = true THEN 'SAUDI'
        ELSE 'NON_SAUDI'
      END as nationality
    INTO v_config
    FROM public.employees e
    WHERE e.id = p_employee_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Employee not found: %', p_employee_id;
    END IF;
  END IF;
  
  -- Get applicable rate from history
  SELECT h.employee_rate, h.employer_rate, v_config.system_type
  INTO v_rate
  FROM public.gosi_rate_history h
  WHERE h.system_type = v_config.system_type
    AND h.nationality = v_config.nationality
    AND h.effective_from <= p_as_of_date
    AND (h.effective_to IS NULL OR h.effective_to > p_as_of_date)
  ORDER BY h.effective_from DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No GOSI rate found for employee % on date %', p_employee_id, p_as_of_date;
  END IF;
  
  RETURN QUERY SELECT v_rate.employee_rate, v_rate.employer_rate, v_rate.system_type;
END;
$$;

-- Function to auto-classify employees based on hire date
CREATE OR REPLACE FUNCTION public.auto_classify_employee_gosi(p_employee_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_employee RECORD;
  v_system_type TEXT;
  v_nationality TEXT;
  v_rates RECORD;
BEGIN
  -- Get employee details
  SELECT hire_date, is_saudi 
  INTO v_employee
  FROM public.employees 
  WHERE id = p_employee_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Employee not found: %', p_employee_id;
  END IF;
  
  -- Determine system type and nationality
  v_system_type := CASE 
    WHEN v_employee.hire_date >= '2025-07-01' THEN 'NEW'
    ELSE 'OLD'
  END;
  
  v_nationality := CASE 
    WHEN v_employee.is_saudi = true THEN 'SAUDI'
    ELSE 'NON_SAUDI'
  END;
  
  -- Get current rates
  SELECT employee_rate, employer_rate
  INTO v_rates
  FROM public.gosi_rate_history
  WHERE system_type = v_system_type
    AND nationality = v_nationality
    AND effective_from <= CURRENT_DATE
    AND (effective_to IS NULL OR effective_to > CURRENT_DATE)
  ORDER BY effective_from DESC
  LIMIT 1;
  
  -- Insert or update configuration
  INSERT INTO public.employee_gosi_config (
    employee_id,
    hire_date,
    gosi_system_type,
    nationality,
    current_employee_rate,
    current_employer_rate,
    effective_from
  ) VALUES (
    p_employee_id,
    v_employee.hire_date,
    v_system_type,
    v_nationality,
    v_rates.employee_rate,
    v_rates.employer_rate,
    CURRENT_DATE
  )
  ON CONFLICT (employee_id) 
  DO UPDATE SET
    gosi_system_type = EXCLUDED.gosi_system_type,
    nationality = EXCLUDED.nationality,
    current_employee_rate = EXCLUDED.current_employee_rate,
    current_employer_rate = EXCLUDED.current_employer_rate,
    effective_from = EXCLUDED.effective_from,
    updated_at = now();
END;
$$;

-- Back-fill existing employees with GOSI configuration
DO $$
DECLARE
  emp_record RECORD;
BEGIN
  FOR emp_record IN SELECT id FROM public.employees LOOP
    PERFORM public.auto_classify_employee_gosi(emp_record.id);
  END LOOP;
END $$;