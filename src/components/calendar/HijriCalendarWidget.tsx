import { useState, useEffect } from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePerformantLocalization } from '@/hooks/usePerformantLocalization';
import { supabase } from '@/integrations/supabase/client';

interface HijriDate {
  day: number;
  month: string;
  year: number;
  monthNumber: number;
}

interface CalendarData {
  gregorian: Date;
  hijri: HijriDate;
  timezone: string;
}

interface HijriCalendarWidgetProps {
  className?: string;
  compact?: boolean;
  showRefresh?: boolean;
}

export const HijriCalendarWidget = ({ 
  className = "", 
  compact = false, 
  showRefresh = true 
}: HijriCalendarWidgetProps) => {
  const { t, isRTL } = useLanguage();
  const { dateFormatters } = usePerformantLocalization();
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hijri months in Arabic and English
  const hijriMonths = {
    ar: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
    en: ['Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani', 'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah']
  };

  const convertToHijri = (gregorianDate: Date): HijriDate => {
    try {
      const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Riyadh'
      });
      
      const parts = hijriFormatter.formatToParts(gregorianDate);
      const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
      const month = parts.find(p => p.type === 'month')?.value || 'محرم';
      const year = parseInt(parts.find(p => p.type === 'year')?.value || '1446');
      
      const monthNumber = hijriMonths.ar.indexOf(month) + 1;
      
      return { day, month, year, monthNumber: monthNumber > 0 ? monthNumber : 1 };
    } catch {
      // Fallback calculation
      return { day: 15, month: 'محرم', year: 1446, monthNumber: 1 };
    }
  };

  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      // Try to get data from Umm Al-Qura integration
      const { data, error } = await supabase.functions.invoke('umm-al-qura-integration');
      
      if (error) throw error;

      if (data?.success) {
        setCalendarData({
          gregorian: new Date(),
          hijri: data.data.hijriDate,
          timezone: data.data.timezone
        });
      } else {
        // Fallback to local calculation
        const now = new Date();
        const hijriDate = convertToHijri(now);
        setCalendarData({
          gregorian: now,
          hijri: hijriDate,
          timezone: 'Asia/Riyadh'
        });
      }
    } catch (error) {
      console.error('Calendar fetch error:', error);
      // Fallback to local calculation
      const now = new Date();
      const hijriDate = convertToHijri(now);
      setCalendarData({
        gregorian: now,
        hijri: hijriDate,
        timezone: 'Asia/Riyadh'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatHijriDate = (hijri: HijriDate) => {
    if (isRTL) {
      return `${hijri.day} ${hijri.month} ${hijri.year} هـ`;
    } else {
      const monthEn = hijriMonths.en[hijri.monthNumber - 1] || hijri.month;
      return `${hijri.day} ${monthEn} ${hijri.year} AH`;
    }
  };

  const formatGregorianDate = (date: Date) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Riyadh'
    }).format(date);
  };

  const getCurrentTime = () => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Riyadh',
      hour12: !isRTL
    }).format(new Date());
  };

  useEffect(() => {
    fetchCalendarData();
    
    // Auto-refresh every minute for live time
    const interval = setInterval(() => {
      if (calendarData) {
        setCalendarData(prev => prev ? { ...prev, gregorian: new Date() } : null);
      }
    }, 60000);
    
    // Refresh calendar data every hour
    const hourlyInterval = setInterval(fetchCalendarData, 3600000);
    
    return () => {
      clearInterval(interval);
      clearInterval(hourlyInterval);
    };
  }, []);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {calendarData ? formatHijriDate(calendarData.hijri) : (isRTL ? "جاري التحميل..." : "Loading...")}
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">
          {calendarData ? dateFormatters.date(calendarData.gregorian, 'PP') : "..."}
        </span>
      </div>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm">
              {isRTL ? "التقويم الهجري" : "Hijri Calendar"}
            </h3>
          </div>
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchCalendarData}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {/* Hijri Date */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-xs text-muted-foreground mb-1">
              {isRTL ? "التاريخ الهجري" : "Hijri Date"}
            </div>
            <div className="text-sm font-bold text-primary">
              {calendarData ? formatHijriDate(calendarData.hijri) : (isRTL ? "جاري التحميل..." : "Loading...")}
            </div>
          </div>

          {/* Gregorian Date */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              {isRTL ? "التاريخ الميلادي" : "Gregorian Date"}
            </div>
            <div className="text-sm font-medium">
              {calendarData ? formatGregorianDate(calendarData.gregorian) : (isRTL ? "جاري التحميل..." : "Loading...")}
            </div>
          </div>

          {/* Current Time */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{isRTL ? "الوقت المحلي" : "Local Time"}</span>
            </div>
            <span className="font-mono">
              {getCurrentTime()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};