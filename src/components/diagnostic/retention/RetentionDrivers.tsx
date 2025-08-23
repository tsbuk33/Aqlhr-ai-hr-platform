import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getLang } from '@/lib/i18n/getLang';
import { RetentionDriver } from '@/hooks/useRetention';

interface Props {
  drivers: RetentionDriver[];
  loading: boolean;
  tenantId: string | null;
}

export const RetentionDrivers: React.FC<Props> = ({
  drivers,
  loading,
  tenantId
}) => {
  const lang = getLang();
  const isRTL = lang === 'ar';

  const t = (key: string) => {
    const translations: Record<string, any> = {
      retention: {
        drivers: {
          title: lang === 'ar' ? "محركات الخطر" : "Risk Drivers",
          description: lang === 'ar' 
            ? "العوامل الأكثر تأثيراً على مخاطر ترك الموظفين" 
            : "Factors with highest impact on employee turnover risk",
          globalDrivers: lang === 'ar' ? "المحركات العامة" : "Global Risk Drivers"
        },
        grid: {
          factor: lang === 'ar' ? "العامل" : "Factor",
          impact: lang === 'ar' ? "الأثر" : "Impact", 
          frequency: lang === 'ar' ? "التكرار" : "Frequency"
        },
        ui: {
          noData: lang === 'ar' ? "لا توجد بيانات حتى الآن" : "No data yet",
          loading: lang === 'ar' ? "جاري التحميل..." : "Loading..."
        },
        factors: {
          low_tenure: lang === 'ar' ? "فترة خدمة قصيرة" : "Low Tenure",
          below_median_salary: lang === 'ar' ? "راتب أقل من المتوسط" : "Below Median Salary",
          no_manager: lang === 'ar' ? "بدون مدير مباشر" : "No Manager",
          high_workload: lang === 'ar' ? "عبء عمل مرتفع" : "High Workload",
          low_engagement: lang === 'ar' ? "مشاركة منخفضة" : "Low Engagement",
          career_stagnation: lang === 'ar' ? "ركود وظيفي" : "Career Stagnation"
        }
      }
    };

    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const getFactorName = (factorKey: string) => {
    return t(`retention.factors.${factorKey}`) || factorKey.replace(/_/g, ' ');
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 0.25) return 'destructive';
    if (impact >= 0.15) return 'secondary';
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

  if (drivers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">{t('retention.ui.noData')}</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = drivers.map(driver => ({
    name: getFactorName(driver.factor_name),
    impact: driver.avg_impact * 100, // Convert to percentage
    frequency: driver.frequency
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('retention.drivers.title')}</CardTitle>
          <CardDescription>{t('retention.drivers.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={isRTL ? 45 : -45}
                  textAnchor={isRTL ? 'start' : 'end'}
                  height={80}
                />
                <YAxis 
                  label={{ 
                    value: t('retention.grid.impact'), 
                    angle: isRTL ? 90 : -90, 
                    position: 'insideLeft' 
                  }} 
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}%`, 
                    name === 'impact' ? t('retention.grid.impact') : t('retention.grid.frequency')
                  ]}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="impact" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('retention.drivers.globalDrivers')}</CardTitle>
          <CardDescription>
            Detailed breakdown of risk factors and their impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className={`text-${isRTL ? 'right' : 'left'} py-3 font-medium`}>
                    {t('retention.grid.factor')}
                  </th>
                  <th className="text-center py-3 font-medium">{t('retention.grid.impact')}</th>
                  <th className="text-center py-3 font-medium">{t('retention.grid.frequency')}</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => (
                  <tr key={driver.factor_name || index} className="border-b">
                    <td className={`py-3 text-${isRTL ? 'right' : 'left'}`}>
                      {getFactorName(driver.factor_name)}
                    </td>
                    <td className="text-center py-3">
                      <Badge variant={getImpactColor(driver.avg_impact)}>
                        {(driver.avg_impact * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="text-center py-3">
                      <span className="text-muted-foreground">
                        {driver.frequency} employees
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};