import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';
import ModuleTooltip from '@/components/universal/ModuleTooltip';
import HowToUsePanel from '@/components/universal/HowToUsePanel';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import ModuleAIChat from '@/components/universal/ModuleAIChat';
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';

const HRProcessImprovement = () => {
  const { t } = useAPITranslations();
  const moduleFeatures = useModuleFeatures('hr-process-improvement');
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <CenteredLayout
      title={t('hr-process-improvement.title')}
      description={t('hr-process-improvement.description')}
      className="min-h-screen"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="hr-process-improvement" showIcon={true}>
          <h1 className="text-3xl font-bold">{t('hr-process-improvement.title')}</h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="hr-process-improvement" />
        )}

        {/* Core Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Process Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-primary">87.3%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-success">45</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-accent">342h</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cost Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-warning">23%</div>
            </CardContent>
          </Card>
        </div>

        <AqlHRAIAssistant moduleContext="diagnostic.hrProcessImprovement" />

        {/* Document Uploader */}
        {moduleFeatures.isFeatureEnabled('enableDocumentUpload') && (
          <ModuleDocumentUploader
            moduleKey="hr-process-improvement"
            maxFiles={10}
            maxSize={50 * 1024 * 1024}
            acceptedTypes={['.pdf', '.docx', '.xlsx', '.pptx']}
          />
        )}

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="hr-process-improvement"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="hr-process-improvement"
            context={{
              moduleName: t('hr-process-improvement.title'),
              currentData: {},
              uploadedDocs: []
            }}
          />
        )}
      </div>
    </CenteredLayout>
  );
};

export default HRProcessImprovement;