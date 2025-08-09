import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Workflow, 
  FileText, 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Settings, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  Zap,
  Globe,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Target,
  BarChart3,
  Filter,
  Shield,
  File,
  Loader2,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AqlHRAIAssistant } from '@/components/ai';

// Module discovery configuration for all 14 core modules
const HR_MODULES = [
  {
    id: 'employee-master-data',
    nameEn: 'Employee Master Data',
    nameAr: 'بيانات الموظفين الرئيسية',
    tools: ['profiles', 'org_charts', 'job_descriptions'],
    processes: ['onboarding', 'profile_update', 'data_verification']
  },
  {
    id: 'payroll-processing',
    nameEn: 'Payroll Processing',
    nameAr: 'معالجة الرواتب',
    tools: ['salary_calc', 'tax_processing', 'payslips'],
    processes: ['salary_calculation', 'payment_processing', 'tax_filing']
  },
  {
    id: 'benefits-administration',
    nameEn: 'Benefits Administration',
    nameAr: 'إدارة المزايا',
    tools: ['enrollment', 'claims', 'providers'],
    processes: ['benefit_enrollment', 'claims_processing', 'provider_management']
  },
  {
    id: 'performance-management',
    nameEn: 'Performance Management',
    nameAr: 'إدارة الأداء',
    tools: ['goals', 'reviews', '360_feedback'],
    processes: ['goal_setting', 'performance_review', 'feedback_collection']
  },
  {
    id: 'recruitment-hiring',
    nameEn: 'Recruitment & Hiring',
    nameAr: 'التوظيف والتعيين',
    tools: ['job_posting', 'candidate_tracking', 'interviews'],
    processes: ['job_posting', 'candidate_screening', 'interview_process', 'hiring_decision']
  },
  {
    id: 'training-development',
    nameEn: 'Training & Development',
    nameAr: 'التدريب والتطوير',
    tools: ['catalog', 'assessments', 'certifications'],
    processes: ['training_enrollment', 'skill_assessment', 'certification_tracking']
  },
  {
    id: 'time-attendance',
    nameEn: 'Time & Attendance',
    nameAr: 'الوقت والحضور',
    tools: ['timesheets', 'overtime_calc', 'scheduling'],
    processes: ['time_tracking', 'attendance_management', 'overtime_approval']
  },
  {
    id: 'leave-management',
    nameEn: 'Leave Management',
    nameAr: 'إدارة الإجازات',
    tools: ['requests', 'balance_tracking', 'approvals'],
    processes: ['leave_request', 'leave_approval', 'balance_update']
  },
  {
    id: 'succession-planning',
    nameEn: 'Succession Planning',
    nameAr: 'تخطيط التعاقب',
    tools: ['talent_pipeline', 'leadership_dev'],
    processes: ['talent_identification', 'development_planning', 'succession_mapping']
  },
  {
    id: 'compensation-management',
    nameEn: 'Compensation Management',
    nameAr: 'إدارة التعويضات',
    tools: ['benchmarking', 'merit_increases'],
    processes: ['salary_review', 'compensation_analysis', 'merit_planning']
  },
  {
    id: 'saudization-visa',
    nameEn: 'Saudization & Visa Calculator',
    nameAr: 'حاسبة السعودة والتأشيرات',
    tools: ['nitaqat_compliance', 'visa_tracking'],
    processes: ['saudization_tracking', 'visa_processing', 'compliance_reporting']
  },
  {
    id: 'health-safety-environment',
    nameEn: 'Health, Safety & Environment',
    nameAr: 'الصحة والسلامة والبيئة',
    tools: ['incident_reporting', 'safety_training'],
    processes: ['incident_management', 'safety_compliance', 'environmental_monitoring']
  },
  {
    id: 'employee-self-service',
    nameEn: 'Employee Self Service',
    nameAr: 'الخدمة الذاتية للموظفين',
    tools: ['profile_updates', 'requests'],
    processes: ['self_service_requests', 'profile_management', 'document_access']
  },
  {
    id: 'manager-dashboard',
    nameEn: 'Manager Dashboard',
    nameAr: 'لوحة تحكم المدير',
    tools: ['analytics', 'approvals', 'insights'],
    processes: ['team_management', 'approval_workflows', 'performance_monitoring']
  }
];

