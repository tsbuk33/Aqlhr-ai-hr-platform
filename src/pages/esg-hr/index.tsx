import React from 'react';
import { Leaf, Users, Shield } from 'lucide-react';
import CenteredLayout from '@/components/layout/CenteredLayout';
import EsgCard from '@/components/esg/EsgCard';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import ModuleTooltip from '@/components/universal/ModuleTooltip';
import HowToUsePanel from '@/components/universal/HowToUsePanel';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import ModuleAIChat from '@/components/universal/ModuleAIChat';
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';

const EsgHrPage = () => {
  const { language } = useLanguage();
  const { t } = useAPITranslations();
  const isArabic = language === 'ar';
  const moduleFeatures = useModuleFeatures('esghdiagnostic');

  const esgData = [
    {
      icon: Leaf,
      titleKey: 'esgHr.environmental.title',
      descKey: 'esgHr.environmental.desc',
      bulletsKey: 'esgHr.environmental.bullets',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      titleKey: 'esgHr.social.title',
      descKey: 'esgHr.social.desc',
      bulletsKey: 'esgHr.social.bullets',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Shield,
      titleKey: 'esgHr.governance.title',
      descKey: 'esgHr.governance.desc',
      bulletsKey: 'esgHr.governance.bullets',
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <CenteredLayout
      title={t('esgHr.pageTitle')}
      description={t('esgHr.pageDescription')}
      className="flex flex-col items-center justify-center text-center mx-auto max-w-screen-xl p-6"
    >
      <div 
        className="w-full max-w-7xl mx-auto space-y-8"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="esghdiagnostic" showIcon={true}>
          <h1 className="text-3xl font-bold">{t('esgHr.pageTitle')}</h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="esghdiagnostic" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {esgData.map((item, index) => (
            <EsgCard
              key={index}
              icon={item.icon}
              titleKey={item.titleKey}
              descKey={item.descKey}
              bulletsKey={item.bulletsKey}
              color={item.color}
            />
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t('esgHr.integrationTitle')}
          </h3>
          <p className="text-muted-foreground">
            {t('esgHr.integrationDescription')}
          </p>
        </div>

        {/* Document Uploader */}
        {moduleFeatures.isFeatureEnabled('enableDocumentUpload') && (
          <ModuleDocumentUploader
            moduleKey="esghdiagnostic"
            maxFiles={15}
            maxSize={25 * 1024 * 1024}
            acceptedTypes={['.pdf', '.docx', '.xlsx']}
          />
        )}

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="esghdiagnostic"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="esghdiagnostic"
            context={{
              moduleName: t('esgHr.pageTitle'),
              currentData: { esgData },
              uploadedDocs: []
            }}
          />
        )}
      </div>
    </CenteredLayout>
  );
};

export default EsgHrPage;