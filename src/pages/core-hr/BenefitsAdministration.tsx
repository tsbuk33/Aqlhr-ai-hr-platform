import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/layout/PageLayout";
import { Upload, Heart, Shield, Gift } from "lucide-react";
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { AqlHRAIAssistant } from '@/components/ai';

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
    <PageLayout
      title={t.title}
      description={t.description}
    >
      
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
          <UniversalDocumentManager
            moduleName="Benefits Administration"
            moduleNameAr="إدارة المزايا"
            description="Upload benefits policies, claims, insurance documents, and employee benefit records"
            descriptionAr="رفع سياسات المزايا والمطالبات ووثائق التأمين وسجلات مزايا الموظفين"
            platform="benefits-administration"
            moduleType="hr"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.jpg', '.jpeg', '.png']}
            maxFileSize={15 * 1024 * 1024}
            maxFiles={20}
          />
        </TabsContent>
      </Tabs>
      
      <AqlHRAIAssistant moduleContext="core-hr.benefitsAdministration" />
    </PageLayout>
  );
};

export default BenefitsAdministration;