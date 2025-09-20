import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, AlertTriangle, Crown, User } from 'lucide-react';

const NitaqatComplianceEngine = () => {
  // Mock data - in real implementation, this would come from hooks/API
  const nitaqatData = {
    currentStatus: {
      saudizationPercentage: 24.5,
      colorZone: 'yellow',
      requiredPercentage: 25,
      totalEmployees: 245,
      saudiEmployees: 60,
      nonSaudiEmployees: 185
    },
    womenMetrics: {
      totalWomen: 89,
      womenPercentage: 36.3,
      womenInLeadership: 12,
      leadershipPositions: 28,
      womenLeadershipPercentage: 42.9
    },
    penalties: {
      riskLevel: 'medium',
      potentialFines: 50000,
      daysToCompliance: 45
    },
    trends: {
      lastMonth: 23.8,
      lastQuarter: 22.1,
      yearOverYear: 19.5
    }
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'green': return 'bg-emerald-500';
      case 'yellow': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      case 'platinum': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getZoneText = (zone: string) => {
    switch (zone) {
      case 'green': return 'منطقة خضراء';
      case 'yellow': return 'منطقة صفراء';
      case 'red': return 'منطقة حمراء';
      case 'platinum': return 'منطقة بلاتينية';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة السعودة الحالية</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nitaqatData.currentStatus.saudizationPercentage}%</div>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${getZoneColor(nitaqatData.currentStatus.colorZone)}`} />
              <span className="text-xs text-muted-foreground">{getZoneText(nitaqatData.currentStatus.colorZone)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النسبة المطلوبة</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nitaqatData.currentStatus.requiredPercentage}%</div>
            <Progress 
              value={(nitaqatData.currentStatus.saudizationPercentage / nitaqatData.currentStatus.requiredPercentage) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة النساء في العمل</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nitaqatData.womenMetrics.womenPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {nitaqatData.womenMetrics.totalWomen} من أصل {nitaqatData.currentStatus.totalEmployees}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النساء في القيادة</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nitaqatData.womenMetrics.womenLeadershipPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {nitaqatData.womenMetrics.womenInLeadership} من أصل {nitaqatData.womenMetrics.leadershipPositions} منصب قيادي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>تفصيل القوى العاملة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>الموظفون السعوديون</span>
                <span className="font-semibold">{nitaqatData.currentStatus.saudiEmployees}</span>
              </div>
              <Progress value={(nitaqatData.currentStatus.saudiEmployees / nitaqatData.currentStatus.totalEmployees) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>الموظفون غير السعوديين</span>
                <span className="font-semibold">{nitaqatData.currentStatus.nonSaudiEmployees}</span>
              </div>
              <Progress value={(nitaqatData.currentStatus.nonSaudiEmployees / nitaqatData.currentStatus.totalEmployees) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>النساء العاملات</span>
                <span className="font-semibold">{nitaqatData.womenMetrics.totalWomen}</span>
              </div>
              <Progress value={(nitaqatData.womenMetrics.totalWomen / nitaqatData.currentStatus.totalEmployees) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>النساء في المناصب القيادية</span>
                <span className="font-semibold">{nitaqatData.womenMetrics.womenInLeadership}</span>
              </div>
              <Progress value={(nitaqatData.womenMetrics.womenInLeadership / nitaqatData.womenMetrics.leadershipPositions) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              تقييم المخاطر والعقوبات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>مستوى المخاطرة</span>
              <Badge variant={nitaqatData.penalties.riskLevel === 'high' ? 'destructive' : nitaqatData.penalties.riskLevel === 'medium' ? 'default' : 'secondary'}>
                {nitaqatData.penalties.riskLevel === 'high' ? 'عالي' : nitaqatData.penalties.riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span>الغرامات المحتملة</span>
              <span className="font-semibold">{nitaqatData.penalties.potentialFines.toLocaleString()} ريال</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>الأيام المتبقية للامتثال</span>
              <span className="font-semibold">{nitaqatData.penalties.daysToCompliance} يوم</span>
            </div>

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <p className="text-sm">
                <strong>توصية:</strong> يُنصح بتوظيف {Math.ceil((nitaqatData.currentStatus.requiredPercentage - nitaqatData.currentStatus.saudizationPercentage) * nitaqatData.currentStatus.totalEmployees / 100)} موظف سعودي إضافي للوصول للنسبة المطلوبة.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>تحليل الاتجاهات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{nitaqatData.trends.lastMonth}%</div>
              <p className="text-sm text-muted-foreground">الشهر الماضي</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{nitaqatData.trends.lastQuarter}%</div>
              <p className="text-sm text-muted-foreground">الربع الماضي</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{nitaqatData.trends.yearOverYear}%</div>
              <p className="text-sm text-muted-foreground">العام الماضي</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NitaqatComplianceEngine;