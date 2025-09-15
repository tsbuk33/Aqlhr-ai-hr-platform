import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Activity, ExternalLink, Clock, CheckCircle, Users, CreditCard, GraduationCap } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

export function RecentActivitiesSection() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  const activities = [
    {
      id: 1,
      title: isArabic ? 'أحمد الراشد أكمل مراجعة الأداء' : 'Ahmed Al-Rashid completed performance review',
      description: isArabic ? 'تم تقديم تقييم الأداء للربع الرابع 2024' : 'Performance evaluation submitted for Q4 2024',
      type: 'Performance',
      user: {
        name: 'Ahmed Al-Rashid',
        avatar: 'AR',
      },
      time: isArabic ? 'منذ ساعتين' : '2 hours ago',
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      id: 2,
      title: isArabic ? 'الموظفة الجديدة فاطمة الزهراء تم إدراجها' : 'New employee Fatima Al-Zahra onboarded',
      description: isArabic ? 'تم إنشاء ملف الموظفة والتحقق من المستندات' : 'Employee profile created and documents verified',
      type: 'Onboarding',
      user: {
        name: 'Fatima Al-Zahra',
        avatar: 'FZ',
      },
      time: isArabic ? 'منذ 4 ساعات' : '4 hours ago',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
    },
    {
      id: 3,
      title: isArabic ? 'تمت معالجة الرواتب لـ 2,847 موظف' : 'Payroll processed for 2,847 employees',
      description: isArabic ? 'تم إكمال راتب ديسمبر 2024 بنجاح' : 'December 2024 payroll successfully completed',
      type: 'Payroll',
      user: {
        name: 'System',
        avatar: 'SY',
      },
      time: isArabic ? 'منذ يوم واحد' : '1 day ago',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10',
    },
    {
      id: 4,
      title: isArabic ? 'إكمال البرنامج التدريبي' : 'Training program completion',
      description: isArabic ? 'دورة تطوير القيادة - 25 مشارك' : 'Leadership Development Course - 25 participants',
      type: 'Training',
      user: {
        name: 'Training Dept',
        avatar: 'TD',
      },
      time: isArabic ? 'منذ يومين' : '2 days ago',
      icon: GraduationCap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-600/10',
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
          <CardTitle className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <Activity className="h-5 w-5 text-primary" />
            {isArabic ? 'النشاط الأخير' : 'Recent Activity'}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            {isArabic ? 'عرض جميع الأنشطة ←' : 'View all activities →'}
          </Button>
        </div>
        <p className={`text-muted-foreground ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic 
            ? 'آخر أنشطة النظام والتحديثات'
            : 'Latest system activities and updates'
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Activity Icon */}
                <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm leading-tight mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                        {activity.description}
                      </p>
                      
                      {/* Activity Metadata */}
                      <div className="flex items-center gap-3 text-xs">
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Avatar */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={activity.user.name} />
                        <AvatarFallback className="text-xs font-medium">
                          {activity.user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium">{activity.user.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full sm:w-auto">
            <ExternalLink className="h-4 w-4 mr-2" />
            {isArabic ? 'عرض جميع الأنشطة' : 'View All Activities'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}