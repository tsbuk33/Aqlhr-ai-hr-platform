-- Fix the government integration status constraint to allow umm_al_qura_calendar
ALTER TABLE public.gov_integration_status 
DROP CONSTRAINT IF EXISTS gov_integration_status_integration_type_check;

-- Add updated constraint that includes umm_al_qura_calendar
ALTER TABLE public.gov_integration_status 
ADD CONSTRAINT gov_integration_status_integration_type_check 
CHECK (integration_type IN (
  'qiwa', 'gosi', 'hrsd', 'absher', 'muqeem', 'mudad', 'elm', 'seha', 
  'chi', 'health_insurance', 'medical_insurance', 'qiyas', 'ncaa', 
  'education_ministry', 'taqat_hrdf', 'ncei_employment', 'interior_ministry',
  'esnad_notarization', 'saudi_post_verification', 'tawakkalna',
  'umm_al_qura_calendar', 'saudi_engineering_body'
));