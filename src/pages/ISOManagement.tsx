import React, { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { AqlHRAIAssistant } from '@/components/ai';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Upload,
  FileText,
  Users,
  Settings,
  Calendar as CalendarIcon,
  TrendingUp,
  Award,
  Brain,
  Search,
  Download,
  Eye,
  Plus,
  BookOpen,
  Target,
  Activity,
  Zap,
  Database,
  Lock,
  Leaf,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface ISOStandard {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  status: 'compliant' | 'needs_attention' | 'non_compliant' | 'pending';
  progress: number;
  certificationDate?: Date;
  expiryDate?: Date;
  nextAuditDate?: Date;
  icon: React.ReactNode;
  description: string;
  descriptionAr: string;
}

interface TrainingProgram {
  id: string;
  name: string;
  nameAr: string;
  isoStandard: string;
  mandatory: boolean;
  duration: number;
  completionRate: number;
  nextDeadline: Date;
}

interface ComplianceGap {
  id: string;
  standard: string;
  requirement: string;
  requirementAr: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  dueDate: Date;
}

const ISOManagement = () => {
  const { language } = useLocalization();
  const isRTL = language === 'ar';
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const isoStandards: ISOStandard[] = [
    {
      id: '9001',
      code: 'ISO 9001',
      name: 'Quality Management Systems',
      nameAr: 'أنظمة إدارة الجودة',
      status: 'compliant',
      progress: 95,
      certificationDate: new Date('2023-01-15'),
      expiryDate: new Date('2026-01-15'),
      nextAuditDate: new Date('2024-06-15'),
      icon: <Award className="h-5 w-5" />,
      description: 'Quality management and HR competence requirements',
      descriptionAr: 'متطلبات إدارة الجودة وكفاءة الموارد البشرية'
    },
    {
      id: '45001',
      code: 'ISO 45001',
      name: 'Occupational Health & Safety',
      nameAr: 'الصحة والسلامة المهنية',
      status: 'needs_attention',
      progress: 78,
      certificationDate: new Date('2023-03-20'),
      expiryDate: new Date('2026-03-20'),
      nextAuditDate: new Date('2024-08-20'),
      icon: <Shield className="h-5 w-5" />,
      description: 'Workplace safety and occupational health management',
      descriptionAr: 'إدارة السلامة في مكان العمل والصحة المهنية'
    },
    {
      id: '27001',
      code: 'ISO 27001',
      name: 'Information Security',
      nameAr: 'أمن المعلومات',
      status: 'compliant',
      progress: 92,
      certificationDate: new Date('2023-02-10'),
      expiryDate: new Date('2026-02-10'),
      nextAuditDate: new Date('2024-07-10'),
      icon: <Lock className="h-5 w-5" />,
      description: 'Information security and HR processes protection',
      descriptionAr: 'أمن المعلومات وحماية عمليات الموارد البشرية'
    },
    {
      id: '14001',
      code: 'ISO 14001',
      name: 'Environmental Management',
      nameAr: 'الإدارة البيئية',
      status: 'pending',
      progress: 45,
      nextAuditDate: new Date('2024-05-15'),
      icon: <Leaf className="h-5 w-5" />,
      description: 'Environmental awareness and sustainability training',
      descriptionAr: 'التوعية البيئية وتدريب الاستدامة'
    },
    {
      id: '50001',
      code: 'ISO 50001',
      name: 'Energy Management',
      nameAr: 'إدارة الطاقة',
      status: 'non_compliant',
      progress: 25,
      icon: <Zap className="h-5 w-5" />,
      description: 'Energy management training and efficiency programs',
      descriptionAr: 'تدريب إدارة الطاقة وبرامج الكفاءة'
    },
    {
      id: '37001',
      code: 'ISO 37001',
      name: 'Anti-Bribery Management',
      nameAr: 'إدارة مكافحة الرشوة',
      status: 'needs_attention',
      progress: 68,
      icon: <Database className="h-5 w-5" />,
      description: 'Anti-bribery compliance and ethical conduct training',
      descriptionAr: 'امتثال مكافحة الرشوة وتدريب السلوك الأخلاقي'
    }
  ];

  const trainingPrograms: TrainingProgram[] = [
    {
      id: '1',
      name: 'Quality Management Training',
      nameAr: 'تدريب إدارة الجودة',
      isoStandard: 'ISO 9001',
      mandatory: true,
      duration: 8,
      completionRate: 87,
      nextDeadline: new Date('2024-06-30')
    },
    {
      id: '2',
      name: 'Safety Awareness Program',
      nameAr: 'برنامج التوعية بالسلامة',
      isoStandard: 'ISO 45001',
      mandatory: true,
      duration: 12,
      completionRate: 73,
      nextDeadline: new Date('2024-05-15')
    },
    {
      id: '3',
      name: 'Information Security Training',
      nameAr: 'تدريب أمن المعلومات',
      isoStandard: 'ISO 27001',
      mandatory: true,
      duration: 6,
      completionRate: 94,
      nextDeadline: new Date('2024-07-20')
    }
  ];

  const complianceGaps: ComplianceGap[] = [
    {
      id: '1',
      standard: 'ISO 45001',
      requirement: 'Emergency Response Training',
      requirementAr: 'تدريب الاستجابة للطوارئ',
      severity: 'critical',
      status: 'open',
      dueDate: new Date('2024-05-01')
    },
    {
      id: '2',
      standard: 'ISO 14001',
      requirement: 'Environmental Awareness Program',
      requirementAr: 'برنامج التوعية البيئية',
      severity: 'high',
      status: 'in_progress',
      dueDate: new Date('2024-06-15')
    },
    {
      id: '3',
      standard: 'ISO 50001',
      requirement: 'Energy Efficiency Training',
      requirementAr: 'تدريب كفاءة الطاقة',
      severity: 'medium',
      status: 'open',
      dueDate: new Date('2024-07-30')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non_compliant': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const overallCompliance = Math.round(
    isoStandards.reduce((acc, std) => acc + std.progress, 0) / isoStandards.length
  );

  return (
    <div className={cn("p-6 space-y-6", isRTL && "font-arabic")}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            {isRTL ? 'إدارة امتثال ISO بالذكاء الاصطناعي' : 'ISO Compliance Management AI'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isRTL 
              ? 'إدارة شاملة لمعايير ISO مع معايير SASO والامتثال للرؤية 2030'
              : 'Comprehensive ISO standards management with SASO standards and Vision 2030 compliance'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            {overallCompliance}% {isRTL ? 'امتثال عام' : 'Overall Compliance'}
          </Badge>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {isRTL ? 'معيار جديد' : 'New Standard'}
          </Button>
        </div>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'المعايير المتوافقة' : 'Compliant Standards'}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {isoStandards.filter(s => s.status === 'compliant').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'تحتاج انتباه' : 'Needs Attention'}
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {isoStandards.filter(s => s.status === 'needs_attention').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'التدريبات النشطة' : 'Active Trainings'}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {trainingPrograms.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'الفجوات المفتوحة' : 'Open Gaps'}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {complianceGaps.filter(g => g.status === 'open').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="standards">{isRTL ? 'المعايير' : 'Standards'}</TabsTrigger>
          <TabsTrigger value="training">{isRTL ? 'التدريب' : 'Training'}</TabsTrigger>
          <TabsTrigger value="audit">{isRTL ? 'التدقيق' : 'Audit'}</TabsTrigger>
          <TabsTrigger value="documents">{isRTL ? 'الوثائق' : 'Documents'}</TabsTrigger>
          <TabsTrigger value="ai-insights">{isRTL ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isRTL ? 'حالة الامتثال' : 'Compliance Status'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isoStandards.map((standard) => (
                    <div key={standard.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium flex items-center gap-2">
                          {standard.icon}
                          {isRTL ? standard.nameAr : standard.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {standard.progress}%
                        </span>
                      </div>
                      <Progress value={standard.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {isRTL ? 'المواعيد النهائية القادمة' : 'Upcoming Deadlines'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceGaps.slice(0, 5).map((gap) => (
                    <div key={gap.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {isRTL ? gap.requirementAr : gap.requirement}
                        </p>
                        <p className="text-xs text-muted-foreground">{gap.standard}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getSeverityColor(gap.severity)}>
                          {gap.severity}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(gap.dueDate, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'الإجراءات السريعة' : 'Quick Actions'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">{isRTL ? 'رفع وثيقة' : 'Upload Document'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">{isRTL ? 'جدولة تدقيق' : 'Schedule Audit'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">{isRTL ? 'تعيين تدريب' : 'Assign Training'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">{isRTL ? 'تقرير الامتثال' : 'Compliance Report'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Standards Tab */}
        <TabsContent value="standards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {isoStandards.map((standard) => (
              <Card key={standard.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {standard.icon}
                      <div>
                        <CardTitle className="text-lg">{standard.code}</CardTitle>
                        <CardDescription className="text-sm">
                          {isRTL ? standard.nameAr : standard.name}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(standard.status)}>
                      {standard.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? standard.descriptionAr : standard.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'التقدم' : 'Progress'}</span>
                      <span>{standard.progress}%</span>
                    </div>
                    <Progress value={standard.progress} />
                  </div>

                  {standard.certificationDate && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{isRTL ? 'تاريخ الشهادة:' : 'Certification:'}</span>
                        <span>{format(standard.certificationDate, 'MMM dd, yyyy')}</span>
                      </div>
                      {standard.expiryDate && (
                        <div className="flex justify-between">
                          <span>{isRTL ? 'تاريخ الانتهاء:' : 'Expiry:'}</span>
                          <span>{format(standard.expiryDate, 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                      {standard.nextAuditDate && (
                        <div className="flex justify-between">
                          <span>{isRTL ? 'التدقيق القادم:' : 'Next Audit:'}</span>
                          <span>{format(standard.nextAuditDate, 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      {isRTL ? 'عرض' : 'View'}
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      {isRTL ? 'إدارة' : 'Manage'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {isRTL ? 'برامج التدريب' : 'Training Programs'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingPrograms.map((program) => (
                    <div key={program.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {isRTL ? program.nameAr : program.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{program.isoStandard}</p>
                        </div>
                        {program.mandatory && (
                          <Badge variant="secondary">{isRTL ? 'إجباري' : 'Mandatory'}</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{isRTL ? 'معدل الإنجاز' : 'Completion Rate'}</span>
                          <span>{program.completionRate}%</span>
                        </div>
                        <Progress value={program.completionRate} />
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span>{isRTL ? 'المدة:' : 'Duration:'} {program.duration} {isRTL ? 'ساعات' : 'hours'}</span>
                        <span>{isRTL ? 'الموعد النهائي:' : 'Deadline:'} {format(program.nextDeadline, 'MMM dd')}</span>
                      </div>

                      <Button size="sm" className="w-full">
                        {isRTL ? 'إدارة التدريب' : 'Manage Training'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competency Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {isRTL ? 'مصفوفة الكفاءة' : 'Competency Matrix'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">
                      {isRTL ? 'تحليل الكفاءة بالذكاء الاصطناعي' : 'AI-Powered Competency Analysis'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isRTL 
                        ? 'اكتشف فجوات المهارات وخطط للتدريب تلقائياً'
                        : 'Discover skill gaps and plan training automatically'
                      }
                    </p>
                    <Button>
                      <Brain className="h-4 w-4 mr-2" />
                      {isRTL ? 'تشغيل التحليل' : 'Run Analysis'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {isRTL ? 'رفع الوثائق' : 'Document Upload'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'رفع وإدارة وثائق الامتثال لمعايير ISO'
                  : 'Upload and manage ISO compliance documents'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">
                  {isRTL ? 'اسحب الملفات هنا أو اضغط للتصفح' : 'Drag files here or click to browse'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRTL ? 'يدعم PDF, DOC, XLS, JPG, PNG' : 'Supports PDF, DOC, XLS, JPG, PNG'}
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button asChild>
                    <span>{isRTL ? 'اختيار الملفات' : 'Choose Files'}</span>
                  </Button>
                </Label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">{isRTL ? 'الملفات المرفوعة' : 'Uploaded Files'}</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Categories */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center p-4">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium text-sm mb-1">
                    {isRTL ? 'السياسات' : 'Policies'}
                  </h4>
                  <p className="text-xs text-muted-foreground">12 {isRTL ? 'ملف' : 'files'}</p>
                </Card>
                <Card className="text-center p-4">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium text-sm mb-1">
                    {isRTL ? 'الإجراءات' : 'Procedures'}
                  </h4>
                  <p className="text-xs text-muted-foreground">8 {isRTL ? 'ملف' : 'files'}</p>
                </Card>
                <Card className="text-center p-4">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-medium text-sm mb-1">
                    {isRTL ? 'الشهادات' : 'Certificates'}
                  </h4>
                  <p className="text-xs text-muted-foreground">6 {isRTL ? 'ملف' : 'files'}</p>
                </Card>
                <Card className="text-center p-4">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium text-sm mb-1">
                    {isRTL ? 'التقارير' : 'Reports'}
                  </h4>
                  <p className="text-xs text-muted-foreground">15 {isRTL ? 'ملف' : 'files'}</p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
        </TabsContent>

        {/* Enhanced Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <UniversalDocumentManager
            moduleName={isRTL ? "إدارة معايير ISO" : "ISO Standards Management"}
            description={isRTL ? "إدارة شاملة لوثائق معايير ISO والامتثال" : "Comprehensive management of ISO standards and compliance documents"}
            platform="iso_management"
            moduleType="compliance"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.jpg', '.png']}
            maxFileSize={10}
            maxFiles={50}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  {isRTL ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">
                        {isRTL ? 'عالي الأولوية' : 'High Priority'}
                      </Badge>
                      <span className="text-sm font-medium">ISO 45001</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? 'يجب تحديث برنامج تدريب الاستجابة للطوارئ خلال 15 يوماً لتجنب عدم الامتثال'
                        : 'Emergency response training program requires update within 15 days to avoid non-compliance'
                      }
                    </p>
                    <Button size="sm" variant="outline">
                      {isRTL ? 'تطبيق التوصية' : 'Apply Recommendation'}
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {isRTL ? 'متوسط الأولوية' : 'Medium Priority'}
                      </Badge>
                      <span className="text-sm font-medium">ISO 14001</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? 'يُنصح بتطوير برنامج التوعية البيئية لتحسين الامتثال'
                        : 'Environmental awareness program development recommended for improved compliance'
                      }
                    </p>
                    <Button size="sm" variant="outline">
                      {isRTL ? 'تطبيق التوصية' : 'Apply Recommendation'}
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        {isRTL ? 'منخفض الأولوية' : 'Low Priority'}
                      </Badge>
                      <span className="text-sm font-medium">ISO 9001</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? 'أداء ممتاز في إدارة الجودة، النظر في تحسينات إضافية'
                        : 'Excellent performance in quality management, consider additional improvements'
                      }
                    </p>
                    <Button size="sm" variant="outline">
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {isRTL ? 'التحليلات التنبؤية' : 'Predictive Analytics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'احتمالية نجاح التدقيق القادم'
                        : 'Predicted audit success probability'
                      }
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'مخاطر عدم الامتثال' : 'Compliance Risk'}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {isRTL ? 'منخفض' : 'Low'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'فعالية التدريب' : 'Training Effectiveness'}</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {isRTL ? 'عالي' : 'High'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'اتجاه الامتثال' : 'Compliance Trend'}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {isRTL ? 'تحسن' : 'Improving'}
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {isRTL ? 'تقرير مفصل' : 'Detailed Report'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Automation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {isRTL ? 'حالة الأتمتة بالذكاء الاصطناعي' : 'AI Automation Status'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">{isRTL ? 'مراقبة تلقائية' : 'Auto Monitoring'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'نشط - مراقبة 24/7' : 'Active - 24/7 monitoring'}
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">{isRTL ? 'إنشاء الوثائق' : 'Document Generation'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تم إنشاء 15 وثيقة تلقائياً' : '15 documents auto-generated'}
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-medium">{isRTL ? 'تنبيهات استباقية' : 'Proactive Alerts'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? '3 تنبيهات قيد المراجعة' : '3 alerts pending review'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audit Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {isRTL ? 'جدول التدقيق' : 'Audit Schedule'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">ISO 9001 {isRTL ? 'تدقيق المراقبة' : 'Surveillance Audit'}</h4>
                      <p className="text-xs text-muted-foreground">June 15, 2024</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{isRTL ? 'مؤكد' : 'Confirmed'}</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">ISO 27001 {isRTL ? 'التدقيق السنوي' : 'Annual Audit'}</h4>
                      <p className="text-xs text-muted-foreground">July 10, 2024</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{isRTL ? 'مجدول' : 'Scheduled'}</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">ISO 45001 {isRTL ? 'تدقيق المراقبة' : 'Surveillance Audit'}</h4>
                      <p className="text-xs text-muted-foreground">August 20, 2024</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">{isRTL ? 'قيد التخطيط' : 'Planning'}</Badge>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? 'جدولة تدقيق جديد' : 'Schedule New Audit'}
                </Button>
              </CardContent>
            </Card>

            {/* Audit Preparation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {isRTL ? 'تحضير التدقيق' : 'Audit Preparation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>{isRTL ? 'مراجعة الوثائق' : 'Document Review'}</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{isRTL ? 'تحضير الأدلة' : 'Evidence Preparation'}</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{isRTL ? 'تدريب الفريق' : 'Team Training'}</span>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{isRTL ? 'إعداد قائمة التحقق' : 'Checklist Preparation'}</span>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {isRTL ? 'جاهزية التدقيق' : 'Audit Readiness'}
                      </span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} />
                  </div>

                  <Button className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    {isRTL ? 'تحضير تلقائي بالذكاء الاصطناعي' : 'AI Auto-Preparation'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <ModuleDocumentUploader moduleKey="isoManagement.compliance" />
      <AqlHRAIAssistant moduleContext="isoManagement.compliance" />
    </div>
  );
};

export default ISOManagement;