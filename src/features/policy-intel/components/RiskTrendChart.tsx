import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, RefreshCw, BarChart3 } from 'lucide-react'
import { usePolicyTrends, type TrendData } from '../api/listPolicies'
import { formatArabicNumber } from '@/lib/utils'

interface RiskTrendChartProps {
  from?: string
  to?: string
  onRefresh?: () => void
}

export function RiskTrendChart({ from, to, onRefresh }: RiskTrendChartProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  const { 
    data: trendsData, 
    isLoading, 
    error,
    refetch 
  } = usePolicyTrends(from, to)

  const formatNumber = (value: number) => {
    return isRTL ? formatArabicNumber(value, i18n.language) : value.toFixed(1)
  }

  const handleRefresh = () => {
    refetch()
    onRefresh?.()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
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
      {trendsData && trendsData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold">{formatNumber(trendsData[0].total_policies)}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                  <p className="text-2xl font-bold text-warning">{formatNumber(trendsData[0].avg_risk_score)}</p>
                </div>
                <BarChart3 className="h-4 w-4 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-destructive">{formatNumber(trendsData[0].high_risk_count)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Risk</p>
                  <p className="text-2xl font-bold text-success">{formatNumber(trendsData[0].low_risk_count)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <TrendingUp className="h-5 w-5" />
                <span>Risk Trends</span>
              </CardTitle>
              <CardDescription>
                Policy risk assessment trends over time
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {trendsData && trendsData.length > 0 ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Chart visualization would be displayed here</p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No trend data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}