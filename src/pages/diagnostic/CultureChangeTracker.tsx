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
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const CultureChangeTracker = () => {
  const { language } = useLanguage();
  const { t } = useAPITranslations();
  const isArabic = language === 'ar';
  const moduleFeatures = useModuleFeatures('culturechangetracker');

  return (
    <CenteredLayout
      title={t('culturechangetracker.title')}
      description={t('culturechangetracker.description')}
      className="min-h-screen"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="culturechangetracker" showIcon={true}>
          <h1 className="text-3xl font-bold text-foreground">Culture Change Tracker</h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="culturechangetracker" />
        )}

        <div className="container mx-auto p-6 space-y-6">
          <p className="text-muted-foreground">Organizational culture transformation monitoring</p>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Culture Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.2/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Change Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">67%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">84.7%</div>
          </CardContent>
        </Card>
      </div>

        {/* Document Uploader */}
        {moduleFeatures.isFeatureEnabled('enableDocumentUpload') && (
          <ModuleDocumentUploader
            moduleKey="culturechangetracker"
            maxFiles={15}
            maxSize={25 * 1024 * 1024}
            acceptedTypes={['.pdf', '.xlsx', '.csv']}
          />
        )}

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="culturechangetracker"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="culturechangetracker"
            context={{
              moduleName: t('culturechangetracker.title'),
              currentData: {},
              uploadedDocs: []
            }}
          />
        )}
      </div>
      
      {/* AI Integration for Culture Change Tracker */}
      <UniversalAIIntegrator 
        pageType="diagnostic" 
        moduleName="culture-change-tracker" 
        companyId="demo-company" 
        enabledFeatures={['culture-analytics', 'change-management', 'organizational-insights', 'trend-analysis']}
      />
    </CenteredLayout>
  );
};

export default CultureChangeTracker;