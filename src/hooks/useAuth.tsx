import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // ✅ Persist session when signed in
        if (session) {
          localStorage.setItem("supabase.auth.token", JSON.stringify(session));
        } else {
          localStorage.removeItem("supabase.auth.token");
        }
        
        // Handle user profile creation/updates
        if (event === 'SIGNED_IN' && session?.user) {
          // Ensure user profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (!profile) {
            // Create profile if it doesn't exist
            await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                user_id: session.user.id,
                email: session.user.email,
                first_name: session.user.user_metadata?.first_name,
                last_name: session.user.user_metadata?.last_name,
              });
          }
        }
        
        setIsLoading(false);
      }
    );

    // ✅ Load existing session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session) {
        localStorage.setItem("supabase.auth.token", JSON.stringify(session));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear any cached data and localStorage
      localStorage.removeItem("supabase.auth.token");
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};