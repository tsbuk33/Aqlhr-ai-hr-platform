import React from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import IntegrationCard from '@/components/integrations/IntegrationCard';
import PageHeader from '@/components/common/PageHeader';
import { useGovIntegrations } from '@/hooks/useGovIntegrations';
import { useGovernmentAdapters, useUserRole } from '@/hooks/useGovernmentAdapters';
import { useIntegrationsOverview } from '@/hooks/useIntegrationsOverview';
import { GovernmentAdapterStatus } from '@/components/government/GovernmentAdapterStatus';
import { GovernmentChangesTable } from '@/components/government/GovernmentChangesTable';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { integrations, loading, testIntegration } = useGovIntegrations();
  const { canManageIntegrations } = useUserRole();
  const { 
    adapters, 
    changes, 
    loading: adaptersLoading, 
    syncing, 
    syncSystem, 
    syncAllSystems, 
    markChangeProcessed, 
    createTaskFromChange 
  } = useGovernmentAdapters();
  
  const {
    gov,
    tools, 
    allSystemsOperational,
    loading: overviewLoading
  } = useIntegrationsOverview();

  if (adaptersLoading || loading || overviewLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            {isArabic ? 'جاري تحميل التكاملات...' : 'Loading integrations...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Overall Status Banner */}
      <Card className={`border-l-4 ${allSystemsOperational ? 'border-l-green-500 bg-green-50/50' : 'border-l-orange-500 bg-orange-50/50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {allSystemsOperational ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              )}
              <div>
                <p className="font-medium">
                  {allSystemsOperational 
                    ? (isArabic ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems operational')
                    : (isArabic ? 'بعض الأنظمة تحتاج إعداد' : 'Some systems need attention')
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'حالة التكاملات الحالية' : 'Current integration status'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <Badge variant={gov.isAllConnected ? "default" : "secondary"} className="mb-1">
                  {isArabic ? 'حكومية' : 'Gov'}
                </Badge>
                <p className="text-sm text-muted-foreground">{gov.connected}/{gov.total}</p>
              </div>
              <div className="text-center">
                <Badge variant={tools.isAllConnected ? "default" : "secondary"} className="mb-1">
                  {isArabic ? 'أدوات' : 'Tools'}
                </Badge>
                <p className="text-sm text-muted-foreground">{tools.connected}/{tools.total}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Government Adapters Section */}
      <GovernmentAdapterStatus
        adapters={adapters}
        syncing={syncing}
        onSyncSystem={syncSystem}
        onSyncAll={syncAllSystems}
      />

      {/* Changes Table */}
      <GovernmentChangesTable
        changes={changes}
        onCreateTask={createTaskFromChange}
        onMarkProcessed={markChangeProcessed}
        canCreateTasks={canManageIntegrations}
      />

      {/* Legacy Integrations */}
      {integrations.length > 0 && (
        <div className="space-y-4">
          <PageHeader
            title={isArabic ? 'التكاملات الأخرى' : 'Other Integrations'}
            description={isArabic 
              ? 'تكاملات إضافية مع أنظمة أخرى'
              : 'Additional integrations with other systems'
            }
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onTest={() => testIntegration(integration.system)}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;