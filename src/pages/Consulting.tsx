import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Consulting = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.premium_consulting')}</h1>
        <p className="text-muted-foreground">{t('consulting.executive_hr_consulting')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Percentile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">75th</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pay Equity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">94.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annual Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">SAR 2.3M</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Culture Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">8.4/10</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Executive Compensation</CardTitle>
            <CardDescription>Design and benchmarking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">75th market percentile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizational Restructuring</CardTitle>
            <CardDescription>Efficiency and cost optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">23% efficiency gain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Culture Transformation</CardTitle>
            <CardDescription>Culture assessment and change</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">340% transformation ROI</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {isArabic ? 'إدارة الوثائق' : 'Document Management'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Keep existing content */}
        </TabsContent>

        <TabsContent value="documents">
          <UniversalDocumentManager
            moduleName={isArabic ? "الاستشارات التنفيذية" : "Executive Consulting"}
            description={isArabic ? "إدارة شاملة لوثائق الاستشارات والتقارير" : "Comprehensive management of consulting documents and reports"}
            platform="consulting"
            moduleType="hr"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.ppt', '.pptx']}
            maxFileSize={30}
            maxFiles={100}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Consulting;