// Form templates for bilingual support
const FORM_TEMPLATES = [
  {
    category: 'employee_management',
    nameEn: 'Employee Management',
    nameAr: 'إدارة الموظفين',
    forms: [
      { id: 'personal_info', nameEn: 'Personal Information', nameAr: 'معلومات شخصية' },
      { id: 'job_info', nameEn: 'Job Information', nameAr: 'معلومات الوظيفة' },
      { id: 'contact_details', nameEn: 'Contact Details', nameAr: 'تفاصيل الاتصال' },
      { id: 'emergency_contacts', nameEn: 'Emergency Contacts', nameAr: 'جهات الاتصال الطارئة' }
    ]
  },
  {
    category: 'leave_requests',
    nameEn: 'Leave Requests',
    nameAr: 'طلبات الإجازة',
    forms: [
      { id: 'annual_leave', nameEn: 'Annual Leave', nameAr: 'إجازة سنوية' },
      { id: 'sick_leave', nameEn: 'Sick Leave', nameAr: 'إجازة مرضية' },
      { id: 'maternity_leave', nameEn: 'Maternity Leave', nameAr: 'إجازة أمومة' },
      { id: 'hajj_leave', nameEn: 'Hajj Leave', nameAr: 'إجازة حج' }
    ]
  },
  {
    category: 'performance_management',
    nameEn: 'Performance Management',
    nameAr: 'إدارة الأداء',
    forms: [
      { id: 'goal_setting', nameEn: 'Goal Setting', nameAr: 'وضع الأهداف' },
      { id: 'self_assessment', nameEn: 'Self Assessment', nameAr: 'التقييم الذاتي' },
      { id: 'manager_review', nameEn: 'Manager Review', nameAr: 'مراجعة المدير' },
      { id: 'development_plan', nameEn: 'Development Plan', nameAr: 'خطة التطوير' }
    ]
  }
];

