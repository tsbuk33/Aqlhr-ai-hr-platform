import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Clock, CalendarDays, Users, AlertTriangle, CheckCircle, XCircle,
  Timer, MapPin, Smartphone, TrendingUp, TrendingDown, BarChart3,
  ArrowRight, Plus, FileText, Download, Upload, Calculator,
  Eye, Edit, Trash2, Clock3, Coffee, Plane, Hospital, Building
} from 'lucide-react';

interface Employee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  first_name_ar?: string;
  last_name_ar?: string;
  department?: string;
  position?: string;
  hire_date?: string;
  work_location?: string;
  work_location_ar?: string;
  is_saudi?: boolean;
  basic_salary?: number;
}

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  actual_hours: number;
  overtime_hours: number;
  late_minutes: number;
  status: string;
  location_check_in?: string;
  is_ramadan_schedule: boolean;
}

interface LeaveBalance {
  id: string;
  employee_id: string;
  leave_type: string;
  year: number;
  total_entitlement: number;
  used_days: number;
  remaining_days: number;
}

const TimeAttendance = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timesheet');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .order('employee_number');

      if (employeesError) throw employeesError;

      // Fetch attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_timesheet')
        .select('*')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (attendanceError) throw attendanceError;

      // Fetch leave balances
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('year', new Date().getFullYear());

      if (leaveError) throw leaveError;

      setEmployees(employeesData || []);
      setAttendanceRecords(attendanceData || []);
      setLeaveBalances(leaveData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في تحميل البيانات' : 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateVacationBalance = (employeeId: string, hireDate: string) => {
    if (!hireDate) return { entitlement: 0, used: 0, remaining: 0 };
    
    const serviceYears = Math.floor((Date.now() - new Date(hireDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const entitlement = serviceYears >= 5 ? 30 : 21; // Saudi labor law
    
    const balance = leaveBalances.find(b => b.employee_id === employeeId && b.leave_type === 'annual');
    const used = balance?.used_days || 0;
    
    return {
      entitlement,
      used,
      remaining: entitlement - used
    };
  };

  const stats = [
    {
      title: language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees',
      value: employees.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: language === 'ar' ? 'الحضور اليوم' : 'Present Today',
      value: attendanceRecords.filter(r => 
        r.date === new Date().toISOString().split('T')[0] && r.check_in_time
      ).length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: language === 'ar' ? 'متأخرين اليوم' : 'Late Today',
      value: attendanceRecords.filter(r => 
        r.date === new Date().toISOString().split('T')[0] && r.late_minutes > 15
      ).length.toString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: language === 'ar' ? 'غائبين اليوم' : 'Absent Today',
      value: (employees.length - attendanceRecords.filter(r => 
        r.date === new Date().toISOString().split('T')[0] && r.check_in_time
      ).length).toString(),
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    }
  ];

  const leaveTypes = [
    { key: 'annual', name: language === 'ar' ? 'إجازة سنوية' : 'Annual Leave', icon: CalendarDays },
    { key: 'sick', name: language === 'ar' ? 'إجازة مرضية' : 'Sick Leave', icon: Hospital },
    { key: 'short', name: language === 'ar' ? 'إجازة قصيرة' : 'Short Leave', icon: Clock3 },
    { key: 'emergency', name: language === 'ar' ? 'إجازة طارئة' : 'Emergency Leave', icon: AlertTriangle },
    { key: 'unpaid', name: language === 'ar' ? 'إجازة بدون راتب' : 'Unpaid Leave', icon: XCircle },
    { key: 'hospital_visit', name: language === 'ar' ? 'زيارة مستشفى' : 'Hospital Visit', icon: Hospital },
    { key: 'site_visit', name: language === 'ar' ? 'زيارة موقع' : 'Site Visit', icon: Building },
    { key: 'meeting', name: language === 'ar' ? 'اجتماع خارجي' : 'Outside Meeting', icon: Users }
  ];

  const TimesheetTab = () => (
    <div className="space-y-6">
      {/* Timesheet Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {language === 'ar' ? 'جدول الحضور الأسبوعي' : 'Weekly Timesheet'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'أسبوع العمل: الأحد - الخميس | ساعات العمل: 8 ساعات يومياً | 40 ساعة أسبوعياً'
              : 'Work Week: Sunday - Thursday | Work Hours: 8 hours daily | 40 hours weekly'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>{language === 'ar' ? 'اختر الموظف' : 'Select Employee'}</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر الموظف' : 'Select Employee'} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.employee_number} - {language === 'ar' 
                        ? `${employee.first_name_ar || employee.first_name} ${employee.last_name_ar || employee.last_name}`
                        : `${employee.first_name} ${employee.last_name}`
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{language === 'ar' ? 'اختر التاريخ' : 'Select Date'}</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Weekly Timesheet Grid */}
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-8 bg-muted">
              <div className="p-3 font-medium">{language === 'ar' ? 'التفاصيل' : 'Details'}</div>
              <div className="p-3 font-medium text-center">{language === 'ar' ? 'الأحد' : 'Sun'}</div>
              <div className="p-3 font-medium text-center">{language === 'ar' ? 'الإثنين' : 'Mon'}</div>
              <div className="p-3 font-medium text-center">{language === 'ar' ? 'الثلاثاء' : 'Tue'}</div>
              <div className="p-3 font-medium text-center">{language === 'ar' ? 'الأربعاء' : 'Wed'}</div>
              <div className="p-3 font-medium text-center">{language === 'ar' ? 'الخميس' : 'Thu'}</div>
              <div className="p-3 font-medium text-center">{language === 'ar' ? 'المجموع' : 'Total'}</div>
              <div className="p-3 font-medium text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</div>
            </div>
            
            {/* Check In Row */}
            <div className="grid grid-cols-8 border-t">
              <div className="p-3 font-medium">{language === 'ar' ? 'تسجيل الدخول' : 'Check In'}</div>
              {[0,1,2,3,4].map(day => (
                <div key={day} className="p-3 text-center text-sm">08:00</div>
              ))}
              <div className="p-3 text-center text-sm font-medium">40:00</div>
              <div className="p-3 text-center">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Check Out Row */}
            <div className="grid grid-cols-8 border-t">
              <div className="p-3 font-medium">{language === 'ar' ? 'تسجيل الخروج' : 'Check Out'}</div>
              {[0,1,2,3,4].map(day => (
                <div key={day} className="p-3 text-center text-sm">17:00</div>
              ))}
              <div className="p-3 text-center text-sm font-medium">40:00</div>
              <div className="p-3 text-center">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Working Hours Row */}
            <div className="grid grid-cols-8 border-t bg-green-50">
              <div className="p-3 font-medium">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</div>
              {[0,1,2,3,4].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium">8.0</div>
              ))}
              <div className="p-3 text-center text-sm font-bold">40.0</div>
              <div className="p-3 text-center">
                <Badge variant="outline" className="text-green-600">
                  {language === 'ar' ? 'مكتمل' : 'Complete'}
                </Badge>
              </div>
            </div>

            {/* Overtime Row */}
            <div className="grid grid-cols-8 border-t bg-yellow-50">
              <div className="p-3 font-medium">{language === 'ar' ? 'الوقت الإضافي (150%)' : 'Overtime (150%)'}</div>
              {[0,1,2,3,4].map(day => (
                <div key={day} className="p-3 text-center text-sm">0.0</div>
              ))}
              <div className="p-3 text-center text-sm font-bold">0.0</div>
              <div className="p-3 text-center">
                <Button size="sm" variant="outline">
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Deductions Row */}
            <div className="grid grid-cols-8 border-t bg-red-50">
              <div className="p-3 font-medium">{language === 'ar' ? 'الخصومات' : 'Deductions'}</div>
              {[0,1,2,3,4].map(day => (
                <div key={day} className="p-3 text-center text-sm">0.0</div>
              ))}
              <div className="p-3 text-center text-sm font-bold">0.0</div>
              <div className="p-3 text-center">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LeaveManagementTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveTypes.map((type) => (
          <Card key={type.key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <type.icon className="h-4 w-4" />
                {type.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveBalances.filter(b => b.leave_type === type.key).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'طلبات نشطة' : 'Active Requests'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vacation Balance Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'حاسبة رصيد الإجازات' : 'Vacation Balance Calculator'}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'حسب قانون العمل السعودي: 21 يوم (1-5 سنوات خدمة) | 30 يوم (5+ سنوات)'
              : 'Per Saudi Labor Law: 21 days (1-5 years service) | 30 days (5+ years)'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedEmployee && employees.find(e => e.id === selectedEmployee) && (
            <div className="space-y-4">
              {(() => {
                const employee = employees.find(e => e.id === selectedEmployee);
                const vacationBalance = calculateVacationBalance(selectedEmployee, employee?.hire_date || '');
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-600">
                        {language === 'ar' ? 'الاستحقاق السنوي' : 'Annual Entitlement'}
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {vacationBalance.entitlement}
                      </div>
                      <div className="text-xs text-blue-600">
                        {language === 'ar' ? 'يوم' : 'days'}
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="text-sm font-medium text-yellow-600">
                        {language === 'ar' ? 'المستخدم' : 'Used'}
                      </div>
                      <div className="text-2xl font-bold text-yellow-700">
                        {vacationBalance.used}
                      </div>
                      <div className="text-xs text-yellow-600">
                        {language === 'ar' ? 'يوم' : 'days'}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-600">
                        {language === 'ar' ? 'الرصيد المتبقي' : 'Remaining Balance'}
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {vacationBalance.remaining}
                      </div>
                      <div className="text-xs text-green-600">
                        {language === 'ar' ? 'يوم' : 'days'}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const MobileAttendanceTab = () => (
    <div className="space-y-6">
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          {language === 'ar' 
            ? 'تطبيق الحضور المحمول متاح مع التحقق من الموقع الجغرافي والتصوير'
            : 'Mobile attendance app available with GPS verification and photo capture'
          }
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'تسجيل الحضور السريع' : 'Quick Punch'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'تسجيل دخول' : 'Check In'}
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <XCircle className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'تسجيل خروج' : 'Check Out'}
            </Button>
            <Button variant="secondary" className="w-full">
              <Coffee className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'استراحة' : 'Break'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'معلومات الموقع' : 'Location Info'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  {language === 'ar' ? 'المكتب الرئيسي - الرياض' : 'Main Office - Riyadh'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'ar' ? 'ضمن النطاق المسموح (50 متر)' : 'Within allowed range (50m)'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              {language === 'ar' ? 'معدل الحضور' : 'Attendance Rate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96.5%</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'آخر 30 يوم' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              {language === 'ar' ? 'متوسط ساعات العمل' : 'Avg Work Hours'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8.2</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'ساعة يومياً' : 'hours daily'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Timer className="h-4 w-4 text-yellow-600" />
              {language === 'ar' ? 'الوقت الإضافي' : 'Overtime'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">142</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'ساعة هذا الشهر' : 'hours this month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {language === 'ar' ? 'تحليلات الذكاء الاصطناعي' : 'AI Analytics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                {language === 'ar' 
                  ? 'اكتشاف نمط: زيادة في التأخير أيام الأحد والإثنين بنسبة 15%'
                  : 'Pattern detected: 15% increase in late arrivals on Sundays and Mondays'
                }
              </AlertDescription>
            </Alert>
            
            <Alert>
              <TrendingDown className="h-4 w-4" />
              <AlertDescription>
                {language === 'ar' 
                  ? 'توصية: تنفيذ جدول عمل مرن أيام بداية الأسبوع'
                  : 'Recommendation: Implement flexible schedule for week start days'
                }
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const WorkplaceTransferTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'طلب نقل موظف' : 'Employee Transfer Request'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{language === 'ar' ? 'الموظف' : 'Employee'}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر الموظف' : 'Select Employee'} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.employee_number} - {language === 'ar' 
                        ? `${employee.first_name_ar || employee.first_name} ${employee.last_name_ar || employee.last_name}`
                        : `${employee.first_name} ${employee.last_name}`
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{language === 'ar' ? 'من موقع' : 'From Location'}</Label>
              <Input placeholder={language === 'ar' ? 'الموقع الحالي' : 'Current Location'} />
            </div>
            <div>
              <Label>{language === 'ar' ? 'إلى موقع' : 'To Location'}</Label>
              <Input placeholder={language === 'ar' ? 'الموقع الجديد' : 'New Location'} />
            </div>
            <div>
              <Label>{language === 'ar' ? 'تاريخ النقل' : 'Transfer Date'}</Label>
              <Input type="date" />
            </div>
          </div>
          <div className="mt-4">
            <Button>
              <ArrowRight className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'إرسال طلب النقل' : 'Submit Transfer Request'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transfers */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'عمليات النقل الأخيرة' : 'Recent Transfers'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">Ahmed Al-Saudi</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الرياض → جدة' : 'Riyadh → Jeddah'}
                </div>
              </div>
              <Badge variant="outline">
                {language === 'ar' ? 'معلق' : 'Pending'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'الحضور وجدولة العمل' : 'Time & Attendance'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'نظام شامل لإدارة الحضور والوقت مع الامتثال لقانون العمل السعودي'
              : 'Comprehensive attendance and time management with Saudi labor law compliance'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'طلب إجازة' : 'Request Leave'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timesheet">
            {language === 'ar' ? 'جدول الحضور' : 'Timesheet'}
          </TabsTrigger>
          <TabsTrigger value="leave">
            {language === 'ar' ? 'الإجازات' : 'Leave'}
          </TabsTrigger>
          <TabsTrigger value="mobile">
            {language === 'ar' ? 'التطبيق المحمول' : 'Mobile App'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {language === 'ar' ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
          <TabsTrigger value="transfer">
            {language === 'ar' ? 'النقل' : 'Transfer'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timesheet">
          <TimesheetTab />
        </TabsContent>

        <TabsContent value="leave">
          <LeaveManagementTab />
        </TabsContent>

        <TabsContent value="mobile">
          <MobileAttendanceTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="transfer">
          <WorkplaceTransferTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeAttendance;