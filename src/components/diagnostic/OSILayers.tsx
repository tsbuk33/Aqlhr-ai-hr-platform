import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale, formatNumber } from '@/i18n/locale';
import { useOSI } from '@/hooks/useOSI';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Layers, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OSILayersProps {
  tenantId?: string;
}

export const OSILayers: React.FC<OSILayersProps> = ({ tenantId }) => {
  const { locale, t } = useLocale();
  const { layers, loading, error } = useOSI(tenantId);

  if (loading) {
    return (
      <div className="space-y-6" key={locale}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-[60px]" />
                <Skeleton className="h-3 w-[120px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card key={locale}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('osi', 'data_error')}
          </h3>
          <p className="text-muted-foreground text-center">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!layers.length) {
    return (
      <Card key={locale}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Layers className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('osi', 'no_layers_data')}
          </h3>
          <p className="text-muted-foreground text-center">
            {t('osi', 'no_org_structure')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = layers.map(layer => ({
    layer: `${t('osi', 'layer')} ${layer.layer}`,
    headcount: layer.headcount,
    saudi_headcount: layer.saudi_headcount,
    saudization_rate: layer.saudization_rate,
    avg_salary: layer.avg_salary
  }));

  const totalHeadcount = layers.reduce((sum, layer) => sum + layer.headcount, 0);
  const totalSaudiHeadcount = layers.reduce((sum, layer) => sum + layer.saudi_headcount, 0);
  const totalSalary = layers.reduce((sum, layer) => sum + layer.total_salary, 0);

  return (
    <div className="space-y-6" key={locale}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4" />
              {t('osi', 'total_layers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{layers.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'organizational_levels')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('osi', 'total_headcount')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalHeadcount, locale)}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'employees_across_layers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('osi', 'saudi_headcount')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalSaudiHeadcount, locale)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber((totalSaudiHeadcount / totalHeadcount) * 100, locale)}% {t('osi', 'of_total')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('osi', 'total_monthly_salary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalSalary, locale)} {t('osi', 'currency')}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'across_all_layers')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Headcount Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('osi', 'headcount_distribution')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="layer" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-semibold mb-2">{label}</p>
                          <p className="text-sm">
                            {t('osi', 'total_employees')}: {formatNumber(data.headcount, locale)}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'saudi_employees')}: {formatNumber(data.saudi_headcount, locale)}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'saudization_rate')}: {formatNumber(data.saudization_rate, locale)}%
                          </p>
                          <p className="text-sm">
                            {t('osi', 'avg_salary')}: {formatNumber(data.avg_salary, locale)} {t('osi', 'currency')}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="headcount" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Layer Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('osi', 'layer_details')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">{t('osi', 'layer')}</th>
                  <th className="text-left p-2 font-medium">{t('osi', 'headcount')}</th>
                  <th className="text-left p-2 font-medium">{t('osi', 'saudi_headcount')}</th>
                  <th className="text-left p-2 font-medium">{t('osi', 'saudization_rate')}</th>
                  <th className="text-left p-2 font-medium">{t('osi', 'avg_salary')}</th>
                  <th className="text-left p-2 font-medium">{t('osi', 'total_salary')}</th>
                </tr>
              </thead>
              <tbody>
                {layers.map((layer, index) => (
                  <tr key={layer.layer} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                    <td className="p-2 font-medium">{layer.layer}</td>
                    <td className="p-2">{formatNumber(layer.headcount, locale)}</td>
                    <td className="p-2">{formatNumber(layer.saudi_headcount, locale)}</td>
                    <td className="p-2">{formatNumber(layer.saudization_rate, locale)}%</td>
                    <td className="p-2">{formatNumber(layer.avg_salary, locale)} {t('osi', 'currency')}</td>
                    <td className="p-2">{formatNumber(layer.total_salary, locale)} {t('osi', 'currency')}</td>
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