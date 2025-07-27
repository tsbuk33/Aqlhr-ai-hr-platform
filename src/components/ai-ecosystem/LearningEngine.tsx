import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Zap, 
  Database,
  Network,
  Lightbulb,
  Activity,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LearningPattern {
  id: string;
  type: 'behavioral' | 'operational' | 'predictive' | 'compliance';
  name: string;
  description: string;
  confidence: number;
  frequency: number;
  accuracy: number;
  applications: string[];
  lastUpdated: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface KnowledgeArea {
  domain: string;
  expertise: number;
  patternsCount: number;
  recentGrowth: number;
  applications: number;
}

interface LearningMetrics {
  totalPatterns: number;
  dailyLearning: number;
  accuracyImprovement: number;
  knowledgeGrowth: number;
  adaptationSpeed: number;
  predictionAccuracy: number;
}

export const LearningEngine: React.FC = () => {
  const { toast } = useToast();
  
  const [learningMetrics, setLearningMetrics] = useState<LearningMetrics>({
    totalPatterns: 2847,
    dailyLearning: 34,
    accuracyImprovement: 12.7,
    knowledgeGrowth: 8.9,
    adaptationSpeed: 94,
    predictionAccuracy: 89.3
  });

  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([
    {
      id: '1',
      type: 'behavioral',
      name: 'Employee Performance Correlation',
      description: 'Strong correlation between training completion and performance ratings',
      confidence: 94,
      frequency: 156,
      accuracy: 91,
      applications: ['Performance Management', 'Training Recommendations', 'Career Planning'],
      lastUpdated: '2 hours ago',
      trend: 'increasing'
    },
    {
      id: '2',
      type: 'operational',
      name: 'Optimal Hiring Timeline',
      description: 'Best hiring outcomes occur with 3-week evaluation periods',
      confidence: 87,
      frequency: 89,
      accuracy: 85,
      applications: ['Recruitment Process', 'Timeline Optimization', 'Quality Assurance'],
      lastUpdated: '5 hours ago',
      trend: 'stable'
    },
    {
      id: '3',
      type: 'predictive',
      name: 'Turnover Risk Indicators',
      description: 'Combination of 7 factors predicts turnover with 89% accuracy',
      confidence: 92,
      frequency: 203,
      accuracy: 89,
      applications: ['Retention Strategy', 'Risk Management', 'Succession Planning'],
      lastUpdated: '1 hour ago',
      trend: 'increasing'
    },
    {
      id: '4',
      type: 'compliance',
      name: 'Regulation Change Impact',
      description: 'Pattern of how new regulations affect different employee categories',
      confidence: 96,
      frequency: 67,
      accuracy: 96,
      applications: ['Compliance Monitoring', 'Policy Updates', 'Risk Assessment'],
      lastUpdated: '3 hours ago',
      trend: 'stable'
    },
    {
      id: '5',
      type: 'behavioral',
      name: 'Team Productivity Patterns',
      description: 'Team size of 5-7 members shows optimal productivity outcomes',
      confidence: 88,
      frequency: 134,
      accuracy: 83,
      applications: ['Team Formation', 'Project Management', 'Resource Allocation'],
      lastUpdated: '4 hours ago',
      trend: 'increasing'
    }
  ]);

  const [knowledgeAreas] = useState<KnowledgeArea[]>([
    { domain: 'HR Operations', expertise: 94, patternsCount: 847, recentGrowth: 15, applications: 156 },
    { domain: 'Compliance Management', expertise: 97, patternsCount: 623, recentGrowth: 8, applications: 89 },
    { domain: 'Performance Analytics', expertise: 89, patternsCount: 534, recentGrowth: 22, applications: 134 },
    { domain: 'Recruitment Optimization', expertise: 91, patternsCount: 456, recentGrowth: 18, applications: 78 },
    { domain: 'Employee Engagement', expertise: 86, patternsCount: 387, recentGrowth: 25, applications: 112 }
  ]);

  const [activeTab, setActiveTab] = useState('patterns');

  useEffect(() => {
    // Simulate real-time learning updates
    const interval = setInterval(() => {
      setLearningMetrics(prev => ({
        ...prev,
        totalPatterns: prev.totalPatterns + Math.floor(Math.random() * 3),
        dailyLearning: prev.dailyLearning + Math.floor(Math.random() * 2),
        accuracyImprovement: Math.min(25, prev.accuracyImprovement + Math.random() * 0.5),
        adaptationSpeed: Math.min(100, prev.adaptationSpeed + Math.random() * 0.3)
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getPatternTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral': return 'bg-blue-500';
      case 'operational': return 'bg-green-500';
      case 'predictive': return 'bg-purple-500';
      case 'compliance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'decreasing': return <BarChart3 className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const initiateDeepLearning = () => {
    toast({
      title: "🧠 Deep Learning Session Started",
      description: "AI is analyzing recent data patterns and updating knowledge base...",
    });
  };

  const optimizePattern = (patternId: string) => {
    setLearningPatterns(prev => prev.map(p => 
      p.id === patternId 
        ? { ...p, confidence: Math.min(100, p.confidence + Math.random() * 5), accuracy: Math.min(100, p.accuracy + Math.random() * 3) }
        : p
    ));
    
    const pattern = learningPatterns.find(p => p.id === patternId);
    toast({
      title: "⚡ Pattern Optimized",
      description: `"${pattern?.name}" accuracy and confidence improved.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Learning Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{learningMetrics.totalPatterns.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Patterns</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">+{learningMetrics.dailyLearning}</div>
            <div className="text-sm text-muted-foreground">Daily Learning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">+{learningMetrics.accuracyImprovement.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Accuracy Gain</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">+{learningMetrics.knowledgeGrowth.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Knowledge Growth</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{learningMetrics.adaptationSpeed}%</div>
            <div className="text-sm text-muted-foreground">Adaptation Speed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{learningMetrics.predictionAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Management Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              AI Learning Management Center
            </CardTitle>
            <Button onClick={initiateDeepLearning} className="bg-primary">
              <Brain className="h-4 w-4 mr-2" />
              Deep Learning Session
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              <TabsTrigger value="adaptation">Adaptation Engine</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns" className="mt-6">
              <div className="space-y-4">
                {learningPatterns.map((pattern) => (
                  <Card key={pattern.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPatternTypeColor(pattern.type)} mt-2`} />
                          <div>
                            <h3 className="font-semibold text-lg">{pattern.name}</h3>
                            <p className="text-muted-foreground mt-1">{pattern.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="capitalize">
                                {pattern.type}
                              </Badge>
                              <Badge variant="secondary">
                                {pattern.frequency} occurrences
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            {getTrendIcon(pattern.trend)}
                            <span className="text-sm text-muted-foreground capitalize">{pattern.trend}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{pattern.lastUpdated}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Confidence</div>
                          <div className="flex items-center gap-2">
                            <Progress value={pattern.confidence} className="flex-1" />
                            <span className="text-sm font-medium">{pattern.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Accuracy</div>
                          <div className="flex items-center gap-2">
                            <Progress value={pattern.accuracy} className="flex-1" />
                            <span className="text-sm font-medium">{pattern.accuracy}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Frequency Score</div>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(100, pattern.frequency / 2)} className="flex-1" />
                            <span className="text-sm font-medium">{pattern.frequency}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Applications:</h4>
                          <div className="flex flex-wrap gap-2">
                            {pattern.applications.map((app, index) => (
                              <Badge key={index} variant="outline">{app}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => optimizePattern(pattern.id)} variant="outline">
                          <Zap className="h-4 w-4 mr-2" />
                          Optimize Pattern
                        </Button>
                        <Button variant="outline">
                          <Target className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="knowledge" className="mt-6">
              <div className="space-y-4">
                {knowledgeAreas.map((area, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">{area.domain}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>{area.patternsCount} patterns</span>
                              <span>{area.applications} applications</span>
                              <span className="text-green-600">+{area.recentGrowth}% growth</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{area.expertise}%</div>
                          <div className="text-sm text-muted-foreground">Expertise Level</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Expertise Level</span>
                          <span>{area.expertise}%</span>
                        </div>
                        <Progress value={area.expertise} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="adaptation" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Adaptation Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Real-time Adaptation</span>
                        <span>{learningMetrics.adaptationSpeed}%</span>
                      </div>
                      <Progress value={learningMetrics.adaptationSpeed} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Pattern Recognition</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Knowledge Integration</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Prediction Accuracy</span>
                        <span>{learningMetrics.predictionAccuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={learningMetrics.predictionAccuracy} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Recent Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-blue-50/50">
                        <div className="font-medium text-sm">Performance Optimization</div>
                        <div className="text-sm text-muted-foreground">
                          Discovered optimal team meeting frequency for 23% productivity increase
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50">
                        <div className="font-medium text-sm">Retention Strategy</div>
                        <div className="text-sm text-muted-foreground">
                          Identified key factors reducing turnover risk by 34%
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg border-l-4 border-l-purple-500 bg-purple-50/50">
                        <div className="font-medium text-sm">Compliance Automation</div>
                        <div className="text-sm text-muted-foreground">
                          Automated 78% of compliance checks with 99.2% accuracy
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};