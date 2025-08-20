import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUserCompany = () => {
  const { user } = useAuth();

  const { data: companyData, isLoading, error } = useQuery({
    queryKey: ['user-company', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get user's company from user_roles table
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (roleError || !userRole?.company_id) {
        console.error('Error fetching user company:', roleError);
        return null;
      }

      return {
        companyId: userRole.company_id
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    companyId: companyData?.companyId || null,
    isLoading,
    error
  };
};