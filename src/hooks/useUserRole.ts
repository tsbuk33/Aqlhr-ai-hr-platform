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
        // For now, return default role since table might not exist yet
        setUserRole('super_admin'); // Default to super_admin for testing
        setCompanyId(null);
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