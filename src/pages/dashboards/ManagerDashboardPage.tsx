import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart3, Calendar, CheckCircle, Clock, MessageSquare, Target } from 'lucide-react';

export const ManagerDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management Hub</h1>
          <p className="text-muted-foreground">Monitor and manage your team's performance and activities</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Users className="h-4 w-4 mr-1" />
          TEAM MANAGER
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">15</div>
            <p className="text-xs text-muted-foreground">Direct reports</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Goals</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">7/10</div>
            <p className="text-xs text-muted-foreground">On track</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Team Schedule
            </CardTitle>
            <CardDescription>Today's team activities and upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Present Today</span>
                <Badge variant="outline">13/15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">On Leave</span>
                <Badge variant="secondary">2 members</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">1:1 Meetings</span>
                <Badge variant="outline">3 scheduled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Team Meeting</span>
                <Badge variant="default">Tomorrow 10 AM</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Team Communication
            </CardTitle>
            <CardDescription>Recent feedback and team interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Feedback Received</span>
                <Badge variant="outline">5 new</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Performance Reviews</span>
                <Badge variant="secondary">2 overdue</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Goal Updates</span>
                <Badge variant="outline">8 updated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Team Messages</span>
                <Badge variant="outline">23 unread</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};