import React from 'react';
import { UserManagement } from '@/components/admin/UserManagement';
import { RoleGuard } from '@/components/rbac/RoleGuard';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <RoleGuard requiredRoles={['owner', 'admin', 'hr_manager', 'ceo']}>
        <UserManagement />
      </RoleGuard>
      
      {/* AI Integration for Admin User Management */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="admin-user-management" 
        companyId="demo-company" 
        enabledFeatures={['user-management', 'security-monitoring', 'intelligent-automation', 'contextual-help']}
      />
    </div>
  );
}