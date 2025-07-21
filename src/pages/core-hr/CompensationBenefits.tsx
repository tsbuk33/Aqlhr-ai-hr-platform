import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/layout/PageLayout";
import { Upload } from "lucide-react";

const CompensationBenefits = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  return (
    <PageLayout
      title={t('core_hr.compensation_benefits')}
      description={t('core_hr.compensation_benefits_desc')}
    >
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.average_salary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 18,500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.benefits_enrolled')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">2,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.bonus_distributed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">SAR 2.3M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.eosb_liability')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 4.5M</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{t('core_hr.overview') || 'Overview'}</TabsTrigger>
          <TabsTrigger value="documents">{t('core_hr.documents') || 'Documents'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('core_hr.compensation_benefits')}</CardTitle>
              <CardDescription>
                {t('core_hr.compensation_benefits_overview') || 'Overview of compensation and benefits management'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('core_hr.compensation_benefits_content') || 'Manage salary structures, benefits enrollment, and compensation analytics.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <UniversalDocumentManager
            moduleName="Compensation & Benefits"
            moduleNameAr="التعويضات والمزايا"
            description="Upload salary structures, compensation policies, benefit plans, and wage surveys"
            descriptionAr="رفع هياكل الرواتب وسياسات التعويض وخطط المزايا ومسوحات الأجور"
            platform="compensation-benefits"
            moduleType="hr"
            acceptedTypes={['.pdf', '.docx', '.xlsx', '.csv', '.xls']}
            maxFileSize={20 * 1024 * 1024}
            maxFiles={25}
          />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default CompensationBenefits;