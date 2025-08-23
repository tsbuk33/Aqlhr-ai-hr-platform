import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertTriangle, Users, TrendingDown } from "lucide-react";
import { getLang } from '@/lib/i18n/getLang';
import { RetentionOverview as RetentionOverviewType, RetentionHotspot } from '@/hooks/useRetention';

interface Props {
  overview: RetentionOverviewType | null;
  hotspots: RetentionHotspot[];
  loading: boolean;
  recompute: () => void;
  tenantId: string | null;
}

export const RetentionOverview: React.FC<Props> = ({
  overview,
  hotspots,
  loading,
  recompute,
  tenantId
}) => {
  const lang = getLang();
  const isRTL = lang === 'ar';

  const t = (key: string): string => {
    const translations: Record<string, any> = {
      'retention.kpi.avgRisk': lang === 'ar' ? "متوسط الخطر" : "Avg Risk",
      'retention.kpi.pctHigh': lang === 'ar' ? "٪ عالي الخطر" : "% High Risk",
      'retention.kpi.pctMed': lang === 'ar' ? "٪ متوسط الخطر" : "% Medium Risk", 
      'retention.kpi.pctLow': lang === 'ar' ? "٪ منخفض الخطر" : "% Low Risk",
      'retention.kpi.totalEmployees': lang === 'ar' ? "إجمالي الموظفين" : "Total Employees",
      'retention.kpi.targetTurnover': lang === 'ar' ? "معدل الدوران المستهدف" : "Target Turnover",
      'retention.grid.department': lang === 'ar' ? "القسم" : "Department",
      'retention.grid.n': lang === 'ar' ? "العدد" : "N",
      'retention.grid.avgRisk': lang === 'ar' ? "متوسط الخطر" : "Avg Risk",
      'retention.grid.pctHigh': lang === 'ar' ? "٪ مرتفع" : "% High",
      'retention.ui.recompute': lang === 'ar' ? "إعادة احتساب" : "Recompute",
      'retention.ui.noData': lang === 'ar' ? "لا توجد بيانات حتى الآن" : "No data yet",
      'retention.ui.loading': lang === 'ar' ? "جاري التحميل..." : "Loading...",
      'retention.ui.hotspots': lang === 'ar' ? "النقاط الساخنة" : "Risk Hotspots",
      'retention.ui.pdplNotice': lang === 'ar' 
        ? "عرض مجمّع. تفاصيل الموظفين تتطلب صلاحيات الإدارة." 
        : "Aggregated view. Employee details require admin access."
    };

    return translations[key] || key;
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-destructive';
    if (risk >= 40) return 'text-warning';
    return 'text-success';
  };

  const getRiskBadgeVariant = (risk: number) => {
    if (risk >= 70) return 'destructive';
    if (risk >= 40) return 'secondary';
    return 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className={`ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>{t('retention.ui.loading')}</span>
      </div>
    );
  }

  if (!overview) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">{t('retention.ui.noData')}</p>
          <Button onClick={recompute} disabled={!tenantId}>
            <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('retention.ui.recompute')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('retention.kpi.avgRisk')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(overview.avg_risk)}`}>
              {overview.avg_risk.toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('retention.kpi.pctHigh')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {overview.pct_high.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('retention.kpi.totalEmployees')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground flex items-center">
              <Users className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {overview.total_employees}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('retention.kpi.targetTurnover')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground flex items-center">
              <TrendingDown className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {overview.target_turnover}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
          <CardDescription>
            Current risk band distribution across all employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {overview.pct_high.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {overview.pct_med.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Medium Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {overview.pct_low.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Low Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotspots */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('retention.ui.hotspots')}</CardTitle>
            <CardDescription>
              Departments with highest retention risk (groups with 7+ employees only)
            </CardDescription>
          </div>
          <Button onClick={recompute} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('retention.ui.recompute')}
          </Button>
        </CardHeader>
        <CardContent>
          {hotspots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('retention.ui.noData')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className={`text-${isRTL ? 'right' : 'left'} py-3 font-medium`}>
                      {t('retention.grid.department')}
                    </th>
                    <th className="text-center py-3 font-medium">{t('retention.grid.n')}</th>
                    <th className="text-center py-3 font-medium">{t('retention.grid.avgRisk')}</th>
                    <th className="text-center py-3 font-medium">{t('retention.grid.pctHigh')}</th>
                  </tr>
                </thead>
                <tbody>
                  {hotspots.map((hotspot, index) => (
                    <tr key={hotspot.department_id || index} className="border-b">
                      <td className={`py-3 text-${isRTL ? 'right' : 'left'}`}>
                        {lang === 'ar' ? hotspot.dept_name_ar : hotspot.dept_name_en}
                      </td>
                      <td className="text-center py-3">{hotspot.n}</td>
                      <td className="text-center py-3">
                        <Badge variant={getRiskBadgeVariant(hotspot.avg_risk)}>
                          {hotspot.avg_risk.toFixed(1)}
                        </Badge>
                      </td>
                      <td className="text-center py-3">
                        <span className={getRiskColor(hotspot.pct_high)}>
                          {hotspot.pct_high.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDPL Notice */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            {t('retention.ui.pdplNotice')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};