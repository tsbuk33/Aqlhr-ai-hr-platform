import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'founder' | 'admin' | 'hr_manager' | 'manager' | 'employee' | 'user' | 'owner' | 'ceo' | 'vp' | 'director' | 'hrbp' | 'line_manager';

export interface UserProfile {
  id: string;
  user_id: string; // For compatibility with existing code
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  company_name?: string;
  company_id?: string; // For compatibility with existing code
  department?: string;
  job_title?: string;
  phone?: string;
  language?: string;
  timezone?: string;
  role?: string; // For compatibility with existing code
  current_role?: string;
  role_assigned_at?: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthOptional();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query user profile with role information using the new schema
  const { data: profileData, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID available');

      const { data, error } = await supabase
        .from('user_profiles_with_roles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  // Set profile from query data and add compatibility properties
  useEffect(() => {
    if (profileData) {
      setProfile({
        ...profileData,
        user_id: profileData.id, // Add compatibility property
        role: profileData.current_role, // Add compatibility property
        company_id: profileData.company_name // Basic mapping for compatibility
      });
      setLoading(false);
      setError(null);
    } else if (queryError) {
      setError(queryError instanceof Error ? queryError.message : 'Failed to load profile');
      setLoading(false);
    } else {
      setLoading(queryLoading);
    }
  }, [profileData, queryError, queryLoading]);

  // Role checking functions
  const hasRole = (role: UserRole): boolean => {
    return profile?.current_role === role || profile?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    const userRole = (profile?.current_role || profile?.role || 'user') as UserRole;
    return roles.includes(userRole);
  };

  const isFounder = (): boolean => hasRole('founder');
  const isAdmin = (): boolean => hasAnyRole(['founder', 'admin', 'owner']);
  const isHRManager = (): boolean => hasAnyRole(['founder', 'admin', 'hr_manager', 'owner']);

  const canManageUsers = (): boolean => {
    return hasAnyRole(['founder', 'admin', 'owner']);
  };

  const canViewAnalytics = (): boolean => {
    return hasAnyRole(['founder', 'admin', 'hr_manager', 'manager', 'owner', 'ceo']);
  };

  return {
    profile,
    loading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
    hasRole,
    hasAnyRole,
    isFounder,
    isAdmin,
    isHRManager,
    canManageUsers,
    canViewAnalytics,
  };
}