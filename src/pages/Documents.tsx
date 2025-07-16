import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";

const Documents = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('documents.management')}</h1>
        <p className="text-muted-foreground">{t('documents.automated_collection')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('documents.processed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">15,678</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('documents.ai_accuracy')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-success">98.9%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('documents.pending_review')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-warning">156</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('documents.storage_used')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-accent">2.3 TB</p>
          </CardContent>
        </Card>
      </div>

      <SanadAIFileProcessor
        platform="documents"
        moduleType="general"
        onFileProcessed={(file) => {
          console.log('File processed:', file);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('documents.id_verification')}</CardTitle>
            <CardDescription>{t('documents.automatic_processing')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('documents.accuracy_rate')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('documents.contract_management')}</CardTitle>
            <CardDescription>{t('documents.digital_storage')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('documents.contracts_active')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('documents.compliance_tracking')}</CardTitle>
            <CardDescription>{t('documents.expiry_monitoring')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('documents.auto_notifications')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;