import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Award, Calendar } from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import type { Employee } from '@/hooks/useEmployees';

interface EmployeeJobCompTabProps {
  employee: Employee;
}

export const EmployeeJobCompTab: React.FC<EmployeeJobCompTabProps> = ({ employee }) => {
  const formatSalary = (amount: number | undefined) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Current Position</label>
            <div className="mt-1 font-medium">{employee.position || '-'}</div>
            {employee.position_ar && (
              <div className="text-sm text-muted-foreground">{employee.position_ar}</div>
            )}
          </div>

          {employee.actual_job_title && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Actual Job Title</label>
              <div className="mt-1">{employee.actual_job_title}</div>
              {employee.actual_job_title_ar && (
                <div className="text-sm text-muted-foreground">{employee.actual_job_title_ar}</div>
              )}
            </div>
          )}

          {employee.iqama_title && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Iqama Title</label>
              <div className="mt-1">{employee.iqama_title}</div>
              {employee.iqama_title_ar && (
                <div className="text-sm text-muted-foreground">{employee.iqama_title_ar}</div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <div className="mt-1">{employee.department || '-'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contract Type</label>
              <div className="mt-1">{employee.contract_type || '-'}</div>
            </div>
          </div>

          {employee.job_description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Job Description</label>
              <div className="mt-1 text-sm">{employee.job_description}</div>
            </div>
          )}

          {employee.kpis && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Key Performance Indicators</label>
              <div className="mt-1 text-sm">{employee.kpis}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compensation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyIcon className="h-5 w-5" />
            Compensation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Basic Salary</label>
              <div className="mt-1 text-lg font-semibold text-primary">
                {formatSalary(employee.basic_salary || employee.salary)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Housing Allowance</label>
              <div className="mt-1">
                {employee.housing_allowance_percentage ? 
                  `${employee.housing_allowance_percentage}%` : '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Transportation Allowance</label>
              <div className="mt-1">
                {employee.transportation_allowance_percentage ? 
                  `${employee.transportation_allowance_percentage}%` : '-'}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Annual Bonus</label>
              <div className="mt-1">
                {formatSalary(employee.agreed_annual_bonus)}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">GOSI Information</label>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary">
                {employee.gosi_system_type || 'Not Set'}
              </Badge>
              {employee.gosi_employee_rate && (
                <span className="text-sm text-muted-foreground">
                  Employee: {employee.gosi_employee_rate}%
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Overtime Eligible</label>
            <div className="mt-1">
              <Badge variant={employee.overtime_eligible ? 'default' : 'secondary'}>
                {employee.overtime_eligible ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits & Allowances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Benefits & Allowances
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company Housing</label>
              <div className="mt-1">
                <Badge variant={employee.company_housing ? 'default' : 'secondary'}>
                  {employee.company_housing ? 'Provided' : 'Not Provided'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Transportation</label>
              <div className="mt-1">
                <Badge variant={employee.company_provides_transportation ? 'default' : 'secondary'}>
                  {employee.company_provides_transportation ? 'Provided' : 'Not Provided'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company SIM Card</label>
              <div className="mt-1">
                <Badge variant={employee.company_sim_card ? 'default' : 'secondary'}>
                  {employee.company_sim_card ? 'Provided' : 'Not Provided'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Parents Medical Insurance</label>
              <div className="mt-1">
                <Badge variant={employee.parents_medical_insurance ? 'default' : 'secondary'}>
                  {employee.parents_medical_insurance ? 'Covered' : 'Not Covered'}
                </Badge>
              </div>
            </div>
          </div>

          {employee.annual_tickets_type && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Annual Tickets Type</label>
                <div className="mt-1">{employee.annual_tickets_type}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Annual Tickets Count</label>
                <div className="mt-1">{employee.annual_tickets_count || '-'}</div>
              </div>
            </div>
          )}

          {employee.vacation_days_per_year && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Vacation Days Per Year</label>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {employee.vacation_days_per_year} days
              </div>
            </div>
          )}

          {employee.other_benefits && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Other Benefits</label>
              <div className="mt-1 text-sm">{employee.other_benefits}</div>
              {employee.other_benefits_ar && (
                <div className="text-sm text-muted-foreground">{employee.other_benefits_ar}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Information */}
      {(employee.project_name || employee.work_location) && (
        <Card>
          <CardHeader>
            <CardTitle>Project & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.project_name && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                <div className="mt-1">{employee.project_name}</div>
                {employee.project_name_ar && (
                  <div className="text-sm text-muted-foreground">{employee.project_name_ar}</div>
                )}
              </div>
            )}

            {employee.project_number && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Number</label>
                  <div className="mt-1">{employee.project_number}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Cost Number</label>
                  <div className="mt-1">{employee.project_cost_number || '-'}</div>
                </div>
              </div>
            )}

            {employee.work_location && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Work Location</label>
                <div className="mt-1">{employee.work_location}</div>
                {employee.work_location_ar && (
                  <div className="text-sm text-muted-foreground">{employee.work_location_ar}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};