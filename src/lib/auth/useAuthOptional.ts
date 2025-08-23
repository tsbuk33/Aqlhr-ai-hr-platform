import { useContext } from 'react';
import { AuthContext } from '@/hooks/useAuth.tsx';

export function useAuthOptional() {
  // If context missing, return a harmless stub
  try {
    const ctx = useContext(AuthContext);
    if (!ctx) return { user: null, session: null, isLoading: false, isAuthenticated: false, signOut: async () => {} };
    return ctx;
  } catch {
    return { user: null, session: null, isLoading: false, isAuthenticated: false, signOut: async () => {} };
  }
}