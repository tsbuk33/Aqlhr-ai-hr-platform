import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface KPIMetric {
  title: string;
  titleAr: string;
  value: string | number;
  target?: string | number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: {
    direction: 'up' | 'down' | 'stable';
    value: string;
  };
  culturalNote?: string;
  culturalNoteAr?: string;
}

interface ExecutiveSummaryProps {
  period: string;
  periodAr: string;
  metrics: KPIMetric[];
  highlights: {
    text: string;
    textAr: string;
    type: 'achievement' | 'concern' | 'insight';
  }[];
  recommendations: {
    text: string;
    textAr: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export const ExecutiveSummary = ({ 
  period, 
  periodAr, 
  metrics, 
  highlights, 
  recommendations 
}: ExecutiveSummaryProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-success text-white';
      case 'good': return 'bg-primary text-white';
      case 'warning': return 'bg-warning text-white';
      case 'critical': return 'bg-destructive text-white';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <div className="h-4 w-4 bg-muted rounded-full" />;
    }
  };

  const exportSummary = () => {
    console.log(`Exporting executive summary in ${language}`);
    // Would generate PDF with Arabic/English content
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">
                {isRTL ? 'الملخص التنفيذي' : 'Executive Summary'}
              </CardTitle>
              <CardDescription>
                {isRTL ? periodAr : period}
              </CardDescription>
            </div>
            <Button onClick={exportSummary} className="gap-2">
              <Download className="h-4 w-4" />
              {isRTL ? 'تصدير التقرير' : 'Export Report'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">
                    {isRTL ? metric.titleAr : metric.title}
                  </h3>
                  <Badge className={getStatusColor(metric.status)}>
                    {getStatusIcon(metric.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.target && (
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'الهدف:' : 'Target:'} {metric.target}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {getTrendIcon(metric.trend.direction)}
                    <span className="text-sm">{metric.trend.value}</span>
                  </div>
                </div>

                {(metric.culturalNote || metric.culturalNoteAr) && (
                  <div className="text-xs text-primary bg-primary/10 p-2 rounded">
                    {isRTL ? metric.culturalNoteAr : metric.culturalNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'النقاط البارزة' : 'Key Highlights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {highlights.map((highlight, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border-l-4 ${
                  highlight.type === 'achievement' ? 'border-success bg-success/5' :
                  highlight.type === 'concern' ? 'border-warning bg-warning/5' :
                  'border-primary bg-primary/5'
                }`}
              >
                <p className="text-sm">
                  {isRTL ? highlight.textAr : highlight.text}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'التوصيات الاستراتيجية' : 'Strategic Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge 
                  variant={rec.priority === 'high' ? 'destructive' : 
                          rec.priority === 'medium' ? 'default' : 'secondary'}
                  className="mt-0.5"
                >
                  {isRTL ? 
                    (rec.priority === 'high' ? 'عالي' : rec.priority === 'medium' ? 'متوسط' : 'منخفض') :
                    rec.priority.toUpperCase()
                  }
                </Badge>
                <p className="text-sm flex-1">
                  {isRTL ? rec.textAr : rec.text}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};