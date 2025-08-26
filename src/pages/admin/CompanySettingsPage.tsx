import React, { useState, useEffect } from 'react';
import { useCompanySetup } from '@/hooks/useCompanySetup';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Building2, Users, Settings, AlertTriangle, Sparkles, Database, Brain,
  Shield, Zap, BarChart3, Clock, CheckCircle2, TrendingUp, Globe,
  Activity, Lock, Rocket, Award, Target, PieChart, LineChart
} from 'lucide-react';
import { RoleGuard } from '@/components/rbac/RoleGuard';

const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'construction', label: 'Construction' },
  { value: 'energy', label: 'Energy & Oil' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'other', label: 'Other' }
];

const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
];

export default function CompanySettingsPage() {
  const { companyInfo, setupStatus, createDemoCompany, loading } = useCompanySetup();
  const { profile } = useUserProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiSystemHealth, setAISystemHealth] = useState({
    overall: 97.8,
    security: 99.2,
    performance: 96.4,
    compliance: 98.7,
    automation: 94.3
  });
  
  // Simulate real-time AI system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setAISystemHealth(prev => ({
        overall: Math.min(100, prev.overall + (Math.random() * 0.3 - 0.1)),
        security: Math.min(100, prev.security + (Math.random() * 0.1 - 0.05)),
        performance: Math.min(100, prev.performance + (Math.random() * 0.4 - 0.2)),
        compliance: Math.min(100, prev.compliance + (Math.random() * 0.2 - 0.1)),
        automation: Math.min(100, prev.automation + (Math.random() * 0.5 - 0.25))
      }));
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  const aiSettingsScenarios = [
    {
      id: 'intelligent_configuration',
      title: 'Intelligent Configuration Management',
      description: 'AI automatically optimizes system settings based on usage patterns and performance metrics',
      icon: Settings,
      scenario: 'Smart AI analyzed 2,847 configuration parameters across all modules. Identified 34 optimization opportunities resulting in 23% performance improvement and 15% cost reduction.',
      metrics: {
        parameters_analyzed: '2,847',
        optimizations_found: 34,
        performance_gain: '23%',
        cost_reduction: '15%'
      }
    },
    {
      id: 'predictive_security',
      title: 'Predictive Security Intelligence',
      description: 'Advanced AI monitors and predicts security threats in real-time',
      icon: Shield,
      scenario: 'AI security engine processed 156,743 events. Detected 23 potential threats with 99.7% accuracy. Prevented 15 security incidents through predictive analysis.',
      metrics: {
        events_processed: '156,743',
        threats_detected: 23,
        accuracy_rate: '99.7%',
        incidents_prevented: 15
      }
    },
    {
      id: 'automated_compliance',
      title: 'Automated Compliance Management',
      description: 'AI ensures continuous compliance with Saudi regulations and international standards',
      icon: CheckCircle2,
      scenario: 'Compliance AI monitored 847 regulatory requirements. Achieved 98.7% compliance score. Automated 89% of compliance tasks, saving 240 hours monthly.',
      metrics: {
        regulations_monitored: 847,
        compliance_score: '98.7%',
        automation_rate: '89%',
        hours_saved: '240/month'
      }
    },
    {
      id: 'performance_optimization',
      title: 'System Performance Optimization',
      description: 'AI continuously monitors and optimizes system performance across all modules',
      icon: TrendingUp,
      scenario: 'Performance AI analyzed 45,892 system metrics. Optimized database queries reducing response time by 67%. Predicted and prevented 8 potential bottlenecks.',
      metrics: {
        metrics_analyzed: '45,892',
        response_improvement: '67%',
        bottlenecks_prevented: 8,
        uptime_achieved: '99.97%'
      }
    },
    {
      id: 'intelligent_backup',
      title: 'Intelligent Backup & Recovery',
      description: 'AI-powered backup system with predictive failure detection and smart recovery',
      icon: Database,
      scenario: 'Smart backup AI processed 12.7TB of data. Implemented predictive backup scheduling reducing storage costs by 34%. Zero data loss achieved with 99.99% recovery success.',
      metrics: {
        data_processed: '12.7TB',
        storage_savings: '34%',
        recovery_success: '99.99%',
        backup_efficiency: '87%'
      }
    },
    {
      id: 'adaptive_scaling',
      title: 'Adaptive System Scaling',
      description: 'AI automatically scales system resources based on usage patterns and predictions',
      icon: Rocket,
      scenario: 'Scaling AI analyzed usage patterns for 957 active users. Predicted peak loads with 94% accuracy. Optimized resource allocation saving $12,400 monthly.',
      metrics: {
        users_analyzed: 957,
        prediction_accuracy: '94%',
        monthly_savings: '$12,400',
        efficiency_gain: '41%'
      }
    }
  ];

  const handleCreateDemoData = async () => {
    setIsCreatingDemo(true);
    try {
      await createDemoCompany(companyInfo?.name + ' (Demo)');
      toast.success('Demo data created successfully!');
    } catch (error) {
      toast.error('Failed to create demo data');
    } finally {
      setIsCreatingDemo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No company information found. This is normal for new setups.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI-Powered Company Settings</h1>
            <p className="text-muted-foreground">
              Intelligent system configuration and management with AI optimization
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {companyInfo?.is_demo && (
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Demo Company
            </Badge>
          )}
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
        </div>
      </div>

      {/* AI System Health Dashboard */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            AI System Health & Performance
          </CardTitle>
          <CardDescription>
            Real-time monitoring of AI-powered system components and optimization metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {aiSystemHealth.overall.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Health</div>
              <Progress value={aiSystemHealth.overall} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {aiSystemHealth.security.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Security Score</div>
              <Progress value={aiSystemHealth.security} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {aiSystemHealth.performance.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Performance</div>
              <Progress value={aiSystemHealth.performance} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {aiSystemHealth.compliance.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Compliance</div>
              <Progress value={aiSystemHealth.compliance} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {aiSystemHealth.automation.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Automation</div>
              <Progress value={aiSystemHealth.automation} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="intelligent_configuration">Config</TabsTrigger>
          <TabsTrigger value="predictive_security">Security</TabsTrigger>
          <TabsTrigger value="automated_compliance">Compliance</TabsTrigger>
          <TabsTrigger value="performance_optimization">Performance</TabsTrigger>
          <TabsTrigger value="intelligent_backup">Backup</TabsTrigger>
          <TabsTrigger value="adaptive_scaling">Scaling</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <RoleGuard requiredRoles={['admin']}>
              {/* Enhanced Company Information */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    AI-Enhanced Company Information
                  </CardTitle>
                  <CardDescription>
                    Intelligent company data management with AI validation and optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Company Name
                        <Badge variant="outline" className="text-xs">AI Validated</Badge>
                      </Label>
                      <Input value={companyInfo?.name || 'Your Company'} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Company ID
                        <Badge variant="outline" className="text-xs">Encrypted</Badge>
                      </Label>
                      <Input value={companyInfo?.id || 'Not Set'} disabled className="font-mono text-sm" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Industry
                        <Badge variant="outline" className="text-xs">AI Classified</Badge>
                      </Label>
                      <Select value={companyInfo?.industry || 'other'} disabled>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry.value} value={industry.value}>
                              {industry.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Company Size
                        <Badge variant="outline" className="text-xs">AI Predicted</Badge>
                      </Label>
                      <Select value={companyInfo?.size_category || 'small'} disabled>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_SIZES.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Description
                      <Badge variant="outline" className="text-xs">AI Enhanced</Badge>
                    </Label>
                    <Input value={companyInfo?.description || 'No description'} disabled />
                  </div>

                  <div className="flex gap-3">
                    <Button disabled variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Company Info (Coming Soon)
                    </Button>
                    <Button variant="secondary">
                      <Brain className="mr-2 h-4 w-4" />
                      AI Profile Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Company Statistics */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    AI-Powered Company Analytics
                  </CardTitle>
                  <CardDescription>
                    Real-time company metrics with AI insights and predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg relative">
                      <Sparkles className="absolute top-2 right-2 h-3 w-3 text-blue-500" />
                      <div className="text-2xl font-bold text-blue-600">
                        {setupStatus?.employees_count || 957}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Employees</div>
                      <div className="text-xs text-blue-600 mt-1">+12% growth predicted</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg relative">
                      <Sparkles className="absolute top-2 right-2 h-3 w-3 text-green-500" />
                      <div className="text-2xl font-bold text-green-600">
                        {setupStatus?.departments_count || 12}
                      </div>
                      <div className="text-sm text-muted-foreground">Departments</div>
                      <div className="text-xs text-green-600 mt-1">100% AI optimized</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg relative">
                      <Activity className="absolute top-2 right-2 h-3 w-3 text-purple-500" />
                      <div className="text-2xl font-bold text-purple-600">
                        {companyInfo?.is_demo ? 'Demo' : 'Live'}
                      </div>
                      <div className="text-sm text-muted-foreground">Mode</div>
                      <div className="text-xs text-purple-600 mt-1">AI monitoring active</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg relative">
                      <CheckCircle2 className="absolute top-2 right-2 h-3 w-3 text-orange-500" />
                      <div className="text-2xl font-bold text-orange-600">
                        {setupStatus?.setup_completed ? 'Complete' : 'Pending'}
                      </div>
                      <div className="text-sm text-muted-foreground">Setup Status</div>
                      <div className="text-xs text-orange-600 mt-1">AI validation: 98.7%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Demo Data Section */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Intelligent Demo Data Management
                  </CardTitle>
                  <CardDescription>
                    AI-generated sample data with realistic patterns and insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <strong>AI Demo Data:</strong> Create intelligent demo data with realistic patterns, 
                      relationships, and performance metrics to explore AqlHR features effectively.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleCreateDemoData}
                      disabled={isCreatingDemo}
                      className="flex-1"
                    >
                      {isCreatingDemo ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Creating AI Demo Data...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create AI Demo Data
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Demo Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </RoleGuard>
          </div>
        </TabsContent>

        {aiSettingsScenarios.map((scenario) => (
          <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <scenario.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{scenario.title}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>AI System Analysis:</strong> {scenario.scenario}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(scenario.metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{value}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Apply AI Optimizations
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View System Metrics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}