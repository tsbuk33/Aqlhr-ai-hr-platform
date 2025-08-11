import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'super_admin' | 'admin' | 'hr_manager' | 'employee' | 'manager';

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get user role from user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (roleError || !roleData) {
          console.log('No role found, defaulting to employee');
          setUserRole('employee');
        } else {
          setUserRole(roleData.role as UserRole);
        }
        
        // Get company ID from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('user_id', user.id)
          .single();
          
        setCompanyId(profile?.company_id || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('employee');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(userRole);
  };

  return {
    userRole,
    companyId,
    isLoading,
    hasRole,
    hasAnyRole,
  };
};