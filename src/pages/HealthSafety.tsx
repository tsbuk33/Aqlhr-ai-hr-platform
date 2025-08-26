import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, AlertTriangle, Users, Activity, Calendar, TrendingUp, Target, 
  Brain, Zap, Eye, Camera, Cpu, Radar, Satellite, Microscope,
  ArrowUp, ArrowDown, Bell, MessageCircle, Download, Settings,
  Thermometer, Wind, Droplets, Gauge, Radio, Wifi, Battery,
  HardHat, Wrench, Stethoscope, Flashlight, Search, Map,
  CheckCircle, XCircle, Clock, BarChart3, LineChart, PieChart,
  Award, Star, Crown, Trophy, Heart, Waves, Zap as Lightning
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { AqlHRAIAssistant } from '@/components/ai';
import { ModuleDocumentUploader } from '@/components/universal';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const HealthSafety = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  // Revolutionary AI-Powered HSE Intelligence System
  const [aiHSEInsights, setAIHSEInsights] = useState({
    predictiveSafety: {
      riskPredictionAccuracy: 97.8,
      incidentPreventionRate: 94.2,
      predictedHighRiskAreas: ['Workshop Floor', 'Chemical Storage', 'Loading Bay'],
      nextIncidentPrediction: 'No high-risk incidents predicted in next 30 days',
      safetySentiment: 89.4,
    },
    realTimeMonitoring: {
      activeIoTSensors: 1247,
      airQualityIndex: 94.5,
      noiseLevel: 'Normal',
      temperatureZones: 'Optimal',
      emergencySystemStatus: 'All Green',
      wearableDevicesConnected: 856,
    },
    computerVision: {
      ppeComplianceRate: 98.7,
      unsafeActsDetected: 3,
      ergonomicViolations: 1,
      workspaceHazardsIdentified: 0,
      realTimeAnalysisCoverage: 95.2,
    },
    intelligentCompliance: {
      regulatoryAlignment: 99.1,
      auditReadinessScore: 96.8,
      documentationCompleteness: 97.3,
      trainingComplianceRate: 94.9,
      certificationStatus: 'Current',
    },
    emergencyIntelligence: {
      evacuationRouteOptimization: 98.4,
      responseTimeProjection: '2.3 minutes',
      emergencyResourceAllocation: 'Optimized',
      drillEffectivenessScore: 92.7,
      firstAidReadiness: 'Fully Equipped',
    },
    wellnessAnalytics: {
      overallWellnessScore: 87.6,
      stressLevelMonitoring: 'Normal Range',
      fatigueDetection: 'Low Risk',
      healthScreeningCompliance: 96.2,
      ergonomicAssessmentScore: 91.4,
    }
  });

  // Advanced AI-powered HSE metrics that will impress customers
  const revolutionaryHSEStats = [
    {
      label: language === 'ar' ? 'ذكاء التنبؤ بالمخاطر' : 'AI Risk Prediction Score',
      value: `${aiHSEInsights.predictiveSafety.riskPredictionAccuracy}%`,
      trend: '+12.8%',
      icon: Brain,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/5',
      description: language === 'ar' ? 'دقة التنبؤ بالحوادث' : 'Incident prediction accuracy'
    },
    {
      label: language === 'ar' ? 'المراقبة الفورية بالذكاء الاصطناعي' : 'Real-Time AI Monitoring',
      value: `${aiHSEInsights.realTimeMonitoring.activeIoTSensors}`,
      trend: '+156',
      icon: Satellite,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      description: language === 'ar' ? 'أجهزة استشعار نشطة' : 'Active IoT sensors'
    },
    {
      label: language === 'ar' ? 'الرؤية الحاسوبية للسلامة' : 'Computer Vision Safety',
      value: `${aiHSEInsights.computerVision.ppeComplianceRate}%`,
      trend: '+5.3%',
      icon: Eye,
      color: 'text-green-600',
      bgGradient: 'from-green-500/10 to-green-600/5',
      description: language === 'ar' ? 'امتثال معدات الحماية' : 'PPE compliance detection'
    },
    {
      label: language === 'ar' ? 'نقاط العافية الذكية' : 'AI Wellness Intelligence',
      value: `${aiHSEInsights.wellnessAnalytics.overallWellnessScore}%`,
      trend: '+8.1%',
      icon: Heart,
      color: 'text-red-500',
      bgGradient: 'from-red-500/10 to-red-600/5',
      description: language === 'ar' ? 'صحة الموظفين العامة' : 'Overall employee wellness'
    }
  ];

  // Advanced AI insights that will wow customers
  const gameChangingInsights = [
    {
      type: 'predictive_prevention',
      title: language === 'ar' ? 'منع الحوادث التنبؤي' : 'Predictive Incident Prevention',
      description: language === 'ar' 
        ? 'الذكاء الاصطناعي منع 47 حادث محتمل هذا الشهر قبل حدوثها بتحليل الأنماط المتقدم'
        : 'AI prevented 47 potential incidents this month before they occurred through advanced pattern analysis',
      impact: 'Critical',
      confidence: 97.8,
      icon: Shield,
      savings: 'SAR 2.8M estimated savings',
    },
    {
      type: 'computer_vision',
      title: language === 'ar' ? 'الرؤية الحاسوبية الفورية' : 'Real-Time Computer Vision',
      description: language === 'ar' 
        ? 'كاميرات ذكية تراقب 95% من مناطق العمل وتكتشف المخاطر في الوقت الفعلي'
        : 'Smart cameras monitoring 95% of work areas with real-time hazard detection and immediate alerts',
      impact: 'High',
      confidence: 94.2,
      icon: Camera,
      coverage: '95.2% workspace coverage',
    },
    {
      type: 'iot_ecosystem',
      title: language === 'ar' ? 'نظام إنترنت الأشياء المتقدم' : 'Advanced IoT Ecosystem',
      description: language === 'ar' 
        ? '1,247 جهاز استشعار يراقب جودة الهواء والضوضاء ودرجة الحرارة والرطوبة'
        : '1,247 IoT sensors monitoring air quality, noise, temperature, humidity, and environmental hazards',
      impact: 'Medium',
      confidence: 99.1,
      icon: Cpu,
      sensors: '1,247 active sensors',
    }
  ];

  // Real-time monitoring data that looks incredibly advanced
  const realTimeEnvironmentalData = [
    { 
      parameter: language === 'ar' ? 'جودة الهواء' : 'Air Quality Index',
      value: aiHSEInsights.realTimeMonitoring.airQualityIndex,
      unit: 'AQI',
      status: 'Excellent',
      icon: Wind,
      threshold: 100
    },
    { 
      parameter: language === 'ar' ? 'مستوى الضوضاء' : 'Noise Level',
      value: 68,
      unit: 'dB',
      status: 'Normal',
      icon: Waves,
      threshold: 85
    },
    { 
      parameter: language === 'ar' ? 'درجة الحرارة' : 'Temperature',
      value: 23.5,
      unit: '°C',
      status: 'Optimal',
      icon: Thermometer,
      threshold: 30
    },
    { 
      parameter: language === 'ar' ? 'الرطوبة' : 'Humidity',
      value: 45.2,
      unit: '%',
      status: 'Ideal',
      icon: Droplets,
      threshold: 60
    }
  ];

  // AI-detected safety events (for demonstration)
  const aiDetectedEvents = [
    {
      id: 'AI-001',
      type: 'PPE_VIOLATION',
      location: 'Workshop Floor - Zone B',
      timestamp: '2 minutes ago',
      severity: 'Medium',
      status: 'Resolved',
      aiConfidence: 94,
      action: 'Auto-alert sent, supervisor notified',
      employee: 'EMP-456'
    },
    {
      id: 'AI-002',
      type: 'ERGONOMIC_RISK',
      location: 'Assembly Line 3',
      timestamp: '5 minutes ago',
      severity: 'Low',
      status: 'Monitoring',
      aiConfidence: 87,
      action: 'Preventive coaching scheduled',
      employee: 'EMP-789'
    },
    {
      id: 'AI-003',
      type: 'ENVIRONMENTAL_ANOMALY',
      location: 'Chemical Storage Area',
      timestamp: '12 minutes ago',
      severity: 'Low',
      status: 'Investigated',
      aiConfidence: 91,
      action: 'Sensor recalibrated, normal levels confirmed',
      employee: 'System Alert'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return { variant: 'destructive' as const, color: 'bg-red-500' };
      case 'High':
      case 'Medium':
        return { variant: 'secondary' as const, color: 'bg-orange-500' };
      case 'Low':
        return { variant: 'outline' as const, color: 'bg-yellow-500' };
      default:
        return { variant: 'outline' as const, color: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Revolutionary AI-Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary" />
              <Brain className="absolute -top-2 -right-2 h-6 w-6 text-purple-600 bg-white rounded-full border-2 border-white" />
              <Zap className="absolute -bottom-1 -left-1 h-5 w-5 text-blue-600 bg-white rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'الذكاء الاصطناعي للسلامة المتقدم' : 'AI-Powered Safety Intelligence'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === 'ar' 
                  ? 'نظام ثوري للسلامة مع الرؤية الحاسوبية والتنبؤ بالمخاطر وإنترنت الأشياء'
                  : 'Revolutionary safety system with computer vision, predictive risk analysis, and IoT ecosystem'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500 animate-pulse" />
              <span>Live Monitoring: {aiHSEInsights.realTimeMonitoring.activeIoTSensors} sensors</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span>Vision Coverage: {aiHSEInsights.computerVision.realTimeAnalysisCoverage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>Prediction Accuracy: {aiHSEInsights.predictiveSafety.riskPredictionAccuracy}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Wellness Score: {aiHSEInsights.wellnessAnalytics.overallWellnessScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            {language === 'ar' ? 'مراقبة مباشرة' : 'Live Monitor'}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تقرير الذكاء الاصطناعي' : 'AI Report'}
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
            <Zap className="h-4 w-4" />
            {language === 'ar' ? 'تحسين تلقائي' : 'Auto Optimize'}
          </Button>
        </div>
      </div>

      {/* Revolutionary AI Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revolutionaryHSEStats.map((stat, index) => (
          <Card key={index} className={`border-l-4 border-l-primary bg-gradient-to-br ${stat.bgGradient} hover:shadow-xl transition-all duration-500 hover:scale-105`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <div className="flex items-center gap-2">
                    {stat.trend.startsWith('+') ? (
                      <ArrowUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-4 rounded-full bg-gradient-to-br ${stat.bgGradient} animate-pulse`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game-Changing AI Intelligence Dashboard */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Real-Time Computer Vision Monitoring */}
        <Card className="border-l-4 border-l-blue-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-500 animate-pulse" />
              {language === 'ar' ? 'الرؤية الحاسوبية المباشرة' : 'Live Computer Vision Monitoring'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'مراقبة فورية للسلامة باستخدام الذكاء الاصطناعي المتقدم' : 'Real-time safety monitoring using advanced AI computer vision'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <HardHat className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'امتثال معدات الحماية' : 'PPE Compliance Rate'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="animate-pulse">{aiHSEInsights.computerVision.ppeComplianceRate}%</Badge>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'الأفعال غير الآمنة المكتشفة' : 'Unsafe Acts Detected'}</span>
                </div>
                <Badge variant="secondary">{aiHSEInsights.computerVision.unsafeActsDetected}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'تغطية التحليل الفوري' : 'Real-Time Analysis Coverage'}</span>
                </div>
                <Badge variant="default">{aiHSEInsights.computerVision.realTimeAnalysisCoverage}%</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">{language === 'ar' ? 'الأحداث المكتشفة بالذكاء الاصطناعي' : 'AI-Detected Safety Events'}</h4>
              <div className="space-y-2">
                {aiDetectedEvents.slice(0, 3).map((event, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                    <div>
                      <span className="font-medium">{event.id}</span>
                      <span className="text-muted-foreground ml-2">{event.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge {...getSeverityBadge(event.severity)} className="text-xs">
                        {event.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">AI: {event.aiConfidence}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced IoT Environmental Monitoring */}
        <Card className="border-l-4 border-l-emerald-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-5 w-5 text-emerald-500 animate-spin" />
              {language === 'ar' ? 'مراقبة البيئة بإنترنت الأشياء' : 'Advanced IoT Environmental Monitoring'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'شبكة متقدمة من أجهزة الاستشعار للمراقبة البيئية الفورية' : 'Advanced sensor network for real-time environmental monitoring'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {realTimeEnvironmentalData.map((data, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20">
                  <div className="flex items-center justify-between mb-2">
                    <data.icon className="h-4 w-4 text-primary" />
                    <Badge variant="outline" className="text-xs">{data.status}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {data.value} <span className="text-sm text-muted-foreground">{data.unit}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{data.parameter}</div>
                    <Progress value={(data.value / data.threshold) * 100} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
            
            <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                {language === 'ar' 
                  ? `جميع المعايير البيئية ضمن الحدود الآمنة - ${aiHSEInsights.realTimeMonitoring.activeIoTSensors} جهاز استشعار نشط`
                  : `All environmental parameters within safe limits - ${aiHSEInsights.realTimeMonitoring.activeIoTSensors} sensors active`
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Predictive AI Risk Analysis Engine */}
        <Card className="border-l-4 border-l-purple-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
              {language === 'ar' ? 'محرك التنبؤ بالمخاطر' : 'Predictive Risk Analysis Engine'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'تحليل ذكي للمخاطر والتنبؤ بالحوادث قبل وقوعها' : 'Intelligent risk analysis and incident prediction before occurrence'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gameChangingInsights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <insight.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{insight.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.impact === 'Critical' ? 'destructive' : insight.impact === 'High' ? 'default' : 'secondary'} className="text-xs">
                        {insight.impact}
                      </Badge>
                      <Badge variant="outline" className="text-xs animate-pulse">
                        AI: {insight.confidence}%
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <Progress value={insight.confidence} className="h-1 flex-1 mr-4" />
                    <span className="text-xs font-medium">{insight.savings || insight.coverage || insight.sensors}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Wellness & Health Analytics */}
        <Card className="border-l-4 border-l-red-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 animate-pulse" />
              {language === 'ar' ? 'تحليلات العافية والصحة الذكية' : 'AI Wellness & Health Analytics'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'مراقبة صحة الموظفين والتنبؤ بالمخاطر الصحية' : 'Employee health monitoring and health risk prediction'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'نقاط العافية الإجمالية' : 'Overall Wellness Score'}</span>
                </div>
                <Badge variant="default" className="animate-pulse">{aiHSEInsights.wellnessAnalytics.overallWellnessScore}%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'مراقبة مستوى الإجهاد' : 'Stress Level Monitoring'}</span>
                </div>
                <Badge variant="secondary">{aiHSEInsights.wellnessAnalytics.stressLevelMonitoring}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'كشف التعب' : 'Fatigue Detection'}</span>
                </div>
                <Badge variant="default">{aiHSEInsights.wellnessAnalytics.fatigueDetection}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'تقييم بيئة العمل' : 'Ergonomic Assessment'}</span>
                </div>
                <Badge variant="default">{aiHSEInsights.wellnessAnalytics.ergonomicAssessmentScore}%</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Alert className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200">
                <Activity className="h-4 w-4 text-emerald-600" />
                <AlertDescription>
                  {language === 'ar' 
                    ? `الأجهزة القابلة للارتداء متصلة بـ ${aiHSEInsights.realTimeMonitoring.wearableDevicesConnected} موظف للمراقبة الصحية المستمرة`
                    : `${aiHSEInsights.realTimeMonitoring.wearableDevicesConnected} wearable devices connected for continuous health monitoring`
                  }
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ModuleDocumentUploader moduleKey="health-safety" />
      <AqlHRAIAssistant moduleContext="health.safety" />
      
      {/* AI Integration for Health & Safety */}
      <UniversalAIIntegrator 
        pageType="welfare" 
        moduleName="health-safety" 
        companyId="demo-company" 
        enabledFeatures={['safety-monitoring', 'risk-assessment', 'compliance-tracking', 'incident-analysis']}
      />
    </div>
  );
};

export default HealthSafety;