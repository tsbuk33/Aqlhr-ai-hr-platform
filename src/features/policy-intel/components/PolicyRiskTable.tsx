import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  MoreHorizontal, 
  Eye, 
  RefreshCw, 
  Download,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { RiskScoreCard } from './RiskScoreCard'
import { usePolicyList, type PolicyListItem } from '../api/listPolicies'
import { useRecomputePolicy } from '../api/recomputePolicy'
import { useExportSinglePolicy } from '../api/exportPolicies'
import { usePushAssessmentMemory } from '../api/pushAssessmentMemory'
import { formatArabicNumber } from '@/lib/utils'

interface PolicyRiskTableProps {
  searchQuery?: string
  dateFrom?: string
  dateTo?: string
  orderBy?: 'created_at' | 'overall'
  orderDir?: 'asc' | 'desc'
  onViewPolicy?: (policy: PolicyListItem) => void
}

export function PolicyRiskTable({
  searchQuery,
  dateFrom,
  dateTo,
  orderBy = 'created_at',
  orderDir = 'desc',
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
    to: dateTo,
    orderBy,
    dir: orderDir
  })

  const { recompute, progress, isStreaming } = useRecomputePolicy()
  const exportSingle = useExportSinglePolicy()
  const pushMemory = usePushAssessmentMemory()

  const handleViewPolicy = (policy: PolicyListItem) => {
    // Push assessment to Ask Aql memory for context
    pushMemory.mutate(policy)
    onViewPolicy?.(policy)
  }

  const handleReanalyze = (policyId: string) => {
    recompute(policyId, true)
  }

  const handleExportRow = (policy: PolicyListItem, format: 'csv' | 'xlsx') => {
    exportSingle.mutate({
      policyId: policy.id,
      format,
      lang: i18n.language as 'en' | 'ar'
    })
  }

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50'
    if (score >= 6) return 'text-orange-600 bg-orange-50'
    if (score >= 4) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const formatScore = (score: number) => {
    return isRTL ? formatArabicNumber(score, 1) : score.toFixed(1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
  const totalPages = policyData?.totalPages || 1

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <TrendingUp className="h-5 w-5" />
            <span>{t('policy.history.table.title')}</span>
          </CardTitle>
          <CardDescription>
            {t('policy.history.table.description')} ({totalCount} {t('policy.history.table.total')})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('policy.table.createdAt')}</TableHead>
                <TableHead>{t('policy.table.title')}</TableHead>
                <TableHead className="text-center">{t('policy.table.overall')}</TableHead>
                <TableHead className="text-center">{t('policy.family.compliance')}</TableHead>
                <TableHead className="text-center">{t('policy.family.business')}</TableHead>
                <TableHead className="text-center">{t('policy.family.implementation')}</TableHead>
                <TableHead className="text-center">{t('policy.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => {
                const complianceAvg = (
                  policy.compliance_score.saudiLaborLaw +
                  policy.compliance_score.workplaceRights +
                  policy.compliance_score.discriminationPrevention +
                  policy.compliance_score.dataProtection
                ) / 4

                const businessAvg = (
                  policy.business_score.operationalComplexity +
                  policy.business_score.resourceRequirements +
                  policy.business_score.stakeholderImpact +
                  policy.business_score.financialImplications
                ) / 4

                const implementationAvg = (
                  policy.implementation_score.systemComplexity +
                  policy.implementation_score.changeResistance +
                  policy.implementation_score.trainingRequirements +
                  policy.implementation_score.monitoringDifficulty
                ) / 4

                const isRecomputing = isStreaming && progress?.result?.id === policy.id

                return (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(policy.created_at)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate" title={policy.title}>
                          {policy.title}
                        </p>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-muted-foreground mt-1">
                          <span>{policy.mitigation_count} {t('policy.mitigations')}</span>
                          <span>•</span>
                          <span>{policy.citation_count} {t('policy.citations')}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge 
                        variant="secondary" 
                        className={getRiskColor(policy.overall_score)}
                      >
                        {formatScore(policy.overall_score)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={getRiskColor(complianceAvg)}
                      >
                        {formatScore(complianceAvg)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={getRiskColor(businessAvg)}
                      >
                        {formatScore(businessAvg)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={getRiskColor(implementationAvg)}
                      >
                        {formatScore(implementationAvg)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPolicy(policy)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('policy.action.view')}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReanalyze(policy.id)}
                          disabled={isRecomputing}
                        >
                          <RefreshCw className={`h-4 w-4 mr-1 ${isRecomputing ? 'animate-spin' : ''}`} />
                          {isRecomputing ? t('policy.action.reanalyzing') : t('policy.action.reanalyze')}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            <DropdownMenuItem
                              onClick={() => handleExportRow(policy, 'csv')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t('policy.export.csv')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleExportRow(policy, 'xlsx')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t('policy.export.xlsx')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {isRecomputing && progress && (
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground mb-1">
                            {progress.message}
                          </div>
                          <Progress 
                            value={progress.progress || 0} 
                            className="h-1"
                          />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {policies.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('policy.history.table.noData')}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                {t('policy.history.table.showing')} {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} {t('policy.history.table.of')} {totalCount}
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  {t('common.previous')}
                </Button>
                
                <span className="text-sm px-3">
                  {t('policy.history.table.page')} {formatArabicNumber(currentPage)} {t('policy.history.table.of')} {formatArabicNumber(totalPages)}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  {t('common.next')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}