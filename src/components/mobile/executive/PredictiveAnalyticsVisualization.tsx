import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gem,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  Calendar,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, ComposedChart, Scatter } from 'recharts';

interface PredictiveAnalyticsVisualizationProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const PredictiveAnalyticsVisualization: React.FC<PredictiveAnalyticsVisualizationProps> = ({ screenSize }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('6months');

  // Predictive data sets
  const revenueForecasting = [
    { month: 'Jul 23', actual: 2400000, predicted: 2400000, confidence: 100 },
    { month: 'Aug 23', actual: 2650000, predicted: 2620000, confidence: 98 },
    { month: 'Sep 23', actual: 2800000, predicted: 2780000, confidence: 96 },
    { month: 'Oct 23', actual: 3100000, predicted: 3080000, confidence: 94 },
    { month: 'Nov 23', actual: 3350000, predicted: 3320000, confidence: 92 },
    { month: 'Dec 23', actual: 3600000, predicted: 3580000, confidence: 90 },
    { month: 'Jan 24', actual: null, predicted: 3820000, confidence: 87 },
    { month: 'Feb 24', actual: null, predicted: 4100000, confidence: 85 },
    { month: 'Mar 24', actual: null, predicted: 4380000, confidence: 82 },
    { month: 'Apr 24', actual: null, predicted: 4650000, confidence: 79 },
    { month: 'May 24', actual: null, predicted: 4920000, confidence: 76 },
    { month: 'Jun 24', actual: null, predicted: 5200000, confidence: 73 }
  ];

  const workforceGrowth = [
    { month: 'Jul 23', employees: 247, predicted: 247, turnover: 3.2 },
    { month: 'Aug 23', employees: 252, predicted: 251, turnover: 2.8 },
    { month: 'Sep 23', employees: 258, predicted: 256, turnover: 3.1 },
    { month: 'Oct 23', employees: 264, predicted: 262, turnover: 2.5 },
    { month: 'Nov 23', employees: 271, predicted: 269, turnover: 2.9 },
    { month: 'Dec 23', employees: 278, predicted: 276, turnover: 3.4 },
    { month: 'Jan 24', employees: null, predicted: 285, turnover: 3.0 },
    { month: 'Feb 24', employees: null, predicted: 293, turnover: 2.8 },
    { month: 'Mar 24', employees: null, predicted: 301, turnover: 2.6 },
    { month: 'Apr 24', employees: null, predicted: 309, turnover: 2.4 },
    { month: 'May 24', employees: null, predicted: 318, turnover: 2.2 },
    { month: 'Jun 24', employees: null, predicted: 327, turnover: 2.0 }
  ];

  const performanceMetrics = [
    { quarter: 'Q1 23', productivity: 89, satisfaction: 7.8, retention: 94.2 },
    { quarter: 'Q2 23', productivity: 91, satisfaction: 8.1, retention: 95.1 },
    { quarter: 'Q3 23', productivity: 93, satisfaction: 8.3, retention: 96.2 },
    { quarter: 'Q4 23', productivity: 94, satisfaction: 8.5, retention: 96.8 },
    { quarter: 'Q1 24', productivity: 96, satisfaction: 8.7, retention: 97.2 },
    { quarter: 'Q2 24', productivity: 97, satisfaction: 8.9, retention: 97.8 }
  ];

  const riskAssessment = [
    { category: 'Talent Risk', current: 15, predicted: 12, severity: 'medium' },
    { category: 'Operational Risk', current: 8, predicted: 6, severity: 'low' },
    { category: 'Financial Risk', current: 22, predicted: 18, severity: 'high' },
    { category: 'Compliance Risk', current: 5, predicted: 3, severity: 'low' },
    { category: 'Market Risk', current: 28, predicted: 35, severity: 'high' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Predictive Analytics</h3>
            <p className="text-sm text-muted-foreground">Future trends and forecasting</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={timeRange === '3months' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('3months')}
          >
            3M
          </Button>
          <Button 
            variant={timeRange === '6months' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('6months')}
          >
            6M
          </Button>
          <Button 
            variant={timeRange === '1year' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('1year')}
          >
            1Y
          </Button>
        </div>
      </div>

      {/* Prediction Accuracy */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium">Model Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">92.4%</Badge>
              <span className="text-xs text-muted-foreground">Last 30 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className={`grid w-full ${screenSize === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="revenue" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className={screenSize === 'mobile' ? 'text-xs' : 'text-sm'}>Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="workforce" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className={screenSize === 'mobile' ? 'text-xs' : 'text-sm'}>Workforce</span>
          </TabsTrigger>
          {screenSize !== 'mobile' && (
            <>
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Risk</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Revenue Forecasting */}
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-lg font-bold text-green-600">$3.6M</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Next Month</p>
                    <p className="text-lg font-bold text-blue-600">$3.8M</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Q2 Forecast</p>
                    <p className="text-lg font-bold text-purple-600">$4.9M</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <p className="text-lg font-bold text-indigo-600">+18.5%</p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={revenueForecasting}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Actual"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workforce Forecasting */}
        <TabsContent value="workforce" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Workforce Growth Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current Size</p>
                    <p className="text-lg font-bold">278 employees</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Predicted Size</p>
                    <p className="text-lg font-bold text-blue-600">327 employees</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <p className="text-lg font-bold text-green-600">+17.6%</p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={workforceGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="employees" 
                        stackId="1" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                        name="Actual"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="predicted" 
                        stackId="2" 
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.3}
                        name="Predicted"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Forecasting */}
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="productivity" stroke="#10b981" name="Productivity %" />
                    <Line type="monotone" dataKey="satisfaction" stroke="#3b82f6" name="Satisfaction" />
                    <Line type="monotone" dataKey="retention" stroke="#8b5cf6" name="Retention %" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment */}
        <TabsContent value="risk" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessment.map((risk, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{risk.category}</span>
                      <Badge className={getSeverityColor(risk.severity)}>
                        {risk.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Current: {risk.current}%</span>
                          <span>Predicted: {risk.predicted}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                            style={{ width: `${risk.current}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};