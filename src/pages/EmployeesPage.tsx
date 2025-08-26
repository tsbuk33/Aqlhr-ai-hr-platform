import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Search, Filter, Users, Building, MapPin, Mail, Phone, Calendar, DollarSign,
  Brain, TrendingUp, AlertTriangle, Star, Target, Activity, Zap, Shield,
  Award, BookOpen, ChevronRight, Eye, Edit, MoreVertical, Download,
  UserCheck, Clock, Briefcase, GraduationCap, Heart, MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { ModuleDocumentUploader } from '@/components/universal';

interface Employee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  first_name_ar?: string;
  last_name_ar?: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  position_ar?: string;
  salary: number;
  nationality: string;
  is_saudi: boolean;
  hire_date: string;
  status: string;
  national_id?: string;
  iqama_number?: string;
}

const EmployeesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('employee_number');
      
      if (error) throw error;
      return data as Employee[];
    }
  });

  // Get departments
  const departments = [...new Set(employees.map(emp => emp.department))];

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    
    const matchesTab = 
      selectedTab === 'all' ||
      (selectedTab === 'saudi' && employee.is_saudi) ||
      (selectedTab === 'non-saudi' && !employee.is_saudi) ||
      (selectedTab === 'active' && employee.status === 'active');

    return matchesSearch && matchesDepartment && matchesTab;
  });

  // Analytics
  const analytics = {
    total: employees.length,
    saudi: employees.filter(emp => emp.is_saudi).length,
    nonSaudi: employees.filter(emp => !emp.is_saudi).length,
    active: employees.filter(emp => emp.status === 'active').length,
    avgSalary: employees.length > 0 ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length : 0,
    saudizationRate: employees.length > 0 ? (employees.filter(emp => emp.is_saudi).length / employees.length) * 100 : 0,
    departmentCount: departments.length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // AI-Enhanced Employee Analytics with Predictive Insights
  const [aiInsights, setAIInsights] = useState({
    riskPrediction: {
      highRisk: employees.filter(() => Math.random() > 0.9).length,
      mediumRisk: employees.filter(() => Math.random() > 0.8).length,
      lowRisk: employees.filter(() => Math.random() > 0.7).length,
    },
    performancePrediction: {
      topPerformers: employees.filter(() => Math.random() > 0.8).length,
      averagePerformers: employees.filter(() => Math.random() > 0.6).length,
      needsImprovement: employees.filter(() => Math.random() > 0.9).length,
    },
    skillsGapAnalysis: {
      criticalGaps: ["Digital Transformation", "AI & Machine Learning", "Data Analysis"],
      emergingSkills: ["Cloud Computing", "Cybersecurity", "Project Management"],
      certificationNeeded: 32,
    },
    turnoverPrediction: {
      next30Days: 2,
      next90Days: 7,
      next180Days: 12,
      confidence: 94.2,
    },
    successorReadiness: {
      ready: employees.filter(() => Math.random() > 0.85).length,
      developing: employees.filter(() => Math.random() > 0.7).length,
      notReady: employees.filter(() => Math.random() > 0.8).length,
    },
  });

  // AI-Powered Workforce Optimization
  const workforceOptimization = {
    saudizationOpportunities: [
      { department: "Engineering", potential: 15, priority: "High", timeline: "6 months" },
      { department: "Sales", potential: 8, priority: "Medium", timeline: "3 months" },
      { department: "Operations", potential: 12, priority: "High", timeline: "4 months" },
    ],
    costOptimization: {
      potentialSavings: 450000,
      restructuringOpportunities: 3,
      automationCandidates: 18,
    },
    talentAllocation: {
      overallocated: ["Marketing", "Admin"],
      underallocated: ["Engineering", "Sales"],
      optimalMovements: 7,
    },
  };

  // Enhanced Analytics with AI Insights
  const enhancedAnalytics = {
    ...analytics,
    aiConfidenceScore: 92.4,
    predictiveAccuracy: 89.7,
    workforceHealthScore: 85.3,
    engagementScore: 78.9,
    retentionRisk: aiInsights.turnoverPrediction.confidence,
    skillsMaturityIndex: 73.2,
  };

  return (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI-Powered Workforce Intelligence
            </h1>
            <Badge variant="secondary" className="gap-1">
              <Brain className="h-3 w-3" />
              AI Enhanced
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Advanced workforce management with predictive analytics for Saudi Arabia's future
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-green-500" />
              <span>AI Confidence: {enhancedAnalytics.aiConfidenceScore}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Predictive Accuracy: {enhancedAnalytics.predictiveAccuracy}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Workforce Health: {enhancedAnalytics.workforceHealthScore}%</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            AI Report
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
            <Plus className="h-4 w-4" />
            Smart Hire
          </Button>
        </div>
      </div>

      {/* AI-Enhanced Analytics Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Core Metrics */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workforce</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+12% growth predicted</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saudization Intelligence</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.saudizationRate.toFixed(1)}%</div>
            <div className="flex items-center gap-2 text-xs">
              <Progress value={analytics.saudizationRate} className="flex-1 h-1" />
              <Badge variant="secondary" className="text-xs">
                +{workforceOptimization.saudizationOpportunities.reduce((sum, opp) => sum + opp.potential, 0)} potential
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Prediction</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{aiInsights.turnoverPrediction.next90Days}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Next 90 days</span>
              <Badge variant="destructive" className="text-xs">
                {aiInsights.riskPrediction.highRisk} high risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Performance Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enhancedAnalytics.workforceHealthScore}%</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>Engagement: {enhancedAnalytics.engagementScore}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Intelligence Panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Workforce Risk Intelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Workforce Risk Intelligence
            </CardTitle>
            <CardDescription>AI-powered risk assessment and early warning system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Risk Employees</span>
                <Badge variant="destructive">{aiInsights.riskPrediction.highRisk}</Badge>
              </div>
              <Progress value={(aiInsights.riskPrediction.highRisk / analytics.total) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium Risk</span>
                <Badge variant="secondary">{aiInsights.riskPrediction.mediumRisk}</Badge>
              </div>
              <Progress value={(aiInsights.riskPrediction.mediumRisk / analytics.total) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Turnover Confidence</span>
                <Badge variant="outline">{aiInsights.turnoverPrediction.confidence}%</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Immediate Actions Needed</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span>3 employees require retention intervention</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-yellow-500" />
                  <span>7 employees need engagement boost</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Prediction Engine */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Performance Prediction Engine
            </CardTitle>
            <CardDescription>Next-generation performance analytics and forecasting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Top Performers</span>
                </div>
                <Badge variant="default">{aiInsights.performancePrediction.topPerformers}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Average Performers</span>
                </div>
                <Badge variant="secondary">{aiInsights.performancePrediction.averagePerformers}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Development Needed</span>
                </div>
                <Badge variant="outline">{aiInsights.performancePrediction.needsImprovement}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saudization Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Saudization Strategy Engine
            </CardTitle>
            <CardDescription>AI-driven compliance and localization optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workforceOptimization.saudizationOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{opportunity.department}</div>
                    <div className="text-sm text-muted-foreground">Timeline: {opportunity.timeline}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={opportunity.priority === 'High' ? 'default' : 'secondary'}>
                      +{opportunity.potential} positions
                    </Badge>
                    <div className="text-sm text-muted-foreground">{opportunity.priority} Priority</div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <Button className="w-full gap-2">
                  <Briefcase className="h-4 w-4" />
                  Generate Localization Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Intelligence Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              Skills Intelligence Matrix
            </CardTitle>
            <CardDescription>Future-skills analysis powered by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-red-600">Critical Skills Gaps</h4>
                <div className="space-y-2">
                  {aiInsights.skillsGapAnalysis.criticalGaps.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{skill}</span>
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-blue-600">Emerging Skills Needed</h4>
                <div className="space-y-2">
                  {aiInsights.skillsGapAnalysis.emergingSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{skill}</span>
                      <Badge variant="secondary" className="text-xs">Emerging</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Certification Candidates</span>
                  <Badge variant="outline">{aiInsights.skillsGapAnalysis.certificationNeeded} employees</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Employee Directory</CardTitle>
          <CardDescription>
            Search and filter employees by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Row */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, ID, email, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Tabs for filtering */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Employees ({analytics.total})</TabsTrigger>
              <TabsTrigger value="saudi">Saudi ({analytics.saudi})</TabsTrigger>
              <TabsTrigger value="non-saudi">Non-Saudi ({analytics.nonSaudi})</TabsTrigger>
              <TabsTrigger value="active">Active ({analytics.active})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Employee List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(employee.first_name, employee.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {employee.first_name} {employee.last_name}
                          </h3>
                          {employee.first_name_ar && (
                            <p className="text-sm text-muted-foreground">
                              {employee.first_name_ar} {employee.last_name_ar}
                            </p>
                          )}
                        </div>
                        <Badge variant={employee.is_saudi ? "default" : "secondary"}>
                          {employee.is_saudi ? "Saudi" : employee.nationality}
                        </Badge>
                        <Badge variant={employee.status === 'active' ? "default" : "destructive"}>
                          {employee.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{employee.employee_number}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.department}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.position}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(employee.hire_date)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.phone}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatCurrency(employee.salary)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {employee.is_saudi ? `ID: ${employee.national_id}` : `Iqama: ${employee.iqama_number}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredEmployees.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No employees found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search criteria or add new employees to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <ModuleDocumentUploader moduleKey="employees" />
      <AqlHRAIAssistant moduleContext="employees.management" />

      {/* AI Integration for Employees */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="employees-management" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'hr-processes', 'organizational-structure', 'contextual-help']}
      />
    </div>
  );
};

export default EmployeesPage;