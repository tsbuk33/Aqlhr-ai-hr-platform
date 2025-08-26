import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Clock, Users, Calendar, TrendingUp, CheckCircle, XCircle, AlertTriangle,
  Download, Filter, Search, Brain, Zap, Target, Activity, Award,
  Shield, MapPin, Timer, BarChart3, ArrowUp, ArrowDown, Eye,
  MessageCircle, Bell, Smartphone, Wifi, Battery, Signal
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';
import { ModuleDocumentUploader } from '@/components/universal';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AttendancePage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  // AI-Enhanced Attendance Intelligence System
  const [aiInsights, setAIInsights] = useState({
    attendancePrediction: {
      tomorrowAttendance: 94.2,
      weekTrend: 'increasing',
      riskEmployees: 23,
      predictedAbsentees: ['EMP004', 'EMP007', 'EMP019'],
    },
    productivityAnalytics: {
      peakHours: '10:00-12:00',
      lowProductivityTime: '14:00-16:00',
      averageProductivity: 87.3,
      optimizationPotential: 15.2,
    },
    behaviorAnalytics: {
      punctualityTrend: 'improving',
      averageArrivalTime: '08:12',
      latePatterns: {
        monday: 12,
        tuesday: 8,
        wednesday: 15,
        thursday: 6,
        friday: 4,
      },
      overtimeUtilization: 68.5,
    },
    realTimeMonitoring: {
      activeDevices: 2847,
      locationCompliance: 98.7,
      biometricAccuracy: 99.2,
      systemHealth: 95.8,
    },
    complianceTracking: {
      laborLawCompliance: 97.8,
      saudiLaborLawAlignment: 99.1,
      overtimeCompliance: 94.5,
      breakTimeCompliance: 91.2,
    }
  });

  // Enhanced attendance statistics with AI predictions
  const enhancedAttendanceStats = [
    {
      label: isArabic ? 'الحضور المتوقع غداً' : 'Predicted Tomorrow',
      value: `${aiInsights.attendancePrediction.tomorrowAttendance}%`,
      trend: '+2.3%',
      icon: Brain,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/5'
    },
    {
      label: isArabic ? 'درجة الذكاء الاصطناعي' : 'AI Intelligence Score',
      value: `${aiInsights.productivityAnalytics.averageProductivity}%`,
      trend: '+5.1%',
      icon: Zap,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5'
    },
    {
      label: isArabic ? 'موظفون معرضون للخطر' : 'At-Risk Employees',
      value: `${aiInsights.attendancePrediction.riskEmployees}`,
      trend: '-12%',
      icon: Shield,
      color: 'text-orange-600',
      bgGradient: 'from-orange-500/10 to-orange-600/5'
    },
    {
      label: isArabic ? 'إمكانية التحسين' : 'Optimization Potential',
      value: `${aiInsights.productivityAnalytics.optimizationPotential}%`,
      trend: '+8.7%',
      icon: Target,
      color: 'text-green-600',
      bgGradient: 'from-green-500/10 to-green-600/5'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Clock className="h-10 w-10 text-primary" />
              <Brain className="absolute -top-1 -right-1 h-5 w-5 text-purple-600 bg-white rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {isArabic ? 'الذكاء الاصطناعي للحضور' : 'AI Attendance Intelligence'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {isArabic 
                  ? 'نظام ذكي متقدم لتحليل الحضور والتنبؤ بأنماط العمل'
                  : 'Advanced intelligent system for attendance analysis and workforce pattern prediction'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {enhancedAttendanceStats.map((stat, index) => (
          <Card key={index} className={`border-l-4 border-l-primary bg-gradient-to-br ${stat.bgGradient} hover:shadow-lg transition-all duration-300`}>
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
                    <Badge variant="secondary" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.bgGradient}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-Time AI Monitoring */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            {isArabic ? 'المراقبة الفورية بالذكاء الاصطناعي' : 'Real-Time AI Monitoring'}
          </CardTitle>
          <CardDescription>
            {isArabic ? 'مراقبة مباشرة وذكية للحضور مع التنبؤات الآنية' : 'Live intelligent attendance monitoring with instant predictions'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{isArabic ? 'الأجهزة النشطة' : 'Active Devices'}</span>
                <Badge variant="default" className="gap-1">
                  <Smartphone className="h-3 w-3" />
                  {aiInsights.realTimeMonitoring.activeDevices}
                </Badge>
              </div>
              <Progress value={98} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <ModuleDocumentUploader moduleKey="attendance" />
      <AqlHRAIAssistant moduleContext="attendance.management" />
      
      {/* AI Integration for Attendance */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="attendance-management" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'hr-processes', 'predictive-analytics', 'real-time-insights']}
      />
    </div>
  );
};

export default AttendancePage;