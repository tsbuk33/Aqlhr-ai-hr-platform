import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LinkL } from '@/lib/i18n/LinkL';
import { AdminJobQueue } from '@/components/demo/AdminJobQueue';
import { EntitlementGate } from '@/components/core/EntitlementGate';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Activity,
  Zap,
  Lock
} from 'lucide-react';

export default function AdminOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground">Platform administration and system monitoring</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Current online users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">99.9%</div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245ms</div>
            <p className="text-xs text-muted-foreground">Avg response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Gating Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CCI Module - Gated */}
        <EntitlementGate 
          feature="cci" 
          featureName="Culture Intelligence"
          description="Access comprehensive culture change tracking and insights"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Culture Intelligence (CCI)
                <Badge variant="secondary">Premium</Badge>
              </CardTitle>
              <CardDescription>
                Advanced culture change tracking with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track organizational culture transformation with comprehensive surveys, 
                evidence management, and automated reporting.
              </p>
              <div className="flex gap-2">
                <LinkL to="cci/overview">
                  <Button size="sm">Open CCI Module</Button>
                </LinkL>
                <LinkL to="cci/survey">
                  <Button size="sm" variant="outline">Start Survey</Button>
                </LinkL>
              </div>
            </CardContent>
          </Card>
        </EntitlementGate>

        {/* OSI Module - Gated */}
        <EntitlementGate 
          feature="osi" 
          featureName="Organizational Structure Intelligence"
          description="Analyze and optimize organizational hierarchies"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                OSI Analytics
                <Badge variant="secondary">Growth</Badge>
              </CardTitle>
              <CardDescription>
                Organizational structure optimization and span analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analyze management spans, organizational layers, and structure 
                efficiency with automated recommendations.
              </p>
              <LinkL to="diagnostic/osi">
                <Button size="sm">View OSI Dashboard</Button>
              </LinkL>
            </CardContent>
          </Card>
        </EntitlementGate>

        {/* Retention Module - Gated */}
        <EntitlementGate 
          feature="retention" 
          featureName="Retention Intelligence"
          description="Predict and prevent employee turnover"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Retention Analytics
                <Badge variant="secondary">Enterprise</Badge>
              </CardTitle>
              <CardDescription>
                AI-powered retention forecasting and intervention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Predict flight risks, analyze retention factors, and implement 
                targeted intervention strategies.
              </p>
              <LinkL to="diagnostic/retention">
                <Button size="sm">Open Retention</Button>
              </LinkL>
            </CardContent>
          </Card>
        </EntitlementGate>

        {/* System Health - Always Available */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              System Health Monitor
              <Badge variant="outline">Core</Badge>
            </CardTitle>
            <CardDescription>
              Real-time platform monitoring and diagnostics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor job queues, audit logs, performance metrics, and system 
              health in real-time.
            </p>
            <LinkL to="_/health">
              <Button size="sm">View Health Dashboard</Button>
            </LinkL>
          </CardContent>
        </Card>
      </div>

      {/* Job Queue Demo */}
      <EntitlementGate 
        feature="autopilot"
        featureName="Kernel Administration"
        fallback={
          <Card className="border-dashed opacity-75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Job Queue Management (Locked)
              </CardTitle>
              <CardDescription>
                Background job scheduling requires administrator privileges
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <AdminJobQueue />
      </EntitlementGate>
    </div>
  );
}