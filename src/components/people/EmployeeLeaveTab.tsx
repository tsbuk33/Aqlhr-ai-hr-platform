import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Clock, Plane, Heart, Calendar, Plus } from 'lucide-react';
import type { Employee } from '@/hooks/useEmployees';

interface EmployeeLeaveTabProps {
  employee: Employee;
}

export const EmployeeLeaveTab: React.FC<EmployeeLeaveTabProps> = ({ employee }) => {
  // Mock leave data - in real implementation, this would come from API
  const leaveBalances = [
    {
      type: 'Annual Leave',
      total: employee.vacation_days_per_year || 21,
      used: 5,
      remaining: (employee.vacation_days_per_year || 21) - 5,
      icon: Plane,
      color: 'blue'
    },
    {
      type: 'Sick Leave',
      total: 30,
      used: 2,
      remaining: 28,
      icon: Heart,
      color: 'red'
    },
    {
      type: 'Emergency Leave',
      total: 5,
      used: 1,
      remaining: 4,
      icon: Clock,
      color: 'orange'
    }
  ];

  const leaveHistory = [
    {
      id: '1',
      type: 'Annual Leave',
      start_date: '2024-01-15',
      end_date: '2024-01-19',
      days: 5,
      status: 'approved',
      applied_date: '2023-12-20'
    },
    {
      id: '2',
      type: 'Sick Leave',
      start_date: '2024-01-08',
      end_date: '2024-01-09',
      days: 2,
      status: 'approved',
      applied_date: '2024-01-08'
    }
  ];

  const upcomingLeave = [
    {
      id: '1',
      type: 'Annual Leave',
      start_date: '2024-03-15',
      end_date: '2024-03-22',
      days: 8,
      status: 'pending'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: { variant: 'default' as const, text: 'Approved' },
      pending: { variant: 'secondary' as const, text: 'Pending' },
      rejected: { variant: 'destructive' as const, text: 'Rejected' },
      cancelled: { variant: 'outline' as const, text: 'Cancelled' }
    };
    
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Leave Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaveBalances.map((balance) => {
          const Icon = balance.icon;
          const percentage = getUsagePercentage(balance.used, balance.total);
          
          return (
            <Card key={balance.type} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`h-6 w-6 text-${balance.color}-500`} />
                <div className="flex-1">
                  <div className="font-medium">{balance.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {balance.remaining} of {balance.total} days remaining
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {balance.used} days</span>
                  <span className={getUsageColor(percentage)}>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button className="justify-start" variant="outline">
              <Plane className="h-4 w-4 mr-2" />
              Request Annual Leave
            </Button>
            <Button className="justify-start" variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              Report Sick Leave
            </Button>
            <Button className="justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Emergency Leave Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Leave */}
      {upcomingLeave.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingLeave.map(leave => (
                <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 border-blue-200">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {leave.type}
                      {getStatusBadge(leave.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                      <span className="ml-2">({leave.days} days)</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leave History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Leave History
            </CardTitle>
            <Button variant="outline" size="sm">View All History</Button>
          </div>
        </CardHeader>
        <CardContent>
          {leaveHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No leave history found</p>
              <p className="text-sm">Leave requests will appear here once submitted</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaveHistory.map(leave => (
                <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{leave.type}</span>
                      {getStatusBadge(leave.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                      <span className="ml-2">({leave.days} days)</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Applied: {new Date(leave.applied_date).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leave Policies & Info */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Annual Leave</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {employee.vacation_days_per_year || 21} days per year</li>
                <li>• Accrued monthly</li>
                <li>• 30-day advance notice required</li>
                <li>• Maximum 10 days consecutive</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Sick Leave</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 30 days per year (with pay)</li>
                <li>• Medical certificate required (3+ days)</li>
                <li>• Can be extended with approval</li>
                <li>• No advance notice required</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                For detailed leave policies and procedures, refer to the employee handbook.
              </div>
              <Button variant="outline" size="sm">
                View Full Policy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};