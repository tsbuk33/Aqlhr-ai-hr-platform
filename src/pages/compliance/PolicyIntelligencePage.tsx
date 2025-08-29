import React, { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, Outlet, Link } from 'react-router-dom'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  History,
  Loader2
} from 'lucide-react'
import { PolicyRiskPanel } from '../../features/policy-intel/components/PolicyRiskPanel'
import { AqlHRAIAssistant } from '@/components/assistant/AqlHRAIAssistant'

// Lazy load the history page for better performance
const PolicyRiskHistoryPage = lazy(() => import('./PolicyRiskHistoryPage'))

export default function PolicyIntelligencePage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { tab } = useParams<{ tab?: string }>()
  
  const currentTab = tab || 'analyze'
  const lang = i18n.language

  const handleTabChange = (value: string) => {
    if (value === 'analyze') {
      navigate(`/${lang}/compliance/policy-intel`)
    } else {
      navigate(`/${lang}/compliance/policy-intel/${value}`)
    }
  }

  return (
    <div 
      className="container mx-auto px-4 py-8 space-y-6"
      data-testid="policy-intelligence-page"
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('policy.intelligence.title')}</h1>
            <p className="text-muted-foreground">
              {t('policy.intelligence.description')}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs 
          value={currentTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger 
              value="analyze" 
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Brain className="h-4 w-4" />
              <span>{t('policy.tabs.analyze')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <History className="h-4 w-4" />
              <span>{t('policy.tabs.history')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Analyze Tab Content */}
          <TabsContent value="analyze" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Policy Risk Analysis Panel */}
              <div className="xl:col-span-2">
                <PolicyRiskPanel />
              </div>

              {/* AI Assistant Sidebar */}
              <div className="space-y-6">
                <AqlHRAIAssistant 
                  context="policy-intelligence"
                  className="sticky top-6"
                />
                
                {/* Quick Tips Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">{t('policy.tips.title')}</h3>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• {t('policy.tips.upload')}</li>
                      <li>• {t('policy.tips.paste')}</li>
                      <li>• {t('policy.tips.streaming')}</li>
                      <li>• {t('policy.tips.mitigation')}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* History Tab Content */}
          <TabsContent value="history" className="mt-6">
            <Suspense 
              fallback={
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('common.loading')}</span>
                    </div>
                  </CardContent>
                </Card>
              }
            >
              <PolicyRiskHistoryPage />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Alternative layout if using nested routing
export function PolicyIntelligenceLayout() {
  const { t, i18n } = useTranslation()
  const { tab } = useParams<{ tab?: string }>()
  const lang = i18n.language

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header with Navigation */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('policy.intelligence.title')}</h1>
            <p className="text-muted-foreground">
              {t('policy.intelligence.description')}
            </p>
          </div>
        </div>

        <nav className="flex space-x-1 rtl:space-x-reverse">
          <Button
            asChild
            variant={!tab ? 'default' : 'ghost'}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Link to={`/${lang}/compliance/policy-intel`}>
              <Brain className="h-4 w-4" />
              <span>{t('policy.tabs.analyze')}</span>
            </Link>
          </Button>
          <Button
            asChild
            variant={tab === 'history' ? 'default' : 'ghost'}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Link to={`/${lang}/compliance/policy-intel/history`}>
              <History className="h-4 w-4" />
              <span>{t('policy.tabs.history')}</span>
            </Link>
          </Button>
        </nav>
      </div>

      {/* Route Content */}
      <Outlet />
    </div>
  )
}