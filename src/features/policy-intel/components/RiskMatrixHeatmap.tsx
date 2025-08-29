import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Grid3x3, Info } from 'lucide-react';
import { useLocale } from '@/i18n/locale';
import { PolicyRiskResult, formatRiskScore, getRiskColor } from '../api/analyzePolicy';

interface RiskMatrixHeatmapProps {
  scores: PolicyRiskResult['scores'];
  scoreDetails?: PolicyRiskResult['score_details'];
  className?: string;
}

const RiskMatrixHeatmap: React.FC<RiskMatrixHeatmapProps> = ({
  scores,
  scoreDetails = [],
  className = ''
}) => {
  const { locale, t } = useLocale();
  const isArabic = locale === 'ar';
  
  // Risk family definitions
  const riskFamilies = [
    {
      key: 'complianceRisk',
      titleKey: 'policy.family.compliance',
      title: isArabic ? 'مخاطر الامتثال' : 'Compliance Risk',
      dimensions: [
        { key: 'saudiLaborLaw', titleKey: 'policy.dim.saudiLaborLaw', title: isArabic ? 'قانون العمل السعودي' : 'Saudi Labor Law' },
        { key: 'hrsdRequirements', titleKey: 'policy.dim.hrsdRequirements', title: isArabic ? 'متطلبات وزارة الموارد البشرية' : 'HRSD Requirements' },
        { key: 'internationalStandards', titleKey: 'policy.dim.internationalStandards', title: isArabic ? 'المعايير الدولية' : 'International Standards' },
        { key: 'futureRegulations', titleKey: 'policy.dim.futureRegulations', title: isArabic ? 'اللوائح المستقبلية' : 'Future Regulations' }
      ]
    },
    {
      key: 'businessRisk',
      titleKey: 'policy.family.business', 
      title: isArabic ? 'المخاطر التجارية' : 'Business Risk',
      dimensions: [
        { key: 'financialImpact', titleKey: 'policy.dim.financialImpact', title: isArabic ? 'التأثير المالي' : 'Financial Impact' },
        { key: 'operationalRisk', titleKey: 'policy.dim.operationalRisk', title: isArabic ? 'المخاطر التشغيلية' : 'Operational Risk' },
        { key: 'reputationalRisk', titleKey: 'policy.dim.reputationalRisk', title: isArabic ? 'مخاطر السمعة' : 'Reputational Risk' },
        { key: 'competitiveRisk', titleKey: 'policy.dim.competitiveRisk', title: isArabic ? 'المخاطر التنافسية' : 'Competitive Risk' }
      ]
    },
    {
      key: 'implementationRisk',
      titleKey: 'policy.family.implementation',
      title: isArabic ? 'مخاطر التنفيذ' : 'Implementation Risk',
      dimensions: [
        { key: 'resourceRequirements', titleKey: 'policy.dim.resourceRequirements', title: isArabic ? 'متطلبات الموارد' : 'Resource Requirements' },
        { key: 'changeManagement', titleKey: 'policy.dim.changeManagement', title: isArabic ? 'إدارة التغيير' : 'Change Management' },
        { key: 'trainingNeeds', titleKey: 'policy.dim.trainingNeeds', title: isArabic ? 'احتياجات التدريب' : 'Training Needs' },
        { key: 'technologyIntegration', titleKey: 'policy.dim.technologyIntegration', title: isArabic ? 'التكامل التكنولوجي' : 'Technology Integration' }
      ]
    }
  ];
  
  // Get rationale for a specific dimension
  const getRationale = (dimensionKey: string): string => {
    const detail = scoreDetails.find(d => d.dimension === dimensionKey);
    return detail?.rationale || (isArabic ? 'لا توجد تفاصيل متاحة' : 'No details available');
  };
  
  // Get intensity class based on score
  const getIntensityClass = (score: number): string => {
    if (score <= 0.2) return 'bg-green-100 border-green-200 text-green-800';
    if (score <= 0.4) return 'bg-green-200 border-green-300 text-green-900';
    if (score <= 0.6) return 'bg-yellow-200 border-yellow-300 text-yellow-900';
    if (score <= 0.8) return 'bg-orange-200 border-orange-300 text-orange-900';
    return 'bg-red-200 border-red-300 text-red-900';
  };

  const [selectedCell, setSelectedCell] = useState<{ family: string; dimension: string } | null>(null);

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5" />
            {isArabic ? 'مصفوفة المخاطر الحرارية' : 'Risk Matrix Heatmap'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isArabic 
              ? 'عرض تفاعلي لمستويات المخاطر عبر العائلات والأبعاد' 
              : 'Interactive view of risk levels across families and dimensions'}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
                <span>{isArabic ? 'منخفض' : 'Low'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
                <span>{isArabic ? 'متوسط' : 'Medium'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                <span>{isArabic ? 'عالي' : 'High'}</span>
              </div>
            </div>
            
            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-w-full">
                {riskFamilies.map((family) => (
                  <div key={family.key} className="space-y-2">
                    {/* Family Header */}
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm">{family.title}</h4>
                    </div>
                    
                    {/* Dimensions */}
                    <div className="grid grid-cols-1 gap-2">
                      {family.dimensions.map((dimension) => {
                        const score = (scores as any)[family.key]?.[dimension.key];
                        if (!score) return null;
                        
                        const intensityClass = getIntensityClass(score.value);
                        const displayScore = formatRiskScore(score, locale);
                        
                        return (
                          <Tooltip key={dimension.key}>
                            <TooltipTrigger asChild>
                              <div
                                className={`
                                  p-3 border rounded-lg cursor-pointer transition-all
                                  ${intensityClass}
                                  hover:shadow-md hover:scale-105
                                  ${selectedCell?.family === family.key && selectedCell?.dimension === dimension.key 
                                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                                    : ''
                                  }
                                `}
                                onClick={() => setSelectedCell({ family: family.key, dimension: dimension.key })}
                              >
                                <div className="text-center space-y-1">
                                  <div className="text-xs font-medium truncate" title={dimension.title}>
                                    {dimension.title}
                                  </div>
                                  <div className="text-lg font-bold">{displayScore}</div>
                                  <div className="text-xs opacity-75">
                                    {isArabic ? 'الثقة:' : 'Conf:'} {formatRiskScore(score, locale)}
                                  </div>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent 
                              className="max-w-xs p-3"
                              side={isArabic ? 'left' : 'right'}
                            >
                              <div className="space-y-2">
                                <div className="font-medium">{dimension.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {getRationale(dimension.key)}
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <Badge variant="outline" className="text-xs">
                                    {isArabic ? 'النقاط:' : 'Score:'} {displayScore}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {isArabic ? 'الثقة:' : 'Confidence:'} {formatRiskScore(score, locale)}
                                  </Badge>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Selected Cell Details */}
            {selectedCell && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {riskFamilies
                        .find(f => f.key === selectedCell.family)?.dimensions
                        .find(d => d.key === selectedCell.dimension)?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getRationale(selectedCell.dimension)}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {riskFamilies.find(f => f.key === selectedCell.family)?.title}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {isArabic ? 'تفاصيل محددة' : 'Detailed View'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default RiskMatrixHeatmap;