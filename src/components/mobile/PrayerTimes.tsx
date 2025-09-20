import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Moon, Sun } from 'lucide-react';

interface PrayerTimesProps {
  isArabic: boolean;
}

export const PrayerTimes: React.FC<PrayerTimesProps> = ({ isArabic }) => {
  const prayers = [
    { name: isArabic ? 'الفجر' : 'Fajr', nameEn: 'Fajr', time: '05:15' },
    { name: isArabic ? 'الظهر' : 'Dhuhr', nameEn: 'Dhuhr', time: '12:30' },
    { name: isArabic ? 'العصر' : 'Asr', nameEn: 'Asr', time: '15:45' },
    { name: isArabic ? 'المغرب' : 'Maghrib', nameEn: 'Maghrib', time: '18:20' },
    { name: isArabic ? 'العشاء' : 'Isha', nameEn: 'Isha', time: '19:50' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          {isArabic ? 'مواقيت الصلاة' : 'Prayer Times'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prayers.map((prayer, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <span className="font-medium">{prayer.name}</span>
              <span className="font-mono text-primary">{prayer.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};