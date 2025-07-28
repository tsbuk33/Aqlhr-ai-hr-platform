import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleTooltip, HowToUsePanel, ModuleDocumentUploader, ModuleAIChat, ModuleDiagnosticPanel } from '@/components/universal';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';

const HRValueChainAnalysis = () => {
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <CenteredLayout 
      title={t('diagnostic.hrValueChainAnalysis.title')}
      description={t('diagnostic.hrValueChainAnalysis.description')}
      className="space-y-6"
    >
      {/* Universal Features */}
      <ModuleTooltip moduleKey="diagnostic.hrValueChainAnalysis" showIcon>
        <HowToUsePanel moduleKey="diagnostic.hrValueChainAnalysis" />
      </ModuleTooltip>
      
      <ModuleDocumentUploader moduleKey="diagnostic.hrValueChainAnalysis" />
      <ModuleAIChat moduleKey="diagnostic.hrValueChainAnalysis" />
      <ModuleDiagnosticPanel moduleKey="diagnostic.hrValueChainAnalysis" />
      
      {/* Original Content */}
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">HR Value Chain Analysis</h1>
        <p className="text-muted-foreground">Comprehensive HR value creation assessment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Value Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.6/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activities Mapped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Value Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ROI Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">42%</div>
          </CardContent>
        </Card>
      </div>
    </div>
    </CenteredLayout>
  );
};

export default HRValueChainAnalysis;