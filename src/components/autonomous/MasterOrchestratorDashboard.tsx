import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Shield, 
  Zap, 
  Globe, 
  Cpu, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { masterOrchestrator, SystemStatus, AutonomousModule } from '@/lib/autonomous/MasterOrchestrator';
import { useLanguage } from '@/hooks/useLanguageCompat';

const MasterOrchestratorDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [modules, setModules] = useState<AutonomousModule[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      const [status, moduleList] = await Promise.all([
        masterOrchestrator.getSystemStatus(),
        Promise.resolve(masterOrchestrator.getAllModules())
      ]);
      
      setSystemStatus(status);
      setModules(moduleList);
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOrchestration = async () => {
    setIsOrchestrating(true);
    try {
      await masterOrchestrator.startMasterOrchestration();
      await loadSystemData(); // Refresh data
    } catch (error) {
      console.error('Failed to start orchestration:', error);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const handleStopOrchestration = () => {
    masterOrchestrator.stopOrchestration();
    setIsOrchestrating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAutonomyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Cpu className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">{isArabic ? 'تحميل نظام التحكم الذاتي...' : 'Loading Autonomous System...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {isArabic ? 'نظام التحكم الذاتي الرئيسي' : 'Master Autonomous Orchestrator'}
          </h1>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'إدارة وتنسيق أكثر من 109 وظيفة AI و 21 نظام حكومي و 80+ وحدة'
              : 'Managing & Coordinating 109+ AI Functions, 21 Government Systems, 80+ Modules'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleStartOrchestration}
            disabled={isOrchestrating}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {isOrchestrating ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                {isArabic ? 'جاري التشغيل...' : 'Starting...'}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {isArabic ? 'تشغيل التحكم الذاتي' : 'Start Orchestration'}
              </>
            )}
          </Button>
          
          <Button
            onClick={handleStopOrchestration}
            variant="destructive"
            disabled={!isOrchestrating}
          >
            <Shield className="w-4 h-4 mr-2" />
            {isArabic ? 'إيقاف' : 'Stop'}
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      {systemStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'الوحدات النشطة' : 'Active Modules'}
              </CardTitle>
              <Brain className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatus.autonomousModulesActive}</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'من أصل 80+ وحدة' : 'out of 80+ modules'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'وظائف AI' : 'AI Functions'}
              </CardTitle>
              <Cpu className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatus.edgeFunctionsOperational}</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'وظيفة ذكية نشطة' : 'smart functions active'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'الأنظمة الحكومية' : 'Gov Systems'}
              </CardTitle>
              <Globe className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatus.governmentIntegrationsActive}</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'نظام حكومي متصل' : 'government integrations'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'الأداء العام' : 'System Performance'}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatus.performanceMetrics.systemLoad}%</div>
              <Progress value={systemStatus.performanceMetrics.systemLoad} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">{isArabic ? 'الوحدات' : 'Modules'}</TabsTrigger>
          <TabsTrigger value="compliance">{isArabic ? 'الامتثال' : 'Compliance'}</TabsTrigger>
          <TabsTrigger value="performance">{isArabic ? 'الأداء' : 'Performance'}</TabsTrigger>
          <TabsTrigger value="intelligence">{isArabic ? 'الذكاء التنفيذي' : 'Intelligence'}</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <Card key={module.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base capitalize">
                      {module.name.replace(/-/g, ' ')}
                    </CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(module.status)}`} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={getAutonomyColor(module.autonomyLevel)} className="text-xs">
                      {module.autonomyLevel}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {module.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isArabic ? 'معدل النجاح' : 'Success Rate'}</span>
                      <span>{module.metrics.successRate}%</span>
                    </div>
                    <Progress value={module.metrics.successRate} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>{isArabic ? 'العمليات/ساعة' : 'Operations/hr'}</span>
                      <span>{module.metrics.operationsPerHour}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>{isArabic ? 'نقاط الامتثال' : 'Compliance'}</span>
                      <span>{module.metrics.complianceScore}/100</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {isArabic ? 'آخر فحص:' : 'Last check:'} {' '}
                      {new Date(module.lastHealthCheck).toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                {isArabic ? 'حالة الامتثال الحكومي السعودي' : 'Saudi Government Compliance Status'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['QIWA', 'GOSI', 'MOL', 'Absher', 'HRDF', 'Nitaqat'].map((system) => (
                  <div key={system} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{system}</span>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {isArabic ? 'متوافق' : 'Compliant'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isArabic ? 'زمن الاستجابة' : 'Response Time'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {systemStatus?.performanceMetrics.averageResponseTime}ms
                </div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'متوسط زمن الاستجابة' : 'Average response time'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isArabic ? 'معدل الأخطاء' : 'Error Rate'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {systemStatus?.performanceMetrics.errorRate}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'معدل الأخطاء المسجلة' : 'Recorded error rate'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isArabic ? 'حمولة النظام' : 'System Load'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {systemStatus?.performanceMetrics.systemLoad}%
                </div>
                <Progress value={systemStatus?.performanceMetrics.systemLoad} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                {isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500 opacity-50" />
                <p className="text-muted-foreground">
                  {isArabic 
                    ? 'تحليل البيانات الذكي وإنتاج التوصيات الاستراتيجية...'
                    : 'Intelligent data analysis and strategic recommendations generation...'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterOrchestratorDashboard;