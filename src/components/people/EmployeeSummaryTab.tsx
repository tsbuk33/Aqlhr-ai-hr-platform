import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, MapPin, Briefcase } from 'lucide-react';
import type { Employee } from '@/hooks/useEmployees';

interface EmployeeSummaryTabProps {
  employee: Employee;
}

export const EmployeeSummaryTab: React.FC<EmployeeSummaryTabProps> = ({ employee }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <div className="mt-1">{employee.first_name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <div className="mt-1">{employee.last_name}</div>
            </div>
          </div>
          
          {(employee.first_name_ar || employee.last_name_ar) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">First Name (Arabic)</label>
                <div className="mt-1">{employee.first_name_ar || '-'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Name (Arabic)</label>
                <div className="mt-1">{employee.last_name_ar || '-'}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <div className="mt-1">{employee.gender || '-'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nationality</label>
              <div className="mt-1 flex items-center gap-2">
                {employee.nationality || '-'}
                <Badge variant={employee.is_saudi ? 'default' : 'secondary'}>
                  {employee.is_saudi ? 'Saudi' : 'Non-Saudi'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">National ID</label>
              <div className="mt-1">{employee.national_id || '-'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Iqama Number</label>
              <div className="mt-1">{employee.iqama_number || '-'}</div>
            </div>
          </div>
          
          {employee.passport_number && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Passport Number</label>
              <div className="mt-1">{employee.passport_number}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Employment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employee Number</label>
              <div className="mt-1 font-medium">{employee.employee_number}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={
                    employee.status === 'active' ? 'default' :
                    employee.status === 'terminated' ? 'destructive' : 'secondary'
                  }
                >
                  {employee.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Hire Date</label>
              <div className="mt-1 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {employee.department || '-'}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Position</label>
            <div className="mt-1">{employee.position || '-'}</div>
            {employee.position_ar && (
              <div className="text-sm text-muted-foreground">{employee.position_ar}</div>
            )}
          </div>

          {employee.job_location && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Job Location</label>
              <div className="mt-1">{employee.job_location}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="mt-1">{employee.email || '-'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <div className="mt-1">{employee.phone || '-'}</div>
            </div>
          </div>

          {employee.personal_email && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Personal Email</label>
              <div className="mt-1">{employee.personal_email}</div>
            </div>
          )}

          {employee.company_email && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company Email</label>
              <div className="mt-1">{employee.company_email}</div>
            </div>
          )}

          {employee.national_address && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">National Address</label>
              <div className="mt-1">{employee.national_address}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Information */}
      {(employee.family_status || employee.number_of_wives || employee.number_of_children) && (
        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.family_status && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Family Status</label>
                <div className="mt-1">{employee.family_status}</div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {employee.number_of_wives !== undefined && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Number of Wives</label>
                  <div className="mt-1">{employee.number_of_wives}</div>
                </div>
              )}
              {employee.number_of_children !== undefined && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Number of Children</label>
                  <div className="mt-1">{employee.number_of_children}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};