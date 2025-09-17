import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Calendar, Award, Clock, Target, FileText } from 'lucide-react';

const HRManagerDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Management Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive workforce management and analytics</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Users className="h-4 w-4 mr-1" />
          HR MANAGER
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">847</div>
            <p className="text-xs text-muted-foreground">+23 this month</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last quarter</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Tenure</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">3.2 yrs</div>
            <p className="text-xs text-muted-foreground">Company average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Management
            </CardTitle>
            <CardDescription>Current leave requests and attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Requests</span>
                <Badge variant="secondary">12 requests</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">On Leave Today</span>
                <Badge variant="outline">34 employees</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Attendance Rate</span>
                <Badge variant="outline">96.8%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Late Arrivals</span>
                <Badge variant="outline">7 today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performance & Development
            </CardTitle>
            <CardDescription>Employee performance metrics and training progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Reviews</span>
                <Badge variant="outline">78%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Training Programs</span>
                <Badge variant="secondary">15 active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Skill Assessments</span>
                <Badge variant="outline">89% completion</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Career Plans</span>
                <Badge variant="outline">234 created</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRManagerDashboardPage;