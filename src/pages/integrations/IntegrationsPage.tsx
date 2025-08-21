import React from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import IntegrationCard from '@/components/integrations/IntegrationCard';
import PageHeader from '@/components/common/PageHeader';
import { useGovIntegrations } from '@/hooks/useGovIntegrations';
import { useGovernmentAdapters } from '@/hooks/useGovernmentAdapters';
import { GovernmentAdapterStatus } from '@/components/government/GovernmentAdapterStatus';
import { GovernmentChangesTable } from '@/components/government/GovernmentChangesTable';

const IntegrationsPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { integrations, loading, testIntegration } = useGovIntegrations();
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

  if (adaptersLoading || loading) {
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