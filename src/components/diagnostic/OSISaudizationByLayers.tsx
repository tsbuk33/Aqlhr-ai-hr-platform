import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocale, formatNumber } from '@/i18n/locale';
import { useOSI } from '@/hooks/useOSI';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface OSISaudizationByLayersProps {
  tenantId?: string;
}

export const OSISaudizationByLayers: React.FC<OSISaudizationByLayersProps> = ({ tenantId }) => {
  const { locale, t } = useLocale();
  const { layers, settings, overview, loading, error } = useOSI(tenantId);

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
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('osi', 'no_saudization_data')}
          </h3>
          <p className="text-muted-foreground text-center">
            {t('osi', 'no_org_structure')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const saudiTarget = settings?.saudi_target || 40;
  
  const chartData = layers.map(layer => ({
    layer: `${t('osi', 'layer')} ${layer.layer}`,
    layerNumber: layer.layer,
    saudization_rate: layer.saudization_rate,
    headcount: layer.headcount,
    saudi_headcount: layer.saudi_headcount,
    isCritical: layer.saudization_rate < saudiTarget,
    meetTarget: layer.saudization_rate >= saudiTarget
  }));

  const layersMeetingTarget = layers.filter(layer => layer.saudization_rate >= saudiTarget).length;
  const criticalLayers = layers.filter(layer => layer.saudization_rate < saudiTarget).length;
  const highestSaudiLayer = layers.reduce((min, layer) => 
    layer.saudi_headcount > 0 ? Math.min(min, layer.layer) : min, 
    Infinity
  );

  const totalHeadcount = layers.reduce((sum, layer) => sum + layer.headcount, 0);
  const totalSaudiHeadcount = layers.reduce((sum, layer) => sum + layer.saudi_headcount, 0);
  const overallSaudizationRate = totalHeadcount > 0 ? (totalSaudiHeadcount / totalHeadcount) * 100 : 0;

  return (
    <div className="space-y-6" key={locale}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('osi', 'saudization_target')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{saudiTarget}%</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'target_rate')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('osi', 'layers_meeting_target')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{layersMeetingTarget}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'out_of')} {layers.length} {t('osi', 'layers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t('osi', 'critical_layers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalLayers}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'below_target')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('osi', 'highest_saudi_layer')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {highestSaudiLayer === Infinity ? '-' : highestSaudiLayer}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'leadership_level')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Saudization Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('osi', 'saudization_by_layers')}
          </CardTitle>
          <CardDescription>
            {t('osi', 'saudization_distribution_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="layer" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-semibold mb-2">{label}</p>
                          <p className="text-sm">
                            {t('osi', 'saudization_rate')}: {formatNumber(data.saudization_rate, locale)}%
                          </p>
                          <p className="text-sm">
                            {t('osi', 'saudi_employees')}: {formatNumber(data.saudi_headcount, locale)}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'total_employees')}: {formatNumber(data.headcount, locale)}
                          </p>
                          <p className="text-sm">
                            {t('osi', 'status')}: {data.isCritical ? t('osi', 'critical') : t('osi', 'meets_target')}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  y={saudiTarget} 
                  stroke="hsl(var(--warning))" 
                  strokeDasharray="5 5"
                  label={{ value: `${t('osi', 'target')}: ${saudiTarget}%`, position: 'insideTopRight' }}
                />
                <Bar dataKey="saudization_rate" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isCritical ? 'hsl(var(--destructive))' : 'hsl(var(--success))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Layer Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-success">{t('osi', 'compliant_layers')}</CardTitle>
          </CardHeader>
          <CardContent>
            {layersMeetingTarget > 0 ? (
              <div className="space-y-3">
                {layers.filter(layer => layer.saudization_rate >= saudiTarget).map(layer => (
                  <div key={layer.layer} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div>
                      <div className="font-medium">{t('osi', 'layer')} {layer.layer}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(layer.headcount, locale)} {t('osi', 'employees')}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="bg-success text-success-foreground">
                        {formatNumber(layer.saudization_rate, locale)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('osi', 'no_compliant_layers')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-destructive">{t('osi', 'critical_layers_detail')}</CardTitle>
          </CardHeader>
          <CardContent>
            {criticalLayers > 0 ? (
              <div className="space-y-3">
                {layers.filter(layer => layer.saudization_rate < saudiTarget).map(layer => (
                  <div key={layer.layer} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                    <div>
                      <div className="font-medium">{t('osi', 'layer')} {layer.layer}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(layer.headcount, locale)} {t('osi', 'employees')}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">
                        {formatNumber(layer.saudization_rate, locale)}%
                      </Badge>
                      <div className="text-xs text-destructive mt-1">
                        {t('osi', 'needs')} {formatNumber(saudiTarget - layer.saudization_rate, locale)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-success mb-2" />
                  <div className="font-medium text-success">{t('osi', 'all_layers_compliant')}</div>
                  <div className="text-sm text-muted-foreground">{t('osi', 'excellent_performance')}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Overall Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('osi', 'overall_performance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatNumber(overallSaudizationRate, locale)}%
              </div>
              <div className="text-sm text-muted-foreground">{t('osi', 'overall_saudization')}</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {layersMeetingTarget}/{layers.length}
              </div>
              <div className="text-sm text-muted-foreground">{t('osi', 'compliant_layers')}</div>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${criticalLayers === 0 ? 'text-success' : 'text-destructive'}`}>
                {criticalLayers === 0 ? t('osi', 'excellent') : `${criticalLayers} ${t('osi', 'critical')}`}
              </div>
              <div className="text-sm text-muted-foreground">{t('osi', 'improvement_needed')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};