import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Users, 
  TrendingUp, 
  Award, 
  MessageCircle, 
  Target, 
  Zap, 
  Star,
  ThumbsUp,
  Share,
  Clock,
  BarChart3,
  UserPlus,
  Gift,
  Trophy,
  Brain,
  Link,
  Globe,
  FileText,
  Briefcase,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { useLeoGeoIntegration } from '@/hooks/useLeoGeoIntegration';
import SmartRecommendationEngine from '@/components/SmartRecommendationEngine';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GenerativeEngagementOptimization: React.FC = () => {
  const { toast } = useToast();
  const [selectedPulseOption, setSelectedPulseOption] = useState<string | null>(null);
  const [pulseResponse, setPulseResponse] = useState('');
  
  // AI Enhancement States
  const [marketIntelligence, setMarketIntelligence] = useState(null);
  const [engagementAnalytics, setEngagementAnalytics] = useState(null);
  const [teamOptimizationData, setTeamOptimizationData] = useState(null);
  const [culturalInsights, setCulturalInsights] = useState(null);
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingOptimization, setIsLoadingOptimization] = useState(false);
  const [isLoadingCultural, setIsLoadingCultural] = useState(false);
  
  // LEO-GEO Integration
  const { 
    getLearningInsightsForGeo, 
    getAggregatedInsights, 
    loading: integrationLoading 
  } = useLeoGeoIntegration();

  // Mock data for demonstration
  const engagementStats = {
    engagementScore: 87,
    responseRate: 94,
    recognitionsGiven: 156,
    connectionsActive: 89,
    trendDirection: 'up',
    trendPercent: 12
  };

  const todaysPulse = {
    question: "How energized do you feel about your current projects?",
    options: [
      { id: '1', emoji: '🚀', text: 'Highly Energized', color: 'bg-green-500' },
      { id: '2', emoji: '😊', text: 'Good Energy', color: 'bg-blue-500' },
      { id: '3', emoji: '😐', text: 'Neutral', color: 'bg-yellow-500' },
      { id: '4', emoji: '😔', text: 'Low Energy', color: 'bg-orange-500' },
      { id: '5', emoji: '😞', text: 'Drained', color: 'bg-red-500' }
    ]
  };

  const pulseInsights = [
    { id: '1', icon: '📈', text: 'Team energy up 15% this week' },
    { id: '2', icon: '🎯', text: 'Project clarity improved significantly' },
    { id: '3', icon: '🤝', text: 'Cross-team collaboration trending up' },
    { id: '4', icon: '💡', text: 'Innovation sentiment at monthly high' }
  ];

  const recognitionSuggestions = [
    {
      id: '1',
      employeeName: 'Sarah Al-Rashid',
      employeePhoto: '/api/placeholder/40/40',
      achievement: 'Completed Vision 2030 training ahead of schedule',
      department: 'Strategic Planning',
      impact: 'High'
    },
    {
      id: '2',
      employeeName: 'Ahmed Hassan',
      employeePhoto: '/api/placeholder/40/40',
      achievement: 'Mentored 3 new team members this month',
      department: 'Technology',
      impact: 'Medium'
    },
    {
      id: '3',
      employeeName: 'Fatima Al-Zahra',
      employeePhoto: '/api/placeholder/40/40',
      achievement: 'Led successful client presentation',
      department: 'Sales',
      impact: 'High'
    }
  ];

  const recentRecognitions = [
    {
      id: '1',
      giver: 'Khalid Al-Mansouri',
      receiver: 'Norah Al-Saud',
      reason: 'exceptional problem-solving in the Q4 project',
      timeAgo: '2 hours ago',
      likes: 12,
      type: 'achievement'
    },
    {
      id: '2',
      giver: 'Layla Al-Rashid',
      receiver: 'Omar Al-Otaibi',
      reason: 'outstanding cultural bridge-building',
      timeAgo: '4 hours ago',
      likes: 8,
      type: 'collaboration'
    },
    {
      id: '3',
      giver: 'Abdullah Al-Faisal',
      receiver: 'Aisha Al-Harbi',
      reason: 'innovative approach to digital transformation',
      timeAgo: '6 hours ago',
      likes: 15,
      type: 'innovation'
    }
  ];

  const connectionRecommendations = [
    {
      id: '1',
      name: 'Dr. Majid Al-Rajhi',
      role: 'AI Research Director',
      department: 'Technology',
      photo: '/api/placeholder/50/50',
      reason: 'Shares your interest in AI applications',
      commonInterests: ['Machine Learning', 'Digital Innovation'],
      mutualConnections: 3
    },
    {
      id: '2',
      name: 'Reem Al-Dosari',
      role: 'Cultural Intelligence Lead',
      department: 'HR Strategy',
      photo: '/api/placeholder/50/50',
      reason: 'Working on similar cultural initiatives',
      commonInterests: ['Vision 2030', 'Cultural Development'],
      mutualConnections: 5
    }
  ];

  const collaborationOpportunities = [
    {
      id: '1',
      title: 'Vision 2030 Digital Transformation Task Force',
      type: 'Cross-Functional Project',
      description: 'Join the strategic initiative to digitalize core business processes',
      participants: 12,
      deadline: '2 weeks',
      skills: ['Digital Strategy', 'Process Optimization']
    },
    {
      id: '2',
      title: 'Cultural Intelligence Mentorship Circle',
      type: 'Mentorship Program',
      description: 'Share cultural knowledge and bridge international team gaps',
      participants: 8,
      deadline: 'Ongoing',
      skills: ['Cultural Intelligence', 'Communication']
    }
  ];

  const engagementMetrics = [
    { metric: 'Overall Satisfaction', value: 87, trend: '+5%', color: 'text-green-600' },
    { metric: 'Work-Life Balance', value: 82, trend: '+3%', color: 'text-green-600' },
    { metric: 'Team Collaboration', value: 91, trend: '+8%', color: 'text-green-600' },
    { metric: 'Career Growth', value: 78, trend: '+2%', color: 'text-green-600' },
    { metric: 'Cultural Alignment', value: 89, trend: '+6%', color: 'text-green-600' }
  ];

  const handlePulseSubmit = (optionId: string) => {
    setSelectedPulseOption(optionId);
    // In real implementation, submit to backend
  };

  // AI Enhancement Functions
  const fetchEngagementIntelligence = async () => {
    setIsLoadingIntelligence(true);
    try {
      const { data, error } = await supabase.functions.invoke('external-intelligence', {
        body: {
          moduleContext: 'engagement',
          query: 'Latest employee engagement trends, recognition strategies, and team collaboration methods in Saudi Arabian organizations',
          dataType: 'market_data',
          country: 'Saudi Arabia',
          industry: 'Human Resources & Engagement'
        }
      });

      if (error) throw error;

      setMarketIntelligence(data.externalInsight);
      toast({
        title: "Engagement Intelligence Updated",
        description: "Latest Saudi engagement data retrieved successfully"
      });
    } catch (error) {
      console.error('Error fetching engagement intelligence:', error);
      toast({
        title: "Error",
        description: "Failed to fetch engagement intelligence",
        variant: "destructive"
      });
    } finally {
      setIsLoadingIntelligence(false);
    }
  };

  const fetchEngagementAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-workforce-analytics', {
        body: {
          company_id: 'demo-company',
          analysis_type: 'engagement_comprehensive'
        }
      });

      if (error) throw error;

      setEngagementAnalytics(data);
      toast({
        title: "Engagement Analytics Generated",
        description: "AI-powered engagement insights ready"
      });
    } catch (error) {
      console.error('Error fetching engagement analytics:', error);
      toast({
        title: "Error",
        description: "Failed to generate engagement analytics",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const fetchTeamOptimization = async () => {
    setIsLoadingOptimization(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-specific-learning-ai', {
        body: {
          employeeId: 'demo-employee-id',
          companyId: 'demo-company-id',
          language: 'en',
          analysisType: 'team_engagement_optimization'
        }
      });

      if (error) throw error;

      setTeamOptimizationData(data);
      toast({
        title: "Team Optimization Ready",
        description: "AI team engagement optimization complete"
      });
    } catch (error) {
      console.error('Error fetching team optimization:', error);
      toast({
        title: "Error",
        description: "Failed to generate team optimization",
        variant: "destructive"
      });
    } finally {
      setIsLoadingOptimization(false);
    }
  };

  const fetchCulturalInsights = async () => {
    setIsLoadingCultural(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-organization-advisor', {
        body: {
          companyData: {
            totalEmployees: 150,
            saudiEmployees: 95,
            departments: 8,
            industry: 'Technology',
            sizeCategory: 'Medium',
            revenue: '50M SAR',
            locations: 'Riyadh, Saudi Arabia',
            growthStage: 'Expansion',
            challenges: 'Cross-cultural team engagement and collaboration'
          },
          language: 'en',
          analysisType: 'cultural_engagement'
        }
      });

      if (error) throw error;

      setCulturalInsights(data.recommendation);
      toast({
        title: "Cultural Insights Generated",
        description: "Saudi cultural engagement recommendations ready"
      });
    } catch (error) {
      console.error('Error fetching cultural insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate cultural insights",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCultural(false);
    }
  };

  useEffect(() => {
    fetchEngagementIntelligence();
    fetchEngagementAnalytics();
    fetchTeamOptimization();
    fetchCulturalInsights();
  }, []);

  // Get integrated insights
  const learningInsights = getLearningInsightsForGeo();
  const aggregatedInsights = getAggregatedInsights();

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            GEO - Generative Engagement Optimization
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI-Powered Real-Time Engagement, Personalized Recognition & Intelligent Connections
        </p>
      </div>

      {/* LEO-GEO Integration Insights */}
      {!integrationLoading && learningInsights.length > 0 && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-secondary/5 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              LEO Learning Insights
              <Badge variant="secondary" className="ml-2">
                <Brain className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {learningInsights.slice(0, 3).map((insight, index) => (
                <div key={index} className="p-3 bg-background/60 rounded-lg border">
                  <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      Priority: {Math.round(insight.priority)}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Apply Insight
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{engagementStats.engagementScore}%</div>
            <div className="text-sm text-muted-foreground">Engagement Score</div>
            <div className="text-xs text-green-600 mt-1">↗ +{engagementStats.trendPercent}%</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{engagementStats.responseRate}%</div>
            <div className="text-sm text-muted-foreground">Response Rate</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{engagementStats.recognitionsGiven}</div>
            <div className="text-sm text-muted-foreground">Recognitions Given</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{engagementStats.connectionsActive}</div>
            <div className="text-sm text-muted-foreground">Active Connections</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">92%</div>
            <div className="text-sm text-muted-foreground">Culture Alignment</div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Enhanced Engagement Intelligence Panels */}
      {marketIntelligence && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Live Engagement Market Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <pre className="whitespace-pre-wrap text-sm">{marketIntelligence}</pre>
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={fetchEngagementIntelligence} 
                  disabled={isLoadingIntelligence}
                  size="sm"
                  variant="outline"
                >
                  {isLoadingIntelligence ? 'Updating...' : 'Refresh Intelligence'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Engagement Analytics Panel */}
      {engagementAnalytics && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              AI Engagement Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Engagement Insights</h4>
                <div className="text-sm space-y-2">
                  <div>Response Rate: <span className="font-bold text-green-600">94%</span></div>
                  <div>Satisfaction Score: <span className="font-bold text-blue-600">87%</span></div>
                  <div>Team Cohesion: <span className="font-bold text-orange-600">91%</span></div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Trend Analysis</h4>
                <div className="text-sm space-y-2">
                  <div>Weekly Growth: <span className="font-bold text-green-600">+12%</span></div>
                  <div>Best Practices: <span className="font-bold">Recognition, Feedback</span></div>
                  <div>Peak Engagement: <span className="font-bold">10-12 PM</span></div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Recommendations</h4>
                <div className="text-sm space-y-2">
                  <div>• Increase peer recognition</div>
                  <div>• Add cultural celebration days</div>
                  <div>• Enhance cross-team activities</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={fetchEngagementAnalytics} 
                disabled={isLoadingAnalytics}
                size="sm"
                variant="outline"
              >
                {isLoadingAnalytics ? 'Analyzing...' : 'Refresh Analytics'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cultural Insights Panel */}
      {culturalInsights && (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🇸🇦 Saudi Cultural Engagement Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-3">Cultural Alignment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vision 2030 Connection</span>
                    <Badge className="bg-green-600">Strong</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Islamic Values Integration</span>
                    <Badge className="bg-blue-600">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cross-Cultural Harmony</span>
                    <Badge className="bg-purple-600">High</Badge>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-3">Optimization Opportunities</h4>
                <div className="text-sm space-y-2">
                  <div>• Ramadan engagement adaptation</div>
                  <div>• National Day team celebrations</div>
                  <div>• Arabic language peer support</div>
                  <div>• Cultural mentorship programs</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={fetchCulturalInsights} 
                disabled={isLoadingCultural}
                size="sm"
                variant="outline"
              >
                {isLoadingCultural ? 'Analyzing...' : 'Refresh Cultural Insights'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pulse" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="pulse" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Pulse Check
          </TabsTrigger>
          <TabsTrigger value="recognition" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recognition
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="smart-ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Smart AI
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="advanced-engagement" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="cultural-intelligence" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Cultural AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pulse" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Pulse Survey */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Today's Pulse Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">{todaysPulse.question}</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {todaysPulse.options.map((option) => (
                      <button
                        key={option.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          selectedPulseOption === option.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handlePulseSubmit(option.id)}
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="text-xs font-medium">{option.text}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {selectedPulseOption && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Any additional thoughts? (Optional)"
                      value={pulseResponse}
                      onChange={(e) => setPulseResponse(e.target.value)}
                      className="min-h-20"
                    />
                    <Button className="w-full">Submit Response</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Team Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pulseInsights.map((insight) => (
                  <div key={insight.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-xl">{insight.icon}</span>
                    <span className="text-sm">{insight.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recognition" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Give Recognition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  AI Recognition Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recognitionSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={suggestion.employeePhoto}
                        alt={suggestion.employeeName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{suggestion.employeeName}</h4>
                        <p className="text-sm text-muted-foreground">{suggestion.department}</p>
                      </div>
                      <Badge variant={suggestion.impact === 'High' ? 'destructive' : 'secondary'}>
                        {suggestion.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{suggestion.achievement}</p>
                    <Button size="sm" className="w-full">
                      <Award className="h-4 w-4 mr-2" />
                      Recognize Achievement
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Recognition Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Recognition Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentRecognitions.map((recognition) => (
                  <div key={recognition.id} className="border rounded-lg p-4">
                    <div className="mb-3">
                      <p className="text-sm">
                        <span className="font-medium">{recognition.giver}</span>
                        <span className="text-muted-foreground"> recognized </span>
                        <span className="font-medium">{recognition.receiver}</span>
                        <span className="text-muted-foreground"> for </span>
                        <span className="font-medium">{recognition.reason}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{recognition.timeAgo}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                        <ThumbsUp className="h-4 w-4" />
                        {recognition.likes}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                        <MessageCircle className="h-4 w-4" />
                        Comment
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                        <Share className="h-4 w-4" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connection Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Smart Connection Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectionRecommendations.map((connection) => (
                  <div key={connection.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={connection.photo}
                        alt={connection.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{connection.name}</h4>
                        <p className="text-sm text-muted-foreground">{connection.role}</p>
                        <p className="text-sm text-muted-foreground">{connection.department}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{connection.reason}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {connection.commonInterests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {connection.mutualConnections} mutual connections
                      </span>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Collaboration Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Collaboration Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {collaborationOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{opportunity.title}</h4>
                      <Badge variant="outline">{opportunity.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {opportunity.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        <span>{opportunity.participants} participants</span>
                        <span className="mx-2">•</span>
                        <span>{opportunity.deadline}</span>
                      </div>
                      <Button size="sm">Join Project</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagementMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{metric.value}%</span>
                    <span className={`text-sm ${metric.color}`}>{metric.trend}</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="smart-ai" className="space-y-6">
          <SmartRecommendationEngine 
            employeeId="22222222-2222-2222-2222-222222222222"
            companyId="11111111-1111-1111-1111-111111111111"
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Engagement Predictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">🔮 Next Week Forecast</h4>
                  <p className="text-sm text-blue-800">
                    Engagement expected to increase by 8% due to upcoming Vision 2030 workshop and team building activities.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">💡 Optimization Opportunity</h4>
                  <p className="text-sm text-green-800">
                    Implementing morning pulse checks could boost response rates by 15% based on team behavior patterns.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">⚠️ Attention Needed</h4>
                  <p className="text-sm text-yellow-800">
                    3 team members showing decreased engagement patterns. Consider proactive check-ins.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Intelligence Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">🕌 Cultural Resonance</h4>
                  <p className="text-sm text-purple-800">
                    Recognition patterns align well with Saudi cultural values. Family-focused benefits highly appreciated.
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-medium text-indigo-900 mb-2">🤝 Cross-Cultural Collaboration</h4>
                  <p className="text-sm text-indigo-800">
                    International team members showing 92% satisfaction with cultural integration programs.
                  </p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-medium text-pink-900 mb-2">🎯 Vision 2030 Alignment</h4>
                  <p className="text-sm text-pink-800">
                    89% of employees feel connected to Vision 2030 goals through current engagement initiatives.
                  </p>
                </div>
              </CardContent>
        <TabsContent value="advanced-engagement" className="space-y-6">
          
          {/* AI-Powered Engagement Optimization */}
          <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-600" />
                AI Engagement Optimization Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-violet-800">Personalized Engagement Strategies</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-violet-200">
                      <h5 className="font-medium text-violet-900 mb-2">🎯 Individual Engagement Profiles</h5>
                      <p className="text-sm text-violet-700">AI analyzes each employee's engagement patterns and preferences</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-violet-200">
                      <h5 className="font-medium text-violet-900 mb-2">🇸🇦 Cultural Engagement Adaptation</h5>
                      <p className="text-sm text-violet-700">Tailored for Saudi cultural values and Islamic principles</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-violet-200">
                      <h5 className="font-medium text-violet-900 mb-2">⚡ Real-time Engagement Monitoring</h5>
                      <p className="text-sm text-violet-700">Continuous assessment and adaptive recommendations</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-violet-800">Team Dynamics Intelligence</h4>
                  <div className="p-4 bg-violet-100 rounded-lg">
                    <div className="text-sm space-y-2">
                      <div>🤝 Cross-cultural collaboration: <span className="font-bold text-green-600">Excellent</span></div>
                      <div>🎭 Team cohesion score: <span className="font-bold text-blue-600">91%</span></div>
                      <div>💬 Communication effectiveness: <span className="font-bold text-purple-600">87%</span></div>
                      <div>🌟 Innovation mindset: <span className="font-bold text-emerald-600">93%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Engagement Impact Analytics */}
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                Real-time Engagement Impact Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                  <div className="text-2xl font-bold text-emerald-600">+31%</div>
                  <div className="text-sm text-emerald-800">Productivity Boost</div>
                  <div className="text-xs text-muted-foreground mt-1">From engagement initiatives</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                  <div className="text-2xl font-bold text-blue-600">94%</div>
                  <div className="text-sm text-blue-800">Retention Rate</div>
                  <div className="text-xs text-muted-foreground mt-1">Engaged employees</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                  <div className="text-2xl font-bold text-orange-600">+25%</div>
                  <div className="text-sm text-orange-800">Innovation Index</div>
                  <div className="text-xs text-muted-foreground mt-1">Creative contributions</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                  <div className="text-2xl font-bold text-purple-600">+18%</div>
                  <div className="text-sm text-purple-800">Team Collaboration</div>
                  <div className="text-xs text-muted-foreground mt-1">Cross-functional projects</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Recognition Engine */}
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Advanced Recognition Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3">🎯 Smart Recognition Timing</h4>
                  <ul className="text-sm space-y-2 text-amber-700">
                    <li>• AI-predicted optimal recognition moments</li>
                    <li>• Cultural event alignment</li>
                    <li>• Personal milestone awareness</li>
                    <li>• Team achievement correlation</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3">🌍 Cultural Recognition Styles</h4>
                  <ul className="text-sm space-y-2 text-amber-700">
                    <li>• Arabic appreciation messages</li>
                    <li>• Islamic value-based recognition</li>
                    <li>• Saudi cultural celebration themes</li>
                    <li>• Respectful public/private preferences</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3">📊 Recognition Impact Tracking</h4>
                  <ul className="text-sm space-y-2 text-amber-700">
                    <li>• Engagement boost measurement</li>
                    <li>• Peer recognition ripple effects</li>
                    <li>• Performance correlation analysis</li>
                    <li>• Team morale improvement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Gamification Engine */}
          <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎮 Engagement Gamification Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-cyan-800 mb-3">🏅 Achievement System</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-cyan-200">
                      <div className="text-2xl">🤝</div>
                      <div>
                        <div className="font-medium">Team Unity Champion</div>
                        <div className="text-sm text-muted-foreground">Foster cross-cultural collaboration</div>
                      </div>
                      <Badge className="bg-gold text-white">Earned</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-cyan-200">
                      <div className="text-2xl">💝</div>
                      <div>
                        <div className="font-medium">Recognition Master</div>
                        <div className="text-sm text-muted-foreground">Give 25 meaningful recognitions</div>
                      </div>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-cyan-200">
                      <div className="text-2xl">🌟</div>
                      <div>
                        <div className="font-medium">Culture Ambassador</div>
                        <div className="text-sm text-muted-foreground">Bridge cultural understanding</div>
                      </div>
                      <Badge variant="outline">Locked</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-800 mb-3">🏆 Department Engagement Race</h4>
                  <div className="p-4 bg-cyan-100 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">🥇 HR Department</span>
                        <span className="font-bold text-gold">3,247 points</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">🥈 Technology</span>
                        <span className="font-bold text-gray-500">3,156 points</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">🥉 Sales</span>
                        <span className="font-bold text-orange-600">2,987 points</span>
                      </div>
                      <div className="text-xs text-cyan-700 mt-2">
                        Monthly engagement challenge • Your team: Finance (4th place)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice-Enabled Engagement Assistant */}
          <Card className="border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎤 Voice-Enabled Engagement Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">🗣️ Voice Recognition</h4>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li>• Arabic/English voice commands</li>
                    <li>• Quick pulse check responses</li>
                    <li>• Voice-to-text feedback</li>
                    <li>• Hands-free navigation</li>
                  </ul>
                  <Button size="sm" className="w-full mt-3">
                    Start Voice Session
                  </Button>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">🤖 Smart Conversations</h4>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li>• Engagement coaching</li>
                    <li>• Recognition suggestions</li>
                    <li>• Team dynamics insights</li>
                    <li>• Cultural guidance</li>
                  </ul>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Chat with Engagement AI
                  </Button>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">📊 Voice Analytics</h4>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li>• Sentiment analysis</li>
                    <li>• Engagement tone tracking</li>
                    <li>• Communication patterns</li>
                    <li>• Emotional intelligence</li>
                  </ul>
                  <Button size="sm" variant="secondary" className="w-full mt-3">
                    View Voice Insights
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement ROI Calculator */}
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Engagement ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3">📈 Productivity Impact</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">+31%</div>
                    <div className="text-sm text-emerald-800">Output Increase</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      From engagement initiatives
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-emerald-50 rounded text-sm">
                    <div className="font-medium text-emerald-800">Value Generated:</div>
                    <div className="text-emerald-700">SAR 127,000 annually</div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3">🛡️ Retention Benefits</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Turnover Reduction</span>
                      <span className="font-bold text-green-600">68%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Recruitment Savings</span>
                      <span className="font-bold text-blue-600">SAR 89,000</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded text-center">
                      <div className="text-lg font-bold text-emerald-600">SAR 216,000</div>
                      <div className="text-xs text-emerald-700">Annual Savings</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3">💸 Investment vs. Return</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Engagement Investment</span>
                      <span className="font-bold">SAR 45,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Value Return</span>
                      <span className="font-bold text-green-600">SAR 343,000</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded text-center">
                      <div className="text-lg font-bold text-emerald-600">7.6x ROI</div>
                      <div className="text-xs text-emerald-700">Return on Investment</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cultural-intelligence" className="space-y-6">
          
          {/* Cultural Engagement Adapter */}
          <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🕌 Cultural Engagement Adapter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-rose-200">
                  <h4 className="font-semibold text-rose-800 mb-3">🇸🇦 Saudi Context Integration</h4>
                  <ul className="text-sm space-y-2 text-rose-700">
                    <li>• Islamic values in recognition</li>
                    <li>• Respectful communication styles</li>
                    <li>• Cultural sensitivity awareness</li>
                    <li>• Traditional celebration integration</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-rose-200">
                  <h4 className="font-semibold text-rose-800 mb-3">🌙 Islamic Calendar Alignment</h4>
                  <ul className="text-sm space-y-2 text-rose-700">
                    <li>• Ramadan engagement adaptation</li>
                    <li>• Prayer time consideration</li>
                    <li>• Religious holiday recognition</li>
                    <li>• Spiritual well-being support</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-rose-200">
                  <h4 className="font-semibold text-rose-800 mb-3">🤝 Cross-Cultural Bridge</h4>
                  <ul className="text-sm space-y-2 text-rose-700">
                    <li>• International team integration</li>
                    <li>• Cultural exchange programs</li>
                    <li>• Language support initiatives</li>
                    <li>• Inclusive celebration planning</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Mentorship Matching for Engagement */}
          <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤝 AI Engagement Mentorship Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-teal-800 mb-3">🎯 Smart Engagement Pairing</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-teal-200">
                      <h5 className="font-medium text-teal-900">Engagement Style Matching</h5>
                      <p className="text-sm text-teal-700">Pairs based on communication and motivation preferences</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-teal-200">
                      <h5 className="font-medium text-teal-900">Cultural Bridge Building</h5>
                      <p className="text-sm text-teal-700">Connects across cultural backgrounds for mutual learning</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-teal-200">
                      <h5 className="font-medium text-teal-900">Engagement Journey Alignment</h5>
                      <p className="text-sm text-teal-700">Matches mentors with similar engagement evolution paths</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-teal-800 mb-3">👥 Suggested Engagement Mentors</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-teal-200">
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                        LR
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Layla Al-Rashid</div>
                        <div className="text-sm text-muted-foreground">Engagement Specialist • 96% match</div>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-teal-200">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        KM
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Khalid Al-Mansouri</div>
                        <div className="text-sm text-muted-foreground">Team Dynamics Expert • 92% match</div>
                      </div>
                      <Button size="sm" variant="outline">View Profile</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Government Integration for Engagement */}
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏛️ Government Engagement Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-amber-800 mb-3">🇸🇦 Vision 2030 Alignment</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                      <div>
                        <div className="font-medium">Quality of Life Program</div>
                        <div className="text-sm text-muted-foreground">Employee wellbeing initiatives</div>
                      </div>
                      <Badge className="bg-green-600">Aligned</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                      <div>
                        <div className="font-medium">National Transformation</div>
                        <div className="text-sm text-muted-foreground">Innovation and change management</div>
                      </div>
                      <Badge className="bg-blue-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                      <div>
                        <div className="font-medium">Saudi Green Initiative</div>
                        <div className="text-sm text-muted-foreground">Environmental engagement</div>
                      </div>
                      <Badge variant="secondary">Planning</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-3">📊 Compliance Metrics</h4>
                  <div className="p-4 bg-amber-100 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Saudization Engagement</span>
                        <span className="text-green-600">✓ 94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cultural Compliance</span>
                        <span className="text-green-600">✓ 97%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vision 2030 Integration</span>
                        <span className="text-blue-600">⏳ 87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wellbeing Standards</span>
                        <span className="text-green-600">✓ 91%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AqlHR AI Assistant */}
      <AqlHRAIAssistant moduleContext="geo.engagementOptimization" />
    </div>
  );
};

export default GenerativeEngagementOptimization;