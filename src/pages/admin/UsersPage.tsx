import React from 'react';
import { UserManagement } from '@/components/admin/UserManagement';
import { RoleGuard } from '@/components/rbac/RoleGuard';

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6">
      <RoleGuard requiredRoles={['owner', 'admin', 'hr_manager', 'ceo']}>
        <UserManagement />
      </RoleGuard>
    </div>
  );
}