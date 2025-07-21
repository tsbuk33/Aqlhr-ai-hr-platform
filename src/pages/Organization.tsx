import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { EnhancedFileUpload } from "@/components/enhanced/EnhancedFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { Building2, GitBranch, Layers, Network, Pyramid, Users, Upload, FileText, CheckCircle2, HelpCircle, Sparkles, Brain, TrendingUp } from "lucide-react";
import { useState } from "react";

const Organization = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  const translations = {
    en: {
      structure: "Organization Structure",
      dynamic_chart: "Dynamic organizational chart and reporting structure",
      total_departments: "Total Departments",
      management_levels: "Management Levels",
      saudization_rate: "Saudization Rate",
      open_positions: "Open Positions",
      org_chart: "Organization Chart",
      visual_representation: "Visual representation of company hierarchy",
      interactive_chart: "Interactive organizational chart will be displayed here",
      structure_types: "Organization Structure Types",
      select_structure: "Select your organizational structure type",
      hierarchical: "Hierarchical",
      hierarchical_desc: "Traditional top-down structure with clear chain of command",
      functional: "Functional",
      functional_desc: "Organized by specialized departments (HR, Finance, Marketing)",
      divisional: "Divisional",
      divisional_desc: "Organized by products, services, or geographic regions",
      matrix: "Matrix",
      matrix_desc: "Dual reporting relationships combining functional and project-based structure",
      flat: "Flat",
      flat_desc: "Minimal hierarchy with few management levels",
      network: "Network",
      network_desc: "Decentralized structure with interconnected teams",
      upload_documents: "Upload Documents",
      upload_org_docs: "Upload organizational charts and documents",
      recommended: "Recommended",
      current: "Current",
      select_btn: "Select Structure",
      get_ai_recommendation: "Get AI Recommendation",
      ai_analyzing: "AI is analyzing your company...",
      ai_recommendation: "AI Recommendation",
      confidence: "Confidence",
      benefits: "Benefits",
      considerations: "Considerations",
      implementation: "Implementation Tips",
      saudization_impact: "Saudization Impact",
      help_tooltip: "Click for detailed explanation",
      hierarchical_help: "Best for: Large companies with clear authority levels. Ideal for traditional Saudi companies with established management hierarchy. Supports clear decision-making and accountability.",
      functional_help: "Best for: Medium-sized companies focusing on specialization. Perfect for businesses needing department expertise (Finance, HR, Marketing). Supports efficient Saudization by department.",
      divisional_help: "Best for: Companies with multiple products/regions. Ideal for Saudi businesses expanding across different markets or product lines. Each division can have its own structure.",
      matrix_help: "Best for: Project-based companies. Suitable for consulting firms or tech companies in Saudi Arabia. Employees report to both functional and project managers.",
      flat_help: "Best for: Startups and small companies. Ideal for innovative Saudi companies wanting quick decision-making. Minimal management layers promote collaboration.",
      network_help: "Best for: Modern, agile companies. Perfect for tech startups or companies working with external partners. Emphasizes teamwork and flexibility."
    },
    ar: {
      structure: "الهيكل التنظيمي",
      dynamic_chart: "مخطط تنظيمي ديناميكي وهيكل التقارير",
      total_departments: "إجمالي الأقسام",
      management_levels: "مستويات الإدارة",
      saudization_rate: "معدل السعودة",
      open_positions: "المناصب الشاغرة",
      org_chart: "المخطط التنظيمي",
      visual_representation: "تمثيل مرئي للهيكل الهرمي للشركة",
      interactive_chart: "سيتم عرض المخطط التنظيمي التفاعلي هنا",
      structure_types: "أنواع الهياكل التنظيمية",
      select_structure: "اختر نوع الهيكل التنظيمي الخاص بك",
      hierarchical: "هرمي",
      hierarchical_desc: "هيكل تقليدي من أعلى إلى أسفل مع سلسلة قيادة واضحة",
      functional: "وظيفي",
      functional_desc: "منظم حسب الأقسام المتخصصة (الموارد البشرية، المالية، التسويق)",
      divisional: "قسمي",
      divisional_desc: "منظم حسب المنتجات أو الخدمات أو المناطق الجغرافية",
      matrix: "مصفوفي",
      matrix_desc: "علاقات تقارير مزدوجة تجمع بين الهيكل الوظيفي والمشروع",
      flat: "مسطح",
      flat_desc: "تسلسل هرمي بحد أدنى مع مستويات إدارية قليلة",
      network: "شبكي",
      network_desc: "هيكل لامركزي مع فرق مترابطة",
      upload_documents: "رفع المستندات",
      upload_org_docs: "رفع المخططات التنظيمية والمستندات",
      recommended: "موصى به",
      current: "الحالي",
      select_btn: "اختيار الهيكل",
      get_ai_recommendation: "احصل على توصية الذكي الاصطناعي",
      ai_analyzing: "الذكاء الاصطناعي يحلل شركتك...",
      ai_recommendation: "توصية الذكاء الاصطناعي",
      confidence: "مستوى الثقة",
      benefits: "المزايا",
      considerations: "اعتبارات",
      implementation: "نصائح التنفيذ",
      saudization_impact: "تأثير السعودة",
      help_tooltip: "انقر للحصول على شرح مفصل",
      hierarchical_help: "الأفضل لـ: الشركات الكبيرة ذات المستويات الإدارية الواضحة. مثالي للشركات السعودية التقليدية مع التسلسل الإداري الراسخ.",
      functional_help: "الأفضل لـ: الشركات متوسطة الحجم التي تركز على التخصص. مثالي للشركات التي تحتاج خبرة قسمية (المالية، الموارد البشرية، التسويق).",
      divisional_help: "الأفضل لـ: الشركات متعددة المنتجات/المناطق. مثالي للشركات السعودية التي تتوسع عبر أسواق أو خطوط منتجات مختلفة.",
      matrix_help: "الأفضل لـ: الشركات القائمة على المشاريع. مناسب لشركات الاستشارات أو التكنولوجيا في السعودية.",
      flat_help: "الأفضل لـ: الشركات الناشئة والشركات الصغيرة. مثالي للشركات السعودية المبتكرة التي تريد اتخاذ قرارات سريعة.",
      network_help: "الأفضل لـ: الشركات الحديثة والمرنة. مثالي للشركات التقنية الناشئة أو الشركات التي تعمل مع شركاء خارجيين."
    }
  };

  const organizationalStructures = [
    {
      id: "hierarchical",
      icon: Pyramid,
      nameKey: "hierarchical",
      descKey: "hierarchical_desc",
      helpKey: "hierarchical_help",
      recommended: true,
      color: "bg-brand-primary/10 border-brand-primary text-brand-primary"
    },
    {
      id: "functional",
      icon: Building2,
      nameKey: "functional",
      descKey: "functional_desc",
      helpKey: "functional_help",
      recommended: false,
      color: "bg-brand-success/10 border-brand-success text-brand-success"
    },
    {
      id: "divisional",
      icon: Layers,
      nameKey: "divisional",
      descKey: "divisional_desc",
      helpKey: "divisional_help",
      recommended: false,
      color: "bg-brand-warning/10 border-brand-warning text-brand-warning"
    },
    {
      id: "matrix",
      icon: Network,
      nameKey: "matrix",
      descKey: "matrix_desc",
      helpKey: "matrix_help",
      recommended: false,
      color: "bg-brand-accent/10 border-brand-accent text-brand-accent"
    },
    {
      id: "flat",
      icon: GitBranch,
      nameKey: "flat",
      descKey: "flat_desc",
      helpKey: "flat_help",
      recommended: false,
      color: "bg-muted border-muted-foreground text-muted-foreground"
    },
    {
      id: "network",
      icon: Users,
      nameKey: "network",
      descKey: "network_desc",
      helpKey: "network_help",
      recommended: false,
      color: "bg-secondary border-secondary-foreground text-secondary-foreground"
    }
  ];

  const getAIRecommendation = async () => {
    setIsLoadingRecommendation(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-organization-advisor', {
        body: {
          companyData: {
            totalEmployees: 280,
            saudiEmployees: 188,
            departments: 28,
            industry: "Technology Services",
            sizeCategory: "Medium",
            revenue: "50M SAR",
            locations: "Riyadh, Jeddah",
            growthStage: "Scaling",
            challenges: "Need better coordination between departments and improved Saudization"
          },
          language
        }
      });

      if (error) throw error;
      setAiRecommendation(data.recommendation);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      // Set fallback recommendation
      setAiRecommendation({
        recommendedStructure: "functional",
        confidence: 75,
        reasoning: language === 'ar' 
          ? "بناءً على أفضل الممارسات للشركات السعودية، يُنصح غالباً بالهيكل الوظيفي للمؤسسات متوسطة الحجم"
          : "Based on best practices for Saudi companies, functional structure is often recommended for medium-sized organizations",
        benefits: language === 'ar' 
          ? ["تخصص واضح", "تخصيص فعال للموارد", "يدعم السعودة"]
          : ["Clear specialization", "Efficient resource allocation", "Supports Saudization"],
        considerations: language === 'ar'
          ? ["قد ينشئ عزلة بين الأقسام", "يتطلب تواصل جيد"]
          : ["May create silos", "Requires good communication"],
        implementationTips: language === 'ar'
          ? ["ابدأ بالأقسام الأساسية", "أنشئ قنوات تواصل واضحة"]
          : ["Start with core departments", "Establish clear communication channels"],
        saudizationImpact: language === 'ar'
          ? "الهيكل الوظيفي يسمح بالسعودة المستهدفة في كل قسم"
          : "Functional structure allows for targeted Saudization in each department"
      });
    }
    setIsLoadingRecommendation(false);
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'الهيكل التنظيمي' : 'Organizational Structure'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'مخطط تنظيمي ديناميكي وتفاعلي' : 'Dynamic and interactive organizational chart'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'إجمالي الأقسام' : 'Total Departments'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">28</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('management_levels')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-success">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('saudization_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-accent">67.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('open_positions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-warning">23</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="structures" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="structures">{t('structure_types')}</TabsTrigger>
          <TabsTrigger value="chart">{t('org_chart')}</TabsTrigger>
          <TabsTrigger value="upload">{t('upload_documents')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="structures" className="space-y-6">
          {/* AI Recommendation Section */}
          <Card className="border-brand-primary/20 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-brand-primary" />
                {t('ai_recommendation')}
              </CardTitle>
              <CardDescription>
                Get personalized organizational structure recommendations based on SanadHR expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={getAIRecommendation}
                  disabled={isLoadingRecommendation}
                  className="flex items-center gap-2"
                >
                  {isLoadingRecommendation ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      {t('ai_analyzing')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {t('get_ai_recommendation')}
                    </>
                  )}
                </Button>
                
                {aiRecommendation && (
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-brand-success" />
                      <span className="font-medium">
                        {t(organizationalStructures.find(s => s.id === aiRecommendation.recommendedStructure)?.nameKey || '')}
                      </span>
                      <Badge variant="secondary">
                        {t('confidence')}: {aiRecommendation.confidence}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{aiRecommendation.reasoning}</p>
                    
                    {aiRecommendation.benefits?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-brand-success">{t('benefits')}:</p>
                        <ul className="text-xs text-muted-foreground ml-4">
                          {aiRecommendation.benefits.map((benefit: string, index: number) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('structure_types')}</CardTitle>
              <CardDescription>{t('select_structure')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizationalStructures.map((structure) => {
                    const IconComponent = structure.icon;
                    const isSelected = selectedStructure === structure.id;
                    
                    return (
                      <Card 
                        key={structure.id}
                        className={`relative cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-brand-primary' : ''
                        } ${structure.color}`}
                        onClick={() => setSelectedStructure(structure.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-6 w-6" />
                              <CardTitle className="text-lg flex items-center gap-2">
                                {t(structure.nameKey)}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-sm p-4">
                                    <p className="text-sm">{t(structure.helpKey)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </CardTitle>
                            </div>
                            <div className="flex gap-2">
                              {structure.recommended && (
                                <Badge variant="secondary" className="text-xs">
                                  {t('recommended')}
                                </Badge>
                              )}
                              {isSelected && (
                                <Badge variant="default" className="text-xs">
                                  {t('current')}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {t(structure.descKey)}
                          </p>
                          <Button 
                            size="sm" 
                            variant={isSelected ? "default" : "outline"}
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStructure(structure.id);
                            }}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                {t('current')}
                              </>
                            ) : (
                              t('select_btn')
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('org_chart')}</CardTitle>
              <CardDescription>{t('visual_representation')}</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStructure ? (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-flex items-center gap-2 text-brand-primary">
                    {(() => {
                      const structure = organizationalStructures.find(s => s.id === selectedStructure);
                      const IconComponent = structure?.icon;
                      return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
                    })()}
                    <h3 className="text-xl font-semibold">
                      {t(organizationalStructures.find(s => s.id === selectedStructure)?.nameKey || '')}
                    </h3>
                  </div>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Interactive organizational chart for {t(organizationalStructures.find(s => s.id === selectedStructure)?.nameKey || '')} structure will be displayed here
                  </p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {t('select_structure')} to view the organizational chart
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('upload_documents')}
              </CardTitle>
              <CardDescription>{t('upload_org_docs')}</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedFileUpload
                title={t('upload_documents')}
                description={t('upload_org_docs')}
                moduleType="hr"
                platform="sanadhr"
                acceptedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg', '.svg']}
                maxFileSize={50 * 1024 * 1024} // 50MB
                maxFiles={10}
                multipleUploads={true}
                onFileProcessed={(file) => {
                  console.log('File processed:', file.name);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Organization;