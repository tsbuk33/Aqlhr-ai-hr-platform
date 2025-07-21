import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Activity, 
  Zap, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users,
  BarChart3,
  Globe,
  Cpu,
  Network
} from 'lucide-react';
import { AqlMindCore } from './AqlMindCore';
import { AIDecisionEngine } from './AIDecisionEngine';
import { LearningEngine } from './LearningEngine';
import { IntelligenceGatherer } from './IntelligenceGatherer';
import { useToast } from '@/components/ui/use-toast';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  module: string;
  actionRequired: boolean;
}

interface AISystemStatus {
  overallHealth: number;
  modulesSynchronized: number;
  totalModules: number;
  decisionsToday: number;
  learningProgress: number;
  complianceScore: number;
  autonomousMode: boolean;
}

export const AICommandCenter: React.FC = () => {
  const { toast } = useToast();
  const { isArabic } = useSimpleLanguage();
  
  const [systemStatus, setSystemStatus] = useState<AISystemStatus>({
    overallHealth: 98,
    modulesSynchronized: 15,
    totalModules: 15,
    decisionsToday: 247,
    learningProgress: 87,
    complianceScore: 99.2,
    autonomousMode: true
  });

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Saudization Target Threshold',
      description: 'IT department approaching 35% Saudization threshold. AI recommends immediate action.',
      timestamp: '2 minutes ago',
      module: 'Government Compliance',
      actionRequired: true
    },
    {
      id: '2',
      type: 'success',
      title: 'Performance Optimization Complete',
      description: 'AI successfully optimized 23 employee performance recommendations.',
      timestamp: '15 minutes ago',
      module: 'Performance Management',
      actionRequired: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Learning Pattern Discovered',
      description: 'New correlation identified between training completion and retention rates.',
      timestamp: '1 hour ago',
      module: 'Learning Engine',
      actionRequired: false
    },
    {
      id: '4',
      type: 'critical',
      title: 'Contract Compliance Review',
      description: 'Labor law changes require 47 employee contracts to be updated within 14 days.',
      timestamp: '3 hours ago',
      module: 'Legal Compliance',
      actionRequired: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeStats, setRealTimeStats] = useState({
    processingRate: 23.7,
    dataStreams: 15,
    aiModels: 8,
    activeDecisions: 12
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        processingRate: 20 + Math.random() * 10,
        dataStreams: 14 + Math.floor(Math.random() * 3),
        activeDecisions: 10 + Math.floor(Math.random() * 5)
      }));

      setSystemStatus(prev => ({
        ...prev,
        decisionsToday: prev.decisionsToday + Math.floor(Math.random() * 2),
        learningProgress: Math.min(100, prev.learningProgress + Math.random() * 0.5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-status-danger" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-brand-warning" />;
      case 'info': return <Clock className="h-4 w-4 text-primary" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      case 'success': return 'outline';
      default: return 'outline';
    }
  };

  const toggleAutonomousMode = () => {
    setSystemStatus(prev => ({ ...prev, autonomousMode: !prev.autonomousMode }));
    toast({
      title: systemStatus.autonomousMode 
        ? (isArabic ? "🤖 تم تفعيل الوضع اليدوي" : "🤖 Manual Mode Activated")
        : (isArabic ? "🧠 تم تفعيل الوضع المستقل" : "🧠 Autonomous Mode Enabled"),
      description: systemStatus.autonomousMode 
        ? (isArabic ? "قرارات الذكاء الاصطناعي تتطلب الآن موافقة يدوية" : "AI decisions now require manual approval")
        : (isArabic ? "الذكاء الاصطناعي يعمل في وضع مستقل كامل" : "AI is operating in full autonomous mode"),
    });
  };

  const handleAlert = (alertId: string) => {
    const alert = systemAlerts.find(a => a.id === alertId);
    setSystemAlerts(prev => prev.filter(a => a.id !== alertId));
    toast({
      title: "Alert Handled",
      description: `"${alert?.title}" has been addressed by the AI system.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* AI System Status Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-10 w-10 text-primary" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-success rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">
                  {isArabic ? "مركز قيادة النظام البيئي للذكاء الاصطناعي عقل HR" : "AqlHR AI Command Center"}
                </CardTitle>
                <p className="text-muted-foreground">
                  {isArabic 
                    ? "نظام ذكاء مركزي يفكر ويتعلم ويتخذ قرارات مستنيرة • نشط منذ البداية"
                    : "Self-Learning Decision-Making AI Ecosystem • Active Since Startup"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={systemStatus.autonomousMode ? "default" : "secondary"} className="px-4 py-2 text-sm">
                {systemStatus.autonomousMode 
                  ? (isArabic ? "🤖 مستقل" : "🤖 AUTONOMOUS")
                  : (isArabic ? "👤 يدوي" : "👤 MANUAL")
                } {isArabic ? "الوضع" : "MODE"}
              </Badge>
              <Button onClick={toggleAutonomousMode} variant="outline">
                <Target className="h-4 w-4 mr-2" />
                {isArabic ? "تبديل الوضع" : "Toggle Mode"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-success">{systemStatus.overallHealth}%</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "صحة النظام" : "System Health"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {systemStatus.modulesSynchronized}/{systemStatus.totalModules}
              </div>
              <div className="text-sm text-muted-foreground">{isArabic ? "الوحدات المتزامنة" : "Modules Synced"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary">{systemStatus.decisionsToday}</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "القرارات اليوم" : "Decisions Today"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-accent">{systemStatus.learningProgress.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "تقدم التعلم" : "Learning Progress"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-warning">{systemStatus.complianceScore}%</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "نقاط الامتثال" : "Compliance Score"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-secondary">{realTimeStats.processingRate.toFixed(1)}/{isArabic ? "د" : "min"}</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "معدل المعالجة" : "Processing Rate"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {isArabic ? "نشاط الذكاء الاصطناعي المباشر" : "Real-time AI Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg border">
                <div className="flex items-center justify-center mb-2">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">{realTimeStats.aiModels}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? "نماذج الذكاء الاصطناعي النشطة" : "AI Models Active"}</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="flex items-center justify-center mb-2">
                  <Globe className="h-6 w-6 text-brand-success" />
                </div>
                <div className="text-2xl font-bold text-brand-success">{realTimeStats.dataStreams}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? "تدفقات البيانات" : "Data Streams"}</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-brand-primary" />
                </div>
                <div className="text-2xl font-bold text-brand-primary">{realTimeStats.activeDecisions}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? "القرارات النشطة" : "Active Decisions"}</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="flex items-center justify-center mb-2">
                  <Network className="h-6 w-6 text-brand-accent" />
                </div>
                <div className="text-2xl font-bold text-brand-accent">100%</div>
                <div className="text-sm text-muted-foreground">{isArabic ? "مزامنة الوحدة" : "Module Sync"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {isArabic ? "تنبيهات النظام" : "System Alerts"} ({systemAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <Badge variant={getAlertColor(alert.type)} className="text-xs">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
                  </div>
                  <div className="font-medium text-sm mb-1">{alert.title}</div>
                  <div className="text-xs text-muted-foreground mb-2">{alert.description}</div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{alert.module}</Badge>
                    {alert.actionRequired && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAlert(alert.id)}
                        className="text-xs h-6"
                      >
                        Handle
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Ecosystem Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {isArabic ? "إدارة النظام البيئي للذكاء الاصطناعي" : "AI Ecosystem Management"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{isArabic ? "ذكاء عقل HR الأساسي" : "AqlMind Core"}</TabsTrigger>
              <TabsTrigger value="decisions">{isArabic ? "محرك القرارات" : "Decision Engine"}</TabsTrigger>
              <TabsTrigger value="learning">{isArabic ? "نظام التعلم" : "Learning System"}</TabsTrigger>
              <TabsTrigger value="intelligence">{isArabic ? "مركز الذكاء" : "Intelligence Hub"}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <AqlMindCore />
            </TabsContent>

            <TabsContent value="decisions" className="mt-6">
              <AIDecisionEngine />
            </TabsContent>

            <TabsContent value="learning" className="mt-6">
              <LearningEngine />
            </TabsContent>

            <TabsContent value="intelligence" className="mt-6">
              <IntelligenceGatherer />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {isArabic ? "إجراءات الذكاء الاصطناعي السريعة" : "AI Quick Actions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Brain className="h-5 w-5" />
              <span className="text-sm">{isArabic ? "التعلم العميق" : "Deep Learning"}</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">{isArabic ? "تحسين الأداء" : "Optimize Performance"}</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">{isArabic ? "فحص الامتثال" : "Compliance Check"}</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">{isArabic ? "إنشاء الرؤى" : "Generate Insights"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};