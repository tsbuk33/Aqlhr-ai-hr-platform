import { useAuth } from './useAuth';

/**
 * Optional auth hook for pages that can work with or without authentication
 * This prevents crashes when auth context is absent
 */
export const useAuthOptional = () => {
  try {
    return useAuth();
  } catch (error) {
    // Auth context not available, return null values
    return {
      user: null,
      session: null,
      isLoading: false,
      signOut: async () => {}
    };
  }
};