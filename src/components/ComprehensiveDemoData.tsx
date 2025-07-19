import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, Building, BookOpen, TrendingUp, Calendar, 
  Clock, Award, Target, AlertTriangle, CheckCircle,
  BarChart3, PieChart, LineChart, Activity,
  Brain, Lightbulb, Zap, Shield, Heart
} from 'lucide-react';
import {
  generateDummyEmployees,
  generateDummyPositions,
  generateDummyDepartments,
  generateDummySkills,
  generateDummyTraining,
  generateDummyKPIs,
  generateDummyProjects,
  generateAnalyticsData,
  generateGovernmentIntegrations,
  generateDummyAttendanceRecords,
  generateDummyTrainingModules,
  generateDummyEngagementMetrics,
  generateDummyLearningProgress,
  generateDummyRecommendations
} from '@/utils/dummyData';

export const ComprehensiveDemoData: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('overview');
  
  const employees = generateDummyEmployees();
  const positions = generateDummyPositions();
  const departments = generateDummyDepartments();
  const skills = generateDummySkills();
  const training = generateDummyTraining();
  const kpis = generateDummyKPIs();
  const projects = generateDummyProjects();
  const analytics = generateAnalyticsData();
  const govIntegrations = generateGovernmentIntegrations();
  const attendance = generateDummyAttendanceRecords();
  const trainingModules = generateDummyTrainingModules();
  const engagement = generateDummyEngagementMetrics();
  const learningProgress = generateDummyLearningProgress();
  const recommendations = generateDummyRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AqlHR Platform Demo
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore all modules and tools with comprehensive dummy data to see how each system operates
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{employees.length}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Employees</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <Building className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{departments.length}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Departments</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{trainingModules.length}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Training Modules</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{kpis.length}</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">KPIs</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{recommendations.length}</div>
              <div className="text-sm text-teal-600 dark:text-teal-400">AI Insights</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 border-rose-200 dark:border-rose-800">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-rose-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">87%</div>
              <div className="text-sm text-rose-600 dark:text-rose-400">Engagement</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Demo Tabs */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 p-3">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2 p-3">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Employees</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2 p-3">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learning</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-2 p-3">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Engagement</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 p-3">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2 p-3">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Department Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-muted-foreground">{dept.name_ar}</div>
                      </div>
                      <Badge variant="secondary">{dept.employee_count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Today's Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.realTimeMetrics.currentlyWorking}
                      </div>
                      <div className="text-sm text-muted-foreground">Present</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.realTimeMetrics.remote}
                      </div>
                      <div className="text-sm text-muted-foreground">Remote</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {analytics.realTimeMetrics.onBreak}
                      </div>
                      <div className="text-sm text-muted-foreground">On Break</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {analytics.realTimeMetrics.absent}
                      </div>
                      <div className="text-sm text-muted-foreground">Absent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Training Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trainingModules.slice(0, 3).map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">{module.title}</div>
                        <Badge variant={module.completion_rate > 80 ? 'default' : 'secondary'}>
                          {module.completion_rate}%
                        </Badge>
                      </div>
                      <Progress value={module.completion_rate} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Directory</CardTitle>
                  <CardDescription>Complete employee information with performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map((employee) => (
                      <Card key={employee.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{employee.first_name} {employee.last_name}</div>
                              <div className="text-sm text-muted-foreground">{employee.first_name_ar} {employee.last_name_ar}</div>
                              <div className="text-sm font-medium text-primary">{employee.position}</div>
                            </div>
                            <Badge variant={employee.is_saudi ? 'default' : 'secondary'}>
                              {employee.is_saudi ? 'Saudi' : 'Expat'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Department:</span> {employee.department}
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Salary:</span> {employee.salary.toLocaleString()} SAR
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Performance:</span> {employee.performance_score}%
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {employee.skills?.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Training Modules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trainingModules.map((module) => (
                    <div key={module.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{module.title}</div>
                          <div className="text-sm text-muted-foreground">{module.title_ar}</div>
                        </div>
                        <div className="flex gap-2">
                          {module.mandatory && <Badge variant="destructive">Mandatory</Badge>}
                          <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                            {module.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">{module.description}</div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Duration:</span> {module.duration_hours}h
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={module.completion_rate} className="w-20 h-2" />
                          <span className="text-sm font-medium">{module.completion_rate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {learningProgress.map((progress) => {
                    const employee = employees.find(e => e.id === progress.employee_id);
                    const module = trainingModules.find(m => m.id === progress.module_id);
                    return (
                      <div key={progress.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{employee?.first_name} {employee?.last_name}</div>
                            <div className="text-sm text-muted-foreground">{module?.title}</div>
                          </div>
                          <Badge variant={progress.completion_percentage === 100 ? 'default' : 'secondary'}>
                            {progress.completion_percentage}%
                          </Badge>
                        </div>
                        
                        <Progress value={progress.completion_percentage} className="h-2" />
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Time spent: {progress.time_spent_hours}h</span>
                          <span>Last accessed: {progress.last_accessed}</span>
                        </div>

                        {progress.certificates_earned.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {progress.certificates_earned.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Employee Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {engagement.map((metric) => {
                    const employee = employees.find(e => e.id === metric.employee_id);
                    return (
                      <div key={metric.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{employee?.first_name} {employee?.last_name}</div>
                            <div className="text-sm text-muted-foreground">{employee?.department}</div>
                          </div>
                          <Badge variant={metric.engagement_score > 80 ? 'default' : metric.engagement_score > 60 ? 'secondary' : 'destructive'}>
                            {metric.engagement_score}% Engaged
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Satisfaction</div>
                            <div className="font-medium">{metric.satisfaction_score}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Productivity</div>
                            <div className="font-medium">{metric.productivity_score}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Stress Level</div>
                            <div className="font-medium">{metric.stress_level}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Date</div>
                            <div className="font-medium">{metric.date}</div>
                          </div>
                        </div>

                        {metric.feedback && (
                          <div className="text-sm p-2 bg-muted rounded italic">
                            "{metric.feedback}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Engagement Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-sm text-muted-foreground">Avg Engagement</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">83%</div>
                      <div className="text-sm text-muted-foreground">Avg Satisfaction</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">88%</div>
                      <div className="text-sm text-muted-foreground">Avg Productivity</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">31%</div>
                      <div className="text-sm text-muted-foreground">Avg Stress</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Department Rankings</h4>
                    {['IT', 'Finance', 'HR', 'Operations', 'Marketing'].map((dept, index) => (
                      <div key={dept} className="flex justify-between items-center">
                        <span>{dept}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={92 - index * 5} className="w-20 h-2" />
                          <span className="text-sm font-medium">{92 - index * 5}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.performanceMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{metric.metric}</div>
                        <div className="text-sm text-muted-foreground">
                          Change: {metric.change > 0 ? '+' : ''}{metric.change}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{metric.value}{metric.metric === 'Customer Satisfaction' ? '' : '%'}</div>
                        <Badge variant={metric.change > 0 ? 'default' : 'destructive'}>
                          {metric.change > 0 ? '↗' : '↘'} {Math.abs(metric.change)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employee Growth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.employeeGrowth.map((data, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{data.month}</div>
                        <div className="text-sm text-muted-foreground">Target: {data.target}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{data.employees}</div>
                        <Badge variant={data.employees >= data.target ? 'default' : 'secondary'}>
                          {data.employees >= data.target ? '✓' : '⚠'} {((data.employees / data.target) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI-Powered Recommendations
                  </CardTitle>
                  <CardDescription>Smart insights connecting learning and engagement data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-lg">{rec.title}</div>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                              {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{Math.round(rec.confidence * 100)}% Confidence</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">{rec.description}</p>
                        
                        <div className="space-y-2">
                          <div className="font-medium text-sm">Recommended Actions:</div>
                          <ul className="space-y-1">
                            {rec.actions.map((action, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>Type: {rec.type.replace(/_/g, ' ')}</span>
                          <span>Expires: {new Date(rec.expires_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
            <Zap className="h-4 w-4 mr-2" />
            Explore Live System
          </Button>
          <Button variant="outline" size="lg">
            <Shield className="h-4 w-4 mr-2" />
            View System Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDemoData;