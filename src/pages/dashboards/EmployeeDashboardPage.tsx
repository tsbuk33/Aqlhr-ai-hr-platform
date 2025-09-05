import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Calendar, FileText, BookOpen, Heart, CreditCard, Award } from 'lucide-react';

export const EmployeeDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Portal</h1>
          <p className="text-muted-foreground">Your personal workspace and self-service center</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <User className="h-4 w-4 mr-1" />
          EMPLOYEE
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-teal-200 bg-teal-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Today</CardTitle>
            <Clock className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">8h 30m</div>
            <p className="text-xs text-muted-foreground">Logged hours</p>
          </CardContent>
        </Card>

        <Card className="border-violet-200 bg-violet-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">18</div>
            <p className="text-xs text-muted-foreground">Days remaining</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">73%</div>
            <p className="text-xs text-muted-foreground">Courses completed</p>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">4.2/5</div>
            <p className="text-xs text-muted-foreground">Latest review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Leave Request</span>
                <Badge variant="secondary">Submit new</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Timesheet</span>
                <Badge variant="outline">Log hours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Expense Report</span>
                <Badge variant="outline">Create report</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Goal Update</span>
                <Badge variant="outline">Update progress</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Benefits & Wellness
            </CardTitle>
            <CardDescription>Your benefits status and wellness programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Health Insurance</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Retirement Plan</span>
                <Badge variant="outline">12% contribution</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Wellness Points</span>
                <Badge variant="secondary">847 points</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Next Payslip</span>
                <Badge variant="outline">March 30</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};