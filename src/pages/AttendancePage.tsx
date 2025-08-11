import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Clock,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const AttendancePage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  const attendanceStats = [
    {
      label: isArabic ? 'الحضور اليوم' : 'Present Today',
      value: '2,534',
      percentage: '89.1%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: isArabic ? 'الغياب اليوم' : 'Absent Today',
      value: '156',
      percentage: '5.5%',
      icon: XCircle,
      color: 'text-red-600'
    },
    {
      label: isArabic ? 'التأخير' : 'Late Arrival',
      value: '89',
      percentage: '3.1%',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      label: isArabic ? 'الإجازات' : 'On Leave',
      value: '68',
      percentage: '2.4%',
      icon: Calendar,
      color: 'text-blue-600'
    }
  ];

  const recentAttendance = [
    {
      id: 'EMP001',
      name: isArabic ? 'أحمد محمد السالم' : 'Ahmed Mohamed Al-Salem',
      department: isArabic ? 'تقنية المعلومات' : 'IT Department',
      checkIn: '08:15',
      checkOut: '--',
      workingHours: '4h 45m',
      status: 'present',
      overtime: '0h'
    },
    {
      id: 'EMP002',
      name: isArabic ? 'فاطمة عبدالله النهدي' : 'Fatima Abdullah Al-Nahdi',
      department: isArabic ? 'الموارد البشرية' : 'Human Resources',
      checkIn: '08:00',
      checkOut: '17:30',
      workingHours: '8h 30m',
      status: 'completed',
      overtime: '0h 30m'
    },
    {
      id: 'EMP003',
      name: isArabic ? 'محمد علي القحطاني' : 'Mohammed Ali Al-Qahtani',
      department: isArabic ? 'المالية' : 'Finance',
      checkIn: '09:15',
      checkOut: '--',
      workingHours: '3h 45m',
      status: 'late',
      overtime: '0h'
    },
    {
      id: 'EMP004',
      name: isArabic ? 'سارة أحمد الخالدي' : 'Sara Ahmed Al-Khalidi',
      department: isArabic ? 'التسويق' : 'Marketing',
      checkIn: '--',
      checkOut: '--',
      workingHours: '0h',
      status: 'absent',
      overtime: '0h'
    },
    {
      id: 'EMP005',
      name: isArabic ? 'عبدالرحمن سالم المطيري' : 'Abdulrahman Salem Al-Mutairi',
      department: isArabic ? 'المبيعات' : 'Sales',
      checkIn: '08:30',
      checkOut: '18:00',
      workingHours: '8h 30m',
      status: 'completed',
      overtime: '1h'
    }
  ];

  const weeklyAttendance = [
    { day: isArabic ? 'الأحد' : 'Sunday', present: 2456, absent: 112, late: 67 },
    { day: isArabic ? 'الاثنين' : 'Monday', present: 2534, absent: 89, late: 45 },
    { day: isArabic ? 'الثلاثاء' : 'Tuesday', present: 2487, absent: 134, late: 78 },
    { day: isArabic ? 'الأربعاء' : 'Wednesday', present: 2523, absent: 98, late: 56 },
    { day: isArabic ? 'الخميس' : 'Thursday', present: 2534, absent: 156, late: 89 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return { variant: 'default' as const, label: isArabic ? 'حاضر' : 'Present', color: 'bg-green-500' };
      case 'absent':
        return { variant: 'destructive' as const, label: isArabic ? 'غائب' : 'Absent', color: 'bg-red-500' };
      case 'late':
        return { variant: 'secondary' as const, label: isArabic ? 'متأخر' : 'Late', color: 'bg-orange-500' };
      case 'completed':
        return { variant: 'outline' as const, label: isArabic ? 'مكتمل' : 'Completed', color: 'bg-blue-500' };
      default:
        return { variant: 'outline' as const, label: status, color: 'bg-gray-500' };
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">
              {isArabic ? 'الحضور والانصراف' : 'Time & Attendance'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic 
                ? 'نظام شامل لتتبع أوقات العمل والحضور'
                : 'Comprehensive system for tracking work hours and attendance'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {isArabic ? 'تصدير التقرير' : 'Export Report'}
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            {isArabic ? 'تقرير شهري' : 'Monthly Report'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">
            {isArabic ? 'اليوم' : 'Today'}
          </TabsTrigger>
          <TabsTrigger value="weekly">
            {isArabic ? 'أسبوعي' : 'Weekly'}
          </TabsTrigger>
          <TabsTrigger value="employees">
            {isArabic ? 'الموظفون' : 'Employees'}
          </TabsTrigger>
          <TabsTrigger value="reports">
            {isArabic ? 'التقارير' : 'Reports'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6 mt-6">
          {/* Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {attendanceStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <Badge variant="outline" className="w-fit">
                        {stat.percentage}
                      </Badge>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Today's Activity */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'نشاط اليوم' : "Today's Activity"}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'تفاصيل حضور وانصراف الموظفين لهذا اليوم'
                  : 'Employee check-in and check-out details for today'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAttendance.slice(0, 10).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusBadge(record.status).color}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{record.name}</span>
                          <Badge {...getStatusBadge(record.status)} />
                        </div>
                        <p className="text-sm text-muted-foreground">{record.department}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-8 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">{isArabic ? 'دخول' : 'Check In'}</p>
                        <p className="font-medium">{record.checkIn}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">{isArabic ? 'خروج' : 'Check Out'}</p>
                        <p className="font-medium">{record.checkOut}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">{isArabic ? 'ساعات العمل' : 'Work Hours'}</p>
                        <p className="font-medium">{record.workingHours}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">{isArabic ? 'إضافي' : 'Overtime'}</p>
                        <p className="font-medium">{record.overtime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'تقرير الحضور الأسبوعي' : 'Weekly Attendance Report'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyAttendance.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="font-medium w-24">{day.day}</div>
                    <div className="flex gap-8">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{isArabic ? 'حاضر' : 'Present'}</p>
                        <p className="text-lg font-semibold text-green-600">{day.present}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{isArabic ? 'غائب' : 'Absent'}</p>
                        <p className="text-lg font-semibold text-red-600">{day.absent}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{isArabic ? 'متأخر' : 'Late'}</p>
                        <p className="text-lg font-semibold text-orange-600">{day.late}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{isArabic ? 'النسبة' : 'Rate'}</p>
                        <p className="text-lg font-semibold">
                          {((day.present / (day.present + day.absent + day.late)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
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
                  {isArabic ? 'سجلات الموظفين' : 'Employee Records'}
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={isArabic ? 'البحث عن موظف...' : 'Search employee...'}
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
                {recentAttendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusBadge(record.status).color}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{record.name}</span>
                          <span className="text-sm text-muted-foreground">({record.id})</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge {...getStatusBadge(record.status)} />
                      <span className="text-sm font-medium">{record.workingHours}</span>
                    </div>
                  </div>
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
                  <Calendar className="h-5 w-5" />
                  {isArabic ? 'التقرير اليومي' : 'Daily Report'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic 
                    ? 'تقرير مفصل عن حضور اليوم'
                    : 'Detailed report of today\'s attendance'
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
                  <TrendingUp className="h-5 w-5" />
                  {isArabic ? 'التقرير الأسبوعي' : 'Weekly Report'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic 
                    ? 'تحليل اتجاهات الحضور الأسبوعية'
                    : 'Weekly attendance trends analysis'
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
                  <Users className="h-5 w-5" />
                  {isArabic ? 'تقرير الموظفين' : 'Employee Report'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic 
                    ? 'تقرير فردي لكل موظف'
                    : 'Individual employee attendance report'
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
    </div>
  );
};

export default AttendancePage;