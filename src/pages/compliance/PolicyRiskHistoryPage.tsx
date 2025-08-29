import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  Download, 
  RefreshCw,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react'
import { RiskTrendChart } from '../../features/policy-intel/components/RiskTrendChart'
import { PolicyRiskTable } from '../../features/policy-intel/components/PolicyRiskTable'
import { useExportPolicies } from '../../features/policy-intel/api/exportPolicies'
import type { PolicyListItem } from '../../features/policy-intel/api/listPolicies'

export default function PolicyRiskHistoryPage() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [orderBy, setOrderBy] = useState<'created_at' | 'overall'>('created_at')
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('desc')
  
  // View state
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyListItem | null>(null)
  
  const exportPolicies = useExportPolicies()

  const handleExport = (format: 'csv' | 'xlsx') => {
    exportPolicies.mutate({
      format,
      lang: i18n.language as 'en' | 'ar',
      from: dateFrom || undefined,
      to: dateTo || undefined
    })
  }

  const handleRefreshTrends = () => {
    // This will be handled by the RiskTrendChart component's refetch
  }

  const clearFilters = () => {
    setSearchQuery('')
    setDateFrom('')
    setDateTo('')
    setOrderBy('created_at')
    setOrderDir('desc')
  }

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // Set default date range (last 30 days)
  const defaultFromDate = formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  const defaultToDate = formatDateForInput(new Date())

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('policy.tabs.history')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('policy.history.description')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            onClick={handleRefreshTrends}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('policy.trends.refresh')}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                {t('policy.export')}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                {t('policy.export.csv')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                <Download className="h-4 w-4 mr-2" />
                {t('policy.export.xlsx')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Filter className="h-5 w-5" />
            <span>{t('policy.filters.title')}</span>
          </CardTitle>
          <CardDescription>
            {t('policy.filters.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Query */}
            <div className="space-y-2">
              <Label htmlFor="search">{t('policy.filters.search')}</Label>
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder={t('policy.filters.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                />
              </div>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">{t('policy.filters.from')}</Label>
              <div className="relative">
                <Calendar className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom || defaultFromDate}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">{t('policy.filters.to')}</Label>
              <div className="relative">
                <Calendar className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo || defaultToDate}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <Label>{t('policy.filters.sort')}</Label>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Select
                  value={orderBy}
                  onValueChange={(value: 'created_at' | 'overall') => setOrderBy(value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">{t('policy.table.createdAt')}</SelectItem>
                    <SelectItem value="overall">{t('policy.table.overall')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={orderDir}
                  onValueChange={(value: 'asc' | 'desc') => setOrderDir(value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">{t('policy.filters.desc')}</SelectItem>
                    <SelectItem value="asc">{t('policy.filters.asc')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              size="sm"
            >
              {t('policy.filters.clear')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Trend Chart */}
      <RiskTrendChart 
        dateFrom={dateFrom || defaultFromDate}
        dateTo={dateTo || defaultToDate}
        onRefresh={handleRefreshTrends}
      />

      {/* Policy Risk Table */}
      <PolicyRiskTable
        searchQuery={searchQuery}
        dateFrom={dateFrom || defaultFromDate}
        dateTo={dateTo || defaultToDate}
        orderBy={orderBy}
        orderDir={orderDir}
        onViewPolicy={(policy) => setSelectedPolicy(policy)}
      />

      {/* Policy Details Modal/Panel */}
      {selectedPolicy && (
        <Card className="fixed inset-x-4 bottom-4 top-4 z-50 overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedPolicy.title}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPolicy(null)}
              >
                {t('common.close')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{t('policy.details.overview')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('policy.table.createdAt')}: </span>
                    <span>{new Date(selectedPolicy.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('policy.table.overall')}: </span>
                    <span className="font-medium">{selectedPolicy.overall_score.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">{t('policy.details.scores')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium text-sm mb-2">{t('policy.family.compliance')}</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>{t('policy.dim.saudiLaborLaw')}</span>
                        <span>{selectedPolicy.compliance_score.saudiLaborLaw.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.workplaceRights')}</span>
                        <span>{selectedPolicy.compliance_score.workplaceRights.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.discriminationPrevention')}</span>
                        <span>{selectedPolicy.compliance_score.discriminationPrevention.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.dataProtection')}</span>
                        <span>{selectedPolicy.compliance_score.dataProtection.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded">
                    <h5 className="font-medium text-sm mb-2">{t('policy.family.business')}</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>{t('policy.dim.operationalComplexity')}</span>
                        <span>{selectedPolicy.business_score.operationalComplexity.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.resourceRequirements')}</span>
                        <span>{selectedPolicy.business_score.resourceRequirements.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.stakeholderImpact')}</span>
                        <span>{selectedPolicy.business_score.stakeholderImpact.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.financialImplications')}</span>
                        <span>{selectedPolicy.business_score.financialImplications.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded">
                    <h5 className="font-medium text-sm mb-2">{t('policy.family.implementation')}</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>{t('policy.dim.systemComplexity')}</span>
                        <span>{selectedPolicy.implementation_score.systemComplexity.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.changeResistance')}</span>
                        <span>{selectedPolicy.implementation_score.changeResistance.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.trainingRequirements')}</span>
                        <span>{selectedPolicy.implementation_score.trainingRequirements.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('policy.dim.monitoringDifficulty')}</span>
                        <span>{selectedPolicy.implementation_score.monitoringDifficulty.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}