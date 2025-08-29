import React from 'react';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { RoleGuard } from '@/components/rbac/RoleGuard';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

export default function ProfilePage() {
  const isArabic = window.location.pathname.includes('/ar');
  
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <RoleGuard showError={false}>
        <UserProfileForm />
      </RoleGuard>

      {/* AI Integration for Profile */}
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="user-profile" 
        companyId="demo-company" 
        enabledFeatures={['contextual-help', 'real-time-insights']}
      />
    </div>
  );
}