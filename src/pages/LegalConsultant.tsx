import React, { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Scale, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Upload, 
  Send, 
  Bot, 
  Shield,
  Search,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Database,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Download,
  Eye,
  Gavel,
  ScrollText,
  ShieldCheck,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LegalCase {
  id: string;
  title: string;
  type: 'employment' | 'dispute' | 'compliance' | 'harassment';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  riskLevel: 'minimal' | 'moderate' | 'significant' | 'severe';
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  date: string;
  description: string;
}

interface AIAnalysis {
  riskScore: number;
  recommendations: string[];
  legalIssues: string[];
  nextSteps: string[];
  urgency: string;
  complianceStatus: string;
}

const LegalConsultant = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('assistant');
  const [chatMessage, setChatMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [sampleCases] = useState<LegalCase[]>([
    {
      id: '1',
      title: language === 'ar' ? 'نزاع حول ساعات العمل الإضافي' : 'Overtime Hours Dispute',
      type: 'employment',
      urgency: 'medium',
      riskLevel: 'moderate',
      status: 'open',
      date: '2024-01-15',
      description: language === 'ar' 
        ? 'موظف يطالب بتعويضات ساعات عمل إضافية غير مدفوعة لمدة 6 أشهر'
        : 'Employee claiming compensation for unpaid overtime hours over 6 months'
    },
    {
      id: '2',
      title: language === 'ar' ? 'شكوى تحرش في مكان العمل' : 'Workplace Harassment Complaint',
      type: 'harassment',
      urgency: 'high',
      riskLevel: 'significant',
      status: 'in_progress',
      date: '2024-01-20',
      description: language === 'ar'
        ? 'بلاغ عن تحرش من قبل المدير المباشر مع أدلة موثقة'
        : 'Report of harassment by direct manager with documented evidence'
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: language === 'ar' ? 'تم رفع الملف بنجاح' : 'File uploaded successfully',
      description: language === 'ar' 
        ? `تم رفع ${files.length} ملف للتحليل القانوني`
        : `${files.length} file(s) uploaded for legal analysis`
    });
  };

  const analyzeDocument = async (file?: File) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAiAnalysis({
        riskScore: 75,
        recommendations: [
          language === 'ar' 
            ? 'مراجعة سياسة ساعات العمل الإضافي'
            : 'Review overtime policy',
          language === 'ar'
            ? 'توثيق جميع المراسلات مع الموظف'
            : 'Document all communications with employee',
          language === 'ar'
            ? 'استشارة قانونية متخصصة'
            : 'Seek specialized legal counsel'
        ],
        legalIssues: [
          language === 'ar'
            ? 'انتهاك محتمل لقانون العمل السعودي المادة 105'
            : 'Potential violation of Saudi Labor Law Article 105',
          language === 'ar'
            ? 'عدم الامتثال لنظام الأجور'
            : 'Non-compliance with wage system'
        ],
        nextSteps: [
          language === 'ar'
            ? 'جمع الأدلة والمستندات'
            : 'Gather evidence and documentation',
          language === 'ar'
            ? 'إعداد رد قانوني'
            : 'Prepare legal response',
          language === 'ar'
            ? 'تحديد موعد للوساطة'
            : 'Schedule mediation meeting'
        ],
        urgency: language === 'ar' ? 'متوسط' : 'Medium',
        complianceStatus: language === 'ar' ? 'يتطلب مراجعة' : 'Requires Review'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    toast({
      title: language === 'ar' ? 'تم إرسال الاستفسار' : 'Query sent',
      description: language === 'ar' 
        ? 'سيتم الرد على استفسارك القانوني قريباً'
        : 'Your legal query will be answered shortly'
    });
    setChatMessage('');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'minimal': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'significant': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'مستشار قانوني ذكي' : 'AI Legal Consultant'}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {language === 'ar' 
            ? 'أداة شاملة للاستشارة القانونية المدعومة بالذكاء الاصطناعي لفهم قوانين العمل السعودية وتحليل المستندات والمراسلات'
            : 'Comprehensive AI-powered legal consultation tool for understanding Saudi Labor Laws, analyzing documents and communications'
          }
        </p>
        
        {/* HRSD Compliance Badge */}
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <Badge variant="outline" className="text-green-600 border-green-600">
            {language === 'ar' ? 'متوافق مع وزارة الموارد البشرية' : 'HRSD Compliant'}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            {language === 'ar' ? 'المساعد القانوني' : 'Legal Assistant'}
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {language === 'ar' ? 'تحليل المستندات' : 'Document Analysis'}
          </TabsTrigger>
          <TabsTrigger value="cases" className="flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            {language === 'ar' ? 'إدارة القضايا' : 'Case Management'}
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {language === 'ar' ? 'قاعدة المعرفة' : 'Knowledge Base'}
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {language === 'ar' ? 'إدارة الامتثال' : 'Compliance Management'}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {language === 'ar' ? 'التحليلات التنبؤية' : 'Predictive Analytics'}
          </TabsTrigger>
        </TabsList>

        {/* Legal Assistant Tab */}
        <TabsContent value="assistant" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {language === 'ar' ? 'استفسار قانوني' : 'Legal Query Interface'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-muted/10">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Bot className="h-6 w-6 text-primary mt-1" />
                      <div className="bg-primary/10 rounded-lg p-3 flex-1">
                        <p className="text-sm">
                          {language === 'ar' 
                            ? 'مرحباً! أنا مساعدك القانوني الذكي. يمكنني مساعدتك في فهم قوانين العمل السعودية وتحليل المستندات القانونية. كيف يمكنني مساعدتك اليوم؟'
                            : 'Hello! I\'m your AI legal assistant. I can help you understand Saudi Labor Laws and analyze legal documents. How can I assist you today?'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Textarea
                    placeholder={language === 'ar' 
                      ? 'اكتب استفسارك القانوني هنا...'
                      : 'Type your legal query here...'
                    }
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={sendChatMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Legal Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5" />
                  {language === 'ar' ? 'المواضيع القانونية السريعة' : 'Quick Legal Topics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      title: language === 'ar' ? 'عقود العمل' : 'Employment Contracts',
                      icon: FileCheck
                    },
                    { 
                      title: language === 'ar' ? 'ساعات العمل' : 'Working Hours',
                      icon: Clock
                    },
                    { 
                      title: language === 'ar' ? 'الإجازات' : 'Leave Entitlements',
                      icon: Calendar
                    },
                    { 
                      title: language === 'ar' ? 'السلامة المهنية' : 'Workplace Safety',
                      icon: Shield
                    },
                    { 
                      title: language === 'ar' ? 'إنهاء الخدمة' : 'Termination Procedures',
                      icon: AlertTriangle
                    },
                    { 
                      title: language === 'ar' ? 'تسوية النزاعات' : 'Dispute Resolution',
                      icon: Gavel
                    },
                    { 
                      title: language === 'ar' ? 'متطلبات السعودة' : 'Saudization Requirements',
                      icon: Users
                    },
                    { 
                      title: language === 'ar' ? 'حقوق المرأة العاملة' : 'Women\'s Employment Rights',
                      icon: User
                    }
                  ].map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center gap-2 text-xs"
                      onClick={() => setChatMessage(`${language === 'ar' ? 'أخبرني عن' : 'Tell me about'} ${topic.title}`)}
                    >
                      <topic.icon className="h-4 w-4" />
                      {topic.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Document Analysis Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {language === 'ar' ? 'رفع المستندات للتحليل' : 'Document Upload & Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {language === 'ar' ? 'اسحب الملفات هنا أو انقر للرفع' : 'Drag files here or click to upload'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'يدعم ملفات PDF, DOC, DOCX, TXT'
                      : 'Supports PDF, DOC, DOCX, TXT files'
                    }
                  </p>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  className="hidden"
                />

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {language === 'ar' ? 'الملفات المرفوعة:' : 'Uploaded Files:'}
                    </h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm flex-1">{file.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => analyzeDocument(file)}
                        >
                          {language === 'ar' ? 'تحليل' : 'Analyze'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  {language === 'ar' ? 'نتائج التحليل القانوني' : 'Legal Analysis Results'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 animate-pulse text-primary" />
                      <span>{language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}</span>
                    </div>
                    <Progress value={60} />
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {language === 'ar' ? 'نقاط المخاطر القانونية' : 'Legal Risk Score'}
                      </span>
                      <Badge variant={aiAnalysis.riskScore > 70 ? 'destructive' : 'secondary'}>
                        {aiAnalysis.riskScore}%
                      </Badge>
                    </div>
                    
                    <Progress value={aiAnalysis.riskScore} />
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          {language === 'ar' ? 'القضايا القانونية المحددة' : 'Identified Legal Issues'}
                        </h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.legalIssues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {language === 'ar' ? 'التوصيات' : 'Recommendations'}
                        </h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'ar' ? 'ارفع مستندً للحصول على التحليل القانوني' : 'Upload a document to get legal analysis'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Case Management Tab */}
        <TabsContent value="cases" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {language === 'ar' ? 'القضايا القانونية النشطة' : 'Active Legal Cases'}
              </h3>
              <Button>
                {language === 'ar' ? 'إضافة قضية جديدة' : 'Add New Case'}
              </Button>
            </div>
            
            <div className="grid gap-4">
              {sampleCases.map((legalCase) => (
                <Card key={legalCase.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{legalCase.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {legalCase.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {legalCase.date}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={getUrgencyColor(legalCase.urgency)}>
                          {legalCase.urgency}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(legalCase.riskLevel)}`} />
                          <span className="text-xs">{legalCase.riskLevel}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{legalCase.type}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          {language === 'ar' ? 'عرض' : 'View'}
                        </Button>
                        <Button size="sm">
                          {language === 'ar' ? 'إجراء' : 'Action'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder={language === 'ar' 
                    ? 'البحث في قوانين العمل السعودية...'
                    : 'Search Saudi Labor Laws...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'بحث' : 'Search'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: language === 'ar' ? 'قانون العمل السعودي' : 'Saudi Labor Law',
                  articles: 234,
                  icon: Gavel
                },
                {
                  title: language === 'ar' ? 'لوائح وزارة الموارد البشرية' : 'HRSD Regulations',
                  articles: 156,
                  icon: Shield
                },
                {
                  title: language === 'ar' ? 'السوابق القضائية' : 'Case Precedents',
                  articles: 89,
                  icon: BookOpen
                },
                {
                  title: language === 'ar' ? 'أفضل الممارسات' : 'Best Practices',
                  articles: 67,
                  icon: CheckCircle
                }
              ].map((category, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <category.icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h4 className="font-medium mb-2">{category.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.articles} {language === 'ar' ? 'مقال' : 'articles'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Compliance Management Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {language === 'ar' ? 'حالة الامتثال الحالية' : 'Current Compliance Status'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: language === 'ar' ? 'امتثال قانون العمل' : 'Labor Law Compliance', score: 92 },
                    { name: language === 'ar' ? 'السلامة المهنية' : 'Workplace Safety', score: 87 },
                    { name: language === 'ar' ? 'التدريب والتطوير' : 'Training & Development', score: 95 },
                    { name: language === 'ar' ? 'حقوق الموظفين' : 'Employee Rights', score: 89 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.score}%</span>
                      </div>
                      <Progress value={item.score} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {language === 'ar' ? 'تنبيهات الامتثال' : 'Compliance Alerts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      type: 'warning',
                      message: language === 'ar' 
                        ? 'انتهاء صلاحية التدريب على السلامة لـ 5 موظفين'
                        : 'Safety training expires for 5 employees in 7 days'
                    },
                    {
                      type: 'info',
                      message: language === 'ar'
                        ? 'تحديث جديد على لوائح وزارة الموارد البشرية'
                        : 'New update to HRSD regulations available'
                    },
                    {
                      type: 'error',
                      message: language === 'ar'
                        ? 'عدم امتثال في سياسة الإجازات'
                        : 'Non-compliance detected in leave policy'
                    }
                  ].map((alert, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {language === 'ar' ? 'توقع المخاطر القانونية' : 'Legal Risk Prediction'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-yellow-600">23%</div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'احتمالية النزاع القانوني' : 'Litigation probability'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {language === 'ar' ? 'مخاطر الامتثال' : 'Compliance Risk'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">15%</div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مخاطر انتهاك اللوائح' : 'Regulatory violation risk'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {language === 'ar' ? 'التكاليف المتوقعة' : 'Cost Projection'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    {language === 'ar' ? '٥٠,٠٠٠ ريال' : 'SAR 50,000'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'وفورات الوقاية المتوقعة' : 'Prevention savings projection'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalConsultant;