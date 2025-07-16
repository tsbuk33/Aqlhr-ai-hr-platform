import React from 'react';
import { Bell, Calendar, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AnnouncementsSection: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const announcements = [
    {
      id: 1,
      title: isArabic ? 'تحديث نظام نطاقات الجديد' : 'New Nitaqat System Update',
      titleEn: 'New Nitaqat System Update',
      titleAr: 'تحديث نظام نطاقات الجديد',
      description: isArabic 
        ? 'تم إطلاق التحديث الجديد لنظام نطاقات لتحسين تجربة المستخدم'
        : 'New Nitaqat system update has been released to improve user experience',
      date: '2024-01-15',
      type: 'update',
      urgent: true
    },
    {
      id: 2,
      title: isArabic ? 'ورشة عمل حول الامتثال للوائح العمل' : 'Labor Compliance Workshop',
      titleEn: 'Labor Compliance Workshop',
      titleAr: 'ورشة عمل حول الامتثال للوائح العمل',
      description: isArabic
        ? 'انضم إلينا في ورشة عمل حول آخر التحديثات في لوائح العمل السعودية'
        : 'Join us for a workshop on the latest updates in Saudi labor regulations',
      date: '2024-01-20',
      type: 'event',
      urgent: false
    },
    {
      id: 3,
      title: isArabic ? 'إعلان جديد من وزارة العمل' : 'New Ministry of Labor Announcement',
      titleEn: 'New Ministry of Labor Announcement',
      titleAr: 'إعلان جديد من وزارة العمل',
      description: isArabic
        ? 'إعلان مهم حول التغييرات الجديدة في قوانين العمل'
        : 'Important announcement about new changes in labor laws',
      date: '2024-01-10',
      type: 'announcement',
      urgent: true
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'update': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'event': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'announcement': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'update': return isArabic ? 'تحديث' : 'Update';
      case 'event': return isArabic ? 'فعالية' : 'Event';
      case 'announcement': return isArabic ? 'إعلان' : 'Announcement';
      default: return type;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`flex items-center space-x-2 rtl:space-x-reverse ${isArabic ? 'font-arabic' : ''}`}>
          <Bell className="h-5 w-5 text-orange-600" />
          <span>{isArabic ? 'الإعلانات الرسمية' : 'Official Announcements'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between space-x-3 rtl:space-x-reverse">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Badge className={getTypeColor(announcement.type)}>
                      {getTypeLabel(announcement.type)}
                    </Badge>
                    {announcement.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        {isArabic ? 'عاجل' : 'Urgent'}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${isArabic ? 'font-arabic text-right' : 'text-left'}`}>
                    {isArabic ? announcement.titleAr : announcement.titleEn}
                  </h3>
                  
                  <p className={`text-sm text-gray-600 dark:text-gray-400 ${isArabic ? 'font-arabic text-right' : 'text-left'}`}>
                    {announcement.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(announcement.date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}</span>
                    </div>
                  </div>
                </div>
                
                <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <button className={`text-green-600 hover:text-green-700 font-medium text-sm ${isArabic ? 'font-arabic' : ''}`}>
            {isArabic ? 'عرض جميع الإعلانات' : 'View All Announcements'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};