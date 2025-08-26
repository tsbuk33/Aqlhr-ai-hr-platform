import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Brain,
  Target,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PredictiveModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'needs_update';
  predictions: number;
}

interface WorkforceForecast {
  department: string;
  currentHeadcount: number;
  predictedHeadcount: number;
  changePercent: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
}

interface RiskPrediction {
  employeeId: string;
  employeeName: string;
  riskType: 'turnover' | 'performance' | 'engagement';
  riskScore: number;
  factors: string[];
  recommendedActions: string[];
  confidence: number;
}

export const AdvancedPredictiveAnalytics: React.FC = () => {
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [forecasts, setForecasts] = useState<WorkforceForecast[]>([]);
  const [riskPredictions, setRiskPredictions] = useState<RiskPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('models');
  const { toast } = useToast();

  useEffect(() => {
    loadPredictiveData();
  }, []);

  const loadPredictiveData = async () => {
    // Mock data - replace with actual API calls
    setModels([
      {
        id: '1',
        name: 'Turnover Prediction Model',
        type: 'classification',
        accuracy: 94.7,
        lastTrained: new Date(Date.now() - 86400000 * 7),
        status: 'active',
        predictions: 1247
      },
      {
        id: '2',
        name: 'Performance Forecasting Model',
        type: 'regression',
        accuracy: 89.3,
        lastTrained: new Date(Date.now() - 86400000 * 3),
        status: 'active',
        predictions: 892
      },
      {
        id: '3',
        name: 'Workforce Demand Model',
        type: 'time_series',
        accuracy: 91.8,
        lastTrained: new Date(Date.now() - 86400000 * 10),
        status: 'needs_update',
        predictions: 456
      }
    ]);

    setForecasts([
      {
        department: 'Engineering',
        currentHeadcount: 45,
        predictedHeadcount: 52,
        changePercent: 15.6,
        riskLevel: 'low',
        timeframe: '6 months'
      },
      {
        department: 'Sales',
        currentHeadcount: 28,
        predictedHeadcount: 22,
        changePercent: -21.4,
        riskLevel: 'high',
        timeframe: '6 months'
      },
      {
        department: 'Marketing',
        currentHeadcount: 18,
        predictedHeadcount: 20,
        changePercent: 11.1,
        riskLevel: 'medium',
        timeframe: '6 months'
      }
    ]);

    setRiskPredictions([
      {
        employeeId: '1',
        employeeName: 'Sarah Johnson',
        riskType: 'turnover',
        riskScore: 0.87,
        factors: ['Low engagement score', 'No recent promotion', 'Market salary gap'],
        recommendedActions: ['Schedule retention conversation', 'Review compensation', 'Provide development opportunities'],
        confidence: 0.92
      },
      {
        employeeId: '2',
        employeeName: 'Ahmed Al-Rashid',
        riskType: 'performance',
        riskScore: 0.73,
        factors: ['Declining productivity metrics', 'Missed deadlines', 'Limited training completion'],
        recommendedActions: ['Provide additional training', 'Set clear goals', 'Regular check-ins'],
        confidence: 0.85
      }
    ]);
  };

  const runAdvancedAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate advanced analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Analysis Complete",
        description: "Advanced predictive analytics have been updated with latest data.",
      });
      
      // Refresh data
      await loadPredictiveData();
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to run advanced analytics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent text-accent-foreground';
      case 'training': return 'bg-primary text-primary-foreground';
      case 'needs_update': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-accent';
      case 'medium': return 'text-primary';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Predictive Analytics</h1>
          <p className="text-muted-foreground">AI-powered workforce forecasting and risk assessment</p>
        </div>
        <Button onClick={runAdvancedAnalysis} disabled={isAnalyzing} className="gap-2">
          {isAnalyzing ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Run Advanced Analysis
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.filter(m => m.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {models.length} total models
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(models.reduce((acc, m) => acc + m.accuracy, 0) / models.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictions Made</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {models.reduce((acc, m) => acc + m.predictions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {riskPredictions.filter(r => r.riskScore > 0.8).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Immediate attention needed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="forecasts">Workforce Forecasts</TabsTrigger>
          <TabsTrigger value="risks">Risk Predictions</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        {model.name}
                      </CardTitle>
                      <CardDescription>
                        Type: {model.type} | Last trained: {model.lastTrained.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span>{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Predictions Made:</span>
                      <span className="font-medium">{model.predictions.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-4">
          <div className="grid gap-4">
            {forecasts.map((forecast, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {forecast.department} Department
                  </CardTitle>
                  <CardDescription>
                    {forecast.timeframe} forecast
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="text-2xl font-bold">{forecast.currentHeadcount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Predicted</p>
                      <p className="text-2xl font-bold">{forecast.predictedHeadcount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Change</p>
                      <p className={`text-2xl font-bold flex items-center gap-1 ${
                        forecast.changePercent > 0 ? 'text-accent' : 'text-destructive'
                      }`}>
                        {forecast.changePercent > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {Math.abs(forecast.changePercent)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <Badge className={getRiskColor(forecast.riskLevel)}>
                        {forecast.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="grid gap-4">
            {riskPredictions.map((risk) => (
              <Card key={risk.employeeId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        {risk.employeeName}
                      </CardTitle>
                      <CardDescription>
                        {risk.riskType.charAt(0).toUpperCase() + risk.riskType.slice(1)} Risk
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-destructive">
                        {(risk.riskScore * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(risk.confidence * 100).toFixed(0)}% confidence
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-sm mb-2">Key Risk Factors:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {risk.factors.map((factor, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-destructive">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Recommended Actions:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {risk.recommendedActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-accent">→</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Workforce Trends</h4>
                    <p className="text-sm text-muted-foreground">
                      Engineering department shows strong growth potential with 15.6% projected increase. 
                      Consider accelerating recruitment efforts to meet demand.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Retention Risk</h4>
                    <p className="text-sm text-muted-foreground">
                      2 high-risk employees identified for turnover. Immediate intervention recommended 
                      to prevent talent loss.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Model Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Workforce Demand Model needs retraining. Consider updating with latest market data 
                      to improve forecast accuracy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};