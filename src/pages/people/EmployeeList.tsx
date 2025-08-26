import React, { useState, useMemo } from 'react';
import { LinkL } from '@/lib/i18n/LinkL';
import { Search, Filter, Download, UserPlus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnhancedEmployees } from '@/hooks/useEnhancedEmployees';
import { useDepartments } from '@/hooks/useDepartments';

const EmployeeList: React.FC = () => {
  const { employees, loading, error } = useEnhancedEmployees();
  const { departments } = useDepartments();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      const matchesNationality = nationalityFilter === 'all' || 
        (nationalityFilter === 'saudi' ? employee.is_saudi : !employee.is_saudi);

      return matchesSearch && matchesDepartment && matchesStatus && matchesNationality;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter, nationalityFilter]);

  const exportToCsv = () => {
    const csvHeaders = 'Employee Number,Name,Department,Position,Status,Nationality,Hire Date,Email\n';
    const csvData = filteredEmployees.map(emp => 
      `"${emp.employee_number}","${emp.first_name} ${emp.last_name}","${emp.department || ''}","${emp.position || ''}","${emp.status}","${emp.nationality || ''}","${emp.hire_date || ''}","${emp.email || ''}"`
    ).join('\n');
    
    const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      inactive: 'secondary',
      terminated: 'destructive',
      on_leave: 'secondary'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">Loading employees...</div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Master Data</h1>
          <p className="text-muted-foreground">Manage and view employee records</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCsv} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button asChild>
            <LinkL to="/people/employees/new">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </LinkL>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{employees.length}</div>
          <div className="text-sm text-muted-foreground">Total Employees</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {employees.filter(e => e.status === 'active').length}
          </div>
          <div className="text-sm text-muted-foreground">Active</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {employees.filter(e => e.is_saudi).length}
          </div>
          <div className="text-sm text-muted-foreground">Saudi Nationals</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {Math.round((employees.filter(e => e.is_saudi).length / employees.length) * 100) || 0}%
          </div>
          <div className="text-sm text-muted-foreground">Saudization Rate</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>

          <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="saudi">Saudi</SelectItem>
              <SelectItem value="non-saudi">Non-Saudi</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || departmentFilter !== 'all' || statusFilter !== 'all' || nationalityFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('all');
                setStatusFilter('all');
                setNationalityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Employee Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map(employee => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.employee_number}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{employee.first_name} {employee.last_name}</div>
                    <div className="text-sm text-muted-foreground">{employee.email}</div>
                  </div>
                </TableCell>
                <TableCell>{employee.department || '-'}</TableCell>
                <TableCell>{employee.position || '-'}</TableCell>
                <TableCell>{getStatusBadge(employee.status)}</TableCell>
                <TableCell>
                  <Badge variant={employee.is_saudi ? 'default' : 'secondary'}>
                    {employee.is_saudi ? 'Saudi' : 'Non-Saudi'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="sm">
                    <LinkL to={`/people/employees/${employee.id}`}>
                      <Eye className="h-4 w-4" />
                    </LinkL>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No employees found matching the current filters.
          </div>
        )}
      </Card>
      
      {/* AI Integration for People - Employee List */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="employee-list" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'data-analytics', 'search-intelligence', 'workforce-insights']}
      />
    </div>
  );
};

export default EmployeeList;