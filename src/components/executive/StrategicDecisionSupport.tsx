import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Brain,
  Lightbulb,
  Zap,
  Clock
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useAIDashboard } from '@/hooks/useAIDashboard';

interface ScenarioModel {
  id: string;
  name: string;
  description: string;
  parameters: {
    workforceGrowth: number;
    salaryIncrease: number;
    saudizationTarget: number;
    trainingInvestment: number;
  };
  predictions: {
    costImpact: number;
    productivityChange: number;
    complianceScore: number;
    employeeSatisfaction: number;
    roi: number;
    timeframe: number; // months
  };
  risks: string[];
  opportunities: string[];
  confidence: number;
}

interface DecisionOption {
  id: string;
  title: string;
  description: string;
  businessImpact: 'high' | 'medium' | 'low';
  implementationComplexity: 'low' | 'medium' | 'high';
  estimatedCost: number;
  estimatedBenefit: number;
  timeToImplement: number; // weeks
  riskLevel: 'low' | 'medium' | 'high';
  affectedEmployees: number;
  prerequisites: string[];
  successMetrics: string[];
}

const StrategicDecisionSupport: React.FC = () => {
  const aiDashboard = useAIDashboard();
  
  const [scenarios, setScenarios] = useState<ScenarioModel[]>([]);
  const [decisionOptions, setDecisionOptions] = useState<DecisionOption[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [customParameters, setCustomParameters] = useState({
    workforceGrowth: 10,
    salaryIncrease: 5,
    saudizationTarget: 70,
    trainingInvestment: 500000
  });

  useEffect(() => {
    generateScenarioModels();
    generateDecisionOptions();
  }, [aiDashboard]);

  const generateScenarioModels = () => {
    const scenarioModels: ScenarioModel[] = [
      {
        id: 'aggressive-growth',
        name: 'Aggressive Growth Strategy',
        description: 'Rapid expansion with 25% workforce increase and premium compensation',
        parameters: {
          workforceGrowth: 25,
          salaryIncrease: 15,
          saudizationTarget: 75,
          trainingInvestment: 2000000
        },
        predictions: {
          costImpact: 8500000,
          productivityChange: 35,
          complianceScore: 92,
          employeeSatisfaction: 88,
          roi: 280,
          timeframe: 18
        },
        risks: [
          'High initial capital investment required',
          'Potential talent acquisition challenges',
          'Market volatility impact on ROI'
        ],
        opportunities: [
          'Market leadership positioning',
          'Enhanced competitive advantage',
          'Accelerated digital transformation'
        ],
        confidence: 82
      },
      {
        id: 'balanced-optimization',
        name: 'Balanced Optimization',
        description: 'Steady growth with focus on efficiency and compliance',
        parameters: {
          workforceGrowth: 12,
          salaryIncrease: 8,
          saudizationTarget: 68,
          trainingInvestment: 1200000
        },
        predictions: {
          costImpact: 4200000,
          productivityChange: 22,
          complianceScore: 96,
          employeeSatisfaction: 84,
          roi: 320,
          timeframe: 12
        },
        risks: [
          'Slower market penetration',
          'Competitor advantage in aggressive markets'
        ],
        opportunities: [
          'Sustainable long-term growth',
          'Enhanced operational efficiency',
          'Strong compliance foundation'
        ],
        confidence: 94
      },
      {
        id: 'efficiency-focus',
        name: 'Efficiency-First Strategy',
        description: 'Minimal growth with maximum operational optimization',
        parameters: {
          workforceGrowth: 5,
          salaryIncrease: 3,
          saudizationTarget: 65,
          trainingInvestment: 800000
        },
        predictions: {
          costImpact: 1800000,
          productivityChange: 18,
          complianceScore: 94,
          employeeSatisfaction: 76,
          roi: 380,
          timeframe: 8
        },
        risks: [
          'Limited growth potential',
          'Talent retention challenges',
          'Market share stagnation'
        ],
        opportunities: [
          'Maximized profitability',
          'Streamlined operations',
          'Enhanced automation benefits'
        ],
        confidence: 89
      }
    ];

    setScenarios(scenarioModels);
    if (!selectedScenario && scenarioModels.length > 0) {
      setSelectedScenario(scenarioModels[0].id);
    }
  };

  const generateDecisionOptions = () => {
    const options: DecisionOption[] = [
      {
        id: 'ai-automation-expansion',
        title: 'Expand AI Automation Across All Modules',
        description: 'Implement advanced AI automation in remaining manual processes to increase efficiency by 40%',
        businessImpact: 'high',
        implementationComplexity: 'medium',
        estimatedCost: 1500000,
        estimatedBenefit: 6000000,
        timeToImplement: 16,
        riskLevel: 'medium',
        affectedEmployees: 850,
        prerequisites: [
          'Technical team upskilling',
          'Infrastructure upgrade',
          'Change management program'
        ],
        successMetrics: [
          '40% reduction in manual processes',
          '25% increase in processing speed',
          '60% improvement in accuracy',
          'ROI of 300% within 24 months'
        ]
      },
      {
        id: 'government-integration-enhancement',
        title: 'Advanced Government Integration Platform',
        description: 'Develop next-generation integration with all Saudi government systems for real-time compliance',
        businessImpact: 'high',
        implementationComplexity: 'high',
        estimatedCost: 2200000,
        estimatedBenefit: 8500000,
        timeToImplement: 24,
        riskLevel: 'low',
        affectedEmployees: 1200,
        prerequisites: [
          'Government partnership agreements',
          'Security certification upgrades',
          'Legal compliance review'
        ],
        successMetrics: [
          '100% real-time compliance monitoring',
          '90% reduction in compliance errors',
          '50% faster government reporting',
          'Zero compliance penalties'
        ]
      },
      {
        id: 'predictive-workforce-planning',
        title: 'AI-Powered Predictive Workforce Planning',
        description: 'Deploy machine learning models for accurate workforce demand forecasting and strategic planning',
        businessImpact: 'high',
        implementationComplexity: 'medium',
        estimatedCost: 1800000,
        estimatedBenefit: 7200000,
        timeToImplement: 20,
        riskLevel: 'low',
        affectedEmployees: 2000,
        prerequisites: [
          'Historical data preparation',
          'AI model training',
          'Executive dashboard development'
        ],
        successMetrics: [
          '95% accuracy in workforce predictions',
          '30% reduction in hiring costs',
          '25% improvement in resource allocation',
          'Strategic planning efficiency increase of 60%'
        ]
      },
      {
        id: 'employee-experience-platform',
        title: 'Next-Generation Employee Experience Platform',
        description: 'Create comprehensive digital experience platform with AI-powered personalization',
        businessImpact: 'medium',
        implementationComplexity: 'medium',
        estimatedCost: 1200000,
        estimatedBenefit: 4800000,
        timeToImplement: 14,
        riskLevel: 'low',
        affectedEmployees: 2500,
        prerequisites: [
          'User experience research',
          'Mobile application development',
          'AI personalization engine'
        ],
        successMetrics: [
          '90% employee satisfaction score',
          '40% increase in self-service usage',
          '35% reduction in HR support tickets',
          '20% improvement in employee retention'
        ]
      }
    ];

    setDecisionOptions(options);
  };

  const runScenarioAnalysis = async () => {
    setIsRunningAnalysis(true);
    
    // Simulate AI-powered scenario analysis
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Update scenarios with new analysis
    generateScenarioModels();
    
    setIsRunningAnalysis(false);
  };

  const createCustomScenario = () => {
    const customScenario: ScenarioModel = {
      id: 'custom-scenario',
      name: 'Custom Strategy',
      description: 'User-defined parameters for strategic analysis',
      parameters: customParameters,
      predictions: {
        costImpact: customParameters.workforceGrowth * 200000 + customParameters.trainingInvestment,
        productivityChange: customParameters.workforceGrowth * 1.5 + customParameters.trainingInvestment / 100000,
        complianceScore: Math.min(95, customParameters.saudizationTarget + 20),
        employeeSatisfaction: Math.min(95, 60 + customParameters.salaryIncrease * 2),
        roi: Math.max(150, 400 - customParameters.workforceGrowth * 5),
        timeframe: Math.max(6, customParameters.workforceGrowth)
      },
      risks: ['Custom parameter risks to be evaluated'],
      opportunities: ['Custom optimization opportunities'],
      confidence: 75
    };

    setScenarios(prev => {
      const filtered = prev.filter(s => s.id !== 'custom-scenario');
      return [...filtered, customScenario];
    });
    setSelectedScenario('custom-scenario');
  };

  const getSelectedScenario = () => {
    return scenarios.find(s => s.id === selectedScenario);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-status-danger';
      case 'medium': return 'text-status-warning';
      case 'low': return 'text-status-success';
      default: return 'text-foreground-muted';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-status-danger/10 text-status-danger border-status-danger/20';
      case 'medium': return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      case 'low': return 'bg-status-success/10 text-status-success border-status-success/20';
      default: return 'bg-surface/10 text-foreground-muted border-border/20';
    }
  };

  const scenario = getSelectedScenario();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Strategic Decision Support</h2>
          <p className="text-muted-foreground">AI-powered scenario modeling and decision optimization</p>
        </div>
        <Button 
          onClick={runScenarioAnalysis} 
          disabled={isRunningAnalysis}
          className="bg-primary hover:bg-primary/90"
        >
          {isRunningAnalysis ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Scenario Modeling</TabsTrigger>
          <TabsTrigger value="decisions">Decision Options</TabsTrigger>
          <TabsTrigger value="optimization">Resource Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Strategic Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedScenario === scenario.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{scenario.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {scenario.confidence}% confident
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {scenario.description}
                    </p>
                  </div>
                ))}
                
                {/* Custom Scenario Builder */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium">Custom Scenario</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Workforce Growth %</Label>
                      <Input
                        type="number"
                        value={customParameters.workforceGrowth}
                        onChange={(e) => setCustomParameters(prev => ({
                          ...prev,
                          workforceGrowth: parseInt(e.target.value) || 0
                        }))}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Salary Increase %</Label>
                      <Input
                        type="number"
                        value={customParameters.salaryIncrease}
                        onChange={(e) => setCustomParameters(prev => ({
                          ...prev,
                          salaryIncrease: parseInt(e.target.value) || 0
                        }))}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Saudization Target %</Label>
                      <Input
                        type="number"
                        value={customParameters.saudizationTarget}
                        onChange={(e) => setCustomParameters(prev => ({
                          ...prev,
                          saudizationTarget: parseInt(e.target.value) || 0
                        }))}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Training Investment</Label>
                      <Input
                        type="number"
                        value={customParameters.trainingInvestment}
                        onChange={(e) => setCustomParameters(prev => ({
                          ...prev,
                          trainingInvestment: parseInt(e.target.value) || 0
                        }))}
                        className="h-8"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={createCustomScenario} 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                  >
                    Create Custom Scenario
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Analysis */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    {scenario?.name} Analysis
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {scenario?.predictions.timeframe} months timeline
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {scenario && (
                  <>
                    {/* Key Predictions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="text-xl font-bold text-primary">
                          {scenario.predictions.roi}%
                        </div>
                        <div className="text-xs text-primary/80">Expected ROI</div>
                      </div>
                      <div className="text-center p-3 bg-brand-success/10 rounded-lg border border-brand-success/20">
                        <div className="text-xl font-bold text-brand-success">
                          +{scenario.predictions.productivityChange}%
                        </div>
                        <div className="text-xs text-brand-success/80">Productivity</div>
                      </div>
                      <div className="text-center p-3 bg-brand-warning/10 rounded-lg border border-brand-warning/20">
                        <div className="text-xl font-bold text-brand-warning">
                          {(scenario.predictions.costImpact / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-brand-warning/80">Cost Impact (SAR)</div>
                      </div>
                      <div className="text-center p-3 bg-brand-accent/10 rounded-lg border border-brand-accent/20">
                        <div className="text-xl font-bold text-brand-accent">
                          {scenario.predictions.complianceScore}%
                        </div>
                        <div className="text-xs text-brand-accent/80">Compliance</div>
                      </div>
                    </div>

                    {/* Parameters */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Scenario Parameters</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Workforce Growth</span>
                            <span className="font-medium">{scenario.parameters.workforceGrowth}%</span>
                          </div>
                          <Progress value={scenario.parameters.workforceGrowth} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Salary Increase</span>
                            <span className="font-medium">{scenario.parameters.salaryIncrease}%</span>
                          </div>
                          <Progress value={scenario.parameters.salaryIncrease} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Saudization Target</span>
                            <span className="font-medium">{scenario.parameters.saudizationTarget}%</span>
                          </div>
                          <Progress value={scenario.parameters.saudizationTarget} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Training Investment</span>
                            <span className="font-medium">
                              {(scenario.parameters.trainingInvestment / 1000000).toFixed(1)}M SAR
                            </span>
                          </div>
                          <Progress 
                            value={(scenario.parameters.trainingInvestment / 2000000) * 100} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Risks and Opportunities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-status-danger flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Key Risks
                        </h4>
                        <ul className="space-y-1">
                          {scenario.risks.map((risk, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start">
                              <span className="text-status-danger mr-2">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-brand-success flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Opportunities
                        </h4>
                        <ul className="space-y-1">
                          {scenario.opportunities.map((opportunity, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start">
                              <span className="text-brand-success mr-2">•</span>
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {decisionOptions.map((option) => (
              <Card key={option.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${getImpactColor(option.businessImpact)} text-xs`}
                    >
                      {option.businessImpact.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Investment</span>
                      <p className="text-lg font-bold text-status-danger">
                        {(option.estimatedCost / 1000000).toFixed(1)}M SAR
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Expected Benefit</span>
                      <p className="text-lg font-bold text-brand-success">
                        {(option.estimatedBenefit / 1000000).toFixed(1)}M SAR
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Implementation Time</span>
                      <p className="text-lg font-bold text-primary">{option.timeToImplement} weeks</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">ROI</span>
                      <p className="text-lg font-bold text-brand-accent">
                        {Math.round((option.estimatedBenefit / option.estimatedCost) * 100)}%
                      </p>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk Level</span>
                    <Badge variant="outline" className={getRiskColor(option.riskLevel)}>
                      {option.riskLevel.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Affected Employees */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Affected Employees</span>
                    <span className="text-sm font-bold">{option.affectedEmployees.toLocaleString()}</span>
                  </div>

                  {/* Prerequisites */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Prerequisites</span>
                    <ul className="space-y-1">
                      {option.prerequisites.slice(0, 3).map((prereq, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-brand-success" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm">
                      View Full Analysis
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Execute Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Resource Optimization Recommendations
              </CardTitle>
              <CardDescription>
                AI-driven suggestions for optimal resource allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-brand-success/10 border-brand-success/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-brand-success">Cost Savings Potential</p>
                        <p className="text-2xl font-bold text-brand-success">15.2M SAR</p>
                        <p className="text-xs text-brand-success/80">Through automation optimization</p>
                      </div>
                      <CurrencyIcon className="h-8 w-8 text-brand-success/50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">Efficiency Gains</p>
                        <p className="text-2xl font-bold text-primary">42%</p>
                        <p className="text-xs text-primary/80">Process optimization potential</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary/50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-brand-warning/10 border-brand-warning/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-brand-warning">Time Reduction</p>
                        <p className="text-2xl font-bold text-brand-warning">67%</p>
                        <p className="text-xs text-brand-warning/80">In administrative tasks</p>
                      </div>
                      <Clock className="h-8 w-8 text-brand-warning/50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Top Optimization Opportunities</h4>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Automate Employee Onboarding Process',
                      impact: '85% time reduction, 12M SAR annual savings',
                      complexity: 'Medium',
                      timeline: '8 weeks'
                    },
                    {
                      title: 'Implement Predictive Attendance Analytics',
                      impact: '30% improvement in workforce planning',
                      complexity: 'Low',
                      timeline: '4 weeks'
                    },
                    {
                      title: 'Optimize Cross-Module Data Flow',
                      impact: '50% faster processing, 98% accuracy',
                      complexity: 'High',
                      timeline: '16 weeks'
                    }
                  ].map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium">{opportunity.title}</h5>
                          <p className="text-sm text-muted-foreground mt-1">{opportunity.impact}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {opportunity.complexity} complexity
                          </Badge>
                          <p className="text-xs text-muted-foreground">{opportunity.timeline}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicDecisionSupport;