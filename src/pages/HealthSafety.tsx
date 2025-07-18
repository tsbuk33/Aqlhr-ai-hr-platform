import { HSEDashboard } from "@/components/hse/HSEDashboard";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HealthSafety = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">
            {isArabic ? 'لوحة القيادة' : 'Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {isArabic ? 'إدارة الوثائق' : 'Document Management'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <HSEDashboard />
        </TabsContent>

        <TabsContent value="documents">
          <UniversalDocumentManager
            moduleName={isArabic ? "الصحة والسلامة المهنية" : "Health & Safety"}
            description={isArabic ? "إدارة شاملة لوثائق الصحة والسلامة والتقارير" : "Comprehensive management of health, safety documents and reports"}
            platform="health_safety"
            moduleType="medical"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.jpg', '.png', '.mp4']}
            maxFileSize={50}
            maxFiles={300}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthSafety;