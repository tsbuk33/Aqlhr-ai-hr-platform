import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Upload, Users, FileText, AlertTriangle, CheckCircle, TrendingUp, Clock, Settings, BarChart3, BookOpen, Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';

const NRCManagement = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const quarterlyMeetings = [
    {
      quarter: 'Q1',
      title: isArabic ? 'مراجعة السياسة السنوية للمكافآت' : 'Annual Remuneration Policy Review',
      status: 'completed',
      progress: 100,
      deadline: '2024-03-31',
      deliverables: [
        isArabic ? 'تقرير المكافآت السنوي الشامل' : 'Comprehensive Annual Remuneration Report',
        isArabic ? 'تحليل المركز في السوق' : 'Market Positioning Analysis',
        isArabic ? 'شهادة الامتثال للحوكمة' : 'Governance Compliance Certificate',
        isArabic ? 'خطة تطوير التنفيذيين الاستراتيجية' : 'Strategic Executive Development Plan'
      ]
    },
    {
      quarter: 'Q2',
      title: isArabic ? 'تقييم الأداء ومراجعة منتصف العام' : 'Mid-Year Performance Review',
      status: 'in-progress',
      progress: 75,
      deadline: '2024-06-30',
      deliverables: [
        isArabic ? 'تقرير الأداء التفصيلي لمنتصف العام' : 'Detailed Mid-Year Performance Report',
        isArabic ? 'مقترحات تعديل التعويضات المبررة' : 'Justified Compensation Adjustment Proposals',
        isArabic ? 'تقدم تطوير المواهب' : 'Talent Development Progress',
        isArabic ? 'تقييم مواءمة إدارة المخاطر' : 'Risk Management Alignment Assessment'
      ]
    },
    {
      quarter: 'Q3',
      title: isArabic ? 'تحليل السوق ومواءمة المخاطر' : 'Market Analysis & Risk Alignment',
      status: 'upcoming',
      progress: 25,
      deadline: '2024-09-30',
      deliverables: [
        isArabic ? 'لوحة معلومات أداء الربع الثالث' : 'Q3 Performance Dashboard',
        isArabic ? 'تحديث تعويضات السوق' : 'Market Compensation Update',
        isArabic ? 'تقرير تقييم المخاطر الشامل' : 'Comprehensive Risk Assessment Report',
        isArabic ? 'تحديث حالة الامتثال التنظيمي' : 'Regulatory Compliance Status Update'
      ]
    },
    {
      quarter: 'Q4',
      title: isArabic ? 'التقييم السنوي والتخطيط' : 'Year-End Evaluation & Planning',
      status: 'planning',
      progress: 10,
      deadline: '2024-12-31',
      deliverables: [
        isArabic ? 'تقرير الأداء السنوي الكامل' : 'Complete Annual Performance Report',
        isArabic ? 'ملخص قرارات التعويضات النهائية' : 'Final Compensation Decisions Summary',
        isArabic ? 'الخطة الاستراتيجية للعام القادم المعتمدة' : 'Approved Next Year Strategic Plan',
        isArabic ? 'التقرير السنوي الشامل للجنة' : 'Comprehensive Annual NRC Report'
      ]
    }
  ];

  const complianceRequirements = [
    {
      type: isArabic ? 'متطلبات البنك المركزي' : 'Central Bank Requirements',
      items: [
        { name: isArabic ? 'الحد الأدنى 3 أعضاء' : 'Minimum 3 members', status: 'compliant' },
        { name: isArabic ? 'مراجعة سياسة المكافآت نصف سنوية' : 'Half-yearly Remuneration Policy review', status: 'pending' },
        { name: isArabic ? 'التعاون مع لجنة إدارة المخاطر' : 'Risk Management Committee collaboration', status: 'compliant' },
        { name: isArabic ? 'تقديم الاختصاصات التنظيمية' : 'Terms of reference regulatory submission', status: 'compliant' }
      ]
    },
    {
      type: isArabic ? 'ميثاق السوق السعودي' : 'Saudi Exchange Charter',
      items: [
        { name: isArabic ? 'رئيس مستقل مطلوب' : 'Independent Chairman requirement', status: 'compliant' },
        { name: isArabic ? 'هيكل التقرير المباشر للمجلس' : 'Direct Board reporting structure', status: 'compliant' },
        { name: isArabic ? 'استبعاد المديرين التنفيذيين' : 'Executive Directors exclusion', status: 'compliant' },
        { name: isArabic ? 'التزامات الاجتماع الفصلي' : 'Quarterly meeting obligations', status: 'pending' }
      ]
    }
  ];

  const aiInsights = [
    {
      type: isArabic ? 'تحليل التعويضات' : 'Compensation Analysis',
      insight: isArabic ? 'التعويضات الحالية أقل بـ 12% من متوسط السوق للمناصب المماثلة' : 'Current compensation is 12% below market average for similar positions',
      recommendation: isArabic ? 'النظر في زيادة راتب الرئيس التنفيذي بنسبة 8-15% للحفاظ على القدرة التنافسية' : 'Consider 8-15% CEO salary increase to maintain competitiveness',
      priority: 'high'
    },
    {
      type: isArabic ? 'تحليل المخاطر' : 'Risk Analysis',
      insight: isArabic ? 'تم تحديد مخاطر الاحتفاظ العالية للمدير المالي' : 'High retention risk identified for CFO',
      recommendation: isArabic ? 'تنفيذ برنامج الاحتفاظ المستهدف مع حوافز الأداء طويلة المدى' : 'Implement targeted retention program with long-term performance incentives',
      priority: 'critical'
    },
    {
      type: isArabic ? 'التخطيط للخلافة' : 'Succession Planning',
      insight: isArabic ? 'تحديد 3 مرشحين مؤهلين تأهيلاً عالياً لمنصب الرئيس التنفيذي' : '3 high-potential candidates identified for CEO succession',
      recommendation: isArabic ? 'تسريع برامج التطوير القيادي للمرشحين المختارين' : 'Accelerate leadership development programs for selected candidates',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-status-success';
      case 'in-progress': return 'bg-status-warning';
      case 'upcoming': return 'bg-status-info';
      case 'planning': return 'bg-muted';
      case 'compliant': return 'text-status-success';
      case 'pending': return 'text-status-warning';
      case 'critical': return 'text-status-error';
      default: return 'bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-status-error text-status-error';
      case 'high': return 'border-status-warning text-status-warning';
      case 'medium': return 'border-status-info text-status-info';
      default: return 'border-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? 'إدارة لجنة الترشيحات والمكافآت' : 'NRC Management'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? 'نظام إدارة شامل للجنة الترشيحات والمكافآت مع ذكاء اصطناعي متقدم' 
              : 'Comprehensive Nomination & Remuneration Committee management with advanced AI'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-status-success/10 text-status-success">
            {isArabic ? 'نشط' : 'Active'}
          </Badge>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            {isArabic ? 'الإعدادات' : 'Settings'}
          </Button>
        </div>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="meetings">{isArabic ? 'الاجتماعات' : 'Meetings'}</TabsTrigger>
          <TabsTrigger value="compliance">{isArabic ? 'الامتثال' : 'Compliance'}</TabsTrigger>
          <TabsTrigger value="analytics">{isArabic ? 'التحليلات' : 'Analytics'}</TabsTrigger>
          <TabsTrigger value="documents">{isArabic ? 'الوثائق' : 'Documents'}</TabsTrigger>
          <TabsTrigger value="ai-insights">{isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'إجمالي الاجتماعات' : 'Total Meetings'}
                    </p>
                    <p className="text-3xl font-bold">4</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'حالة الامتثال' : 'Compliance Status'}
                    </p>
                    <p className="text-3xl font-bold text-status-success">85%</p>
                  </div>
                  <Shield className="h-8 w-8 text-status-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'المهام المكتملة' : 'Completed Tasks'}
                    </p>
                    <p className="text-3xl font-bold">12/16</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-status-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'المواعيد النهائية القادمة' : 'Upcoming Deadlines'}
                    </p>
                    <p className="text-3xl font-bold text-status-warning">3</p>
                  </div>
                  <Clock className="h-8 w-8 text-status-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quarterly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {isArabic ? 'تقدم الاجتماعات الفصلية' : 'Quarterly Meeting Progress'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quarterlyMeetings.map((meeting) => (
                  <div key={meeting.quarter} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{meeting.quarter}</h3>
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{meeting.title}</p>
                    <Progress value={meeting.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? 'الموعد النهائي:' : 'Deadline:'} {meeting.deadline}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isArabic ? 'إدارة الاجتماعات الفصلية' : 'Quarterly Meeting Management'}
            </h2>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              {isArabic ? 'جدولة اجتماع' : 'Schedule Meeting'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quarterlyMeetings.map((meeting) => (
              <Card key={meeting.quarter}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{meeting.quarter} - {meeting.title}</CardTitle>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      {isArabic ? 'التقدم:' : 'Progress:'} {meeting.progress}%
                    </p>
                    <Progress value={meeting.progress} />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">
                      {isArabic ? 'المخرجات المطلوبة:' : 'Required Deliverables:'}
                    </h4>
                    <ul className="text-sm space-y-1">
                      {meeting.deliverables.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-status-success" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      {isArabic ? 'عرض الوثائق' : 'View Documents'}
                    </Button>
                    <Button size="sm">
                      {isArabic ? 'تحديث الحالة' : 'Update Status'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isArabic ? 'مراقبة الامتثال التنظيمي' : 'Regulatory Compliance Monitoring'}
            </h2>
            <Button>
              <Shield className="w-4 h-4 mr-2" />
              {isArabic ? 'تشغيل فحص الامتثال' : 'Run Compliance Check'}
            </Button>
          </div>

          <div className="space-y-6">
            {complianceRequirements.map((requirement, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{requirement.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {requirement.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">{item.name}</span>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'compliant' 
                            ? (isArabic ? 'متوافق' : 'Compliant')
                            : (isArabic ? 'معلق' : 'Pending')
                          }
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isArabic ? 'تحليلات وإحصائيات متقدمة' : 'Advanced Analytics & Insights'}
            </h2>
            <Button>
              <BarChart3 className="w-4 h-4 mr-2" />
              {isArabic ? 'إنشاء تقرير' : 'Generate Report'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'تحليل تنافسية التعويضات' : 'Compensation Competitiveness'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'متوسط السوق' : 'Market Average'}</span>
                    <span className="font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'التعويض الحالي' : 'Current Compensation'}</span>
                    <span className="font-semibold text-status-warning">88%</span>
                  </div>
                  <Progress value={88} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {isArabic 
                      ? '12% أقل من متوسط السوق - يوصى بالمراجعة'
                      : '12% below market average - review recommended'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'مخاطر الاحتفاظ بالمواهب' : 'Talent Retention Risk'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'الرئيس التنفيذي' : 'CEO'}</span>
                    <Badge className="bg-status-success/10 text-status-success">
                      {isArabic ? 'منخفض' : 'Low'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'المدير المالي' : 'CFO'}</span>
                    <Badge className="bg-status-error/10 text-status-error">
                      {isArabic ? 'عالي' : 'High'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'المدير التنفيذي للعمليات' : 'COO'}</span>
                    <Badge className="bg-status-warning/10 text-status-warning">
                      {isArabic ? 'متوسط' : 'Medium'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isArabic ? 'إدارة الوثائق والملفات' : 'Document Management'}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                {isArabic ? 'مكتبة القوالب' : 'Template Library'}
              </Button>
              <label htmlFor="file-upload">
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  {isArabic ? 'رفع الوثائق' : 'Upload Documents'}
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'الوثائق المرفوعة حديثاً' : 'Recently Uploaded Documents'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      {isArabic ? 'لا توجد وثائق مرفوعة بعد' : 'No documents uploaded yet'}
                    </p>
                  ) : (
                    uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'قوالب الوثائق المطلوبة' : 'Required Document Templates'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    isArabic ? 'قالب تقرير الاجتماع الفصلي' : 'Quarterly Meeting Report Template',
                    isArabic ? 'نموذج تحليل التعويضات' : 'Compensation Analysis Form',
                    isArabic ? 'قائمة فحص الامتثال' : 'Compliance Checklist',
                    isArabic ? 'تقرير تقييم المخاطر' : 'Risk Assessment Report',
                    isArabic ? 'خطة التطوير التنفيذي' : 'Executive Development Plan'
                  ].map((template, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">{template}</span>
                      <Button variant="outline" size="sm">
                        {isArabic ? 'تحميل' : 'Download'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isArabic ? 'رؤى الذكاء الاصطناعي والتوصيات' : 'AI Insights & Recommendations'}
            </h2>
            <Button>
              <TrendingUp className="w-4 h-4 mr-2" />
              {isArabic ? 'تحديث التحليل' : 'Refresh Analysis'}
            </Button>
          </div>

          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${getPriorityColor(insight.priority)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{insight.type}</CardTitle>
                    <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                      {insight.priority === 'critical' 
                        ? (isArabic ? 'حرج' : 'Critical')
                        : insight.priority === 'high'
                        ? (isArabic ? 'عالي' : 'High')
                        : (isArabic ? 'متوسط' : 'Medium')
                      }
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">
                      {isArabic ? 'التحليل:' : 'Analysis:'}
                    </h4>
                    <p className="text-sm text-muted-foreground">{insight.insight}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {isArabic ? 'التوصية:' : 'Recommendation:'}
                    </h4>
                    <p className="text-sm">{insight.recommendation}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      {isArabic ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                    <Button size="sm">
                      {isArabic ? 'تنفيذ التوصية' : 'Implement Recommendation'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NRCManagement;