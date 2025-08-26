import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai';
import ModuleTooltip from '@/components/universal/ModuleTooltip';
import HowToUsePanel from '@/components/universal/HowToUsePanel';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import ModuleAIChat from '@/components/universal/ModuleAIChat';
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const IPOReadinessDiagnostic = () => {
  const { t } = useAPITranslations();
  const moduleFeatures = useModuleFeatures('ipo-readiness-diagnostic');
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <CenteredLayout
      title={t('ipo-readiness-diagnostic.title')}
      description={t('ipo-readiness-diagnostic.description')}
      className="min-h-screen"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="ipo-readiness-diagnostic" showIcon={true}>
          <h1 className="text-3xl font-bold">{t('ipo-readiness-diagnostic.title')}</h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="ipo-readiness-diagnostic" />
        )}

        {/* Core Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Readiness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-primary">78.3%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Compliance Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-success">45</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-warning">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Target Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-accent">Q3 2024</div>
            </CardContent>
          </Card>
        </div>

        <AqlHRAIAssistant moduleContext="diagnostic.ipoReadinessDiagnostic" />

        {/* Document Uploader */}
        {moduleFeatures.isFeatureEnabled('enableDocumentUpload') && (
          <ModuleDocumentUploader
            moduleKey="ipo-readiness-diagnostic"
            maxFiles={10}
            maxSize={50 * 1024 * 1024}
            acceptedTypes={['.pdf', '.docx', '.xlsx', '.pptx']}
          />
        )}

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="ipo-readiness-diagnostic"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="ipo-readiness-diagnostic"
            context={{
              moduleName: t('ipo-readiness-diagnostic.title'),
              currentData: {},
              uploadedDocs: []
            }}
          />
        )}
      </div>
      
      {/* AI Integration for IPO Readiness Diagnostic */}
      <UniversalAIIntegrator 
        pageType="diagnostic" 
        moduleName="ipo-readiness-diagnostic" 
        companyId="demo-company" 
        enabledFeatures={['financial-readiness', 'compliance-assessment', 'strategic-planning', 'risk-analysis']}
      />
    </CenteredLayout>
  );
};

export default IPOReadinessDiagnostic;