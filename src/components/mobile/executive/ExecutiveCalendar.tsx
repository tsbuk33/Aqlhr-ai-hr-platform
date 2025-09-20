import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Video,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  Shield,
  Bell
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  titleAr: string;
  type: 'meeting' | 'conference' | 'board' | 'interview' | 'travel' | 'deadline';
  startTime: string;
  endTime: string;
  location?: string;
  isVirtual: boolean;
  attendees: string[];
  priority: 'high' | 'medium' | 'low';
  confidential: boolean;
  timezone: string;
  notes?: string;
  notesAr?: string;
}

interface ExecutiveCalendarProps {
  isArabic: boolean;
  expanded?: boolean;
}

export const ExecutiveCalendar: React.FC<ExecutiveCalendarProps> = ({ 
  isArabic, 
  expanded = false 
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    loadCalendarEvents();
  }, [selectedDate]);

  const loadCalendarEvents = () => {
    // Executive calendar events - would come from calendar API
    const eventsData: CalendarEvent[] = [
      {
        id: 'event_001',
        title: 'Board of Directors Meeting',
        titleAr: 'اجتماع مجلس الإدارة',
        type: 'board',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        location: 'Executive Boardroom, 25th Floor',
        isVirtual: false,
        attendees: ['board@company.com', 'secretary@company.com'],
        priority: 'high',
        confidential: true,
        timezone: 'Asia/Riyadh',
        notes: 'Q4 Performance Review and Strategic Planning',
        notesAr: 'مراجعة أداء الربع الرابع والتخطيط الاستراتيجي'
      },
      {
        id: 'event_002',
        title: 'Investor Conference Call',
        titleAr: 'مؤتمر المستثمرين الهاتفي',
        type: 'conference',
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
        isVirtual: true,
        attendees: ['investors@company.com', 'cfo@company.com', 'ir@company.com'],
        priority: 'high',
        confidential: true,
        timezone: 'Asia/Riyadh',
        notes: 'Quarterly earnings discussion',
        notesAr: 'مناقشة الأرباح الربعية'
      },
      {
        id: 'event_003',
        title: 'Strategic Partnership Meeting',
        titleAr: 'اجتماع الشراكة الاستراتيجية',
        type: 'meeting',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
        location: 'Conference Room A',
        isVirtual: false,
        attendees: ['partners@company.com', 'legal@company.com'],
        priority: 'medium',
        confidential: true,
        timezone: 'Asia/Riyadh',
        notes: 'Discussion on regional expansion opportunities',
        notesAr: 'مناقشة فرص التوسع الإقليمي'
      },
      {
        id: 'event_004',
        title: 'CEO Interview - Business Channel',
        titleAr: 'مقابلة الرئيس التنفيذي - القناة التجارية',
        type: 'interview',
        startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString(),
        isVirtual: true,
        attendees: ['media@company.com', 'pr@company.com'],
        priority: 'medium',
        confidential: false,
        timezone: 'Asia/Riyadh',
        notes: 'Company vision and market outlook discussion',
        notesAr: 'مناقشة رؤية الشركة ونظرة السوق'
      },
      {
        id: 'event_005',
        title: 'NEOM Business Summit',
        titleAr: 'قمة نيوم للأعمال',
        type: 'travel',
        startTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
        location: 'NEOM, Saudi Arabia',
        isVirtual: false,
        attendees: ['team@company.com'],
        priority: 'high',
        confidential: false,
        timezone: 'Asia/Riyadh',
        notes: 'Keynote presentation on digital transformation',
        notesAr: 'عرض رئيسي حول التحول الرقمي'
      }
    ];

    setEvents(eventsData);
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'conference':
        return <Video className="h-4 w-4" />;
      case 'board':
        return <Shield className="h-4 w-4" />;
      case 'interview':
        return <Users className="h-4 w-4" />;
      case 'travel':
        return <MapPin className="h-4 w-4" />;
      case 'deadline':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'conference':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'board':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'interview':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'travel':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'deadline':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getPriorityColor = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => new Date(event.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, expanded ? 10 : 5);
  };

  const getTodayEvents = () => {
    return events.filter(event => isToday(event.startTime));
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {isArabic ? 'التقويم التنفيذي' : 'Executive Calendar'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {selectedDate.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-1">
            {['day', 'week', 'month'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode as any)}
              >
                {isArabic ? 
                  (mode === 'day' ? 'يوم' : mode === 'week' ? 'أسبوع' : 'شهر') :
                  mode.charAt(0).toUpperCase() + mode.slice(1)
                }
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Today's Events */}
        {getTodayEvents().length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {isArabic ? 'أحداث اليوم' : "Today's Events"}
            </h4>
            <div className="space-y-2">
              {getTodayEvents().map((event) => (
                <Card key={event.id} className={`border-l-4 ${getEventTypeColor(event.type).replace('bg-', 'border-l-')}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {getEventTypeIcon(event.type)}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-sm truncate">
                              {isArabic ? event.titleAr : event.title}
                            </h5>
                            {event.confidential && (
                              <Shield className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </span>
                            {event.location && (
                              <>
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{event.location}</span>
                              </>
                            )}
                            {event.isVirtual && (
                              <Badge variant="secondary" className="text-xs">
                                <Video className="h-3 w-3 mr-1" />
                                {isArabic ? 'افتراضي' : 'Virtual'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority).replace('text-', 'bg-')}`} />
                        <Badge variant="outline" className="text-xs">
                          {event.attendees.length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {isArabic ? 'الأحداث القادمة' : 'Upcoming Events'}
          </h4>
          <div className="space-y-2">
            {getUpcomingEvents().map((event) => (
              <Card key={event.id} className="border">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <Badge className={`${getEventTypeColor(event.type)} border`}>
                        {getEventTypeIcon(event.type)}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-sm truncate">
                            {isArabic ? event.titleAr : event.title}
                          </h5>
                          {event.confidential && (
                            <Shield className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{formatDate(event.startTime)}</span>
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </span>
                        </div>
                        {expanded && (event.notes || event.notesAr) && (
                          <p className="text-xs text-muted-foreground mt-2 truncate">
                            {isArabic ? event.notesAr : event.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority).replace('text-', 'bg-')}`} />
                      {event.isVirtual && (
                        <Video className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Calendar Stats */}
        {expanded && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-primary">
                    {getTodayEvents().length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'اليوم' : 'Today'}
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-500">
                    {events.filter(e => e.priority === 'high').length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'عالي الأولوية' : 'High Priority'}
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-red-500">
                    {events.filter(e => e.confidential).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'سري' : 'Confidential'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timezone Display */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" />
          <span>
            {isArabic ? 'التوقيت: الرياض (GMT+3)' : 'Timezone: Riyadh (GMT+3)'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};