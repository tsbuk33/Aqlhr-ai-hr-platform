import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Globe, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface HofstedeContextData {
  total_employees: number;
  dimensions: {
    power_distance: number;
    individualism: number;
    masculinity: number;
    uncertainty_avoidance: number;
    long_term_orientation: number;
    indulgence: number;
  };
  nationality_mix: Array<{
    nationality: string;
    percentage: number;
    count: number;
    has_hofstede_data: boolean;
  }>;
  computed_at: string;
}

interface HofstedeContextCardProps {
  data: HofstedeContextData | null;
}

const HofstedeContextCard: React.FC<HofstedeContextCardProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();
  if (!data || data.total_employees === 0) {
    return null; // Hide card if no employee data
  }

  const dimensions = [
    {
      key: 'power_distance',
      label: t('power_distance'),
      value: data.dimensions.power_distance,
      description: isRTL 
        ? 'مدى قبول التفاوت في السلطة في المؤسسات والمنظمات'
        : 'Extent to which power inequality is accepted in institutions and organizations'
    },
    {
      key: 'individualism',
      label: t('individualism'),
      value: data.dimensions.individualism,
      description: isRTL
        ? 'تفضيل العمل الفردي مقابل العمل الجماعي'
        : 'Preference for individual vs. collective action'
    },
    {
      key: 'masculinity',
      label: t('masculinity'),
      value: data.dimensions.masculinity,
      description: isRTL
        ? 'تفضيل الإنجاز والنجاح مقابل العلاقات وجودة الحياة'
        : 'Preference for achievement and success vs. relationships and quality of life'
    },
    {
      key: 'uncertainty_avoidance',
      label: t('uncertainty_avoidance'),
      value: data.dimensions.uncertainty_avoidance,
      description: isRTL
        ? 'مستوى الراحة مع الغموض والمواقف غير المؤكدة'
        : 'Comfort level with ambiguity and uncertain situations'
    },
    {
      key: 'long_term_orientation',
      label: t('long_term_orientation'),
      value: data.dimensions.long_term_orientation,
      description: isRTL
        ? 'التركيز على الأهداف المستقبلية مقابل النتائج قريبة المدى'
        : 'Focus on future goals vs. short-term results'
    },
    {
      key: 'indulgence',
      label: t('indulgence'),
      value: data.dimensions.indulgence,
      description: isRTL
        ? 'الحرية في إشباع الرغبات الطبيعية والاستمتاع بالحياة'
        : 'Freedom to gratify natural desires and enjoy life'
    }
  ];

  const getColorForValue = (value: number): string => {
    if (value >= 70) return 'bg-red-500';
    if (value >= 50) return 'bg-yellow-500';
    if (value >= 30) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">
                {t('national_cultural_context')}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('national_mix_context')}
              </CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-sm">
                  {t('hofstede_disclaimer')}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Employee Mix Summary */}
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {t('total_employees')}
            </span>
            <span className="text-lg font-bold">{data.total_employees}</span>
          </div>
          <div className="flex flex-wrap gap-1 ml-auto">
            {data.nationality_mix.slice(0, 5).map((mix, index) => (
              <Badge key={index} variant={mix.has_hofstede_data ? "default" : "secondary"} className="text-xs">
                {mix.nationality}: {mix.percentage}%
              </Badge>
            ))}
            {data.nationality_mix.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{data.nationality_mix.length - 5} {t('more')}
              </Badge>
            )}
          </div>
        </div>

        {/* Hofstede Dimensions */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">
            {t('weighted_hofstede_dimensions')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dimensions.map((dimension) => (
              <div key={dimension.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm font-medium cursor-help">
                          {dimension.label}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm max-w-xs">{dimension.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-sm font-bold">{Math.round(dimension.value)}</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={dimension.value} 
                    className="h-2"
                  />
                  <div 
                    className={`absolute top-0 h-2 rounded ${getColorForValue(dimension.value)}`}
                    style={{ width: `${dimension.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p>
            {t('hofstede_disclaimer')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HofstedeContextCard;