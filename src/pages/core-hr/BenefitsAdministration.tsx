import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Heart, Shield, DollarSign, Gift } from "lucide-react";

const BenefitsAdministration = () => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();

  // Arabic translations for this page
  const translations = {
    ar: {
      title: "إدارة المزايا",
      description: "نظام شامل لإدارة مزايا الموظفين والمطالبات",
      enrolled_employees: "الموظفون المسجلون",
      active_benefits: "المزايا النشطة",
      claims_processed: "المطالبات المعالجة",
      satisfaction_rate: "معدل الرضا",
      overview: "نظرة عامة",
      documents: "الوثائق"
    },
    en: {
      title: "Benefits Administration",
      description: "Comprehensive employee benefits and claims management system",
      enrolled_employees: "Enrolled Employees",
      active_benefits: "Active Benefits",
      claims_processed: "Claims Processed",
      satisfaction_rate: "Satisfaction Rate",
      overview: "Overview",
      documents: "Documents"
    }
  };

  const t = isRTL ? translations.ar : translations.en;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.enrolled_employees}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.active_benefits}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.claims_processed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">1,892</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.satisfaction_rate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">94.7%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="documents">{t.documents}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "نظام شامل لإدارة مزايا الموظفين يتضمن التأمين الصحي، والتأمين على الحياة، وخطط التقاعد، ومزايا أخرى متنوعة."
                  : "Comprehensive employee benefits management system including health insurance, life insurance, retirement plans, and various other benefits."
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {isRTL ? "رفع الوثائق" : "Document Upload"}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? "رفع ومعالجة وثائق إدارة المزايا والمطالبات" 
                  : "Upload and process benefits administration and claims documents"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SanadAIFileProcessor
                platform="benefits-administration"
                moduleType="core-hr"
                onFileProcessed={(file) => {
                  toast({
                    title: isRTL ? "تم معالجة الملف بنجاح" : "File processed successfully",
                    description: isRTL 
                      ? `تم رفع ${file.name} ومعالجته بالذكاء الاصطناعي`
                      : `${file.name} has been uploaded and processed with AI`,
                  });
                }}
                acceptedTypes={['.xlsx', '.xls', '.pdf', '.doc', '.docx']}
                maxFileSize={10 * 1024 * 1024}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BenefitsAdministration;