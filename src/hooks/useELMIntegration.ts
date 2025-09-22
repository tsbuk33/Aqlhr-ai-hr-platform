import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

export interface ELMIntegrationData {
  activePrograms: number;
  enrolledLearners: number;
  certificatesIssued: number;
  completionRate: string;
  learningModules: number;
  assessmentsCompleted: number;
  programsByDomain: {
    professionalDevelopment: number;
    technicalSkills: number;
    leadership: number;
    safetyCompliance: number;
    others: number;
  };
  integrationStatus: {
    lms: 'connected' | 'disconnected' | 'syncing';
    certification: 'connected' | 'disconnected' | 'syncing';
    assessment: 'connected' | 'disconnected' | 'syncing';
    contentLibrary: 'connected' | 'disconnected' | 'syncing';
  };
  lastSyncTime: Date;
}

async function fetchELMIntegrationData(): Promise<ELMIntegrationData> {
  const tenantId = await getTenantIdOrDemo();
  if (!tenantId) {
    throw new Error('No tenant ID available');
  }

  try {
    // Return mock data for now (to be replaced with actual API integration)
    // Future implementation will connect to real ELM systems
    return {
      activePrograms: 24,
      enrolledLearners: 1247,
      certificatesIssued: 892,
      completionRate: '87.3',
      learningModules: 156,
      assessmentsCompleted: 2341,
      programsByDomain: {
        professionalDevelopment: 8,
        technicalSkills: 6,
        leadership: 5,
        safetyCompliance: 3,
        others: 2
      },
      integrationStatus: {
        lms: 'connected',
        certification: 'connected',
        assessment: 'connected',
        contentLibrary: 'syncing'
      },
      lastSyncTime: new Date()
    };
  } catch (error) {
    console.error('Error in fetchELMIntegrationData:', error);
    // Return default mock data
    return {
      activePrograms: 24,
      enrolledLearners: 1247,
      certificatesIssued: 892,
      completionRate: '87.3',
      learningModules: 156,
      assessmentsCompleted: 2341,
      programsByDomain: {
        professionalDevelopment: 8,
        technicalSkills: 6,
        leadership: 5,
        safetyCompliance: 3,
        others: 2
      },
      integrationStatus: {
        lms: 'connected',
        certification: 'connected',
        assessment: 'connected',
        contentLibrary: 'syncing'
      },
      lastSyncTime: new Date()
    };
  }
}

export const useELMIntegration = () => {
  return useQuery({
    queryKey: ['elm-integration'],
    queryFn: fetchELMIntegrationData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};