import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, BookOpen, Trophy, Users, Target } from "lucide-react";

const TrainingDevelopment = () => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();

  // Arabic translations for this page
  const translations = {
    ar: {
      title: "التدريب والتطوير",
      description: "إدارة برامج التدريب والتطوير المهني مع التكامل مع المنصات السعودية",
      active_programs: "البرامج النشطة",
      tvtc_certified: "شهادات التقنية والمهني", 
      training_hours: "ساعات التدريب",
      completion_rate: "معدل الإكمال"
    },
    en: {
      title: "Training & Development",
      description: "Professional training and development programs management with Saudi platform integration",
      active_programs: "Active Programs",
      tvtc_certified: "TVTC Certified",
      training_hours: "Training Hours", 
      completion_rate: "Completion Rate"
    }
  };

  const t = isRTL ? translations.ar : translations.en;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="programs">{language === 'ar' ? 'البرامج' : 'Programs'}</TabsTrigger>
          <TabsTrigger value="documents">{language === 'ar' ? 'المستندات' : 'Documents'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {t.active_programs}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">34</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {t.tvtc_certified}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">1,234</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t.training_hours}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">15,678</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t.completion_rate}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">94%</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'برامج التدريب' : 'Training Programs'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{language === 'ar' ? 'قريباً...' : 'Coming soon...'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {language === 'ar' ? 'رفع ملفات التدريب' : 'Upload Training Files'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' ? 'ارفع ملفات برامج التدريب والشهادات للمعالجة بالذكاء الاصطناعي' : 'Upload training program files and certificates for AI processing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AqlAIFileProcessor
                platform="training-development"
                moduleType="core-hr"
                onFileProcessed={(file) => {
                  toast({
                    title: language === 'ar' ? "تم رفع الملف بنجاح" : "File uploaded successfully",
                    description: language === 'ar' ? `تم رفع ${file.name} ومعالجته بالذكاء الاصطناعي` : `${file.name} uploaded and processed with AI`
                  });
                }}
                acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']}
                maxFileSize={15}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDevelopment;