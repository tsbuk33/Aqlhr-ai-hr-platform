import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';

// Mock data for recruitment dashboard
const mockRecruitmentData = {
  totalPositions: 45,
  filledPositions: 28,
  pendingApplications: 156,
  interviewsScheduled: 23,
  averageTimeToHire: 21,
  topPerformingSources: ['LinkedIn', 'Company Website', 'Referrals'],
  recentActivity: [
    { type: 'application', candidate: 'أحمد محمد', position: 'مطور برمجيات', time: '2 hours ago' },
    { type: 'interview', candidate: 'فاطمة علي', position: 'محلل أعمال', time: '4 hours ago' },
    { type: 'offer', candidate: 'محمد سعد', position: 'مصمم UI/UX', time: '1 day ago' }
  ]
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  trend: { value: number; isPositive: boolean };
  variant: 'default' | 'destructive' | 'primary' | 'success' | 'warning';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend, variant }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="mt-4 flex items-center">
        <Badge variant={trend.isPositive ? 'default' : 'destructive'} className="text-xs">
          {trend.isPositive ? '+' : '-'}{trend.value}%
        </Badge>
        <span className="text-xs text-muted-foreground mr-2">من الشهر الماضي</span>
      </div>
    </CardContent>
  </Card>
);

const RecruitmentDashboard: React.FC = () => {
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();

  const metrics = [
    {
      title: 'إجمالي المناصب',
      value: mockRecruitmentData.totalPositions.toString(),
      icon: Users,
      trend: { value: 12, isPositive: true },
      variant: 'primary' as const
    },
    {
      title: 'المناصب المملوءة', 
      value: mockRecruitmentData.filledPositions.toString(),
      icon: TrendingUp,
      trend: { value: 8, isPositive: true },
      variant: 'success' as const
    },
    {
      title: 'الطلبات المعلقة',
      value: mockRecruitmentData.pendingApplications.toString(), 
      icon: Clock,
      trend: { value: 5, isPositive: false },
      variant: 'warning' as const
    },
    {
      title: 'المقابلات المجدولة',
      value: mockRecruitmentData.interviewsScheduled.toString(),
      icon: Calendar,
      trend: { value: 15, isPositive: true },
      variant: 'default' as const
    }
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>مصادر التوظيف الأفضل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecruitmentData.topPerformingSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source}</span>
                  <Progress value={85 - index * 15} className="w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>النشاط الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecruitmentData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.candidate}</p>
                    <p className="text-xs text-muted-foreground">{activity.position}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;