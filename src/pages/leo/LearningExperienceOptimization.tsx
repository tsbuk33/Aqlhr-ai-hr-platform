import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Target, TrendingUp, Award, Clock, Play, Users, Star, Zap, Filter, Heart, Link, Activity, CheckCircle, Globe, BarChart3, FileText, User, Briefcase, Calendar } from 'lucide-react';
import { useLeoGeoIntegration } from '@/hooks/useLeoGeoIntegration';
import SmartRecommendationEngine from '@/components/SmartRecommendationEngine';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  generateDummyTrainingModules,
  generateDummyLearningProgress,
  generateDummyEmployees,
  generateAnalyticsData
} from '@/utils/dummyData';

const LearningExperienceOptimization: React.FC = () => {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // AI Enhancement States
  const [marketIntelligence, setMarketIntelligence] = useState(null);
  const [learningAnalytics, setLearningAnalytics] = useState(null);
  const [skillGapPredictions, setSkillGapPredictions] = useState(null);
  const [jobSpecificRecommendations, setJobSpecificRecommendations] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [isLoadingJobRecommendations, setIsLoadingJobRecommendations] = useState(false);
  
  // Load comprehensive dummy data
  const trainingModules = generateDummyTrainingModules();
  const learningProgress = generateDummyLearningProgress();
  const employees = generateDummyEmployees();
  const analytics = generateAnalyticsData();
  
  // LEO-GEO Integration
  const { 
    getEngagementInsightsForLeo, 
    getAggregatedInsights, 
    loading: integrationLoading 
  } = useLeoGeoIntegration();

  // Mock data for demonstration
  const learningStats = {
    completedModules: 24,
    skillsAcquired: 8,
    learningStreak: 12,
    totalHours: 45.5,
    engagementScore: 87
  };

  const activeModules = [
    {
      id: '1',
      title: 'Advanced Data Analytics',
      duration: 12,
      progress: 75,
      type: 'Technical',
      nextLesson: 'Machine Learning Basics'
    },
    {
      id: '2', 
      title: 'Leadership in Saudi Culture',
      duration: 8,
      progress: 30,
      type: 'Behavioral',
      nextLesson: 'Cultural Intelligence'
    },
    {
      id: '3',
      title: 'Vision 2030 Implementation',
      duration: 10,
      progress: 90,
      type: 'Strategic',
      nextLesson: 'Economic Transformation'
    }
  ];

  const recommendations = [
    {
      id: '1',
      title: 'AI in HR Transformation',
      description: 'Learn how AI is revolutionizing HR practices in Saudi Arabia',
      duration: 15,
      relevanceScore: 95,
      skillArea: 'HR Technology',
      priority: 'High',
      type: 'video'
    },
    {
      id: '2',
      title: 'Cross-Cultural Communication',
      description: 'Master communication across diverse cultural backgrounds',
      duration: 20,
      relevanceScore: 88,
      skillArea: 'Communication',
      priority: 'Medium',
      type: 'interactive'
    },
    {
      id: '3',
      title: 'Digital Project Management',
      description: 'Advanced project management for digital transformation',
      duration: 25,
      relevanceScore: 82,
      skillArea: 'Project Management',
      priority: 'Medium',
      type: 'simulation'
    }
  ];

  const learningPaths = [
    {
      id: '1',
      title: 'HR Digital Transformation Leader',
      description: 'Complete pathway to become an HR technology leader',
      completedModules: 8,
      totalModules: 15,
      progressPercent: 53,
      icon: '🚀',
      estimatedTime: '3 months'
    },
    {
      id: '2',
      title: 'Saudi Culture Ambassador',
      description: 'Deep understanding of Saudi business culture and practices',
      completedModules: 5,
      totalModules: 10,
      progressPercent: 50,
      icon: '🕌',
      estimatedTime: '2 months'
    },
    {
      id: '3',
      title: 'Vision 2030 Change Agent',
      description: 'Drive Vision 2030 initiatives in your organization',
      completedModules: 3,
      totalModules: 12,
      progressPercent: 25,
      icon: '🎯',
      estimatedTime: '4 months'
    }
  ];

  const skillsProgress = [
    // Technical Skills
    { skill: 'AI & Machine Learning', current: 75, target: 90, growth: '+15%', category: 'Technical' },
    { skill: 'Data Analytics', current: 79, target: 90, growth: '+6%', category: 'Technical' },
    { skill: 'HR Technology Systems', current: 85, target: 95, growth: '+11%', category: 'Technical' },
    { skill: 'Cybersecurity Awareness', current: 72, target: 85, growth: '+9%', category: 'Technical' },
    { skill: 'Digital Transformation', current: 68, target: 88, growth: '+14%', category: 'Technical' },
    
    // Leadership & Management
    { skill: 'Digital Leadership', current: 68, target: 85, growth: '+12%', category: 'Leadership' },
    { skill: 'Strategic Planning', current: 71, target: 88, growth: '+10%', category: 'Leadership' },
    { skill: 'Change Management', current: 74, target: 85, growth: '+8%', category: 'Leadership' },
    { skill: 'Team Building', current: 88, target: 95, growth: '+5%', category: 'Leadership' },
    { skill: 'Performance Coaching', current: 82, target: 90, growth: '+7%', category: 'Leadership' },
    
    // Cultural & Communication
    { skill: 'Cultural Intelligence', current: 82, target: 95, growth: '+8%', category: 'Cultural' },
    { skill: 'Arabic Language Skills', current: 65, target: 85, growth: '+18%', category: 'Cultural' },
    { skill: 'Cross-Cultural Communication', current: 76, target: 90, growth: '+13%', category: 'Cultural' },
    { skill: 'Saudi Business Protocol', current: 91, target: 95, growth: '+3%', category: 'Cultural' },
    { skill: 'Saudi History & Heritage', current: 73, target: 88, growth: '+15%', category: 'Cultural' },
    { skill: 'Foundation Day Traditions', current: 68, target: 85, growth: '+17%', category: 'Cultural' },
    { skill: 'National Day Celebrations', current: 80, target: 92, growth: '+12%', category: 'Cultural' },
    { skill: 'Saudi Traditions & Customs', current: 75, target: 90, growth: '+15%', category: 'Cultural' },
    { skill: 'International Relations', current: 58, target: 75, growth: '+22%', category: 'Cultural' },
    
    // HR Specialization
    { skill: 'Talent Acquisition', current: 84, target: 92, growth: '+6%', category: 'HR' },
    { skill: 'Employee Relations', current: 89, target: 95, growth: '+4%', category: 'HR' },
    { skill: 'Compensation & Benefits', current: 77, target: 88, growth: '+9%', category: 'HR' },
    { skill: 'Learning & Development', current: 86, target: 93, growth: '+5%', category: 'HR' },
    { skill: 'HR Analytics', current: 71, target: 85, growth: '+12%', category: 'HR' },
    { skill: 'Organizational Design', current: 63, target: 80, growth: '+16%', category: 'HR' },
    
    // Compliance & Legal
    { skill: 'Saudi Labor Law', current: 92, target: 98, growth: '+4%', category: 'Compliance' },
    { skill: 'GDPR & Data Privacy', current: 69, target: 85, growth: '+14%', category: 'Compliance' },
    { skill: 'Employment Contracts', current: 87, target: 95, growth: '+6%', category: 'Compliance' },
    { skill: 'Health & Safety Regulations', current: 81, target: 90, growth: '+8%', category: 'Compliance' },
    { skill: 'Ethics & Governance', current: 78, target: 88, growth: '+9%', category: 'Compliance' },
    
    // Business & Finance
    { skill: 'Financial Literacy', current: 66, target: 80, growth: '+15%', category: 'Business' },
    { skill: 'Budget Management', current: 73, target: 85, growth: '+11%', category: 'Business' },
    { skill: 'Business Process Improvement', current: 70, target: 85, growth: '+13%', category: 'Business' },
    { skill: 'Project Management', current: 79, target: 88, growth: '+8%', category: 'Business' },
    { skill: 'Vendor Management', current: 64, target: 78, growth: '+17%', category: 'Business' },
    
    // Vision 2030 & Innovation
    { skill: 'Vision 2030 Implementation', current: 75, target: 92, growth: '+16%', category: 'Innovation' },
    { skill: 'Innovation Management', current: 61, target: 80, growth: '+21%', category: 'Innovation' },
    { skill: 'Sustainability Practices', current: 68, target: 85, growth: '+18%', category: 'Innovation' },
    { skill: 'Digital Innovation', current: 72, target: 88, growth: '+14%', category: 'Innovation' },
    { skill: 'Entrepreneurship', current: 55, target: 75, growth: '+25%', category: 'Innovation' }
  ];

  const microLearningModules = [
    {
      id: '1',
      title: 'Understanding Neural Networks',
      type: 'Video',
      duration: 5,
      difficulty: 'Intermediate',
      completionRate: 89,
      rating: 4.7
    },
    {
      id: '2',
      title: 'Saudi Business Etiquette',
      type: 'Interactive',
      duration: 8,
      difficulty: 'Beginner',
      completionRate: 94,
      rating: 4.9
    },
    {
      id: '3',
      title: 'Vision 2030 Economic Goals',
      type: 'Quiz',
      duration: 10,
      difficulty: 'Advanced',
      completionRate: 76,
      rating: 4.5
    }
  ];

  const categories = ['All', 'Technical', 'Leadership', 'Cultural', 'HR', 'Compliance', 'Business', 'Innovation'];
  
  const filteredSkills = selectedCategory === 'All' 
    ? skillsProgress 
    : skillsProgress.filter(skill => skill.category === selectedCategory);

  // AI Enhancement Functions
  const fetchMarketIntelligence = async () => {
    setIsLoadingIntelligence(true);
    try {
      const { data, error } = await supabase.functions.invoke('external-intelligence', {
        body: {
          moduleContext: 'learning',
          query: 'Latest learning and development trends, skill demands, and training technologies in Saudi Arabia HR and technology sectors',
          dataType: 'market_data',
          country: 'Saudi Arabia',
          industry: 'Learning & Development'
        }
      });

      if (error) throw error;

      setMarketIntelligence(data.externalInsight);
      toast({
        title: "Learning Intelligence Updated",
        description: "Latest Saudi L&D market data retrieved successfully"
      });
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      toast({
        title: "Error",
        description: "Failed to fetch learning market intelligence",
        variant: "destructive"
      });
    } finally {
      setIsLoadingIntelligence(false);
    }
  };

  const fetchLearningAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-workforce-analytics', {
        body: {
          company_id: 'demo-company',
          analysis_type: 'learning_comprehensive'
        }
      });

      if (error) throw error;

      setLearningAnalytics(data);
      toast({
        title: "Learning Analytics Generated",
        description: "AI-powered learning insights ready"
      });
    } catch (error) {
      console.error('Error fetching learning analytics:', error);
      toast({
        title: "Error",
        description: "Failed to generate learning analytics",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const fetchSkillGapPredictions = async () => {
    setIsLoadingPredictions(true);
    try {
      const { data, error } = await supabase.functions.invoke('skill-gap-predictor', {
        body: {
          companyId: 'demo-company',
          analysisType: 'learning_pathway_optimization',
          skillCategories: categories.filter(cat => cat !== 'All')
        }
      });

      if (error) throw error;

      setSkillGapPredictions(data);
      toast({
        title: "Skill Gap Predictions Ready",
        description: "AI predictions for learning pathway optimization"
      });
    } catch (error) {
      console.error('Error fetching skill gap predictions:', error);
      toast({
        title: "Error",
        description: "Failed to generate skill gap predictions",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  const fetchJobSpecificRecommendations = async () => {
    setIsLoadingJobRecommendations(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-specific-learning-ai', {
        body: {
          employeeId: 'demo-employee-id', // In real app, get from auth/context
          companyId: 'demo-company-id',
          language: 'en'
        }
      });

      if (error) throw error;

      setJobSpecificRecommendations(data.recommendations);
      setEmployeeProfile(data.employeeProfile);
      toast({
        title: "Job-Specific Recommendations Ready",
        description: "Personalized learning path generated based on your role"
      });
    } catch (error) {
      console.error('Error fetching job-specific recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate job-specific recommendations",
        variant: "destructive"
      });
    } finally {
      setIsLoadingJobRecommendations(false);
    }
  };

  useEffect(() => {
    fetchMarketIntelligence();
    fetchLearningAnalytics();
    fetchSkillGapPredictions();
    fetchJobSpecificRecommendations();
  }, []);

  // Get integrated insights
  const engagementInsights = getEngagementInsightsForLeo();
  const aggregatedInsights = getAggregatedInsights();

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            LEO - Learning Experience Optimization
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI-Powered Micro-Learning, Adaptive Pathways & Personalized Skill Development
        </p>
      </div>

      {/* Learning Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.completedModules}</div>
            <div className="text-sm text-muted-foreground">Modules Completed</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.skillsAcquired}</div>
            <div className="text-sm text-muted-foreground">Skills Acquired</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.learningStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.totalHours}</div>
            <div className="text-sm text-muted-foreground">Learning Hours</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-primary">{learningStats.engagementScore}%</div>
            <div className="text-sm text-muted-foreground">Engagement Score</div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Enhanced Market Intelligence Panel */}
      {marketIntelligence && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Live Learning Market Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <pre className="whitespace-pre-wrap text-sm">{marketIntelligence}</pre>
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={fetchMarketIntelligence} 
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

      {/* AI Learning Analytics Panel */}
      {learningAnalytics && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              AI Learning Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Performance Insights</h4>
                <div className="text-sm space-y-2">
                  <div>Completion Rate: <span className="font-bold text-green-600">87%</span></div>
                  <div>Engagement Score: <span className="font-bold text-blue-600">92%</span></div>
                  <div>Knowledge Retention: <span className="font-bold text-orange-600">78%</span></div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Trend Analysis</h4>
                <div className="text-sm space-y-2">
                  <div>Weekly Growth: <span className="font-bold text-green-600">+15%</span></div>
                  <div>Popular Topics: <span className="font-bold">AI, Leadership</span></div>
                  <div>Peak Hours: <span className="font-bold">9-11 AM</span></div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Recommendations</h4>
                <div className="text-sm space-y-2">
                  <div>• Focus on morning sessions</div>
                  <div>• Increase AI content</div>
                  <div>• Add micro-learning modules</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={fetchLearningAnalytics} 
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

      {/* Skill Gap Predictions Panel */}
      {skillGapPredictions && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              AI Skill Gap Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">High Priority Skills</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI & Machine Learning</span>
                      <Badge variant="destructive">Critical Gap</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Digital Leadership</span>
                      <Badge variant="destructive">High Gap</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Analytics</span>
                      <Badge className="bg-orange-500">Medium Gap</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">Learning Path Optimization</h4>
                  <div className="text-sm space-y-2">
                    <div>• Prioritize AI fundamentals for next quarter</div>
                    <div>• Accelerate leadership development</div>
                    <div>• Focus on cultural intelligence</div>
                    <div>• Enhance technical skills pipeline</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={fetchSkillGapPredictions} 
                  disabled={isLoadingPredictions}
                  size="sm"
                  variant="outline"
                >
                  {isLoadingPredictions ? 'Predicting...' : 'Refresh Predictions'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Job-Specific Learning Recommendations */}
      {jobSpecificRecommendations && (
        <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              AI-Personalized Learning for Your Role
              {employeeProfile && (
                <Badge variant="secondary" className="ml-2">
                  {employeeProfile.position}
                </Badge>
              )}
            </CardTitle>
            {employeeProfile && (
              <div className="text-sm text-muted-foreground">
                Customized for {employeeProfile.name} • {employeeProfile.department} • {employeeProfile.experience} years experience
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Primary Recommendations */}
            {jobSpecificRecommendations.primaryRecommendations && (
              <div>
                <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Priority Learning Recommendations
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {jobSpecificRecommendations.primaryRecommendations.slice(0, 4).map((rec, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-indigo-200">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-indigo-900">{rec.title}</h5>
                        <Badge 
                          variant={rec.priority === 'Critical' ? 'destructive' : 
                                 rec.priority === 'High' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rec.estimatedHours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {rec.relevanceScore}% match
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {rec.category}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 mb-2">
                        💡 {rec.visionAlignment}
                      </div>
                      <div className="text-xs text-blue-600">
                        🚀 {rec.careerImpact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Wins */}
            {jobSpecificRecommendations.quickWins && jobSpecificRecommendations.quickWins.length > 0 && (
              <div>
                <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Learning Wins
                </h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {jobSpecificRecommendations.quickWins.map((quick, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h5 className="font-medium text-yellow-800">{quick.title}</h5>
                      <div className="text-sm text-yellow-600 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {quick.duration}
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">{quick.immediateValue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Future Learning Path */}
            {jobSpecificRecommendations.futurePath && (
              <div>
                <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Your Learning Roadmap
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {jobSpecificRecommendations.futurePath.map((path, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-800">{path.timeframe}</span>
                      </div>
                      <h5 className="font-medium text-green-900 mb-2">{path.focus}</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        {path.skills.map((skill, skillIndex) => (
                          <li key={skillIndex} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saudi-Specific Learning */}
            {jobSpecificRecommendations.saudiSpecific && jobSpecificRecommendations.saudiSpecific.length > 0 && (
              <div>
                <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  🇸🇦 Saudi Context Learning
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {jobSpecificRecommendations.saudiSpecific.map((saudi, index) => (
                    <div key={index} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h5 className="font-semibold text-emerald-800">{saudi.area}</h5>
                      <p className="text-sm text-emerald-600 mb-2">{saudi.importance}</p>
                      <p className="text-xs text-emerald-700">💡 {saudi.learningApproach}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={fetchJobSpecificRecommendations} 
                disabled={isLoadingJobRecommendations}
                size="sm"
                variant="outline"
              >
                {isLoadingJobRecommendations ? 'Generating...' : 'Refresh Recommendations'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Learning
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Skills Progress
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="smart-recommendations" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Smart AI
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="advanced-intelligence" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Demo Data Banner */}
          <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">Live Demo Data Active</h3>
                    <p className="text-sm text-muted-foreground">
                      Viewing {trainingModules.length} training modules, {learningProgress.length} learning records, 
                      and {employees.length} employee profiles with real-time progress tracking
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Data Loaded
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real Training Modules from Dummy Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Active Training Modules ({trainingModules.length} total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingModules.map((module) => (
                  <div key={module.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{module.title}</h4>
                        <p className="text-sm text-muted-foreground">{module.title_ar}</p>
                      </div>
                      <div className="flex gap-1">
                        {module.mandatory && <Badge variant="destructive" className="text-xs">Required</Badge>}
                        <Badge variant={module.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {module.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Duration: {module.duration_hours}h</span>
                        <span>Category: {module.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={module.completion_rate} className="flex-1" />
                        <span className="text-sm font-medium">{module.completion_rate}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Deadline: {new Date(module.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full mt-3">
                      {module.completion_rate === 100 ? 'Review' : 'Continue'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Progress by Employee */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Individual Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningProgress.map((progress) => {
                  const employee = employees.find(e => e.id === progress.employee_id);
                  const module = trainingModules.find(m => m.id === progress.module_id);
                  return (
                    <div key={progress.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{employee?.first_name} {employee?.last_name}</h4>
                          <p className="text-sm text-muted-foreground">{employee?.first_name_ar} {employee?.last_name_ar}</p>
                          <p className="text-sm font-medium text-primary">{module?.title}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={progress.completion_percentage === 100 ? 'default' : 'secondary'}>
                            {progress.completion_percentage}% Complete
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {progress.time_spent_hours}h spent
                          </div>
                        </div>
                      </div>
                      
                      <Progress value={progress.completion_percentage} className="mb-3" />
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex gap-4">
                          <span className="text-muted-foreground">
                            Last accessed: {new Date(progress.last_accessed).toLocaleDateString()}
                          </span>
                          {progress.quiz_scores.length > 0 && (
                            <span className="text-muted-foreground">
                              Avg Quiz Score: {Math.round(progress.quiz_scores.reduce((a, b) => a + b, 0) / progress.quiz_scores.length)}%
                            </span>
                          )}
                        </div>
                        {progress.certificates_earned.length > 0 && (
                          <div className="flex gap-1">
                            {progress.certificates_earned.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* LEO-GEO Integration Insights */}
          {!integrationLoading && engagementInsights.length > 0 && (
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  GEO Engagement Insights
                  <Badge variant="secondary" className="ml-2">
                    <Heart className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {engagementInsights.slice(0, 3).map((insight, index) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Continue Learning */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeModules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">Next: {module.nextLesson}</p>
                      </div>
                      <Badge variant="secondary">{module.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{module.duration} min</span>
                      <Progress value={module.progress} className="flex-1" />
                      <span className="text-sm font-medium">{module.progress}%</span>
                    </div>
                    <Button size="sm" className="w-full">Continue Learning</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'}>
                        {rec.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{rec.relevanceScore}% match</span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">⏱️ {rec.duration} min</span>
                      <Button size="sm" variant="outline">Start</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {microLearningModules.map((module) => (
              <Card key={module.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <Badge variant="outline">{module.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{module.duration} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span>{module.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate:</span>
                      <span>{module.completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{module.rating}</span>
                      </div>
                    </div>
                    <Button className="w-full">Start Module</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Skills Development Progress ({filteredSkills.length} skills)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 border border-border rounded-md text-sm bg-background"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredSkills.map((skill, index) => (
                  <div key={index} className="space-y-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="outline" className="text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium">{skill.growth}</span>
                        <Badge variant="secondary">{skill.current}%</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress 
                        value={skill.current} 
                        className="flex-1"
                        style={{
                          // @ts-ignore
                          '--progress-background': skill.current >= skill.target * 0.9 
                            ? 'hsl(var(--status-success))' 
                            : skill.current >= skill.target * 0.7 
                            ? 'hsl(var(--status-warning))' 
                            : 'hsl(var(--primary))'
                        }}
                      />
                      <span className="text-sm text-muted-foreground">Target: {skill.target}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{path.icon}</div>
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">{path.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>{path.completedModules}/{path.totalModules} modules</span>
                      </div>
                      <Progress value={path.progressPercent} />
                      <div className="text-center text-sm text-muted-foreground">
                        Estimated: {path.estimatedTime}
                      </div>
                    </div>
                    <Button className="w-full">Continue Path</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="smart-recommendations" className="space-y-6">
          <SmartRecommendationEngine 
            employeeId="22222222-2222-2222-2222-222222222222"
            companyId="11111111-1111-1111-1111-111111111111"
          />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* Advanced AI Learning Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Real-time Learning Intelligence */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  External Learning Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketIntelligence ? (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{marketIntelligence}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Loading market intelligence...</p>
                  </div>
                )}
                <Button 
                  onClick={fetchMarketIntelligence} 
                  disabled={isLoadingIntelligence}
                  size="sm"
                  className="w-full"
                >
                  {isLoadingIntelligence ? 'Refreshing...' : 'Refresh Intelligence'}
                </Button>
              </CardContent>
            </Card>

            {/* AI Workforce Analytics */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Learning Workforce Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningAnalytics ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Performance Metrics</h4>
                      <div className="text-sm space-y-1">
                        <div>Completion Rate: <span className="font-bold text-green-600">87%</span></div>
                        <div>Engagement Score: <span className="font-bold text-blue-600">92%</span></div>
                        <div>Knowledge Retention: <span className="font-bold text-orange-600">78%</span></div>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">AI Recommendations</h4>
                      <div className="text-sm space-y-1">
                        <div>• Increase micro-learning sessions</div>
                        <div>• Focus on AI & technology topics</div>
                        <div>• Optimize morning learning blocks</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Loading analytics...</p>
                  </div>
                )}
                <Button 
                  onClick={fetchLearningAnalytics} 
                  disabled={isLoadingAnalytics}
                  size="sm"
                  className="w-full"
                >
                  {isLoadingAnalytics ? 'Analyzing...' : 'Generate Analytics'}
                </Button>
              </CardContent>
            </Card>

            {/* Skill Gap Predictor */}
            <Card className="border-green-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  AI Skill Gap Predictions & Learning Path Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillGapPredictions ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">Critical Gaps</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">AI & Machine Learning</span>
                          <Badge variant="destructive">High</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Digital Leadership</span>
                          <Badge variant="destructive">High</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Cultural Intelligence</span>
                          <Badge className="bg-orange-500">Medium</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">Optimization Paths</h4>
                      <div className="text-sm space-y-2">
                        <div>🎯 Focus next quarter on AI fundamentals</div>
                        <div>📈 Accelerate leadership development</div>
                        <div>🌍 Enhance cultural competencies</div>
                        <div>⚡ Build technical skill pipeline</div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">Success Metrics</h4>
                      <div className="text-sm space-y-2">
                        <div>Target: 90% skill coverage</div>
                        <div>Timeline: 6 months</div>
                        <div>Priority: Vision 2030 alignment</div>
                        <div>ROI: 35% productivity increase</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Loading skill gap predictions...</p>
                  </div>
                )}
                <Button 
                  onClick={fetchSkillGapPredictions} 
                  disabled={isLoadingPredictions}
                  size="sm"
                  className="w-full"
                >
                  {isLoadingPredictions ? 'Predicting...' : 'Refresh Predictions'}
                </Button>
              </CardContent>
            </Card>

            {/* Document Intelligence for Learning */}
            <Card className="border-orange-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  AI Document Intelligence for Learning Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3">Content Analysis</h4>
                    <div className="text-sm space-y-2">
                      <div>📄 Training documents processed: <span className="font-bold">247</span></div>
                      <div>🧠 Key concepts extracted: <span className="font-bold">1,540</span></div>
                      <div>🎯 Learning objectives mapped: <span className="font-bold">89</span></div>
                      <div>⚡ Auto-generated quizzes: <span className="font-bold">156</span></div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3">Smart Recommendations</h4>
                    <div className="text-sm space-y-2">
                      <div>• Optimize content for mobile learning</div>
                      <div>• Add interactive elements to Module 12</div>
                      <div>• Simplify complex AI concepts</div>
                      <div>• Include more Saudi cultural context</div>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Latest Processing Results</h4>
                  <p className="text-sm text-muted-foreground">
                    AI has analyzed 15 new learning documents and identified opportunities to enhance 
                    content engagement by 23% through micro-learning optimization and cultural adaptation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">2.3</div>
                  <div className="text-sm text-muted-foreground">Modules per week</div>
                  <div className="text-sm text-green-600">+15% from last month</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">89%</div>
                  <div className="text-sm text-muted-foreground">Average retention rate</div>
                  <div className="text-sm text-green-600">Above organizational average</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">92%</div>
                  <div className="text-sm text-muted-foreground">Completion rate</div>
                  <div className="text-sm text-green-600">Excellent performance</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Application</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">78%</div>
                  <div className="text-sm text-muted-foreground">Skills applied to work</div>
                  <div className="text-sm text-green-600">High practical impact</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Learning Intelligence Tab */}
        <TabsContent value="advanced-intelligence" className="space-y-6">
          
          {/* AI Learning Path Generator */}
          <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-600" />
                AI Learning Path Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-violet-800">Personalized Journey Creation</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-violet-200">
                      <h5 className="font-medium text-violet-900 mb-2">🎯 Role-Based Pathways</h5>
                      <p className="text-sm text-violet-700">Dynamic learning paths tailored to your current position and career aspirations in the Saudi market</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-violet-200">
                      <h5 className="font-medium text-violet-900 mb-2">🇸🇦 Vision 2030 Alignment</h5>
                      <p className="text-sm text-violet-700">Every learning path connects to Saudi Arabia's transformation goals and economic diversification</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-violet-200">
                      <h5 className="font-medium text-violet-900 mb-2">🧠 Learning Style Adaptation</h5>
                      <p className="text-sm text-violet-700">AI adapts content delivery based on your preferred learning methods and pace</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-violet-800">Industry-Specific Intelligence</h4>
                  <div className="p-4 bg-violet-100 rounded-lg">
                    <div className="text-sm space-y-2">
                      <div>🏗️ NEOM Skills: <span className="font-bold text-green-600">15 courses available</span></div>
                      <div>🎭 QIDDIYA Entertainment: <span className="font-bold text-blue-600">8 programs</span></div>
                      <div>🏙️ Red Sea Project: <span className="font-bold text-purple-600">12 specializations</span></div>
                      <div>⚡ Green Riyadh: <span className="font-bold text-emerald-600">6 sustainability tracks</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Learning Impact Analytics */}
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                Real-time Learning Impact Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                  <div className="text-2xl font-bold text-emerald-600">+23%</div>
                  <div className="text-sm text-emerald-800">Performance Score</div>
                  <div className="text-xs text-muted-foreground mt-1">Since last quarter</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <div className="text-sm text-blue-800">Promotion Readiness</div>
                  <div className="text-xs text-muted-foreground mt-1">Leadership track</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                  <div className="text-2xl font-bold text-orange-600">+15%</div>
                  <div className="text-sm text-orange-800">Salary Potential</div>
                  <div className="text-xs text-muted-foreground mt-1">Market projection</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                  <div className="text-2xl font-bold text-purple-600">+31%</div>
                  <div className="text-sm text-purple-800">Team Impact</div>
                  <div className="text-xs text-muted-foreground mt-1">Productivity boost</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Government Certification Tracker */}
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏛️ Government Certification Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-amber-800 mb-3">🇸🇦 Saudi Certifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                      <div>
                        <div className="font-medium">TVTC Technical Certification</div>
                        <div className="text-sm text-muted-foreground">Advanced Manufacturing</div>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                      <div>
                        <div className="font-medium">Saudi Digital Academy</div>
                        <div className="text-sm text-muted-foreground">AI & Data Science</div>
                      </div>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                      <div>
                        <div className="font-medium">HRDF Leadership Program</div>
                        <div className="text-sm text-muted-foreground">Executive Development</div>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-3">📊 Sync Status</h4>
                  <div className="p-4 bg-amber-100 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>TVTC Platform</span>
                        <span className="text-green-600">✓ Synced</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Digital Academy</span>
                        <span className="text-green-600">✓ Synced</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRDF Portal</span>
                        <span className="text-orange-600">⏳ Pending</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MOL Compliance</span>
                        <span className="text-green-600">✓ Current</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cultural Learning Adapter */}
          <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🕌 Cultural Learning Adapter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-rose-200">
                  <h4 className="font-semibold text-rose-800 mb-3">🇸🇦 Saudi Context Adaptation</h4>
                  <ul className="text-sm space-y-2 text-rose-700">
                    <li>• Islamic business ethics integration</li>
                    <li>• Arabic content localization</li>
                    <li>• Cultural case studies</li>
                    <li>• Saudi market examples</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-rose-200">
                  <h4 className="font-semibold text-rose-800 mb-3">🌙 Islamic Calendar Alignment</h4>
                  <ul className="text-sm space-y-2 text-rose-700">
                    <li>• Ramadan-optimized schedules</li>
                    <li>• Prayer time considerations</li>
                    <li>• Holiday-aware planning</li>
                    <li>• Spiritual development tracks</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-rose-200">
                  <h4 className="font-semibold text-rose-800 mb-3">⚡ Micro-Learning Optimization</h4>
                  <ul className="text-sm space-y-2 text-rose-700">
                    <li>• 5-minute focused sessions</li>
                    <li>• Between-prayers learning</li>
                    <li>• Commute-friendly content</li>
                    <li>• Energy-aware scheduling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Gamification Engine */}
          <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎮 Learning Gamification Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-cyan-800 mb-3">🏆 Achievement System</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-cyan-200">
                      <div className="text-2xl">🕌</div>
                      <div>
                        <div className="font-medium">Vision 2030 Champion</div>
                        <div className="text-sm text-muted-foreground">Complete 10 Vision-aligned courses</div>
                      </div>
                      <Badge className="bg-gold text-white">Earned</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-cyan-200">
                      <div className="text-2xl">🌟</div>
                      <div>
                        <div className="font-medium">Cultural Ambassador</div>
                        <div className="text-sm text-muted-foreground">Master Saudi business culture</div>
                      </div>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-cyan-200">
                      <div className="text-2xl">⚡</div>
                      <div>
                        <div className="font-medium">Innovation Pioneer</div>
                        <div className="text-sm text-muted-foreground">Lead 3 digital transformation projects</div>
                      </div>
                      <Badge variant="outline">Locked</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-800 mb-3">🏅 Department Competition</h4>
                  <div className="p-4 bg-cyan-100 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">🥇 IT Department</span>
                        <span className="font-bold text-gold">2,547 points</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">🥈 HR Department</span>
                        <span className="font-bold text-gray-500">2,341 points</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">🥉 Finance</span>
                        <span className="font-bold text-orange-600">2,156 points</span>
                      </div>
                      <div className="text-xs text-cyan-700 mt-2">
                        Monthly learning challenge • Your team: Marketing (4th place)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Mentorship Matching */}
          <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤝 AI Mentorship Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-teal-800 mb-3">🎯 Smart Pairing Algorithm</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-teal-200">
                      <h5 className="font-medium text-teal-900">Skill Gap Analysis</h5>
                      <p className="text-sm text-teal-700">Matches mentors with expertise in your development areas</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-teal-200">
                      <h5 className="font-medium text-teal-900">Cultural Compatibility</h5>
                      <p className="text-sm text-teal-700">Considers cultural background and communication styles</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-teal-200">
                      <h5 className="font-medium text-teal-900">Career Path Alignment</h5>
                      <p className="text-sm text-teal-700">Connects you with mentors who've walked your desired path</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-teal-800 mb-3">👥 Suggested Mentors</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-teal-200">
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                        AH
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Ahmed Al-Hassan</div>
                        <div className="text-sm text-muted-foreground">Senior AI Engineer • 98% match</div>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-teal-200">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        SF
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Sarah Al-Fahad</div>
                        <div className="text-sm text-muted-foreground">Digital Transformation Lead • 94% match</div>
                      </div>
                      <Button size="sm" variant="outline">View Profile</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice-Enabled Learning Assistant */}
          <Card className="border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎤 Voice-Enabled Learning Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">🚗 Commute Learning</h4>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li>• Hands-free audio lessons</li>
                    <li>• Traffic-aware session lengths</li>
                    <li>• Podcast-style delivery</li>
                    <li>• Voice quiz interactions</li>
                  </ul>
                  <Button size="sm" className="w-full mt-3">
                    Start Voice Session
                  </Button>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">🗣️ Bilingual Support</h4>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li>• Arabic voice recognition</li>
                    <li>• English pronunciation help</li>
                    <li>• Technical term coaching</li>
                    <li>• Accent adaptation</li>
                  </ul>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Practice Pronunciation
                  </Button>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">🧠 Smart Conversations</h4>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li>• Context-aware responses</li>
                    <li>• Learning progress tracking</li>
                    <li>• Personalized difficulty</li>
                    <li>• Achievement celebrations</li>
                  </ul>
                  <Button size="sm" variant="secondary" className="w-full mt-3">
                    Chat with AI Tutor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning ROI Calculator */}
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Learning ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3">📈 Productivity Impact</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">+34%</div>
                    <div className="text-sm text-emerald-800">Efficiency Increase</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Based on AI & Data Analytics skills
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-emerald-50 rounded text-sm">
                    <div className="font-medium text-emerald-800">Value Generated:</div>
                    <div className="text-emerald-700">SAR 45,000 annually</div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3">⏱️ Time to Competency</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Traditional Training</span>
                      <span className="font-bold text-red-600">12 months</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI-Optimized Path</span>
                      <span className="font-bold text-green-600">7 months</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded text-center">
                      <div className="text-lg font-bold text-emerald-600">42% Faster</div>
                      <div className="text-xs text-emerald-700">Time Savings</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3">💸 Cost vs. Benefit</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Training Investment</span>
                      <span className="font-bold">SAR 8,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Annual Value Return</span>
                      <span className="font-bold text-green-600">SAR 45,000</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded text-center">
                      <div className="text-lg font-bold text-emerald-600">5.3x ROI</div>
                      <div className="text-xs text-emerald-700">Return on Investment</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AqlHR AI Assistant */}
      <AqlHRAIAssistant moduleContext="leo.learningOptimization" />
    </div>
  );
};

export default LearningExperienceOptimization;