import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale, formatNumber } from '@/i18n/locale';
import { useOSI } from '@/hooks/useOSI';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OSICostProps {
  tenantId?: string;
}

export const OSICost: React.FC<OSICostProps> = ({ tenantId }) => {
  const { locale, t } = useLocale();
  const { layers, overview, loading, error } = useOSI(tenantId);

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
          <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('osi', 'no_cost_data')}
          </h3>
          <p className="text-muted-foreground text-center">
            {t('osi', 'no_salary_data')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = layers.map(layer => ({
    layer: `${t('osi', 'layer')} ${layer.layer}`,
    layerNumber: layer.layer,
    total_salary: layer.total_salary,
    avg_salary: layer.avg_salary,
    headcount: layer.headcount
  }));

  const totalSalary = layers.reduce((sum, layer) => sum + layer.total_salary, 0);
  const totalHeadcount = layers.reduce((sum, layer) => sum + layer.headcount, 0);
  const averageSalaryOverall = totalHeadcount > 0 ? totalSalary / totalHeadcount : 0;
  const managementCost = overview?.management_cost || 0;

  // Calculate cost efficiency metrics
  const highestCostLayer = layers.reduce((max, layer) => 
    layer.total_salary > max.total_salary ? layer : max, layers[0]
  );
  
  const lowestCostLayer = layers.reduce((min, layer) => 
    layer.total_salary < min.total_salary ? layer : min, layers[0]
  );

  return (
    <div className="space-y-6" key={locale}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('osi', 'total_monthly_cost')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(totalSalary, locale)} {t('osi', 'currency')}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'all_employees')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {t('osi', 'management_cost')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatNumber(managementCost, locale)} {t('osi', 'currency')}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'monthly_management_expense')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('osi', 'average_salary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatNumber(averageSalaryOverall, locale)} {t('osi', 'currency')}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'across_organization')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('osi', 'cost_per_employee')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {formatNumber(averageSalaryOverall, locale)} {t('osi', 'currency')}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'per_month')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost by Layer Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('osi', 'salary_cost_by_layer')}
          </CardTitle>
          <CardDescription>
            {t('osi', 'total_salary_distribution')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="layer" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-semibold mb-2">{label}</p>
                          <p className="text-sm">
                            {t('osi', 'total_salary')}: {formatNumber(data.total_salary, locale)} {t('osi', 'currency')}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'avg_salary')}: {formatNumber(data.avg_salary, locale)} {t('osi', 'currency')}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'headcount')}: {formatNumber(data.headcount, locale)}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'cost_percentage')}: {((data.total_salary / totalSalary) * 100).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="total_salary" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Average Salary by Layer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('osi', 'average_salary_by_layer')}
          </CardTitle>
          <CardDescription>
            {t('osi', 'compensation_distribution')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="layer" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-semibold mb-2">{label}</p>
                          <p className="text-sm">
                            {t('osi', 'avg_salary')}: {formatNumber(data.avg_salary, locale)} {t('osi', 'currency')}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'headcount')}: {formatNumber(data.headcount, locale)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avg_salary" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.layerNumber <= 2 ? 'hsl(var(--warning))' : 'hsl(var(--success))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Cost Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('osi', 'cost_breakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t('osi', 'highest_cost_layer')}</span>
                <div className="text-right">
                  <div className="font-semibold">
                    {t('osi', 'layer')} {highestCostLayer.layer}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatNumber(highestCostLayer.total_salary, locale)} {t('osi', 'currency')}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>{t('osi', 'lowest_cost_layer')}</span>
                <div className="text-right">
                  <div className="font-semibold">
                    {t('osi', 'layer')} {lowestCostLayer.layer}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatNumber(lowestCostLayer.total_salary, locale)} {t('osi', 'currency')}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>{t('osi', 'cost_concentration')}</span>
                <div className="text-right">
                  <div className="font-semibold">
                    {((highestCostLayer.total_salary / totalSalary) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('osi', 'in_layer')} {highestCostLayer.layer}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>{t('osi', 'cost_efficiency')}</span>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatNumber(totalSalary / totalHeadcount, locale)} {t('osi', 'currency')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('osi', 'per_employee')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('osi', 'layer_efficiency')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {layers.map(layer => {
                const costPerEmployee = layer.headcount > 0 ? layer.total_salary / layer.headcount : 0;
                const efficiencyRatio = averageSalaryOverall > 0 ? (costPerEmployee / averageSalaryOverall) : 1;
                
                return (
                  <div key={layer.layer} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{t('osi', 'layer')} {layer.layer}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(layer.headcount, locale)} {t('osi', 'employees')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatNumber(costPerEmployee, locale)} {t('osi', 'currency')}
                      </div>
                      <div className={`text-xs ${
                        efficiencyRatio > 1.2 ? 'text-warning' : 
                        efficiencyRatio < 0.8 ? 'text-muted-foreground' : 
                        'text-success'
                      }`}>
                        {efficiencyRatio > 1.2 ? t('osi', 'high_cost') : 
                         efficiencyRatio < 0.8 ? t('osi', 'low_cost') : 
                         t('osi', 'balanced')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('osi', 'cost_optimization')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Check for high-cost outliers */}
            {layers.some(layer => layer.avg_salary > averageSalaryOverall * 1.5) && (
              <div className="p-4 bg-warning/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-warning mb-1">
                      {t('osi', 'high_salary_layers')}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('osi', 'salary_optimization_needed')}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t('osi', 'review_compensation_structure')}</li>
                      <li>• {t('osi', 'benchmark_market_rates')}</li>
                      <li>• {t('osi', 'consider_role_consolidation')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Management cost analysis */}
            {managementCost > totalSalary * 0.15 && (
              <div className="p-4 bg-destructive/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">
                      {t('osi', 'high_management_cost')}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('osi', 'management_cost_optimization')}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t('osi', 'reduce_management_layers')}</li>
                      <li>• {t('osi', 'increase_span_of_control')}</li>
                      <li>• {t('osi', 'automate_management_tasks')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {managementCost <= totalSalary * 0.15 && layers.every(layer => layer.avg_salary <= averageSalaryOverall * 1.3) && (
              <div className="p-4 bg-success/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <h4 className="font-semibold text-success mb-1">
                      {t('osi', 'optimized_cost_structure')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('osi', 'cost_structure_healthy')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};