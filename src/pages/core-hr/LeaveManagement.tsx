import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Users, TrendingUp, 
  Brain, Zap, Target, Shield, Award, Timer, BarChart3, ArrowUp, ArrowDown,
  Eye, Edit, MoreVertical, Download, Bell, MessageCircle, Briefcase,
  MapPin, Activity, Heart, Smartphone, Wifi, Battery, Signal, Plane,
  FileText, ClipboardCheck, UserCheck, AlertCircle, Star
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { AqlHRAIAssistant } from '@/components/ai';
import { ModuleDocumentUploader } from '@/components/universal';

const LeaveManagement = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  // AI-Enhanced Leave Intelligence System
  const [aiInsights, setAIInsights] = useState({
    leaveAnalytics: {
      predictedLeaveRequests: 47,
      peakLeaveSeasons: ['July-August', 'December', 'Ramadan'],
      averageApprovalTime: 2.3,
      autoApprovalRate: 78.5,
      complianceScore: 96.7,
    },
    patternRecognition: {
      abnormalPatterns: 3,
      seasonalTrends: 'summer_peak',
      emergencyLeaveSpikes: 12,
      weekendExtensions: 23,
      suspiciousRequests: 2,
    },
    workforceImpact: {
      criticalDepartments: ['Engineering', 'Operations'],
      staffingRisk: 'medium',
      productivityImpact: 15.2,
      coverageOptimization: 82.1,
    },
    smartRecommendations: {
      optimalLeaveDates: ['Mon-Wed', 'Thu-Fri'],
      workloadDistribution: 'balanced',
      teamCoverage: 94.3,
      policyOptimizations: 5,
    },
    complianceMonitoring: {
      saudiLaborLaw: 98.9,
      policyViolations: 1,
      overtimeCompliance: 92.4,
      medicalLeaveCompliance: 97.8,
    },
    realTimeAlerts: {
      urgentApprovals: 3,
      policyViolations: 1,
      criticalCoverage: 2,
      systemHealth: 99.2,
    }
  });

  // Enhanced leave statistics with AI predictions
  const enhancedLeaveStats = [
    {
      label: language === 'ar' ? 'الموافقات التلقائية اليوم' : 'Auto-Approved Today',
      value: '18',
      percentage: '78.3%',
      trend: '+12%',
      icon: Brain,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/5'
    },
    {
      label: language === 'ar' ? 'تحليل أنماط الذكاء الاصطناعي' : 'AI Pattern Analysis',
      value: `${aiInsights.patternRecognition.abnormalPatterns}`,
      percentage: '94.2%',
      trend: '-8%',
      icon: Activity,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5'
    },
    {
      label: language === 'ar' ? 'التأثير على القوى العاملة' : 'Workforce Impact Score',
      value: `${aiInsights.workforceImpact.productivityImpact}%`,
      percentage: '82.1%',
      trend: '-3%',
      icon: Target,
      color: 'text-orange-600',
      bgGradient: 'from-orange-500/10 to-orange-600/5'
    },
    {
      label: language === 'ar' ? 'درجة الامتثال الذكية' : 'Smart Compliance Score',
      value: `${aiInsights.complianceMonitoring.saudiLaborLaw}%`,
      percentage: '99.1%',
      trend: '+2%',
      icon: Shield,
      color: 'text-green-600',
      bgGradient: 'from-green-500/10 to-green-600/5'
    }
  ];

  // AI-powered leave recommendations
  const aiLeaveRecommendations = [
    {
      type: 'auto_approval',
      title: language === 'ar' ? 'الموافقة التلقائية الذكية' : 'Smart Auto-Approval',
      description: language === 'ar' 
        ? 'يمكن للذكاء الاصطناعي الموافقة تلقائياً على 78% من الطلبات بناءً على التحليل المتقدم'
        : 'AI can auto-approve 78% of requests based on advanced pattern analysis',
      impact: 'High',
      confidence: 94,
      icon: Zap,
    },
    {
      type: 'coverage_optimization',
      title: language === 'ar' ? 'تحسين التغطية' : 'Coverage Optimization',
      description: language === 'ar' 
        ? 'إعادة توزيع الإجازات لضمان 94% تغطية فريقية مع الحفاظ على الإنتاجية'
        : 'Redistribute leaves to ensure 94% team coverage while maintaining productivity',
      impact: 'Medium',
      confidence: 87,
      icon: Users,
    },
    {
      type: 'policy_enhancement',
      title: language === 'ar' ? 'تحسين السياسات' : 'Policy Enhancement',
      description: language === 'ar' 
        ? '5 تحسينات مقترحة للسياسات لزيادة الكفاءة وتقليل الانتهاكات'
        : '5 policy improvements suggested to increase efficiency and reduce violations',
      impact: 'High',
      confidence: 91,
      icon: FileText,
    }
  ];

  // Pending leave requests with AI prioritization
  const pendingRequests = [
    {
      id: 'LR001',
      employee: language === 'ar' ? 'أحمد محمد السالم' : 'Ahmed Mohamed Al-Salem',
      department: language === 'ar' ? 'الهندسة' : 'Engineering',
      leaveType: language === 'ar' ? 'إجازة سنوية' : 'Annual Leave',
      dates: '15-20 Jan 2025',
      days: 6,
      aiScore: 95,
      recommendation: 'auto_approve',
      urgency: 'low',
      impact: 'minimal'
    },
    {
      id: 'LR002', 
      employee: language === 'ar' ? 'فاطمة عبدالله النهدي' : 'Fatima Abdullah Al-Nahdi',
      department: language === 'ar' ? 'العمليات' : 'Operations',
      leaveType: language === 'ar' ? 'إجازة مرضية' : 'Sick Leave',
      dates: '8-12 Jan 2025',
      days: 5,
      aiScore: 88,
      recommendation: 'manual_review',
      urgency: 'high',
      impact: 'medium'
    },
    {
      id: 'LR003',
      employee: language === 'ar' ? 'محمد علي القحطاني' : 'Mohammed Ali Al-Qahtani',
      department: language === 'ar' ? 'المالية' : 'Finance',
      leaveType: language === 'ar' ? 'إجازة طارئة' : 'Emergency Leave',
      dates: '10 Jan 2025',
      days: 1,
      aiScore: 76,
      recommendation: 'conditional_approve',
      urgency: 'medium',
      impact: 'low'
    }
  ];

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'auto_approve':
        return { variant: 'default' as const, label: language === 'ar' ? 'موافقة تلقائية' : 'Auto Approve', color: 'bg-green-500' };
      case 'manual_review':
        return { variant: 'secondary' as const, label: language === 'ar' ? 'مراجعة يدوية' : 'Manual Review', color: 'bg-orange-500' };
      case 'conditional_approve':
        return { variant: 'outline' as const, label: language === 'ar' ? 'موافقة مشروطة' : 'Conditional', color: 'bg-blue-500' };
      default:
        return { variant: 'outline' as const, label: recommendation, color: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="h-10 w-10 text-primary" />
              <Brain className="absolute -top-1 -right-1 h-5 w-5 text-purple-600 bg-white rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'الذكاء الاصطناعي للإجازات' : 'AI Leave Intelligence'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === 'ar' 
                  ? 'نظام ذكي متقدم لإدارة الإجازات والتنبؤ بالأنماط والامتثال التلقائي'
                  : 'Advanced intelligent leave management with pattern prediction and automated compliance'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span>AI Confidence: {aiInsights.leaveAnalytics.autoApprovalRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Compliance: {aiInsights.complianceMonitoring.saudiLaborLaw}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span>Coverage: {aiInsights.smartRecommendations.teamCoverage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-emerald-500" />
              <span>Avg Approval: {aiInsights.leaveAnalytics.averageApprovalTime}hrs</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Brain className="h-4 w-4" />
            {language === 'ar' ? 'تحليل الذكاء الاصطناعي' : 'AI Analytics'}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-emerald-600">
            <Zap className="h-4 w-4" />
            {language === 'ar' ? 'تحسين تلقائي' : 'Auto Optimize'}
          </Button>
        </div>
      </div>

      {/* AI-Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {enhancedLeaveStats.map((stat, index) => (
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

      {/* AI Insights and Smart Management */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Smart Approval Engine */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              {language === 'ar' ? 'محرك الموافقة الذكي' : 'Smart Approval Engine'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'موافقة تلقائية ذكية مع تحليل الأنماط المتقدم' : 'Intelligent auto-approval with advanced pattern analysis'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((request, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{request.employee}</span>
                        <Badge variant="outline" className="text-xs">{request.id}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{request.department} • {request.leaveType}</div>
                      <div className="text-xs text-muted-foreground">{request.dates} ({request.days} days)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge {...getRecommendationBadge(request.recommendation)} className="text-xs" />
                      <Badge variant="secondary" className="text-xs">AI: {request.aiScore}%</Badge>
                    </div>
                  </div>
                  <Progress value={request.aiScore} className="h-1 mb-2" />
                  <div className="flex gap-2">
                    <Button size="sm" variant={request.recommendation === 'auto_approve' ? 'default' : 'outline'}>
                      {language === 'ar' ? 'موافقة' : 'Approve'}
                    </Button>
                    <Button size="sm" variant="outline">
                      {language === 'ar' ? 'مراجعة' : 'Review'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workforce Impact Analysis */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              {language === 'ar' ? 'تحليل تأثير القوى العاملة' : 'Workforce Impact Analysis'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'تحليل ذكي لتأثير الإجازات على الإنتاجية والتغطية' : 'Smart analysis of leave impact on productivity and coverage'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'التغطية الفريقية' : 'Team Coverage'}</span>
                </div>
                <Badge variant="default">{aiInsights.smartRecommendations.teamCoverage}%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'الأقسام الحرجة' : 'Critical Departments'}</span>
                </div>
                <Badge variant="secondary">{aiInsights.workforceImpact.criticalDepartments.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'تحسين التغطية' : 'Coverage Optimization'}</span>
                </div>
                <Badge variant="default">{aiInsights.workforceImpact.coverageOptimization}%</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">{language === 'ar' ? 'الأقسام الحرجة' : 'Critical Departments'}</h4>
              <div className="space-y-2">
                {aiInsights.workforceImpact.criticalDepartments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{dept}</span>
                    <Badge variant="destructive" className="text-xs">High Impact</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Compliance Monitoring */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              {language === 'ar' ? 'مراقبة الامتثال الذكية' : 'Smart Compliance Monitoring'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'مراقبة تلقائية للامتثال لقوانين العمل السعودية' : 'Automated Saudi labor law compliance monitoring'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{language === 'ar' ? 'قانون العمل السعودي' : 'Saudi Labor Law'}</span>
                  <Badge variant="default">{aiInsights.complianceMonitoring.saudiLaborLaw}%</Badge>
                </div>
                <Progress value={aiInsights.complianceMonitoring.saudiLaborLaw} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{language === 'ar' ? 'الإجازات المرضية' : 'Medical Leave Compliance'}</span>
                  <Badge variant="default">{aiInsights.complianceMonitoring.medicalLeaveCompliance}%</Badge>
                </div>
                <Progress value={aiInsights.complianceMonitoring.medicalLeaveCompliance} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{language === 'ar' ? 'انتهاكات السياسة' : 'Policy Violations'}</span>
                  <Badge variant={aiInsights.complianceMonitoring.policyViolations > 0 ? 'destructive' : 'default'}>
                    {aiInsights.complianceMonitoring.policyViolations}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Engine */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              {language === 'ar' ? 'محرك التوصيات الذكية' : 'AI Recommendations Engine'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? 'توصيات مدعومة بالذكاء الاصطناعي لتحسين إدارة الإجازات' : 'AI-powered recommendations for leave management optimization'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiLeaveRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <rec.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{rec.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rec.impact === 'High' ? 'default' : 'secondary'} className="text-xs">
                        {rec.impact}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}%
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                  <Progress value={rec.confidence} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ModuleDocumentUploader moduleKey="leave-management" />
      <AqlHRAIAssistant moduleContext="leave.management" />
    </div>
  );
};

export default LeaveManagement;