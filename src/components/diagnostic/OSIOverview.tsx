import React from 'react';
import { useLocale, formatNumber } from '@/i18n/locale';
import { useOSI } from '@/hooks/useOSI';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, TrendingUp, AlertTriangle, Users, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface OSIOverviewProps {
  tenantId?: string;
}

export const OSIOverview: React.FC<OSIOverviewProps> = ({ tenantId }) => {
  const { locale, t } = useLocale();
  const { overview, layers, loading, error, refresh } = useOSI(tenantId);

  const getHealthScore = () => {
    if (!overview) return 0;
    const totalLayers = overview.total_layers || 1;
    const meetingTarget = overview.layers_meeting_target || 0;
    return Math.round((meetingTarget / totalLayers) * 100);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div key={locale} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
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
      <div key={locale} className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t('osi', 'no_analysis_available')}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {error}
            </p>
            <Button onClick={refresh} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t('osi', 'run_analysis')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!overview) {
    return (
      <div key={locale} className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t('osi', 'no_analysis_available')}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {t('osi', 'run_first_analysis')}
            </p>
            <Button onClick={refresh} className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('osi', 'run_analysis')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const healthScore = getHealthScore();
  const totalHeadcount = layers.reduce((sum, layer) => sum + layer.headcount, 0);
  const totalSaudiHeadcount = layers.reduce((sum, layer) => sum + layer.saudi_headcount, 0);
  const overallSaudizationRate = totalHeadcount > 0 ? (totalSaudiHeadcount / totalHeadcount) * 100 : 0;

  return (
    <div key={locale} className="space-y-6">
      {/* Health Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('osi', 'health_score')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}/100
            </div>
            <div className="flex-1">
              <Progress value={healthScore} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {healthScore >= 80 ? t('osi', 'excellent') : 
                 healthScore >= 60 ? t('osi', 'good') : 
                 healthScore >= 40 ? t('osi', 'needs_improvement') : t('osi', 'critical')}
              </p>
            </div>
            <Button onClick={refresh} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t('osi', 'recompute')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('osi', 'total_layers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="osi-metric">{overview.total_layers}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'organizational_layers')}
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
            <div className="text-2xl font-bold" data-testid="osi-metric">{overview.highest_saudi_layer}</div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'layer')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t('osi', 'critical_layers_below_target')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="osi-metric">{overview.critical_layers}</div>
            <p className="text-xs text-muted-foreground">
              {overview.layers_meeting_target} {t('osi', 'target')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('osi', 'management_cost_monthly')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="osi-metric">
              {formatNumber(overview.management_cost, locale)} SR
            </div>
            <p className="text-xs text-muted-foreground">
              {t('osi', 'cost_to_manage')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('osi', 'org_demographics')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>{t('osi', 'total_headcount')}</span>
              <span className="font-semibold">{totalHeadcount}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('osi', 'saudization_rate')}</span>
              <span className="font-semibold">{formatNumber(overallSaudizationRate, locale)}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('osi', 'saudi_headcount')}</span>
              <span className="font-semibold">{totalSaudiHeadcount}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('osi', 'total_layers')}</span>
              <span className="font-semibold">{overview.total_layers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('osi', 'span_outliers')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <Badge variant="secondary">{t('osi', 'low')}</Badge>
              </span>
              <span className="font-semibold">{overview.span_outliers_low}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <Badge variant="destructive">{t('osi', 'high')}</Badge>
              </span>
              <span className="font-semibold">{overview.span_outliers_high}</span>
            </div>
            {(overview.span_outliers_low === 0 && overview.span_outliers_high === 0) && (
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-sm">{t('osi', 'no_critical_issues')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('osi', 'available_actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('osi', 'generate_report')}
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              {t('osi', 'view_org_chart')}
            </Button>
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('osi', 'analyze_costs')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};