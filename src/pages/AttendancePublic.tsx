import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Clock, Calendar, MapPin, Smartphone, BarChart3, Users } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function AttendancePublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const attendanceFeatures = [
    {
      icon: Clock,
      title: isArabic ? 'تسجيل الحضور والانصراف' : 'Clock In/Out',
      description: isArabic ? 'تسجيل سهل ودقيق لأوقات الحضور والانصراف' : 'Easy and accurate time tracking for attendance'
    },
    {
      icon: Calendar,
      title: isArabic ? 'جداول العمل' : 'Work Schedules',
      description: isArabic ? 'إدارة جداول العمل المرنة والمناوبات' : 'Manage flexible work schedules and shifts'
    },
    {
      icon: MapPin,
      title: isArabic ? 'تتبع الموقع' : 'Location Tracking',
      description: isArabic ? 'تتبع موقع الموظفين للعمل الميداني' : 'Track employee location for field work'
    },
    {
      icon: Smartphone,
      title: isArabic ? 'تطبيق الهاتف المحمول' : 'Mobile App',
      description: isArabic ? 'تسجيل الحضور عبر التطبيق المحمول' : 'Mobile attendance tracking app'
    },
    {
      icon: BarChart3,
      title: isArabic ? 'تقارير الحضور' : 'Attendance Reports',
      description: isArabic ? 'تقارير مفصلة عن أوقات العمل والغياب' : 'Detailed reports on work hours and absences'
    },
    {
      icon: Users,
      title: isArabic ? 'إدارة الفرق' : 'Team Management',
      description: isArabic ? 'مراقبة حضور الفرق والأقسام' : 'Monitor team and department attendance'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'الوقت والحضور' : 'Time & Attendance'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'نظام متطور لتتبع أوقات العمل والحضور والانصراف مع تقارير تحليلية شاملة'
            : 'Advanced system for tracking work hours, attendance, and departure with comprehensive analytical reports'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {attendanceFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى نظام الوقت والحضور الكامل'
            : '🔒 Login to access the complete Time & Attendance system'
          }
        </p>
      </div>
    </div>
  );
}