import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AqlHRAIAssistant } from '@/components/ai';
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDashboardTrends } from "@/hooks/useDashboardTrends";
import { formatNumber, formatCurrency } from "@/lib/i18n/format";
import { Brain, TrendingUp, AlertTriangle, Users, Play, Eye, Settings, Zap } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PredictiveModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  status: 'active' | 'training' | 'deployed';
  lastTrained: Date;
  predictions: number;
  confidence: number;
}

interface Prediction {
  id: string;
  type: string;
  title: string;
  probability: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  description: string;
}

const PredictiveModeling = () => {
  const lang = 'en';
  const { analyticsData, loading } = useAnalytics();
  const { series } = useDashboardTrends(180); // 6 months of data
  
  const [selectedModel, setSelectedModel] = useState<string>('turnover');
  const [isRunningPrediction, setIsRunningPrediction] = useState(false);

  // AI Models data
  const models: PredictiveModel[] = [
    {
      id: 'turnover',
      name: 'Employee Turnover Prediction',
      type: 'turnoverPrediction',
      accuracy: 94.7,
      status: 'active',
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      predictions: 1247,
      confidence: 92.3
    },
    {
      id: 'performance',
      name: 'Performance Forecasting',
      type: 'performanceForecast',
      accuracy: 89.2,
      status: 'deployed',
      lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      predictions: 892,
      confidence: 88.7
    },
    {
      id: 'hiring',
      name: 'Hiring Demand Prediction',
      type: 'hiringDemand',
      accuracy: 91.8,
      status: 'active',
      lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      predictions: 456,
      confidence: 85.4
    },
    {
      id: 'salary',
      name: 'Salary Optimization Model',
      type: 'salaryOptimization',
      accuracy: 87.3,
      status: 'training',
      lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      predictions: 234,
      confidence: 82.1
    }
  ];

  // Sample predictions
  const predictions: Prediction[] = [
    {
      id: '1',
      type: 'turnover',
      title: 'High Turnover Risk - Engineering Team',
      probability: 87.3,
      impact: 'high',
      timeframe: 'Next 3 months',
      description: '12 engineers showing turnover risk patterns'
    },
    {
      id: '2',
      type: 'performance',
      title: 'Performance Decline - Sales Division',
      probability: 72.8,
      impact: 'medium',
      timeframe: 'Next quarter',
      description: 'Q1 performance may drop by 15-20%'
    },
    {
      id: '3',
      type: 'hiring',
      title: 'Increased Hiring Demand - IT Department',
      probability: 91.2,
      impact: 'high',
      timeframe: 'Next 6 months',
      description: 'Projected need for 25 additional IT professionals'
    },
    {
      id: '4',
      type: 'salary',
      title: 'Salary Adjustment Needed - Marketing',
      probability: 68.9,
      impact: 'medium',
      timeframe: 'Next review cycle',
      description: 'Market rates suggest 12% adjustment needed'
    }
  ];

  // Forecast data derived from trends
  const forecastData = series?.slice(-12).map((item, index) => ({
    month: new Date(Date.now() - (11 - index) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short' }),
    actual: item.total_employees || 0,
    predicted: (item.total_employees || 0) + Math.floor(Math.random() * 20) - 10,
    turnoverRisk: Math.floor(Math.random() * 30) + 10,
    performance: item.saudization_rate || 0
  })) || [];

  // Metrics
  const metrics = {
    predictionAccuracy: models.reduce((acc, model) => acc + model.accuracy, 0) / models.length,
    modelsDeployed: models.filter(m => m.status === 'deployed' || m.status === 'active').length,
    predictionsMade: models.reduce((acc, model) => acc + model.predictions, 0),
    businessValue: 5200000 // SAR
  };

  const handleRunPrediction = async () => {
    setIsRunningPrediction(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRunningPrediction(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'deployed': return 'bg-blue-500';
      case 'training': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'analytics.predictiveModeling.title': { en: 'Predictive Modeling', ar: 'النمذجة التنبؤية' },
      'analytics.predictiveModeling.description': { en: 'AI-powered workforce predictions and forecasting', ar: 'التنبؤات المدعومة بالذكاء الاصطناعي وتوقعات القوى العاملة' },
      'analytics.predictiveModeling.aiModels': { en: 'AI Models', ar: 'نماذج الذكاء الاصطناعي' },
      'analytics.predictiveModeling.predictions': { en: 'Predictions', ar: 'التنبؤات' },
      'analytics.predictiveModeling.forecasting': { en: 'Forecasting', ar: 'التنبؤ' },
      'analytics.predictiveModeling.runPrediction': { en: 'Run Prediction', ar: 'تشغيل التنبؤ' },
      'analytics.predictiveModeling.viewResults': { en: 'View Results', ar: 'عرض النتائج' },
      'analytics.predictiveModeling.metrics.predictionAccuracy': { en: 'Prediction Accuracy', ar: 'دقة التنبؤ' },
      'analytics.predictiveModeling.metrics.modelsDeployed': { en: 'Models Deployed', ar: 'النماذج المنشورة' },
      'analytics.predictiveModeling.metrics.predictionsMade': { en: 'Predictions Made', ar: 'التنبؤات المُنشأة' },
      'analytics.predictiveModeling.metrics.businessValue': { en: 'Business Value', ar: 'القيمة التجارية' }
    };
    
    return translations[key]?.[lang] || key;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('analytics.predictiveModeling.title')}</h1>
        <p className="text-muted-foreground">{t('analytics.predictiveModeling.description')}</p>
      </div>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {t('analytics.predictiveModeling.metrics.predictionAccuracy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatNumber(metrics.predictionAccuracy, lang)}%</div>
            <Progress value={metrics.predictionAccuracy} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-secondary" />
              {t('analytics.predictiveModeling.metrics.modelsDeployed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{formatNumber(metrics.modelsDeployed, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">Active models</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              {t('analytics.predictiveModeling.metrics.predictionsMade')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{formatNumber(metrics.predictionsMade, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              {t('analytics.predictiveModeling.metrics.businessValue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(metrics.businessValue, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">Cost savings generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Models Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {t('analytics.predictiveModeling.aiModels')}
              </CardTitle>
              <CardDescription>
                Manage and monitor your predictive AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(model.status)}`} />
                        <div>
                          <h4 className="font-semibold">{model.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last trained: {model.lastTrained.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Accuracy</p>
                        <p className="font-semibold">{model.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Predictions</p>
                        <p className="font-semibold">{model.predictions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <p className="font-semibold">{model.confidence}%</p>
                      </div>
                    </div>
                    
                    <Progress value={model.accuracy} className="h-2" />
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleRunPrediction}
                        disabled={isRunningPrediction}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {isRunningPrediction ? 'Running...' : t('analytics.predictiveModeling.runPrediction')}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="mr-2 h-4 w-4" />
                        {t('analytics.predictiveModeling.viewResults')}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictions & Alerts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t('analytics.predictiveModeling.predictions')}
              </CardTitle>
              <CardDescription>
                Active predictions and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <Alert key={prediction.id}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-sm">{prediction.title}</h5>
                          <Badge variant={getImpactColor(prediction.impact)}>
                            {prediction.impact}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">
                            {prediction.probability}% probability
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {prediction.timeframe}
                          </div>
                        </div>
                        <Progress value={prediction.probability} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {prediction.description}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forecasting Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('analytics.predictiveModeling.forecasting')}
          </CardTitle>
          <CardDescription>
            Workforce trends and predictions over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workforce" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workforce">Workforce Trends</TabsTrigger>
              <TabsTrigger value="turnover">Turnover Risk</TabsTrigger>
              <TabsTrigger value="performance">Performance Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workforce" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    opacity={0.6}
                    name="Actual"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stackId="2"
                    stroke="hsl(var(--secondary))" 
                    fill="hsl(var(--secondary))"
                    opacity={0.4}
                    strokeDasharray="5 5"
                    name="Predicted"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="turnover" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="turnoverRisk" 
                    fill="hsl(var(--destructive))"
                    name="Turnover Risk %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    name="Performance Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AqlHRAIAssistant 
        moduleContext="analytics.predictive" 
        companyId="demo-company"
      />
    </div>
  );
};

export default PredictiveModeling;