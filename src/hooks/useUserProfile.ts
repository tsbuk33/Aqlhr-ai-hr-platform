import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';

export type UserRole = 'owner' | 'ceo' | 'vp' | 'director' | 'hr_manager' | 'hrbp' | 'line_manager' | 'admin' | 'employee';

export interface UserProfile {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_id?: string;
  department?: string;
  role: UserRole;  // Single role field based on existing schema
  language?: string;
  is_active?: boolean;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthOptional();

  const loadProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query the existing profiles table structure
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile({
          user_id: profileData.user_id,
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          company_id: profileData.company_id,
          department: profileData.department,
          role: (profileData.role as UserRole) || 'employee',
          language: profileData.language,
          is_active: profileData.is_active
        });
      } else {
        // Create basic profile if none exists
        const { data: basicProfile, error: insertError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || '',
            last_name: user.user_metadata?.last_name || '',
            role: 'employee',
            language: 'en',
            is_active: true
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setProfile({
          user_id: basicProfile.user_id,
          email: basicProfile.email,
          first_name: basicProfile.first_name,
          last_name: basicProfile.last_name,
          company_id: basicProfile.company_id,
          department: basicProfile.department,
          role: (basicProfile.role as UserRole) || 'employee',
          language: basicProfile.language,
          is_active: basicProfile.is_active
        });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
          department: updates.department,
          role: updates.role,
          language: updates.language
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(profile?.role || 'employee');
  };

  const isAdmin = (): boolean => {
    return hasAnyRole(['owner', 'admin', 'hr_manager']);
  };

  const canManageUsers = (): boolean => {
    return hasAnyRole(['owner', 'admin', 'hr_manager', 'ceo']);
  };

  const canViewAnalytics = (): boolean => {
    return hasAnyRole(['owner', 'admin', 'hr_manager', 'ceo', 'vp', 'director']);
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: loadProfile,
    hasRole,
    hasAnyRole,
    isAdmin,
    canManageUsers,
    canViewAnalytics
  };
}