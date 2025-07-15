import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { EnhancedFileUpload } from "@/components/enhanced/EnhancedFileUpload";
import { Building2, GitBranch, Layers, Network, Pyramid, Users, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const Organization = () => {
  const { language } = useLanguage();
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);

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
      select_btn: "Select Structure"
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
      select_btn: "اختيار الهيكل"
    }
  };

  const organizationalStructures = [
    {
      id: "hierarchical",
      icon: Pyramid,
      nameKey: "hierarchical",
      descKey: "hierarchical_desc",
      recommended: true,
      color: "bg-brand-primary/10 border-brand-primary text-brand-primary"
    },
    {
      id: "functional",
      icon: Building2,
      nameKey: "functional",
      descKey: "functional_desc",
      recommended: false,
      color: "bg-brand-success/10 border-brand-success text-brand-success"
    },
    {
      id: "divisional",
      icon: Layers,
      nameKey: "divisional",
      descKey: "divisional_desc",
      recommended: false,
      color: "bg-brand-warning/10 border-brand-warning text-brand-warning"
    },
    {
      id: "matrix",
      icon: Network,
      nameKey: "matrix",
      descKey: "matrix_desc",
      recommended: false,
      color: "bg-brand-accent/10 border-brand-accent text-brand-accent"
    },
    {
      id: "flat",
      icon: GitBranch,
      nameKey: "flat",
      descKey: "flat_desc",
      recommended: false,
      color: "bg-muted border-muted-foreground text-muted-foreground"
    },
    {
      id: "network",
      icon: Users,
      nameKey: "network",
      descKey: "network_desc",
      recommended: false,
      color: "bg-secondary border-secondary-foreground text-secondary-foreground"
    }
  ];

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('structure')}</h1>
        <p className="text-muted-foreground">{t('dynamic_chart')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('total_departments')}</CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle>{t('structure_types')}</CardTitle>
              <CardDescription>{t('select_structure')}</CardDescription>
            </CardHeader>
            <CardContent>
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
                            <CardTitle className="text-lg">{t(structure.nameKey)}</CardTitle>
                          </div>
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