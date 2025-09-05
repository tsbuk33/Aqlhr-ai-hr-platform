import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, Key, Globe, BarChart3 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration Console</h1>
          <p className="text-muted-foreground">Manage users, roles, and system configurations</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Shield className="h-4 w-4 mr-1" />
          ADMIN
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2,847</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-secondary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Current active users</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Key className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="border-muted/20 bg-muted/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Recent user activities and management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">New Registrations</span>
                <Badge variant="outline">15 today</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Approvals</span>
                <Badge variant="secondary">8 pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Role Updates</span>
                <Badge variant="outline">3 today</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Deactivated Accounts</span>
                <Badge variant="outline">2 today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Configuration
            </CardTitle>
            <CardDescription>Configuration status and recent changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Company Settings</span>
                <Badge variant="outline">Updated 2h ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Keys</span>
                <Badge variant="outline">5 active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gov Integrations</span>
                <Badge variant="outline">12 connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Localization</span>
                <Badge variant="outline">2 languages</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};