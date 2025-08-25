import React from 'react';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { RoleGuard } from '@/components/rbac/RoleGuard';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
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
    </div>
  );
}