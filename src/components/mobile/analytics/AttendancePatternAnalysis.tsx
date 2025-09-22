import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp, UserCheck, UserX, AlertCircle } from 'lucide-react';

interface AttendancePatternAnalysisProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const AttendancePatternAnalysis: React.FC<AttendancePatternAnalysisProps> = ({ screenSize }) => {
  const { t } = useTranslation();

  // Dummy attendance data
  const weeklyAttendance = [
    { day: 'Mon', present: 95, late: 8, absent: 2 },
    { day: 'Tue', present: 92, late: 12, absent: 3 },
    { day: 'Wed', present: 88, late: 15, absent: 5 },
    { day: 'Thu', present: 90, late: 10, absent: 4 },
    { day: 'Fri', present: 85, late: 18, absent: 7 },
    { day: 'Sat', present: 78, late: 20, absent: 12 },
    { day: 'Sun', present: 82, late: 16, absent: 8 }
  ];

  const monthlyTrend = [
    { month: 'Jan', attendance: 89 },
    { month: 'Feb', attendance: 91 },
    { month: 'Mar', attendance: 87 },
    { month: 'Apr', attendance: 93 },
    { month: 'May', attendance: 88 },
    { month: 'Jun', attendance: 92 }
  ];

  const attendanceByDepartment = [
    { name: 'Engineering', value: 94, color: '#0088FE' },
    { name: 'Sales', value: 88, color: '#00C49F' },
    { name: 'Marketing', value: 91, color: '#FFBB28' },
    { name: 'Support', value: 85, color: '#FF8042' },
    { name: 'HR', value: 93, color: '#8884D8' }
  ];

  const latePatterns = [
    { time: '8:00-8:15', count: 15 },
    { time: '8:15-8:30', count: 22 },
    { time: '8:30-8:45', count: 18 },
    { time: '8:45-9:00', count: 12 },
    { time: '9:00+', count: 8 }
  ];

  return (
    <div className="space-y-6">
      {/* Attendance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.present_today')}</p>
                <p className="text-xl font-bold text-green-600">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.late_arrivals')}</p>
                <p className="text-xl font-bold text-yellow-600">12%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.absent_today')}</p>
                <p className="text-xl font-bold text-red-600">4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.avg_monthly')}</p>
                <p className="text-xl font-bold text-blue-600">90%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Attendance Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('analytics.weekly_attendance_pattern')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" stackId="a" fill="#22c55e" name={t('analytics.present')} />
                <Bar dataKey="late" stackId="a" fill="#eab308" name={t('analytics.late')} />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" name={t('analytics.absent')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.monthly_attendance_trend')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Department Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.department_attendance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceByDepartment}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={screenSize === 'mobile' ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceByDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {t('analytics.late_arrival_patterns')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latePatterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{pattern.time}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-yellow-500 rounded"
                      style={{ width: `${(pattern.count / 25) * 100}px` }}
                    />
                    <Badge variant="outline">{pattern.count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.attendance_insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">{t('analytics.peak_attendance_days')}</p>
                <p className="text-sm text-blue-700">
                  {t('analytics.peak_attendance_insight')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-yellow-900">{t('analytics.late_arrival_trend')}</p>
                <p className="text-sm text-yellow-700">
                  {t('analytics.late_arrival_insight')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">{t('analytics.department_performance')}</p>
                <p className="text-sm text-green-700">
                  {t('analytics.department_performance_insight')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};