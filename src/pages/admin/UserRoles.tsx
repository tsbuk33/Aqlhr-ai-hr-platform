import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Shield, Settings } from 'lucide-react';

const UserRoles = () => {
  const roles = [
    { id: '1', name: 'Super Admin', users: 2, permissions: 'Full Access', color: 'destructive' },
    { id: '2', name: 'HR Manager', users: 5, permissions: 'HR Module Access', color: 'default' },
    { id: '3', name: 'Employee', users: 248, permissions: 'Self Service Only', color: 'secondary' },
    { id: '4', name: 'Payroll Admin', users: 3, permissions: 'Payroll Module Access', color: 'default' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Roles Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {role.name}
                <Badge variant={role.color as any}>
                  {role.users} users
                </Badge>
              </CardTitle>
              <CardDescription>{role.permissions}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  {role.users} assigned
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserRoles;