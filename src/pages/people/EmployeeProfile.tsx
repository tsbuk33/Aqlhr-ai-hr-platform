import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LinkL } from '@/lib/i18n/LinkL';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEnhancedEmployees } from '@/hooks/useEnhancedEmployees';
import { EmployeeSummaryTab } from '@/components/people/EmployeeSummaryTab';
import { EmployeeJobCompTab } from '@/components/people/EmployeeJobCompTab';
import { EmployeeOrgTab } from '@/components/people/EmployeeOrgTab';
import { EmployeeDocumentsTab } from '@/components/people/EmployeeDocumentsTab';
import { EmployeeTrainingTab } from '@/components/people/EmployeeTrainingTab';
import { EmployeeLeaveTab } from '@/components/people/EmployeeLeaveTab';

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { employees, loading, error } = useEnhancedEmployees();
  const [activeTab, setActiveTab] = useState('summary');

  const employee = employees.find(emp => emp.id === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">Loading employee profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-destructive">Error: {error}</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium">Employee not found</div>
          <div className="text-muted-foreground">The employee you're looking for doesn't exist.</div>
          <Button asChild className="mt-4">
            <LinkL to="/people/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </LinkL>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      inactive: 'secondary',
      terminated: 'destructive',
      on_leave: 'secondary'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <LinkL to="/people/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </LinkL>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Employee Profile</h1>
            <p className="text-muted-foreground">#{employee.employee_number}</p>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Employee Header Card */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(employee.first_name, employee.last_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {employee.first_name} {employee.last_name}
                </h2>
                <p className="text-lg text-muted-foreground mb-2">{employee.position || 'No position assigned'}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {employee.department || 'No department'}
                  </div>
                  {employee.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {employee.email}
                    </div>
                  )}
                  {employee.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {employee.phone}
                    </div>
                  )}
                  {employee.hire_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(employee.hire_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                {getStatusBadge(employee.status)}
                <div className="mt-2">
                  <Badge variant={employee.is_saudi ? 'default' : 'secondary'}>
                    {employee.is_saudi ? 'Saudi National' : 'Non-Saudi'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="job-comp">Job & Comp</TabsTrigger>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <EmployeeSummaryTab employee={employee} />
        </TabsContent>

        <TabsContent value="job-comp">
          <EmployeeJobCompTab employee={employee} />
        </TabsContent>

        <TabsContent value="org">
          <EmployeeOrgTab employee={employee} />
        </TabsContent>

        <TabsContent value="documents">
          <EmployeeDocumentsTab employee={employee} />
        </TabsContent>

        <TabsContent value="training">
          <EmployeeTrainingTab employee={employee} />
        </TabsContent>

        <TabsContent value="leave">
          <EmployeeLeaveTab employee={employee} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;