import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnhancedFileUpload } from "@/components/enhanced/EnhancedFileUpload";

const DocumentIntelligence = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('ai.document_intelligence')}</h1>
        <p className="text-muted-foreground">{t('ai.document_intelligence_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('ai.documents_processed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8,943</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ai.accuracy_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">96.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ai.processing_time')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">1.2s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ai.languages_supported')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">15</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Document Upload */}
      <div className="mt-8">
        <EnhancedFileUpload
          title="AI Document Processing"
          description="Upload documents for AI-powered analysis, data extraction, and intelligent processing"
          moduleType="documents"
          platform="document_intelligence"
          maxFileSize={200 * 1024 * 1024} // 200MB
          maxFiles={20}
          compressionEnabled={true}
          multipleUploads={true}
          showPresets={true}
          showUploadMethods={true}
          onFileProcessed={(file) => {
            console.log('Document processed:', file);
          }}
          onBatchProcessed={(files) => {
            console.log('Batch processed:', files);
          }}
        />
      </div>
    </div>
  );
};

export default DocumentIntelligence;