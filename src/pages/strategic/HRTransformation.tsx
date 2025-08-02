import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleTooltip, HowToUsePanel, ModuleDocumentUploader, ModuleAIChat, ModuleDiagnosticPanel } from '@/components/universal';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';

const HRTransformation = () => {
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <CenteredLayout 
      title={language === 'ar' ? 'تحويل الموارد البشرية' : 'HR Transformation'}
      description={language === 'ar' ? 'استراتيجية شاملة لتحويل وتطوير إدارة الموارد البشرية' : 'Comprehensive strategy for HR transformation and development'}
      className="space-y-6"
    >
      {/* Universal Features */}
      <ModuleTooltip moduleKey="strategic.hrTransformation" showIcon>
        <HowToUsePanel moduleKey="strategic.hrTransformation" />
      </ModuleTooltip>
      
      <ModuleDocumentUploader moduleKey="strategic.hrTransformation" />
      <ModuleAIChat moduleKey="strategic.hrTransformation" />
      <ModuleDiagnosticPanel moduleKey="strategic.hrTransformation" />
      
      {/* Original Content */}
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">HR Transformation</h1>
        <p className="text-muted-foreground">Digital HR transformation and process optimization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">78%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Process Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">+45%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">32%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Digital Adoption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">91%</div>
          </CardContent>
        </Card>
      </div>
    </div>
    </CenteredLayout>
  );
};

export default HRTransformation;