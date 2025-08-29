import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Target,
  FileText,
  ExternalLink,
  Plus
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLocale } from '@/i18n/locale';
import { useToast } from '@/hooks/use-toast';
import { PolicyRiskResult, createMitigationTask, formatRiskScore } from '../api/analyzePolicy';

interface MitigationCardProps {
  mitigation: PolicyRiskResult['mitigations'][0];
  citations?: PolicyRiskResult['citations'];
  policyTitle: string;
  className?: string;
}

const MitigationCard: React.FC<MitigationCardProps> = ({
  mitigation,
  citations = [],
  policyTitle,
  className = ''
}) => {
  const { locale } = useLocale();
  const { toast } = useToast();
  const isArabic = locale === 'ar';
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  // Get badge variant based on level
  const getBadgeVariant = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };
  
  // Get level text in current language
  const getLevelText = (level: 'low' | 'medium' | 'high') => {
    const levelMap = {
      low: { ar: 'منخفض', en: 'Low' },
      medium: { ar: 'متوسط', en: 'Medium' }, 
      high: { ar: 'عالي', en: 'High' }
    };
    return levelMap[level][isArabic ? 'ar' : 'en'];
  };
  
  // Format ROI percentage
  const formatROI = (roi: number) => {
    const percentage = Math.round(roi * 100);
    if (isArabic) {
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return percentage.toString().replace(/[0-9]/g, digit => arabicNumerals[parseInt(digit)]) + '٪';
    }
    return `${percentage}%`;
  };
  
  // Handle task creation
  const handleCreateTask = async () => {
    setIsCreatingTask(true);
    try {
      await createMitigationTask(mitigation, policyTitle);
      
      toast({
        title: isArabic ? 'تم إنشاء المهمة بنجاح' : 'Task Created Successfully',
        description: isArabic 
          ? 'تم إضافة استراتيجية التخفيف كمهمة جديدة' 
          : 'Mitigation strategy has been added as a new task',
      });
    } catch (error) {
      toast({
        title: isArabic ? 'خطأ في إنشاء المهمة' : 'Task Creation Error',
        description: isArabic 
          ? 'حدث خطأ أثناء إنشاء المهمة. يرجى المحاولة مرة أخرى.' 
          : 'Failed to create task. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <Card className={`${className} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base flex items-start gap-2">
            <Target className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
            <span className="leading-tight">{mitigation.strategy}</span>
          </CardTitle>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={getBadgeVariant(mitigation.impact)} className="text-xs">
              {isArabic ? 'التأثير:' : 'Impact:'} {getLevelText(mitigation.impact)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              {isArabic ? 'الجهد' : 'Effort'}
            </div>
            <Badge variant="outline" className="text-xs">
              {getLevelText(mitigation.effort)}
            </Badge>
          </div>
          
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              {isArabic ? 'عائد الاستثمار' : 'ROI'}
            </div>
            <div className="font-bold text-sm text-green-600">
              {formatROI(mitigation.roi)}
            </div>
          </div>
          
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              {isArabic ? 'الإجراءات' : 'Actions'}
            </div>
            <div className="font-bold text-sm">
              {isArabic ? 
                mitigation.actions.length.toString().replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][parseInt(d)]) :
                mitigation.actions.length
              }
            </div>
          </div>
        </div>
        
        {/* ROI Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{isArabic ? 'توقع عائد الاستثمار' : 'Expected ROI'}</span>
            <span>{formatROI(mitigation.roi)}</span>
          </div>
          <Progress value={mitigation.roi * 100} className="h-2" />
        </div>
        
        {/* Actions List */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span className="text-sm">
                  {isArabic ? 'عرض خطة العمل' : 'View Action Plan'}
                </span>
              </div>
              <ArrowRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              {isArabic ? 'الإجراءات المطلوبة:' : 'Required Actions:'}
            </div>
            {mitigation.actions.map((action, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-muted/30 rounded text-sm">
                <div className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                  {isArabic ? 
                    (index + 1).toString().replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][parseInt(d)]) :
                    index + 1
                  }
                </div>
                <span>{action}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button 
            onClick={handleCreateTask}
            disabled={isCreatingTask}
            className="flex-1"
            size="sm"
          >
            {isCreatingTask ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                {isArabic ? 'جاري الإنشاء...' : 'Creating...'}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {isArabic ? 'إنشاء مهمة' : 'Create Task'}
              </>
            )}
          </Button>
          
          {citations.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  {isArabic ? 'المصادر' : 'Citations'}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {isArabic ? 
                      citations.length.toString().replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][parseInt(d)]) :
                      citations.length
                    }
                  </Badge>
                </Button>
              </PopoverTrigger>
              
              <PopoverContent className="w-80 max-h-60 overflow-y-auto" side={isArabic ? 'left' : 'right'}>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">
                    {isArabic ? 'المراجع والمصادر' : 'References & Citations'}
                  </h4>
                  {citations.slice(0, 5).map((citation, index) => (
                    <div key={citation.doc_id} className="text-sm space-y-1 pb-2 border-b last:border-b-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {citation.snippet}
                          </p>
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
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {isArabic ? 'الصلة:' : 'Relevance:'} {formatRiskScore({ value: citation.score, confidence: 1 }, locale)}
                        </Badge>
                        {citation.tag && (
                          <Badge variant="secondary" className="text-xs">
                            {citation.tag}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MitigationCard;