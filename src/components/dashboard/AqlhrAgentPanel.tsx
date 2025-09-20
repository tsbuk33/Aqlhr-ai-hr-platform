import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, Zap, TrendingUp, AlertTriangle, Target, Lightbulb,
  Activity, Eye, Cpu, RefreshCw, Play, Pause
} from 'lucide-react';
import { useAqlhrAgent } from '@/hooks/useAqlhrAgent';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export function AqlhrAgentPanel() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const {
    insights,
    connections,
    reasoning,
    loading,
    agentActive,
    setAgentActive,
    refreshAnalysis,
    getInsightsByType,
    getInsightsByPriority,
    getActionableInsights
  } = useAqlhrAgent();

  const criticalInsights = getInsightsByPriority('critical');
  const actionableInsights = getActionableInsights();
  const predictions = getInsightsByType('prediction');
  const opportunities = getInsightsByType('opportunity');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'high': return 'bg-orange-600/20 text-orange-400 border-orange-600/30';
      case 'medium': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'alert': return AlertTriangle;
      case 'opportunity': return Target;
      case 'recommendation': return Lightbulb;
      case 'connection': return Activity;
      default: return Eye;
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Status Header */}
      <Card className="aqlhr-card border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-6 w-6 text-primary" />
                {agentActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isArabic ? 'وكيل AqlHR الذكي' : 'AqlHR AI Agent'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'التحليل الذكي والتوصيات المتقدمة' : 'Intelligent Analysis & Expert Recommendations'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={agentActive ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                {agentActive ? (isArabic ? 'نشط' : 'ACTIVE') : (isArabic ? 'متوقف' : 'INACTIVE')}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAgentActive(!agentActive)}
                className="gap-2"
              >
                {agentActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {agentActive ? (isArabic ? 'إيقاف' : 'Pause') : (isArabic ? 'تشغيل' : 'Start')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAnalysis}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {isArabic ? 'تحديث' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{insights.length}</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'رؤى مكتشفة' : 'Insights'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{criticalInsights.length}</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'تنبيهات حرجة' : 'Critical'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{predictions.length}</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'توقعات' : 'Predictions'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{actionableInsights.length}</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'قابل للتنفيذ' : 'Actionable'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Insights */}
      {criticalInsights.length > 0 && (
        <Card className="aqlhr-card border-red-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              {isArabic ? 'تنبيهات حرجة تحتاج تدخل فوري' : 'Critical Alerts Requiring Immediate Action'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalInsights.map((insight, index) => {
              const IconComponent = getTypeIcon(insight.type);
              return (
                <div key={insight.id} className="p-4 bg-red-600/5 border border-red-600/20 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-red-400" />
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    </div>
                    <Badge className="bg-red-600/20 text-red-400 text-xs">
                      {Math.round(insight.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
                    <strong>{isArabic ? 'تحليل الوكيل:' : 'Agent Reasoning:'}</strong> {insight.reasoning}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {insight.source_modules.map((module, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictions */}
        <Card className="aqlhr-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              {isArabic ? 'التوقعات الذكية' : 'AI Predictions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {predictions.length > 0 ? predictions.map((prediction) => {
              const IconComponent = getTypeIcon(prediction.type);
              return (
                <div key={prediction.id} className="p-3 bg-accent/10 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-blue-400" />
                      <h5 className="font-medium text-sm">{prediction.title}</h5>
                    </div>
                    <Badge className={getPriorityColor(prediction.priority)}>
                      {prediction.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{prediction.description}</p>
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20">
                    {prediction.reasoning}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-4 text-muted-foreground">
                <Cpu className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{isArabic ? 'جاري تحليل البيانات...' : 'Analyzing data patterns...'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card className="aqlhr-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-400" />
              {isArabic ? 'فرص التحسين' : 'Optimization Opportunities'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {opportunities.length > 0 ? opportunities.map((opportunity) => {
              const IconComponent = getTypeIcon(opportunity.type);
              return (
                <div key={opportunity.id} className="p-3 bg-green-600/5 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-green-400" />
                      <h5 className="font-medium text-sm">{opportunity.title}</h5>
                    </div>
                    <Badge className="bg-green-600/20 text-green-400">
                      {Math.round(opportunity.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{opportunity.description}</p>
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20">
                    {opportunity.reasoning}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-4 text-muted-foreground">
                <Lightbulb className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{isArabic ? 'البحث عن فرص التحسين...' : 'Identifying opportunities...'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cross-Module Connections */}
      <Card className="aqlhr-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            {isArabic ? 'الاتصالات بين الوحدات' : 'Cross-Module Intelligence'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connections.map((connection, index) => (
              <div key={index} className="p-3 bg-purple-600/5 border border-purple-600/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">
                    {connection.from_module} → {connection.to_module}
                  </div>
                  <Badge className="bg-purple-600/20 text-purple-400 text-xs">
                    {Math.round(connection.strength * 100)}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {connection.relationship_type.replace(/_/g, ' ')}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {connection.impact_factors.slice(0, 2).map((factor, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {factor.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Reasoning */}
      {reasoning && (
        <Card className="aqlhr-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {isArabic ? 'تحليل الوكيل المفصل' : 'Agent Detailed Reasoning'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-accent/10 p-4 rounded-lg">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {reasoning}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}