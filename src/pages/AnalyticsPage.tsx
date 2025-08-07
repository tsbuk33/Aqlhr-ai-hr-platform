import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, Building, MapPin, Calendar, Target, Award, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

interface Employee {
  id: string;
  department: string;
  position: string;
  salary: number;
  nationality: string;
  is_saudi: boolean;
  hire_date: string;
  status: string;
}

const AnalyticsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch employees data
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['analytics-employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      
      if (error) throw error;
      return data as Employee[];
    }
  });

  // Calculate analytics
  const analytics = React.useMemo(() => {
    if (!employees.length) return null;

    const totalEmployees = employees.length;
    const saudiEmployees = employees.filter(emp => emp.is_saudi).length;
    const nonSaudiEmployees = totalEmployees - saudiEmployees;
    const saudizationRate = (saudiEmployees / totalEmployees) * 100;

    // Department breakdown
    const departmentData = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const departmentChart = Object.entries(departmentData).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalEmployees) * 100).toFixed(1)
    }));

    // Salary analytics
    const salaries = employees.map(emp => emp.salary);
    const avgSalary = salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length;
    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);

    // Salary by department
    const salaryByDept = Object.entries(departmentData).map(([dept]) => {
      const deptEmployees = employees.filter(emp => emp.department === dept);
      const deptSalaries = deptEmployees.map(emp => emp.salary);
      const avgDeptSalary = deptSalaries.reduce((sum, sal) => sum + sal, 0) / deptSalaries.length;
      
      return {
        department: dept,
        avgSalary: avgDeptSalary,
        employeeCount: deptEmployees.length,
        saudiCount: deptEmployees.filter(emp => emp.is_saudi).length,
        saudizationRate: (deptEmployees.filter(emp => emp.is_saudi).length / deptEmployees.length) * 100
      };
    });

    // Nationality breakdown
    const nationalityData = employees.reduce((acc, emp) => {
      const key = emp.is_saudi ? 'Saudi' : emp.nationality;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const nationalityChart = Object.entries(nationalityData).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalEmployees) * 100).toFixed(1)
    }));

    // Hiring trends (by year)
    const hiringTrends = employees.reduce((acc, emp) => {
      const year = new Date(emp.hire_date).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const hiringChart = Object.entries(hiringTrends).map(([year, count]) => ({
      year: year.toString(),
      hires: count,
      saudi: employees.filter(emp => 
        new Date(emp.hire_date).getFullYear() === parseInt(year) && emp.is_saudi
      ).length,
      nonSaudi: employees.filter(emp => 
        new Date(emp.hire_date).getFullYear() === parseInt(year) && !emp.is_saudi
      ).length
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));

    return {
      overview: {
        totalEmployees,
        saudiEmployees,
        nonSaudiEmployees,
        saudizationRate,
        avgSalary,
        minSalary,
        maxSalary
      },
      departmentChart,
      nationalityChart,
      salaryByDept,
      hiringChart
    };
  }, [employees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Analytics</h1>
          <p className="text-muted-foreground">No employee data available for analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive workforce analytics for Almalz Contracting Company
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workforce">Workforce</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workforce</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  Active employees
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saudization Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.saudizationRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.overview.saudiEmployees} Saudi nationals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold break-words">{formatCurrency(analytics.overview.avgSalary)}</div>
                <p className="text-xs text-muted-foreground break-words">
                  Company average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.departmentChart.length}</div>
                <p className="text-xs text-muted-foreground break-words">
                  Active departments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee count by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.departmentChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.departmentChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nationality Breakdown</CardTitle>
                <CardDescription>Workforce composition by nationality</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.nationalityChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workforce" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Analysis</CardTitle>
              <CardDescription>Detailed breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.salaryByDept.map((dept, index) => (
                  <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <div>
                        <h3 className="font-semibold">{dept.department}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dept.employeeCount} employees
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={dept.saudizationRate >= 60 ? "default" : "destructive"}>
                        {dept.saudizationRate.toFixed(1)}% Saudi
                      </Badge>
                      <p className="text-sm font-medium">{formatCurrency(dept.avgSalary)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compensation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Salary Distribution</CardTitle>
                <CardDescription>Average salary by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.salaryByDept} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
                    <YAxis tickFormatter={(value) => `${value/1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="avgSalary" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compensation Summary</CardTitle>
                <CardDescription>Key salary metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span className="font-medium">Average Salary</span>
                  <span className="text-lg font-bold">{formatCurrency(analytics.overview.avgSalary)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span className="font-medium">Highest Salary</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(analytics.overview.maxSalary)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span className="font-medium">Lowest Salary</span>
                  <span className="text-lg font-bold text-orange-600">{formatCurrency(analytics.overview.minSalary)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span className="font-medium">Total Payroll</span>
                  <span className="text-lg font-bold">{formatCurrency(analytics.overview.avgSalary * analytics.overview.totalEmployees)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Trends</CardTitle>
              <CardDescription>Employee hiring patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analytics.hiringChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="saudi"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    name="Saudi Hires"
                  />
                  <Area
                    type="monotone"
                    dataKey="nonSaudi"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    name="Non-Saudi Hires"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Saudization Achievement</h4>
                  <p className="text-sm text-blue-700">
                    Current saudization rate is {analytics.overview.saudizationRate.toFixed(1)}%, 
                    {analytics.overview.saudizationRate >= 60 ? ' exceeding' : ' below'} the 60% target.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <Building className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Department Balance</h4>
                  <p className="text-sm text-green-700">
                    Construction is the largest department with {analytics.departmentChart.find(d => d.name === 'Construction')?.value || 0} employees.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <DollarSign className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900">Compensation Range</h4>
                  <p className="text-sm text-orange-700">
                    Salary range spans {formatCurrency(analytics.overview.maxSalary - analytics.overview.minSalary)} 
                    from {formatCurrency(analytics.overview.minSalary)} to {formatCurrency(analytics.overview.maxSalary)}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AqlHRAIAssistant moduleContext="analytics.dashboard" />
    </div>
  );
};

export default AnalyticsPage;