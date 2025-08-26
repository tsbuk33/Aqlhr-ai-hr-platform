-- Security Fix: Address legitimate SECURITY DEFINER concerns
-- Convert calculation and utility functions that don't need elevated privileges

-- 1. Convert pure calculation functions to SECURITY INVOKER (safer)
CREATE OR REPLACE FUNCTION public.calculate_annual_leave_entitlement(p_hire_date date, p_current_date date DEFAULT CURRENT_DATE)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER
STABLE
SET search_path TO 'public'
AS $$
DECLARE
  v_service_years INTEGER;
BEGIN
  v_service_years := EXTRACT(YEAR FROM AGE(p_current_date, p_hire_date));
  
  -- Saudi labor law: 21 days for 1-5 years, 30 days for 5+ years
  IF v_service_years >= 5 THEN
    RETURN 30;
  ELSE
    RETURN 21;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_overtime_amount(p_basic_salary numeric, p_overtime_hours numeric, p_standard_hours integer DEFAULT 40)
RETURNS numeric
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER
STABLE
SET search_path TO 'public'
AS $$
DECLARE
  v_hourly_rate DECIMAL;
  v_overtime_rate DECIMAL;
BEGIN
  v_hourly_rate := p_basic_salary / p_standard_hours;
  v_overtime_rate := v_hourly_rate * 1.5; -- 150% as per Saudi law
  
  RETURN v_overtime_rate * p_overtime_hours;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_working_hours(p_check_in timestamp without time zone, p_check_out timestamp without time zone, p_break_duration numeric DEFAULT 1.0)
RETURNS numeric
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER
STABLE
SET search_path TO 'public'
AS $$
DECLARE
  v_total_hours DECIMAL;
BEGIN
  IF p_check_in IS NULL OR p_check_out IS NULL THEN
    RETURN 0;
  END IF;
  
  v_total_hours := EXTRACT(EPOCH FROM (p_check_out - p_check_in)) / 3600.0;
  v_total_hours := v_total_hours - p_break_duration;
  
  RETURN GREATEST(0, v_total_hours);
END;
$$;

-- 2. Convert reference data functions to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_cities_by_region(region_code text)
RETURNS TABLE(id uuid, code text, name_en text, name_ar text, timezone text)
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER
STABLE
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.code, c.name_en, c.name_ar, c.timezone
  FROM public.saudi_cities c
  JOIN public.saudi_regions r ON c.region_id = r.id
  WHERE r.code = region_code
  ORDER BY c.name_en;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_activities_by_sector(sector_code text)
RETURNS TABLE(id uuid, classification_code text, name_en text, name_ar text)
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER
STABLE
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.classification_code, a.name_en, a.name_ar
  FROM public.saudi_activities a
  JOIN public.saudi_sectors s ON a.sector_id = s.id
  WHERE s.sic_code = sector_code
  ORDER BY a.name_en;
END;
$$;

-- 3. Convert utility functions that don't need elevated privileges
CREATE OR REPLACE FUNCTION public.cosine_similarity(a double precision[], b double precision[])
RETURNS double precision
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER
IMMUTABLE
SET search_path TO 'public'
AS $$
DECLARE
  dot_product FLOAT8 := 0;
  norm_a FLOAT8 := 0;
  norm_b FLOAT8 := 0;
  i INTEGER;
BEGIN
  IF array_length(a, 1) != array_length(b, 1) THEN
    RAISE EXCEPTION 'Array dimensions must match';
  END IF;
  
  FOR i IN 1..array_length(a, 1) LOOP
    dot_product := dot_product + (a[i] * b[i]);
    norm_a := norm_a + (a[i] * a[i]);
    norm_b := norm_b + (b[i] * b[i]);
  END LOOP;
  
  IF norm_a = 0 OR norm_b = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN dot_product / (sqrt(norm_a) * sqrt(norm_b));
END;
$$;

-- Note: Keep SECURITY DEFINER for functions that legitimately need it:
-- - Cross-tenant aggregation functions (ask_*, dashboard_*)
-- - Authentication/authorization functions (has_role, get_user_company_id)
-- - Administrative functions (dev_*, gov_*, roi_*)
-- - Functions that bypass RLS for legitimate business purposes

-- Log the security improvements
DO $$
BEGIN
    RAISE NOTICE 'Security improvements applied:';
    RAISE NOTICE '- Converted calculation functions to SECURITY INVOKER';
    RAISE NOTICE '- Converted reference data functions to SECURITY INVOKER'; 
    RAISE NOTICE '- Added search_path to all modified functions';
    RAISE NOTICE '- Kept SECURITY DEFINER only where legitimately needed';
END $$;