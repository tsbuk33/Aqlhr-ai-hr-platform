-- Create comprehensive onboarding data tables
CREATE TABLE IF NOT EXISTS public.company_onboarding_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Company Profile Data
  industry_type TEXT NOT NULL,
  company_size TEXT NOT NULL,
  hr_challenges TEXT[] DEFAULT '{}',
  existing_hr_tools TEXT[] DEFAULT '{}',
  saudization_percentage_goal NUMERIC,
  
  -- HR Process Assessment
  recruitment_process JSONB DEFAULT '{}',
  performance_review_frequency TEXT,
  leave_management_complexity TEXT,
  compliance_concerns TEXT[] DEFAULT '{}',
  pain_points_ranking JSONB DEFAULT '{}',
  
  -- Completion Status
  profile_completed BOOLEAN DEFAULT false,
  assessment_completed BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  
  -- Additional Metadata
  setup_duration_minutes INTEGER,
  recommended_modules TEXT[] DEFAULT '{}',
  priority_areas TEXT[] DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.company_onboarding_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage onboarding profiles for their company" 
ON public.company_onboarding_profiles 
FOR ALL 
USING (company_id = get_user_company_id())
WITH CHECK (company_id = get_user_company_id());

-- Create update trigger
CREATE OR REPLACE FUNCTION public.update_onboarding_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_onboarding_profile_updated_at
BEFORE UPDATE ON public.company_onboarding_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_onboarding_profile_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_company_onboarding_profiles_company_id ON public.company_onboarding_profiles(company_id);
CREATE INDEX idx_company_onboarding_profiles_completion ON public.company_onboarding_profiles(onboarding_completed, completion_date);