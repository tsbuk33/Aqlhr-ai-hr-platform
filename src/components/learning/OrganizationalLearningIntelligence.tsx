import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { 
  Building, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users, 
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  PieChart,
  BarChart,
  Calendar
} from 'lucide-react';

export const OrganizationalLearningIntelligence: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const departmentEffectiveness = [
    {
      department: 'Engineering',
      employees: 245,
      trainingHours: 1247,
      effectiveness: 92,
      roi: 320,
      completionRate: 87,
      skillsGrowth: 23,
      trend: 'up'
    },
    {
      department: 'Sales',
      employees: 189,
      trainingHours: 967,
      effectiveness: 89,
      roi: 285,
      completionRate: 94,
      skillsGrowth: 19,
      trend: 'up'
    },
    {
      department: 'Marketing',
      employees: 156,
      trainingHours: 834,
      effectiveness: 85,
      roi: 245,
      completionRate: 78,
      skillsGrowth: 16,
      trend: 'stable'
    },
    {
      department: 'HR',
      employees: 67,
      trainingHours: 452,
      effectiveness: 88,
      roi: 198,
      completionRate: 91,
      skillsGrowth: 21,
      trend: 'up'
    },
    {
      department: 'Finance',
      employees: 89,
      trainingHours: 523,
      effectiveness: 79,
      roi: 167,
      completionRate: 73,
      skillsGrowth: 12,
      trend: 'down'
    }
  ];

  const trainingROI = [
    {
      program: 'Data Analytics Certification',
      investment: 125000,
      participants: 156,
      productivity: 28,
      efficiency: 22,
      roi: 340,
      payback: '4.2 months'
    },
    {
      program: 'Leadership Development',
      investment: 89000,
      participants: 89,
      productivity: 18,
      efficiency: 15,
      roi: 245,
      payback: '6.1 months'
    },
    {
      program: 'Arabic Communication',
      investment: 67000,
      participants: 234,
      productivity: 12,
      efficiency: 19,
      roi: 198,
      payback: '5.8 months'
    },
    {
      program: 'Technical Skills Update',
      investment: 156000,
      participants: 287,
      productivity: 31,
      efficiency: 25,
      roi: 425,
      payback: '3.7 months'
    }
  ];

  const skillsProgression = [
    { skill: 'Data Analysis', current: 67, target: 85, gap: 18, priority: 'high' },
    { skill: 'Digital Marketing', current: 78, target: 90, gap: 12, priority: 'medium' },
    { skill: 'Project Management', current: 72, target: 88, gap: 16, priority: 'high' },
    { skill: 'Customer Service', current: 84, target: 92, gap: 8, priority: 'low' },
    { skill: 'Leadership', current: 59, target: 80, gap: 21, priority: 'high' },
    { skill: 'Communication', current: 81, target: 90, gap: 9, priority: 'medium' }
  ];

  const trainingNeeds = [
    {
      category: 'Technical Skills',
      urgency: 'high',
      affectedEmployees: 312,
      estimatedCost: 245000,
      expectedROI: 380,
      timeline: '3 months',
      skills: ['Cloud Computing', 'AI/ML Basics', 'Cybersecurity']
    },
    {
      category: 'Soft Skills',
      urgency: 'medium',
      affectedEmployees: 189,
      estimatedCost: 89000,
      expectedROI: 220,
      timeline: '4 months',
      skills: ['Communication', 'Teamwork', 'Time Management']
    },
    {
      category: 'Compliance',
      urgency: 'high',
      affectedEmployees: 567,
      estimatedCost: 67000,
      expectedROI: 150,
      timeline: '2 months',
      skills: ['Data Privacy', 'Safety Protocols', 'Ethics']
    },
    {
      category: 'Leadership',
      urgency: 'low',
      affectedEmployees: 45,
      estimatedCost: 156000,
      expectedROI: 425,
      timeline: '6 months',
      skills: ['Strategic Thinking', 'Team Management', 'Decision Making']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('leo.org_intelligence_title', 'Organizational Learning Intelligence')}</h2>
            <p className="text-muted-foreground">
              {t('leo.org_intelligence_desc', 'Enterprise-wide learning analytics and strategic insights')}
            </p>
          </div>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          {t('leo.schedule_review', 'Schedule Review')}
        </Button>
      </div>

      <Tabs defaultValue="department-effectiveness" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="department-effectiveness">{t('leo.department_effectiveness', 'Department Effectiveness')}</TabsTrigger>
          <TabsTrigger value="training-roi">{t('leo.training_roi', 'Training ROI')}</TabsTrigger>
          <TabsTrigger value="skills-progression">{t('leo.skills_progression', 'Skills Progression')}</TabsTrigger>
          <TabsTrigger value="training-forecasting">{t('leo.training_forecasting', 'Training Forecasting')}</TabsTrigger>
        </TabsList>

        {/* Department-wise Training Effectiveness */}
        <TabsContent value="department-effectiveness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.department_training_effectiveness', 'Department-wise Training Effectiveness')}</CardTitle>
              <CardDescription>
                {t('leo.effectiveness_desc', 'Comparative analysis of training outcomes across departments')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentEffectiveness.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{dept.department}</h4>
                          <p className="text-sm text-muted-foreground">
                            {dept.employees} employees • {dept.trainingHours} training hours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={dept.trend === 'up' ? 'default' : 
                                      dept.trend === 'stable' ? 'secondary' : 'destructive'}>
                          {dept.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                          {dept.effectiveness}% effective
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <DollarSign className="h-5 w-5 mx-auto mb-2 text-green-600" />
                        <p className="text-sm text-muted-foreground">ROI</p>
                        <p className="text-lg font-bold text-green-600">{dept.roi}%</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-muted-foreground">Completion</p>
                        <p className="text-lg font-bold">{dept.completionRate}%</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <TrendingUp className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm text-muted-foreground">Skills Growth</p>
                        <p className="text-lg font-bold text-purple-600">+{dept.skillsGrowth}%</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Clock className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                        <p className="text-sm text-muted-foreground">Avg Hours/Employee</p>
                        <p className="text-lg font-bold">{Math.round(dept.trainingHours / dept.employees)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {t('leo.key_insights', 'Key Insights')}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Engineering leads with 92% effectiveness and highest ROI (320%)</li>
                  <li>• Finance department shows declining trend - requires intervention</li>
                  <li>• Sales achieves highest completion rate (94%) despite lower hours per employee</li>
                  <li>• Cross-departmental average effectiveness: 87%</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Measurement on Training Investments */}
        <TabsContent value="training-roi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.training_roi_measurement', 'ROI Measurement on Training Investments')}</CardTitle>
              <CardDescription>
                {t('leo.roi_desc', 'Comprehensive financial analysis of training program returns')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trainingROI.map((program, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{program.program}</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.participants} participants • ${program.investment.toLocaleString()} investment
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{program.roi}%</p>
                        <p className="text-sm text-muted-foreground">ROI</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Productivity Gain</p>
                        <div className="flex items-center gap-2">
                          <Progress value={program.productivity} className="flex-1" />
                          <span className="font-medium">+{program.productivity}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Efficiency Gain</p>
                        <div className="flex items-center gap-2">
                          <Progress value={program.efficiency} className="flex-1" />
                          <span className="font-medium">+{program.efficiency}%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Payback Period</p>
                        <p className="text-lg font-bold text-blue-600">{program.payback}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Cost per Participant</p>
                        <p className="text-lg font-bold">${Math.round(program.investment / program.participants).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Total Investment</h4>
                  </div>
                  <p className="text-2xl font-bold">$437K</p>
                  <p className="text-sm text-muted-foreground">Across all programs</p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold">Average ROI</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">302%</p>
                  <p className="text-sm text-muted-foreground">Weighted average return</p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">Avg Payback</h4>
                  </div>
                  <p className="text-2xl font-bold">5.0 months</p>
                  <p className="text-sm text-muted-foreground">Time to break even</p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Development Progression */}
        <TabsContent value="skills-progression" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.skills_development_progression', 'Skills Development Progression')}</CardTitle>
              <CardDescription>
                {t('leo.progression_desc', 'Organization-wide skills advancement tracking and gap analysis')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsProgression.map((skill, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">{skill.skill}</h4>
                          <p className="text-sm text-muted-foreground">
                            Current: {skill.current}% • Target: {skill.target}%
                          </p>
                        </div>
                      </div>
                      <Badge variant={skill.priority === 'high' ? 'destructive' : 
                                    skill.priority === 'medium' ? 'secondary' : 'default'}>
                        {skill.priority} priority
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Level</span>
                        <span>{skill.current}%</span>
                      </div>
                      <Progress value={skill.current} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Target Level</span>
                        <span>{skill.target}%</span>
                      </div>
                      <Progress value={skill.target} className="h-1 opacity-50" />
                      
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Skills Gap</span>
                        <span className="font-medium text-orange-600">{skill.gap} points</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t('leo.priority_areas', 'Priority Development Areas')}
                </h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• <strong>Leadership</strong>: Largest gap (21 points) - requires immediate attention</li>
                  <li>• <strong>Data Analysis</strong>: High business impact - accelerate development</li>
                  <li>• <strong>Project Management</strong>: Critical for operational efficiency</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Needs Forecasting */}
        <TabsContent value="training-forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.training_needs_forecasting', 'Training Needs Forecasting')}</CardTitle>
              <CardDescription>
                {t('leo.forecasting_desc', 'AI-powered prediction of future training requirements')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trainingNeeds.map((need, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          need.urgency === 'high' ? 'bg-red-100 text-red-600' :
                          need.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {need.urgency === 'high' ? <AlertTriangle className="h-5 w-5" /> :
                           need.urgency === 'medium' ? <Clock className="h-5 w-5" /> :
                           <CheckCircle className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{need.category}</h4>
                          <p className="text-sm text-muted-foreground">
                            {need.affectedEmployees} employees • {need.timeline} timeline
                          </p>
                        </div>
                      </div>
                      <Badge variant={need.urgency === 'high' ? 'destructive' : 
                                    need.urgency === 'medium' ? 'secondary' : 'default'}>
                        {need.urgency} urgency
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <DollarSign className="h-5 w-5 mx-auto mb-2 text-red-600" />
                        <p className="text-sm text-muted-foreground">Estimated Cost</p>
                        <p className="text-lg font-bold">${need.estimatedCost.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-600" />
                        <p className="text-sm text-muted-foreground">Expected ROI</p>
                        <p className="text-lg font-bold text-green-600">{need.expectedROI}%</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Users className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-muted-foreground">Cost per Employee</p>
                        <p className="text-lg font-bold">${Math.round(need.estimatedCost / need.affectedEmployees).toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">{t('leo.key_skills', 'Key Skills to Develop')}</h5>
                      <div className="flex flex-wrap gap-2">
                        {need.skills.map((skill, i) => (
                          <Badge key={i} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    {t('leo.immediate_actions', 'Immediate Actions Required')}
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Technical Skills training for 312 employees
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Compliance training for all 567 staff members
                    </li>
                  </ul>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-500" />
                    {t('leo.budget_allocation', 'Recommended Budget Allocation')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Technical Skills (45%)</span>
                      <span>$245K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leadership (29%)</span>
                      <span>$156K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Soft Skills (16%)</span>
                      <span>$89K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Compliance (12%)</span>
                      <span>$67K</span>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};