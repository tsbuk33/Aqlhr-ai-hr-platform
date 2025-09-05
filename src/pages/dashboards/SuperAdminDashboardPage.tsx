import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Server, Users, Database, AlertTriangle, Activity } from 'lucide-react';

export const SuperAdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Control Center</h1>
          <p className="text-muted-foreground">Complete system administration and monitoring</p>
        </div>
        <Badge variant="destructive" className="text-sm">
          <Shield className="h-4 w-4 mr-1" />
          SUPER ADMIN
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Server className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">99.9%</div>
            <p className="text-xs text-muted-foreground">Uptime last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">847 GB</div>
            <p className="text-xs text-muted-foreground">Storage utilization</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Performance
            </CardTitle>
            <CardDescription>Real-time system metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm font-medium">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Disk Usage</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Network I/O</span>
                <span className="text-sm font-medium">1.2 GB/s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Overview
            </CardTitle>
            <CardDescription>System security status and recent activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed Login Attempts</span>
                <Badge variant="destructive">12 today</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Patches</span>
                <Badge variant="outline">Up to date</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SSL Certificates</span>
                <Badge variant="outline">Valid</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup Status</span>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};