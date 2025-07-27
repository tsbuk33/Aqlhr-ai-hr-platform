import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign,
  Target,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Decision {
  id: string;
  type: 'strategic' | 'operational' | 'compliance' | 'performance';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'analyzing' | 'ready' | 'approved' | 'implemented';
  reasoning: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  expectedOutcome: string;
  timeline: string;
  affectedEmployees?: number;
  estimatedSavings?: number;
  complianceScore: number;
  createdAt: string;
}

interface DecisionMetrics {
  totalDecisions: number;
  pendingDecisions: number;
  accuracyRate: number;
  avgConfidence: number;
  implementationSuccess: number;
  timeSaved: number;
}

export const AIDecisionEngine: React.FC = () => {
  const { toast } = useToast();
  
  const [decisions, setDecisions] = useState<Decision[]>([
    {
      id: '1',
      type: 'strategic',
      title: 'Increase Saudization in IT Department',
      description: 'Recommend hiring 3 Saudi nationals for IT positions to meet Nitaqat requirements',
      confidence: 94,
      impact: 'high',
      status: 'ready',
      reasoning: [
        'Current Saudization rate in IT: 23% (below 35% target)',
        'Predicted compliance risk: High within 90 days',
        'Available qualified candidates: 12 profiles matched',
        'Budget impact: Within allocated HR budget'
      ],
      riskAssessment: {
        level: 'medium',
        factors: ['Skills gap in emerging technologies', 'Training investment required']
      },
      expectedOutcome: 'Achieve 38% Saudization rate, maintain Nitaqat Green status',
      timeline: '45-60 days',
      affectedEmployees: 3,
      estimatedSavings: 85000,
      complianceScore: 97,
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      type: 'performance',
      title: 'Promote Sarah Al-Rashid to Team Lead',
      description: 'Performance analytics indicate strong leadership potential and team impact',
      confidence: 91,
      impact: 'medium',
      status: 'analyzing',
      reasoning: [
        'Performance score: 96/100 (top 5% of department)',
        'Leadership assessment: Excellent communication skills',
        'Team collaboration metrics: 89% positive feedback',
        'Project delivery: 100% on-time completion rate'
      ],
      riskAssessment: {
        level: 'low',
        factors: ['Limited management experience', 'Team dynamics adjustment period']
      },
      expectedOutcome: 'Improved team productivity and employee satisfaction',
      timeline: '30 days',
      affectedEmployees: 8,
      complianceScore: 100,
      createdAt: '4 hours ago'
    },
    {
      id: '3',
      type: 'compliance',
      title: 'Update Employee Contracts',
      description: 'Recent labor law changes require contract amendments for 47 employees',
      confidence: 98,
      impact: 'critical',
      status: 'pending',
      reasoning: [
        'New labor law effective from next month',
        'Current contracts non-compliant in 3 areas',
        'MOL inspection probability: High (due date approaching)',
        'Legal risk assessment: Critical if not addressed'
      ],
      riskAssessment: {
        level: 'high',
        factors: ['Regulatory penalties', 'Employee relations impact', 'Operational disruption']
      },
      expectedOutcome: 'Full regulatory compliance, avoid penalties',
      timeline: '14 days',
      affectedEmployees: 47,
      complianceScore: 99,
      createdAt: '6 hours ago'
    },
    {
      id: '4',
      type: 'operational',
      title: 'Optimize Shift Schedules',
      description: 'AI analysis suggests 15% efficiency improvement with schedule optimization',
      confidence: 87,
      impact: 'medium',
      status: 'ready',
      reasoning: [
        'Current schedule utilization: 73%',
        'Peak productivity hours identified: 9-11 AM, 2-4 PM',
        'Employee preference analysis: 68% favor flexible hours',
        'Productivity correlation: Strong positive trend'
      ],
      riskAssessment: {
        level: 'low',
        factors: ['Initial adjustment period', 'Customer service coverage']
      },
      expectedOutcome: '15% productivity increase, improved work-life balance',
      timeline: '21 days',
      affectedEmployees: 23,
      estimatedSavings: 42000,
      complianceScore: 95,
      createdAt: '8 hours ago'
    }
  ]);

  const [metrics, setMetrics] = useState<DecisionMetrics>({
    totalDecisions: 247,
    pendingDecisions: 12,
    accuracyRate: 94.7,
    avgConfidence: 91.2,
    implementationSuccess: 89.4,
    timeSaved: 67
  });

  const [activeTab, setActiveTab] = useState('pending');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'analyzing': return <Brain className="h-4 w-4 animate-pulse" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <Target className="h-4 w-4" />;
      case 'implemented': return <Zap className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const approveDecision = (decisionId: string) => {
    setDecisions(prev => prev.map(d => 
      d.id === decisionId ? { ...d, status: 'approved' } : d
    ));
    
    const decision = decisions.find(d => d.id === decisionId);
    toast({
      title: "🤖 Decision Approved",
      description: `"${decision?.title}" has been approved for implementation.`,
    });
  };

  const implementDecision = (decisionId: string) => {
    setDecisions(prev => prev.map(d => 
      d.id === decisionId ? { ...d, status: 'implemented' } : d
    ));
    
    const decision = decisions.find(d => d.id === decisionId);
    toast({
      title: "⚡ Decision Implemented",
      description: `"${decision?.title}" is now being executed by the AI system.`,
    });
  };

  const filteredDecisions = decisions.filter(decision => {
    switch (activeTab) {
      case 'pending': return ['pending', 'analyzing'].includes(decision.status);
      case 'ready': return decision.status === 'ready';
      case 'approved': return decision.status === 'approved';
      case 'implemented': return decision.status === 'implemented';
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{metrics.totalDecisions}</div>
            <div className="text-sm text-muted-foreground">Total Decisions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{metrics.pendingDecisions}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.accuracyRate}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.avgConfidence}%</div>
            <div className="text-sm text-muted-foreground">Confidence</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.implementationSuccess}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.timeSaved}%</div>
            <div className="text-sm text-muted-foreground">Time Saved</div>
          </CardContent>
        </Card>
      </div>

      {/* Decisions Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Decision Management Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({decisions.filter(d => ['pending', 'analyzing'].includes(d.status)).length})</TabsTrigger>
              <TabsTrigger value="ready">Ready ({decisions.filter(d => d.status === 'ready').length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({decisions.filter(d => d.status === 'approved').length})</TabsTrigger>
              <TabsTrigger value="implemented">Implemented ({decisions.filter(d => d.status === 'implemented').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredDecisions.map((decision) => (
                  <Card key={decision.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getStatusIcon(decision.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{decision.title}</h3>
                            <p className="text-muted-foreground mt-1">{decision.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={getImpactColor(decision.impact)} className="capitalize">
                                {decision.impact} Impact
                              </Badge>
                              <Badge variant="outline">
                                {decision.confidence}% Confidence
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {decision.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{decision.createdAt}</div>
                          <div className="text-sm text-muted-foreground">{decision.timeline}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {decision.affectedEmployees && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{decision.affectedEmployees} employees</span>
                          </div>
                        )}
                        {decision.estimatedSavings && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{decision.estimatedSavings.toLocaleString()} SAR</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Compliance: {decision.complianceScore}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${getRiskColor(decision.riskAssessment.level)}`} />
                          <span className={`text-sm capitalize ${getRiskColor(decision.riskAssessment.level)}`}>
                            {decision.riskAssessment.level} Risk
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">AI Reasoning:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {decision.reasoning.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Expected Outcome:</h4>
                          <p className="text-sm text-muted-foreground">{decision.expectedOutcome}</p>
                        </div>

                        {decision.riskAssessment.factors.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Risk Factors:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {decision.riskAssessment.factors.map((factor, index) => (
                                <li key={index}>{factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        {decision.status === 'ready' && (
                          <Button onClick={() => approveDecision(decision.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Decision
                          </Button>
                        )}
                        {decision.status === 'approved' && (
                          <Button onClick={() => implementDecision(decision.id)} variant="outline">
                            <Zap className="h-4 w-4 mr-2" />
                            Implement Now
                          </Button>
                        )}
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};