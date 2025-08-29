import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { usePolicyTrends, type TrendData } from '../api/listPolicies'
import { formatArabicNumber } from '@/lib/utils'

interface RiskTrendChartProps {
  dateFrom?: string
  dateTo?: string
  onRefresh?: () => void
}

interface SeriesConfig {
  key: keyof TrendData
  label: string
  color: string
  enabled: boolean
}

export function RiskTrendChart({ dateFrom, dateTo, onRefresh }: RiskTrendChartProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  const { 
    data: trendsData, 
    isLoading, 
    error,
    refetch 
  } = usePolicyTrends(dateFrom, dateTo)

  // Series configuration
  const [seriesConfig, setSeriesConfig] = useState<SeriesConfig[]>([
    { key: 'overall_avg', label: t('policy.trends.overall'), color: '#8884d8', enabled: true },
    { key: 'saudi_labor_avg', label: t('policy.trends.saudiLabor'), color: '#82ca9d', enabled: true },
    { key: 'data_protection_avg', label: t('policy.trends.dataProtection'), color: '#ffc658', enabled: false },
    { key: 'financial_implications_avg', label: t('policy.trends.financial'), color: '#ff7300', enabled: false },
    { key: 'change_resistance_avg', label: t('policy.trends.changeMgmt'), color: '#00ff7f', enabled: false },
  ])

  // Process data for chart
  const chartData = useMemo(() => {
    if (!trendsData) return []

    return trendsData.map((item) => ({
      ...item,
      date: new Date(item.day).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
        month: 'short',
        day: 'numeric'
      })
    }))
  }, [trendsData, isRTL])

  // Calculate trend statistics
  const trendStats = useMemo(() => {
    if (!trendsData || trendsData.length < 2) return null

    const latest = trendsData[trendsData.length - 1]
    const previous = trendsData[trendsData.length - 2]

    const overallTrend = latest.overall_avg - previous.overall_avg
    const assessmentTrend = latest.assessment_count - previous.assessment_count

    return {
      overallTrend,
      assessmentTrend,
      latestOverall: latest.overall_avg,
      totalAssessments: trendsData.reduce((sum, item) => sum + item.assessment_count, 0)
    }
  }, [trendsData])

  const toggleSeries = (index: number) => {
    setSeriesConfig(prev => prev.map((series, i) => 
      i === index ? { ...series, enabled: !series.enabled } : series
    ))
  }

  const handleRefresh = () => {
    refetch()
    onRefresh?.()
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0.1) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend < -0.1) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const formatNumber = (value: number) => {
    return isRTL ? formatArabicNumber(value, 1) : value.toFixed(1)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>{t('common.loading')}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <p>Error loading trends: {error.message}</p>
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      {trendStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('policy.trends.stats.latest')}</p>
                  <p className="text-2xl font-bold">{formatNumber(trendStats.latestOverall)}</p>
                </div>
                {getTrendIcon(trendStats.overallTrend)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('policy.trends.stats.trend')}</p>
                  <p className={`text-2xl font-bold ${trendStats.overallTrend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {trendStats.overallTrend > 0 ? '+' : ''}{formatNumber(trendStats.overallTrend)}
                  </p>
                </div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('policy.trends.stats.assessments')}</p>
                <p className="text-2xl font-bold">{formatNumber(trendStats.totalAssessments)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('policy.trends.stats.period')}</p>
                <p className="text-2xl font-bold">{formatNumber(trendsData?.length || 0)} {t('policy.trends.stats.days')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <TrendingUp className="h-5 w-5" />
                <span>{t('policy.trends.title')}</span>
              </CardTitle>
              <CardDescription>
                {t('policy.trends.description')}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('policy.trends.refresh')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Series Toggle Controls */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">{t('policy.trends.series')}</h4>
            <div className="flex flex-wrap gap-4">
              {seriesConfig.map((series, index) => (
                <div key={series.key} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`series-${index}`}
                    checked={series.enabled}
                    onCheckedChange={() => toggleSeries(index)}
                  />
                  <label
                    htmlFor={`series-${index}`}
                    className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: series.color }}
                    />
                    <span className="text-sm">{series.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  labelFormatter={(label) => `${t('policy.trends.date')}: ${label}`}
                  formatter={(value: number, name: string) => [
                    formatNumber(value),
                    seriesConfig.find(s => s.key === name)?.label || name
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => seriesConfig.find(s => s.key === value)?.label || value}
                />
                
                {seriesConfig.map((series) => {
                  if (!series.enabled) return null
                  
                  return (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      stroke={series.color}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {chartData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t('policy.trends.noData')}</p>
              <p className="text-sm mt-1">{t('policy.trends.noDataDesc')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Distribution Breakdown */}
      {trendsData && trendsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('policy.trends.breakdown.title')}</CardTitle>
            <CardDescription>
              {t('policy.trends.breakdown.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {seriesConfig.slice(1).map((series) => {
                const latestValue = chartData[chartData.length - 1]?.[series.key] || 0
                return (
                  <div key={series.key} className="text-center p-4 border rounded-lg">
                    <div
                      className="w-4 h-4 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: series.color }}
                    />
                    <p className="text-sm text-muted-foreground mb-1">{series.label}</p>
                    <p className="text-xl font-bold">{formatNumber(latestValue as number)}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}