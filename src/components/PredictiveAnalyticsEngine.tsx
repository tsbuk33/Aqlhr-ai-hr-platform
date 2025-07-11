import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Calendar, AlertCircle, Brain, Target, Zap } from "lucide-react";

interface PredictiveInsight {
  category: string;
  prediction: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  recommendation: string;
  metric: {
    current: number;
    predicted: number;
    unit: string;
  };
}

interface SaudizationTrend {
  currentRate: number;
  predictedRate: number;
  targetRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const PredictiveAnalyticsEngine = () => {
  const { t } = useLanguage();
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [saudizationTrend, setSaudizationTrend] = useState<SaudizationTrend | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadPredictiveAnalytics();
  }, []);

  const loadPredictiveAnalytics = async () => {
    setIsAnalyzing(true);
    
    // Simulate advanced predictive analytics
    const mockInsights: PredictiveInsight[] = [
      {
        category: "Workforce Planning",
        prediction: "15% increase in hiring demand",
        confidence: 94.2,
        impact: 'high',
        timeframe: "Next 3 months",
        recommendation: "Prepare recruitment pipeline for Engineering roles",
        metric: {
          current: 2847,
          predicted: 3274,
          unit: "employees"
        }
      },
      {
        category: "Employee Retention",
        prediction: "Turnover rate decrease by 8%",
        confidence: 87.5,
        impact: 'medium',
        timeframe: "Next 6 months",
        recommendation: "Maintain current retention programs",
        metric: {
          current: 12.3,
          predicted: 11.3,
          unit: "% turnover"
        }
      },
      {
        category: "Training ROI",
        prediction: "23% improvement in skill assessments",
        confidence: 91.8,
        impact: 'high',
        timeframe: "Next 4 months",
        recommendation: "Expand digital training programs",
        metric: {
          current: 76.4,
          predicted: 94.1,
          unit: "% pass rate"
        }
      },
      {
        category: "Compliance Risk",
        prediction: "Zero compliance violations",
        confidence: 99.1,
        impact: 'high',
        timeframe: "Next 12 months",
        recommendation: "Continue current compliance automation",
        metric: {
          current: 0.2,
          predicted: 0.0,
          unit: "violations"
        }
      }
    ];

    const mockSaudization: SaudizationTrend = {
      currentRate: 67.2,
      predictedRate: 69.8,
      targetRate: 70.0,
      riskLevel: 'low',
      recommendations: [
        "Accelerate Saudi talent acquisition in Q2",
        "Implement mentorship programs for Saudi employees",
        "Focus on technical skill development"
      ]
    };

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setInsights(mockInsights);
    setSaudizationTrend(mockSaudization);
    setIsAnalyzing(false);
  };

  const runAdvancedAnalytics = async () => {
    setIsAnalyzing(true);
    
    try {
      await supabase.functions.invoke('system-engineer-discovery', {
        body: { 
          action: 'predictive_analytics',
          analysis_type: 'comprehensive',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Predictive analytics error:', error);
    }
    
    await loadPredictiveAnalytics();
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-status-error';
      case 'medium': return 'bg-status-warning';
      case 'low': return 'bg-status-success';
      default: return 'bg-muted';
    }
  };

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-status-error';
      case 'medium': return 'text-status-warning';
      case 'low': return 'text-status-success';
      default: return 'text-muted-foreground';
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Brain className="h-12 w-12 mx-auto animate-pulse text-brand-primary" />
              <div className="text-lg font-medium">{t('system.analyzing_trends')}</div>
              <div className="text-sm text-muted-foreground">{t('system.ai_processing')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Predictive Analytics Header */}
      <Card className="bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 border-2 border-brand-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-brand-accent to-brand-primary text-white">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('system.predictive_analytics_engine')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('system.ai_powered_insights')}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-brand-accent">96.8%</div>
                <div className="text-sm text-muted-foreground">{t('system.prediction_accuracy')}</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Saudization Trend Analysis */}
      {saudizationTrend && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('system.saudization_trends')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-primary">{saudizationTrend.currentRate}%</div>
                  <div className="text-sm text-muted-foreground">{t('system.current_rate')}</div>
                </div>
                <Progress value={saudizationTrend.currentRate} className="h-3" />
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-accent">{saudizationTrend.predictedRate}%</div>
                  <div className="text-sm text-muted-foreground">{t('system.predicted_rate')}</div>
                </div>
                <Progress value={saudizationTrend.predictedRate} className="h-3" />
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-status-success">{saudizationTrend.targetRate}%</div>
                  <div className="text-sm text-muted-foreground">{t('system.target_rate')}</div>
                </div>
                <div className={`text-center font-medium ${getRiskColor(saudizationTrend.riskLevel)}`}>
                  {saudizationTrend.riskLevel.toUpperCase()} {t('system.risk')}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">{t('system.ai_recommendations')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {saudizationTrend.recommendations.map((rec, index) => (
                  <Card key={index} className="border border-brand-primary/20">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-brand-primary mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t('system.ai_insights')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: `hsl(var(--${getImpactColor(insight.impact).replace('bg-', '')}))` }}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{insight.category}</h4>
                      <Badge variant={getImpactBadgeVariant(insight.impact)}>
                        {insight.impact.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-brand-primary" />
                        <span className="font-medium">{insight.prediction}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('system.confidence')}</span>
                        <span className="font-bold">{insight.confidence}%</span>
                      </div>
                      <Progress value={insight.confidence} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                        <div>
                          <span className="text-muted-foreground">{t('system.current')}: </span>
                          <span className="font-medium">{insight.metric.current} {insight.metric.unit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('system.predicted')}: </span>
                          <span className="font-medium">{insight.metric.predicted} {insight.metric.unit}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">{t('system.timeframe')}: </span>
                        <span>{insight.timeframe}</span>
                      </div>
                      
                      <div className="bg-brand-primary/5 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-brand-primary mt-0.5" />
                          <div>
                            <div className="text-xs font-medium text-brand-primary mb-1">{t('system.recommendation')}</div>
                            <div className="text-sm">{insight.recommendation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalyticsEngine;