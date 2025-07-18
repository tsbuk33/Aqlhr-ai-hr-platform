import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Database, 
  TrendingUp, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DataSource {
  id: string;
  name: string;
  type: 'government' | 'market' | 'social' | 'internal' | 'global';
  status: 'active' | 'syncing' | 'error' | 'offline';
  lastSync: string;
  dataPoints: number;
  reliability: number;
  updateFrequency: string;
  criticalAlerts: number;
}

interface Intelligence {
  id: string;
  category: 'compliance' | 'market' | 'workforce' | 'financial' | 'strategic';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
  actionRequired: boolean;
  relevantModules: string[];
}

interface AIAnalysis {
  totalSources: number;
  activeConnections: number;
  dataPointsToday: number;
  intelligenceGenerated: number;
  predictionAccuracy: number;
  complianceScore: number;
}

export const IntelligenceGatherer: React.FC = () => {
  const { toast } = useToast();
  
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    totalSources: 47,
    activeConnections: 44,
    dataPointsToday: 125847,
    intelligenceGenerated: 234,
    predictionAccuracy: 91.7,
    complianceScore: 98.3
  });

  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'HRSD Government Portal',
      type: 'government',
      status: 'active',
      lastSync: '2 minutes ago',
      dataPoints: 15234,
      reliability: 98,
      updateFrequency: 'Real-time',
      criticalAlerts: 0
    },
    {
      id: '2',
      name: 'Qiwa Platform',
      type: 'government',
      status: 'syncing',
      lastSync: '5 minutes ago',
      dataPoints: 8967,
      reliability: 96,
      updateFrequency: 'Hourly',
      criticalAlerts: 1
    },
    {
      id: '3',
      name: 'GOSI Integration',
      type: 'government',
      status: 'active',
      lastSync: '1 minute ago',
      dataPoints: 12445,
      reliability: 99,
      updateFrequency: 'Real-time',
      criticalAlerts: 0
    },
    {
      id: '4',
      name: 'Saudi Market Intelligence',
      type: 'market',
      status: 'active',
      lastSync: '3 minutes ago',
      dataPoints: 23156,
      reliability: 89,
      updateFrequency: 'Daily',
      criticalAlerts: 0
    },
    {
      id: '5',
      name: 'LinkedIn Workforce Insights',
      type: 'social',
      status: 'active',
      lastSync: '10 minutes ago',
      dataPoints: 45678,
      reliability: 87,
      updateFrequency: 'Daily',
      criticalAlerts: 2
    },
    {
      id: '6',
      name: 'Global HR Standards',
      type: 'global',
      status: 'active',
      lastSync: '30 minutes ago',
      dataPoints: 7890,
      reliability: 94,
      updateFrequency: 'Weekly',
      criticalAlerts: 0
    },
    {
      id: '7',
      name: 'Internal AqlHR Database',
      type: 'internal',
      status: 'active',
      lastSync: 'Real-time',
      dataPoints: 98765,
      reliability: 100,
      updateFrequency: 'Real-time',
      criticalAlerts: 0
    }
  ]);

  const [intelligence, setIntelligence] = useState<Intelligence[]>([
    {
      id: '1',
      category: 'compliance',
      title: 'New Saudization Requirements',
      description: 'HRSD announced updated Saudization targets for tech sector - 40% by Q2 2025',
      confidence: 96,
      impact: 'critical',
      source: 'HRSD Government Portal',
      timestamp: '15 minutes ago',
      actionRequired: true,
      relevantModules: ['Government', 'Compliance', 'Recruitment']
    },
    {
      id: '2',
      category: 'market',
      title: 'Salary Inflation Trend',
      description: 'IT sector salaries increased 12% in Riyadh, 8% in other regions',
      confidence: 89,
      impact: 'high',
      source: 'Saudi Market Intelligence',
      timestamp: '2 hours ago',
      actionRequired: true,
      relevantModules: ['Payroll', 'Analytics', 'Strategic']
    },
    {
      id: '3',
      category: 'workforce',
      title: 'Skills Gap Analysis',
      description: 'AI/ML skills demand increased 45% while supply grew only 12%',
      confidence: 92,
      impact: 'high',
      source: 'LinkedIn Workforce Insights',
      timestamp: '4 hours ago',
      actionRequired: true,
      relevantModules: ['Training', 'Recruitment', 'Strategic']
    },
    {
      id: '4',
      category: 'financial',
      title: 'GOSI Rate Changes',
      description: 'Expected 2% increase in GOSI contributions for non-Saudis from next quarter',
      confidence: 78,
      impact: 'medium',
      source: 'GOSI Integration',
      timestamp: '6 hours ago',
      actionRequired: false,
      relevantModules: ['Payroll', 'Compliance', 'Financial']
    },
    {
      id: '5',
      category: 'strategic',
      title: 'Remote Work Preferences',
      description: '67% of professionals prefer hybrid work model post-pandemic',
      confidence: 85,
      impact: 'medium',
      source: 'Global HR Standards',
      timestamp: '1 day ago',
      actionRequired: false,
      relevantModules: ['Strategic', 'Employee Experience', 'Policies']
    }
  ]);

  const [activeTab, setActiveTab] = useState('sources');

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setAiAnalysis(prev => ({
        ...prev,
        dataPointsToday: prev.dataPointsToday + Math.floor(Math.random() * 100),
        intelligenceGenerated: prev.intelligenceGenerated + Math.floor(Math.random() * 2),
        predictionAccuracy: Math.min(100, prev.predictionAccuracy + Math.random() * 0.1)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getSourceStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'syncing': return 'bg-yellow-500 animate-pulse';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-blue-500';
      case 'market': return 'bg-green-500';
      case 'social': return 'bg-purple-500';
      case 'internal': return 'bg-orange-500';
      case 'global': return 'bg-pink-500';
      default: return 'bg-gray-500';
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

  const syncAllSources = () => {
    setDataSources(prev => prev.map(source => ({ ...source, status: 'syncing' })));
    
    setTimeout(() => {
      setDataSources(prev => prev.map(source => ({ 
        ...source, 
        status: 'active', 
        lastSync: 'Just now',
        dataPoints: source.dataPoints + Math.floor(Math.random() * 100)
      })));
      
      toast({
        title: "🔄 Sources Synchronized",
        description: "All data sources have been updated with latest information.",
      });
    }, 3000);
  };

  const analyzeIntelligence = (intelligenceId: string) => {
    const intel = intelligence.find(i => i.id === intelligenceId);
    toast({
      title: "🧠 AI Analysis Started",
      description: `Analyzing "${intel?.title}" with advanced AI models...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Intelligence Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{aiAnalysis.totalSources}</div>
            <div className="text-sm text-muted-foreground">Data Sources</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{aiAnalysis.activeConnections}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{aiAnalysis.dataPointsToday.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Data Points Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{aiAnalysis.intelligenceGenerated}</div>
            <div className="text-sm text-muted-foreground">Intelligence Generated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{aiAnalysis.predictionAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{aiAnalysis.complianceScore.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Compliance Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence Management Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Multi-Source Intelligence Gathering
            </CardTitle>
            <Button onClick={syncAllSources} className="bg-primary">
              <Zap className="h-4 w-4 mr-2" />
              Sync All Sources
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sources">Data Sources ({dataSources.length})</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence ({intelligence.length})</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="mt-6">
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <Card key={source.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full ${getSourceStatusColor(source.status)} mt-2`} />
                          <div>
                            <h3 className="font-semibold text-lg">{source.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="capitalize">
                                <div className={`w-2 h-2 rounded-full ${getTypeColor(source.type)} mr-1`} />
                                {source.type}
                              </Badge>
                              <Badge variant="secondary">
                                {source.updateFrequency}
                              </Badge>
                              {source.criticalAlerts > 0 && (
                                <Badge variant="destructive">
                                  {source.criticalAlerts} alerts
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Last sync: {source.lastSync}</div>
                          <div className="text-lg font-semibold text-primary">
                            {source.dataPoints.toLocaleString()} points
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Reliability Score</div>
                          <div className="flex items-center gap-2">
                            <Progress value={source.reliability} className="flex-1" />
                            <span className="text-sm font-medium">{source.reliability}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {source.status === 'active' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {source.status === 'syncing' && <Clock className="h-4 w-4 text-yellow-600" />}
                          {source.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                          <span className="text-sm capitalize font-medium">{source.status}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Data
                        </Button>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="intelligence" className="mt-6">
              <div className="space-y-4">
                {intelligence.map((intel) => (
                  <Card key={intel.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {intel.actionRequired ? (
                              <AlertCircle className="h-5 w-5 text-orange-600" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{intel.title}</h3>
                            <p className="text-muted-foreground mt-1">{intel.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={getImpactColor(intel.impact)} className="capitalize">
                                {intel.impact} Impact
                              </Badge>
                              <Badge variant="outline">
                                {intel.confidence}% Confidence
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {intel.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{intel.timestamp}</div>
                          <div className="text-sm text-muted-foreground">Source: {intel.source}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Relevant Modules:</h4>
                          <div className="flex flex-wrap gap-2">
                            {intel.relevantModules.map((module, index) => (
                              <Badge key={index} variant="outline">{module}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => analyzeIntelligence(intel.id)} variant="outline">
                          <Search className="h-4 w-4 mr-2" />
                          AI Analysis
                        </Button>
                        {intel.actionRequired && (
                          <Button>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Take Action
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Real-time Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Data Collection Rate</span>
                        <span>2.3M points/hour</span>
                      </div>
                      <Progress value={87} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Processing Speed</span>
                        <span>94% efficiency</span>
                      </div>
                      <Progress value={94} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Intelligence Quality</span>
                        <span>91% accuracy</span>
                      </div>
                      <Progress value={91} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Prediction Confidence</span>
                        <span>{aiAnalysis.predictionAccuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={aiAnalysis.predictionAccuracy} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Source Reliability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dataSources.slice(0, 5).map((source) => (
                        <div key={source.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getTypeColor(source.type)}`} />
                            <span className="text-sm font-medium">{source.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={source.reliability} className="w-16 h-2" />
                            <span className="text-sm text-muted-foreground">{source.reliability}%</span>
                          </div>
                        </div>
                      ))}
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