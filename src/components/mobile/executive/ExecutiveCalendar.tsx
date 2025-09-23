import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video,
  Phone,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  Star
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  titleAr: string;
  startTime: string;
  endTime: string;
  location?: string;
  locationAr?: string;
  type: 'meeting' | 'conference' | 'travel' | 'strategic' | 'government';
  attendees: number;
  priority: 'high' | 'medium' | 'low';
  status: 'confirmed' | 'tentative' | 'cancelled';
  isVirtual: boolean;
  description?: string;
  descriptionAr?: string;
}

export const ExecutiveCalendar: React.FC = () => {
  const { lang: locale } = useUnifiedLocale();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Vision 2030 Strategy Review',
      titleAr: 'مراجعة استراتيجية رؤية 2030',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Boardroom A',
      locationAr: 'قاعة الاجتماعات أ',
      type: 'strategic',
      attendees: 8,
      priority: 'high',
      status: 'confirmed',
      isVirtual: false,
      description: 'Quarterly review of Vision 2030 initiatives'
    },
    {
      id: '2',
      title: 'Ministry of Commerce Meeting',
      titleAr: 'اجتماع وزارة التجارة',
      startTime: '11:00',
      endTime: '12:00',
      location: 'Government Quarter',
      locationAr: 'الحي الحكومي',
      type: 'government',
      attendees: 5,
      priority: 'high',
      status: 'confirmed',
      isVirtual: false,
      description: 'Compliance discussion and licensing updates'
    },
    {
      id: '3',
      title: 'Global Leadership Conference',
      titleAr: 'مؤتمر القيادة العالمية',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Virtual',
      locationAr: 'افتراضي',
      type: 'conference',
      attendees: 150,
      priority: 'medium',
      status: 'confirmed',
      isVirtual: true,
      description: 'International business leadership summit'
    },
    {
      id: '4',
      title: 'Executive Team Sync',
      titleAr: 'اجتماع الفريق التنفيذي',
      startTime: '16:30',
      endTime: '17:30',
      location: 'Executive Suite',
      locationAr: 'الجناح التنفيذي',
      type: 'meeting',
      attendees: 6,
      priority: 'high',
      status: 'confirmed',
      isVirtual: false,
      description: 'Weekly executive team synchronization'
    }
  ];

  useEffect(() => {
    loadCalendarEvents();
  }, [selectedDate]);

  const loadCalendarEvents = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would query the calendar events
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'bg-purple-500';
      case 'government': return 'bg-green-500';
      case 'conference': return 'bg-blue-500';
      case 'meeting': return 'bg-orange-500';
      case 'travel': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="h-3 w-3 text-red-500 fill-current" />;
      case 'medium': return <Star className="h-3 w-3 text-yellow-500" />;
      case 'low': return <Star className="h-3 w-3 text-gray-400" />;
      default: return null;
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (locale === 'ar') {
      return selectedDate.toLocaleDateString('ar-SA', options);
    }
    return selectedDate.toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'ar' ? 'التقويم التنفيذي' : 'Executive Calendar'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'إدارة المواعيد والاجتماعات' : 'Manage appointments and meetings'}
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          {locale === 'ar' ? 'موعد جديد' : 'New Event'}
        </Button>
      </div>

      {/* Calendar Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold">
                {formatDateHeader()}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {(['day', 'week', 'month'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                >
                  {locale === 'ar' ? 
                    (mode === 'day' ? 'يوم' : mode === 'week' ? 'أسبوع' : 'شهر') :
                    mode.charAt(0).toUpperCase() + mode.slice(1)
                  }
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                    <h3 className="font-semibold text-foreground">
                      {locale === 'ar' ? event.titleAr : event.title}
                    </h3>
                    {getPriorityIcon(event.priority)}
                    {event.status === 'tentative' && (
                      <Badge variant="outline" className="text-xs">
                        {locale === 'ar' ? 'مؤقت' : 'Tentative'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeRange(event.startTime, event.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees} {locale === 'ar' ? 'مشارك' : 'attendees'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {event.isVirtual ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                      <span>{locale === 'ar' ? event.locationAr || event.location : event.location}</span>
                    </div>
                    
                    {event.description && (
                      <p className="text-xs">
                        {locale === 'ar' ? event.descriptionAr || event.description : event.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {event.isVirtual ? (
                    <Button size="sm" className="w-full">
                      <Video className="h-4 w-4 mr-1" />
                      {locale === 'ar' ? 'انضمام' : 'Join'}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full">
                      <MapPin className="h-4 w-4 mr-1" />
                      {locale === 'ar' ? 'الموقع' : 'Location'}
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" className="w-full">
                    <Bell className="h-4 w-4 mr-1" />
                    {locale === 'ar' ? 'تذكير' : 'Remind'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'ar' ? 'لا توجد مواعيد' : 'No Events Scheduled'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'ar' ? 'لا توجد مواعيد مجدولة لهذا اليوم' : 'No events scheduled for this day'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};