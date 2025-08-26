import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  Calendar,
  DollarSign,
  Building,
  UserPlus,
  UserMinus,
  BarChart3,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface WorkforcePrediction {
  id: string;
  type: 'hiring_need' | 'attrition_risk' | 'skill_gap' | 'capacity_shortage' | 'budget_impact';
  department: string;
  position: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  currentCount: number;
  recommendedAction: string;
  estimatedCost?: number;
  aiReasoning: string[];
  riskFactors: string[];
  createdAt: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'dismissed';
}

interface WorkforceTrend {
  period: string;
  headcount: number;
  saudizationRate: number;
  turnoverRate: number;
  productivity: number;
  satisfaction: number;
  cost: number;
}

interface PlannerMetrics {
  totalPredictions: number;
  activePredictions: number;
  accuracyRate: number;
  costSavings: number;
  predictedHires: number;
  predictedAttrition: number;
}

export const PredictiveWorkforcePlanner: React.FC = () => {
  const { toast } = useToast();
  const { isArabic } = useSimpleLanguage();
  
  const [plannerActive, setPlannerActive] = useState(true);
  const [predictions, setPredictions] = useState<WorkforcePrediction[]>([
    {
      id: '1',
      type: 'hiring_need',
      department: 'IT',
      position: 'Senior Software Engineer',
      urgency: 'high',
      probability: 92,
      timeframe: '30-45 days',
      impact: 'high',
      currentCount: 8,
      recommendedAction: 'Initiate hiring process for 2 Senior Software Engineers',
      estimatedCost: 240000,
      aiReasoning: [
        'Project pipeline analysis shows 40% increase in development workload',
        'Current team at 95% capacity utilization',
        'Historical pattern: Q4 development surge requires additional resources',
        'Market analysis: Optimal hiring window before competitor recruitment peak'
      ],
      riskFactors: [
        'Tight talent market for senior positions',
        'Average hiring time: 45-60 days',
        'Budget approval may delay by 2 weeks'
      ],
      createdAt: '2 hours ago',
      status: 'pending'
    },
    {
      id: '2',
      type: 'attrition_risk',
      department: 'Sales',
      position: 'Account Manager',
      urgency: 'critical',
      probability: 87,
      timeframe: '15-30 days',
      impact: 'critical',
      currentCount: 12,
      recommendedAction: 'Immediate retention intervention for 3 high-risk employees',
      estimatedCost: 150000,
      aiReasoning: [
        'Performance metrics declining for 3 key account managers',
        'Salary benchmarking shows 15% below market rate',
        'Exit interview patterns indicate career growth concerns',
        'Client satisfaction scores correlated with retention risk'
      ],
      riskFactors: [
        'Q4 bonus season approaching - competitors actively recruiting',
        'Key client relationships at risk',
        'Training investment recovery period: 18 months'
      ],
      createdAt: '4 hours ago',
      status: 'approved'
    },
    {
      id: '3',
      type: 'skill_gap',
      department: 'Engineering',
      position: 'DevOps Engineer',
      urgency: 'medium',
      probability: 78,
      timeframe: '60-90 days',
      impact: 'medium',
      currentCount: 3,
      recommendedAction: 'Upskill 2 existing engineers + hire 1 senior DevOps specialist',
      estimatedCost: 180000,
      aiReasoning: [
        'Cloud migration project requires advanced DevOps expertise',
        'Current team lacks Kubernetes and microservices experience',
        'Training assessment shows 2 engineers have learning potential',
        'Market rate for senior DevOps: 25% premium vs current budget'
      ],
      riskFactors: [
        'Training duration: 12 weeks minimum',
        'Project timeline dependency',
        'Senior talent scarcity in local market'
      ],
      createdAt: '1 day ago',
      status: 'in_progress'
    },
    {
      id: '4',
      type: 'capacity_shortage',
      department: 'Customer Support',
      position: 'Support Specialist',
      urgency: 'high',
      probability: 94,
      timeframe: '20-30 days',
      impact: 'high',
      currentCount: 15,
      recommendedAction: 'Hire 4 bilingual support specialists (Arabic/English)',
      estimatedCost: 96000,
      aiReasoning: [
        'Customer growth: 35% increase in Q4',
        'Response time SLA at risk: current avg 4.2 hours vs 2 hour target',
        'Saudi market expansion requires Arabic-speaking specialists',
        'Seasonal support volume spike predicted based on 3-year pattern'
      ],
      riskFactors: [
        'Bilingual talent premium: 20% higher salary expectation',
        'Training period: 6 weeks before full productivity',
        'Government compliance requirements for customer data handling'
      ],
      createdAt: '6 hours ago',
      status: 'pending'
    }
  ]);

  const [trends, setTrends] = useState<WorkforceTrend[]>([
    { period: 'Jan 2024', headcount: 118, saudizationRate: 32, turnoverRate: 8.5, productivity: 85, satisfaction: 78, cost: 2.1 },
    { period: 'Feb 2024', headcount: 122, saudizationRate: 33, turnoverRate: 7.2, productivity: 87, satisfaction: 79, cost: 2.15 },
    { period: 'Mar 2024', headcount: 125, saudizationRate: 35, turnoverRate: 6.8, productivity: 89, satisfaction: 81, cost: 2.18 },
    { period: 'Apr 2024', headcount: 128, saudizationRate: 36, turnoverRate: 5.9, productivity: 91, satisfaction: 83, cost: 2.22 },
    { period: 'May 2024', headcount: 131, saudizationRate: 38, turnoverRate: 6.1, productivity: 92, satisfaction: 84, cost: 2.25 },
    { period: 'Jun 2024', headcount: 134, saudizationRate: 39, turnoverRate: 5.4, productivity: 94, satisfaction: 86, cost: 2.28 },
    { period: 'Jul 2024', headcount: 138, saudizationRate: 41, turnoverRate: 5.8, productivity: 95, satisfaction: 87, cost: 2.32 },
    { period: 'Aug 2024', headcount: 142, saudizationRate: 42, turnoverRate: 4.9, productivity: 96, satisfaction: 89, cost: 2.35 }
  ]);

  const [metrics, setMetrics] = useState<PlannerMetrics>({
    totalPredictions: 156,
    activePredictions: 23,
    accuracyRate: 91.3,
    costSavings: 1250000,
    predictedHires: 12,
    predictedAttrition: 7
  });

  useEffect(() => {
    if (!plannerActive) return;

    const interval = setInterval(() => {
      setPredictions(prev => prev.map(prediction => {
        if (prediction.status === 'in_progress' && Math.random() < 0.1) {
          return { ...prediction, probability: Math.min(100, prediction.probability + Math.random() * 2) };
        }
        return prediction;
      }));

      setMetrics(prev => ({
        ...prev,
        accuracyRate: 89 + Math.random() * 4,
        costSavings: prev.costSavings + Math.floor(Math.random() * 1000)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [plannerActive]);

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-status-danger animate-pulse" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-brand-warning" />;
      case 'medium': return <Target className="h-4 w-4 text-primary" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      default: return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hiring_need': return <UserPlus className="h-4 w-4 text-brand-success" />;
      case 'attrition_risk': return <UserMinus className="h-4 w-4 text-status-danger" />;
      case 'skill_gap': return <Brain className="h-4 w-4 text-primary" />;
      case 'capacity_shortage': return <Users className="h-4 w-4 text-brand-warning" />;
      case 'budget_impact': return <DollarSign className="h-4 w-4 text-muted-foreground" />;
      default: return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-status-danger';
      case 'high': return 'bg-brand-warning';
      case 'medium': return 'bg-primary';
      case 'low': return 'bg-brand-success';
      default: return 'bg-muted-foreground';
    }
  };

  const approvePrediction = (predictionId: string) => {
    setPredictions(prev => prev.map(prediction => 
      prediction.id === predictionId 
        ? { ...prediction, status: 'approved' as const }
        : prediction
    ));
    toast({
      title: isArabic ? "تمت الموافقة على التوقع" : "Prediction Approved",
      description: isArabic ? "بدء تنفيذ التوصية" : "Recommendation implementation initiated",
    });
  };

  const togglePlanner = () => {
    setPlannerActive(!plannerActive);
    toast({
      title: plannerActive 
        ? (isArabic ? "تم إيقاف مخطط القوى العاملة" : "Workforce Planner Paused")
        : (isArabic ? "تم تفعيل مخطط القوى العاملة" : "Workforce Planner Activated"),
      description: plannerActive 
        ? (isArabic ? "إيقاف التخطيط التنبؤي" : "Predictive planning paused")
        : (isArabic ? "استئناف التخطيط التنبؤي" : "Resuming predictive planning"),
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {isArabic ? "مخطط القوى العاملة التنبؤي" : "Predictive Workforce Planner"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "تخطيط وتوقع احتياجات القوى العاملة المستقبلية باستخدام الذكاء الاصطناعي" 
              : "AI-powered forecasting and planning of future workforce needs and optimization"
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={plannerActive ? "default" : "secondary"} className="px-4 py-2">
            {plannerActive 
              ? (isArabic ? "🔮 يتوقع" : "🔮 PREDICTING")
              : (isArabic ? "⏸️ متوقف" : "⏸️ PAUSED")
            }
          </Badge>
          <Button onClick={togglePlanner} variant={plannerActive ? "destructive" : "default"}>
            {plannerActive 
              ? (isArabic ? "إيقاف" : "Pause")
              : (isArabic ? "تفعيل" : "Start")
            }
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "توقعات نشطة" : "Active Predictions"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.activePredictions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "معدل الدقة" : "Accuracy Rate"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.accuracyRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "توظيف متوقع" : "Predicted Hires"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.predictedHires}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-status-danger" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "استنزاف متوقع" : "Predicted Attrition"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.predictedAttrition}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "وفورات تكلفة" : "Cost Savings"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {(metrics.costSavings / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "المجموع" : "Total Predictions"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.totalPredictions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">
            {isArabic ? "التوقعات النشطة" : "Active Predictions"}
          </TabsTrigger>
          <TabsTrigger value="trends">
            {isArabic ? "اتجاهات القوى العاملة" : "Workforce Trends"}
          </TabsTrigger>
          <TabsTrigger value="scenarios">
            {isArabic ? "سيناريوهات المستقبل" : "Future Scenarios"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          {predictions.map((prediction) => (
            <Card key={prediction.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getUrgencyIcon(prediction.urgency)}
                      {getTypeIcon(prediction.type)}
                      <h3 className="font-semibold text-foreground">
                        {prediction.department} - {prediction.position}
                      </h3>
                      <div className={`w-2 h-2 rounded-full ${getUrgencyColor(prediction.urgency)}`} />
                      <Badge variant="outline" className="text-xs">
                        {prediction.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{prediction.recommendedAction}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>🎯 {prediction.probability}% confidence</span>
                      <span>⏱️ {prediction.timeframe}</span>
                      <span>👥 Current: {prediction.currentCount}</span>
                      {prediction.estimatedCost && (
                        <span>💰 {(prediction.estimatedCost / 1000).toFixed(0)}K SAR</span>
                      )}
                      <span>📅 {prediction.createdAt}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge 
                      variant={prediction.status === 'approved' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {prediction.status.toUpperCase()}
                    </Badge>
                    {prediction.status === 'pending' && (
                      <Button size="sm" onClick={() => approvePrediction(prediction.id)}>
                        {isArabic ? "موافقة" : "Approve"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Confidence */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AI Confidence</span>
                      <span className="font-medium">{prediction.probability}%</span>
                    </div>
                    <Progress value={prediction.probability} className="h-2" />
                  </div>

                  {/* AI Reasoning */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">AI Analysis:</h4>
                    <div className="space-y-1">
                      {prediction.aiReasoning.map((reason, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-brand-success mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Risk Factors:</h4>
                    <div className="space-y-1">
                      {prediction.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-brand-warning mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {isArabic ? "اتجاهات القوى العاملة التاريخية" : "Historical Workforce Trends"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={trend.period} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{trend.period}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Headcount</div>
                        <div className="font-medium">{trend.headcount}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Saudization</div>
                        <div className="font-medium">{trend.saudizationRate}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Turnover</div>
                        <div className="font-medium">{trend.turnoverRate}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Productivity</div>
                        <div className="font-medium">{trend.productivity}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Cost (M)</div>
                        <div className="font-medium">{trend.cost}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-success">Optimistic Scenario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Headcount (Dec 2024)</span>
                  <span className="font-bold text-brand-success">165</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saudization Rate</span>
                  <span className="font-bold text-brand-success">48%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Turnover Rate</span>
                  <span className="font-bold text-brand-success">4.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget Impact</span>
                  <span className="font-bold text-brand-success">+8% efficient</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-status-danger">Risk Scenario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Headcount (Dec 2024)</span>
                  <span className="font-bold text-status-danger">138</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saudization Rate</span>
                  <span className="font-bold text-status-danger">41%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Turnover Rate</span>
                  <span className="font-bold text-status-danger">12.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget Impact</span>
                  <span className="font-bold text-status-danger">+15% cost</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};