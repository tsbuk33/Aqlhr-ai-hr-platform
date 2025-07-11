import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Shield, 
  Zap,
  RefreshCw,
  Brain,
  BarChart3,
  Settings,
  Clock,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HealthResult {
  module_name: string;
  category: string;
  status: 'healthy' | 'warning' | 'critical';
  overall_score: number;
  performance_score: number;
  security_score: number;
  compliance_score: number;
}

interface SystemReport {
  overall_health_score: number;
  total_modules: number;
  healthy_modules: number;
  critical_issues: number;
  warning_issues: number;
  recommendations: any;
  recommendations_ar: any;
}

const SystemEngineerDashboard = () => {
  const { language, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthResult[]>([]);
  const [systemReport, setSystemReport] = useState<SystemReport | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [autoDiscoveryEnabled, setAutoDiscoveryEnabled] = useState(true);

  const translations = {
    en: {
      title: "SanadHR System Engineer",
      subtitle: "Auto-Adaptive AI SuperIntelligence for Future-Proof HR Management",
      overallHealth: "Overall System Health",
      moduleHealth: "Module Health Status",
      systemDiagnostics: "System Diagnostics",
      aiRecommendations: "AI Recommendations",
      adaptiveLearning: "Adaptive Learning",
      discover: "Discover Modules",
      healthCheck: "Health Check",
      generateReport: "Generate Report",
      enableAutoDiscovery: "Auto-Discovery Enabled",
      lastUpdated: "Last Updated",
      criticalIssues: "Critical Issues",
      warningIssues: "Warning Issues",
      healthyModules: "Healthy Modules",
      totalModules: "Total Modules",
      performanceScore: "Performance",
      securityScore: "Security",
      complianceScore: "Compliance",
      recommendations: "Recommendations",
      criticalRecommendations: "Critical Actions Required",
      optimizationRecommendations: "Optimization Opportunities",
      moduleCategory: "Module Category",
      coreHR: "Core HR",
      government: "Government",
      aiAutomation: "AI & Automation",
      analytics: "Analytics",
      strategic: "Strategic",
      mobile: "Mobile",
      system: "System",
      healthy: "Healthy",
      warning: "Warning",
      critical: "Critical",
      runningHealthCheck: "Running comprehensive health check...",
      generatingReport: "Generating system health report...",
      discoveringModules: "Discovering and registering modules...",
      selfDiagnosing: "Self-diagnosing system components...",
      learningAdaptively: "Performing adaptive learning analysis...",
      autoAdaptive: "Auto-Adaptive",
      futureProof: "Future-Proof",
      continuousMonitoring: "Continuous Monitoring",
      realTimeAnalysis: "Real-Time Analysis"
    },
    ar: {
      title: "مهندس نظام سند للموارد البشرية",
      subtitle: "الذكاء الاصطناعي الفائق التكيفي التلقائي لإدارة الموارد البشرية المقاومة للمستقبل",
      overallHealth: "الصحة العامة للنظام",
      moduleHealth: "حالة صحة الوحدات",
      systemDiagnostics: "تشخيصات النظام",
      aiRecommendations: "توصيات الذكاء الاصطناعي",
      adaptiveLearning: "التعلم التكيفي",
      discover: "اكتشاف الوحدات",
      healthCheck: "فحص الصحة",
      generateReport: "إنشاء تقرير",
      enableAutoDiscovery: "الاكتشاف التلقائي مفعل",
      lastUpdated: "آخر تحديث",
      criticalIssues: "المشاكل الحرجة",
      warningIssues: "مشاكل التحذير",
      healthyModules: "الوحدات السليمة",
      totalModules: "إجمالي الوحدات",
      performanceScore: "الأداء",
      securityScore: "الأمان",
      complianceScore: "الامتثال",
      recommendations: "التوصيات",
      criticalRecommendations: "الإجراءات الحرجة المطلوبة",
      optimizationRecommendations: "فرص التحسين",
      moduleCategory: "فئة الوحدة",
      coreHR: "الموارد البشرية الأساسية",
      government: "حكومي",
      aiAutomation: "الذكاء الاصطناعي والأتمتة",
      analytics: "التحليلات",
      strategic: "استراتيجي",
      mobile: "الهاتف المحمول",
      system: "النظام",
      healthy: "سليم",
      warning: "تحذير",
      critical: "حرج",
      runningHealthCheck: "تشغيل فحص صحة شامل...",
      generatingReport: "إنشاء تقرير صحة النظام...",
      discoveringModules: "اكتشاف وتسجيل الوحدات...",
      selfDiagnosing: "التشخيص الذاتي لمكونات النظام...",
      learningAdaptively: "تنفيذ تحليل التعلم التكيفي...",
      autoAdaptive: "التكيف التلقائي",
      futureProof: "مقاوم للمستقبل",
      continuousMonitoring: "المراقبة المستمرة",
      realTimeAnalysis: "التحليل في الوقت الفعلي"
    }
  };

  const tr = translations[language as keyof typeof translations];

  useEffect(() => {
    if (autoDiscoveryEnabled) {
      discoverModules();
    }
  }, [autoDiscoveryEnabled]);

  const discoverModules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/system-engineer-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'discover_modules' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`${result.modules_discovered} modules discovered and registered`);
        setLastUpdate(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Error discovering modules:', error);
      toast.error('Failed to discover modules');
    } finally {
      setIsLoading(false);
    }
  };

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      toast.info(tr.runningHealthCheck);
      
      const response = await fetch('/api/system-engineer-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'health_check',
          company_id: 'default' // In real implementation, get from context
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setHealthData(result.health_results || []);
        toast.success(`Health check completed. Overall score: ${result.overall_health_score}%`);
        setLastUpdate(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Error running health check:', error);
      toast.error('Failed to run health check');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      toast.info(tr.generatingReport);
      
      const response = await fetch('/api/system-engineer-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'generate_report',
          company_id: 'default'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSystemReport(result);
        toast.success('System health report generated successfully');
        setLastUpdate(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryTranslation = (category: string) => {
    const categoryMap = {
      core_hr: tr.coreHR,
      government: tr.government,
      ai_automation: tr.aiAutomation,
      analytics: tr.analytics,
      strategic: tr.strategic,
      mobile: tr.mobile,
      system: tr.system
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {tr.title}
          </h1>
          <p className="text-muted-foreground mt-2">{tr.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Brain className="h-3 w-3 mr-1" />
              {tr.autoAdaptive}
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Shield className="h-3 w-3 mr-1" />
              {tr.futureProof}
            </Badge>
          </div>
          
          {lastUpdate && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {tr.lastUpdated}: {lastUpdate}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={discoverModules} 
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          {tr.discover}
        </Button>
        
        <Button 
          onClick={runHealthCheck} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          {tr.healthCheck}
        </Button>
        
        <Button 
          onClick={generateReport} 
          disabled={isLoading}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {tr.generateReport}
        </Button>

        {isLoading && (
          <Button disabled className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Processing...
          </Button>
        )}
      </div>

      {/* System Overview Cards */}
      {systemReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {tr.overallHealth}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {systemReport.overall_health_score}%
              </div>
              <Progress value={systemReport.overall_health_score} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {tr.healthyModules}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {systemReport.healthy_modules}
              </div>
              <div className="text-sm text-muted-foreground">
                {tr.totalModules}: {systemReport.total_modules}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                {tr.warningIssues}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {systemReport.warning_issues}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                {tr.criticalIssues}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {systemReport.critical_issues}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">{tr.moduleHealth}</TabsTrigger>
          <TabsTrigger value="diagnostics">{tr.systemDiagnostics}</TabsTrigger>
          <TabsTrigger value="recommendations">{tr.aiRecommendations}</TabsTrigger>
          <TabsTrigger value="learning">{tr.adaptiveLearning}</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {tr.moduleHealth}
              </CardTitle>
              <CardDescription>
                {tr.continuousMonitoring} & {tr.realTimeAnalysis}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthData.length > 0 ? (
                <div className="space-y-4">
                  {healthData.map((module, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(module.status)}
                          <div>
                            <h3 className="font-medium">{module.module_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {getCategoryTranslation(module.category)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={module.status === 'healthy' ? 'default' : 'destructive'}>
                          {tr[module.status as keyof typeof tr] || module.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">{tr.performanceScore}</div>
                          <div className="flex items-center gap-2">
                            <Progress value={module.performance_score} className="flex-1" />
                            <span className="text-sm font-medium">{module.performance_score}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">{tr.securityScore}</div>
                          <div className="flex items-center gap-2">
                            <Progress value={module.security_score} className="flex-1" />
                            <span className="text-sm font-medium">{module.security_score}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">{tr.complianceScore}</div>
                          <div className="flex items-center gap-2">
                            <Progress value={module.compliance_score} className="flex-1" />
                            <span className="text-sm font-medium">{module.compliance_score}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Run a health check to see module status</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {tr.systemDiagnostics}
              </CardTitle>
              <CardDescription>
                Advanced system analysis and issue detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>AI diagnostics will appear here after health checks</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {tr.aiRecommendations}
              </CardTitle>
              <CardDescription>
                Highest-level expertise recommendations for system optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {systemReport?.recommendations ? (
                <div className="space-y-4">
                  {/* Critical Recommendations */}
                  {systemReport.recommendations.critical && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{tr.criticalRecommendations}</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          {(language === 'ar' ? 
                            systemReport.recommendations_ar.critical : 
                            systemReport.recommendations.critical
                          ).map((rec: string, index: number) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Optimization Recommendations */}
                  {systemReport.recommendations.optimization && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">{tr.optimizationRecommendations}</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {(language === 'ar' ? 
                          systemReport.recommendations_ar.optimization : 
                          systemReport.recommendations.optimization
                        ).map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Generate a system report to see AI recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {tr.adaptiveLearning}
              </CardTitle>
              <CardDescription>
                Self-improving AI that learns from system patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Adaptive learning insights will appear here as the system evolves</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemEngineerDashboard;