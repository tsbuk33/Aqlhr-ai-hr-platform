import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Target, TrendingUp, Award, Clock, Play, Users, Star, Zap, Filter } from 'lucide-react';

const LearningExperienceOptimization: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
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
      </Tabs>
    </div>
  );
};

export default LearningExperienceOptimization;