import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Upload, 
  FileText, 
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useLocale } from '@/i18n/locale';
import { useToast } from '@/hooks/use-toast';
import { 
  analyzePolicy, 
  PolicyRiskResult, 
  ProgressEvent,
  getPolicyAssessments
} from '../api/analyzePolicy';
import RiskScoreCard from './RiskScoreCard';
import RiskMatrixHeatmap from './RiskMatrixHeatmap';
import MitigationCard from './MitigationCard';

interface PolicyRiskPanelProps {
  className?: string;
}

type SourceType = 'upload' | 'paste';

const PolicyRiskPanel: React.FC<PolicyRiskPanelProps> = ({ className = '' }) => {
  const { locale } = useLocale();
  const { toast } = useToast();
  const isArabic = locale === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [sourceType, setSourceType] = useState<SourceType>('upload');
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [policyText, setPolicyText] = useState('');
  const [policyTitle, setPolicyTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<ProgressEvent['phase'] | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [result, setResult] = useState<PolicyRiskResult | null>(null);
  const [recentAssessments, setRecentAssessments] = useState<PolicyRiskResult[]>([]);
  const [showCitations, setShowCitations] = useState(false);
  
  // Progress messages mapping
  const progressMessages = {
    embedding: { 
      ar: 'إعداد التضمين النصي...', 
      en: 'Preparing embeddings...' 
    },
    retrieval: { 
      ar: 'استرجاع الأدلة ذات الصلة...', 
      en: 'Retrieving evidence...' 
    },
    analysis: { 
      ar: 'تحليل المخاطر...', 
      en: 'Analyzing risks...' 
    },
    mitigation: { 
      ar: 'بناء استراتيجيات التخفيف...', 
      en: 'Building mitigations...' 
    },
    done: { 
      ar: 'اكتمل التحليل', 
      en: 'Completed' 
    }
  };
  
  // Load recent assessments on mount
  React.useEffect(() => {
    loadRecentAssessments();
  }, []);
  
  const loadRecentAssessments = async () => {
    try {
      const assessments = await getPolicyAssessments(5);
      setRecentAssessments(assessments);
    } catch (error) {
      console.error('Failed to load recent assessments:', error);
    }
  };
  
  // Handle progress updates
  const handleProgress = (event: ProgressEvent) => {
    setCurrentPhase(event.phase);
    setCurrentMessage(event.message);
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf' && 
        !file.type.includes('document') && 
        file.type !== 'text/plain') {
      toast({
        title: isArabic ? 'نوع ملف غير مدعوم' : 'Unsupported File Type',
        description: isArabic 
          ? 'يرجى رفع ملف PDF أو Word أو نص' 
          : 'Please upload a PDF, Word document, or text file',
        variant: 'destructive'
      });
      return;
    }
    
    // Here you would integrate with your document upload system
    // For now, we'll simulate reading text content
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setPolicyText(content);
        setPolicyTitle(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsText(file);
    } else {
      toast({
        title: isArabic ? 'معالجة الملف' : 'Processing File',
        description: isArabic 
          ? 'يتم معالجة الملف، سيكون متاحاً في قائمة المستندات قريباً' 
          : 'File is being processed and will be available in documents list soon',
      });
    }
  };
  
  // Handle analysis
  const handleAnalyze = async () => {
    if (!policyText.trim() && !selectedDocId) {
      toast({
        title: isArabic ? 'مطلوب نص السياسة' : 'Policy Text Required',
        description: isArabic 
          ? 'يرجى إدخال نص السياسة أو اختيار مستند مرفوع' 
          : 'Please enter policy text or select an uploaded document',
        variant: 'destructive'
      });
      return;
    }
    
    setIsAnalyzing(true);
    setCurrentPhase('embedding');
    setResult(null);
    
    try {
      const analysisResult = await analyzePolicy(
        {
          policyDocId: selectedDocId || undefined,
          text: policyText.trim() || undefined,
          title: policyTitle.trim() || 'Untitled Policy',
          tags,
          stream: true
        },
        handleProgress
      );
      
      setResult(analysisResult);
      setCurrentPhase('done');
      
      // Refresh recent assessments
      loadRecentAssessments();
      
      toast({
        title: isArabic ? 'تم التحليل بنجاح' : 'Analysis Complete',
        description: isArabic 
          ? 'تم تحليل السياسة وتقييم المخاطر بنجاح' 
          : 'Policy has been successfully analyzed and risks assessed',
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: isArabic ? 'خطأ في التحليل' : 'Analysis Failed',
        description: isArabic 
          ? 'حدث خطأ أثناء تحليل السياسة. يرجى المحاولة مرة أخرى.' 
          : 'An error occurred during policy analysis. Please try again.',
        variant: 'destructive'
      });
      setCurrentPhase(null);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Get progress percentage
  const getProgressPercentage = () => {
    if (!currentPhase) return 0;
    const phases: Record<ProgressEvent['phase'], number> = {
      embedding: 20,
      retrieval: 40,
      analysis: 70,
      mitigation: 90,
      done: 100
    };
    return phases[currentPhase] || 0;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isArabic) {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        calendar: 'gregory'
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Source Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {isArabic ? 'تحليل مخاطر السياسة' : 'Policy Risk Analysis'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={sourceType} onValueChange={(value) => setSourceType(value as SourceType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isArabic ? 'مستند مرفوع' : 'Use uploaded document'}
              </TabsTrigger>
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {isArabic ? 'لصق النص' : 'Paste policy text'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{isArabic ? 'اختيار مستند' : 'Select Document'}</Label>
                <Select value={selectedDocId} onValueChange={setSelectedDocId}>
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? 'اختر مستنداً مرفوعاً' : 'Choose an uploaded document'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo-policy-1">
                      {isArabic ? 'سياسة الموارد البشرية العامة' : 'General HR Policy'}
                    </SelectItem>
                    <SelectItem value="demo-policy-2">
                      {isArabic ? 'سياسة الأمان والصحة المهنية' : 'Health & Safety Policy'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-center p-4 border-2 border-dashed rounded-lg">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isArabic ? 'رفع مستند جديد' : 'Upload New Document'}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  {isArabic ? 'PDF، Word أو ملف نصي (حد أقصى 10 ميجابايت)' : 'PDF, Word, or text file (max 10MB)'}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="paste" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="policy-title">
                  {isArabic ? 'عنوان السياسة' : 'Policy Title'}
                </Label>
                <Input
                  id="policy-title"
                  value={policyTitle}
                  onChange={(e) => setPolicyTitle(e.target.value)}
                  placeholder={isArabic ? 'أدخل عنوان السياسة' : 'Enter policy title'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policy-text">
                  {isArabic ? 'نص السياسة' : 'Policy Text'}
                </Label>
                <Textarea
                  id="policy-text"
                  value={policyText}
                  onChange={(e) => setPolicyText(e.target.value)}
                  placeholder={isArabic ? 'الصق نص السياسة هنا...' : 'Paste policy text here...'}
                  rows={8}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Analysis Button */}
          <div className="flex items-center gap-4 mt-6">
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {progressMessages[currentPhase || 'embedding'][isArabic ? 'ar' : 'en']}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {isArabic ? 'تحليل السياسة' : 'Analyze Policy'}
                </>
              )}
            </Button>
            
            {isAnalyzing && (
              <div className="flex-1">
                <Progress value={getProgressPercentage()} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {currentMessage || progressMessages[currentPhase || 'embedding'][isArabic ? 'ar' : 'en']}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <RiskScoreCard
            title={isArabic ? 'النقاط الإجمالية للمخاطر' : 'Overall Risk Score'}
            score={result.scores.overall}
            subtitle={isArabic ? 'تقييم شامل للمخاطر عبر جميع العائلات' : 'Comprehensive risk assessment across all families'}
            variant="overall"
          />
          
          {/* Risk Family Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RiskScoreCard
              title={isArabic ? 'مخاطر الامتثال' : 'Compliance Risk'}
              score={{
                value: (result.scores.complianceRisk.saudiLaborLaw.value + 
                       result.scores.complianceRisk.hrsdRequirements.value + 
                       result.scores.complianceRisk.internationalStandards.value + 
                       result.scores.complianceRisk.futureRegulations.value) / 4,
                confidence: (result.scores.complianceRisk.saudiLaborLaw.confidence + 
                           result.scores.complianceRisk.hrsdRequirements.confidence + 
                           result.scores.complianceRisk.internationalStandards.confidence + 
                           result.scores.complianceRisk.futureRegulations.confidence) / 4
              }}
            />
            
            <RiskScoreCard
              title={isArabic ? 'المخاطر التجارية' : 'Business Risk'}
              score={{
                value: (result.scores.businessRisk.financialImpact.value + 
                       result.scores.businessRisk.operationalRisk.value + 
                       result.scores.businessRisk.reputationalRisk.value + 
                       result.scores.businessRisk.competitiveRisk.value) / 4,
                confidence: (result.scores.businessRisk.financialImpact.confidence + 
                           result.scores.businessRisk.operationalRisk.confidence + 
                           result.scores.businessRisk.reputationalRisk.confidence + 
                           result.scores.businessRisk.competitiveRisk.confidence) / 4
              }}
            />
            
            <RiskScoreCard
              title={isArabic ? 'مخاطر التنفيذ' : 'Implementation Risk'}
              score={{
                value: (result.scores.implementationRisk.resourceRequirements.value + 
                       result.scores.implementationRisk.changeManagement.value + 
                       result.scores.implementationRisk.trainingNeeds.value + 
                       result.scores.implementationRisk.technologyIntegration.value) / 4,
                confidence: (result.scores.implementationRisk.resourceRequirements.confidence + 
                           result.scores.implementationRisk.changeManagement.confidence + 
                           result.scores.implementationRisk.trainingNeeds.confidence + 
                           result.scores.implementationRisk.technologyIntegration.confidence) / 4
              }}
            />
          </div>
          
          {/* Risk Matrix Heatmap */}
          <RiskMatrixHeatmap 
            scores={result.scores} 
            scoreDetails={result.score_details}
          />
          
          {/* Mitigations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {isArabic ? 'استراتيجيات التخفيف' : 'Mitigation Strategies'}
                </CardTitle>
                <Badge variant="secondary">
                  {isArabic ? 
                    result.mitigations.length.toString().replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][parseInt(d)]) :
                    result.mitigations.length
                  } {isArabic ? 'استراتيجية' : 'strategies'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {result.mitigations.map((mitigation, index) => (
                  <MitigationCard
                    key={index}
                    mitigation={mitigation}
                    citations={result.citations}
                    policyTitle={result.policy_source.title || 'Policy'}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Citations */}
          {result.citations.length > 0 && (
            <Collapsible open={showCitations} onOpenChange={setShowCitations}>
              <Card>
                <CardHeader>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {isArabic ? 'المراجع والاستشهادات' : 'Citations & References'}
                        <Badge variant="outline">
                          {isArabic ? 
                            result.citations.length.toString().replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][parseInt(d)]) :
                            result.citations.length
                          }
                        </Badge>
                      </CardTitle>
                      {showCitations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </CardHeader>
                
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-3">
                      {result.citations.map((citation, index) => (
                        <div key={citation.doc_id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm">{citation.snippet}</p>
                              {citation.page && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {isArabic ? 'الصفحة:' : 'Page:'} {
                                    isArabic ? 
                                      citation.page.toString().replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][parseInt(d)]) :
                                      citation.page
                                  }
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {Math.round(citation.score * 100)}%
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}
        </div>
      )}
      
      {/* Recent Assessments */}
      {recentAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {isArabic ? 'التقييمات الأخيرة' : 'Recent Assessments'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {recentAssessments.map((assessment) => (
                <div key={assessment.request_id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <h4 className="font-medium text-sm">{assessment.policy_source.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(assessment.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskScoreCard
                      title=""
                      score={assessment.scores.overall}
                      variant="compact"
                      className="border-0"
                    />
                    <Button variant="ghost" size="sm" onClick={() => setResult(assessment)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PolicyRiskPanel;