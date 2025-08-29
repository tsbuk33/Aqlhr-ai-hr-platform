import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, RefreshCw, TrendingUp } from 'lucide-react'
import { usePolicyList, type PolicyListItem } from '../api/listPolicies'
import { formatArabicNumber } from '@/lib/utils'

interface PolicyRiskTableProps {
  searchQuery?: string
  dateFrom?: string
  dateTo?: string
  onViewPolicy?: (policy: PolicyListItem) => void
}

export function PolicyRiskTable({
  searchQuery,
  dateFrom,
  dateTo,
  onViewPolicy
}: PolicyRiskTableProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const { 
    data: policyData, 
    isLoading, 
    error,
    refetch 
  } = usePolicyList({
    page: currentPage,
    pageSize,
    q: searchQuery,
    from: dateFrom,
    to: dateTo
  })

  const formatScore = (score: number) => {
    return isRTL ? formatArabicNumber(score as number, i18n.language) : score.toFixed(1)
  }

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50'
    if (score >= 6) return 'text-orange-600 bg-orange-50'
    if (score >= 4) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
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
            <p>Error loading policies: {error.message}</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
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

  const policies = policyData?.rows || []
  const totalCount = policyData?.total || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <TrendingUp className="h-5 w-5" />
          <span>Policy Risk Table</span>
        </CardTitle>
        <CardDescription>
          Policy risk assessments ({totalCount} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{policy.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{policy.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {new Date(policy.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Badge 
                    variant="secondary" 
                    className={getRiskColor(policy.overall_score)}
                  >
                    Risk: {formatScore(policy.overall_score)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewPolicy?.(policy)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {policies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No policies found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}