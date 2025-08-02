import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { useLanguage } from "@/hooks/useLanguageCompat";
import CenteredLayout from "@/components/layout/CenteredLayout";

import HowToUsePanel from "@/components/universal/HowToUsePanel";
import ModuleDocumentUploader from "@/components/universal/ModuleDocumentUploader";
import ModuleAIChat from "@/components/universal/ModuleAIChat";
import ModuleDiagnosticPanel from "@/components/universal/ModuleDiagnosticPanel";

const OrganizationalRestructuring = () => {
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <CenteredLayout 
      title={t('consulting.organizational_restructuring')} 
      description={t('consulting.organizational_restructuring_desc')}
    >
      <div className="w-full space-y-6">
        <HowToUsePanel moduleKey="organizational-restructuring" />
        <ModuleDocumentUploader moduleKey="organizational-restructuring" />
        <ModuleAIChat moduleKey="organizational-restructuring" />
        <ModuleDiagnosticPanel moduleKey="organizational-restructuring" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Efficiency Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">+23%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">SAR 2.3M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Roles Optimized</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">340%</div>
          </CardContent>
        </Card>
      </div>
      </div>
    </CenteredLayout>
  );
};

export default OrganizationalRestructuring;