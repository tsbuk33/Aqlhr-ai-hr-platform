import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ModuleTooltip from '@/components/universal/ModuleTooltip';
import HowToUsePanel from '@/components/universal/HowToUsePanel';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import ModuleAIChat from '@/components/universal/ModuleAIChat';
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useAPITranslations } from '@/hooks/useAPITranslations';

const CultureStrategy = () => {
  const { language } = useLanguage();
  const { t } = useAPITranslations();
  const isArabic = language === 'ar';
  const moduleFeatures = useModuleFeatures('culturestrategy');

  return (
    <CenteredLayout
      title={t('culturestrategy.title')}
      description={t('culturestrategy.description')}
      className="min-h-screen"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="culturestrategy" showIcon={true}>
          <h1 className="text-3xl font-bold text-foreground">Culture Strategy</h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="culturestrategy" />
        )}

        <div className="container mx-auto p-6 space-y-6">
          <p className="text-muted-foreground">Organizational culture development and assessment</p>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Culture Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.2/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Values Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Culture Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">91%</div>
          </CardContent>
        </Card>
      </div>

        {/* Document Uploader */}
        {moduleFeatures.isFeatureEnabled('enableDocumentUpload') && (
          <ModuleDocumentUploader
            moduleKey="culturestrategy"
            maxFiles={20}
            maxSize={50 * 1024 * 1024}
            acceptedTypes={['.pdf', '.docx', '.pptx', '.xlsx']}
          />
        )}

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="culturestrategy"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="culturestrategy"
            context={{
              moduleName: t('culturestrategy.title'),
              currentData: {},
              uploadedDocs: []
            }}
          />
        )}
      </div>
    </CenteredLayout>
  );
};

export default CultureStrategy;