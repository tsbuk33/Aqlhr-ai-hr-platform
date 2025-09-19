import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { localePath, resolveLang } from '@/lib/i18n/localePath';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { useLanguage } from '@/hooks/useLanguageCompat';
export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback processing...');
        
        // Handle the authentication callback with hash fragments
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate(localePath('auth', resolveLang()) + '?error=' + encodeURIComponent(error.message));
          return;
        }

        if (data.session) {
          console.log('Session found, user authenticated:', data.session.user.email);
          // Get the next URL or default to system overview
          const next = searchParams.get('next') || localePath('system-overview', resolveLang());
          
          // Small delay to ensure session is properly established
          setTimeout(() => {
            navigate(next, { replace: true });
          }, 500);
        } else {
          console.log('No session found, redirecting to auth');
          // No session, redirect to auth with info message
          navigate(localePath('auth', resolveLang()) + '?info=Please check your email and click the verification link');
        }
      } catch (error) {
        console.error('Auth callback unexpected error:', error);
        navigate(localePath('auth', resolveLang()) + '?error=callback_failed');
      }
    };

    // Add small delay to ensure URL fragments are processed
    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  // Show loading while processing
  return (
    <>
      <div className={`min-h-screen flex items-center justify-center bg-background ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
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