import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Eye,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { ResultAuditor, AuditResult, AuditIssue, CrossModuleValidation } from '@/lib/ai-specialists/ResultAuditor';
import { ExecutionPlan } from '@/lib/ai-specialists/QueryPlanner';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface ResultAuditorInterfaceProps {
  executionPlan: ExecutionPlan;
  onReplanningNeeded: (strategy: any) => void;
  onAuditComplete: (results: any) => void;
}

export const ResultAuditorInterface: React.FC<ResultAuditorInterfaceProps> = ({
  executionPlan,
  onReplanningNeeded,
  onAuditComplete
}) => {
  const { isArabic } = useSimpleLanguage();
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [crossModuleValidations, setCrossModuleValidations] = useState<CrossModuleValidation[]>([]);
  const [overallQuality, setOverallQuality] = useState<number>(0);
  const [needsReplanning, setNeedsReplanning] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  const auditor = ResultAuditor.getInstance();

  const handleStartAudit = async () => {
    setIsAuditing(true);
    try {
      const results = await auditor.auditExecutionPlan(executionPlan);
      
      setAuditResults(results.auditResults);
      setCrossModuleValidations(results.crossModuleValidations);
      setOverallQuality(results.overallQuality);
      setNeedsReplanning(results.needsReplanning);
      setRecommendations(results.recommendations);
      setAuditComplete(true);
      
      onAuditComplete(results);

      // If replanning is needed, generate strategy
      if (results.needsReplanning) {
        const strategy = await auditor.generateReplanningStrategy(executionPlan, results.auditResults);
        onReplanningNeeded(strategy);
      }
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getSeverityIcon = (severity: AuditIssue['severity']) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityVariant = (severity: AuditIssue['severity']): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getOverallStatusIcon = () => {
    if (overallQuality >= 80) return <ThumbsUp className="w-6 h-6 text-green-500" />;
    if (needsReplanning) return <RefreshCw className="w-6 h-6 text-orange-500" />;
    return <ThumbsDown className="w-6 h-6 text-red-500" />;
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Audit Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {isArabic ? 'مراجع جودة النتائج' : 'Result Quality Auditor'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Eye className="w-4 h-4" />
              <AlertDescription>
                {isArabic 
                  ? 'سيتم مراجعة جودة واتساق نتائج جميع الأدوات والوحدات'
                  : 'All tool and module results will be reviewed for quality and consistency'
                }
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleStartAudit}
              disabled={isAuditing || auditComplete}
              className="w-full flex items-center gap-2"
            >
              {isAuditing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isArabic ? 'جاري المراجعة...' : 'Auditing...'}
                </>
              ) : auditComplete ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {isArabic ? 'اكتملت المراجعة' : 'Audit Complete'}
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  {isArabic ? 'بدء مراجعة الجودة' : 'Start Quality Audit'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Audit Results */}
      {auditComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getOverallStatusIcon()}
                {isArabic ? 'النتائج الإجمالية' : 'Overall Results'}
              </div>
              <Badge variant={getQualityVariant(overallQuality)}>
                {Math.round(overallQuality)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{auditResults.length}</div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'خطوات مراجعة' : 'Steps Audited'}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getQualityColor(overallQuality)}`}>
                  {Math.round(overallQuality)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'الجودة الإجمالية' : 'Overall Quality'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {auditResults.filter(r => r.needsReplanning).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'تحتاج إعادة تخطيط' : 'Need Replanning'}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {isArabic ? 'مستوى الجودة' : 'Quality Level'}
                </span>
                <span className={`text-sm ${getQualityColor(overallQuality)}`}>
                  {overallQuality >= 80 
                    ? (isArabic ? 'ممتاز' : 'Excellent')
                    : overallQuality >= 60 
                    ? (isArabic ? 'مقبول' : 'Acceptable')
                    : (isArabic ? 'يحتاج تحسين' : 'Needs Improvement')
                  }
                </span>
              </div>
              <Progress value={overallQuality} className="w-full" />
            </div>

            {needsReplanning && (
              <Alert className="border-orange-200 bg-orange-50">
                <RefreshCw className="w-4 h-4" />
                <AlertDescription className="text-orange-700">
                  {isArabic 
                    ? 'تحتاج بعض النتائج إلى إعادة تخطيط وتصحيح'
                    : 'Some results require replanning and correction'
                  }
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Individual Step Audits */}
      {auditResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {isArabic ? 'تفاصيل مراجعة الخطوات' : 'Step Audit Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditResults.map((audit) => (
                <div 
                  key={audit.id}
                  className={`p-4 border rounded-lg ${
                    audit.needsReplanning ? 'border-orange-200 bg-orange-50' :
                    audit.overallScore >= 80 ? 'border-green-200 bg-green-50' :
                    'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getQualityIcon(audit.overallScore)}
                      <div>
                        <h4 className="font-medium">{audit.tool}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{audit.module}</span>
                          <span>•</span>
                          <span>{isArabic ? 'بواسطة' : 'by'} {audit.auditor}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getQualityVariant(audit.overallScore)}>
                      {Math.round(audit.overallScore)}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getQualityColor(audit.qualityScore)}`}>
                        {Math.round(audit.qualityScore)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isArabic ? 'الجودة' : 'Quality'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getQualityColor(audit.consistencyScore)}`}>
                        {Math.round(audit.consistencyScore)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isArabic ? 'الاتساق' : 'Consistency'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getQualityColor(audit.accuracyScore)}`}>
                        {Math.round(audit.accuracyScore)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isArabic ? 'الدقة' : 'Accuracy'}
                      </div>
                    </div>
                  </div>

                  {audit.issues.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">
                        {isArabic ? 'القضايا المحددة:' : 'Identified Issues:'}
                      </h5>
                      {audit.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-white rounded border">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getSeverityVariant(issue.severity)} className="text-xs">
                                {issue.severity}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {issue.type}
                              </span>
                            </div>
                            <p className="text-sm">{issue.description}</p>
                            <p className="text-xs text-green-600 mt-1">
                              <strong>{isArabic ? 'الحل المقترح:' : 'Suggested Fix:'}</strong> {issue.suggestedFix}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {audit.recommendations.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">
                        {isArabic ? 'التوصيات:' : 'Recommendations:'}
                      </h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {audit.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross-Module Validations */}
      {crossModuleValidations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {isArabic ? 'التحقق من اتساق الوحدات' : 'Cross-Module Validation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crossModuleValidations.map((validation, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {validation.modules.join(' ↔ ')}
                      </span>
                    </div>
                    <Badge variant={validation.actualConsistency >= 80 ? 'default' : 'destructive'}>
                      {Math.round(validation.actualConsistency)}%
                    </Badge>
                  </div>

                  {validation.contradictions.length > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-red-700">
                        <strong>{isArabic ? 'التناقضات:' : 'Contradictions:'}</strong>
                        <ul className="list-disc list-inside mt-1">
                          {validation.contradictions.map((contradiction, i) => (
                            <li key={i}>{contradiction}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                    <strong>{isArabic ? 'استراتيجية الحل:' : 'Resolution Strategy:'}</strong> {validation.resolutionStrategy}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {isArabic ? 'التوصيات العامة' : 'Overall Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};