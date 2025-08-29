import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, FileText, TrendingUp, AlertTriangle } from 'lucide-react'
import { usePolicyList } from '../api/listPolicies'
import { RiskScoreCard } from './RiskScoreCard'
import { formatArabicNumber } from '@/lib/utils'
import { RiskTrendChart } from './RiskTrendChart'

interface PolicyRiskPanelProps {
  className?: string
}

export function PolicyRiskPanel({ className }: PolicyRiskPanelProps) {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })

  const { data: policyData, isLoading, error } = usePolicyList({
    q: searchQuery,
    from: dateRange.from,
    to: dateRange.to,
    page: 1,
    pageSize: 10
  })

  const isRtl = i18n.language === 'ar'

  return (
    <div className={className}>
      <div className="grid gap-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Policy Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="From"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                />
                <Input
                  type="date"
                  placeholder="To"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        {policyData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
                    <p className="text-2xl font-bold">
                      {formatArabicNumber(policyData.total, i18n.language)}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                    <p className="text-2xl font-bold text-warning">
                      {policyData.rows.length > 0 
                        ? formatArabicNumber(
                            Math.round((policyData.rows.reduce((acc, p) => acc + p.overall_score, 0) / policyData.rows.length) * 10) / 10,
                            i18n.language
                          )
                        : '0'
                      }
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold text-destructive">
                      {formatArabicNumber(
                        policyData.rows.filter(p => p.overall_score >= 8).length,
                        i18n.language
                      )}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Policy List</TabsTrigger>
            <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <p>Loading policies...</p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-destructive">Error loading policies: {error.message}</p>
                </CardContent>
              </Card>
            )}

            {policyData?.rows.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{policy.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(policy.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={policy.overall_score >= 8 ? 'destructive' : policy.overall_score >= 6 ? 'secondary' : 'default'}>
                      Risk: {policy.overall_score.toFixed(1)}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RiskScoreCard 
                      title="Compliance Risk"
                      score={Object.values(policy.compliance_score).reduce((a, b) => a + b, 0) / 4}
                    />
                    <RiskScoreCard 
                      title="Business Impact"
                      score={Object.values(policy.business_score).reduce((a, b) => a + b, 0) / 4}
                    />
                    <RiskScoreCard 
                      title="Implementation Risk"
                      score={Object.values(policy.implementation_score).reduce((a, b) => a + b, 0) / 4}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="trends">
            <RiskTrendChart 
              from={dateRange.from} 
              to={dateRange.to}
              onRefresh={() => window.location.reload()}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}