import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/layout/PageLayout";
import { Upload, BookOpen, Trophy, Users, Target } from "lucide-react";
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

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
    <PageLayout
      title={t.title}
      description={t.description}
    >
      
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
          <UniversalDocumentManager
            moduleName="Training & Development"
            moduleNameAr="التدريب والتطوير"
            description="Upload training materials, course certificates, TVTC documents, and professional development plans"
            descriptionAr="رفع مواد التدريب وشهادات الدورات ووثائق التقنية والمهني وخطط التطوير المهني"
            platform="training-development"
            moduleType="hr"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.pptx', '.mp4', '.zip']}
            maxFileSize={30 * 1024 * 1024}
            maxFiles={40}
          />
        </TabsContent>
      </Tabs>
      
      <AqlHRAIAssistant moduleContext="core-hr.trainingDevelopment" />
    </PageLayout>
  );
};

export default TrainingDevelopment;