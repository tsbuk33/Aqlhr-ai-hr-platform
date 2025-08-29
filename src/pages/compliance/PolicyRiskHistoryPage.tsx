import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, TrendingUp, FileText, Download } from 'lucide-react'
import { RiskTrendChart } from '@/features/policy-intel/components/RiskTrendChart'

export default function PolicyRiskHistoryPage() {
  const { t, i18n } = useTranslation()
  const [dateRange, setDateRange] = useState({ from: '', to: '' })

  const mockHistoryData = [
    {
      id: '1',
      date: '2024-01-15',
      title: 'Employee Handbook Update',
      riskScore: 7.2,
      changes: ['Added remote work policy', 'Updated leave policies'],
      status: 'reviewed'
    },
    {
      id: '2', 
      date: '2024-01-10',
      title: 'Data Protection Policy',
      riskScore: 8.5,
      changes: ['GDPR compliance updates', 'New data retention rules'],
      status: 'pending'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Risk History</h1>
          <p className="text-muted-foreground mt-1">
            Track policy changes and risk assessments over time
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export History
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Date Range Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
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
            <Button variant="secondary">Apply Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Risk Trends Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RiskTrendChart 
            from={dateRange.from}
            to={dateRange.to}
            onRefresh={() => window.location.reload()}
          />
        </CardContent>
      </Card>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Policy History Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHistoryData.map((item, index) => (
              <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  {index < mockHistoryData.length - 1 && (
                    <div className="w-0.5 h-16 bg-muted mt-2" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={item.riskScore >= 8 ? 'destructive' : item.riskScore >= 6 ? 'secondary' : 'default'}
                        className="shrink-0"
                      >
                        Risk: {item.riskScore}
                      </Badge>
                      <Badge 
                        variant={item.status === 'approved' ? 'default' : item.status === 'pending' ? 'secondary' : 'outline'}
                        className="shrink-0"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Key Changes:</p>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      {item.changes.map((change, i) => (
                        <li key={i} className="text-muted-foreground">{change}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}