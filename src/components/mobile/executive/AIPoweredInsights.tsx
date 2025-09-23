import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Users,
  Target,
  Zap,
  Eye,
  MessageSquare,
  RefreshCw,
  Star
} from 'lucide-react';

interface AIPoweredInsightsProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const AIPoweredInsights: React.FC<AIPoweredInsightsProps> = ({ screenSize }) => {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const aiInsights = [
    {
      id: 'productivity-spike',
      type: 'opportunity',
      priority: 'high',
      title: 'Productivity Optimization Opportunity',
      description: 'AI detected 15% productivity increase potential in Engineering team through task reallocation.',
      impact: '+$340K annual revenue',
      confidence: 94,
      actionable: true,
      icon: TrendingUp,
      color: 'green',
      recommendations: [
        'Redistribute high-complexity tasks to senior developers',
        'Implement pair programming for junior developers',
        'Optimize sprint planning cycles'
      ]
    },
    {
      id: 'retention-risk',
      type: 'risk',
      priority: 'critical',
      title: 'Employee Retention Risk Alert',
      description: 'AI predicts 23% chance of key talent departure in Sales department within 60 days.',
      impact: 'High business continuity risk',
      confidence: 87,
      actionable: true,
      icon: AlertTriangle,
      color: 'red',
      recommendations: [
        'Schedule 1:1 meetings with at-risk employees',
        'Review compensation packages',
        'Implement retention bonus program'
      ]
    },
    {
      id: 'market-expansion',
      type: 'opportunity',
      priority: 'medium',
      title: 'Market Expansion Readiness',
      description: 'Current workforce capacity supports 40% business growth without additional hiring.',
      impact: '+$850K market opportunity',
      confidence: 76,
      actionable: true,
      icon: Target,
      color: 'blue',
      recommendations: [
        'Launch expansion planning committee',
        'Identify key market segments',
        'Prepare scaling protocols'
      ]
    },
    {
      id: 'automation-potential',
      type: 'optimization',
      priority: 'high',
      title: 'Process Automation Potential',
      description: 'AI identified 12 manual processes suitable for automation, saving 180 hours/month.',
      impact: '+$45K monthly savings',
      confidence: 91,
      actionable: true,
      icon: Zap,
      color: 'purple',
      recommendations: [
        'Prioritize payroll processing automation',
        'Implement document workflow automation',
        'Deploy chatbot for routine inquiries'
      ]
    }
  ];

  useEffect(() => {
    setInsights(aiInsights);
  }, []);

  const generateNewInsights = async () => {
    setLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setInsights([...aiInsights].sort(() => Math.random() - 0.5));
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      case 'optimization': return <Zap className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-500';
      case 'risk': return 'bg-red-500';
      case 'optimization': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
            <p className="text-sm text-muted-foreground">Executive intelligence and recommendations</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateNewInsights}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {!loading && <span className="ml-2">Refresh</span>}
        </Button>
      </div>

      {/* AI Status */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Analysis Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Confidence Score</span>
              <Badge className="bg-green-500 text-white">87%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(insight.type)}`}>
                    {getTypeIcon(insight.type)}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        className={`${getPriorityColor(insight.priority)} text-white text-xs`}
                      >
                        {insight.priority.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Business Impact</span>
                  </div>
                  <p className="text-sm font-bold text-primary">{insight.impact}</p>
                </div>

                {insight.recommendations && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">AI Recommendations</span>
                    </div>
                    <ul className="space-y-1 ml-6">
                      {insight.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {insight.actionable && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Learning Status */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <div className="flex-1">
              <h4 className="font-medium text-purple-900">Continuous Learning Active</h4>
              <p className="text-sm text-purple-700">
                AI is analyzing 47 data sources and generating new insights every 15 minutes
              </p>
            </div>
            <Badge className="bg-purple-500 text-white">LIVE</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};