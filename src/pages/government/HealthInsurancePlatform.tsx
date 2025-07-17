import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Heart, Activity, TrendingUp, Users } from "lucide-react";

const HealthInsurancePlatform = () => {
  const { t, isRTL } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-8 w-8 text-brand-primary" />
          {t('government.health_insurance')}
        </h1>
        <p className="text-muted-foreground">{t('government.health_insurance_desc')}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="upload">{isRTL ? 'رفع الملفات' : 'File Upload'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('government.coverage_rate')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">97.2%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('government.active_policies')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">1,247</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('government.monthly_premium')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">3,450 ريال</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {t('government.claims_processed')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">156</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-6">
          <AqlAIFileProcessor
            platform="health-insurance"
            moduleType="government"
            onFileProcessed={(file) => {
              setUploadedFiles(prev => [...prev, file]);
              toast({
                title: isRTL ? "تم رفع الملف بنجاح" : "File uploaded successfully",
                description: isRTL ? `تم رفع ${file.name} بنجاح` : `${file.name} uploaded successfully`
              });
            }}
            acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']}
            maxFileSize={10}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthInsurancePlatform;