import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Briefcase,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const EmployeePage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const navigate = useNavigate();

  const employeeStats = [
    {
      label: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: isArabic ? 'الموظفون النشطون' : 'Active Employees',
      value: '2,534',
      change: '+2%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: isArabic ? 'الموظفون الجدد هذا الشهر' : 'New This Month',
      value: '45',
      change: '+15%',
      icon: UserPlus,
      color: 'text-purple-600'
    },
    {
      label: isArabic ? 'الأقسام' : 'Departments',
      value: '24',
      change: '0',
      icon: Briefcase,
      color: 'text-orange-600'
    }
  ];

  const recentEmployees = [
    {
      id: 'EMP001',
      name: isArabic ? 'أحمد محمد السالم' : 'Ahmed Mohamed Al-Salem',
      position: isArabic ? 'مطور برامج أول' : 'Senior Software Developer',
      department: isArabic ? 'تقنية المعلومات' : 'IT Department',
      location: isArabic ? 'الرياض' : 'Riyadh',
      phone: '+966 50 123 4567',
      email: 'ahmed.salem@company.com',
      startDate: '2024-01-15',
      status: 'active',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'EMP002',
      name: isArabic ? 'فاطمة عبدالله النهدي' : 'Fatima Abdullah Al-Nahdi',
      position: isArabic ? 'مدير الموارد البشرية' : 'HR Manager',
      department: isArabic ? 'الموارد البشرية' : 'Human Resources',
      location: isArabic ? 'جدة' : 'Jeddah',
      phone: '+966 55 987 6543',
      email: 'fatima.nahdi@company.com',
      startDate: '2023-11-20',
      status: 'active',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'EMP003',
      name: isArabic ? 'محمد علي القحطاني' : 'Mohammed Ali Al-Qahtani',
      position: isArabic ? 'محاسب أول' : 'Senior Accountant',
      department: isArabic ? 'المالية' : 'Finance',
      location: isArabic ? 'الدمام' : 'Dammam',
      phone: '+966 56 456 7890',
      email: 'mohammed.qahtani@company.com',
      startDate: '2024-02-01',
      status: 'active',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const departments = [
    { name: isArabic ? 'تقنية المعلومات' : 'Information Technology', count: 145, color: 'bg-blue-500' },
    { name: isArabic ? 'الموارد البشرية' : 'Human Resources', count: 28, color: 'bg-green-500' },
    { name: isArabic ? 'المالية' : 'Finance', count: 67, color: 'bg-purple-500' },
    { name: isArabic ? 'التسويق' : 'Marketing', count: 89, color: 'bg-orange-500' },
    { name: isArabic ? 'المبيعات' : 'Sales', count: 156, color: 'bg-red-500' },
    { name: isArabic ? 'العمليات' : 'Operations', count: 234, color: 'bg-indigo-500' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { variant: 'default' as const, label: isArabic ? 'نشط' : 'Active' };
      case 'inactive': return { variant: 'secondary' as const, label: isArabic ? 'غير نشط' : 'Inactive' };
      case 'pending': return { variant: 'outline' as const, label: isArabic ? 'معلق' : 'Pending' };
      default: return { variant: 'outline' as const, label: status };
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">
              {isArabic ? 'إدارة الموظفين' : 'Employee Management'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic 
                ? 'إدارة شاملة لجميع بيانات الموظفين'
                : 'Comprehensive management of all employee data'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/employees?action=add')}>
            <UserPlus className="h-4 w-4 mr-2" />
            {isArabic ? 'إضافة موظف' : 'Add Employee'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {isArabic ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="employees">
            {isArabic ? 'الموظفون' : 'Employees'}
          </TabsTrigger>
          <TabsTrigger value="departments">
            {isArabic ? 'الأقسام' : 'Departments'}
          </TabsTrigger>
          <TabsTrigger value="reports">
            {isArabic ? 'التقارير' : 'Reports'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {employeeStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <Badge variant="outline" className="w-fit">
                        {stat.change}
                      </Badge>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'توزيع الموظفين حسب القسم' : 'Employee Distribution by Department'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${dept.color}`} />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <Badge variant="secondary">{dept.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6 mt-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <CardTitle>
                  {isArabic ? 'قائمة الموظفين' : 'Employee List'}
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={isArabic ? 'البحث عن موظف...' : 'Search employees...'}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {isArabic ? 'فلترة' : 'Filter'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEmployees.map((employee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{employee.name}</span>
                          <Badge {...getStatusBadge(employee.status)} />
                        </div>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {employee.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {employee.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {employee.startDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'إدارة الأقسام' : 'Department Management'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'عرض وإدارة جميع أقسام الشركة'
                  : 'View and manage all company departments'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center`}>
                          <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="secondary">{dept.count} {isArabic ? 'موظف' : 'employees'}</Badge>
                      </div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {isArabic ? 'إجمالي الموظفين:' : 'Total Employees:'}
                        </span>
                        <span className="font-semibold">{dept.count}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {isArabic ? 'تقرير الموظفين' : 'Employee Report'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic 
                    ? 'تقرير شامل عن جميع بيانات الموظفين'
                    : 'Comprehensive report of all employee data'
                  }
                </p>
                <Button className="w-full">
                  {isArabic ? 'إنشاء التقرير' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {isArabic ? 'تقرير الأقسام' : 'Department Report'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic 
                    ? 'تقرير توزيع الموظفين حسب الأقسام'
                    : 'Employee distribution by departments'
                  }
                </p>
                <Button variant="outline" className="w-full">
                  {isArabic ? 'إنشاء التقرير' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {isArabic ? 'التقرير الشهري' : 'Monthly Report'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic 
                    ? 'تقرير شهري لأنشطة الموظفين'
                    : 'Monthly employee activity report'
                  }
                </p>
                <Button variant="secondary" className="w-full">
                  {isArabic ? 'إنشاء التقرير' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Integration for Employee Management */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="employee-management" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'hr-processes', 'organizational-structure']}
      />
    </div>
  );
};

export default EmployeePage;