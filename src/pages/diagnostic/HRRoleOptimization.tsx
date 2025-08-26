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

const HRRoleOptimization = () => {
  const { t } = useAPITranslations();
  const moduleFeatures = useModuleFeatures('hr-role-optimization');
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <CenteredLayout
      title={t('hr-role-optimization.title')}
      description={t('hr-role-optimization.description')}
      className="min-h-screen"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="hr-role-optimization" showIcon={true}>
          <h1 className="text-3xl font-bold">{t('hr-role-optimization.title')}</h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="hr-role-optimization" />
        )}

        {/* Core Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Roles Analyzed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-primary">234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Optimization Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-success">8.9/10</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-accent">67</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Gain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-warning">34%</div>
            </CardContent>
          </Card>
        </div>

        <AqlHRAIAssistant moduleContext="diagnostic.hrRoleOptimization" />

        {/* Document Uploader */}
        {moduleFeatures.isFeatureEnabled('enableDocumentUpload') && (
          <ModuleDocumentUploader
            moduleKey="hr-role-optimization"
            maxFiles={10}
            maxSize={50 * 1024 * 1024}
            acceptedTypes={['.pdf', '.docx', '.xlsx', '.pptx']}
          />
        )}

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="hr-role-optimization"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="hr-role-optimization"
            context={{
              moduleName: t('hr-role-optimization.title'),
              currentData: {},
              uploadedDocs: []
            }}
          />
        )}
      </div>
      
      {/* AI Integration for HR Role Optimization */}
      <UniversalAIIntegrator 
        pageType="diagnostic" 
        moduleName="hr-role-optimization" 
        companyId="demo-company" 
        enabledFeatures={['role-analysis', 'job-optimization', 'workforce-planning', 'skill-gap-analysis']}
      />
    </CenteredLayout>
  );
};

export default HRRoleOptimization;