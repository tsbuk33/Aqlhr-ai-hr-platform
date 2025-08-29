import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Brain, 
  MessageCircle,
  Shield,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  Download,
  Settings,
  Eye,
  Target,
  Zap,
  Activity,
  Bot
} from 'lucide-react';
import { useLocale } from '@/i18n/locale';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AqlHRAIAssistant from '@/components/ai/AqlHRAIAssistant';
import PolicyRiskPanel from '@/features/policy-intel/components/PolicyRiskPanel';

interface PolicyAssessment {
  id: string;
  policyName: string;
  uploadDate: Date;
  status: 'pending' | 'in-review' | 'compliant' | 'non-compliant';
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  gaps: string[];
  recommendations: string[];
  lastReviewed?: Date;
}

interface ComplianceMetrics {
  totalPolicies: number;
  compliantPolicies: number;
  pendingReviews: number;
  averageScore: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

const PolicyIntelligencePage: React.FC = () => {
  const { locale, t } = useLocale();
  const isArabic = locale === 'ar';
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Assistant state
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>('');
  
  // Policy management state
  const [policies, setPolicies] = useState<PolicyAssessment[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    totalPolicies: 0,
    compliantPolicies: 0,
    pendingReviews: 0,
    averageScore: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 }
  });
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyAssessment | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auto-open assistant based on URL parameter
  useEffect(() => {
    const shouldAutoOpen = searchParams.get('ask') === '1';
    if (shouldAutoOpen) {
      setAssistantOpen(true);
    }
  }, [searchParams]);
  
  // Get company ID from auth
  useEffect(() => {
    const getCompanyId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Try to get company ID from user metadata or make a query
          const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', user.id)
            .single();
          
          setCompanyId(profile?.company_id || 'demo-company-id');
        }
      } catch (error) {
        console.error('Error getting company ID:', error);
        setCompanyId('demo-company-id');
      }
    };
    
    getCompanyId();
  }, []);
  
  // Load sample policy data
  useEffect(() => {
    const samplePolicies: PolicyAssessment[] = [
      {
        id: 'pol-001',
        policyName: isArabic ? 'سياسة الموارد البشرية العامة' : 'General HR Policy',
        uploadDate: new Date('2024-01-15'),
        status: 'compliant',
        complianceScore: 92,
        riskLevel: 'low',
        gaps: [],
        recommendations: [
          isArabic ? 'تحديث المراجعة السنوية' : 'Update annual review process',
          isArabic ? 'تحسين التوثيق' : 'Improve documentation'
        ],
        lastReviewed: new Date('2024-01-20')
      },
      {
        id: 'pol-002', 
        policyName: isArabic ? 'سياسة الأمان والصحة المهنية' : 'Health & Safety Policy',
        uploadDate: new Date('2024-02-10'),
        status: 'non-compliant',
        complianceScore: 68,
        riskLevel: 'high',
        gaps: [
          isArabic ? 'نقص في إجراءات الطوارئ' : 'Missing emergency procedures',
          isArabic ? 'عدم وجود تدريب إلزامي' : 'No mandatory training program'
        ],
        recommendations: [
          isArabic ? 'إضافة خطة طوارئ شاملة' : 'Add comprehensive emergency plan',
          isArabic ? 'تنفيذ برنامج تدريب شهري' : 'Implement monthly training program'
        ]
      },
      {
        id: 'pol-003',
        policyName: isArabic ? 'سياسة مكافحة التحرش' : 'Anti-Harassment Policy', 
        uploadDate: new Date('2024-03-05'),
        status: 'in-review',
        complianceScore: 85,
        riskLevel: 'medium',
        gaps: [
          isArabic ? 'تحديث آلية التبليغ' : 'Update reporting mechanism'
        ],
        recommendations: [
          isArabic ? 'إضافة قنوات تبليغ متعددة' : 'Add multiple reporting channels',
          isArabic ? 'تحسين آلية التحقيق' : 'Improve investigation process'
        ]
      }
    ];
    
    setPolicies(samplePolicies);
    
    // Calculate metrics
    const compliant = samplePolicies.filter(p => p.status === 'compliant').length;
    const pending = samplePolicies.filter(p => p.status === 'pending' || p.status === 'in-review').length;
    const avgScore = samplePolicies.reduce((sum, p) => sum + p.complianceScore, 0) / samplePolicies.length;
    const riskDist = samplePolicies.reduce((acc, p) => {
      acc[p.riskLevel]++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });
    
    setMetrics({
      totalPolicies: samplePolicies.length,
      compliantPolicies: compliant,
      pendingReviews: pending,
      averageScore: Math.round(avgScore),
      riskDistribution: riskDist
    });
  }, [isArabic]);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Simulate upload and analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newPolicy: PolicyAssessment = {
        id: `pol-${Date.now()}`,
        policyName: file.name.replace(/\.[^/.]+$/, ""),
        uploadDate: new Date(),
        status: 'pending',
        complianceScore: 0,
        riskLevel: 'medium',
        gaps: [],
        recommendations: []
      };
      
      setPolicies(prev => [newPolicy, ...prev]);
      
      toast({
        title: isArabic ? 'تم الرفع بنجاح' : 'Upload Successful',
        description: isArabic ? 'تم رفع الملف وسيتم تحليله قريباً' : 'File uploaded and will be analyzed shortly'
      });
    } catch (error) {
      toast({
        title: isArabic ? 'خطأ في الرفع' : 'Upload Error',
        description: isArabic ? 'حدث خطأ أثناء رفع الملف' : 'An error occurred while uploading the file',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const getStatusColor = (status: PolicyAssessment['status']) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'non-compliant': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getRiskColor = (risk: PolicyAssessment['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const getStatusText = (status: PolicyAssessment['status']) => {
    const statusMap = {
      'compliant': { ar: 'متوافق', en: 'Compliant' },
      'non-compliant': { ar: 'غير متوافق', en: 'Non-Compliant' },
      'in-review': { ar: 'قيد المراجعة', en: 'In Review' },
      'pending': { ar: 'في الانتظار', en: 'Pending' }
    };
    
    return statusMap[status][isArabic ? 'ar' : 'en'];
  };
  
  const getRiskText = (risk: PolicyAssessment['riskLevel']) => {
    const riskMap = {
      'low': { ar: 'منخفض', en: 'Low' },
      'medium': { ar: 'متوسط', en: 'Medium' },
      'high': { ar: 'عالي', en: 'High' }
    };
    
    return riskMap[risk][isArabic ? 'ar' : 'en'];
  };
  
  const formatNumber = (num: number) => {
    if (isArabic) {
      // Convert to Arabic-Indic numerals
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return num.toString().replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
    }
    return num.toString();
  };
  
  const formatDate = (date: Date) => {
    if (isArabic) {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        calendar: 'gregory' // Use Gregorian calendar as specified
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const filteredPolicies = policies.filter(policy =>
    policy.policyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-background ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isArabic ? 'ذكاء السياسات والامتثال' : 'Policy Intelligence & Compliance'}
                </h1>
                <p className="text-muted-foreground">
                  {isArabic 
                    ? 'تحليل وتقييم السياسات التنظيمية باستخدام الذكاء الاصطناعي' 
                    : 'AI-powered policy analysis and regulatory compliance assessment'}
                </p>
              </div>
            </div>
            
            {/* Ask Aql Button */}
            <Sheet open={assistantOpen} onOpenChange={setAssistantOpen}>
              <SheetTrigger asChild>
                <Button className="gap-2" data-testid="ai-assistant-trigger">
                  <Bot className="h-4 w-4" />
                  {isArabic ? 'اسأل عقل' : 'Ask Aql'}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={isArabic ? 'left' : 'right'} 
                className="w-full sm:max-w-2xl p-0"
                data-testid="module-context"
              >
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {isArabic ? 'مساعد ذكاء السياسات' : 'Policy Intelligence Assistant'}
                  </SheetTitle>
                  <SheetDescription>
                    {isArabic 
                      ? 'احصل على مساعدة ذكية في تحليل السياسات وضمان الامتثال' 
                      : 'Get intelligent assistance with policy analysis and compliance assurance'}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="h-full">
                  <AqlHRAIAssistant 
                    moduleContext="policy"
                    companyId={companyId}
                    lang={locale}
                    open={assistantOpen}
                    onOpenChange={setAssistantOpen}
                    position="static"
                    className="h-full border-0 rounded-none"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content - Policy Risk Analysis */}
          <div className="xl:col-span-3 space-y-6">
            {/* Policy Risk Intelligence Panel */}
            <PolicyRiskPanel />
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'إجمالي السياسات' : 'Total Policies'}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(metrics.totalPolicies)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'السياسات المتوافقة' : 'Compliant Policies'}
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatNumber(metrics.compliantPolicies)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'في الانتظار' : 'Pending Reviews'}
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{formatNumber(metrics.pendingReviews)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'متوسط النقاط' : 'Average Score'}
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{formatNumber(metrics.averageScore)}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Policy Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {isArabic ? 'رفع سياسة جديدة' : 'Upload New Policy'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policy-file">{isArabic ? 'ملف السياسة' : 'Policy File'}</Label>
                    <Input
                      id="policy-file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="policy-name">{isArabic ? 'اسم السياسة' : 'Policy Name'}</Label>
                    <Input
                      id="policy-name"
                      placeholder={isArabic ? 'أدخل اسم السياسة' : 'Enter policy name'}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button disabled={isUploading} className="w-full md:w-auto">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isArabic ? 'جاري الرفع...' : 'Uploading...'}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {isArabic ? 'رفع وتحليل' : 'Upload & Analyze'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Policy Management Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{isArabic ? 'إدارة السياسات التقليدية' : 'Traditional Policy Management'}</CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {isArabic ? 'عرض جميع السياسات' : 'View All Policies'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {isArabic ? 'إجمالي السياسات' : 'Total Policies'}
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(metrics.totalPolicies)}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {isArabic ? 'السياسات المتوافقة' : 'Compliant Policies'}
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{formatNumber(metrics.compliantPolicies)}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {isArabic ? 'في الانتظار' : 'Pending Reviews'}
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">{formatNumber(metrics.pendingReviews)}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {isArabic ? 'متوسط النقاط' : 'Average Score'}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{formatNumber(metrics.averageScore)}%</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - AI Assistant */}
          <div className="xl:col-span-1 space-y-6">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{isArabic ? 'توزيع المخاطر' : 'Risk Distribution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{isArabic ? 'منخفض' : 'Low'}</span>
                    <span className="text-sm font-medium text-green-600">{formatNumber(metrics.riskDistribution.low)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{isArabic ? 'متوسط' : 'Medium'}</span>
                    <span className="text-sm font-medium text-yellow-600">{formatNumber(metrics.riskDistribution.medium)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{isArabic ? 'عالي' : 'High'}</span>
                    <span className="text-sm font-medium text-red-600">{formatNumber(metrics.riskDistribution.high)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Policy Details */}
            {selectedPolicy && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{isArabic ? 'تفاصيل السياسة' : 'Policy Details'}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPolicy(null)}>
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">{selectedPolicy.policyName}</h4>
                    <Badge className={getStatusColor(selectedPolicy.status)} variant="outline">
                      {getStatusText(selectedPolicy.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{isArabic ? 'النقاط:' : 'Score:'}</span>
                      <div className="font-medium">{formatNumber(selectedPolicy.complianceScore)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{isArabic ? 'المخاطر:' : 'Risk:'}</span>
                      <div className={`font-medium ${getRiskColor(selectedPolicy.riskLevel)}`}>
                        {getRiskText(selectedPolicy.riskLevel)}
                      </div>
                    </div>
                  </div>
                  
                  {selectedPolicy.recommendations.length > 0 && (
                    <div>
                      <h5 className="font-medium text-sm mb-2">{isArabic ? 'التوصيات:' : 'Recommendations:'}</h5>
                      <ul className="text-sm space-y-1">
                        {selectedPolicy.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 mt-1 text-blue-600 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button className="w-full gap-2" onClick={() => setAssistantOpen(true)}>
                    <Brain className="h-4 w-4" />
                    {isArabic ? 'تحليل بالذكاء الاصطناعي' : 'AI Analysis'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{isArabic ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Upload className="h-4 w-4" />
                  {isArabic ? 'رفع سياسة جماعي' : 'Batch Upload Policies'}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  {isArabic ? 'تصدير التقرير' : 'Export Report'}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  {isArabic ? 'إعدادات الامتثال' : 'Compliance Settings'}
                </Button>
                <Button 
                  variant="default" 
                  className="w-full justify-start gap-2"
                  onClick={() => setAssistantOpen(true)}
                >
                  <MessageCircle className="h-4 w-4" />
                  {isArabic ? 'اسأل مساعد السياسات' : 'Ask Policy Assistant'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyIntelligencePage;