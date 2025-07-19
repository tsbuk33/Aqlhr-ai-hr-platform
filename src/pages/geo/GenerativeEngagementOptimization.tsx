import React, { useState } from 'react';
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
  Trophy
} from 'lucide-react';

const GenerativeEngagementOptimization: React.FC = () => {
  const [selectedPulseOption, setSelectedPulseOption] = useState<string | null>(null);
  const [pulseResponse, setPulseResponse] = useState('');

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

      <Tabs defaultValue="pulse" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Insights
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
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GenerativeEngagementOptimization;