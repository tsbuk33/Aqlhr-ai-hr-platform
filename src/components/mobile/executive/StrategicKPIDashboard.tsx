import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  BarChart3,
  Activity,
  Award,
  AlertCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';

interface KPIMetric {
  id: string;
  title: string;
  titleAr: string;
  value: number | string;
  target: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: 'financial' | 'operational' | 'strategic' | 'hr';
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastUpdated: string;
}

interface StrategicKPIDashboardProps {
  isArabic: boolean;
  detailed?: boolean;
}

export const StrategicKPIDashboard: React.FC<StrategicKPIDashboardProps> = ({ 
  isArabic, 
  detailed = false 
}) => {
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadKPIMetrics();
  }, []);

  const loadKPIMetrics = () => {
    // Strategic KPI data - would come from API
    const kpiData: KPIMetric[] = [
      {
        id: 'revenue_growth',
        title: 'Revenue Growth',
        titleAr: 'نمو الإيرادات',
        value: '18.5%',
        target: 20,
        unit: '%',
        change: 2.3,
        trend: 'up',
        category: 'financial',
        priority: 'critical',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'saudization_rate',
        title: 'Saudization Rate',
        titleAr: 'نسبة السعودة',
        value: '78.2%',
        target: 75,
        unit: '%',
        change: 4.2,
        trend: 'up',
        category: 'strategic',
        priority: 'critical',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'employee_satisfaction',
        title: 'Employee Satisfaction',
        titleAr: 'رضا الموظفين',
        value: '94.1%',
        target: 90,
        unit: '%',
        change: 1.8,
        trend: 'up',
        category: 'hr',
        priority: 'high',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'operational_efficiency',
        title: 'Operational Efficiency',
        titleAr: 'الكفاءة التشغيلية',
        value: '89.7%',
        target: 85,
        unit: '%',
        change: -1.2,
        trend: 'down',
        category: 'operational',
        priority: 'medium',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'market_share',
        title: 'Market Share',
        titleAr: 'الحصة السوقية',
        value: '12.8%',
        target: 15,
        unit: '%',
        change: 0.9,
        trend: 'up',
        category: 'strategic',
        priority: 'high',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'training_roi',
        title: 'Training ROI',
        titleAr: 'عائد الاستثمار في التدريب',
        value: '325%',
        target: 300,
        unit: '%',
        change: 25,
        trend: 'up',
        category: 'hr',
        priority: 'medium',
        lastUpdated: new Date().toISOString()
      }
    ];

    setMetrics(kpiData);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    loadKPIMetrics();
    setIsRefreshing(false);
  };

  const getTrendIcon = (trend: KPIMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: KPIMetric['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'stable':
        return 'text-blue-500';
    }
  };

  const getPriorityColor = (priority: KPIMetric['priority']) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
    }
  };

  const getCategoryIcon = (category: KPIMetric['category']) => {
    switch (category) {
      case 'financial':
        return <CurrencyIcon className="h-4 w-4" />;
      case 'operational':
        return <BarChart3 className="h-4 w-4" />;
      case 'strategic':
        return <Target className="h-4 w-4" />;
      case 'hr':
        return <Users className="h-4 w-4" />;
    }
  };

  const getProgressPercentage = (value: string, target: number) => {
    const numValue = parseFloat(value.replace('%', ''));
    return Math.min((numValue / target) * 100, 100);
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metrics.filter(m => m.category === selectedCategory);

  const categories = [
    { key: 'all', label: isArabic ? 'الكل' : 'All' },
    { key: 'financial', label: isArabic ? 'مالي' : 'Financial' },
    { key: 'strategic', label: isArabic ? 'استراتيجي' : 'Strategic' },
    { key: 'operational', label: isArabic ? 'تشغيلي' : 'Operational' },
    { key: 'hr', label: isArabic ? 'موارد بشرية' : 'HR' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {isArabic ? 'لوحة المؤشرات الاستراتيجية' : 'Strategic KPI Dashboard'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.key)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* KPI Grid */}
        <div className={`grid ${detailed ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
          {filteredMetrics.map((metric) => (
            <Card key={metric.id} className={`${getPriorityColor(metric.priority)} border-l-4`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(metric.category)}
                      <span className="text-xs font-medium">
                        {isArabic ? metric.titleAr : metric.title}
                      </span>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold">
                        {metric.value}
                      </span>
                      <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>

                    {detailed && (
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{isArabic ? 'الهدف' : 'Target'}</span>
                            <span>{metric.target}{metric.unit}</span>
                          </div>
                          <Progress 
                            value={getProgressPercentage(metric.value.toString(), metric.target)} 
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {metric.priority}
                          </Badge>
                          <span>
                            {isArabic ? 'آخر تحديث' : 'Updated'}: {
                              new Date(metric.lastUpdated).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        {detailed && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {metrics.filter(m => m.trend === 'up').length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'مؤشرات صاعدة' : 'Trending Up'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {metrics.filter(m => m.trend === 'down').length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'مؤشرات هابطة' : 'Trending Down'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">
                    {metrics.filter(m => m.priority === 'critical').length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'مؤشرات حرجة' : 'Critical KPIs'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};