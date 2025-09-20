import React from 'react';
import { Calendar } from 'lucide-react';

interface HijriCalendarProps {
  isArabic: boolean;
}

export const HijriCalendar: React.FC<HijriCalendarProps> = ({ isArabic }) => {
  const today = new Date();
  const hijriDate = isArabic ? '١٥ جمادى الآخرة ١٤٤٦' : '15 Jumada Al-Akhirah 1446';
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'التاريخ الميلادي' : 'Gregorian Date'}
          </p>
          <p className="font-medium">
            {today.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
          </p>
        </div>
        <Calendar className="h-5 w-5 text-primary" />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground">
          {isArabic ? 'التاريخ الهجري' : 'Hijri Date'}
        </p>
        <p className="font-medium text-primary">{hijriDate}</p>
      </div>
    </div>
  );
};