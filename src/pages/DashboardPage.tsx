import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Calendar, TrendingUp, Shield, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const stats = [
  {
    title: 'Total Employees',
    value: '0',
    description: 'No employees yet',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Present Today',
    value: '0',
    description: 'Attendance rate: 0%',
    icon: Clock,
    color: 'text-green-600'
  },
  {
    title: 'Pending Leaves',
    value: '0',
    description: 'Awaiting approval',
    icon: Calendar,
    color: 'text-orange-600'
  },
  {
    title: 'Performance Reviews',
    value: '0',
    description: 'Due this month',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
];

const securityAlerts = [
  {
    title: 'Database Security',
    message: '8 tables missing Row Level Security policies',
    type: 'critical',
    icon: AlertTriangle
  },
  {
    title: 'Authentication',
    message: 'Email verification configured',
    type: 'success',
    icon: CheckCircle
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your HR management platform
        </p>
      </div>

      {/* Security Alerts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">System Status</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {securityAlerts.map((alert, index) => (
            <Card key={index} className={`border-l-4 ${
              alert.type === 'critical' ? 'border-l-red-500 bg-red-50' : 
              alert.type === 'success' ? 'border-l-green-500 bg-green-50' : 
              'border-l-yellow-500 bg-yellow-50'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <alert.icon className={`h-4 w-4 ${
                    alert.type === 'critical' ? 'text-red-600' : 
                    alert.type === 'success' ? 'text-green-600' : 
                    'text-yellow-600'
                  }`} />
                  {alert.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Management
            </CardTitle>
            <CardDescription>
              Add and manage your workforce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start by adding employees to your system to unlock attendance, payroll, and performance features.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Health & Safety
            </CardTitle>
            <CardDescription>
              HSE compliance and incident tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage workplace safety, track incidents, and ensure regulatory compliance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payroll & GOSI
            </CardTitle>
            <CardDescription>
              Saudi compliance and benefits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Handle payroll calculations, GOSI registration, and government compliance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}