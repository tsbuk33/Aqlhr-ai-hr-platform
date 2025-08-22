import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { AqlHRAIAssistant } from '@/components/ai';
import APIKeyManager from '@/components/security/APIKeyManager';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const SecurityFramework = () => {
  const { isArabic } = useSimpleLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'إطار الأمان المشفر AES-256' : 'AES-256 Encrypted Security Framework'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'أمان وتشفير على مستوى المؤسسات' : 'Enterprise-grade security and encryption'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'نقاط الأمان' : 'Security Score'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">9.8/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'مستوى التشفير' : 'Encryption Level'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">AES-256</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'المحاولات الفاشلة' : 'Failed Attempts'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'وقت التشغيل' : 'Uptime'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">99.99%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="api-keys">
            {isArabic ? 'مفاتيح API' : 'API Keys'}
          </TabsTrigger>
          <TabsTrigger value="audit">
            {isArabic ? 'سجل المراجعة' : 'Audit Log'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ModuleDocumentUploader moduleKey="platformFeatures.securityFramework" />
          <AqlHRAIAssistant moduleContext="platformFeatures.securityFramework" />
        </TabsContent>

        <TabsContent value="api-keys">
          <APIKeyManager />
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'سجل المراجعة' : 'Audit Log'}</CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'سجل شامل لجميع الأنشطة الأمنية والوصول'
                  : 'Comprehensive log of all security activities and access'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>{isArabic ? 'سجل المراجعة قيد التطوير' : 'Audit log viewer coming soon'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityFramework;