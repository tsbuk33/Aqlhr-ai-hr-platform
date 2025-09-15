import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Megaphone, AlertTriangle, Calendar, ExternalLink } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

export function AnnouncementsSection() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  const announcements = [
    {
      id: 1,
      title: isArabic ? 'تحديث نظام نطاقات الجديد' : 'New Nitaqat System Update',
      description: isArabic 
        ? 'تم إصدار تحديث نظام نطاقات الجديد لتحسين تجربة المستخدم'
        : 'New Nitaqat system update has been released to improve user experience',
      date: '1/14/2024',
      type: 'Update',
      priority: 'Urgent',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10',
    },
    {
      id: 2,
      title: isArabic ? 'ورشة عمل الامتثال العمالي' : 'Labor Compliance Workshop',
      description: isArabic 
        ? 'انضم إلينا في ورشة عمل حول آخر التحديثات في أنظمة العمل السعودية'
        : 'Join us for a workshop on the latest updates in Saudi labor regulations',
      date: '1/19/2024',
      type: 'Event',
      priority: 'Normal',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
    },
    {
      id: 3,
      title: isArabic ? 'إعلان جديد من وزارة العمل' : 'New Ministry of Labor Announcement',
      description: isArabic 
        ? 'إعلان مهم حول التغييرات الجديدة في قوانين العمل'
        : 'Important announcement about new changes in labor laws',
      date: '1/9/2024',
      type: 'Announcement',
      priority: 'Urgent',
      icon: Megaphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-600/10',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Update':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Event':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Announcement':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Normal':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
          <CardTitle className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <Megaphone className="h-5 w-5 text-primary" />
            {isArabic ? 'الإعلانات الرسمية' : 'Official Announcements'}
          </CardTitle>
          <Button variant="default" size="sm" className="announcement-button">
            {isArabic ? 'عرض جميع الإعلانات' : 'View All Announcements'}
          </Button>
        </div>
        <p className={`text-muted-foreground ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic 
            ? 'آخر الإعلانات والتحديثات من الجهات الحكومية'
            : 'Latest announcements and updates from government entities'
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="activity-card-container">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="activity-card border-l-4 border-l-primary">
              {/* Icon */}
              <div className={`activity-icon-wrapper ${announcement.bgColor}`}>
                <announcement.icon className={`h-5 w-5 ${announcement.color}`} />
              </div>
              
              {/* Content */}
              <div className="activity-content">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="activity-title">
                      {announcement.title}
                    </h4>
                    <p className="activity-description">
                      {announcement.description}
                    </p>
                  </div>
                  
                  {/* Date */}
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {announcement.date}
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getTypeColor(announcement.type)} variant="outline">
                    {announcement.type}
                  </Badge>
                  <Badge className={getPriorityColor(announcement.priority)} variant="outline">
                    {announcement.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-6 text-center">
          <Button variant="default" className="w-full sm:w-auto announcement-button">
            <ExternalLink className="h-4 w-4 mr-2" />
            {isArabic ? 'عرض جميع الإعلانات' : 'View All Announcements'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}