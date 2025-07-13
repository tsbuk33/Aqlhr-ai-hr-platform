import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { EnhancedFileUpload } from "@/components/enhanced/EnhancedFileUpload";
import { FileText, Zap, Clock, Globe, Upload, BarChart3, CheckCircle, Eye, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DocumentIntelligence = () => {
  const { language } = useLanguage();

  // Embedded translations
  const translations = {
    en: {
      title: "Document Intelligence Engine",
      description: "AI-powered document processing, data extraction, and intelligent analysis for all your business documents",
      documents_processed: "Documents Processed",
      accuracy_rate: "Accuracy Rate",
      processing_time: "Avg Processing Time",
      languages_supported: "Languages Supported",
      data_extraction: "Data Extraction",
      document_analysis: "Document Analysis",
      auto_classification: "Auto Classification",
      intelligent_search: "Intelligent Search",
      key_features: "Key Features",
      supported_formats: "Supported Formats",
      recent_activity: "Recent Activity",
      processing_stats: "Processing Statistics",
      upload_title: "AI Document Processing",
      upload_description: "Upload documents for AI-powered analysis, data extraction, and intelligent processing",
      extraction_accuracy: "Extraction Accuracy",
      classification_rate: "Classification Rate",
      ocr_quality: "OCR Quality",
      processing_speed: "Processing Speed",
      this_month: "this month",
      from_last_month: "from last month",
      improvement: "improvement",
      including_arabic_english: "Including Arabic & English",
      intelligent_extraction: "Intelligent extraction of structured data from unstructured documents",
      text_fields: "Text Fields",
      tables: "Tables",
      forms: "Forms",
      comprehensive_analysis: "Comprehensive document analysis and content understanding",
      content_analysis: "Content Analysis",
      sentiment_detection: "Sentiment Detection",
      entity_recognition: "Entity Recognition",
      advanced: "Advanced",
      active: "Active",
      ai_powered: "AI-Powered",
      automatic_classification: "Automatic document classification and categorization",
      invoices: "Invoices",
      contracts: "Contracts",
      reports: "Reports",
      ai_search: "AI-powered search across all processed documents",
      indexed_documents: "Indexed Documents",
      search_accuracy: "Search Accuracy",
      avg_search_time: "Avg Search Time",
      per_document_average: "Per document average",
      consistent_quality: "Consistent quality",
      text_documents: "Text Documents",
      spreadsheets: "Spreadsheets",
      images_scans: "Images & Scans",
      ai_capabilities: "AI Capabilities",
      integration_features: "Integration Features",
      nlp: "Natural Language Processing",
      ocr: "Optical Character Recognition",
      computer_vision: "Computer Vision Analysis",
      pattern_recognition: "Pattern Recognition",
      api_integration: "API Integration",
      batch_processing: "Batch Processing",
      realtime_processing: "Real-time Processing",
      cloud_storage: "Cloud Storage Integration",
      recent_processing: "Recent Processing Activity",
      processed_ago: "Processed 2 minutes ago",
      completed: "Completed",
      processing: "Processing",
      failed: "Failed"
    },
    ar: {
      title: "محرك ذكاء المستندات",
      description: "معالجة مستندات مدعومة بالذكاء الاصطناعي واستخراج البيانات والتحليل الذكي لجميع مستندات أعمالك",
      documents_processed: "المستندات المعالجة",
      accuracy_rate: "معدل الدقة",
      processing_time: "متوسط وقت المعالجة",
      languages_supported: "اللغات المدعومة",
      data_extraction: "استخراج البيانات",
      document_analysis: "تحليل المستندات",
      auto_classification: "التصنيف التلقائي",
      intelligent_search: "البحث الذكي",
      key_features: "الميزات الرئيسية",
      supported_formats: "التنسيقات المدعومة",
      recent_activity: "النشاط الحديث",
      processing_stats: "إحصائيات المعالجة",
      upload_title: "معالجة المستندات بالذكاء الاصطناعي",
      upload_description: "رفع المستندات للتحليل والاستخراج والمعالجة الذكية المدعومة بالذكاء الاصطناعي",
      extraction_accuracy: "دقة الاستخراج",
      classification_rate: "معدل التصنيف",
      ocr_quality: "جودة التعرف البصري",
      processing_speed: "سرعة المعالجة",
      this_month: "هذا الشهر",
      from_last_month: "من الشهر الماضي",
      improvement: "تحسن",
      including_arabic_english: "تشمل العربية والإنجليزية",
      intelligent_extraction: "استخراج ذكي للبيانات المنظمة من المستندات غير المنظمة",
      text_fields: "حقول النصوص",
      tables: "الجداول",
      forms: "النماذج",
      comprehensive_analysis: "تحليل شامل للمستندات وفهم المحتوى",
      content_analysis: "تحليل المحتوى",
      sentiment_detection: "اكتشاف المشاعر",
      entity_recognition: "التعرف على الكيانات",
      advanced: "متقدم",
      active: "نشط",
      ai_powered: "مدعوم بالذكاء الاصطناعي",
      automatic_classification: "تصنيف وتصنيف تلقائي للمستندات",
      invoices: "الفواتير",
      contracts: "العقود",
      reports: "التقارير",
      ai_search: "بحث مدعوم بالذكاء الاصطناعي عبر جميع المستندات المعالجة",
      indexed_documents: "المستندات المفهرسة",
      search_accuracy: "دقة البحث",
      avg_search_time: "متوسط وقت البحث",
      per_document_average: "متوسط لكل مستند",
      consistent_quality: "جودة ثابتة",
      text_documents: "المستندات النصية",
      spreadsheets: "جداول البيانات",
      images_scans: "الصور والمسوحات",
      ai_capabilities: "قدرات الذكاء الاصطناعي",
      integration_features: "ميزات التكامل",
      nlp: "معالجة اللغة الطبيعية",
      ocr: "التعرف البصري على الأحرف",
      computer_vision: "تحليل الرؤية الحاسوبية",
      pattern_recognition: "التعرف على الأنماط",
      api_integration: "تكامل واجهة برمجة التطبيقات",
      batch_processing: "المعالجة المجمعة",
      realtime_processing: "المعالجة في الوقت الفعلي",
      cloud_storage: "تكامل التخزين السحابي",
      recent_processing: "نشاط المعالجة الحديث",
      processed_ago: "تمت المعالجة منذ دقيقتين",
      completed: "مكتمل",
      processing: "جاري المعالجة",
      failed: "فشل"
    }
  };

  const t = (key: string) => translations[language as keyof typeof translations][key as keyof typeof translations.en] || key;
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('documents_processed')}</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">8,943</div>
            <p className="text-xs text-muted-foreground">
              +234 {t('this_month')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('accuracy_rate')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">96.8%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% {t('from_last_month')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('processing_time')}</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">1.2s</div>
            <p className="text-xs text-muted-foreground">
              -0.3s {t('improvement')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('languages_supported')}</CardTitle>
            <Globe className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">15</div>
            <p className="text-xs text-muted-foreground">
              {t('including_arabic_english')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {t('data_extraction')}
            </CardTitle>
            <CardDescription>
              {t('intelligent_extraction')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t('text_fields')}</span>
                <Badge variant="secondary">98.5%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('tables')}</span>
                <Badge variant="secondary">96.2%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('forms')}</span>
                <Badge variant="secondary">94.8%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-success" />
              {t('document_analysis')}
            </CardTitle>
            <CardDescription>
              {t('comprehensive_analysis')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t('content_analysis')}</span>
                <Badge variant="outline">{t('advanced')}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('sentiment_detection')}</span>
                <Badge variant="outline">{t('active')}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('entity_recognition')}</span>
                <Badge variant="outline">{t('ai_powered')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              {t('auto_classification')}
            </CardTitle>
            <CardDescription>
              {t('automatic_classification')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t('invoices')}</span>
                <span className="text-sm font-medium">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('contracts')}</span>
                <span className="text-sm font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('reports')}</span>
                <span className="text-sm font-medium">987</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              {t('intelligent_search')}
            </CardTitle>
            <CardDescription>
              {t('ai_search')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t('indexed_documents')}</span>
                <span className="text-sm font-medium">8,943</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('search_accuracy')}</span>
                <span className="text-sm font-medium">97.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('avg_search_time')}</span>
                <span className="text-sm font-medium">0.8s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="processing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processing">{t('processing_stats')}</TabsTrigger>
          <TabsTrigger value="formats">{t('supported_formats')}</TabsTrigger>
          <TabsTrigger value="features">{t('key_features')}</TabsTrigger>
          <TabsTrigger value="activity">{t('recent_activity')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="processing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t('extraction_accuracy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">96.8%</div>
                <div className="text-xs text-muted-foreground">+0.3% {t('from_last_month')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t('classification_rate')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">94.2%</div>
                <div className="text-xs text-muted-foreground">+1.1% {t('from_last_month')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t('ocr_quality')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">98.5%</div>
                <div className="text-xs text-muted-foreground">{t('consistent_quality')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t('processing_speed')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">1.2s</div>
                <div className="text-xs text-muted-foreground">{t('per_document_average')}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="formats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('text_documents')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline">PDF</Badge>
                <Badge variant="outline">DOC/DOCX</Badge>
                <Badge variant="outline">TXT</Badge>
                <Badge variant="outline">RTF</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('spreadsheets')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline">XLS/XLSX</Badge>
                <Badge variant="outline">CSV</Badge>
                <Badge variant="outline">ODS</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('images_scans')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline">JPG/JPEG</Badge>
                <Badge variant="outline">PNG</Badge>
                <Badge variant="outline">TIFF</Badge>
                <Badge variant="outline">BMP</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('ai_capabilities')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('nlp')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('ocr')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('computer_vision')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('pattern_recognition')}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('integration_features')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('api_integration')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('batch_processing')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('realtime_processing')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('cloud_storage')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('recent_processing')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">Contract_2024_ABC.pdf</div>
                      <div className="text-xs text-muted-foreground">{t('processed_ago')}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{t('completed')}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">Invoice_INV-2024-001.pdf</div>
                      <div className="text-xs text-muted-foreground">{t('processed_ago')}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{t('completed')}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-warning" />
                    <div>
                      <div className="text-sm font-medium">Report_Q4_2024.docx</div>
                      <div className="text-xs text-muted-foreground">{t('processing')}...</div>
                    </div>
                  </div>
                  <Badge variant="outline">{t('processing')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('upload_title')}
          </CardTitle>
          <CardDescription>
            {t('upload_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedFileUpload
            title={t('upload_title')}
            description={t('upload_description')}
            moduleType="documents"
            platform="document_intelligence"
            maxFileSize={200 * 1024 * 1024} // 200MB
            maxFiles={20}
            compressionEnabled={true}
            multipleUploads={true}
            showPresets={true}
            showUploadMethods={true}
            onFileProcessed={(file) => {
              console.log('Document processed:', file);
            }}
            onBatchProcessed={(files) => {
              console.log('Batch processed:', files);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentIntelligence;