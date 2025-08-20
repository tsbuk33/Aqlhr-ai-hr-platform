-- Create Hofstede national scores table
CREATE TABLE public.hofstede_national_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name_en TEXT NOT NULL,
  country_name_ar TEXT,
  power_distance NUMERIC(5,2),
  individualism NUMERIC(5,2),
  masculinity NUMERIC(5,2),
  uncertainty_avoidance NUMERIC(5,2),
  long_term_orientation NUMERIC(5,2),
  indulgence NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hofstede_national_scores ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (reference data)
CREATE POLICY "Anyone can view Hofstede scores"
ON public.hofstede_national_scores
FOR SELECT
USING (true);

-- Insert Hofstede scores for top nationalities in demo
INSERT INTO public.hofstede_national_scores (
  country_code, country_name_en, country_name_ar,
  power_distance, individualism, masculinity, uncertainty_avoidance, long_term_orientation, indulgence
) VALUES 
  ('SA', 'Saudi Arabia', 'المملكة العربية السعودية', 95, 25, 60, 80, 36, 52),
  ('EG', 'Egypt', 'مصر', 70, 25, 45, 80, 7, 4),
  ('IN', 'India', 'الهند', 77, 48, 56, 40, 51, 26),
  ('PH', 'Philippines', 'الفلبين', 94, 32, 64, 44, 27, 42),
  ('BD', 'Bangladesh', 'بنغلاديش', 80, 20, 55, 60, 47, 20),
  ('PK', 'Pakistan', 'باكستان', 55, 14, 50, 70, 50, 0),
  ('LB', 'Lebanon', 'لبنان', 75, 40, 65, 50, 14, 25),
  ('JO', 'Jordan', 'الأردن', 70, 30, 45, 65, 16, 43),
  ('SY', 'Syria', 'سوريا', 80, 35, 52, 60, 20, 30),
  ('YE', 'Yemen', 'اليمن', 85, 30, 53, 68, 15, 25),
  ('US', 'United States', 'الولايات المتحدة', 40, 91, 62, 46, 26, 68),
  ('GB', 'United Kingdom', 'المملكة المتحدة', 35, 89, 66, 35, 51, 69);

-- Create view for employee national mix
CREATE OR REPLACE VIEW public.employee_national_mix_v1 AS
SELECT 
  e.company_id as tenant_id,
  COALESCE(e.nationality, CASE WHEN e.is_saudi = true THEN 'Saudi' ELSE 'Unknown' END) as label,
  ROUND((COUNT(*)::numeric / SUM(COUNT(*)) OVER (PARTITION BY e.company_id)) * 100, 2) as pct,
  COUNT(*) as employee_count
FROM public.employees e
WHERE e.status = 'active'
GROUP BY e.company_id, e.nationality, e.is_saudi
HAVING COUNT(*) > 0
ORDER BY tenant_id, pct DESC;

-- Create RPC function to get Hofstede context
CREATE OR REPLACE FUNCTION public.cci_get_hofstede_context_v1(p_tenant_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_total_employees INTEGER;
  v_weighted_scores RECORD;
BEGIN
  -- Get total active employees for this tenant
  SELECT COUNT(*) INTO v_total_employees
  FROM public.employees 
  WHERE company_id = p_tenant_id AND status = 'active';
  
  -- Return null if no employees
  IF v_total_employees = 0 THEN
    RETURN NULL;
  END IF;
  
  -- Calculate weighted averages based on employee nationality mix
  SELECT 
    ROUND(SUM(h.power_distance * (mix.employee_count::numeric / v_total_employees)), 1) as power_distance,
    ROUND(SUM(h.individualism * (mix.employee_count::numeric / v_total_employees)), 1) as individualism,
    ROUND(SUM(h.masculinity * (mix.employee_count::numeric / v_total_employees)), 1) as masculinity,
    ROUND(SUM(h.uncertainty_avoidance * (mix.employee_count::numeric / v_total_employees)), 1) as uncertainty_avoidance,
    ROUND(SUM(h.long_term_orientation * (mix.employee_count::numeric / v_total_employees)), 1) as long_term_orientation,
    ROUND(SUM(h.indulgence * (mix.employee_count::numeric / v_total_employees)), 1) as indulgence
  INTO v_weighted_scores
  FROM public.employee_national_mix_v1 mix
  LEFT JOIN public.hofstede_national_scores h ON (
    h.country_code = mix.label OR 
    h.country_name_en = mix.label OR
    (mix.label = 'Saudi' AND h.country_code = 'SA')
  )
  WHERE mix.tenant_id = p_tenant_id 
  AND h.id IS NOT NULL; -- Only include nationalities we have Hofstede data for
  
  -- Build result JSON
  v_result := jsonb_build_object(
    'total_employees', v_total_employees,
    'dimensions', jsonb_build_object(
      'power_distance', COALESCE(v_weighted_scores.power_distance, 0),
      'individualism', COALESCE(v_weighted_scores.individualism, 0),
      'masculinity', COALESCE(v_weighted_scores.masculinity, 0),
      'uncertainty_avoidance', COALESCE(v_weighted_scores.uncertainty_avoidance, 0),
      'long_term_orientation', COALESCE(v_weighted_scores.long_term_orientation, 0),
      'indulgence', COALESCE(v_weighted_scores.indulgence, 0)
    ),
    'nationality_mix', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'nationality', mix.label,
          'percentage', mix.pct,
          'count', mix.employee_count,
          'has_hofstede_data', (h.id IS NOT NULL)
        )
      )
      FROM public.employee_national_mix_v1 mix
      LEFT JOIN public.hofstede_national_scores h ON (
        h.country_code = mix.label OR 
        h.country_name_en = mix.label OR
        (mix.label = 'Saudi' AND h.country_code = 'SA')
      )
      WHERE mix.tenant_id = p_tenant_id
      ORDER BY mix.pct DESC
    ),
    'computed_at', now()
  );
  
  RETURN v_result;
END;
$$;