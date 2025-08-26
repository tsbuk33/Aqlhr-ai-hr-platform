import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the authentication callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/en/auth?error=callback_failed');
          return;
        }

        if (data.session) {
          // Get the next URL or default to dashboard
          const next = searchParams.get('next') || '/en/dashboard';
          navigate(next, { replace: true });
        } else {
          // No session, redirect to auth
          navigate('/en/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/en/auth?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  // Show loading while processing
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">Completing sign in...</h2>
          <p className="text-muted-foreground">Please wait while we authenticate you.</p>
        </div>
      </div>
      
      {/* AI Integration for Auth Callback */}
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="authentication-callback" 
        companyId="demo-company" 
        enabledFeatures={['contextual-help']}
      />
    </>
  );
}