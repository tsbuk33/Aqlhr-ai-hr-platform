import React from 'react';
import { useCompanySetup } from '@/hooks/useCompanySetup';
import { useUserProfile } from '@/hooks/useUserProfile';
import { CompanySetupWizard } from '@/components/onboarding/CompanySetupWizard';

interface SetupGuardProps {
  children: React.ReactNode;
}

export function SetupGuard({ children }: SetupGuardProps) {
  const { profile, loading: profileLoading } = useUserProfile();
  const { setupStatus, loading: setupLoading } = useCompanySetup();

  // Show loading while checking setup status
  if (profileLoading || setupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // If user has no company, show setup wizard
  if (!profile?.company_id) {
    return <CompanySetupWizard />;
  }

  // If company exists but setup is not completed, show setup wizard
  if (setupStatus && !setupStatus.setup_completed) {
    return <CompanySetupWizard />;
  }

  // Company is set up, show the application
  return <>{children}</>;
}