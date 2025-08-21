import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Building, ArrowUp, ArrowDown, Phone } from 'lucide-react';
import type { Employee } from '@/hooks/useEmployees';

interface EmployeeOrgTabProps {
  employee: Employee;
}

export const EmployeeOrgTab: React.FC<EmployeeOrgTabProps> = ({ employee }) => {
  // This would normally fetch manager and reports data from the API
  // For now, we'll show placeholder structure

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Reporting Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Reporting Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Manager */}
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUp className="h-4 w-4" />
              Reports To
            </label>
            <div className="mt-2 p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">
                Manager information would be displayed here based on organizational hierarchy
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                View Manager Profile
              </Button>
            </div>
          </div>

          {/* Direct Reports */}
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowDown className="h-4 w-4" />
              Direct Reports
            </label>
            <div className="mt-2 p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">
                Direct reports would be listed here based on organizational hierarchy
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                View Team
              </Button>
            </div>
          </div>

          {/* Line Manager Contact */}
          {employee.line_manager_extension && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Line Manager Extension</label>
              <div className="mt-1 flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {employee.line_manager_extension}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Department Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Current Department</label>
            <div className="mt-1 text-lg font-medium">{employee.department || 'Not Assigned'}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Position in Department</label>
            <div className="mt-1">{employee.position || 'Not Assigned'}</div>
          </div>

          {employee.job_location && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Job Location</label>
              <div className="mt-1">{employee.job_location}</div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Department Stats</label>
            <div className="mt-2 space-y-2">
              <div className="text-sm text-muted-foreground">
                Department analytics and statistics would be displayed here
              </div>
              <Button variant="outline" size="sm">
                View Department Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Collaboration */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Team & Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Cross-functional Projects</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Reporting Relationships</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-2">Quick Actions</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">View Org Chart</Button>
              <Button variant="outline" size="sm">Update Reporting</Button>
              <Button variant="outline" size="sm">Team Calendar</Button>
              <Button variant="outline" size="sm">Department Contacts</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};