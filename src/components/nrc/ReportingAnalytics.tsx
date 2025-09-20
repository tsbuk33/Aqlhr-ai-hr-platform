import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Target,
  Users,
  User,
  Crown
} from 'lucide-react';

const ReportingAnalytics = () => {
  // Mock data for reporting and analytics
  const analyticsData = {
    complianceTrends: {
      currentMonth: 24.5,
      lastMonth: 23.8,
      threeMonthsAgo: 22.1,
      sixMonthsAgo: 21.2,
      trend: 'increasing'
    },
    womenMetrics: {
      currentPercentage: 36.3,
      leadershipPercentage: 42.9,
      growth: {
        workplace: 2.8,
        leadership: 5.2
      }
    },
    benchmarkComparison: {
      industry: {
        name: 'تقنية المعلومات',
        average: 22.8,
        percentile: 75
      },
      sectorSize: {
        name: 'الشركات المتوسطة (100-500 موظف)',
        average: 23.5,
        percentile: 68
      }
    },
    forecasting: {
      nextQuarter: 25.2,
      nextYear: 27.8,
      confidenceLevel: 85
    },
    reports: [
      {
        id: 1,
        name: 'تقرير السعودة الشهري',
        type: 'monthly',
        lastGenerated: '2024-01-15',
        size: '2.5 MB'
      },
      {
        id: 2,
        name: 'تحليل النساء في القيادة',
        type: 'quarterly',
        lastGenerated: '2024-01-01',
        size: '1.8 MB'
      },
      {
        id: 3,
        name: 'مقارنة معايير القطاع',
        type: 'annual',
        lastGenerated: '2023-12-31',
        size: '4.2 MB'
      },
      {
        id: 4,
        name: 'تقرير المخاطرة والامتثال',
        type: 'weekly',
        lastGenerated: '2024-01-18',
        size: '1.2 MB'
      }
    ]
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'increasing' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'increasing' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة السعودة الحالية</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.complianceTrends.currentMonth}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(analyticsData.complianceTrends.trend)}
              <span className={`text-xs ${getTrendColor(analyticsData.complianceTrends.trend)}`}>
                +{(analyticsData.complianceTrends.currentMonth - analyticsData.complianceTrends.lastMonth).toFixed(1)}% من الشهر الماضي
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النساء في العمل</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.womenMetrics.currentPercentage}%</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">
                +{analyticsData.womenMetrics.growth.workplace}% نمو سنوي
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النساء في القيادة</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.womenMetrics.leadershipPercentage}%</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">
                +{analyticsData.womenMetrics.growth.leadership}% نمو سنوي
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التوقعات للربع القادم</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.forecasting.nextQuarter}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              مستوى الثقة: {analyticsData.forecasting.confidenceLevel}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            اتجاهات الامتثال على مدار الوقت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analyticsData.complianceTrends.currentMonth}%</div>
              <p className="text-sm text-muted-foreground">الشهر الحالي</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analyticsData.complianceTrends.lastMonth}%</div>
              <p className="text-sm text-muted-foreground">الشهر الماضي</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analyticsData.complianceTrends.threeMonthsAgo}%</div>
              <p className="text-sm text-muted-foreground">قبل 3 أشهر</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analyticsData.complianceTrends.sixMonthsAgo}%</div>
              <p className="text-sm text-muted-foreground">قبل 6 أشهر</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>مقارنة مع معايير القطاع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{analyticsData.benchmarkComparison.industry.name}</span>
                <span className="text-sm text-muted-foreground">
                  المئوي {analyticsData.benchmarkComparison.industry.percentile}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>شركتك: {analyticsData.complianceTrends.currentMonth}%</span>
                  <span>متوسط القطاع: {analyticsData.benchmarkComparison.industry.average}%</span>
                </div>
                <Progress value={analyticsData.benchmarkComparison.industry.percentile} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{analyticsData.benchmarkComparison.sectorSize.name}</span>
                <span className="text-sm text-muted-foreground">
                  المئوي {analyticsData.benchmarkComparison.sectorSize.percentile}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>شركتك: {analyticsData.complianceTrends.currentMonth}%</span>
                  <span>متوسط الحجم: {analyticsData.benchmarkComparison.sectorSize.average}%</span>
                </div>
                <Progress value={analyticsData.benchmarkComparison.sectorSize.percentile} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التوقعات المستقبلية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{analyticsData.forecasting.nextQuarter}%</div>
              <p className="text-sm text-muted-foreground">الربع القادم</p>
              <p className="text-xs text-muted-foreground mt-1">
                ثقة {analyticsData.forecasting.confidenceLevel}%
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600">{analyticsData.forecasting.nextYear}%</div>
              <p className="text-sm text-muted-foreground">العام القادم</p>
              <p className="text-xs text-muted-foreground mt-1">
                بناءً على الاتجاه الحالي
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            التقارير المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      آخر إنشاء: {new Date(report.lastGenerated).toLocaleDateString('ar-SA')} • {report.size}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {report.type === 'weekly' ? 'أسبوعي' : 
                     report.type === 'monthly' ? 'شهري' : 
                     report.type === 'quarterly' ? 'ربع سنوي' : 'سنوي'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button>
              إنشاء تقرير مخصص
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingAnalytics;