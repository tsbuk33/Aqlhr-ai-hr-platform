import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Database,
  Zap,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { ModuleAnalysisEngine, AnalysisRequest, AnalysisResult } from '@/lib/ai-specialists/ModuleAnalysisEngine';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useToast } from '@/hooks/use-toast';

const moduleOptions = [
  { value: 'core-hr', label: 'Core HR', labelAr: 'الموارد البشرية الأساسية' },
  { value: 'payroll', label: 'Payroll', labelAr: 'كشوف الرواتب' },
  { value: 'recruitment', label: 'Recruitment', labelAr: 'التوظيف' },
  { value: 'performance', label: 'Performance', labelAr: 'إدارة الأداء' },
  { value: 'compliance', label: 'Compliance', labelAr: 'الامتثال' },
  { value: 'analytics', label: 'Analytics', labelAr: 'التحليلات' }
];

const analysisTypes = [
  { value: 'predictive', label: 'Predictive Analysis', labelAr: 'التحليل التنبؤي' },
  { value: 'descriptive', label: 'Descriptive Analysis', labelAr: 'التحليل الوصفي' },
  { value: 'prescriptive', label: 'Prescriptive Analysis', labelAr: 'التحليل التوجيهي' },
  { value: 'diagnostic', label: 'Diagnostic Analysis', labelAr: 'التحليل التشخيصي' },
  { value: 'compliance_check', label: 'Compliance Check', labelAr: 'فحص الامتثال' },
  { value: 'optimization', label: 'Optimization', labelAr: 'التحسين' }
];

const dataScopeOptions = [
  { value: 'all', label: 'All Data', labelAr: 'جميع البيانات' },
  { value: 'employees', label: 'Employee Data', labelAr: 'بيانات الموظفين' },
  { value: 'attendance', label: 'Attendance Data', labelAr: 'بيانات الحضور' },
  { value: 'performance', label: 'Performance Data', labelAr: 'بيانات الأداء' },
  { value: 'payroll', label: 'Payroll Data', labelAr: 'بيانات الرواتب' },
  { value: 'compliance', label: 'Compliance Data', labelAr: 'بيانات الامتثال' }
];

export const LiveAnalysisInterface: React.FC = () => {
  const { isRTL } = useUnifiedLocale();
  const { toast } = useToast();
  
  const [analysisEngine] = useState(new ModuleAnalysisEngine());
  const [request, setRequest] = useState<Partial<AnalysisRequest>>({
    module: '',
    analysisType: '',
    dataScope: ['all'],
    includeWebData: true,
    language: 'both'
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadAnalysisHistory();
  }, []);

  const loadAnalysisHistory = async () => {
    setLoadingHistory(true);
    try {
      const history = await analysisEngine.getAnalysisHistory(undefined, 5);
      setAnalysisHistory(history);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const runAnalysis = async () => {
    if (!request.module || !request.analysisType) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL 
          ? 'يرجى اختيار الوحدة ونوع التحليل'
          : 'Please select module and analysis type',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const result = await analysisEngine.runComprehensiveAnalysis(request as AnalysisRequest);
      
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentResult(result);
      
      toast({
        title: isRTL ? 'تم إكمال التحليل' : 'Analysis Completed',
        description: isRTL 
          ? `تم إنجاز التحليل بواسطة ${result.specialist} بنجاح`
          : `Analysis completed successfully by ${result.specialist}`
      });

      // Reload history
      await loadAnalysisHistory();
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: isRTL ? 'فشل التحليل' : 'Analysis Failed',
        description: isRTL 
          ? 'حدث خطأ أثناء تشغيل التحليل'
          : 'An error occurred while running the analysis',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const exportResults = (result: AnalysisResult) => {
    const exportData = {
      analysis_id: result.id,
      module: result.module,
      specialist: result.specialist,
      analysis_type: result.analysisType,
      timestamp: result.timestamp,
      results: result.results,
      insights: result.insights,
      recommendations: result.recommendations,
      confidence: result.confidence,
      execution_time: result.executionTime
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aqlhr-analysis-${result.module}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          {isRTL ? 'واجهة التحليل المباشر' : 'Live Analysis Interface'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isRTL 
            ? 'تحليل شامل لبيانات الموارد البشرية باستخدام الذكاء الاصطناعي والبيانات الحية من الويب'
            : 'Comprehensive HR data analysis using AI and live web data integration'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {isRTL ? 'إعداد التحليل' : 'Analysis Configuration'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'اختر معايير التحليل المطلوب'
                  : 'Select your analysis parameters'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {isRTL ? 'الوحدة' : 'Module'}
                </label>
                <Select
                  value={request.module}
                  onValueChange={(value) => setRequest(prev => ({ ...prev, module: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر الوحدة' : 'Select Module'} />
                  </SelectTrigger>
                  <SelectContent>
                    {moduleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {isRTL ? option.labelAr : option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {isRTL ? 'نوع التحليل' : 'Analysis Type'}
                </label>
                <Select
                  value={request.analysisType}
                  onValueChange={(value) => setRequest(prev => ({ ...prev, analysisType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر نوع التحليل' : 'Select Analysis Type'} />
                  </SelectTrigger>
                  <SelectContent>
                    {analysisTypes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {isRTL ? option.labelAr : option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {isRTL ? 'نطاق البيانات' : 'Data Scope'}
                </label>
                <div className="space-y-2">
                  {dataScopeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={request.dataScope?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRequest(prev => ({
                              ...prev,
                              dataScope: [...(prev.dataScope || []), option.value]
                            }));
                          } else {
                            setRequest(prev => ({
                              ...prev,
                              dataScope: prev.dataScope?.filter(scope => scope !== option.value)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={option.value} className="text-sm">
                        {isRTL ? option.labelAr : option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeWebData"
                  checked={request.includeWebData}
                  onCheckedChange={(checked) => 
                    setRequest(prev => ({ ...prev, includeWebData: !!checked }))
                  }
                />
                <label htmlFor="includeWebData" className="text-sm">
                  <Globe className="h-4 w-4 inline mr-1" />
                  {isRTL ? 'تضمين البيانات الحية من الويب' : 'Include Live Web Data'}
                </label>
              </div>

              <Separator />

              <Button 
                onClick={runAnalysis}
                disabled={isAnalyzing || !request.module || !request.analysisType}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    {isRTL ? 'جاري التحليل...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    {isRTL ? 'تشغيل التحليل' : 'Run Analysis'}
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    {progress}% {isRTL ? 'مكتمل' : 'Complete'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {currentResult && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {isRTL ? 'نتائج التحليل' : 'Analysis Results'}
                    </CardTitle>
                    <CardDescription>
                      {isRTL 
                        ? `تم بواسطة ${currentResult.specialist} - ${currentResult.confidence * 100}% ثقة`
                        : `By ${currentResult.specialist} - ${currentResult.confidence * 100}% confidence`
                      }
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => exportResults(currentResult)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isRTL ? 'تصدير' : 'Export'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{currentResult.confidence * 100}%</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'معدل الثقة' : 'Confidence'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{currentResult.dataPoints}</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'نقاط البيانات' : 'Data Points'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{currentResult.webDataSources.length}</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'مصادر الويب' : 'Web Sources'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{(currentResult.executionTime / 1000).toFixed(1)}s</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'وقت التنفيذ' : 'Execution Time'}
                    </div>
                  </div>
                </div>

                {/* Insights */}
                {currentResult.insights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {isRTL ? 'الرؤى المستخلصة' : 'Key Insights'}
                    </h3>
                    <div className="space-y-2">
                      {currentResult.insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {currentResult.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      {isRTL ? 'التوصيات' : 'Recommendations'}
                    </h3>
                    <div className="space-y-2">
                      {currentResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Analysis History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {isRTL ? 'سجل التحليلات' : 'Analysis History'}
                </CardTitle>
                <Button
                  onClick={loadAnalysisHistory}
                  variant="outline"
                  size="sm"
                  disabled={loadingHistory}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingHistory ? 'animate-spin' : ''}`} />
                  {isRTL ? 'تحديث' : 'Refresh'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {analysisHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{isRTL ? 'لا يوجد سجل تحليلات حتى الآن' : 'No analysis history yet'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysisHistory.map((analysis) => (
                      <Card key={analysis.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge>{analysis.module}</Badge>
                              <Badge variant="outline">{analysis.analysisType}</Badge>
                            </div>
                            <Button
                              onClick={() => setCurrentResult(analysis)}
                              variant="ghost"
                              size="sm"
                            >
                              {isRTL ? 'عرض' : 'View'}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isRTL ? 'بواسطة' : 'By'} {analysis.specialist} - {new Date(analysis.timestamp).toLocaleString()}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{analysis.confidence * 100}% {isRTL ? 'ثقة' : 'confidence'}</span>
                            <span>{analysis.dataPoints} {isRTL ? 'نقاط بيانات' : 'data points'}</span>
                            <span>{(analysis.executionTime / 1000).toFixed(1)}s</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};