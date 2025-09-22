import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users,
  BarChart3,
  Activity
} from 'lucide-react';

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  total: number;
  percentage: number;
}

interface AttendanceTrendsProps {
  isArabic: boolean;
}

export const AttendanceTrends: React.FC<AttendanceTrendsProps> = ({ isArabic }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [trendData, setTrendData] = useState<AttendanceData[]>([]);
  const [stats, setStats] = useState({
    avgAttendance: 0,
    trend: 'stable' as 'up' | 'down' | 'stable',
    bestDay: '',
    worstDay: '',
    improvement: 0
  });

  useEffect(() => {
    loadTrendData();
  }, [period]);

  const loadTrendData = () => {
    // Mock weekly data
    const weeklyData: AttendanceData[] = [
      { 
        date: isArabic ? 'الأحد' : 'Sunday',
        present: 12, absent: 2, late: 1, onLeave: 0, total: 15, percentage: 80 
      },
      { 
        date: isArabic ? 'الإثنين' : 'Monday',
        present: 14, absent: 1, late: 0, onLeave: 0, total: 15, percentage: 93.3 
      },
      { 
        date: isArabic ? 'الثلاثاء' : 'Tuesday',
        present: 13, absent: 1, late: 1, onLeave: 0, total: 15, percentage: 86.7 
      },
      { 
        date: isArabic ? 'الأربعاء' : 'Wednesday',
        present: 15, absent: 0, late: 0, onLeave: 0, total: 15, percentage: 100 
      },
      { 
        date: isArabic ? 'الخميس' : 'Thursday',
        present: 13, absent: 0, late: 2, onLeave: 0, total: 15, percentage: 86.7 
      },
      { 
        date: isArabic ? 'الجمعة' : 'Friday',
        present: 11, absent: 0, late: 1, onLeave: 3, total: 15, percentage: 73.3 
      },
      { 
        date: isArabic ? 'السبت' : 'Saturday',
        present: 8, absent: 0, late: 0, onLeave: 7, total: 15, percentage: 53.3 
      }
    ];

    const monthlyData: AttendanceData[] = [
      { date: isArabic ? 'الأسبوع ١' : 'Week 1', present: 68, absent: 4, late: 3, onLeave: 5, total: 80, percentage: 85 },
      { date: isArabic ? 'الأسبوع ٢' : 'Week 2', present: 71, absent: 2, late: 2, onLeave: 5, total: 80, percentage: 88.8 },
      { date: isArabic ? 'الأسبوع ٣' : 'Week 3', present: 69, absent: 3, late: 4, onLeave: 4, total: 80, percentage: 86.3 },
      { date: isArabic ? 'الأسبوع ٤' : 'Week 4', present: 73, absent: 1, late: 1, onLeave: 5, total: 80, percentage: 91.3 }
    ];

    const data = period === 'weekly' ? weeklyData : monthlyData;
    setTrendData(data);

    // Calculate stats
    const avgAttendance = data.reduce((sum, day) => sum + day.percentage, 0) / data.length;
    const lastThree = data.slice(-3);
    const firstThree = data.slice(0, 3);
    const recentAvg = lastThree.reduce((sum, day) => sum + day.percentage, 0) / 3;
    const previousAvg = firstThree.reduce((sum, day) => sum + day.percentage, 0) / 3;
    
    setStats({
      avgAttendance: Math.round(avgAttendance * 10) / 10,
      trend: recentAvg > previousAvg ? 'up' : recentAvg < previousAvg ? 'down' : 'stable',
      bestDay: data.reduce((max, day) => day.percentage > max.percentage ? day : max).date,
      worstDay: data.reduce((min, day) => day.percentage < min.percentage ? day : min).date,
      improvement: Math.round((recentAvg - previousAvg) * 10) / 10
    });
  };

  const formatNumber = (num: number) => {
    if (isArabic) {
      return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {isArabic ? 'اتجاهات الحضور' : 'Attendance Trends'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Period Selector */}
          <Tabs value={period} onValueChange={(value: any) => setPeriod(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">
                {isArabic ? 'أسبوعي' : 'Weekly'}
              </TabsTrigger>
              <TabsTrigger value="monthly">
                {isArabic ? 'شهري' : 'Monthly'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={period} className="space-y-4">
              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <Activity className="h-4 w-4 text-primary" />
                    {stats.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {stats.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {formatNumber(stats.avgAttendance)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'متوسط الحضور' : 'Avg Attendance'}
                  </p>
                </div>

                <div className="text-center p-3 bg-secondary/5 rounded-lg">
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="text-2xl font-bold text-secondary">
                    {formatNumber(Math.abs(stats.improvement))}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 
                      (stats.improvement >= 0 ? 'تحسن' : 'انخفاض') : 
                      (stats.improvement >= 0 ? 'Improvement' : 'Decline')
                    }
                  </p>
                </div>
              </div>

              {/* Trend Chart (Simple) */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  {isArabic ? 'الرسم البياني للحضور' : 'Attendance Chart'}
                </h4>
                <div className="space-y-2">
                  {trendData.map((day, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-16 text-xs text-muted-foreground">
                        {day.date}
                      </div>
                      <div className="flex-1 bg-secondary/20 rounded-full h-2 relative">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            day.percentage >= 90 ? 'bg-green-500' :
                            day.percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${day.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium w-12 text-right">
                        {formatNumber(day.percentage)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {isArabic ? 'أفضل يوم' : 'Best Day'}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {stats.bestDay} - {isArabic ? 'أعلى معدل حضور' : 'Highest attendance rate'}
                  </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {isArabic ? 'أسوأ يوم' : 'Needs Attention'}
                    </span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">
                    {stats.worstDay} - {isArabic ? 'أقل معدل حضور' : 'Lowest attendance rate'}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};