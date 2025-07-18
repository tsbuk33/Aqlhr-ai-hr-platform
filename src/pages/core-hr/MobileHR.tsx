import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const MobileHR = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('core_hr.mobile_hr')}</h1>
        <p className="text-muted-foreground">{t('core_hr.mobile_hr_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.app_downloads')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.daily_active_users')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,856</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.app_rating')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">4.8/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.mobile_requests')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">567</div>
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
              <CardTitle>{t('core_hr.mobile_hr')}</CardTitle>
              <CardDescription>
                {t('core_hr.mobile_hr_overview') || 'Mobile HR application analytics and management'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('core_hr.mobile_hr_content') || 'Track mobile app usage, user engagement, and mobile HR services.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <UniversalDocumentManager
            moduleName="Mobile HR"
            moduleNameAr="الموارد البشرية المتنقلة"
            description="Upload mobile app documentation, user guides, system reports, and mobile HR analytics"
            descriptionAr="رفع وثائق تطبيق الهاتف المحمول وأدلة المستخدم وتقارير النظام وتحليلات الموارد البشرية المتنقلة"
            platform="mobile-hr"
            moduleType="hr"
            acceptedTypes={['.pdf', '.docx', '.xlsx', '.csv', '.png', '.jpg', '.zip']}
            maxFileSize={20 * 1024 * 1024}
            maxFiles={30}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileHR;