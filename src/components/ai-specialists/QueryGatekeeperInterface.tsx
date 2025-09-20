import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { QueryGatekeeper, QueryValidationResult, ClarificationRequest } from '@/lib/ai-specialists/QueryGatekeeper';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface QueryGatekeeperInterfaceProps {
  onValidQuery: (query: string, module?: string) => void;
  onClarificationNeeded: (clarification: ClarificationRequest) => void;
}

export const QueryGatekeeperInterface: React.FC<QueryGatekeeperInterfaceProps> = ({
  onValidQuery,
  onClarificationNeeded
}) => {
  const { isArabic } = useSimpleLanguage();
  const [query, setQuery] = useState('');
  const [validationResult, setValidationResult] = useState<QueryValidationResult | null>(null);
  const [clarificationRequest, setClarificationRequest] = useState<ClarificationRequest | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const gatekeeper = QueryGatekeeper.getInstance();

  const handleValidateQuery = async () => {
    if (!query.trim()) return;

    setIsValidating(true);
    try {
      const result = await gatekeeper.validateQuery(query);
      setValidationResult(result);

      if (result.isValid) {
        onValidQuery(query, result.targetModule);
        setQuery('');
        setValidationResult(null);
      } else {
        const clarification = gatekeeper.generateClarificationRequest(query, result);
        setClarificationRequest(clarification);
        onClarificationNeeded(clarification);
      }
    } catch (error) {
      console.error('Query validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setClarificationRequest(null);
    setValidationResult(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {isArabic ? 'بوابة التحقق من الاستفسارات' : 'Query Validation Gateway'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isArabic 
                ? 'اكتب استفسارك هنا... سيتم التحقق من وضوحه وتحديده قبل المعالجة'
                : 'Enter your query here... It will be validated for clarity and specificity before processing'
              }
              className="flex-1"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleValidateQuery}
              disabled={!query.trim() || isValidating}
              className="flex items-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isArabic ? 'جاري التحقق...' : 'Validating...'}
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  {isArabic ? 'تحقق من الاستفسار' : 'Validate Query'}
                </>
              )}
            </Button>
          </div>

          {validationResult && !validationResult.isValid && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                {isArabic 
                  ? 'يحتاج استفسارك إلى مزيد من التوضيح. يرجى مراجعة التفاصيل أدناه.'
                  : 'Your query needs clarification. Please review the details below.'
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              {isArabic ? 'نتائج التحقق' : 'Validation Results'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm font-medium">
                  {isArabic ? 'الوضوح' : 'Clarity'}
                </span>
                <Progress value={validationResult.clarity} className="w-full" />
                <Badge variant={getScoreBadgeVariant(validationResult.clarity)}>
                  {validationResult.clarity}%
                </Badge>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm font-medium">
                  {isArabic ? 'التحديد' : 'Specificity'}
                </span>
                <Progress value={validationResult.specificity} className="w-full" />
                <Badge variant={getScoreBadgeVariant(validationResult.specificity)}>
                  {validationResult.specificity}%
                </Badge>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm font-medium">
                  {isArabic ? 'الثقة' : 'Confidence'}
                </span>
                <Progress value={validationResult.confidence} className="w-full" />
                <Badge variant={getScoreBadgeVariant(validationResult.confidence)}>
                  {validationResult.confidence}%
                </Badge>
              </div>
            </div>

            {validationResult.targetModule && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {isArabic ? 'الوحدة المحددة:' : 'Target Module:'}
                </span>
                <Badge variant="outline">{validationResult.targetModule}</Badge>
              </div>
            )}

            {validationResult.missingContext && validationResult.missingContext.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {isArabic ? 'السياق المفقود:' : 'Missing Context:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {validationResult.missingContext.map((context, index) => (
                    <Badge key={index} variant="destructive">{context}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {clarificationRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {isArabic ? 'اقتراحات للتوضيح' : 'Clarification Suggestions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clarificationRequest.issues.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {isArabic ? 'القضايا المحددة:' : 'Identified Issues:'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {clarificationRequest.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {clarificationRequest.suggestedQuestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {isArabic ? 'أسئلة مقترحة:' : 'Suggested Questions:'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {clarificationRequest.suggestedQuestions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}

            {clarificationRequest.examples.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {isArabic ? 'أمثلة جيدة:' : 'Good Examples:'}
                </h4>
                <div className="space-y-2">
                  {clarificationRequest.examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleExampleClick(example)}
                    >
                      <p className="text-sm">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};