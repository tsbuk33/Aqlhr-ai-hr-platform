import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Shield, Settings, Key } from 'lucide-react';

export const UserManagementPanel: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState('demo-company');
  const [userRole, setUserRole] = useState('');

  const managementFeatures = [
    {
      id: 'rbac',
      title: 'Role-Based Access Control',
      description: 'Manage user permissions and access levels',
      icon: Shield,
      status: 'active'
    },
    {
      id: 'auth',
      title: 'Authentication System',
      description: 'User login and session management',
      icon: Key,
      status: 'active'
    },
    {
      id: 'multi-tenant',
      title: 'Multi-Tenant Architecture',
      description: 'Isolated data per organization',
      icon: Settings,
      status: 'active'
    }
  ];

  const userRoles = [
    { value: 'admin', label: 'System Administrator' },
    { value: 'hr-manager', label: 'HR Manager' },
    { value: 'hr-specialist', label: 'HR Specialist' },
    { value: 'employee', label: 'Employee' },
    { value: 'viewer', label: 'Read-Only User' }
  ];

  const tenants = [
    { value: 'demo-company', label: 'Demo Company' },
    { value: 'acme-corp', label: 'ACME Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Ltd' }
  ];

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-l-primary pl-4">
        <h2 className="text-2xl font-bold text-foreground">User Management System</h2>
        <p className="text-muted-foreground">Secure multi-tenant user access and role management</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Configuration
            </CardTitle>
            <CardDescription>Create and manage user accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="tenant">Tenant Organization</Label>
              <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.value} value={tenant.value}>
                      {tenant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">User Email</Label>
              <Input id="email" placeholder="user@company.com" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">User Role</Label>
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full">Create User</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Features</CardTitle>
            <CardDescription>Active user management capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {managementFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <Badge variant="default">
                    {feature.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagementPanel;