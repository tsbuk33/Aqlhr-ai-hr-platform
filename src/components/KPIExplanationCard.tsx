import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";

interface KPIExplanation {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  formulaEn?: string;
  formulaAr?: string;
  importanceEn: string;
  importanceAr: string;
  targetEn: string;
  targetAr: string;
  category: 'operational' | 'strategic' | 'compliance' | 'financial';
}

interface KPIExplanationCardProps {
  explanation: KPIExplanation;
}

export const KPIExplanationCard = ({ explanation }: KPIExplanationCardProps) => {
  const { isArabic } = useSimpleLanguage();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operational':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'strategic':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'compliance':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'financial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      operational: { en: 'Operational', ar: 'تشغيلي' },
      strategic: { en: 'Strategic', ar: 'استراتيجي' },
      compliance: { en: 'Compliance', ar: 'امتثال' },
      financial: { en: 'Financial', ar: 'مالي' }
    };
    return isArabic ? labels[category as keyof typeof labels]?.ar : labels[category as keyof typeof labels]?.en;
  };

  return (
    <Card className="w-full">
      <CardHeader className={isArabic ? 'text-right' : ''}>
        <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
          <CardTitle className="text-lg">
            {isArabic ? explanation.titleAr : explanation.titleEn}
          </CardTitle>
          <Badge className={getCategoryColor(explanation.category)}>
            {getCategoryLabel(explanation.category)}
          </Badge>
        </div>
        <CardDescription className={isArabic ? 'text-right' : ''}>
          {isArabic ? explanation.descriptionAr : explanation.descriptionEn}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {explanation.formulaEn && (
          <div className={`p-3 bg-muted rounded-lg ${isArabic ? 'text-right' : ''}`}>
            <h4 className="font-semibold text-sm mb-2">
              {isArabic ? 'المعادلة:' : 'Formula:'}
            </h4>
            <code className="text-sm">
              {isArabic ? explanation.formulaAr : explanation.formulaEn}
            </code>
          </div>
        )}
        
        <div className={isArabic ? 'text-right' : ''}>
          <h4 className="font-semibold text-sm mb-2">
            {isArabic ? 'الأهمية:' : 'Why it matters:'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isArabic ? explanation.importanceAr : explanation.importanceEn}
          </p>
        </div>

        <div className={isArabic ? 'text-right' : ''}>
          <h4 className="font-semibold text-sm mb-2">
            {isArabic ? 'الهدف المثالي:' : 'Ideal target:'}
          </h4>
          <p className="text-sm text-success">
            {isArabic ? explanation.targetAr : explanation.targetEn}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};