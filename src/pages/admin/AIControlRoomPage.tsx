import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AIControlRoom from '../../components/admin/AIControlRoom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface AIControlRoomPageProps {
  lang: 'en' | 'ar';
}

export default function AIControlRoomPage({ lang }: AIControlRoomPageProps) {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useTranslation();

  // Check if user has admin access
  const hasAdminAccess = profile?.role === 'Admin' || profile?.role === 'Super-Admin';

  // Set page title and direction
  useEffect(() => {
    document.title = `${t('ai.controlRoom.title')} - AqlHR`;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, t]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={`/${lang}/login`} replace />;
  }

  // Show access denied if not admin
  if (!hasAdminAccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              {t('admin.accessDenied.title')}
            </CardTitle>
            <CardDescription>
              {t('admin.accessDenied.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {t('admin.accessDenied.requiredRole')}
                </span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {t('admin.accessDenied.currentRole', { role: profile?.role || 'Unknown' })}
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline" 
                className="w-full"
              >
                {t('common.goBack')}
              </Button>
              <Button 
                onClick={() => window.location.href = `/${lang}/dashboard`} 
                className="w-full"
              >
                {t('common.goToDashboard')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the AI Control Room
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Navigation breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <a
                    href={`/${lang}/dashboard`}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {t('common.dashboard')}
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-4 w-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d={lang === 'ar' 
                          ? "M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L15.586 11H3a1 1 0 110-2h12.586l-3.293-3.293a1 1 0 010-1.414z"
                          : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        }
                        clipRule="evenodd"
                      />
                    </svg>
                    <a
                      href={`/${lang}/admin`}
                      className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {t('admin.title')}
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-4 w-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d={lang === 'ar' 
                          ? "M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L15.586 11H3a1 1 0 110-2h12.586l-3.293-3.293a1 1 0 010-1.414z"
                          : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        }
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-4 text-gray-900 dark:text-white font-medium">
                      {t('ai.controlRoom.title')}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {profile?.role} • {t('admin.controlRoom.adminAccess')}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AIControlRoom lang={lang} />
      </main>
    </div>
  );
}

// Export both named and default exports for flexibility
export { AIControlRoomPage };