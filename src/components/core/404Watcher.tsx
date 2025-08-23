import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';

export function NotFoundWatcher() {
  const location = useLocation();
  const { companyId } = useUserCompany();

  useEffect(() => {
    // Check if current route results in 404
    const checkFor404 = async () => {
      const isNotFound = 
        location.pathname.includes('/404') ||
        document.title.includes('404') ||
        document.title.includes('Not Found');

      if (isNotFound && companyId) {
        try {
          await supabase.from('ui_events').insert({
            page: location.pathname,
            message: '404 Not Found',
            level: 'error',
            tenant_id: companyId,
            details: {
              referrer: document.referrer || null,
              locale: location.pathname.startsWith('/ar') ? 'ar' : 'en',
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              search_params: location.search
            }
          });
        } catch (error) {
          console.warn('Failed to log 404 event:', error);
        }
      }
    };

    // Small delay to let page render and set title
    const timer = setTimeout(checkFor404, 100);
    return () => clearTimeout(timer);
  }, [location, companyId]);

  return null;
}