import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocale, formatNumber } from '@/i18n/locale';
import { useOSI } from '@/hooks/useOSI';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Users, BarChart3, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OSISpanProps {
  tenantId?: string;
}

export const OSISpan: React.FC<OSISpanProps> = ({ tenantId }) => {
  const { locale, t } = useLocale();
  const { spanOutliers, settings, loading, error } = useOSI(tenantId);
  const { user } = useAuthOptional();
  
  // Check if user has admin role for PII access using useAuthOptional roles
  const hasAdminAccess = false; // Simplified for now - will be properly implemented with role system

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

  const spanMin = settings?.span_min || 5;
  const spanMax = settings?.span_max || 8;

  const lowSpanOutliers = spanOutliers.filter(outlier => outlier.severity === 'low');
  const highSpanOutliers = spanOutliers.filter(outlier => outlier.severity === 'high');
  const okSpanManagers = spanOutliers.filter(outlier => outlier.severity === 'ok');

  // Create histogram data for span distribution
  const spanDistribution = spanOutliers.reduce((acc, outlier) => {
    const span = outlier.direct_reports;
    const existing = acc.find(item => item.span === span);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ span, count: 1, isOptimal: span >= spanMin && span <= spanMax });
    }
    return acc;
  }, [] as { span: number; count: number; isOptimal: boolean }[]);

  spanDistribution.sort((a, b) => a.span - b.span);

  if (!spanOutliers.length && !spanDistribution.length) {
    return (
      <Card key={locale}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('osi', 'no_span_data')}
          </h3>
          <p className="text-muted-foreground text-center">
            {t('osi', 'no_management_structure')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" key={locale}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('osi', 'total_managers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spanOutliers.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'with_direct_reports')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t('osi', 'low_span_outliers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowSpanOutliers.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'less_than')} {spanMin} {t('osi', 'reports')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t('osi', 'high_span_outliers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highSpanOutliers.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'more_than')} {spanMax} {t('osi', 'reports')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('osi', 'optimal_span')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{okSpanManagers.length}</div>
            <p className="text-xs text-muted-foreground">
              {spanMin}-{spanMax} {t('osi', 'reports')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Span Distribution Histogram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('osi', 'span_distribution')}
          </CardTitle>
          <CardDescription>
            {t('osi', 'span_distribution_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spanDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="span" 
                  label={{ value: t('osi', 'direct_reports'), position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: t('osi', 'number_of_managers'), angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-semibold">
                            {label} {t('osi', 'direct_reports')}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'managers')}: {data.count}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'status')}: {data.isOptimal ? t('osi', 'optimal') : t('osi', 'outlier')}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {spanDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isOptimal ? 'hsl(var(--success))' : 'hsl(var(--warning))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {t('osi', 'optimal_range')}: {spanMin}-{spanMax} {t('osi', 'direct_reports')}
          </div>
        </CardContent>
      </Card>

      {/* Outliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('osi', 'span_outliers')}</CardTitle>
          <CardDescription>
            {hasAdminAccess ? t('osi', 'detailed_outliers_admin') : t('osi', 'detailed_outliers_basic')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {spanOutliers.filter(outlier => outlier.severity !== 'ok').length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {hasAdminAccess && (
                      <th className="text-left p-2 font-medium">{t('osi', 'manager_name')}</th>
                    )}
                    <th className="text-left p-2 font-medium">{t('osi', 'layer')}</th>
                    <th className="text-left p-2 font-medium">{t('osi', 'direct_reports')}</th>
                    <th className="text-left p-2 font-medium">{t('osi', 'severity')}</th>
                    <th className="text-left p-2 font-medium">{t('osi', 'recommendation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {spanOutliers.filter(outlier => outlier.severity !== 'ok').map((outlier, index) => (
                    <tr key={outlier.manager_id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                      {hasAdminAccess && (
                        <td className="p-2">
                          {outlier.full_name_en || outlier.full_name_ar || t('osi', 'anonymous')}
                        </td>
                      )}
                      <td className="p-2">{outlier.layer}</td>
                      <td className="p-2">{outlier.direct_reports}</td>
                      <td className="p-2">
                        <Badge 
                          variant={outlier.severity === 'low' ? 'secondary' : 'destructive'}
                        >
                          {outlier.severity === 'low' ? t('osi', 'low') : t('osi', 'high')}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {outlier.severity === 'low' 
                          ? t('osi', 'increase_span_recommendation')
                          : t('osi', 'reduce_span_recommendation')
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
                <h3 className="text-lg font-semibold text-success mb-2">
                  {t('osi', 'excellent_span_management')}
                </h3>
                <p className="text-muted-foreground">
                  {t('osi', 'all_managers_optimal_span')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Improvement Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('osi', 'improvement_recommendations')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowSpanOutliers.length > 0 && (
              <div className="p-4 bg-warning/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-warning mb-1">
                      {t('osi', 'low_span_recommendation')}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {lowSpanOutliers.length} {t('osi', 'managers_low_span')}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t('osi', 'consolidate_roles')}</li>
                      <li>• {t('osi', 'expand_responsibilities')}</li>
                      <li>• {t('osi', 'eliminate_redundancies')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {highSpanOutliers.length > 0 && (
              <div className="p-4 bg-destructive/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">
                      {t('osi', 'high_span_recommendation')}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {highSpanOutliers.length} {t('osi', 'managers_high_span')}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t('osi', 'add_middle_management')}</li>
                      <li>• {t('osi', 'delegate_responsibilities')}</li>
                      <li>• {t('osi', 'create_team_leads')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {lowSpanOutliers.length === 0 && highSpanOutliers.length === 0 && (
              <div className="p-4 bg-success/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <h4 className="font-semibold text-success mb-1">
                      {t('osi', 'optimal_management')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('osi', 'maintain_current_structure')}
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