import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardTrends } from "@/hooks/useDashboardTrends";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAPITranslations } from '@/hooks/useAPITranslations';
export function DashboardTrendsChart() {
  const { series, loading, error, refetch, backfillHistoricalData } = useDashboardTrends();
  const { toast } = useToast();
  const { t } = useAPITranslations();

  const chartData = useMemo(() => {
    return series.map(item => ({
      date: new Date(item.d).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      fullDate: item.d,
      saudization: item.saudization_rate,
      hse_safety: item.hse_safety_score,
      compliance: item.compliance_score,
      employee_exp: item.employee_experience_10 * 10, // Scale to 0-100
      employees: item.total_employees
    }));
  }, [series]);

  const handleBackfill = async () => {
    try {
      await backfillHistoricalData(365);
      await refetch();
      toast({
        title: "Historical Data Generated",
        description: "Generated 365 days of historical KPI data",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate historical data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('dashboard.trends.title')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.trends.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 animate-pulse bg-gray-200 rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('dashboard.trends.title')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.trends.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Failed to load trend data</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('dashboard.trends.title')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.trends.subtitle')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {series.length === 0 && (
              <Button onClick={handleBackfill} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Sample Data
              </Button>
            )}
            <Button onClick={() => refetch()} variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No trend data available</p>
            <Button onClick={handleBackfill} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Historical Data
            </Button>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value: number, _name: string, props: any) => {
                    const key = props?.dataKey as string;
                    const percentKeys = ['saudization', 'hse_safety', 'compliance', 'employee_exp'];
                    const suffix = percentKeys.includes(key) ? '%' : '';
                    return [`${(value as number).toFixed(1)}${suffix}`, props?.name || _name];
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="saudization" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name={t('dashboard.trends.saudization_rate')}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="hse_safety" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name={t('dashboard.trends.hse_safety')}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  name={t('dashboard.trends.compliance')}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="employee_exp" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  name={t('dashboard.trends.employee_experience')}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}