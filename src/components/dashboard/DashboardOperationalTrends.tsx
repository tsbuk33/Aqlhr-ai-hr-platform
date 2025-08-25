import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardTrends } from '@/hooks/useDashboardTrends';
import { useLocale } from '@/i18n/locale';
import { useMemo } from 'react';

export function DashboardOperationalTrends() {
  const { t } = useLocale();
  const { series, loading, error } = useDashboardTrends(365);

  const chartData = useMemo(() => {
    return series.map(item => ({
      date: new Date(item.d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      saudization: item.saudization_rate,
      safety: item.hse_safety_score,
      compliance: item.compliance_score,
      experience: item.employee_experience_10
    }));
  }, [series]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard', 'trends.title')}</CardTitle>
          <CardDescription>{t('dashboard', 'trends.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            {error ? t('dashboard', 'error_loading_trends') : t('dashboard', 'no_trend_data_available')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard', 'trends.title')}</CardTitle>
        <CardDescription>{t('dashboard', 'trends.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="saudization"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name={t('dashboard', 'trends.saudization_rate')}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="safety"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              name={t('dashboard', 'trends.hse_safety')}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="compliance"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              name={t('dashboard', 'trends.compliance')}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="experience"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              name={t('dashboard', 'trends.employee_experience')}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}