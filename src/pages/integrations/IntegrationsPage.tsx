import React from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import IntegrationCard from '@/components/integrations/IntegrationCard';
import PageHeader from '@/components/common/PageHeader';
import { useGovIntegrations } from '@/hooks/useGovIntegrations';

const IntegrationsPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { integrations, loading, testIntegration } = useGovIntegrations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}
        description={isArabic 
          ? 'ربط وتكامل مع الأنظمة الحكومية السعودية'
          : 'Connect and integrate with Saudi government systems'
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

      {integrations.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {isArabic ? 'لا توجد تكاملات متاحة حالياً' : 'No integrations available at the moment'}
          </p>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;