const ProcessesAndForms = () => {
  const { isRTL, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('discovery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [discoveredData, setDiscoveredData] = useState({
    modules: 0,
    processes: 0,
    forms: 0,
    workflows: 0
  });
  const [isScanning, setIsScanning] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [implementedItems, setImplementedItems] = useState<any[]>([]);

  // Simulate AI discovery process
  const runModuleDiscovery = async () => {
    setIsScanning(true);
    
    // Simulate scanning process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDiscoveredData({
        modules: Math.floor((i / 100) * 14),
        processes: Math.floor((i / 100) * 42),
        forms: Math.floor((i / 100) * 86),
        workflows: Math.floor((i / 100) * 28)
      });
    }
    
    setIsScanning(false);
    toast({
      title: isRTL ? "اكتمل الاكتشاف" : "Discovery Complete",
      description: isRTL ? "تم اكتشاف جميع الوحدات والعمليات بنجاح" : "All modules and processes discovered successfully"
    });
  };

  // Handle file upload and text extraction
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    const text = await file.text();
    setDocumentText(text);
  };

  // AI document processing
  const processDocumentWithAI = async () => {
    if (!documentText) return;
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-document-processor', {
        body: {
          documentText,
          documentType: uploadedFile?.type || 'unknown',
          companyContext: 'AqlHR System - Saudi Arabia HR Management'
        }
      });

      if (error) throw error;
      
      setAiAnalysis(data.analysis);
      toast({
        title: isRTL ? "تم التحليل بنجاح" : "Analysis Complete",
        description: isRTL ? "تم تحليل المستند وجاهز للتطبيق" : "Document analyzed and ready for implementation"
      });
    } catch (error) {
      console.error('AI processing error:', error);
      toast({
        title: isRTL ? "خطأ في التحليل" : "Analysis Error",
        description: isRTL ? "حدث خطأ أثناء تحليل المستند" : "Error occurred while analyzing document",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Implement AI analysis into system
  const implementAnalysis = async () => {
    if (!aiAnalysis) return;
    
    try {
      // Simulate implementation process
      const newItem = {
        id: Date.now().toString(),
        title: aiAnalysis.title,
        type: aiAnalysis.documentType,
        category: aiAnalysis.implementation?.category || 'general',
        implementedAt: new Date().toISOString(),
        status: 'active'
      };
      
      setImplementedItems([...implementedItems, newItem]);
      setAiAnalysis(null);
      setUploadDialogOpen(false);
      setDocumentText('');
      setUploadedFile(null);
      
      toast({
        title: isRTL ? "تم التطبيق بنجاح" : "Successfully Implemented",
        description: isRTL ? "تم إضافة العملية/النموذج إلى النظام" : "Process/Form added to the system"
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في التطبيق" : "Implementation Error",
        description: isRTL ? "حدث خطأ أثناء إضافة العنصر" : "Error occurred while adding item",
        variant: "destructive"
      });
    }
  };

  const filteredModules = HR_MODULES.filter(module =>
    module.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.nameAr.includes(searchQuery)
  );

  return (
    <div className={`min-h-screen bg-background p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? 'العمليات والنماذج' : 'Processes & Forms'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL 
                ? 'إدارة شاملة للعمليات وسير العمل والنماذج عبر جميع وحدات الموارد البشرية'
                : 'Comprehensive management of processes, workflows, and forms across all HR modules'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  {isRTL ? 'رفع مستند' : 'Upload Document'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {isRTL ? 'معالج الذكاء الاصطناعي للمستندات' : 'AI Document Processor'}
                  </DialogTitle>
                  <DialogDescription>
                    {isRTL 
                      ? 'ارفع أي عملية أو سير عمل أو نموذج وسيقوم الذكاء الاصطناعي بتحليله وتطبيقه في النظام فوراً'
                      : 'Upload any process, workflow, or form and AI will analyze and implement it into the system instantly'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <Label>{isRTL ? 'اختر ملف أو أدخل النص' : 'Choose file or enter text'}</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{isRTL ? 'رفع ملف' : 'Upload File'}</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept=".txt,.doc,.docx,.pdf"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <File className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {isRTL ? 'اضغط لاختيار ملف' : 'Click to select file'}
                            </p>
                            {uploadedFile && (
                              <p className="text-xs text-primary mt-1">{uploadedFile.name}</p>
                            )}
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>{isRTL ? 'أو أدخل النص مباشرة' : 'Or enter text directly'}</Label>
                        <Textarea
                          placeholder={isRTL ? 'الصق أو اكتب نص العملية/النموذج هنا...' : 'Paste or type your process/form text here...'}
                          value={documentText}
                          onChange={(e) => setDocumentText(e.target.value)}
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Processing */}
                  {documentText && (
                    <div className="space-y-4">
                      <Button 
                        onClick={processDocumentWithAI} 
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isRTL ? 'جاري التحليل...' : 'Analyzing...'}
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            {isRTL ? 'تحليل بالذكاء الاصطناعي' : 'Analyze with AI'}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* AI Analysis Results */}
                  {aiAnalysis && (
                    <div className="space-y-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          {isRTL ? 'تم تحليل المستند بنجاح! مراجع النتائج أدناه.' : 'Document analyzed successfully! Review the results below.'}
                        </AlertDescription>
                      </Alert>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {isRTL ? aiAnalysis.title?.ar : aiAnalysis.title?.en}
                          </CardTitle>
                          <CardDescription>
                            {isRTL ? aiAnalysis.description?.ar : aiAnalysis.description?.en}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <Label>{isRTL ? 'النوع' : 'Type'}</Label>
                              <Badge variant="secondary" className="block w-fit mt-1">
                                {aiAnalysis.documentType}
                              </Badge>
                            </div>
                            <div>
                              <Label>{isRTL ? 'الفئة' : 'Category'}</Label>
                              <Badge variant="outline" className="block w-fit mt-1">
                                {aiAnalysis.implementation?.category}
                              </Badge>
                            </div>
                            <div>
                              <Label>{isRTL ? 'الأولوية' : 'Priority'}</Label>
                              <Badge 
                                variant={aiAnalysis.implementation?.priority === 'high' ? 'destructive' : 'secondary'}
                                className="block w-fit mt-1"
                              >
                                {aiAnalysis.implementation?.priority}
                              </Badge>
                            </div>
                          </div>

                          {/* Extracted Data Summary */}
                          {aiAnalysis.extractedData && (
                            <div className="space-y-3">
                              <Label>{isRTL ? 'البيانات المستخرجة' : 'Extracted Data'}</Label>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                {aiAnalysis.extractedData.processSteps && (
                                  <div>
                                    <span className="font-medium">{isRTL ? 'خطوات العملية:' : 'Process Steps:'}</span>
                                    <span className="ml-2">{aiAnalysis.extractedData.processSteps.length}</span>
                                  </div>
                                )}
                                {aiAnalysis.extractedData.formFields && (
                                  <div>
                                    <span className="font-medium">{isRTL ? 'حقول النموذج:' : 'Form Fields:'}</span>
                                    <span className="ml-2">{aiAnalysis.extractedData.formFields.length}</span>
                                  </div>
                                )}
                                {aiAnalysis.extractedData.approvalChain && (
                                  <div>
                                    <span className="font-medium">{isRTL ? 'سلسلة الموافقات:' : 'Approval Chain:'}</span>
                                    <span className="ml-2">{aiAnalysis.extractedData.approvalChain.length} {isRTL ? 'مستويات' : 'levels'}</span>
                                  </div>
                                )}
                                {aiAnalysis.extractedData.integrationPoints && (
                                  <div>
                                    <span className="font-medium">{isRTL ? 'نقاط التكامل:' : 'Integration Points:'}</span>
                                    <span className="ml-2">{aiAnalysis.extractedData.integrationPoints.length}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Recommendations */}
                          {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                            <div className="space-y-2">
                              <Label>{isRTL ? 'التوصيات' : 'Recommendations'}</Label>
                              <div className="space-y-2">
                                {aiAnalysis.recommendations.slice(0, 3).map((rec: any, index: number) => (
                                  <Alert key={index}>
                                    <AlertDescription className="text-sm">
                                      {isRTL ? rec.description?.ar : rec.description?.en}
                                    </AlertDescription>
                                  </Alert>
                                ))}
                              </div>
                            </div>
                          )}

                          <Button onClick={implementAnalysis} className="w-full">
                            <Zap className="h-4 w-4 mr-2" />
                            {isRTL ? 'تطبيق في النظام' : 'Implement into System'}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
              <Brain className="h-4 w-4 mr-2" />
              {isRTL ? 'معالج الذكاء الاصطناعي' : 'AI Processor'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="discovery" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {isRTL ? 'الاكتشاف' : 'Discovery'}
            </TabsTrigger>
            <TabsTrigger value="processes" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              {isRTL ? 'العمليات' : 'Processes'}
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {isRTL ? 'النماذج' : 'Forms'}
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {isRTL ? 'سير العمل' : 'Workflows'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {isRTL ? 'التحليلات' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          {/* Module Discovery Tab */}
          <TabsContent value="discovery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  {isRTL ? 'اكتشاف الوحدات الذكي' : 'Intelligent Module Discovery'}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? 'اكتشاف تلقائي لجميع الوحدات والعمليات والنماذج عبر 14 وحدة موارد بشرية أساسية'
                    : 'Automatically discover all modules, processes, and forms across 14 core HR modules'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Discovery Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">{discoveredData.modules}</div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? 'الوحدات' : 'Modules'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{discoveredData.processes}</div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? 'العمليات' : 'Processes'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">{discoveredData.forms}</div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? 'النماذج' : 'Forms'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-600">{discoveredData.workflows}</div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? 'سير العمل' : 'Workflows'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Discovery Controls */}
                <div className="flex items-center justify-between">
                  <Button 
                    onClick={runModuleDiscovery} 
                    disabled={isScanning}
                    className="flex items-center gap-2"
                  >
                    {isScanning ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {isRTL ? 'بدء الاكتشاف' : 'Start Discovery'}
                  </Button>
                  
                  {isScanning && (
                    <div className="flex items-center gap-2">
                      <Progress value={(discoveredData.modules / 14) * 100} className="w-32" />
                      <span className="text-sm text-muted-foreground">
                        {Math.round((discoveredData.modules / 14) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Module Search */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={isRTL ? 'البحث في الوحدات...' : 'Search modules...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-md"
                    />
                  </div>

                  {/* AI Implemented Items */}
                  {implementedItems.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h3 className="text-lg font-semibold">
                          {isRTL ? 'العناصر المطبقة بالذكاء الاصطناعي' : 'AI-Implemented Items'}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {implementedItems.map((item) => (
                          <Card key={item.id} className="border-primary/20">
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="default" className="text-xs">
                                    {item.type}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs text-green-600">
                                    {isRTL ? 'مطبق' : 'Implemented'}
                                  </Badge>
                                </div>
                                <h4 className="font-semibold">
                                  {isRTL ? item.title?.ar : item.title?.en}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {isRTL ? `الفئة: ${item.category}` : `Category: ${item.category}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {isRTL ? 'تم التطبيق:' : 'Implemented:'} {new Date(item.implementedAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {isRTL ? 'عرض' : 'View'}
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3 mr-1" />
                                    {isRTL ? 'تعديل' : 'Edit'}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Module Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModules.map((module) => (
                      <Card 
                        key={module.id} 
                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedModule === module.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedModule(module.id)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold">
                              {isRTL ? module.nameAr : module.nameEn}
                            </h3>
                            <div className="flex flex-wrap gap-1">
                              {module.tools.map((tool) => (
                                <Badge key={tool} variant="secondary" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {module.processes.length} {isRTL ? 'عمليات' : 'processes'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-primary" />
                  {isRTL ? 'إدارة العمليات' : 'Process Management'}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? 'إدارة وتحسين عمليات الموارد البشرية عبر جميع الوحدات'
                    : 'Manage and optimize HR processes across all modules'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Process Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <h4 className="font-medium">
                            {isRTL ? 'عمليات الموظفين' : 'Employee Processes'}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'الإدخال، التحديث، الخروج' : 'Onboarding, Updates, Offboarding'}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          {isRTL ? 'عرض العمليات' : 'View Processes'}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <h4 className="font-medium">
                            {isRTL ? 'عمليات التشغيل' : 'Operational Processes'}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'الرواتب، الإجازات، الحضور' : 'Payroll, Leave, Attendance'}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          {isRTL ? 'عرض العمليات' : 'View Processes'}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-orange-600" />
                          <h4 className="font-medium">
                            {isRTL ? 'عمليات الامتثال' : 'Compliance Processes'}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'السعودة، السلامة، التدقيق' : 'Saudization, Safety, Auditing'}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          {isRTL ? 'عرض العمليات' : 'View Processes'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {isRTL ? 'مُنشئ النماذج الديناميكي' : 'Dynamic Form Builder'}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? 'إنشاء وإدارة النماذج بدعم ثنائي اللغة ومنطق شرطي'
                    : 'Create and manage forms with bilingual support and conditional logic'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Form Templates */}
                  {FORM_TEMPLATES.map((template) => (
                    <div key={template.category} className="space-y-3">
                      <h3 className="text-lg font-semibold">
                        {isRTL ? template.nameAr : template.nameEn}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {template.forms.map((form) => (
                          <Card key={form.id} className="cursor-pointer hover:bg-muted/50">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {isRTL ? form.nameAr : form.nameEn}
                                </span>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Form Builder Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {isRTL ? 'إنشاء نموذج جديد' : 'Create New Form'}
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      {isRTL ? 'استيراد نموذج' : 'Import Form'}
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      {isRTL ? 'تصدير النماذج' : 'Export Forms'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {isRTL ? 'محرك أتمتة سير العمل' : 'Workflow Automation Engine'}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? 'أتمتة العمليات مع سلاسل الموافقات وقواعد التصعيد'
                    : 'Automate processes with approval chains and escalation rules'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Workflow Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">24</div>
                        <div className="text-sm text-muted-foreground">
                          {isRTL ? 'سير عمل نشط' : 'Active Workflows'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">156</div>
                        <div className="text-sm text-muted-foreground">
                          {isRTL ? 'مهام معلقة' : 'Pending Tasks'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">89%</div>
                        <div className="text-sm text-muted-foreground">
                          {isRTL ? 'معدل الأتمتة' : 'Automation Rate'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Workflow Categories */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">
                      {isRTL ? 'قوالب سير العمل' : 'Workflow Templates'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {isRTL ? 'موافقة الإجازات' : 'Leave Approval'}
                            </h4>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {isRTL 
                              ? 'سير عمل تلقائي لمعالجة طلبات الإجازات'
                              : 'Automated workflow for processing leave requests'
                            }
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              {isRTL ? 'عرض' : 'View'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              {isRTL ? 'تعديل' : 'Edit'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {isRTL ? 'مراجعة الأداء' : 'Performance Review'}
                            </h4>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {isRTL 
                              ? 'دورة تقييم الأداء السنوية المتكاملة'
                              : 'Comprehensive annual performance review cycle'
                            }
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              {isRTL ? 'عرض' : 'View'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              {isRTL ? 'تعديل' : 'Edit'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {isRTL ? 'تحليلات KPI المتكاملة' : 'Integrated KPI Analytics'}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? 'مؤشرات الأداء الرئيسية والتحليلات عبر جميع العمليات والوحدات'
                    : 'Key performance indicators and analytics across all processes and modules'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium">
                          {isRTL ? 'كفاءة العمليات' : 'Process Efficiency'}
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'متوسط وقت إكمال العمليات' : 'Average process completion time'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium">
                          {isRTL ? 'اعتماد المستخدمين' : 'User Adoption'}
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'معدل استخدام الأدوات' : 'Tool usage rate'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-orange-600" />
                        <h4 className="font-medium">
                          {isRTL ? 'معدل الإكمال' : 'Completion Rate'}
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 mb-1">96%</div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'نجاح إكمال النماذج' : 'Form completion success'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AqlHRAIAssistant 
        moduleContext="processes-forms" 
        companyId="demo-company"
      />
    </div>
  );
};

export default ProcessesAndForms;