import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const CompensationBenefits = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('core_hr.compensation_benefits')}</h1>
        <p className="text-muted-foreground">{t('core_hr.compensation_benefits_desc')}</p>
      </div>
      
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('core_hr.upload_documents') || 'Upload Documents'}
              </CardTitle>
              <CardDescription>
                {t('core_hr.upload_compensation_docs') || 'Upload compensation and benefits files for AI processing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SanadAIFileProcessor
                platform="compensation-benefits"
                moduleType="core-hr"
                onFileProcessed={(file) => {
                  toast({
                    title: t('core_hr.file_processed') || "File processed successfully",
                    description: t('core_hr.file_processed_desc') || `${file.name} has been processed and analyzed.`,
                  });
                }}
                acceptedTypes={['.pdf', '.docx', '.xlsx', '.csv']}
                maxFileSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompensationBenefits;