import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from './useUserCompany';

export interface OnboardingProfileData {
  // Company Profile
  industry_type: string;
  company_size: string;
  hr_challenges: string[];
  existing_hr_tools: string[];
  saudization_percentage_goal: number | null;
  
  // HR Process Assessment
  recruitment_process: {
    steps: string[];
    timeline_weeks: number;
    current_challenges: string[];
  };
  performance_review_frequency: string;
  leave_management_complexity: string;
  compliance_concerns: string[];
  pain_points_ranking: Record<string, number>;
  
  // Completion flags
  profile_completed: boolean;
  assessment_completed: boolean;
  onboarding_completed: boolean;
}

const defaultData: OnboardingProfileData = {
  industry_type: '',
  company_size: '',
  hr_challenges: [],
  existing_hr_tools: [],
  saudization_percentage_goal: null,
  recruitment_process: {
    steps: [],
    timeline_weeks: 4,
    current_challenges: []
  },
  performance_review_frequency: '',
  leave_management_complexity: '',
  compliance_concerns: [],
  pain_points_ranking: {},
  profile_completed: false,
  assessment_completed: false,
  onboarding_completed: false
};

export function useOnboardingProfile() {
  const { companyId } = useUserCompany();
  const [data, setData] = useState<OnboardingProfileData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: profile, error: loadError } = await supabase
        .from('company_onboarding_profiles')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();

      if (loadError) throw loadError;

      if (profile) {
        setData({
          industry_type: profile.industry_type,
          company_size: profile.company_size,
          hr_challenges: profile.hr_challenges || [],
          existing_hr_tools: profile.existing_hr_tools || [],
          saudization_percentage_goal: profile.saudization_percentage_goal,
          recruitment_process: (profile.recruitment_process && 
            typeof profile.recruitment_process === 'object' && 
            !Array.isArray(profile.recruitment_process) &&
            'steps' in profile.recruitment_process) ? profile.recruitment_process as { steps: string[]; timeline_weeks: number; current_challenges: string[]; } : defaultData.recruitment_process,
          performance_review_frequency: profile.performance_review_frequency || '',
          leave_management_complexity: profile.leave_management_complexity || '',
          compliance_concerns: profile.compliance_concerns || [],
          pain_points_ranking: (profile.pain_points_ranking && 
            typeof profile.pain_points_ranking === 'object' && 
            !Array.isArray(profile.pain_points_ranking)) ? profile.pain_points_ranking as Record<string, number> : {},
          profile_completed: profile.profile_completed,
          assessment_completed: profile.assessment_completed,
          onboarding_completed: profile.onboarding_completed
        });
      }
    } catch (err) {
      console.error('Error loading onboarding profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (updates: Partial<OnboardingProfileData>) => {
    if (!companyId) {
      throw new Error('Company ID is required');
    }

    setSaving(true);
    setError(null);

    try {
      const updatedData = { ...data, ...updates };
      
      const { error: saveError } = await supabase
        .from('company_onboarding_profiles')
        .upsert({
          company_id: companyId,
          industry_type: updatedData.industry_type,
          company_size: updatedData.company_size,
          hr_challenges: updatedData.hr_challenges,
          existing_hr_tools: updatedData.existing_hr_tools,
          saudization_percentage_goal: updatedData.saudization_percentage_goal,
          recruitment_process: updatedData.recruitment_process,
          performance_review_frequency: updatedData.performance_review_frequency,
          leave_management_complexity: updatedData.leave_management_complexity,
          compliance_concerns: updatedData.compliance_concerns,
          pain_points_ranking: updatedData.pain_points_ranking,
          profile_completed: updatedData.profile_completed,
          assessment_completed: updatedData.assessment_completed,
          onboarding_completed: updatedData.onboarding_completed
        });

      if (saveError) throw saveError;
      
      setData(updatedData);
      return true;
    } catch (err) {
      console.error('Error saving onboarding profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const completeStep = async (step: 'profile' | 'assessment') => {
    const updates = {
      ...(step === 'profile' && { profile_completed: true }),
      ...(step === 'assessment' && { assessment_completed: true })
    };

    // Check if both steps are complete
    const willBeComplete = (step === 'profile' ? true : data.profile_completed) && 
                          (step === 'assessment' ? true : data.assessment_completed);

    if (willBeComplete) {
      (updates as any).onboarding_completed = true;
    }

    await saveProfile(updates);
  };

  useEffect(() => {
    loadProfile();
  }, [companyId]);

  return {
    data,
    loading,
    saving,
    error,
    saveProfile,
    completeStep,
    refetch: loadProfile,
    isCompleted: data.onboarding_completed,
    profileCompleted: data.profile_completed,
    assessmentCompleted: data.assessment_completed
  };
}