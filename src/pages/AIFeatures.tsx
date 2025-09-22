import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Zap, TrendingUp, FileText, MessageSquare, Settings } from "lucide-react";
import AISyncDashboard from "@/components/AISyncDashboard";
import AIRecommendationCard from "@/components/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import EduBox from "@/components/EduBox";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { ModuleAIChat, ModuleDocumentUploader } from '@/components/universal';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AIFeatures = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { recommendations, loading, generateRecommendation, updateRecommendationStatus } = useAIRecommendations();

  const handleStatusUpdate = async (id: string, status: any) => {
    try {
      await updateRecommendationStatus(id, status);
    } catch (error) {
      console.error('Failed to update recommendation status:', error);
    }
  };

  return (
    <>
      {/* Document Upload Panel */}
      <div className="mb-6">
        <ModuleDocumentUploader 
          moduleKey="aIFeatures"
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
          acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']}
        />
      </div>

      <div className="container mx-auto p-6 space-y-6 max-w-6xl" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-brand-primary" />
          {isArabic ? 'ميزات الذكاء الاصطناعي والأتمتة' : 'AI Features & Automation'}
          <EduBox
            title={isArabic ? 'مجموعة أدوات الذكاء الاصطناعي' : 'AqlHR AI Suite'}
            description={isArabic ? 'وحدات ذكية متقدمة تؤتمت عمليات الموارد البشرية وتوفر التحليلات التنبؤية والتوصيات الذكية' : 'Advanced AI modules that automate HR processes, provide predictive analytics, and generate intelligent recommendations'}
            howToUse={isArabic ? 'تنقل عبر ميزات الذكاء الاصطناعي المختلفة باستخدام التبويبات أدناه' : 'Navigate through different AI features using the tabs below'}
            linkedFeatures={isArabic ? ['محرك المزامنة الذكي', 'التوصيات الذكية', 'التحليلات التنبؤية', 'ذكاء المستندات'] : ['AI SYNC ENGINE', 'Smart Recommendations', 'Predictive Analytics', 'DOCUMENT INTELLIGENCE']}
            userLevel="hr_admin"
          >
            <></>
          </EduBox>
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
          {isArabic ? 'أتمتة الموارد البشرية الذكية بواسطة الذكاء الاصطناعي المتقدم' : 'Intelligent HR automation powered by advanced AI'}
        </p>
        <Badge className="bg-brand-primary text-primary-foreground px-3 py-1">
          <Zap className="h-3 w-3 mr-1" />
          {isArabic ? '5 محركات ذكية نشطة' : '5 AI Engines Active'}
        </Badge>
      </div>

      <Tabs defaultValue="sync-engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sync-engine">{isArabic ? 'محرك المزامنة' : 'SYNC ENGINE'}</TabsTrigger>
          <TabsTrigger value="recommendations">{isArabic ? 'التوصيات' : 'Recommendations'}</TabsTrigger>
          <TabsTrigger value="analytics">{isArabic ? 'التحليلات' : 'Analytics'}</TabsTrigger>
          <TabsTrigger value="documents">{isArabic ? 'المستندات' : 'Documents'}</TabsTrigger>
          <TabsTrigger value="nlp">{isArabic ? 'معالجة اللغة' : 'NLP'}</TabsTrigger>
        </TabsList>

        <TabsContent value="sync-engine">
          <AISyncDashboard />
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {isArabic ? 'التوصيات الذكية' : 'Smart Recommendations'}
                </h2>
                <p className="text-muted-foreground">
                  {isArabic ? 'توصيات تطوير الموظفين بواسطة الذكاء الاصطناعي' : 'AI-powered employee development recommendations'}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
              </div>
            ) : recommendations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {isArabic ? 'لا توجد توصيات بعد' : 'No recommendations yet'}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {isArabic ? 'ستظهر توصيات الذكاء الاصطناعي عند تحليل البيانات' : 'AI recommendations will appear as data is analyzed'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((recommendation) => (
                  <AIRecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'النماذج التنبؤية' : 'Predictive Models'}</CardTitle>
                <CardDescription>{isArabic ? '12 نموذج نشط' : '12 active models'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">87.3%</div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'متوسط الدقة' : 'Average accuracy'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'ذكاء المستندات' : 'DOCUMENT INTELLIGENCE'}</CardTitle>
              <CardDescription>{isArabic ? 'معالجة المستندات بالذكاء الاصطناعي' : 'AI-powered document processing'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-success">2,456</div>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'مستند معالج' : 'Documents processed'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nlp">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'معالجة اللغة العربية-الإنجليزية' : 'Arabic-English NLP'}</CardTitle>
              <CardDescription>{isArabic ? 'محرك المعالجة ثنائي اللغة' : 'Bilingual processing engine'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-accent">98.2%</div>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'دقة المعالجة' : 'Processing accuracy'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      {/* AI Assistant Panel */}
      <div className="fixed bottom-4 right-4 z-50">
        <ModuleAIChat 
          moduleKey="aIFeatures"
          context={{
            moduleName: "aIFeatures",
            currentData: {}
          }}
          className="w-80 h-96 shadow-2xl rounded-lg"
        />
      </div>
      
      {/* AI Integration for AI Features */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="ai-features" 
        companyId="demo-company" 
        enabledFeatures={['ai-automation', 'intelligent-assistance', 'data-analysis', 'predictive-insights']}
      />
    </>
  );
};

export default AIFeatures;